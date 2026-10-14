// uno.config.ts
import { defineConfig, presetIcons, presetTypography, presetUno, presetAttributify, transformerDirectives, transformerVariantGroup } from 'unocss';

export default defineConfig({
  content: {
    filesystem: [
      '../../MuNET-UI/src/**/*.{ts,tsx}',
      // 编辑器的工具类常量在 .ts 里，不在 UnoCSS 默认的 transform pipeline 里，得显式扫
      '../../AquaMai.Config.Editor/src/**/*.{ts,tsx}',
    ],
  },
  presets: [
    presetUno(),
    presetTypography(),
    presetIcons(),
    presetAttributify(),
  ],
  transformers: [
    transformerDirectives({
      applyVariable: ['--at-apply'],
    }),
    transformerVariantGroup(),
  ],
});
