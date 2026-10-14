import { Button } from '@munet/ui';
import type { AquaMaiConfigSection, EntryState, SectionState } from '@aquamai/config-editor';
import { ENTRY_GROUP_PADDING } from '@aquamai/config-editor';
import { computed, defineComponent, ref, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import api from '@/client/api';
import { globalCapture, modInfo, updateModInfo } from '@/store/refs';

// 依赖库装没装、能不能一键装，只有 MCM 知道，所以这一层挂 top；
// 条目排版（含混用协议那条提示）在 @aquamai/config-editor 的 overrides 里，独立编辑器也吃那一层
export const panelPosition = 'top';

export default defineComponent({
  props: {
    section: { type: Object as PropType<AquaMaiConfigSection>, required: true },
    entryStates: { type: Object as PropType<Record<string, EntryState>>, required: true },
    sectionState: { type: Object as PropType<SectionState>, required: true },
  },
  setup(props) {
    const { t } = useI18n();
    const installing = ref(false);

    const useLegacyEntryPath = 'GameSystem.MaimollerIO.UseLegacy';

    // 装哪个版本的依赖库取决于这个开关，所以它得留在这层跟安装按钮待在一起
    const isLegacyModeEnabled = computed(() => {
      const legacyEntry = props.entryStates[useLegacyEntryPath];
      return legacyEntry ? Boolean(legacyEntry.value) : true;
    });

    const isMmlRequirementSatisfied = computed(() => {
      const info = modInfo.value;
      if (!info?.isAdxHidIoModAbsent) {
        return false;
      }
      if (!isLegacyModeEnabled.value) {
        return true;
      }
      return Boolean(info.isMmlLegacyLibsInstalled);
    });

    const install = async () => {
      installing.value = true;
      try {
        await api.InstallMmlLibs({ useLegacy: isLegacyModeEnabled.value });
        await updateModInfo();
      } catch (error) {
        globalCapture(error, t('mod.mmlIo.installFailed'));
      } finally {
        installing.value = false;
      }
    };

    return () => <div class={["flex flex-col gap-2", ENTRY_GROUP_PADDING]}>
      {!isMmlRequirementSatisfied.value ? <div class="flex gap-2 items-center m-l-35">
        <span class="c-orange">{t('mod.mmlIo.notInstalled')}</span>
        <Button variant="secondary" onClick={install} ing={installing.value}>{t('mod.mmlIo.oneClickInstall')}</Button>
      </div>
        : <div class="flex gap-2 items-center m-l-35">
          <span class="c-green-6">{t('mod.mmlIo.installed')}</span>
        </div>
      }
    </div>;
  },
});
