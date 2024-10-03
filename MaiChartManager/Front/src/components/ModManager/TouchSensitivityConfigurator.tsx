import { defineComponent, h, PropType, ref } from "vue";
import { TouchSensitivityConfig } from "@/client/apiGen";
import TouchSensitivityDisplay from "@/components/ModManager/TouchSensitivityDisplay";
import { NButton, NButtonGroup, NDivider, NFlex, NFormItem, NInputNumber, NSwitch } from "naive-ui";

export default defineComponent({
  props: {
    config: {type: Object as PropType<TouchSensitivityConfig>, required: true},
  },
  setup(props) {
    const selected = ref<keyof TouchSensitivityConfig>()

    const applyPreset = (id: number) => {
      const PRESET_A = [90, 80, 70, 60, 50, 40, 30, 26, 23, 20, 10]
      const PRESET_OTHERS = [70, 60, 50, 40, 30, 20, 15, 10, 5, 1, 1]

      for (const key of Object.keys(props.config)) {
        if (key === "enable") continue
        props.config[key as keyof TouchSensitivityConfig] = (key.startsWith('a') ? PRESET_A : PRESET_OTHERS)[id] as any
      }
    }

    const applyToGlobal = (value: number) => {
      for (const key of Object.keys(props.config)) {
        if (key === "enable") continue
        props.config[key as keyof TouchSensitivityConfig] = value as any
      }
    }

    const applyToArea = (area: 'a' | 'b' | 'c' | 'd' | 'e', value: number) => {
      for (const key of Object.keys(props.config)) {
        if (key === "enable") continue
        if (key.startsWith(area)) {
          props.config[key as keyof TouchSensitivityConfig] = value as any
        }
      }
    }

    return () => <NFlex vertical class="mb">
      <NFormItem label="启用此功能" labelPlacement="left" labelWidth="10em">
        <NFlex vertical class="w-full ws-pre-line">
          <NFlex class="h-34px" align="center">
            <NSwitch v-model:value={props.config.enable}/>
          </NFlex>
          这里启用之后 Test 里的就不再起作用了，不过还是可以使用 Test 测试
        </NFlex>
      </NFormItem>
      <NFlex size="large">
        <TouchSensitivityDisplay config={props.config} v-model:currentSelected={selected.value}/>
        <NFlex vertical>
          应用预设到全局
          <NButtonGroup class="mb">
            {Array.from({length: 11}, (_, i) => <NButton secondary class={i > 0 ? 'b-l b-l-solid b-l-[rgba(255,255,255,0.5)]' : ''} onClick={() => applyPreset(i)}>{i - 5 > 0 && '+'}{i - 5}</NButton>)}
          </NButtonGroup>
          {selected.value ? <>
              {selected.value.toUpperCase()} 的灵敏度设置
              <NInputNumber v-model:value={props.config[selected.value]} min={0} max={100} step={1}/>
              <NFlex class="mb">
                <NButton secondary onClick={() => applyToGlobal(props.config[selected.value!] as any)}>应用到全局</NButton>
                <NButton secondary onClick={() => applyToArea(selected.value!.substring(0, 1) as any, props.config[selected.value!] as any)}>应用到 {selected.value.substring(0, 1).toUpperCase()} 区域</NButton>
              </NFlex>
            </> :
            <div class="mb">
              在左侧选择区域后，可以在这里进行灵敏度微调
            </div>
          }
          <div class="lh-relaxed">
            在 Test 模式下调整的灵敏度不是线性的<br/>
            A 区默认灵敏度 90, 80, 70, 60, 50, 40, 30, 26, 23, 20, 10<br/>
            其他区域默认灵敏度 70, 60, 50, 40, 30, 20, 15, 10, 5, 1, 1<br/>
            Test 里设置的 0 对应的是 40, 20 这一档，-5 是 90, 70，+5 是 10, 1<br/>
            Test 里的挡位更高，这里的数字越小，对于官机来说，灵敏度更大<br/>
            而 ADX 的灵敏度是反的，所以对于 ADX，这里的数字越大，灵敏度越大
          </div>
        </NFlex>
      </NFlex>
    </NFlex>;
  }
})
