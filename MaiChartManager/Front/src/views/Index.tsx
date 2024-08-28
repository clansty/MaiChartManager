import { defineComponent, onMounted } from 'vue';
import { NFlex, NScrollbar, useNotification } from "naive-ui";
import MusicList from "@/components/MusicList";
import GenreVersionManager from "@/components/GenreVersionManager";
import { selectedADir, updateAddVersionList, updateAssetDirs, updateGenreList, updateSelectedAssetDir } from "@/store/refs";
import MusicEdit from "@/components/MusicEdit";
import MusicSelectedTopRightToolbar from "@/components/MusicSelectedTopRightToolbar";
import CreateMusicButton from "@/components/CreateMusicButton";
import ImportChartButton from "@/components/ImportChartButton";
import ModManager from "@/components/ModManager";

export default defineComponent({
  setup() {
    onMounted(updateGenreList)
    onMounted(updateAddVersionList)
    onMounted(updateSelectedAssetDir)
    onMounted(updateAssetDirs)

    const notification = useNotification();

    onMounted(() => {
      addEventListener("unhandledrejection", (event) => {
        console.log(event)
        notification.error({title: '未处理错误', content: event.reason?.error?.message || event.reason?.message});
      });
    })
  },
  render() {
    return <NFlex justify="center">
      <div class="grid cols-[40em_1fr] w-[min(90rem,100%)]">
        <div class="p-xy h-100vh">
          <MusicList/>
        </div>
        <NFlex vertical class="p-xy h-100vh" size="large">
          {selectedADir.value !== 'A000' && <NFlex class="shrink-0">
            <GenreVersionManager type="genre"/>
            <GenreVersionManager type="version"/>
            <ModManager/>

            <div class="grow-1"/>

            <MusicSelectedTopRightToolbar/>
            <CreateMusicButton/>
            <ImportChartButton/>
          </NFlex>}
          <NScrollbar class="grow-1">
            <MusicEdit/>
          </NScrollbar>
        </NFlex>
      </div>
    </NFlex>;
  },
});
