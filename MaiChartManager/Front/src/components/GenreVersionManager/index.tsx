import { computed, defineComponent, PropType, ref } from "vue";
import { NButton, NCheckbox, NDropdown, NFlex, NList, NListItem, NModal, NScrollbar } from "naive-ui";
import GenreDisplay from "./GenreDisplay";
import { addVersionList, genreList } from "@/store/refs";
import { useStorage } from "@vueuse/core";
import CreateButton from "@/components/GenreVersionManager/CreateButton";

export enum EDIT_TYPE {
  None,
  Genre,
  Version,
}

const options = [
  {label: "流派管理", key: EDIT_TYPE.Genre},
  {label: "版本管理", key: EDIT_TYPE.Version},
]

export default defineComponent({
  setup(props) {
    const show = ref(EDIT_TYPE.None);
    const showBuiltIn = useStorage('showBuiltInGenre', true);
    const text = computed(() => show.value === EDIT_TYPE.Genre ? '流派' : '版本');
    const editingId = ref(-1);

    const list = computed(() => {
      const data = show.value === EDIT_TYPE.Genre ? genreList : addVersionList;
      return showBuiltIn.value ? data.value : data.value.filter(it => it.assetDir !== 'A000');
    });

    const handleSelect = (key: EDIT_TYPE) => {
      show.value = key;
    }

    return () => (
      <NDropdown options={options} trigger="click" onSelect={handleSelect} placement="bottom-end">
        <NButton secondary class="pr-1">
          分类管理
          <span class="i-mdi-arrow-down-drop text-6 translate-y-.25"/>

          <NModal
            preset="card"
            class="w-[min(70vw,80em)]"
            title={`${text.value}管理`}
            show={show.value !== EDIT_TYPE.None}
            onUpdateShow={() => show.value = EDIT_TYPE.None}
          >
            <NFlex vertical>
              <NFlex align="center">
                <NCheckbox v-model:checked={showBuiltIn.value}>显示内置</NCheckbox>
                <CreateButton setEditId={id => editingId.value = id} type={show.value}/>
              </NFlex>
              <NScrollbar class="h-80vh">
                <NList>
                  {list.value.map(it => <NListItem key={it.id}>
                    <GenreDisplay genre={it} type={show.value} class={`${editingId.value >= 0 && editingId.value !== it.id && 'op-30'}`} disabled={editingId.value >= 0 && editingId.value !== it.id}
                                  style={{transition: 'opacity 0.3s'}}
                                  editing={editingId.value === it.id} setEdit={isEdit => editingId.value = isEdit ? it.id! : -1}/>
                  </NListItem>)}
                </NList>
              </NScrollbar>
            </NFlex>
          </NModal>
        </NButton>
      </NDropdown>
    );
  },
})
