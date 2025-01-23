import { defineComponent, PropType, ref, computed } from 'vue';
import { IEntryState, ISectionState } from "@/client/apiGen";
import { NButton, NFlex } from "naive-ui";
import api from "@/client/api";
import { modInfo, updateModInfo } from "@/store/refs";

export default defineComponent({
  props: {
    entryStates: { type: Object as PropType<Record<string, IEntryState>>, required: true },
    sectionState: { type: Object as PropType<ISectionState>, required: true },
  },
  setup(props, { emit }) {
    const load = ref(false)

    const del = async () => {
      load.value = true
      await api.DeleteHidConflict();
      await updateModInfo();
      load.value = false
    }

    return () =>
      modInfo.value?.isHidConflictExist ? <NFlex align="center" class="m-l-35 translate-y--3">
          <span class="c-orange">检测到冲突的 Mod</span>
          <NButton secondary onClick={del} loading={load.value}>一键删除</NButton>
        </NFlex>
        : <NFlex align="center" class="m-l-35 translate-y--3">
          <span class="c-green-6">没有检测到冲突</span>
        </NFlex>
  },
});
