import { AsyncComputedOnCancel, computedAsync } from '@vueuse/core';
import { ref } from 'vue';

export default <T>(evaluationCallback: (onCancel: AsyncComputedOnCancel) => T | Promise<T>, initialState: T | null = null, lazy = false) => {
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const reloadFlip = ref(false);
  const data = computedAsync(async (onCancel: AsyncComputedOnCancel) => {
    error.value = null;
    void reloadFlip.value;
    try {
      return await evaluationCallback(onCancel);
    }
    catch (e: any) {
      console.log(e);
      error.value = e;
    }
  }, initialState, {
    evaluating: loading,
    lazy,
  });
  return {
    data, error, loading,
    refresh: () => {
      reloadFlip.value = !reloadFlip.value;
    },
  };
}
