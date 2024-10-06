import { defineComponent, ref } from "vue";
import { NFlex, NProgress } from "naive-ui";

export const progressCurrent = ref(0);
export const progressAll = ref(100);
export const currentProcessItem = ref('');

export default defineComponent({
  setup(props) {
    return () => <NFlex vertical>
      <div>当前进度：{progressCurrent.value}/{progressAll.value}</div>
      <div>当前处理：{currentProcessItem.value}</div>
      <NProgress
        type="line"
        status="success"
        percentage={Math.floor(progressCurrent.value / progressAll.value * 100)}
        indicator-placement="inside"
        processing
      />
    </NFlex>;
  }
})
