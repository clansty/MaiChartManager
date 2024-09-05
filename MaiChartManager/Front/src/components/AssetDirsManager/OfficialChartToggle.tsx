import { computed, defineComponent, PropType } from "vue";
import { GetAssetsDirsResult } from "@/client/apiGen";
import api from "@/client/api";
import { updateAssetDirs } from "@/store/refs";
import { NButton } from "naive-ui";

export default defineComponent({
  props: {
    dir: {type: Object as PropType<GetAssetsDirsResult>, required: true}
  },
  setup(props) {
    const isOfficialChart = computed(() => props.dir.subFiles!.some(it => it === 'OfficialChartsMark.txt'));
    const toggleSelfMadeChart = async () => {
      if (isOfficialChart.value) {
        await api.DeleteAssetDirTxt({
          dirName: props.dir.dirName,
          fileName: 'OfficialChartsMark.txt'
        });
      } else {
        await api.PutAssetDirTxtValue({
          dirName: props.dir.dirName,
          fileName: 'OfficialChartsMark.txt',
          content: '用于 AquaMai 标识此目录存放官谱'
        });
      }
      await updateAssetDirs();
    }

    return () => <NButton secondary onClick={toggleSelfMadeChart}>
      <span class="i-material-symbols-repeat text-lg m-r-1"/>
      存放
      {isOfficialChart.value ? '官谱' : '自制谱'}
    </NButton>;
  }
})
