import { defineComponent } from "vue";
import { selectMusicId } from "@/store/refs";
import DeleteMusicButton from "@/components/MusicSelectedTopRightToolbar/DeleteMusicButton";
import SaveButton from "@/components/MusicSelectedTopRightToolbar/SaveButton";

export default defineComponent({
  setup() {
    return () => !!selectMusicId.value && <>
      <DeleteMusicButton/>
      <SaveButton/>
    </>;
  }
})
