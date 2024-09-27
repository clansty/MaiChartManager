import { defineComponent, onMounted, ref } from "vue";
import { CheckConflictEntry } from "@/client/apiGen";
import api from "@/client/api";
import { DataTableColumns, NButton, NDataTable, NFlex } from "naive-ui";
import { globalCapture } from "@/store/refs";

const columns: DataTableColumns<CheckConflictEntry> = [
  {type: 'selection'},
  {title: '歌曲 ID', key: 'musicId'},
  {title: '歌曲名称', key: 'musicName'},
  {title: '被覆盖的资源', key: 'lowerDir'},
  {title: '覆盖的资源', key: 'upperDir'},
  {title: '文件名', key: 'fileName'},
]

export default defineComponent({
  props: {
    dir: {type: String, required: true}
  },
  setup(props) {
    const data = ref<(CheckConflictEntry & { key: number })[]>([]);
    const selectedIds = ref<number[]>([]);
    const load = ref(true);

    const update = async () => {
      selectedIds.value = [];
      try {
        const req = await api.CheckConflict(props.dir);
        data.value = req.data.map((it, idx) => ({...it, key: idx}));
        load.value = false;
      } catch (e) {
        globalCapture(e, '检查冲突时出错');
      }
    }

    onMounted(update)

    const requestDelete = async () => {
      load.value = true;
      try {
        const req = selectedIds.value.map(it => ({
          type: data.value[it].type,
          assetDir: data.value[it].upperDir,
          fileName: data.value[it].fileName,
        }));
        selectedIds.value = [];
        await api.DeleteAssets(req);
      } catch (e) {
        globalCapture(e, '删除冲突资源时出错');
      }
      update();
    }

    return () => <NFlex size="large">
      <NButton onClick={requestDelete} disabled={!selectedIds.value.length}>删除选中</NButton>
      <NDataTable
        columns={columns}
        data={data.value}
        onUpdateCheckedRowKeys={keys => selectedIds.value = keys as number[]}
        loading={load.value}
        max-height="70vh"
      >{{
        empty: () => <div class="c-neutral">没有冲突资源</div>,
      }}</NDataTable>
    </NFlex>;
  }
})
