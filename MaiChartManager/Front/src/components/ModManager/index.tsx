import { defineComponent, onMounted, ref } from "vue";
import { NButton } from "naive-ui";
import { useStorage } from "@vueuse/core";
import ModNotInstalledWarning from "@/components/ModManager/ModNotInstalledWarning";
import api from "@/client/api";
import ConfigEditor from "@/components/ModManager/ConfigEditor";
import { GameModInfo } from "@/client/apiGen";

export default defineComponent({
  setup(props) {
    const info = ref<GameModInfo>();
    const isWarningConfirmed = useStorage('isWarningConfirmed', false);
    const disableBadge = useStorage('disableBadge', false);
    const showWarning = ref(false);
    const showConfigurator = ref(false);

    onMounted(async () => {
      info.value = (await api.GetGameModInfo()).data;
      if (isWarningConfirmed.value) return;
      showWarning.value = !info.value.aquaMaiInstalled || !info.value.melonLoaderInstalled;
    })

    return () => <NButton secondary onClick={() => showConfigurator.value = true}>
      Mod 管理
      <ModNotInstalledWarning show={showWarning.value} closeModal={(dismiss: boolean) => {
        showWarning.value = false
        isWarningConfirmed.value = dismiss
      }}/>
      {info.value && <ConfigEditor v-model:show={showConfigurator.value} info={info.value} refresh={async () => info.value = (await api.GetGameModInfo()).data}/>}
    </NButton>;
  }
})
