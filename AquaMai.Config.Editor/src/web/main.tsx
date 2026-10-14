import '@unocss/reset/tailwind-compat.css';
import 'virtual:uno.css';
import '@fontsource/noto-sans-sc';
import '@fontsource/quicksand';
import '../style.css';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import {
  initThemeDefaults,
  selectedThemeName,
  UIThemes,
} from '@munet/ui';
import { aquaMaiEditorMessages } from '../i18n';
import { App } from './App';

initThemeDefaults({ hue: 353 });
selectedThemeName.value = UIThemes.DynamicLight;

const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages: aquaMaiEditorMessages,
});

createApp(App)
  .use(i18n)
  .mount('#app');
