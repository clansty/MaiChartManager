import { Button } from '@munet/ui';
import type { EntryState, SectionState } from '@aquamai/config-editor';
import { defineComponent, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import api from '@/client/api';

export default defineComponent({
  props: {
    entryStates: { type: Object as PropType<Record<string, EntryState>>, required: true },
    sectionState: { type: Object as PropType<SectionState>, required: true },
  },
  setup() {
    const { t } = useI18n();
    return () => <div class="flex gap-2 items-center m-l-35 translate-y--3">
      {t('mod.judgeAccuracyInfo.author')}Minepig
      <Button variant="secondary" onClick={() => api.OpenJudgeAccuracyInfoPdf()}>
        {t('mod.judgeAccuracyInfo.viewDoc')}
      </Button>
    </div>;
  },
});
