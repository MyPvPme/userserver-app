import {
  AuthorizationServer,
  discoveryRequest,
  processDiscoveryResponse,
  Client,
} from "oauth4webapi";
import { boot } from "quasar/wrappers";
import { useConfigStore } from "src/stores/configStore";

let oauthClient: Client;
let mypvpConfig: AuthorizationServer;

export default boot(async () => {
  const configStore = useConfigStore();

  const issuer = new URL(configStore.getConfig().OAUTH_ISSUER);

  mypvpConfig = await discoveryRequest(issuer).then((response) =>
    processDiscoveryResponse(issuer, response)
  );

  oauthClient = {
    client_id: "panel",
    token_endpoint_auth_method: "none",
  };
});

export { oauthClient, mypvpConfig };
