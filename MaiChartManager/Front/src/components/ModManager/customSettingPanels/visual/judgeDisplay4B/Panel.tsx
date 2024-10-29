import { defineComponent, h, PropType, ref } from "vue";
import { AquaMaiVisualConfig } from "@/client/apiGen";
import { NButton, NFlex, NFormItem, NSwitch } from "naive-ui";
import api from "@/client/api";
import { modInfo, updateModInfo } from "@/store/refs";

export default defineComponent({
  props: {
    config: {type: Object as PropType<AquaMaiVisualConfig>, required: true},
  },
  setup(props) {
    const load = ref(false)

    const installAssets = async () => {
      load.value = true
      await api.InstallJudgeDisplay4B();
      await updateModInfo();
      load.value = false
    }

    return () => <NFormItem label="Judge Display 4B" labelPlacement="left" labelWidth="10em">
      <NFlex vertical class="w-full">
        <NFlex class="h-34px" align="center">
          <NSwitch v-model:value={props.config.judgeDisplay4B}/>
          {modInfo.value?.isJudgeDisplay4BInstalled ? <NFlex class="c-green-6">资源已安装</NFlex> : <NFlex class="c-orange">资源未安装</NFlex>}
          <NButton secondary onClick={installAssets} loading={load.value}>
            {modInfo.value?.isJudgeDisplay4BInstalled ? "重新安装" : "安装资源"}
          </NButton>
        </NFlex>
        更精细的判定表示
        <br/>
        需开启 CustomSkins 并安装资源文件
        <br/>
        作者 @Minepig
      </NFlex>
    </NFormItem>
  }
})
