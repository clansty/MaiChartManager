import { defineComponent, onMounted } from 'vue';
import { NFlex, NScrollbar, useNotification } from "naive-ui";
import MusicList from "@/components/MusicList";
import GenreVersionManager from "@/components/GenreVersionManager";
import { globalCapture, selectedADir, updateAddVersionList, updateAssetDirs, updateGenreList, updateSelectedAssetDir, updateVersion, version } from "@/store/refs";
import MusicEdit from "@/components/MusicEdit";
import MusicSelectedTopRightToolbar from "@/components/MusicSelectedTopRightToolbar";
import ModManager from "@/components/ModManager";
import VersionInfo from "@/components/VersionInfo";
import { captureException } from "@sentry/vue";
import AssetDirsManager from "@/components/AssetDirsManager";
import ImportCreateChartButton from "@/components/ImportCreateChartButton";
import { HardwareAccelerationStatus, LicenseStatus } from "@/client/apiGen";

export default defineComponent({
  setup() {
    const notification = useNotification();

    onMounted(async () => {
      addEventListener("unhandledrejection", (event) => {
        console.log(event)
        captureException(event.reason?.error || event.reason, {
          tags: {
            context: 'unhandledrejection'
          }
        })
        if (import.meta.env.DEV)
          notification.error({title: '未处理错误', content: event.reason?.error?.message || event.reason?.message});
      });
      updateVersion().then(() => {
        if (version.value?.license === LicenseStatus.Pending || version.value?.hardwareAcceleration === HardwareAccelerationStatus.Pending) {
          setTimeout(updateVersion, 2000)
        }
      })
      try {
        await Promise.all([
          updateGenreList(),
          updateAddVersionList(),
          updateSelectedAssetDir(),
          updateAssetDirs(),
        ])
      } catch (err) {
        globalCapture(err, "初始化失败")
      }
    })
  },
  render() {
    return <NFlex justify="center">
      <div class="grid cols-[40em_1fr] w-[min(100rem,100%)]">
        <div class="p-xy h-100vh">
          <MusicList/>
        </div>
        <NFlex vertical class="p-xy h-100vh" size="large" style={{background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 16px, rgba(255, 255, 255, 0.1) calc(100% - 16px), transparent 100%)'}}>
          <NFlex class="shrink-0">
            <AssetDirsManager/>
            {selectedADir.value !== 'A000' && <>
              <GenreVersionManager/>
            </>}
            <ModManager/>

            <div class="grow-1"/>

            {selectedADir.value !== 'A000' && <>
              <MusicSelectedTopRightToolbar/>
              <ImportCreateChartButton/>
            </>}
            <VersionInfo/>
          </NFlex>
          <NScrollbar class="grow-1">
            <MusicEdit/>
          </NScrollbar>
        </NFlex>
      </div>
    </NFlex>;
  },
});
