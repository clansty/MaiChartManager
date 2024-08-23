import { computed, defineComponent, PropType, watch } from "vue";
import { Chart, MusicXml } from "@/client/apiGen";
import { NFlex, NForm, NFormItem, NInput, NInputNumber, NSelect, NSwitch } from "naive-ui";
import api from "@/client/api";
import { selectedADir, selectedMusicBrief } from "@/store/refs";

const LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, '7+', 8, '8+', 9, '9+', 10, '10+', 11, '11+', 12, '12+', 13, '13+', 14, '14+', 15, '15+'] as const;
const LEVELS_OPTIONS = LEVELS.map((level, index) => ({label: level, value: index}));

export default defineComponent({
  props: {
    songId: {type: Number, required: true},
    chartIndex: {type: Number, required: true},
    chart: {type: Object as PropType<Chart>, required: true},
  },
  setup(props) {
    const levelValue = computed({
      get: () => props.chart.level! + props.chart.levelDecimal! / 10,
      set: (value: number) => {
        props.chart.level = Math.floor(value);
        props.chart.levelDecimal = Math.round(value * 10 - props.chart.level * 10);
      }
    })

    const sync = (key: keyof Chart, method: Function) => async () => {
      if (!props.chart) return;
      selectedMusicBrief.value!.modified = true;
      await method(props.songId, props.chartIndex, props.chart[key]!);
    }

    watch(() => props.chart.designer, sync('designer', api.EditChartDesigner));
    watch(() => props.chart.level, sync('level', api.EditChartLevel));
    watch(() => props.chart.levelDecimal, sync('levelDecimal', api.EditChartLevelDecimal));
    watch(() => props.chart.maxNotes, sync('maxNotes', api.EditChartNoteCount));
    watch(() => props.chart.enable, sync('enable', api.EditChartEnable));
    watch(() => props.chart.levelId, sync('levelId', api.EditChartLevelDisplay));

    return () => <NForm showFeedback={false} labelPlacement="top" disabled={selectedADir.value === 'A000'}>
      <NFlex vertical>
        <NFormItem label="已启用" labelPlacement="left">
          <NSwitch v-model:value={props.chart.enable}/>
        </NFormItem>
        <NFormItem label="作者">
          <NInput v-model:value={props.chart.designer} placeholder=""/>
        </NFormItem>
        <NFormItem label="显示等级">
          <NSelect options={LEVELS_OPTIONS as any} v-model:value={props.chart.levelId}/>
        </NFormItem>
        <NFormItem label="定数">
          <NInputNumber showButton={false} class="w-full" precision={1} v-model:value={levelValue.value}/>
        </NFormItem>
        <NFormItem label="音符数量">
          <NInputNumber showButton={false} class="w-full" precision={0} v-model:value={props.chart.maxNotes}/>
        </NFormItem>
      </NFlex>
    </NForm>;
  },
});
