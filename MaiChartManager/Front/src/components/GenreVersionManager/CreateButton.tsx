import { NButton, NFlex, NForm, NFormItem, NInputNumber, NModal, NSelect, useDialog } from "naive-ui";
import { computed, defineComponent, PropType, ref } from "vue";
import { addVersionList, assetDirs, genreList, selectedADir, updateAddVersionList, updateGenreList } from "@/store/refs";
import api from "@/client/api";
import { EDIT_TYPE } from "./index";

export default defineComponent({
  props: {
    setEditId: {type: Function as PropType<(id: number) => any>, required: true},
    type: Number as PropType<EDIT_TYPE>,
  },
  setup(props) {
    const show = ref(false);
    const text = computed(() => props.type === EDIT_TYPE.Genre ? '流派' : '版本');
    const list = props.type === EDIT_TYPE.Genre ? genreList : addVersionList;
    const dialog = useDialog();

    const assetDir = ref('')
    const id = ref(0)

    const setShow = () => {
      assetDir.value = selectedADir.value;
      for (let i = 100; i < 1000; i++) {
        if (list.value.some(it => it.id === i)) continue
        id.value = i;
        break;
      }
      show.value = true
    }

    const save = async () => {
      show.value = false
      const res = await (props.type === EDIT_TYPE.Genre ? api.AddGenre : api.AddVersion)({
        assetDir: assetDir.value,
        id: id.value,
      });
      if (res.error) {
        const error = res.error as any;
        dialog.warning({title: '创建失败', content: error.message || error});
        return;
      }
      if (res.data) {
        dialog.info({title: '创建失败', content: res.data})
        return;
      }

      await updateAddVersionList();
      await updateGenreList();
      props.setEditId(id.value);
    }

    return () => (
      <NButton onClick={setShow}>
        新建

        <NModal
          preset="card"
          class="w-[min(30vw,25em)]"
          title={`新建${text.value}`}
          v-model:show={show.value}
        >{{
          default: () => <NForm label-placement="left" labelWidth="5em" showFeedback={false}>
            <NFlex vertical size="large">
              <NFormItem label="ID">
                <NInputNumber v-model:value={id.value} class="w-full" min={1}/>
              </NFormItem>
              <NFormItem label="资源目录">
                <NSelect
                  v-model:value={assetDir.value}
                  options={assetDirs.value.filter(it => it.dirName !== 'A000').map(dir => ({label: dir.dirName!, value: dir.dirName!}))}
                />
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
