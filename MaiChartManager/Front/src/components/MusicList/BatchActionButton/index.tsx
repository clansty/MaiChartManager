import { defineComponent, ref } from "vue";
import { NButton, NModal } from "naive-ui";
import MusicSelector from "@/components/MusicList/BatchActionButton/MusicSelector";
import EditProps from "@/components/MusicList/BatchActionButton/EditProps";

export enum STEP {
  None,
  Select,
  ChooseAction,
  EditProps,
}

export default defineComponent({
  setup(props) {
    const step = ref(STEP.None);
    const selectedMusicIds = ref<number[]>([]);

    const show = () => {
      step.value = STEP.Select;
      selectedMusicIds.value = [];
    }

    return () => <NButton secondary onClick={show}>
      批量操作

      <NModal
        preset="card"
        class="w-[min(60vw,80em)]"
        title="批量操作"
        show={step.value !== STEP.None}
        onUpdateShow={() => step.value = STEP.None}
      >
        {step.value === STEP.Select && <MusicSelector v-model:selectedMusicIds={selectedMusicIds.value} continue={() => step.value = STEP.EditProps}/>}
        {step.value === STEP.EditProps && <EditProps selectedMusicIds={selectedMusicIds.value} closeModal={() => step.value = STEP.None}/>}
      </NModal>
    </NButton>;
  }
})
