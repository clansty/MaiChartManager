import {defineComponent, PropType, ref, computed, h} from 'vue';
import {IEntryState, ISectionState} from "@/client/apiGen";
import api from "@/client/api";
import {modInfo, updateModInfo} from "@/store/refs";
import {NButton, NFlex} from "naive-ui";

export default defineComponent({
  props: {
    entryStates: {type: Object as PropType<Record<string, IEntryState>>, required: true},
    sectionState: {type: Object as PropType<ISectionState>, required: true},
  },
  setup(props, {emit}) {
    const load = ref(false)

    const installAssets = async () => {
      load.value = true
      await api.InstallJudgeDisplay4B();
      await updateModInfo();
      load.value = false
    }

    return () => <NFlex class="p-l-10em translate-y--5" align="center">
      {modInfo.value?.isJudgeDisplay4BInstalled ? <NFlex class="c-green-6">资源已安装</NFlex> : <NFlex class="c-orange">资源未安装</NFlex>}
      <NButton secondary onClick={installAssets} loading={load.value}>
        {modInfo.value?.isJudgeDisplay4BInstalled ? "重新安装" : "安装资源"}
      </NButton>
    </NFlex>;
  },
});
