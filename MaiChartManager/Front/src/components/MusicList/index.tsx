import { defineComponent, onMounted } from "vue";
import api from "@/client/api";
import { MusicBrief } from "@/client/apiGen";
import { NFlex, NSelect, NVirtualList, useDialog } from "naive-ui";
import MusicEntry from "@/components/MusicList/MusicEntry";
import { assetDirs, musicList, selectedADir, selectMusicId, updateMusicList } from "@/store/refs";
import RefreshAllButton from "@/components/RefreshAllButton";

export default defineComponent({
  setup() {
    const dialog = useDialog();
    const refresh = async () => {
      await updateMusicList();
    }

    onMounted(async () => {
      refresh();
    });

    const setAssetsDir = async (dir: string) => {
      if (musicList.value.some(it => it.modified)) {
        const decide = await new Promise<boolean>((resolve) => {
          dialog.warning({
            title: '提示',
            content: '当前有未保存的修改，切换的话，修改将丢失。继续吗？',
            positiveText: '继续',
            negativeText: '取消',
            onPositiveClick: () => resolve(true),
            onClose: () => resolve(false)
          });
        })
        if (!decide) {
          return;
        }
      }
      await api.SetAssetsDir(dir);
      selectedADir.value = dir;
      selectMusicId.value = 0;
      refresh();
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
