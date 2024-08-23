import { defineComponent, onMounted, ref } from "vue";
import api from "@/client/api";
import { MusicBrief } from "@/client/apiGen";
import { NSelect, NVirtualList } from "naive-ui";
import MusicEntry from "@/components/MusicList/MusicEntry";
import { selectedADir, selectMusicId } from "@/store/refs";

export default defineComponent({
  setup() {
    const aDirs = ref<string[]>([]);
    const musicList = ref<MusicBrief[]>([]);

    const refresh = async () => {
      aDirs.value = (await api.GetAssetsDirs()).data;
      musicList.value = (await api.GetMusicList()).data;
    }

    onMounted(async () => {
      refresh();
    });

    const setAssetsDir = async (dir: string) => {
      await api.SetAssetsDir(dir);
      selectedADir.value = dir;
      selectMusicId.value = 0;
      refresh();
    }

    return () => (
      <div class="h-full flex flex-col">
        <div class="m-b">
          <NSelect
            value={selectedADir.value}
            options={aDirs.value.map(dir => ({label: dir, value: dir}))}
            onUpdate:value={setAssetsDir}
          />
        </div>
        <NVirtualList class="flex-1" itemSize={20 / 4 * 16} items={musicList.value}>
          {{
            default({item}: { item: MusicBrief }) {
              return (
                <MusicEntry music={item} selected={selectMusicId.value === item.id} onClick={() => selectMusicId.value = item.id!} key={item.id}/>
              )
            }
          }}
        </NVirtualList>
      </div>
    )
  }
})
