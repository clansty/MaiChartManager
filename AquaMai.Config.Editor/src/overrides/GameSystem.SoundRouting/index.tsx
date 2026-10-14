import { computed, defineComponent, type PropType } from 'vue';
import type { ConfigSection, EntryState, SectionState } from '../../types';
import { Select, NumberInput, WhateverNaviBar } from '@munet/ui';
import { useI18n } from 'vue-i18n';
import { getNameForPath } from '../../utils';
import { ConfigEntry } from '../../components/ConfigEntry';
import { ENTRY_GROUP_PADDING, ENTRY_LABEL_CLASS } from '../../constants';

const ROUTING_PREFIX = 'GameSystem.SoundRouting.';
const SOUND_PREFIX = 'GameSystem.Sound.';
const ENABLE_8CH_PATH = SOUND_PREFIX + 'Enable8Channel';

const routeKeys = [
  'RouteP1SpeakerLeftTo', 'RouteP1SpeakerRightTo',
  'RouteP1HeadphoneLeftTo', 'RouteP1HeadphoneRightTo',
  'RouteP2SpeakerLeftTo', 'RouteP2SpeakerRightTo',
  'RouteP2HeadphoneLeftTo', 'RouteP2HeadphoneRightTo',
] as const;

interface Preset {
  name: string;
  routes: Record<typeof routeKeys[number], string>;
  enable8Channel: boolean;
}

const presets: Preset[] = [
  {
    name: '2ch外放',
    routes: {
      RouteP1SpeakerLeftTo: 'P1SpeakerLeft',
      RouteP1SpeakerRightTo: 'P1SpeakerRight',
      RouteP1HeadphoneLeftTo: 'None',
      RouteP1HeadphoneRightTo: 'None',
      RouteP2SpeakerLeftTo: 'None',
      RouteP2SpeakerRightTo: 'None',
      RouteP2HeadphoneLeftTo: 'None',
      RouteP2HeadphoneRightTo: 'None',
    },
    enable8Channel: false,
  },
  {
    name: '2ch耳机',
    routes: {
      RouteP1SpeakerLeftTo: 'None',
      RouteP1SpeakerRightTo: 'None',
      RouteP1HeadphoneLeftTo: 'P1SpeakerLeft',
      RouteP1HeadphoneRightTo: 'P1SpeakerRight',
      RouteP2SpeakerLeftTo: 'None',
      RouteP2SpeakerRightTo: 'None',
      RouteP2HeadphoneLeftTo: 'None',
      RouteP2HeadphoneRightTo: 'None',
    },
    enable8Channel: false,
  },
  {
    name: '8ch',
    routes: {
      RouteP1SpeakerLeftTo: 'P1SpeakerLeft',
      RouteP1SpeakerRightTo: 'P1SpeakerRight',
      RouteP1HeadphoneLeftTo: 'P1HeadphoneLeft',
      RouteP1HeadphoneRightTo: 'P1HeadphoneRight',
      RouteP2SpeakerLeftTo: 'P2SpeakerLeft',
      RouteP2SpeakerRightTo: 'P2SpeakerRight',
      RouteP2HeadphoneLeftTo: 'P2HeadphoneLeft',
      RouteP2HeadphoneRightTo: 'P2HeadphoneRight',
    },
    enable8Channel: true,
  },
];

