import { computed, defineComponent } from "vue";
import { NButton, NFlex, NInputNumber, NModal } from "naive-ui";

export default defineComponent({
  props: {
    show: {type: Boolean, required: true},
    closeModal: {type: Function, required: true},
    title: {type: String, required: true}
  },
  setup(props, {emit}) {
    const show = computed({
      get: () => props.show,
      set: (val) => props.closeModal()
    })
    return () => <NModal
      preset="card"
      class="w-[min(30vw,25em)]"
      title={props.title}
      closable={false}
      maskClosable={false}
      closeOnEsc={false}
      v-model:show={show.value}
    />
  }
})
