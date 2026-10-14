import { defineComponent, type PropType } from 'vue';
import { Select, CheckBox } from '@munet/ui';
import { KeyCodeID } from '../../types/KeyCodeID';
import type { ConfigSection, EntryState, SectionState } from '../../types';
import { ConfigEntry } from '../../components/ConfigEntry';
import { useI18n } from 'vue-i18n';
import { ENTRY_GROUP_PADDING, ENTRY_LABEL_CLASS } from '../../constants';

const options = Object.entries(KeyCodeID).map(([key, value]) => ({label: key, value}))

export default defineComponent({
  props: {
    section: { type: Object as PropType<ConfigSection>, required: true },
    entryStates: {type: Object as PropType<Record<string, EntryState>>, required: true},
    sectionState: {type: Object as PropType<SectionState>, required: true},
  },
  setup(props) {
    const { t } = useI18n();
    const knownPaths = [
      ...new Array(8).fill(0).flatMap((_, i) => [`GameSystem.KeyMap.Button${i + 1}_1P`, `GameSystem.KeyMap.Button${i + 1}_2P`]),
      'GameSystem.KeyMap.Select_1P', 'GameSystem.KeyMap.Select_2P',
      'GameSystem.KeyMap.Test', 'GameSystem.KeyMap.Service',
      'GameSystem.KeyMap.DisableIO4_1P', 'GameSystem.KeyMap.DisableIO4_2P', 'GameSystem.KeyMap.DisableIO4System',
    ];

    return () => <div class="flex flex-col gap-2">
      <div class="grid grid-cols-1 min-[500px]:grid-cols-2 gap-y-12px">
        <div class={["flex flex-col gap-2", ENTRY_GROUP_PADDING]}>
          {
            new Array(8).fill(0).map((_, i) => <div key={i} class="flex gap-2 items-start">
              <div class={ENTRY_LABEL_CLASS}>{t('mod.keyMap.button1P', {index: i + 1})}</div>
              <Select v-model:value={props.entryStates[`GameSystem.KeyMap.Button${i + 1}_1P`]!.value} options={options}/>
            </div>)
          }
          <div class="flex gap-2 items-start">
            <div class={ENTRY_LABEL_CLASS}>{t('mod.keyMap.select1P')}</div>
            <Select v-model:value={props.entryStates['GameSystem.KeyMap.Select_1P']!.value} options={options}/>
          </div>
          <div class="flex gap-2 items-start">
            <div class={ENTRY_LABEL_CLASS}>Test</div>
            <Select v-model:value={props.entryStates['GameSystem.KeyMap.Test']!.value} options={options}/>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          {
            new Array(8).fill(0).map((_, i) => <div key={i} class="flex gap-2 items-start">
              <div class={ENTRY_LABEL_CLASS}>{t('mod.keyMap.button2P', {index: i + 1})}</div>
              <Select v-model:value={props.entryStates[`GameSystem.KeyMap.Button${i + 1}_2P`]!.value} options={options}/>
            </div>)
          }
          <div class="flex gap-2 items-start">
            <div class={ENTRY_LABEL_CLASS}>{t('mod.keyMap.select2P')}</div>
            <Select v-model:value={props.entryStates['GameSystem.KeyMap.Select_2P']!.value} options={options}/>
          </div>
          <div class="flex gap-2 items-start">
            <div class={ENTRY_LABEL_CLASS}>Service</div>
            <Select v-model:value={props.entryStates['GameSystem.KeyMap.Service']!.value} options={options}/>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-2 p-l-15">
        {props.section.entries?.some(it=>it.path === 'GameSystem.KeyMap.DisableIO4_1P') &&
          <div class="flex gap-2 items-start">
            <div class={ENTRY_LABEL_CLASS}>{t('mod.keyMap.disableIO4')}</div>
            <div class="flex flex-col gap-2 w-full ws-pre-line">
              <div class='flex gap-4 h-42px items-center'>
                  <CheckBox v-model:value={props.entryStates['GameSystem.KeyMap.DisableIO4_1P']!.value}>{props.entryStates['GameSystem.KeyMap.DisableIO4_1P']!.value ? t('mod.keyMap.disable1P') : t('mod.keyMap.enable1P')}</CheckBox>
                  <CheckBox v-model:value={props.entryStates['GameSystem.KeyMap.DisableIO4_2P']!.value}>{props.entryStates['GameSystem.KeyMap.DisableIO4_2P']!.value ? t('mod.keyMap.disable2P') : t('mod.keyMap.enable2P')}</CheckBox>
                  <CheckBox v-model:value={props.entryStates['GameSystem.KeyMap.DisableIO4System']!.value}>{props.entryStates['GameSystem.KeyMap.DisableIO4System']!.value ? t('mod.keyMap.disableSystem') : t('mod.keyMap.enableSystem')}</CheckBox>
              </div>
              <div class="text-sm op-80">{t('mod.keyMap.disableIO4Tip')}</div>
            </div>
          </div>}
        {props.section.entries?.filter(it => !knownPaths.includes(it.path!))
          .map((entry) => {
            const state = props.entryStates[entry.path];
            return state ? <ConfigEntry key={entry.path} entry={entry} entryState={state} /> : null;
          })}
      </div>
    </div>;
  }
})
