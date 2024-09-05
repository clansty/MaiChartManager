import { computed, defineComponent, PropType, ref } from "vue";
import { GetAssetsDirsResult } from "@/client/apiGen";
import { NButton, NDropdown, NFlex } from "naive-ui";
import MemoBox from "@/components/AssetDirsManager/MemoBox";

export default defineComponent({
  props: {
    dir: {type: Object as PropType<GetAssetsDirsResult>, required: true}
  },
  setup(props) {
    const memos = computed(() => props.dir.subFiles!.filter(f => f.toLowerCase().endsWith('.txt')));
    const options = computed(() => [
        ...memos.value.map(it => ({
          label: it,
          key: it
        })),
        {
          label: () => <span class="c-blue-5 flex items-center">添加</span>,
          key: 'add'
        }
      ]
    );

    const showBox = ref(false)
    const selectMemo = ref('')

    const onSelect = (key: string) => {
      selectMemo.value = key
      showBox.value = true
    }

    return () => <>
      <NDropdown trigger="click" options={options.value} onSelect={onSelect}>
        <NButton secondary>
          <NFlex align="center" size="small">
            <span class="i-material-symbols-edit-note text-lg translate-y-.3"/>
            {memos.value.length || ''}
          </NFlex>
        </NButton>
      </NDropdown>
      <MemoBox v-model:show={showBox.value} dir={props.dir} name={selectMemo.value}/>
    </>;
  }
})
