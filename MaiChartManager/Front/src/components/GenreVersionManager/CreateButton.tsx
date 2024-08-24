import { NButton, NFlex, NForm, NFormItem, NInputNumber, NModal, NSelect } from "naive-ui";
import { computed, defineComponent, PropType, ref } from "vue";
import { addVersionList, assetDirs, genreList, selectedADir, updateAddVersionList, updateGenreList } from "@/store/refs";
import api from "@/client/api";

export default defineComponent({
  props: {
    setEditId: {type: Function as PropType<(id: number) => any>, required: true},
    type: String as PropType<"genre" | "version">,
  },
  setup(props) {
    const show = ref(false);
    const text = computed(() => props.type === 'genre' ? '分类' : '版本');
    const list = props.type === 'genre' ? genreList : addVersionList;

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
      await (props.type === 'genre' ? api.AddGenre : api.AddVersion)({
        assetDir: assetDir.value,
        id: id.value,
      });
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
                <NInputNumber v-model:value={id.value} class="w-full"/>
              </NFormItem>
              <NFormItem label="资源目录">
                <NSelect
                  v-model:value={assetDir.value}
                  options={assetDirs.value.map(dir => ({label: dir, value: dir}))}
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
