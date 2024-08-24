import {defineConfig} from 'vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import UnoCSS from 'unocss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vueJsx(),
    UnoCSS(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    outDir: '../wwwroot',
    emptyOutDir: true
  },
  server: {
    proxy: {
      '/MaiChartManagerServlet': 'http://localhost:5181'
    }
  }
});
