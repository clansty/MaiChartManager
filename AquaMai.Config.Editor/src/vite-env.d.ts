/// <reference types="vite/client" />

declare module '*/dotnet' {
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

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

// @fontsource 只提供 CSS，没有类型声明
declare module '@fontsource/*';
