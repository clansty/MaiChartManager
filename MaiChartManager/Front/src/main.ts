import { createApp } from 'vue';
import App from './App';
import router from '@/router';
import '@unocss/reset/sanitize/sanitize.css';
import 'virtual:uno.css';
import './global.sass';

createApp(App)
  .use(router)
  .mount('#app');
