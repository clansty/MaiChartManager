import { defineComponent, effect, ref } from "vue";
import { NButton, NList, NListItem, NModal, NScrollbar } from "naive-ui";
import { GenreXml } from "@/client/apiGen";
import api from "@/client/api";
import GenreDisplay from "@/components/GenreManager/GenreDisplay";

export default defineComponent({
  setup() {
    const show = ref(false);
    const genreList = ref<GenreXml[]>([]);

    const refresh = async () => {
      genreList.value = (await api.GetAllGenres()).data;
    }

    effect(refresh);

    return () => (
      <NButton onClick={() => show.value = true}>
        分类管理

        <NModal
          preset="card"
          class="w-[min(70vw,80em)]"
          title="分类管理"
          v-model:show={show.value}
        >
          <NScrollbar class="h-80vh">
            <NList>
              {genreList.value.map(it => <NListItem>
                <GenreDisplay genre={it}/>
              </NListItem>)}
            </NList>
          </NScrollbar>
        </NModal>
      </NButton>
    );
  },
})
