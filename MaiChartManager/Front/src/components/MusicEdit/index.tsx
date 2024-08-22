import { computed, defineComponent, PropType, ref, watch } from "vue";
import { GenreXml, MusicXml } from "@/client/apiGen";
import { addVersionList, genreList, selectMusicId } from "@/store/refs";
import api from "@/client/api";
import { NFlex, NForm, NFormItem, NInput, NInputNumber, NSelect, NTabPane, NTabs, SelectOption } from "naive-ui";
import JacketBox from "@/components/MusicEdit/JacketBox";
import dxIcon from "@/assets/dxIcon.png";
import stdIcon from "@/assets/stdIcon.png";
import ChartPanel from "@/components/MusicEdit/ChartPanel";

const DIFFICULTY = ['Basic', 'Advanced', 'Expert', 'Master', 'Re:Master'] as const;
const LEVEL_COLOR = ['rgb(34, 187, 91)', 'rgb(251, 156, 45)', 'rgb(246, 72, 97)', 'rgb(158, 69, 226)',
  'rgb(228, 166, 255)'] as const;

export default defineComponent({
  setup() {
    const info = ref<MusicXml>();

    watch(() => selectMusicId.value, async () => {
      if (!selectMusicId.value) return;
      const response = await api.GetMusicDetail(selectMusicId.value);
      info.value = response.data;
    }, {immediate: true});

    const genreOptions = computed(() => genreList.value.map(genre => ({label: genre.genreName, value: genre.id})));
    const addVersionOptions = computed(() => addVersionList.value.map(genre => ({label: genre.genreName, value: genre.id})));
    const selectedLevel = ref(0);

    return () => info.value && <NForm showFeedback={false} labelPlacement="top">
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
            <NInput v-model:value={info.value.name} onBlur={() => api.EditMusicName(info.value!.id!, info.value!.name!)}/>
          </NFormItem>
          <NFormItem label="作者">
            <NInput v-model:value={info.value.artist} onBlur={() => api.EditMusicArtist(info.value!.id!, info.value!.artist!)}/>
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
                tab: () => <div class={`w-full py-3 flex justify-center rounded-[.5em_.5em_0_0] ${selectedLevel.value === index && 'c-white font-500 pb-4'}`}
                                style={{
                                  backgroundColor: `color-mix(in srgb, ${LEVEL_COLOR[index]}, transparent ${(selectedLevel.value === index) ? 0 : 40}%)`,
                                  transition: 'background-color 0.5s, padding-bottom 0.5s'
                                }}>
                  {DIFFICULTY[index]}
                </div>,
                default: () => <ChartPanel chart={info.value?.charts![index]!} songId={info.value?.id!} class="pxy pt-2 rounded-[0_0_.5em_.5em]"
                                           style={{backgroundColor: `color-mix(in srgb, ${LEVEL_COLOR[index]}, transparent 90%)`}}/>
              }}
            </NTabPane>
          )}
        </NTabs>
      </NFlex>
    </NForm>;
  },
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
