/// <reference types="vite/client" />

declare module '*wwwroot/_framework/dotnet' {
  export type AssetBehaviors = string;

  export interface DotnetRuntime {
    readonly getConfig: () => { readonly mainAssemblyName?: string };
    readonly getAssemblyExports: (assemblyName: string) => Promise<unknown>;
  }

  export interface DotnetModule {
    readonly withResourceLoader: (
      callback: (
        type: string,
        name: string,
        defaultUri: string,
        integrity: string,
        behavior: AssetBehaviors,
      ) => string | Promise<Response>,
    ) => DotnetModule;
    readonly create: () => Promise<DotnetRuntime>;
  }

  export const dotnet: DotnetModule;
}

// blazor.boot.json 和 dotnet.js 一样来自 AquaMai.Config.Wasm 的 publish 产物。CI 的 typecheck
// 不发布 WASM（只有 build.yml 里那个编辑器任务会 publish），产物缺席时 tsc 会直接报 TS2307，
// 所以这两样都在这里声明兜底模块。清单内容只是原样交给 Response.json，不需要精确类型
declare module '*wwwroot/_framework/blazor.boot.json' {
  const bootConfig: unknown;
  export default bootConfig;
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

// @fontsource 只提供 CSS，没有类型声明
declare module '@fontsource/*';
