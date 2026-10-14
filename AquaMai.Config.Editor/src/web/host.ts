export interface AquaMaiHostDll {
  readonly base64: string;
  readonly version: string;
}

export interface AquaMaiHostToml {
  readonly name: string;
  readonly content: string;
}

export interface AquaMaiEditorHost {
  readonly loadDll: () => Promise<AquaMaiHostDll>;
  readonly loadToml: () => Promise<AquaMaiHostToml | null>;
  /** 不实现的话，保存由页面自己走 File System Access API（不支持时下载），
   * 页面关闭时的未保存提示也由页面自己拦 */
  readonly saveToml?: (content: string) => Promise<void>;
  readonly notifyDirty: (dirty: boolean) => void;
  /** 配置内核（AquaMai.dll）可用性变化时回调。藏了工具栏的宿主要靠它决定自己那两个按钮
   * 什么时候能用——内核没就绪时打开文件也解析不了（页面此时会给出提示而不是静默丢弃） */
  readonly notifyReady?: (ready: boolean) => void;
  readonly locale?: string;
  /** 宿主自己画了工具栏（标题、打开、保存、状态）时打开：页面顶部那一条整个不渲染，
   * 配置区域直接顶到最上面。打开和保存改由宿主调 window.aquaMaiEditor */
  readonly hideToolbar?: boolean;
}

/** 页面挂载后挂到 window 上的动作，给藏了页面顶栏的宿主驱动打开 / 保存用 */
export interface AquaMaiEditorCommands {
  readonly openToml: () => Promise<void>;
  readonly openDll: () => void;
  /** 返回是否真的保存成功（比如保存对话框被取消、序列化报错都算失败），
   * 失败原因在页面的错误条里 */
  readonly save: () => Promise<boolean>;
}

declare global {
  interface Window {
    readonly aquaMaiEditorHost?: AquaMaiEditorHost;
    aquaMaiEditor?: AquaMaiEditorCommands;
  }
}

export const getEditorHost = (): AquaMaiEditorHost | undefined =>
  globalThis.window?.aquaMaiEditorHost;

export const base64ToArrayBuffer = (value: string): ArrayBuffer => {
  const binary = atob(value);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes.buffer;
};
