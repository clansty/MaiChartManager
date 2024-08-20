// uno.config.ts
import { defineConfig, presetIcons, presetTypography, presetUno } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetTypography(),
    presetIcons(),
  ],
});
