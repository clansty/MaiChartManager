import { computed, defineComponent, effect, PropType, watch } from "vue";
import { NAlert, NButton, NCheckbox, NCollapse, NCollapseItem, NFlex, NForm, NFormItem, NInputNumber, NModal, NScrollbar, NSelect, SelectOption } from "naive-ui";
import { ImportChartMessage, MessageLevel } from "@/client/apiGen";
import { ImportChartMessageEx, ImportMeta } from "@/components/ImportChartButton/index";
import noJacket from '@/assets/noJacket.webp';
import { addVersionList, genreList } from "@/store/refs";
import GenreInput from "@/components/GenreInput";
import VersionInput from "@/components/VersionInput";
import { UTAGE_GENRE } from "@/consts";

export default defineComponent({
  props: {
    show: {type: Boolean, required: true},
    meta: {type: Array as PropType<ImportMeta[]>, required: true},
    ignoreLevel: Boolean,
    noShiftChart: Boolean,
    addVersionId: Number,
    genreId: Number,
    version: Number,
    closeModal: {type: Function, required: true},
    proceed: {type: Function as PropType<() => any>, required: true},
    errors: {type: Array as PropType<ImportChartMessageEx[]>, required: true}
  },
  setup(props, {emit}) {
    const show = computed({
      get: () => props.show,
      set: (val) => props.closeModal()
    })
    const ignoreLevel = computed({
      get: () => props.ignoreLevel,
      set: (val) => emit('update:ignoreLevel', val)
    })
    const genreId = computed({
      get: () => props.genreId,
      set: (val) => emit('update:genreId', val)
    })
    const addVersionId = computed({
      get: () => props.addVersionId,
      set: (val) => emit('update:addVersionId', val)
    })
    const version = computed({
      get: () => props.version,
      set: (val) => emit('update:version', val)
    })
    const noShiftChart = computed({
      get: () => props.noShiftChart,
      set: (val) => emit('update:noShiftChart', val)
    })

    watch([() => genreId.value, () => show.value], ([val]) => {
      for (const meta of props.meta) {
        meta.id = meta.id % 1e5 + (val === UTAGE_GENRE ? 1e5 : 0);
      }
    })

    return () => <NModal
      preset="card"
      class="w-[min(50vw,50em)]"
      title="导入提示"
      v-model:show={show.value}
    >{{
      default: () => <NFlex vertical size="large">
        <NScrollbar class="max-h-30vh">
          <NFlex vertical>
            {
              props.errors.map((error, i) => {
                if ('first' in error) {
                  if (error.padding > 0 && !noShiftChart.value) {
                    return <NAlert key={i} type="info" title={error.name}>将在音频前面加上 {error.padding.toFixed(3)} 秒空白以保证第一押在第二小节</NAlert>
                  }
                  if (error.padding < 0 && !noShiftChart.value) {
                    return <NAlert key={i} type="info" title={error.name}>将裁剪 {(-error.padding).toFixed(3)} 秒音频以保证第一押在第二小节</NAlert>
                  }
                  if (error.first > 0 && noShiftChart.value) {
                    return <NAlert key={i} type="info" title={error.name}>将裁剪 {error.first.toFixed(3)} 秒音频以对应 &first 的值</NAlert>
                  }
                  if (error.first < 0 && noShiftChart.value) {
                    return <NAlert key={i} type="info" title={error.name}>将在音频前面加上 {(-error.first).toFixed(3)} 秒空白以对应 &first 的值</NAlert>
                  }
                  return <></>
                }
                let type: "default" | "info" | "success" | "warning" | "error" = "default";
                switch (error.level) {
                  case MessageLevel.Info:
                    type = 'info';
                    break;
                  case MessageLevel.Warning:
                    type = 'warning';
                    break;
                  case MessageLevel.Fatal:
                    type = 'error';
                    break;
                }
                return <NAlert key={i} type={type} title={error.name}>{error.message}</NAlert>
              })
            }
          </NFlex>
        </NScrollbar>
        {!!props.meta.length && <>
          为新导入的歌曲指定 ID
          <NScrollbar class="max-h-25vh">
            <NFlex vertical size="large">
              {props.meta.map((meta, i) => <MusicIdInput key={i} meta={meta}/>)}
            </NFlex>
          </NScrollbar>
          <NFormItem label="流派" labelPlacement="left" labelWidth="5em" showFeedback={false}>
            <GenreInput options={genreList.value} v-model:value={genreId.value}/>
          </NFormItem>
          <NFormItem label="版本分类" labelPlacement="left" labelWidth="5em" showFeedback={false}>
            <GenreInput options={addVersionList.value} v-model:value={addVersionId.value}/>
          </NFormItem>
          <NFormItem label="版本" labelPlacement="left" labelWidth="5em" showFeedback={false}>
            <VersionInput v-model:value={version.value}/>
          </NFormItem>
          <NCheckbox v-model:checked={ignoreLevel.value}>
            忽略定数，不参与 B50 计算
          </NCheckbox>
          <NCollapse>
            <NCollapseItem title="高级选项">
              <NCheckbox v-model:checked={noShiftChart.value}>
                避免平移谱面 如果正常的转换失败了可以试试，但是可能会导致第一个音符出现的时机比较奇怪
              </NCheckbox>
            </NCollapseItem>
          </NCollapse>
        </>}
      </NFlex>,
      footer: () => <NFlex justify="end">
        <NButton onClick={() => show.value = false}>{props.meta.length ? '取消' : '关闭'}</NButton>
        {!!props.meta.length && <NButton onClick={props.proceed}>继续</NButton>}
      </NFlex>
    }}</NModal>;
  }
})

const MusicIdInput = defineComponent({
  props: {
    meta: {type: Object as PropType<ImportMeta>, required: true},
  },
  setup(props) {
    const dxBase = computed(() => {
      const dx = props.meta.id % 1e5 >= 1e4 ? 1e4 : 0
      const utage = props.meta.id >= 1e5 ? 1e5 : 0
      return dx + utage;
    });
    const img = computed(() => props.meta.bg ? URL.createObjectURL(props.meta.bg) : noJacket);

    return () => <NFlex align="center" size="large">
      <img src={img.value} class="h-16 w-16 object-fill shrink-0"/>
      <div class="w-0 grow">{props.meta.name}</div>
      <NInputNumber v-model:value={props.meta.id} min={dxBase.value + 1} max={dxBase.value + 1e4 - 1} step={1} class="shrink-0"/>
    </NFlex>
  }
})
