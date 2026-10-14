import { computed, defineComponent, type PropType } from 'vue';
import type { ConfigSection, EntryState, SectionState } from '../../types';
import { WhateverNaviBar } from '@munet/ui';

const WINDOW_PREFIX = 'GameSystem.Window.';

// 预设条放在配置项上方：点完预设，下面就跟着变，能直接看到填进去的宽高
export const panelPosition = 'top';

interface Preset {
  name: string;
  width: number;
  height: number;
}

const presets: Preset[] = [
  { name: '720P 1P', width: 720, height: 1280 },
  { name: '720P 2P', width: 1440, height: 1280 },
  { name: '1080P 1P', width: 1080, height: 1920 },
  { name: '1080P 2P', width: 2160, height: 1920 },
  { name: '2K 1P', width: 1440, height: 2560 },
  { name: '2K 2P', width: 2880, height: 2560 },
  { name: '4K 1P', width: 2160, height: 3840 },
  { name: '4K 2P', width: 4320, height: 3840 },
];

export default defineComponent({
  props: {
    section: { type: Object as PropType<ConfigSection>, required: true },
    entryStates: { type: Object as PropType<Record<string, EntryState>>, required: true },
    sectionState: { type: Object as PropType<SectionState>, required: true },
    allSectionStates: { type: Object as PropType<Record<string, SectionState>> },
  },
  setup(props) {
    const activePreset = computed(() => {
      for (const preset of presets) {
        const widthEntry = props.entryStates[WINDOW_PREFIX + 'Width'];
        const heightEntry = props.entryStates[WINDOW_PREFIX + 'Height'];
        if (widthEntry && heightEntry &&
            Number(widthEntry.value) === preset.width &&
            Number(heightEntry.value) === preset.height) {
          return preset.name;
        }
      }
      return null;
    });

    const applyPreset = (preset: Preset) => {
      const widthEntry = props.entryStates[WINDOW_PREFIX + 'Width'];
      const heightEntry = props.entryStates[WINDOW_PREFIX + 'Height'];
      if (widthEntry) widthEntry.value = preset.width;
      if (heightEntry) heightEntry.value = preset.height;
      props.sectionState.enabled = true;
    };

    const naviItems = computed(() => presets.map(preset => ({
      name: preset.name,
      selected: activePreset.value === preset.name,
      onClick: () => applyPreset(preset),
    })));

    // 独占全屏要 Sinmai.exe 关掉 Windows 全屏优化才有效，保存配置时后端会自己写兼容性设置
    const exclusiveFullscreen = computed(() => !!props.entryStates[WINDOW_PREFIX + 'ExclusiveFullscreen']?.value);

    return () => <div class="flex flex-col gap-2">
      <div class="pl-40 flex items-center gap-2">
        预设:
        <WhateverNaviBar items={naviItems.value}/>
      </div>
      {exclusiveFullscreen.value && <div class="pl-40 text-sm op-60">
        保存后会自动为 Sinmai.exe 关闭 Windows 的“全屏优化”（兼容性设置）
      </div>}
    </div>;
  },
});
