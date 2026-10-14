import type { Component } from 'vue';

/** 自定义面板放哪：top / bottom 是在配置项上方 / 下方再渲染一份，override 直接顶掉配置项 */
export type SectionPanelPosition = 'top' | 'bottom' | 'override';

export interface SectionPanelOverride {
  readonly component: Component;
  /** 面板没声明就按 override 处理 */
  readonly position?: SectionPanelPosition;
}

// 面板按目录约定收录（<分区 path>/index.tsx），位置就写在面板自己那个模块里
// （export const panelPosition = 'top'）。不手写映射表：漏登记一个面板只会静默变成
// 「这个分区没有自定义面板」，很难发现
const sectionPanelOverrides = import.meta.glob('./*/index.tsx', { eager: true }) as Record<
  string,
  { readonly default?: Component; readonly panelPosition?: SectionPanelPosition }
>;

export const getSectionPanelOverride = (path: string): SectionPanelOverride | undefined => {
  const module = sectionPanelOverrides[`./${path}/index.tsx`];
  return module?.default ? { component: module.default, position: module.panelPosition } : undefined;
};
