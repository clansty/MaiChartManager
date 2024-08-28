import { App } from "vue";
import * as Sentry from "@sentry/vue";

export default {
  install(app: App) {
    Sentry.init({
      app,
      dsn: "https://74f5d24e699e0d069f69bad153c87059@o4507852801638400.ingest.de.sentry.io/4507852805374032",
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
        Sentry.browserProfilingIntegration(),
      ],
      // Tracing
      tracesSampleRate: 1.0, //  Capture 100% of the transactions
      // Session Replay
      replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
      replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
      // Profiling
      profilesSampleRate: 1.0, // Profile 100% of the transactions. This value is relative to tracesSampleRate
    })
  },
};
