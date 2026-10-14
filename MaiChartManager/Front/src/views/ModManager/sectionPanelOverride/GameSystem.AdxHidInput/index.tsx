import { Button } from '@munet/ui';
import type { AquaMaiConfigSection, EntryState, SectionState } from '@aquamai/config-editor';
import { ENTRY_GROUP_PADDING } from '@aquamai/config-editor';
import { defineComponent, ref, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import api from '@/client/api';
import { globalCapture, modInfo, updateModInfo } from '@/store/refs';

// 只有 MCM 认得出 ADX 硬件上有没有冲突的 Mod、也只有它删得掉，所以这一层挂 top；
// 条目排版（1P 左 / 2P 右）在 @aquamai/config-editor 的 overrides 里，独立编辑器也吃那一层
export const panelPosition = 'top';

export default defineComponent({
  props: {
    section: { type: Object as PropType<AquaMaiConfigSection>, required: true },
    entryStates: { type: Object as PropType<Record<string, EntryState>>, required: true },
    sectionState: { type: Object as PropType<SectionState>, required: true },
  },
  setup() {
    const load = ref(false);
    const { t } = useI18n();

    const del = async () => {
      load.value = true;
      try {
        await api.DeleteHidConflict();
        await updateModInfo();
      } catch (error) {
        globalCapture(error, t('mod.installFailed'));
      } finally {
        load.value = false;
      }
    };

    return () => <div class={["flex flex-col gap-2", ENTRY_GROUP_PADDING]}>
      {modInfo.value?.isHidConflictExist ? <div class="flex gap-2 items-center m-l-35">
        <span class="c-orange">{t('mod.adxHid.conflictDetected')}</span>
        <Button variant="secondary" onClick={del} ing={load.value}>{t('mod.adxHid.oneClickDelete')}</Button>
      </div>
        : <div class="flex gap-2 items-center m-l-35">
          <span class="c-green-6">{t('mod.adxHid.noConflict')}</span>
        </div>
      }
    </div>;
  },
});
