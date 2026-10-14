import { computed, defineComponent, ref, type PropType } from 'vue';
import TouchSensitivityDisplay from './TouchSensitivityDisplay';
import { Button, NumberInput } from '@munet/ui';
import type { EntryState, SectionState } from '../../types';
import { useI18n } from 'vue-i18n';

const AREAS = [
  "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8",
  "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8",
  "C1", "C2",
  "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8",
  "E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8",
]
export default defineComponent({
  props: {
    entryStates: {type: Object as PropType<Record<string, EntryState>>, required: true},
    sectionState: {type: Object as PropType<SectionState>, required: true},
  },
  setup(props) {
    const { t } = useI18n();
    const selected = ref<string>()
    const display = computed(() => Object.fromEntries(
      AREAS.map(key => [
        key.toLowerCase(),
        props.entryStates[`GameSettings.TouchSensitivity.${key}`]!.value,
      ]),
    ));
    const selectedState = computed(() => selected.value
      ? props.entryStates[`GameSettings.TouchSensitivity.${selected.value.toUpperCase()}`]
      : undefined);

    const applyPreset = (id: number) => {
      const PRESET_A = [90, 80, 70, 60, 50, 40, 30, 26, 23, 20, 10]
      const PRESET_OTHERS = [70, 60, 50, 40, 30, 20, 15, 10, 5, 1, 1]

      for (const key of AREAS) {
        props.entryStates[`GameSettings.TouchSensitivity.${key}`]!.value =
          (key.startsWith('A') ? PRESET_A : PRESET_OTHERS)[id] ?? 0;
      }
    }

    const applyToGlobal = (value: number) => {
      for (const key of AREAS) {
        props.entryStates[`GameSettings.TouchSensitivity.${key}`]!.value = value;
      }
    }

    const applyToArea = (area: 'a' | 'b' | 'c' | 'd' | 'e', value: number) => {
      const prefix = area.toUpperCase();
      for (const key of AREAS) {
        if (key.startsWith(prefix)) {
          props.entryStates[`GameSettings.TouchSensitivity.${key}`]!.value = value;
        }
      }
    }

    return () => <div class="flex gap-4 m-l-10">
      <TouchSensitivityDisplay config={display.value} v-model:currentSelected={selected.value}/>
      <div class="flex flex-col gap-2">
        {t('mod.touchSensitivity.applyPresetToGlobal')}
        <div class="flex mb">
          {Array.from({length: 11}, (_, i) => <Button size="small" variant="secondary" class={i > 0 ? 'b-l b-l-solid b-l-[rgba(255,255,255,0.5)]' : ''} onClick={() => applyPreset(i)}>{i - 5 > 0 && '+'}{i - 5}</Button>)}
        </div>
        {selected.value ? <>
            {t('mod.touchSensitivity.settingsFor', {area: selected.value.toUpperCase()})}
            <NumberInput innerClass="h-42px!" v-model:value={selectedState.value!.value as number} min={0} max={100} step={1}/>
            <div class="flex gap-2 mb">
              <Button variant="secondary" onClick={() => applyToGlobal(Number(selectedState.value!.value))}>{t('mod.touchSensitivity.applyToGlobal')}</Button>
              <Button variant="secondary" onClick={() => applyToArea(selected.value!.substring(0, 1) as 'a' | 'b' | 'c' | 'd' | 'e', Number(selectedState.value!.value))}>
                {t('mod.touchSensitivity.applyToArea', {area: selected.value.substring(0, 1).toUpperCase()})}
              </Button>
            </div>
          </> :
          <div class="mb">
            {t('mod.touchSensitivity.selectAreaHint')}
          </div>
        }
        <div class="lh-relaxed whitespace-pre-wrap">
          {t('mod.touchSensitivity.helpText')}
        </div>
      </div>
    </div>;
  }
})
