import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import { AuthApi } from "@mypvp/userserver-api-client-browser";

import routes from "./routes";
import { LocalStorage, SessionStorage } from "quasar";
import { apiConfig } from "boot/api-client";
import * as oauth2 from "oauth4webapi";
import { oauthClient, mypvpConfig } from "boot/oauth";
import { useUserStore } from "src/stores/userStore";
import { useErrorHandler } from "src/utils/error-handler";
import { useServerStore } from "src/stores/serverStore";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

const createHistory = process.env.SERVER
  ? createMemoryHistory
  : process.env.VUE_ROUTER_MODE === "history"
  ? createWebHistory
  : createWebHashHistory;

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes,
  history: createHistory(
    process.env.MODE === "ssr" ? void 0 : process.env.VUE_ROUTER_BASE
  ),
});

router.beforeEach(async (to, from, next) => {
  if (to.name === "OAuthCB") {
    const url = new URL(window.location.href);
    const state = SessionStorage.getItem<string>("state");

    if (!state) {
      throw new Error();
    }

    const params = oauth2.validateAuthResponse(
      mypvpConfig,
      oauthClient,
      url,
      state
    );

    if (oauth2.isOAuth2Error(params)) {
      throw new Error(); // Handle OAuth 2.0 redirect error
    }

    const codeVerifier = SessionStorage.getItem<string>("code_verifier");

    if (!codeVerifier) {
      throw new Error();
    }

    const response = await oauth2.authorizationCodeGrantRequest(
      mypvpConfig,
      oauthClient,
      params,
      location.origin + "/auth/oauth",
      codeVerifier
    );

    let challenges;
    if ((challenges = oauth2.parseWwwAuthenticateChallenges(response))) {
      for (const challenge of challenges) {
        console.log("challenge", challenge);
      }
      throw new Error(); // Handle www-authenticate challenges as needed
    }

    const result = await oauth2.processAuthorizationCodeOpenIDResponse(
      mypvpConfig,
      oauthClient,
      response
    );
    if (oauth2.isOAuth2Error(result)) {
      console.log("error", result);
      throw new Error(); // Handle OAuth 2.0 response body error
    }

    const decodedTokenBody = JSON.parse(
      atob(result.id_token.split(".")[1])
    ) as { minecraft?: string };

    if (!decodedTokenBody.minecraft) {
      next({
        name: "MinecraftAccountIsNoConnected",
      });

      return;
    }

    LocalStorage.set("oauth_access_token", result.id_token);
    LocalStorage.set("oauth_refresh_token", result.refresh_token);

    next("/");
  } else {
    next();
  }
});

router.beforeEach(async (to, from, next) => {
  if (to.name === "TokenAuth") {
    if (!to.params.token) {
      next({ name: "NotLoggedIn" });
      return;
    }

    try {
      const { token } = await new AuthApi(apiConfig).auth({
        token: to.params.token as string,
      });
      LocalStorage.set("api_key", token);
      if (
        to.query.next &&
        typeof to.query.next === "string" &&
        router.resolve(to.query.next).name
      ) {
        next(to.query.next);
        return;
      }
      next({ name: "PrivateUserserverList" });
      return;
    } catch (e) {
      console.error(e);
      next({ name: "NotLoggedIn" });
      return;
    }
  }
  next();
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth) {
    try {
      await userStore.loadUser();
    } catch (e) {
      LocalStorage.remove("api_key");
      next({ name: "NotLoggedIn" });
      return;
    }
  }
  next();
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const { handleError } = useErrorHandler();

  userStore.loadUserservers().catch(handleError);

  next();
});

router.beforeEach((to, from, next) => {
  if (to.meta.fetchServer) {
    const serverStore = useServerStore();
    const { handleError } = useErrorHandler();

    const serverId = to.params.serverId as string;
    if (serverId) {
      if (serverStore.server?.id !== +serverId) {
        serverStore.loadServerById(serverId).catch(handleError);
      }
    }
  }
  next();
});

export default router;
