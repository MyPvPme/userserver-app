import { LocalStorage } from "quasar";
import {
  createConfiguration,
  ServerConfiguration,
  Configuration,
} from "@mypvp/userserver-api-client-browser";
import * as oauth2 from "oauth4webapi";
import { mypvpConfig, oauthClient } from "boot/oauth";
import { boot } from "quasar/wrappers";
import { OAuth2Error, TokenEndpointResponse } from "oauth4webapi";
import { useConfigStore } from "src/stores/configStore";

let apiConfig: Configuration;

let isRequestingNewToken = false;
let notifyOnNewRefreshToken: ((token: string) => void)[] = [];

export default boot(({ app }) => {
  const configStore = useConfigStore();

  apiConfig = createConfiguration({
    baseServer: new ServerConfiguration(configStore.getConfig().API_URL, {}),
    authMethods: {
      bearer: {
        tokenProvider: {
          getToken: () => getToken(),
        },
      },
    },
  });

  app.config.globalProperties.$userserver_api_config = apiConfig;
});

async function getToken(): Promise<string> {
  const apiKey = LocalStorage.getItem<string>("api_key");

  if (apiKey) {
    return apiKey;
  }

  const oauthAccessToken = LocalStorage.getItem<string>("oauth_access_token");

  if (oauthAccessToken) {
    const tokenPayloadBase64 = oauthAccessToken.split(".")[1];
    if (tokenPayloadBase64) {
      const tokenPayload = JSON.parse(atob(tokenPayloadBase64)) as {
        exp: number;
      };

      if (new Date(tokenPayload.exp * 1000) > new Date()) {
        return oauthAccessToken;
      }
    }
  }

  const oauthRefreshToken = LocalStorage.getItem<string>("oauth_refresh_token");

  if (oauthRefreshToken) {
    if (isRequestingNewToken) {
      return new Promise<string>((resolve, reject) => {
        const timeOut = setTimeout(() => {
          reject("Timeout");
        });

        notifyOnNewRefreshToken.push((token) => {
          clearTimeout(timeOut);
          resolve(token);
        });
      });
    }

    isRequestingNewToken = true;

    let response;

    try {
      response = await oauth2.refreshTokenGrantRequest(
        mypvpConfig,
        oauthClient,
        oauthRefreshToken
      );
    } catch (e) {
      LocalStorage.remove("oauth_refresh_token");
      isRequestingNewToken = false;
      void new Promise(() => {
        notifyOnNewRefreshToken.forEach((value) => value(""));
      });
      throw new Error();
    }

    try {
      const tokenResponse = await oauth2.processRefreshTokenResponse(
        mypvpConfig,
        oauthClient,
        response
      );

      if (isOAuth2Error(tokenResponse)) {
        return "";
      }

      if (tokenResponse.id_token === undefined) {
        return "";
      }

      LocalStorage.set("oauth_refresh_token", tokenResponse.refresh_token);

      LocalStorage.set("oauth_access_token", tokenResponse.id_token);

      isRequestingNewToken = false;
      void new Promise(() => {
        notifyOnNewRefreshToken.forEach((value) =>
          value(tokenResponse.id_token ?? "")
        );
        notifyOnNewRefreshToken = [];
      });
      return tokenResponse.id_token;
    } catch (e) {
      LocalStorage.remove("oauth_refresh_token");
      isRequestingNewToken = false;
      void new Promise(() => {
        notifyOnNewRefreshToken.forEach((value) => value(""));
        notifyOnNewRefreshToken = [];
      });
      throw new Error();
    }
  }

  return "";
}

function isOAuth2Error(
  error: OAuth2Error | TokenEndpointResponse
): error is OAuth2Error {
  return "error" in error;
}

export { apiConfig, getToken };
