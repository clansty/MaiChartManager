import { defineComponent, PropType, ref, computed, h } from 'vue';
import { IEntryState, ISectionState } from "@/client/apiGen";
import { NButton, NFlex, NFormItem, NGrid, NGridItem, NSelect } from "naive-ui";
import api from "@/client/api";
import { modInfo, updateModInfo } from "@/store/refs";

const options = [
  { label: '禁用', value: 'None' },
  { label: '1P 选择', value: 'Select1P' },
  { label: '2P 选择', value: 'Select2P' },
  { label: '服务', value: 'Service' },
  { label: '测试', value: 'Test' },
]

export default defineComponent({
  props: {
    entryStates: { type: Object as PropType<Record<string, IEntryState>>, required: true },
    sectionState: { type: Object as PropType<ISectionState>, required: true },
  },
  setup(props, { emit }) {
    const load = ref(false)

    const del = async () => {
      load.value = true
      await api.DeleteHidConflict();
      await updateModInfo();
      load.value = false
    }

    return () => <NFlex vertical>
      {modInfo.value?.isHidConflictExist ? <NFlex align="center" class="m-l-35 translate-y--3">
          <span class="c-orange">检测到冲突的 Mod</span>
          <NButton secondary onClick={del} loading={load.value}>一键删除</NButton>
        </NFlex>
        : <NFlex align="center" class="m-l-35 translate-y--3">
          <span class="c-green-6">没有检测到冲突</span>
        </NFlex>}
      <NGrid cols={2}>
        <NGridItem>
          <NFormItem label="按键 1" labelPlacement="left" labelWidth="10em">
            <NFlex vertical class="w-full ws-pre-line">
              <NSelect v-model:value={props.entryStates['GameSystem.AdxHidInput.Button1'].value} options={options}/>
              向上的三角键
            </NFlex>
          </NFormItem>
          <NFormItem label="按键 2" labelPlacement="left" labelWidth="10em">
            <NFlex vertical class="w-full ws-pre-line">
              <NSelect v-model:value={props.entryStates['GameSystem.AdxHidInput.Button2'].value} options={options}/>
              三角键中间的圆形按键
            </NFlex>
          </NFormItem>
        </NGridItem>
        <NGridItem>
          <NFormItem label="按键 3" labelPlacement="left" labelWidth="10em">
            <NFlex vertical class="w-full ws-pre-line">
              <NSelect v-model:value={props.entryStates['GameSystem.AdxHidInput.Button3'].value} options={options}/>
              向下的三角键
            </NFlex>
          </NFormItem>
          <NFormItem label="按键 4" labelPlacement="left" labelWidth="10em">
            <NFlex vertical class="w-full ws-pre-line">
              <NSelect v-model:value={props.entryStates['GameSystem.AdxHidInput.Button4'].value} options={options}/>
              最下方的圆形按键
            </NFlex>
          </NFormItem>
        </NGridItem>
      </NGrid>
    </NFlex>
  },
});
