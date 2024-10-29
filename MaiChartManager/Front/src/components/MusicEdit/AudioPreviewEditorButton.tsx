import { NButton, NFlex, NFormItem, NInput, NModal } from "naive-ui";
import { defineComponent, ref } from "vue";
import AudioPreviewEditor from "@/components/MusicEdit/AudioPreviewEditor";
import { showNeedPurchaseDialog, version } from "@/store/refs";

export default defineComponent({
  setup(props) {
    const show = ref(false)

    const handleClick = () => {
      if (version.value?.license !== 'Active') {
        showNeedPurchaseDialog.value = true
        return
      }
      show.value = true
    }

    return () => <NButton secondary onClick={handleClick}>
      编辑预览

      <NModal
        preset="card"
        class="w-[min(60vw,80em)]"
        title="编辑预览"
        v-model:show={show.value}
        maskClosable={false}
        closeOnEsc={false}
        closable={false}
      >{{
        default: () =>
          <AudioPreviewEditor closeModel={() => show.value = false}/>,
      }}</NModal>
    </NButton>;
  }
})
