import { createApp } from 'vue';
import App from './App';
import '@unocss/reset/sanitize/sanitize.css';
import 'virtual:uno.css';
import './global.sass';
import posthog from "@/plugins/posthog";
import sentry from "@/plugins/sentry";

createApp(App)
  .use(posthog)
  .use(sentry)
  .mount('#app');
