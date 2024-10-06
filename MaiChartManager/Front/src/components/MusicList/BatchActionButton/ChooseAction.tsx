import { defineComponent, PropType, ref } from "vue";
import { MusicXmlWithABJacket } from "@/client/apiGen";
import { NButton, NFlex, NPopover, NRadio, NRadioGroup } from "naive-ui";
import { STEP } from "@/components/MusicList/BatchActionButton/index";

enum OPTIONS {
  None,
  EditProps,
  Delete,
  CreateNewOpt,
  CreateNewOptCompatible,
  ConvertToMaidata
}

export default defineComponent({
  props: {
    selectedMusic: Array as PropType<MusicXmlWithABJacket[]>,
    continue: {type: Function, required: true},
  },
  setup(props) {
    const selectedOption = ref(OPTIONS.None);
    const load = ref(false);

    const proceed = () => {
      switch (selectedOption.value) {
        case OPTIONS.EditProps:
          props.continue(STEP.EditProps);
          break;
      }
    }

    return () => <NFlex vertical>
      <NRadioGroup v-model:value={selectedOption.value} disabled={load.value}>
        <NFlex vertical>
          {
            props.selectedMusic?.some(it => it.assetDir === 'A000') ?
              <>
                <NPopover trigger="hover" placement="top-start">{{
                  trigger: () =>
                    <NRadio disabled>
                      编辑属性
                    </NRadio>,
                  default: () => '你选择了 A000 目录中的歌曲'
                }}</NPopover>
                <NPopover trigger="hover" placement="top-start">{{
                  trigger: () =>
                    <NRadio disabled>
                      删除
                    </NRadio>,
                  default: () => '你选择了 A000 目录中的歌曲'
                }}</NPopover>
              </> :
              <>
                <NRadio value={OPTIONS.EditProps}>
                  编辑属性
                </NRadio>
                <NRadio value={OPTIONS.Delete}>
                  删除
                </NRadio>
              </>
          }
          <NRadio value={OPTIONS.CreateNewOpt}>
            导出为 Opt（原始数据）
          </NRadio>
          <NRadio value={OPTIONS.CreateNewOptCompatible}>
            导出为 Opt（兼容其他版本，移除 Event 等）
          </NRadio>
          <NRadio value={OPTIONS.ConvertToMaidata}>
            转换为 Maidata
          </NRadio>
        </NFlex>
      </NRadioGroup>
      <NFlex justify="end">
        <NButton onClick={() => props.continue(STEP.Select)} disabled={load.value}>上一步</NButton>
        <NButton onClick={proceed} loading={load.value} disabled={selectedOption.value === OPTIONS.None}>继续</NButton>
      </NFlex>
    </NFlex>;
  }
})
