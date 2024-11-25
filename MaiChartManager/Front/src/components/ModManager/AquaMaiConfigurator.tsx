import {defineComponent, PropType, ref, computed} from 'vue';
import {ConfigDto, Entry, IEntryState, ISectionState, Section} from "@/client/apiGen";
import {NAnchor, NAnchorLink, NDivider, NFlex, NForm, NFormItem, NInput, NInputNumber, NScrollbar, NSelect, NSwitch} from "naive-ui";
import {capitalCase} from "change-case";
import comments from "./modComments.yaml";
import _ from "lodash";

// const customSettingsPanels = import.meta.glob('./customSettingPanels/**/Panel.tsx', {eager: true})
// const getCustomPanelForSetting = (section: string, key?: string) => {
//   if (!key) {
//     return (customSettingsPanels[`./customSettingPanels/${section}/Panel.tsx`] as any)?.default
//   }
//   return (customSettingsPanels[`./customSettingPanels/${section}/${key}/Panel.tsx`] as any)?.default
// }

const ConfigEntry = defineComponent({
  props: {
    entry: {type: Object as PropType<Entry>, required: true},
    entryState: {type: Object as PropType<IEntryState>, required: true},
  },
  setup(props, {emit}) {
    return () => <NFormItem label={capitalCase(props.entry.name!)} labelPlacement="left" labelWidth="10em">
      <NFlex vertical class="w-full ws-pre-line">
        <NFlex class="h-34px" align="center">
          {(() => {
            // TODO: choices
            switch (props.entry.fieldType) {
              case 'System.Boolean':
                return <NSwitch v-model:value={props.entryState.value}/>;
              case 'System.String':
                return <NInput v-model:value={props.entryState.value} placeholder="" onUpdateValue={v => props.entryState.value = typeof v === 'string' ? v : ''}/>;
              case 'System.Int32':
                return <NInputNumber value={props.entryState.value} onUpdateValue={v => props.entryState.value = typeof v === 'number' ? v : 0} placeholder="" precision={0} step={1}/>;
            }
            return `不支持的类型: ${props.entry.fieldType}`;
          })()}
          {/*TODO*/}
          {/*{comments.shouldEnableOptions[key]?.[k] && !section[k] && <ProblemsDisplay problems={['需要开启此选项']}/>}*/}
        </NFlex>
        {/*// TODO 覆盖选项*/}
        {props.entry.attribute?.comment?.commentZh}
      </NFlex>
    </NFormItem>;
  },
});

const ConfigSection = defineComponent({
  props: {
    section: {type: Object as PropType<Section>, required: true},
    entryStates: {type: Object as PropType<Record<string, IEntryState>>, required: true},
    sectionState: {type: Object as PropType<ISectionState>, required: true},
  },
  setup(props, {emit}) {

    return () => <NFlex vertical>
      {!props.section.attribute!.alwaysEnabled && <NFormItem label={capitalCase(props.section.path!.split('.').pop()!)} labelPlacement="left" labelWidth="10em">
        <NFlex vertical class="w-full ws-pre-line">
          <NFlex class="h-34px" align="center">
            <NSwitch v-model:value={props.sectionState.enabled}/>
          </NFlex>
          {/*// TODO 覆盖选项*/}
          {props.section.attribute?.comment?.commentZh}
        </NFlex>
      </NFormItem>}
      {props.sectionState.enabled && !!props.section.entries?.length && <NFlex vertical class="p-l-15">
        {props.section.entries?.filter(it => !it.attribute?.hideWhenDefault || (it.attribute?.hideWhenDefault && !props.entryStates[it.path!].isDefault))
          .map((entry) => <ConfigEntry key={entry.path!} entry={entry} entryState={props.entryStates[entry.path!]}/>)}
      </NFlex>}
    </NFlex>;
  },
});

export default defineComponent({
  props: {
    config: {type: Object as PropType<ConfigDto>, required: true},
  },
  setup(props, {emit}) {
    const bigSections = computed(() => _.uniq(props.config.sections!.filter(it => !it.attribute?.exampleHidden).map(s => s.path?.split('.')[0])));

    return () => <div class="grid cols-[14em_auto]">
      <NAnchor type="block" offsetTarget="#scroll">
        {bigSections.value.map((key) => <NAnchorLink key={key} title={key} href={`#${key}`}/>)}
      </NAnchor>
      <NScrollbar class="max-h-60vh p-2"
        // @ts-ignore
                  id="scroll"
      >
        {bigSections.value.map((big) => <div id={big} key={big}>
          <NDivider titlePlacement="left" class="mt-2!">{big}</NDivider>
          {props.config.sections?.filter(it => it.path!.split('.')[0] === big && !it.attribute!.exampleHidden).map((section) => {
            // const CustomPanel = getCustomPanelForSetting(section.path!);
            //
            // if (CustomPanel) {
            //   return <CustomPanel config={section} commentsEmbedded={comments} key={section.path!}/>;
            // }

            return <ConfigSection key={section.path!} section={section}
                                  entryStates={props.config.entryStates!}
                                  sectionState={props.config.sectionStates![section.path!]}/>;
          })}
        </div>)}
      </NScrollbar>
    </div>;
  },
});
