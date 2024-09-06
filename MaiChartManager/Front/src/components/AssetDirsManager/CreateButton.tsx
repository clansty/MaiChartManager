import { NButton, NFlex, NForm, NFormItem, NInputGroup, NInputGroupLabel, NInputNumber, NModal, NSelect, useDialog } from "naive-ui";
import { computed, defineComponent, PropType, ref } from "vue";
import { addVersionList, assetDirs, genreList, selectedADir, updateAddVersionList, updateAssetDirs, updateGenreList } from "@/store/refs";
import api from "@/client/api";

export default defineComponent({
  setup(props) {
    const show = ref(false);
    const dialog = useDialog();

    const id = ref(0)

    const setShow = () => {
      id.value = 0
      for (const {dirName} of assetDirs.value) {
        const exec = /A(\d{3})$/.exec(dirName!);
        if (!exec) continue;
        const num = parseInt(exec[1]);
        if (num > id.value) id.value = num;
      }
      id.value++;
      if (id.value > 999) {
        id.value = 999;
        while (assetDirs.value.find(v => v.dirName === `A${id.value.toString().padStart(3, '0')}`)) {
          id.value--;
        }
      }
      show.value = true
    }

    const save = async () => {
      if (id.value < 1 || id.value > 999) return;
      if (assetDirs.value.find(v => v.dirName === `A${id.value.toString().padStart(3, '0')}`)) {
        dialog.info({title: '提示', content: '相同名称的目录已存在'});
        return;
      }
      show.value = false
      await api.CreateAssetDir(`A${id.value.toString().padStart(3, '0')}`);
      await updateAssetDirs();
    }

    return () => (
      <NButton onClick={setShow}>
        新建

        <NModal
          preset="card"
          class="w-[min(30vw,25em)]"
          title="新建资源目录"
          v-model:show={show.value}
        >{{
          default: () => <NForm label-placement="left" labelWidth="5em" showFeedback={false}>
            <NFlex vertical size="large">
              <NFormItem label="ID">
                <NInputGroup>
                  <NInputGroupLabel>A</NInputGroupLabel>
                  <NInputNumber v-model:value={id.value} class="w-full" min={1} max={999} format={it => it ? it.toString().padStart(3, '0') : '???'}/>
                </NInputGroup>
              </NFormItem>
            </NFlex>
          </NForm>,
          footer: () => <NFlex justify="end">
            <NButton onClick={save}>确定</NButton>
          </NFlex>
        }}</NModal>
      </NButton>
    )
  }
})
