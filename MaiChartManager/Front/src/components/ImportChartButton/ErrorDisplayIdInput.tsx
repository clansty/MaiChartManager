import { computed, defineComponent, PropType } from "vue";
import { NAlert, NButton, NCheckbox, NFlex, NForm, NFormItem, NInputNumber, NModal, NScrollbar } from "naive-ui";
import { ImportChartMessage, MessageLevel } from "@/client/apiGen";

export default defineComponent({
  props: {
    show: {type: Boolean, required: true},
    reject: {type: Boolean, required: true},
    ignoreLevel: Boolean,
    closeModal: {type: Function, required: true},
    proceed: {type: Function as PropType<() => any>, required: true},
    id: Number,
    errors: {type: Array as PropType<ImportChartMessage[]>, required: true}
  },
  setup(props, {emit}) {
    const show = computed({
      get: () => props.show,
      set: (val) => props.closeModal()
    })
    const id = computed({
      get: () => props.id,
      set: (val) => emit('update:id', val)
    })
    const ignoreLevel = computed({
      get: () => props.ignoreLevel,
      set: (val) => emit('update:ignoreLevel', val)
    })
    const dxBase = computed(() => props.id! >= 1e4 ? 1e4 : 0);

    return () => <NModal
      preset="card"
      class="w-[min(50vw,50em)]"
      title="导入提示"
      v-model:show={show.value}
    >{{
      default: () => <NFlex vertical size="large">
        <NScrollbar class="max-h-30vh">
          <NFlex vertical>
            {
              props.errors.map((error, i) => {
                let type: "default" | "info" | "success" | "warning" | "error" = "default";
                switch (error.level) {
                  case MessageLevel.Info:
                    type = 'info';
                    break;
                  case MessageLevel.Warning:
                    type = 'warning';
                    break;
                  case MessageLevel.Fatal:
                    type = 'error';
                    break;
                }
                return <NAlert key={i} type={type}>{error.message}</NAlert>
              })
            }
          </NFlex>
        </NScrollbar>
        {!props.reject && <>
          <NFormItem label="为新导入的歌曲指定 ID" labelPlacement="left" showFeedback={false}>
            <NInputNumber v-model:value={id.value} min={dxBase.value + 1} max={dxBase.value + 1e4 - 1} step={1}/>
          </NFormItem>
          <NCheckbox v-model:checked={ignoreLevel.value}>
            忽略定数，不参与 B50 计算
          </NCheckbox>
        </>}
      </NFlex>,
      footer: () => <NFlex justify="end">
        <NButton onClick={() => show.value = false}>{props.reject ? '关闭' : '取消'}</NButton>
        {!props.reject && <NButton onClick={props.proceed}>继续</NButton>}
      </NFlex>
    }}</NModal>;
  }
})
