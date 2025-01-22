import { computed, defineComponent, onMounted, ref } from "vue";
import { NBadge, NButton } from "naive-ui";
import { useStorage, watchOnce } from "@vueuse/core";
import ModNotInstalledWarning from "@/components/ModManager/ModNotInstalledWarning";
import api from "@/client/api";
import ConfigEditor from "@/components/ModManager/ConfigEditor";
import { GameModInfo } from "@/client/apiGen";
import { modInfo } from "@/store/refs";
import { shouldShowUpdate } from "@/components/ModManager/shouldShowUpdateController";

export default defineComponent({
  setup(props) {
    const isWarningConfirmed = useStorage('isWarningConfirmed', false);
    const disableBadge = useStorage('disableBadge', false);
    const showWarning = ref(false);
    const showConfigurator = ref(false);

    watchOnce(() => modInfo.value, async (info) => {
      if (!info) return;
      if (isWarningConfirmed.value) return;
      showWarning.value = !info.aquaMaiInstalled || !info.melonLoaderInstalled;
    })

    const badgeType = computed(() => {
      if (!modInfo.value) return
      if (!modInfo.value.aquaMaiInstalled || !modInfo.value.melonLoaderInstalled) return 'error'
      if (shouldShowUpdate.value) return 'warning'
    })

    return () => <>
      <NBadge dot show={!!badgeType.value && !disableBadge.value} type={badgeType.value as any}>
        <NButton secondary onClick={() => showConfigurator.value = true}>
          Mod 管理
        </NButton>
      </NBadge>
      <ModNotInstalledWarning show={showWarning.value} closeModal={(dismiss: boolean) => {
        showWarning.value = false
        isWarningConfirmed.value = dismiss
      }}/>
      {modInfo.value && <ConfigEditor v-model:show={showConfigurator.value} v-model:disableBadge={disableBadge.value} badgeType={badgeType.value}/>}
    </>;
  }
})
