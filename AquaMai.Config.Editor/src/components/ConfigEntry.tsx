import { CheckBox, NumberInput, Select, TextInput } from '@munet/ui';
import { computed, defineComponent, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { ENTRY_LABEL_CLASS } from '../constants';
import { modComments } from '../modComments';
import type { ConfigEntry as ConfigEntryModel, EntryState } from '../types';
import { KeyCodeID } from '../types/KeyCodeID';
import { KeyCodeName } from '../types/KeyCodeName';
import { VKCode } from '../types/VKCode';
import { getNameForPath } from '../utils';
import { ProblemsDisplay } from './ProblemsDisplay';

export function optionsIoKeyMap(t: (key: string) => string): { label: string; value: string }[] {
  return [
    { label: t('mod.ioKeyMap.disabled'), value: 'None' },
    { label: t('mod.ioKeyMap.select'), value: 'Select' },
    { label: t('mod.ioKeyMap.select1P'), value: 'Select1P' },
    { label: t('mod.ioKeyMap.select2P'), value: 'Select2P' },
    { label: t('mod.ioKeyMap.service'), value: 'Service' },
    { label: t('mod.ioKeyMap.test'), value: 'Test' },
    { label: `${t('mod.ioKeyMap.customFn')}1`, value: 'CustomFn1' },
    { label: `${t('mod.ioKeyMap.customFn')}2`, value: 'CustomFn2' },
    { label: `${t('mod.ioKeyMap.customFn')}3`, value: 'CustomFn3' },
    { label: `${t('mod.ioKeyMap.customFn')}4`, value: 'CustomFn4' },
  ];
}

export function optionsKeyCodeOrName(t: (key: string) => string): { label: string; value: string }[] {
  return Object.entries(KeyCodeName).map(([label, value]) => {
    if (label.startsWith('CustomFn')) {
      const suffix = label.slice('CustomFn'.length);
      return { label: `${t('mod.ioKeyMap.customFn')}${suffix}`, value };
    }
    return { label, value };
  });
}

export function optionsVKCode(t: (key: string) => string): { label: string; value: string }[] {
  return Object.entries(VKCode).map(([label, value]) => {
    if (label === 'None') {
      return { label: t('mod.disable'), value };
    }
    return { label, value };
  });
}

export const ConfigEntry = defineComponent({
  props: {
    entry: { type: Object as PropType<ConfigEntryModel>, required: true },
    entryState: { type: Object as PropType<EntryState>, required: true },
  },
  setup(props) {
    const { t, te, locale } = useI18n();
    const optionsSoundChannel = [
      'None',
      'P1SpeakerLeft',
      'P1SpeakerRight',
      'P1HeadphoneLeft',
      'P1HeadphoneRight',
      'P2SpeakerLeft',
      'P2SpeakerRight',
      'P2HeadphoneLeft',
      'P2HeadphoneRight',
    ].map((channel) => ({
      label: t(`mod.soundChannel.${channel}`),
      value: channel,
    }));

    const comment = computed(() => {
      const localeKey = `mod.commentOverrides.${props.entry.path.replace(/\./g, '_')}`;
      if (te(localeKey)) {
        return t(localeKey);
      }
      if (locale.value.startsWith('zh')) {
        return props.entry.attribute.comment.commentZh;
      }
      return props.entry.attribute.comment.commentEn;
    });

    const renderControl = () => {
      const choices = modComments.options[props.entry.path];
      if (choices) {
        return <Select v-model:value={props.entryState.value} options={[...choices]} />;
      }

      switch (props.entry.fieldType) {
        case 'System.Boolean':
          return (
            <CheckBox v-model:value={props.entryState.value}>
              {props.entryState.value ? t('mod.on') : t('mod.off')}
            </CheckBox>
          );
        case 'System.String':
          return <TextInput class="w-full" innerClass="h-42px!" v-model:value={props.entryState.value} placeholder="" />;
        case 'System.Int32':
        case 'System.Int64':
          return <NumberInput innerClass="h-42px!" v-model:value={props.entryState.value} decimal={0} step={1} />;
        case 'System.UInt32':
        case 'System.UInt64':
          return <NumberInput innerClass="h-42px!" v-model:value={props.entryState.value} decimal={0} step={1} min={0} />;
        case 'System.Byte':
          return <NumberInput innerClass="h-42px!" v-model:value={props.entryState.value} decimal={0} step={1} min={0} max={255} />;
        case 'System.UInt16':
          return <NumberInput innerClass="h-42px!" v-model:value={props.entryState.value} decimal={0} step={1} min={0} max={65535} />;
        case 'System.Int16':
          return <NumberInput innerClass="h-42px!" v-model:value={props.entryState.value} decimal={0} step={1} min={-32768} max={32767} />;
        case 'System.Double':
        case 'System.Single':
          return <NumberInput innerClass="h-42px!" v-model:value={props.entryState.value} step={0.1} decimal={4} />;
        case 'AquaMai.Config.Types.KeyCodeOrName':
          return <Select v-model:value={props.entryState.value} options={optionsKeyCodeOrName(t)} />;
        case 'AquaMai.Config.Types.KeyCodeID':
          return (
            <Select
              v-model:value={props.entryState.value}
              options={Object.entries(KeyCodeID).map(([label, value]) => ({ label, value }))}
            />
          );
        case 'AquaMai.Config.Types.IOKeyMap':
        case 'AquaMai.Config.Types.AdxKeyMap':
          return <Select v-model:value={props.entryState.value} options={optionsIoKeyMap(t)} />;
        case 'AquaMai.Config.Types.VKCode':
          return <Select v-model:value={props.entryState.value} options={optionsVKCode(t)} />;
        case 'AquaMai.Config.Types.SoundChannel':
          return <Select v-model:value={props.entryState.value} options={optionsSoundChannel} />;
        default:
          return t('mod.unsupportedType', { type: props.entry.fieldType });
      }
    };

    return () => (
      <div class="flex gap-2 items-start" title={props.entry.path}>
        <div class={ENTRY_LABEL_CLASS}>
          {getNameForPath(props.entry.path, props.entry.name, props.entry.attribute.comment.nameZh, locale.value)}
        </div>
        <div class="flex flex-col gap-2 w-full ws-pre-line">
          <div class="flex gap-2 h-42px items-center">
            {renderControl()}
            {modComments.shouldEnableOptions[props.entry.path] && !props.entryState.value && (
              <ProblemsDisplay problems={[t('mod.needEnableOption')]} />
            )}
          </div>
          <div class="text-sm op-80">{comment.value}</div>
        </div>
      </div>
    );
  },
});
