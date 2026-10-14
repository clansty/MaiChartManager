import { Button } from '@munet/ui';
import type { EntryState, SectionState } from '@aquamai/config-editor';
import { defineComponent, ref, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import api from '@/client/api';
import { globalCapture, modInfo, updateModInfo } from '@/store/refs';

// 需要访问游戏目录、装资源，只在 MCM 里有意义，所以这一层面板放在 MCM 而不是编辑器组件里
export default defineComponent({
  props: {
    entryStates: { type: Object as PropType<Record<string, EntryState>>, required: true },
    sectionState: { type: Object as PropType<SectionState>, required: true },
  },
  setup() {
    const load = ref(false);
    const { t } = useI18n();

    const installAssets = async () => {
      load.value = true;
      try {
        await api.InstallJudgeDisplay4B();
        await updateModInfo();
      } catch (error) {
        globalCapture(error, t('mod.installFailed'));
      } finally {
        load.value = false;
      }
    };

    return () => {
      const installed = Boolean(modInfo.value?.isJudgeDisplay4BInstalled);
      return <div class="flex gap-2 p-l-10em items-center">
        {installed ? <span class="c-green-6">{t('mod.resourcesInstalled')}</span> : <span class="c-orange">{t('mod.resourcesNotInstalled')}</span>}
        <Button variant="secondary" onClick={installAssets} ing={load.value}>
          {installed ? t('mod.reinstall') : t('mod.installResources')}
        </Button>
      </div>;
    };
  },
});
