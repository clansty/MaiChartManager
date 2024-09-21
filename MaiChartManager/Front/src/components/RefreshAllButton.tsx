import { defineComponent, ref } from "vue";
import { NButton } from "naive-ui";
import { globalCapture, updateAddVersionList, updateAll, updateAssetDirs, updateGenreList, updateMusicList, updateSelectedAssetDir, updateVersion } from "@/store/refs";
import api from "@/client/api";

export default defineComponent({
  setup(props) {
    const load = ref(false);

    const reload = async () => {
      load.value = true;
      try {
        await api.ReloadAll();
        await updateAll();
      } catch (err) {
        globalCapture(err, "刷新失败")
      } finally {
        load.value = false;
      }
    }

    return () => <NButton secondary loading={load.value} onClick={reload}>
      {!load.value && <span class="i-ic-baseline-refresh text-lg"/>}
    </NButton>;
  }
})