export default defineComponent({
  props: {
    section: { type: Object as PropType<ConfigSection>, required: true },
    entryStates: { type: Object as PropType<Record<string, EntryState>>, required: true },
    sectionState: { type: Object as PropType<SectionState>, required: true },
    allSectionStates: { type: Object as PropType<Record<string, SectionState>> },
  },
  setup(props) {
    const { t, locale } = useI18n();

    const soundChannelOptions = ['None', 'P1SpeakerLeft', 'P1SpeakerRight', 'P1HeadphoneLeft', 'P1HeadphoneRight', 'P2SpeakerLeft', 'P2SpeakerRight', 'P2HeadphoneLeft', 'P2HeadphoneRight']
      .map(channel => ({ label: t('mod.soundChannel.' + channel), value: channel }));

    const p1Routes = ['RouteP1SpeakerLeftTo', 'RouteP1SpeakerRightTo', 'RouteP1HeadphoneLeftTo', 'RouteP1HeadphoneRightTo'];
    const p2Routes = ['RouteP2SpeakerLeftTo', 'RouteP2SpeakerRightTo', 'RouteP2HeadphoneLeftTo', 'RouteP2HeadphoneRightTo'];
    const p1Volumes = ['VolumeP1Speaker', 'VolumeP1Headphone'];
    const p2Volumes = ['VolumeP2Speaker', 'VolumeP2Headphone'];
    const knownPaths = [...p1Routes, ...p2Routes, ...p1Volumes, ...p2Volumes].map(it => ROUTING_PREFIX + it);

    const findEntry = (key: string) => props.section.entries?.find(it => it.path === ROUTING_PREFIX + key);

    // 检测当前配置匹配哪个预设
    const activePreset = computed(() => {
      const enable8ChEntry = props.entryStates[ENABLE_8CH_PATH];
      if (!enable8ChEntry) return null;

      for (const preset of presets) {
        const routesMatch = routeKeys.every(key => {
          const entry = props.entryStates[ROUTING_PREFIX + key];
          return entry && entry.value === preset.routes[key];
        });
        const channelMatch = !!enable8ChEntry.value === preset.enable8Channel;
        if (routesMatch && channelMatch) return preset.name;
      }
      return null;
    });

    // 应用预设：只修改路由和 Enable8Channel，其他选项不动
    const applyPreset = (preset: Preset) => {
      for (const key of routeKeys) {
        const entry = props.entryStates[ROUTING_PREFIX + key];
        if (entry) entry.value = preset.routes[key];
      }
      const enable8ChEntry = props.entryStates[ENABLE_8CH_PATH];
      if (enable8ChEntry) enable8ChEntry.value = preset.enable8Channel;

      // 确保 GameSystem.Sound 和 GameSystem.SoundRouting 都开着
      if (props.allSectionStates) {
        const soundState = props.allSectionStates['GameSystem.Sound'];
        if (soundState) soundState.enabled = true;
      }
      props.sectionState.enabled = true;
    };

    const naviItems = computed(() => presets.map(preset => ({
      name: preset.name,
      selected: activePreset.value === preset.name,
      onClick: () => applyPreset(preset),
    })));

    const renderSelect = (key: string) => {
      const entry = findEntry(key);
      if (!entry) return null;
      return <div class="flex gap-2 items-start">
        <div class={ENTRY_LABEL_CLASS}>{getNameForPath(entry.path!, entry.name!, entry.attribute?.comment?.nameZh, locale.value)}</div>
        <Select class="w-full" v-model:value={props.entryStates[ROUTING_PREFIX + key]!.value} options={soundChannelOptions}/>
      </div>;
    };

    const renderVolume = (key: string) => {
      const entry = findEntry(key);
      if (!entry) return null;
      return <div class="flex gap-2 items-start">
        <div class={ENTRY_LABEL_CLASS}>{getNameForPath(entry.path!, entry.name!, entry.attribute?.comment?.nameZh, locale.value)}</div>
        <NumberInput innerClass="h-42px!" v-model:value={props.entryStates[ROUTING_PREFIX + key]!.value as number} step={0.1} decimal={2}/>
      </div>;
    };

    return () => <div class="flex flex-col gap-2">
      <div class="pl-40 flex items-center gap-2">
        预设:
        <WhateverNaviBar items={naviItems.value}/>
      </div>
      <div class={["grid grid-cols-1 min-[500px]:grid-cols-2 gap-y-12px gap-x-16px", ENTRY_GROUP_PADDING]}>
        <div class="flex flex-col gap-2">
          {p1Routes.map(renderSelect)}
          {p1Volumes.map(renderVolume)}
        </div>
        <div class="flex flex-col gap-2">
          {p2Routes.map(renderSelect)}
          {p2Volumes.map(renderVolume)}
        </div>
      </div>
      {props.section.entries?.filter(it => !knownPaths.includes(it.path!))
        .map((entry) => {
          const state = props.entryStates[entry.path];
          return state ? <ConfigEntry key={entry.path} entry={entry} entryState={state} /> : null;
        })}
    </div>;
  },
});
