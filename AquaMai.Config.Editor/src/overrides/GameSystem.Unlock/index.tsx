import { defineComponent, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ConfigSection, EntryState, SectionState } from '../../types';
import { CheckBox } from '@munet/ui';
import { getNameForPath } from '../../utils';
import { ConfigEntry } from '../../components/ConfigEntry';

export default defineComponent({
  props: {
    section: { type: Object as PropType<ConfigSection>, required: true },
    entryStates: { type: Object as PropType<Record<string, EntryState>>, required: true },
    sectionState: { type: Object as PropType<SectionState>, required: true },
  },
  setup(props) {
    const { locale } = useI18n();
    const PREFIX = 'GameSystem.Unlock.';
    const booleanKeys = ['Maps', 'Songs', 'Tickets', 'Courses', 'Utage', 'Titles', 'Icons', 'Plates', 'Frames', 'Partners', 'Events', 'Characters'];
    const booleanPaths = booleanKeys.map(it => PREFIX + it);

    const findEntry = (key: string) => props.section.entries?.find(it => it.path === PREFIX + key);

    return () => <div class="flex flex-col gap-2">
      <div class="flex flex-wrap gap-x-4 gap-y-1 p-l-47">
        {booleanKeys.map(key => {
          const entry = findEntry(key);
          if (!entry) return null;
          return <CheckBox v-model:value={props.entryStates[PREFIX + key]!.value}>
            {getNameForPath(entry.path!, entry.name!, entry.attribute?.comment?.nameZh, locale.value)}
          </CheckBox>;
        })}
      </div>
      {props.section.entries?.filter(it => !booleanPaths.includes(it.path!))
        .map((entry) => {
          const state = props.entryStates[entry.path];
          return state ? <ConfigEntry key={entry.path} entry={entry} entryState={state} /> : null;
        })}
    </div>;
  },
});
