import type { Component } from 'vue';
import type { SectionPanelOverride, SectionPanelPosition } from '@aquamai/config-editor';

// MCM 专属的分区面板层：这些面板要读游戏目录里的文件、驱动状态，或者装东西，
// 只有 MCM 提供得了。编辑器自带的面板（键位、音量路由、解锁等纯配置项的）仍在
// @aquamai/config-editor 里，ConfigSection 在这一层没命中时会回退过去。
//
// 按目录约定用 glob 取（面板放在 sectionPanelOverride/<分区 path>/index.tsx），
// 摆放位置也写在面板自己那个模块里（export const panelPosition = 'top' / 'bottom'）。
// 不手写映射表：漏登记一个面板只会静默回退到编辑器那份，很难发现
const sectionPanelOverrides = import.meta.glob('./*/index.tsx', { eager: true }) as Record<
  string,
  { readonly default?: Component; readonly panelPosition?: SectionPanelPosition }
>;

export const getMcmSectionPanelOverride = (path: string): SectionPanelOverride | undefined => {
  const module = sectionPanelOverrides[`./${path}/index.tsx`];
  return module?.default ? { component: module.default, position: module.panelPosition } : undefined;
};
