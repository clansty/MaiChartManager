import { defineComponent, ref } from "vue";
import { NButton, NFlex, NList, NListItem, NModal, NScrollbar, useDialog } from "naive-ui";
import { assetDirs, updateAssetDirs } from "@/store/refs";
import AssetDirDisplay from "@/components/AssetDirsManager/AssetDirDisplay";
import CreateButton from "./CreateButton";
import api from "@/client/api";

export default defineComponent({
  setup(props) {
    const show = ref(false);
    const dialog = useDialog();
    const importWait = ref(false);

    const importLocal = async () => {
      if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        dialog.info({
          title: '提示',
          content: '暂时不支持远程导入，请在本地使用'
        })
        return;
      }
      try {
        importWait.value = true;
        await api.RequestLocalImportDir();
      } finally {
        importWait.value = false;
        updateAssetDirs();
      }
    }

    return () => <NButton secondary onClick={() => show.value = true}>
      资源目录管理

      <NModal
        preset="card"
        class="w-[min(70vw,80em)]"
        title="资源目录管理"
        v-model:show={show.value}
      >
        <NFlex vertical size="large">
          <NFlex>
            <CreateButton/>
            <NButton onClick={importLocal} loading={importWait.value}>导入</NButton>
          </NFlex>
          <NScrollbar class="h-80vh">
            <NList>
              {assetDirs.value.map(it => <NListItem>
                <AssetDirDisplay dir={it}/>
              </NListItem>)}
            </NList>
          </NScrollbar>
        </NFlex>
      </NModal>
    </NButton>;
  }
})
