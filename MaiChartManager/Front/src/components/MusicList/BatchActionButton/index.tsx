import { defineComponent, ref } from "vue";
import { NButton, NModal } from "naive-ui";
import MusicSelector from "@/components/MusicList/BatchActionButton/MusicSelector";
import EditProps from "@/components/MusicList/BatchActionButton/EditProps";
import { MusicXmlWithABJacket } from "@/client/apiGen";
import ChooseAction from "@/components/MusicList/BatchActionButton/ChooseAction";

export enum STEP {
  None,
  Select,
  ChooseAction,
  EditProps,
  ProgressDisplay
}

export default defineComponent({
  setup(props) {
    const step = ref(STEP.None);
    const selectedMusic = ref<MusicXmlWithABJacket[]>([]);

    const show = () => {
      step.value = STEP.Select;
      selectedMusic.value = [];
    }

    return () => <NButton secondary onClick={show}>
      批量操作

      <NModal
        preset="card"
        class={step.value === STEP.Select ? "w-[min(90vw,120em)]" : "w-[min(50vw,60em)]"}
        title="批量操作"
        show={step.value !== STEP.None}
        onUpdateShow={() => step.value = STEP.None}
      >
        {step.value === STEP.Select && <MusicSelector v-model:selectedMusicIds={selectedMusic.value} continue={() => step.value = STEP.ChooseAction}/>}
        {step.value === STEP.ChooseAction && <ChooseAction selectedMusic={selectedMusic.value} continue={(action: STEP) => step.value = action}/>}
        {step.value === STEP.EditProps && <EditProps selectedMusicIds={selectedMusic.value} closeModal={() => step.value = STEP.None}/>}
      </NModal>
    </NButton>;
  }
})
