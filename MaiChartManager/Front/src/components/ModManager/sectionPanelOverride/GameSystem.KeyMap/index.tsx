import {defineComponent, h, PropType} from "vue";
import {NFlex, NFormItem, NGrid, NGridItem, NSelect, NSwitch} from "naive-ui";
import {KeyCodeID} from "@/components/ModManager/types/KeyCodeID";
import {IEntryState, ISectionState} from "@/client/apiGen";

const options = Object.entries(KeyCodeID).map(([key, value]) => ({label: key, value}))

export default defineComponent({
  props: {
    entryStates: {type: Object as PropType<Record<string, IEntryState>>, required: true},
    sectionState: {type: Object as PropType<ISectionState>, required: true},
  },
  setup(props) {
    return () => <div>
      <NGrid cols={2}>
        <NGridItem>
          {
            new Array(8).fill(0).map((_, i) => <NFormItem key={i} label={`1P 按键 ${i + 1}`} labelPlacement="left" labelWidth="10em">
              <NSelect v-model:value={props.entryStates[`GameSystem.KeyMap.Button${i + 1}_1P`].value} options={options}/>
            </NFormItem>)
          }
          <NFormItem label="1P 选择键" labelPlacement="left" labelWidth="10em">
            <NSelect v-model:value={props.entryStates['GameSystem.KeyMap.Select_1P'].value} options={options}/>
          </NFormItem>
          <NFormItem label="Test" labelPlacement="left" labelWidth="10em">
            <NSelect v-model:value={props.entryStates['GameSystem.KeyMap.Test'].value} options={options}/>
          </NFormItem>
        </NGridItem>
        <NGridItem>
          {
            new Array(8).fill(0).map((_, i) => <NFormItem key={i} label={`2P 按键 ${i + 1}`} labelPlacement="left" labelWidth="10em">
              <NSelect v-model:value={props.entryStates[`GameSystem.KeyMap.Button${i + 1}_2P`].value} options={options}/>
            </NFormItem>)
          }
          <NFormItem label="2P 选择键" labelPlacement="left" labelWidth="10em">
            <NSelect v-model:value={props.entryStates['GameSystem.KeyMap.Select_2P'].value} options={options}/>
          </NFormItem>
          <NFormItem label="Service" labelPlacement="left" labelWidth="10em">
            <NSelect v-model:value={props.entryStates['GameSystem.KeyMap.Service'].value} options={options}/>
          </NFormItem>
        </NGridItem>
      </NGrid>
    </div>;
  }
})
