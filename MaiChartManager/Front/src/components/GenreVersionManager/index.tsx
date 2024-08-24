import { computed, defineComponent, PropType, ref } from "vue";
import { NButton, NCheckbox, NFlex, NList, NListItem, NModal, NScrollbar } from "naive-ui";
import GenreDisplay from "./GenreDisplay";
import { addVersionList, genreList } from "@/store/refs";
import { useStorage } from "@vueuse/core";
import CreateButton from "@/components/GenreVersionManager/CreateButton";

export default defineComponent({
  props: {
    type: String as PropType<"genre" | "version">,
  },
  setup(props) {
    const show = ref(false);
    const showBuiltIn = useStorage('showBuiltInGenre', true);
    const text = computed(() => props.type === 'genre' ? '分类' : '版本');
    const editingId = ref(-1);

    const list = computed(() => {
      const data = props.type === 'genre' ? genreList : addVersionList;
      return showBuiltIn.value ? data.value : data.value.filter(it => it.assetDir !== 'A000');
    });

    return () => (
      <NButton secondary onClick={() => show.value = true}>
        {text.value}管理

        <NModal
          preset="card"
          class="w-[min(70vw,80em)]"
          title={`${text.value}管理`}
          v-model:show={show.value}
        >
          <NFlex vertical>
            <NFlex align="center">
              <NCheckbox v-model:checked={showBuiltIn.value}>显示内置</NCheckbox>
              <CreateButton setEditId={id => editingId.value = id}/>
            </NFlex>
            <NScrollbar class="h-80vh">
              <NList>
                {list.value.map(it => <NListItem>
                  <GenreDisplay genre={it} type={props.type} class={`${editingId.value >= 0 && editingId.value !== it.id && 'op-30'}`} disabled={editingId.value >= 0 && editingId.value !== it.id}
                                style={{transition: 'opacity 0.3s'}}
                                editing={editingId.value === it.id} setEdit={isEdit => editingId.value = isEdit ? it.id! : -1}/>
                </NListItem>)}
              </NList>
            </NScrollbar>
          </NFlex>
        </NModal>
      </NButton>
    );
  },
})
