import { defineComponent, ref } from "vue";
import { NButton, NModal, NProgress, useDialog, useMessage } from "naive-ui";
import api from "@/client/api";
import { updateAssetDirs } from "@/store/refs";
import axios from "axios";
import { UploadAssetDirResult } from "@/client/apiGen";

export default defineComponent({
  setup(props) {
    const dialog = useDialog();
    const importWait = ref(false);
    const message = useMessage();
    const showProgress = ref(false);
    const progress = ref(0);

    const importLocal = async () => {
      importWait.value = true;
      if (location.hostname !== '127.0.0.1') {
        // 浏览器模式
        let folderHandle: FileSystemDirectoryHandle;
        try {
          folderHandle = await window.showDirectoryPicker({
            id: 'uploadOptDir',
          });
        } catch (e) {
          importWait.value = false;
          console.log(e)
          return;
        }
        try {
          const data = new FormData();

          const processSubDir = async (dirName: string, folder: FileSystemDirectoryHandle) => {
            for await (const fileHandle of folder.values()) {
              if (fileHandle.kind === 'directory') {
                await processSubDir(`${dirName}/${fileHandle.name}`, fileHandle);
              } else {
                const file = await fileHandle.getFile();
                data.append('files[]', new File([file], `${dirName}/${fileHandle.name}`));
              }
            }
          }

          await processSubDir('', folderHandle);

          progress.value = 0;
          showProgress.value = true;
          const res = await axios.post<UploadAssetDirResult>(`/MaiChartManagerServlet/UploadAssetDirApi/${folderHandle.name}`, data, {
            onUploadProgress: data => {
              progress.value = Math.floor((data.progress || 0) * 100);
            },
            responseType: 'json'
          })
          showProgress.value = false;
          message.success(`导入 ${res.data.dirName} 成功`);
          updateAssetDirs();
        } catch (e) {
          console.log(e)
        } finally {
          importWait.value = false;
          showProgress.value = false;
        }
        return;
      }
      try {
        // 本地 webview 打开，使用本地模式
        await api.RequestLocalImportDir();
      } finally {
        importWait.value = false;
        updateAssetDirs();
      }
    }

    return () => <NButton onClick={importLocal} loading={importWait.value}>
      导入
      <NModal
        preset="card"
        class="w-[min(60vw,80em)]"
        title="进度"
        show={showProgress.value}
        maskClosable={false}
        closable={false}
        closeOnEsc={false}
      >
        <NProgress
          type="line"
          status="success"
          percentage={progress.value}
          indicator-placement="inside"
          processing
        />
      </NModal>
    </NButton>;
  }
})
