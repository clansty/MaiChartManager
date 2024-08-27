import { computed, defineComponent, PropType } from "vue";
import { NButton, NFlex, NInputNumber, NModal } from "naive-ui";
import { IMPORT_STEP } from "@/components/ImportChartButton/index";

export default defineComponent({
  props: {
    show: {type: Boolean, required: true},
    closeModal: {type: Function, required: true},
    current: {type: Number as PropType<IMPORT_STEP>, required: true},
  },
  setup(props, {emit}) {
    const show = computed({
      get: () => props.show,
      set: (val) => props.closeModal()
    })
    return () => <NModal
      preset="card"
      class="w-[min(40vw,40em)]"
      title="正在导入..."
      closable={false}
      maskClosable={false}
      closeOnEsc={false}
      v-model:show={show.value}
    >
      <NFlex vertical class="text-4">
        <Step step={IMPORT_STEP.create} current={props.current} name="创建乐曲"/>
        <Step step={IMPORT_STEP.chart} current={props.current} name="转换谱面"/>
        <Step step={IMPORT_STEP.music} current={props.current} name="转码音频"/>
        <Step step={IMPORT_STEP.jacket} current={props.current} name="导入封面"/>
      </NFlex>
    </NModal>
  }
})

const Step = defineComponent({
  props: {
    name: String,
    step: {type: Number as PropType<IMPORT_STEP>, required: true},
    current: {type: Number as PropType<IMPORT_STEP>, required: true},
  },
  setup(props) {
    const icon = computed(() => {
      if (props.current < props.step) return 'i-mdi-dots-horizontal'
      if (props.current === props.step) return 'i-mdi-arrow-right-thin'
      return 'i-material-symbols-done'
    })

    const className = computed(() => {
      if (props.current < props.step) return 'text-zinc-400'
      if (props.current === props.step) return 'text-blue-600 font-bold'
      return 'text-green-600'
    })

    return () => <NFlex class={className.value} align="center">
      <div class={icon.value}/>
      {props.name}
      {props.current === props.step && '...'}
    </NFlex>
  }
})
