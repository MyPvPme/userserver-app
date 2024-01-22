import * as Sentry from "@sentry/vue";
import { CaptureConsole as CaptureConsoleIntegration } from "@sentry/integrations";
import packageJson from "../../package.json";
import { boot } from "quasar/wrappers";
import { useConfigStore } from "src/stores/configStore";

export default boot(({ app, router }) => {
  const configStore = useConfigStore();

  Sentry.init({
    app,
    dsn: configStore.getConfig().SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      }),
      new CaptureConsoleIntegration({
        levels: ["warn", "error"],
      }),
      new Sentry.Replay({
        networkCaptureBodies: true,
        networkDetailAllowUrls: [configStore.getConfig().API_URL],
      }),
    ],
    tracesSampleRate: 0.2,
    replaysSessionSampleRate: +(
      configStore.getConfig().SENTRY_REPLAYS_SESSION_SAMPLE_RATE ?? 1.0
    ),
    replaysOnErrorSampleRate: +(
      configStore.getConfig().SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE ?? 1.0
    ),
    release: packageJson.version,
  });
});
