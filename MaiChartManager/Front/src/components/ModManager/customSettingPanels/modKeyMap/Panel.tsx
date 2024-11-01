import { defineComponent, h, PropType } from "vue";
import { AquaMaiModKeyMapConfig, ModKeyCode } from "@/client/apiGen";
import { NCheckbox, NFlex, NFormItem, NSelect, NSwitch } from "naive-ui";
import { capitalCase, pascalCase } from "change-case";

const options = Object.entries(ModKeyCode).map(([key, value]) => ({label: key, value}))

export default defineComponent({
  props: {
    config: {type: Object as PropType<AquaMaiModKeyMapConfig>, required: true},
    commentsEmbedded: {type: Object as PropType<Record<string, Record<string, string>>>, required: true},
  },
  setup(props) {
    return () => <div>
      <div class="grid cols-2">
        {
          Object.entries(props.config).filter(([k, v]) => typeof v === 'string')
            .map(([key]) => <NFormItem key={key} label={capitalCase(key)} labelPlacement="left" labelWidth="10em">
              <NFlex vertical class="w-full ws-pre-line">
                <NFlex class="h-34px" align="center">
                  <div class="w-0 grow">
                    <NSelect v-model:value={props.config[key as keyof AquaMaiModKeyMapConfig]} options={options}/>
                  </div>
                  <NCheckbox v-model:checked={props.config[key + 'LongPress' as keyof AquaMaiModKeyMapConfig]}>长按</NCheckbox>
                </NFlex>
                {props.commentsEmbedded.ModKeyMap[pascalCase(key) as any]}
              </NFlex>
            </NFormItem>)
        }
      </div>
      <NFormItem label={capitalCase('EnableNativeQuickRetry')} labelPlacement="left" labelWidth="10em">
        <NFlex vertical class="w-full ws-pre-line">
          <NFlex class="h-34px" align="center">
            <NSwitch v-model:value={props.config.enableNativeQuickRetry}/>
          </NFlex>
          {props.commentsEmbedded.ModKeyMap.EnableNativeQuickRetry}
        </NFlex>
      </NFormItem>
    </div>;
  }
})
