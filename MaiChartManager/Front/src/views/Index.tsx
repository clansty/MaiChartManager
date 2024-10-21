import { defineComponent, onMounted } from 'vue';
import { NFlex, NScrollbar, useDialog, useNotification } from "naive-ui";
import MusicList from "@/components/MusicList";
import GenreVersionManager from "@/components/GenreVersionManager";
import { globalCapture, selectedADir, updateAddVersionList, updateAssetDirs, updateGenreList, updateMusicList, updateVersion, version } from "@/store/refs";
import MusicEdit from "@/components/MusicEdit";
import MusicSelectedTopRightToolbar from "@/components/MusicSelectedTopRightToolbar";
import ModManager from "@/components/ModManager";
import VersionInfo from "@/components/VersionInfo";
import { captureException } from "@sentry/vue";
import AssetDirsManager from "@/components/AssetDirsManager";
import ImportCreateChartButton from "@/components/ImportCreateChartButton";
import { HardwareAccelerationStatus, LicenseStatus } from "@/client/apiGen";
import CopyToButton from "@/components/CopyToButton";

export default defineComponent({
  setup() {
    const notification = useNotification();
    const dialog = useDialog();

    onMounted(async () => {
      document.title = `MaiChartManager (${location.host})`
      addEventListener("unhandledrejection", (event) => {
        console.log(event)
        captureException(event.reason?.error || event.reason, {
          tags: {
            context: 'unhandledrejection'
          }
        })
      });

      if (window.showDirectoryPicker === undefined) {
        const showError = () => {
          dialog.error({
            title: '警告：不支持的浏览器',
            content: '部分功能可能受到限制，请使用最新版电脑端的 Chrome 或 Edge 浏览器',
            positiveText: '知道了',
          })
        }
        window.showDirectoryPicker = () => {
          showError()
          throw new DOMException('不支持的浏览器', 'AbortError')
        }
        showError()
      }

      updateVersion().then(() => {
        if (version.value?.license === LicenseStatus.Pending || version.value?.hardwareAcceleration === HardwareAccelerationStatus.Pending) {
          setTimeout(updateVersion, 2000)
        }
      })
      try {
        await Promise.all([
          updateGenreList(),
          updateAddVersionList(),
          updateAssetDirs(),
          updateMusicList(),
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

            <CopyToButton/>
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
