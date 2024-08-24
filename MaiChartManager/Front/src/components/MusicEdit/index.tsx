import { computed, defineComponent, effect, onMounted, PropType, ref, watch } from "vue";
import { Chart, GenreXml, MusicXml } from "@/client/apiGen";
import { addVersionList, genreList, selectedADir, selectedMusicBrief, selectMusicId } from "@/store/refs";
import api from "@/client/api";
import { NFlex, NForm, NFormItem, NInput, NInputNumber, NSelect, NTabPane, NTabs, SelectOption } from "naive-ui";
import JacketBox from "./JacketBox";
import dxIcon from "@/assets/dxIcon.png";
import stdIcon from "@/assets/stdIcon.png";
import ChartPanel from "./ChartPanel";
import { DIFFICULTY, LEVEL_COLOR } from "@/consts";

const Component = defineComponent({
  setup() {
    const info = ref<MusicXml | null>();
    const selectedLevel = ref(0);

    onMounted(async () => {
      if (!selectMusicId.value) {
        info.value = null;
        return;
      }
      const response = await api.GetMusicDetail(selectMusicId.value);
      info.value = response.data;

      const firstEnabledChart = info.value!.charts!.findIndex(chart => chart.enable);
      if (firstEnabledChart >= 0) {
        selectedLevel.value = firstEnabledChart;
      }

      watch(() => info.value?.name, sync('name', api.EditMusicName));
      watch(() => info.value?.artist, sync('artist', api.EditMusicArtist));
      watch(() => info.value?.bpm, sync('bpm', api.EditMusicBpm));
      watch(() => info.value?.version, sync('version', api.EditMusicVersion));
      watch(() => info.value?.genreId, sync('genreId', api.EditMusicGenre));
      watch(() => info.value?.addVersionId, sync('addVersionId', api.EditMusicAddVersion));
    });

    const genreOptions = computed(() => genreList.value.map(genre => ({label: genre.genreName, value: genre.id})));
    const addVersionOptions = computed(() => addVersionList.value.map(genre => ({label: genre.genreName, value: genre.id})));

    const sync = (key: keyof MusicXml, method: Function) => async () => {
      if (!info.value) return;
      selectedMusicBrief.value!.modified = true;
      await method(info.value.id!, info.value[key]!);
    }

    return () => info.value && <NForm showFeedback={false} labelPlacement="top" disabled={selectedADir.value === 'A000'}>
      <div class="grid cols-[1fr_12em] gap-5">
        <NFlex vertical>
          <NFlex align="center">
            <img src={info.value.id! >= 1e4 ? dxIcon : stdIcon} class="h-6"/>
            <div class="c-gray-5">
              <span class="op-70">ID: </span>
              <span class="select-text">{info.value.id}</span>
            </div>
          </NFlex>
          <NFormItem label="歌曲名称">
            <NInput v-model:value={info.value.name}/>
          </NFormItem>
          <NFormItem label="作者">
            <NInput v-model:value={info.value.artist}/>
          </NFormItem>
        </NFlex>
        <JacketBox info={info.value} class="h-12em w-12em"/>
      </div>
      <NFlex vertical>
        <NFormItem label="BPM">
          <NInputNumber showButton={false} class="w-full" v-model:value={info.value.bpm}/>
        </NFormItem>
        <NFormItem label="版本">
          <NInputNumber showButton={false} class="w-full" v-model:value={info.value.version}/>
        </NFormItem>
        <NFormItem label="分类">
          <NSelect options={genreOptions.value as any} v-model:value={info.value.genreId}
                   renderLabel={(option: SelectOption) => <GenreOption genre={genreList.value.find(it => it.id === option.value)!}/>}/>
        </NFormItem>
        <NFormItem label="版本分类">
          <NSelect options={addVersionOptions.value as any} v-model:value={info.value.addVersionId}
                   renderLabel={(option: SelectOption) => <GenreOption genre={addVersionList.value.find(it => it.id === option.value)!}/>}/>
        </NFormItem>
        <NTabs type="line" animated barWidth={0} v-model:value={selectedLevel.value} class="levelTabs"
               style={{'--n-tab-padding': 0, '--n-pane-padding-top': 0, '--n-tab-text-color-hover': ''}}>
          {new Array(5).fill(0).map((_, index) =>
            <NTabPane key={index} name={index} tab={DIFFICULTY[index]}>
              {{
                tab: () => <Tab index={index} chart={info.value?.charts![index]!} selected={selectedLevel.value === index}/>,
                default: () => <ChartPanel chart={info.value?.charts![index]!} songId={info.value?.id!} chartIndex={index}
                                           class="pxy pt-2 rounded-[0_0_.5em_.5em]" style={{backgroundColor: `color-mix(in srgb, ${LEVEL_COLOR[index]}, transparent 90%)`}}/>
              }}
            </NTabPane>
          )}
        </NTabs>
      </NFlex>
    </NForm>;
  },
})

const Tab = defineComponent({
  props: {
    index: {type: Number, required: true},
    chart: {type: Object as PropType<Chart>, required: true},
    selected: Boolean,
  },
  setup(props) {
    return () => <div class={`w-full py-3 flex justify-center rounded-[.5em_.5em_0_0] pos-relative of-hidden ${props.selected && 'c-white font-500 pb-4'}`}
                      style={{
                        backgroundColor: `color-mix(in srgb, ${LEVEL_COLOR[props.index]}, transparent ${props.selected ? 0 : 40}%)`,
                        transition: 'background-color 0.3s, padding-bottom 0.3s'
                      }}>
      {
        !props.chart.enable &&
        <div class="pos-absolute top-0 bottom-0 left-0 right-0" style={{
          backgroundPosition: '0 0',
          background: `repeating-linear-gradient(-45deg,
                        rgba(255, 255, 255, .3) 0, rgba(255, 255, 255, .3) 5%, rgba(255, 255, 255, .05) 5%, rgba(255, 255, 255, .05) 10%)`
        }}/>
      }
      <span class="z-1">{DIFFICULTY[props.index]}</span>
    </div>
  }
})

const GenreOption = defineComponent({
  props: {
    genre: {type: Object as PropType<GenreXml>, required: true},
  },
  setup(props) {
    return () => <NFlex align="center">
      <div class="h-4 w-4 rounded-full" style={{backgroundColor: `rgb(${props.genre.colorR}, ${props.genre.colorG}, ${props.genre.colorB})`}}/>
      {props.genre.genreName}
    </NFlex>;
  },
})

export default defineComponent({
  setup() {
    // 加载时销毁，防止 watch 被执行
    return () => <Component key={selectMusicId.value}/>;
  }
})
