import { NButton, NFlex, NFormItem, NInput, NModal } from "naive-ui";
import { defineComponent, ref } from "vue";
import AudioPreviewEditor from "@/components/MusicEdit/AudioPreviewEditor";

export default defineComponent({
  setup(props) {
    const show = ref(false)

    return () => <NButton secondary onClick={() => show.value = true}>
      编辑预览

      <NModal
        preset="card"
        class="w-[min(60vw,80em)]"
        title="编辑预览"
        v-model:show={show.value}
        maskClosable={false}
      >{{
        default: () =>
          <AudioPreviewEditor closeModel={() => show.value = false}/>,
      }}</NModal>
    </NButton>;
  }
})
