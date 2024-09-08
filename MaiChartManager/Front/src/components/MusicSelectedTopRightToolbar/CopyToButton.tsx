import { defineComponent, ref } from "vue";
import api from "@/client/api";
import { selectMusicId, updateMusicList } from "@/store/refs";
import { NButton, useDialog } from "naive-ui";

export default defineComponent({
  setup() {
    const wait = ref(false);
    const dialog = useDialog();

    const copy = async () => {
      if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        dialog.info({
          title: '提示',
          content: '暂时不支持远程，请在本地使用'
        })
        return;
      }
      try {
        wait.value = true;
        await api.RequestCopyTo(selectMusicId.value);
      } finally {
        wait.value = false;
      }
    }

    return () => <NButton secondary onClick={copy} loading={wait.value}>
      复制到...
    </NButton>;
  }
});
