import { defineComponent, effect } from 'vue';
import { NFlex, NScrollbar } from "naive-ui";
import MusicList from "@/components/MusicList";
import GenreVersionManager from "@/components/GenreVersionManager";
import { updateAddVersionList, updateGenreList, updateSelectedAssetDir } from "@/store/refs";
import MusicEdit from "@/components/MusicEdit";

export default defineComponent({
  setup() {
    effect(updateGenreList)
    effect(updateAddVersionList)
    effect(updateSelectedAssetDir)
  },
  render() {
    return <NFlex justify="center">
      <div class="grid cols-[40em_1fr] select-none w-[min(90rem,100%)]">
        <div class="p-xy h-100vh">
          <MusicList/>
        </div>
        <NFlex vertical class="p-xy h-100vh">
          <NFlex class="shrink-0">
            <GenreVersionManager type="genre"/>
            <GenreVersionManager type="version"/>
          </NFlex>
          <NScrollbar class="grow-1">
            <MusicEdit/>
          </NScrollbar>
        </NFlex>
      </div>
    </NFlex>;
  },
});
