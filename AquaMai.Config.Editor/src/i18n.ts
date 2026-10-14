import zh from './locales/zh.yaml';
import zhTW from './locales/zh-TW.yaml';
import en from './locales/en.yaml';

export interface AquaMaiEditorMessages {
  readonly mod: Record<string, any>;
  // vue-i18n 的 LocaleMessage 要求有 string 索引签名，这里跟着它走
  readonly [key: string]: any;
}

/** 配置编辑器界面的文案。编辑器自己渲染的 mod.* 全在这三份 yaml 里（src/locales/），
 * 宿主把它并进自己的 messages 用，不要再抄一份。见 mergeEditorMessages。
 *
 * 这里的 cast 是因为 vite 的 yaml 插件给 `*.yaml` 的类型是 unknown（见 src/yaml.d.ts） */
export const aquaMaiEditorMessages = {
  zh,
  'zh-TW': zhTW,
  en,
} as unknown as Record<string, AquaMaiEditorMessages>;

const deepMerge = (base: Record<string, any>, override: Record<string, any>): Record<string, any> => {
  const merged: Record<string, any> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const previous = merged[key];
    merged[key] = previous && value
      && typeof previous === 'object' && typeof value === 'object'
      && !Array.isArray(previous) && !Array.isArray(value)
      ? deepMerge(previous, value)
      : value;
  }
  return merged;
};

/** 把编辑器文案并进宿主的 messages，宿主的同名键优先。
 *
 * 必须递归合并：`mod.keyMap` 这样的命名空间两边的 yaml 里各有一半键，
 * 浅拷贝会让其中一半整个消失（表现是界面上直接显示 key）。
 * MCM 前端就是这么用的，见 MaiChartManager/Front/src/locales/index.ts */
export const mergeEditorMessages = <T extends Record<string, any>>(messages: T, locale: string): T => {
  const editorMessages = aquaMaiEditorMessages[locale];
  if (!editorMessages) {
    return messages;
  }
  return deepMerge(editorMessages, messages) as T;
};
