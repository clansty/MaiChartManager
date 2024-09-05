import { computed, defineComponent, PropType } from "vue";
import { GetAssetsDirsResult } from "@/client/apiGen";
import { NPopover } from "naive-ui";
import OfficialChartToggle from "@/components/AssetDirsManager/OfficialChartToggle";
import MemosDisplay from "@/components/AssetDirsManager/MemosDisplay";
import DeleteButton from "@/components/AssetDirsManager/DeleteButton";

export default defineComponent({
  props: {
    dir: {type: Object as PropType<GetAssetsDirsResult>, required: true}
  },
  setup(props) {

    return () => <div class="grid cols-[10em_1fr_9em_6em_6em] items-center gap-5 m-x">
      {props.dir.dirName}
      <div/>
      <div>
        {
          props.dir.subFiles!.some(it => it === 'DataConfig.xml') ?
            <NPopover trigger="hover">
              {{
                trigger: () => '存放官谱',
                default: () => '由于存在 DataConfig.xml，该目录将标记为存放官谱'
              }}
            </NPopover> :
            <OfficialChartToggle dir={props.dir}/>
        }
      </div>
      <div>
        <MemosDisplay dir={props.dir}/>
      </div>
      <div>
        {props.dir.dirName! !== 'A000' && <DeleteButton dir={props.dir}/>}
      </div>
    </div>;
  }
})
