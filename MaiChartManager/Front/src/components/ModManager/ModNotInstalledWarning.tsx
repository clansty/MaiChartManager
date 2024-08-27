import { computed, defineComponent } from "vue";
import { NButton, NFlex, NModal } from "naive-ui";

export default defineComponent({
  props: {
    show: {type: Boolean, required: true},
    closeModal: {type: Function, required: true}
  },
  setup(props, {emit}) {
    const show = computed({
      get: () => props.show,
      set: (val) => props.closeModal()
    })
    return () => <NModal
      preset="card"
      class="w-[min(35vw,45em)]"
      title="没有安装 AquaMai"
      v-model:show={show.value}
    >{{
      default: () => '没有安装 MelonLoader 或者 AquaMai，在游戏中将无法加载歌曲封面。请点击 Mod 管理来安装',
      footer: () => <NFlex justify="end">
        <NButton onClick={() => props.closeModal(true)}>不再提示</NButton>
      </NFlex>
    }}</NModal>;
  }
})
