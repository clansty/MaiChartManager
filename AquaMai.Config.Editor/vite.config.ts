import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import UnoCSS from 'unocss/vite';
import ViteYaml from '@modyfi/vite-plugin-yaml';

export default defineConfig({
  // 相对 base：既能部署在域名根，也能挂在子路径下，还能被 WebView 宿主直接加载本地文件
  base: './',
  plugins: [
    vue(),
    vueJsx(),
    UnoCSS(),
    ViteYaml(),
  ],
  build: {
    target: 'es2022',
    sourcemap: true,
  },
  server: {
    port: 5190,
    fs: {
      strict: false,
    },
  },
});
