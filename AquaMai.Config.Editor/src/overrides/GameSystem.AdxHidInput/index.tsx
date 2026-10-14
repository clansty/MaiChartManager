import { defineComponent, type PropType } from 'vue';
import { ENTRY_GROUP_PADDING } from '../../constants';
import { ConfigEntry } from '../../components/ConfigEntry';
import type { ConfigSection, EntryState, SectionState } from '../../types';

const PREFIX = 'GameSystem.AdxHidInput.';

// 1P 在左、2P 在右只是排版，不需要宿主能力，所以放在这一层让独立编辑器也用上。
// MCM 那边另有一层 top 面板挂硬件状态（冲突检测 / 一键删除），见它的 sectionPanelOverride/
const pathsLeft = [
  'Button1', 'Button2',
  'P1Button1', 'P1Button2', 'P1Button3', 'P1Button4', 'P1DisableButtons',
].map((it) => PREFIX + it);

const pathsRight = [
  'Button3', 'Button4',
  'P2Button1', 'P2Button2', 'P2Button3', 'P2Button4', 'P2DisableButtons',
].map((it) => PREFIX + it);

const knownPaths = [...pathsLeft, ...pathsRight];

export default defineComponent({
  props: {
    section: { type: Object as PropType<ConfigSection>, required: true },
    entryStates: { type: Object as PropType<Record<string, EntryState>>, required: true },
    sectionState: { type: Object as PropType<SectionState>, required: true },
  },
  setup(props) {
    const renderEntries = (include: (path: string) => boolean) =>
      props.section.entries
        .filter((entry) => include(entry.path))
        .map((entry) => {
          const state = props.entryStates[entry.path];
          return state ? <ConfigEntry key={entry.path} entry={entry} entryState={state} /> : null;
        });

    return () => (
      <div class={['flex flex-col gap-2', ENTRY_GROUP_PADDING]}>
        <div class="grid grid-cols-1 min-[500px]:grid-cols-2 gap-y-12px">
          <div class="flex flex-col gap-2">{renderEntries((path) => pathsLeft.includes(path))}</div>
          <div class="flex flex-col gap-2">{renderEntries((path) => pathsRight.includes(path))}</div>
        </div>
        {renderEntries((path) => !knownPaths.includes(path))}
      </div>
    );
  },
});
