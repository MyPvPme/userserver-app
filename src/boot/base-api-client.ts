import {
  createConfiguration,
  ServerConfiguration,
  Configuration,
} from "@mypvp/base-rest-client-browser";
import { boot } from "quasar/wrappers";
import { useConfigStore } from "src/stores/configStore";

let baseApiConfig: Configuration;

export default boot(({ app }) => {
  const configStore = useConfigStore();

  baseApiConfig = createConfiguration({
    baseServer: new ServerConfiguration(
      configStore.getConfig().BASE_API_URL,
      {}
    ),
  });

  app.config.globalProperties.$base_api_config = baseApiConfig;
});

export { baseApiConfig };
