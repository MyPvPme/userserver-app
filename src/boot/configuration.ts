import { boot } from "quasar/wrappers";
import { useConfigStore } from "src/stores/configStore";
async function getConfig() {
  return await fetch("/config/config.json");
}

export default boot(async ({ app }) => {
  const configStore = useConfigStore();

  const response = await getConfig();
  const config = (await response.json()) as Config;
  app.config.globalProperties.$config = config;
  configStore.setConfig(config);
});

interface Config {
  API_URL: string;
  BASE_API_URL: string;
  API_UPLOAD_URL: string;
  API_SERVER_ICON_URL: string;
  API_SOCKET_PATH: string;
  API_SOCKET_URL: string;
  OAUTH_ISSUER: string;
  DARK_COOKIE_DOMAIN: string;
  SENTRY_DSN: string | undefined;
  SENTRY_REPLAYS_SESSION_SAMPLE_RATE: string | undefined;
  SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE: string | undefined;
}

export { getConfig, Config };
