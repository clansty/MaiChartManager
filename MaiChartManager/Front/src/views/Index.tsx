import { defineComponent } from 'vue';
import { NFlex, NGi, NGrid } from "naive-ui";
import MusicList from "@/components/MusicList";
import GenreVersionManager from "@/components/GenreVersionManager";

export default defineComponent({
  render() {
    return <div class="grid cols-[40em_1fr]">
      <div class="p-xy h-100vh">
        <MusicList/>
      </div>
      <div class="p-xy max-h-100vh of-auto">
        <NFlex>
          <GenreVersionManager type="genre"/>
          <GenreVersionManager type="version"/>
        </NFlex>
      </div>
    </div>;
  },
});
