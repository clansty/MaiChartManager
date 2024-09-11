import { NButton, NButtonGroup, NDropdown } from "naive-ui";
import { defineComponent, ref } from "vue";
import ImportChartButton from "./ImportChartButton";
import CreateMusicModal from "@/components/ImportCreateChartButton/CreateMusicModal";

enum OPTION {
  None,
  CreateMusic,
}

const options = [
  {label: "创建乐曲", key: OPTION.CreateMusic},
]

export default defineComponent({
  setup(props) {
    const current = ref(OPTION.None)

    const handleSelect = (key: OPTION) => {
      current.value = key;
    }

    return () => <NButtonGroup>
      <ImportChartButton/>
      <NDropdown options={options} trigger="click" onSelect={handleSelect} placement="bottom-end">
        <NButton secondary class="px-.5 b-l b-l-solid b-l-[rgba(255,255,255,0.5)]">
          <span class="i-mdi-arrow-down-drop text-6 translate-y-.25"/>
        </NButton>
      </NDropdown>
      <CreateMusicModal show={current.value === OPTION.CreateMusic} closeModal={() => current.value = OPTION.None}/>
    </NButtonGroup>;
  }
})
