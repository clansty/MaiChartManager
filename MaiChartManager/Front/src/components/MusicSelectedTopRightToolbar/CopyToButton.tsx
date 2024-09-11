import { computed, defineComponent, ref } from "vue";
import api from "@/client/api";
import { globalCapture, selectedMusicBrief, selectMusicId, updateMusicList } from "@/store/refs";
import { NButton, NButtonGroup, NDropdown, useDialog, useMessage } from "naive-ui";
import { ZipReader } from "@zip.js/zip.js";

const getSubDirFile = async (folderHandle: FileSystemDirectoryHandle, fileName: string) => {
  const pathParts = fileName.split('/');

  let dirHandle = folderHandle;
  for (let i = 0; i < pathParts.length - 1; i++) {
    dirHandle = await dirHandle.getDirectoryHandle(pathParts[i], {create: true});
  }
  return await dirHandle.getFileHandle(pathParts[pathParts.length - 1], {create: true});
}

export default defineComponent({
  setup() {
    const wait = ref(false);
    const dialog = useDialog();
    const message = useMessage();

    const options = computed(() => [
      {label: () => <a href={`/MaiChartManagerServlet/ExportOptApi/${selectMusicId.value}`} download={`${selectMusicId.value} - ${selectedMusicBrief.value?.name}.zip`}>导出 Zip</a>},
    ])

    const copy = async () => {
      wait.value = true;
      if (location.hostname !== '127.0.0.1') {
        // 浏览器模式，使用 zip.js 获取并解压
        let folderHandle: FileSystemDirectoryHandle;
        try {
          folderHandle = await window.showDirectoryPicker({
            id: 'copyToSaveDir',
            mode: 'readwrite'
          });
        } catch (e) {
          wait.value = false;
          console.log(e)
          return;
        }
        try {
          const zip = await fetch(`/MaiChartManagerServlet/ExportOptApi/${selectMusicId.value}`)
          const zipReader = new ZipReader(zip.body!);
          const entries = zipReader.getEntriesGenerator();
          for await (const entry of entries) {
            console.log(entry.filename);
            if (entry.filename.endsWith('/')) {
              continue;
            }
            const fileHandle = await getSubDirFile(folderHandle, entry.filename);
            const writable = await fileHandle.createWritable();
            await entry.getData!(writable);
          }
          message.success('成功');
        } catch (e) {
          globalCapture(e, "下载歌曲失败")
        }
        finally {
          wait.value = false;
        }
        return;
      }
      try {
        // 本地 webview 打开，使用本地模式
        await api.RequestCopyTo(selectMusicId.value);
      } finally {
        wait.value = false;
      }
    }

    return () =>
      <NButtonGroup>
        <NButton secondary onClick={copy} loading={wait.value}>
          复制到...
        </NButton>
        <NDropdown options={options.value} trigger="click" placement="bottom-end">
          <NButton secondary class="px-.5 b-l b-l-solid b-l-[rgba(255,255,255,0.5)]">
            <span class="i-mdi-arrow-down-drop text-6 translate-y-.25"/>
          </NButton>
        </NDropdown>
      </NButtonGroup>
      ;
  }
});
