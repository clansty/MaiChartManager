import blazorBoot from '../../../AquaMai.Config.Wasm/bin/Release/net9.0/publish/wwwroot/_framework/blazor.boot.json';
import {
  type AssetBehaviors,
  dotnet as dotnetOrigin,
} from '../../../AquaMai.Config.Wasm/bin/Release/net9.0/publish/wwwroot/_framework/dotnet';

// 显式标注结果类型：不同 TS 版本对 import.meta.glob 重载的推断不一致
const eager = import.meta.glob(
  '../../../AquaMai.Config.Wasm/bin/Release/net9.0/publish/wwwroot/_framework/*.{wasm,dat,js}',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>;

export const dotnet = dotnetOrigin.withResourceLoader((
  type: string,
  name: string,
  _defaultUri: string,
  _integrity: string,
  _behavior: AssetBehaviors,
) => {
  if (type === 'manifest') {
    return Promise.resolve(Response.json(blazorBoot));
  }

  const url = eager[
    `../../../AquaMai.Config.Wasm/bin/Release/net9.0/publish/wwwroot/_framework/${name}`
  ];
  if (!url) {
    throw new Error(`缺少 AquaMai WASM 资源: ${name}`);
  }
  return url;
});
