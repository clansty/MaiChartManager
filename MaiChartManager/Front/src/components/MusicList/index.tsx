import { defineComponent, onMounted } from "vue";
import api from "@/client/api";
import { MusicBrief } from "@/client/apiGen";
import { NFlex, NSelect, NVirtualList, useDialog } from "naive-ui";
import MusicEntry from "@/components/MusicList/MusicEntry";
import { assetDirs, musicList, selectedADir, selectMusicId, updateMusicList } from "@/store/refs";
import RefreshAllButton from "@/components/RefreshAllButton";
import BatchActionButton from "@/components/MusicList/BatchActionButton";

export default defineComponent({
  setup() {
    const dialog = useDialog();

    const setAssetsDir = async (dir: string) => {
      selectedADir.value = dir;
      selectMusicId.value = 0;
    }

    return () => (
      <NFlex vertical class="h-full" size="large">
        <NFlex>
          <NSelect
            class="grow w-0"
            value={selectedADir.value}
            options={assetDirs.value.map(dir => ({label: dir.dirName!, value: dir.dirName!}))}
            onUpdateValue={setAssetsDir}
          />
          <RefreshAllButton/>
          {selectedADir.value !== 'A000' && <BatchActionButton/>}
        </NFlex>
        <NVirtualList class="flex-1" itemSize={20 / 4 * 16} items={musicList.value}>
          {{
            default({item}: { item: MusicBrief }) {
              return (
                <MusicEntry music={item} selected={selectMusicId.value === item.id} onClick={() => selectMusicId.value = item.id!} key={item.id}/>
              )
            }
          }}
        </NVirtualList>
      </NFlex>
    )
  }
})
