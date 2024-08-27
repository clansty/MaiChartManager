import { defineComponent, onMounted, ref } from "vue";
import { NButton } from "naive-ui";
import { useStorage } from "@vueuse/core";
import ModNotInstalledWarning from "@/components/ModManager/ModNotInstalledWarning";
import api from "@/client/api";
import ModManager from "@/components/ModManager/index";
import ConfigEditor from "@/components/ModManager/ConfigEditor";

export default defineComponent({
  setup(props) {
    const isMelonLoaderInstalled = ref(false);
    const isAquaMaiInstalled = ref(false);
    const isWarningConfirmed = useStorage('isWarningConfirmed', false);
    const showWarning = ref(false);
    const showConfigurator = ref(false);

    onMounted(async () => {
      isMelonLoaderInstalled.value = (await api.IsMelonInstalled()).data;
      isAquaMaiInstalled.value = (await api.IsAquaMaiInstalled()).data;
      if (isWarningConfirmed.value) return;
      showWarning.value = !isMelonLoaderInstalled.value || !isAquaMaiInstalled.value;
    })

    return () => <NButton secondary onClick={() => showConfigurator.value = true}>
      Mod 管理
      <ModNotInstalledWarning show={showWarning.value} closeModal={(dismiss: boolean) => {
        showWarning.value = false
        isWarningConfirmed.value = dismiss
      }}/>
      <ConfigEditor v-model:show={showConfigurator.value} v-model:isMelonLoaderInstalled={isMelonLoaderInstalled.value} v-model:isAquaMaiInstalled={isAquaMaiInstalled.value}/>
    </NButton>;
  }
})
