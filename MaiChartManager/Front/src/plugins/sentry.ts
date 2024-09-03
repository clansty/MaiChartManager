import { App } from "vue";
import * as Sentry from "@sentry/vue";

export default {
  install(app: App) {
    Sentry.init({
      app,
      dsn: "https://4d3f40f67b2fd6f7df16b7f5a8320088@sentry.c5y.moe/2",
      environment: import.meta.env.DEV ? "development" : "production",
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
        Sentry.browserProfilingIntegration(),
      ],
      // Tracing
      tracesSampleRate: 1.0, //  Capture 100% of the transactions
      // Session Replay
      replaysSessionSampleRate: 0.5, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
      replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
      // Profiling
      profilesSampleRate: 1.0, // Profile 100% of the transactions. This value is relative to tracesSampleRate
    })
  },
};
