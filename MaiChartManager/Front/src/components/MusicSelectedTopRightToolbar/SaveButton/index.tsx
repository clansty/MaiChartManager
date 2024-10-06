import { defineComponent, ref, Teleport } from "vue";
import { selectedADir, selectedMusic, selectMusicId, updateMusicList } from "@/store/refs";
import api from "@/client/api";
import { NButton } from "naive-ui";
import animation from './animation.module.sass';
import { useMagicKeys, whenever } from '@vueuse/core'

export default defineComponent({
  setup() {
    const isAnimationShow = ref(false);

    const save = async () => {
      await api.SaveMusic(selectMusicId.value, selectedADir.value);
      isAnimationShow.value = true;
      setTimeout(() => {
        isAnimationShow.value = false;
      }, 250);
      await updateMusicList();
    }

    const {ctrl_s} = useMagicKeys({
      passive: false,
      onEventFired(e) {
        if (e.ctrlKey && e.key === 's' && e.type === 'keydown')
          e.preventDefault()
      },
    })
    whenever(ctrl_s, save);

    return () => selectedMusic.value && (
      <NButton secondary onClick={save} type={selectedMusic.value.modified ? "warning" : undefined}>
        保存
        {isAnimationShow.value && <Teleport to="body">
          <div class={animation.box}/>
        </Teleport>}
      </NButton>
    );
  }
});
