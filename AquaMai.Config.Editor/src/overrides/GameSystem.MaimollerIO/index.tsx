import { CheckBox } from '@munet/ui';
import { defineComponent, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { ENTRY_GROUP_PADDING, ENTRY_LABEL_CLASS } from '../../constants';
import { ConfigEntry } from '../../components/ConfigEntry';
import type { ConfigSection, EntryState, SectionState } from '../../types';

const PREFIX = 'GameSystem.MaimollerIO.';

// 1P 在左、2P 在右只是排版，不需要宿主能力，所以放在这一层让独立编辑器也用上。
// MCM 那边另有一层 top 面板挂依赖库状态（一键安装），见它的 sectionPanelOverride/
const pathsLeft = [
  'Button1', 'Button2',
  'P1Button1', 'P1Button2', 'P1Button3', 'P1Button4',
].map((it) => PREFIX + it);

const pathsRight = [
  'Button3', 'Button4',
  'P2Button1', 'P2Button2', 'P2Button3', 'P2Button4',
].map((it) => PREFIX + it);

const knownPaths = [
  ...['P1', 'Touch1p', 'Button1p', 'Led1p', 'P2', 'Touch2p', 'Button2p', 'Led2p']
    .map((it) => PREFIX + it),
  ...pathsLeft, ...pathsRight,
];

export default defineComponent({
  props: {
    section: { type: Object as PropType<ConfigSection>, required: true },
    entryStates: { type: Object as PropType<Record<string, EntryState>>, required: true },
    sectionState: { type: Object as PropType<SectionState>, required: true },
  },
  setup(props) {
    const { t } = useI18n();
    const has = (path: string) => props.section.entries.some((entry) => entry.path === path);

    // 触屏 / 按键 / 灯光三个开关挤在一行，所以标签按前缀（Touch / Button / Led）取
    const renderSideGroup = (suffix: '1p' | '2p') => (
      <div class="flex gap-2 items-start">
        <div class={ENTRY_LABEL_CLASS}>{suffix === '1p' ? '1P' : '2P'}</div>
        <div class="flex gap-4 h-42px items-center">
          {(['Touch', 'Button', 'Led'] as const).map((group) => {
            const path = `${PREFIX}${group}${suffix}`;
            return (
              <CheckBox v-model:value={props.entryStates[path]!.value}>
                {props.entryStates[path]!.value ? t('mod.enable') : t('mod.disable')}
                {t(`mod.mmlIo.${group}`)}
              </CheckBox>
            );
          })}
        </div>
      </div>
    );

    const renderSideToggle = (side: '1P' | '2P') => {
      const path = PREFIX + side;
      return (
        <div class="flex gap-2 items-start">
          <div class={ENTRY_LABEL_CLASS}>{t('mod.mmlIo.' + side)}</div>
          <div class="flex h-42px items-center">
            <CheckBox v-model:value={props.entryStates[path]!.value}>
              {props.entryStates[path]!.value ? t('mod.on') : t('mod.off')}
            </CheckBox>
          </div>
        </div>
      );
    };

    const renderEntries = (include: (path: string) => boolean) =>
      props.section.entries
        .filter((entry) => include(entry.path))
        .map((entry) => {
          const state = props.entryStates[entry.path];
          return state ? <ConfigEntry key={entry.path} entry={entry} entryState={state} /> : null;
        });

    return () => (
      <div class={['flex flex-col gap-2', ENTRY_GROUP_PADDING]}>
        <div class="m-l-35 op-80">{t('mod.mmlIo.tip')}</div>
        <div class="grid grid-cols-1 min-[1300px]:grid-cols-2 gap-y-12px">
          <div class="flex flex-col gap-2">
            {has(PREFIX + 'P1') && renderSideToggle('1P')}
            {has(PREFIX + 'Touch1p') && renderSideGroup('1p')}
            {renderEntries((path) => pathsLeft.includes(path))}
          </div>
          <div class="flex flex-col gap-2">
            {has(PREFIX + 'P2') && renderSideToggle('2P')}
            {has(PREFIX + 'Touch2p') && renderSideGroup('2p')}
            {renderEntries((path) => pathsRight.includes(path))}
          </div>
        </div>
        {renderEntries((path) => !knownPaths.includes(path))}
      </div>
    );
  },
});
