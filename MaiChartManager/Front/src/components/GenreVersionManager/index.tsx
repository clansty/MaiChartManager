import { computed, defineComponent, effect, PropType, ref } from "vue";
import { NButton, NList, NListItem, NModal, NScrollbar } from "naive-ui";
import { GenreXml } from "@/client/apiGen";
import api from "@/client/api";
import GenreDisplay from "./GenreDisplay";
import { addVersionList, genreList } from "@/store/refs";

export default defineComponent({
  props: {
    type: String as PropType<"genre" | "version">,
  },
  setup(props) {
    const show = ref(false);
    const list = props.type === 'genre' ? genreList : addVersionList;
    const text = computed(() => props.type === 'genre' ? '分类' : '版本');

    return () => (
      <NButton onClick={() => show.value = true}>
        {text.value}管理

        <NModal
          preset="card"
          class="w-[min(70vw,80em)]"
          title={`${text.value}管理`}
          v-model:show={show.value}
        >
          <NScrollbar class="h-80vh">
            <NList>
              {list.value.map(it => <NListItem>
                <GenreDisplay genre={it}/>
              </NListItem>)}
            </NList>
          </NScrollbar>
        </NModal>
      </NButton>
    );
  },
})
