import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import UnoCSS from 'unocss/vite';
import ViteYaml from '@modyfi/vite-plugin-yaml';

// https://vitejs.dev/config/
export default defineConfig(({command}) => ({
  plugins: [
    vueJsx(),
    UnoCSS(),
    ViteYaml(),
    sentryVitePlugin({
      org: "sentry",
      project: "maichartmanager-front",
      disable: command === 'serve',
      url: "https://sentry.c5y.moe",
    })],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    outDir: '../wwwroot',
    emptyOutDir: true,
    sourcemap: true
  },
  server: {
    proxy: {
      '/MaiChartManagerServlet': 'http://localhost:5181'
    }
  }
}));
