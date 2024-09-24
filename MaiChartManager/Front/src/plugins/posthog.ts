import posthog from "posthog-js";
import { App } from "vue";

export default {
  install(app: App) {
    if (import.meta.env.DEV) return
    app.config.globalProperties.$posthog = posthog.init(
      'phc_yeRsAPdtkUN3ID3Dkf0fdrLIrUsw0uK7W4DiRtouGtb',
      {
        api_host: 'https://eu.i.posthog.com',
      }
    );
  },
};
