import { defineComponent, PropType, ref, computed } from 'vue';
import { IEntryState, ISectionState } from "@/client/apiGen";
import { NButton, NFlex } from "naive-ui";
import api from "@/client/api";

export default defineComponent({
  props: {
    entryStates: { type: Object as PropType<Record<string, IEntryState>>, required: true },
    sectionState: { type: Object as PropType<ISectionState>, required: true },
  },
  setup(props, { emit }) {
    return () => <NFlex align="center" class="m-l-35 translate-y--3">
      作者：Minepig
      <NButton onClick={() => api.OpenJudgeAccuracyInfoPdf()}>查看说明文件</NButton>
    </NFlex>;
  },
});
