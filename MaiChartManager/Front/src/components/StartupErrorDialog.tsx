import { defineComponent, PropType, ref, computed, watch } from 'vue';
import { NFlex, NList, NListItem, NModal } from 'naive-ui';
import useAsync from "@/hooks/useAsync";
import api from "@/client/api";

export default defineComponent({
  // props: {
  // },
  setup(props, { emit }) {
    const errors = useAsync(() => api.GetAppStartupErrors())
    const show = ref(false)

    watch(() => errors.data.value, value => {
      if (!value) return
      if (value.data?.length) {
        show.value = true
      }
    })

    return () => <NModal
      preset="card"
      class="w-[min(50vw,60em)] bg-red-1!"
      title="启动过程中发生错误"
      v-model:show={show.value}
    >
      <NFlex vertical class="max-h-70vh overflow-y-auto">
        <NList showDivider={false}>
          {errors.data.value?.data?.map((error) => {
            return <NListItem>
              <div class="text-0.9em">
                {error}
              </div>
            </NListItem>
          })}
        </NList>
        请尽量修复这些问题，否则 MaiChartManager 可能无法按预期工作
      </NFlex>
    </NModal>;
  },
});
