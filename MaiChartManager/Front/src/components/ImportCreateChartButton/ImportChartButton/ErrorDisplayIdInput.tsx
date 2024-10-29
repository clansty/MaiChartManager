import { computed, defineComponent, effect, PropType, watch } from "vue";
import { NAlert, NButton, NCheckbox, NCollapse, NCollapseItem, NFlex, NForm, NFormItem, NInputNumber, NModal, NPopover, NRadio, NRadioButton, NRadioGroup, NScrollbar, NSelect, SelectOption } from "naive-ui";
import { ImportChartMessage, MessageLevel, ShiftMethod } from "@/client/apiGen";
import { ImportChartMessageEx, ImportMeta, SavedOptions, TempOptions } from "./types";
import noJacket from '@/assets/noJacket.webp';
import { addVersionList, genreList, showNeedPurchaseDialog } from "@/store/refs";
import GenreInput from "@/components/GenreInput";
import VersionInput from "@/components/VersionInput";
import { UTAGE_GENRE } from "@/consts";
import MusicIdConflictNotifier from "@/components/MusicIdConflictNotifier";

export default defineComponent({
  props: {
    show: {type: Boolean, required: true},
    meta: {type: Array as PropType<ImportMeta[]>, required: true},
    tempOptions: {type: Object as PropType<TempOptions>, required: true},
    savedOptions: {type: Object as PropType<SavedOptions>, required: true},
    closeModal: {type: Function, required: true},
    proceed: {type: Function as PropType<() => any>, required: true},
    errors: {type: Array as PropType<ImportChartMessageEx[]>, required: true}
  },
  setup(props, {emit}) {
    const show = computed({
      get: () => props.show,
      set: (val) => props.closeModal()
    })

    watch([() => props.savedOptions.genreId, () => show.value], ([val]) => {
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
        <NScrollbar class="max-h-24vh">
          <NFlex vertical>
            {
              props.errors.map((error, i) => {
                if ('first' in error) {
                  if (error.padding > 0 && props.tempOptions.shift === ShiftMethod.Legacy) {
                    return <NAlert key={i} type="info" title={error.name}>将在音频前面加上 {error.padding.toFixed(3)} 秒空白以保证第一押在第二小节</NAlert>
                  }
                  if (error.padding < 0 && props.tempOptions.shift === ShiftMethod.Legacy) {
                    return <NAlert key={i} type="info" title={error.name}>将裁剪 {(-error.padding).toFixed(3)} 秒音频以保证第一押在第二小节</NAlert>
                  }
                  if (error.first > 0 && props.tempOptions.shift === ShiftMethod.NoShift) {
                    return <NAlert key={i} type="info" title={error.name}>将裁剪 {error.first.toFixed(3)} 秒音频以对应 &first 的值</NAlert>
                  }
                  if (error.first < 0 && props.tempOptions.shift === ShiftMethod.NoShift) {
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
                return <NAlert key={i} type={type} title={error.name} class={`${error.isPaid && 'cursor-pointer'}`}
                  // @ts-ignore
                               onClick={() => error.isPaid && (showNeedPurchaseDialog.value = true)}
                >{error.message}</NAlert>
              })
            }
          </NFlex>
        </NScrollbar>
        {!!props.meta.length && <>
            为新导入的歌曲指定 ID
            <NScrollbar class="max-h-24vh">
                <NFlex vertical size="large">
                  {props.meta.map((meta, i) => <MusicIdInput key={i} meta={meta} utage={props.savedOptions.genreId === UTAGE_GENRE}/>)}
                </NFlex>
            </NScrollbar>
            <NFormItem label="流派" labelPlacement="left" labelWidth="5em" showFeedback={false}>
                <GenreInput options={genreList.value} v-model:value={props.savedOptions.genreId}/>
            </NFormItem>
            <NFormItem label="版本分类" labelPlacement="left" labelWidth="5em" showFeedback={false}>
                <GenreInput options={addVersionList.value} v-model:value={props.savedOptions.addVersionId}/>
            </NFormItem>
            <NFormItem label="版本" labelPlacement="left" labelWidth="5em" showFeedback={false}>
                <VersionInput v-model:value={props.savedOptions.version}/>
            </NFormItem>
            <NCheckbox v-model:checked={props.savedOptions.ignoreLevel}>
                忽略定数，不参与 B50 计算
            </NCheckbox>
            <NCheckbox v-model:checked={props.savedOptions.disableBga}>
                有 BGA 也不要导入
            </NCheckbox>
            <NCollapse>
                <NCollapseItem title="高级选项">
                    <NFlex vertical>
                        <NFormItem label="延迟调整模式" labelPlacement="left" showFeedback={false}>
                            <NFlex vertical class="w-full">
                                <NFlex class="h-34px" align="center">
                                    <NRadioGroup v-model:value={props.tempOptions.shift}>
                                        <NPopover trigger="hover">
                                          {{
                                            trigger: () => <NRadio value={ShiftMethod.Bar} label="按小节"/>,
                                            default: () => <div>
                                              如果谱面前面的休止符长度小于一小节，那就在前面加上一小节的空白<br/>
                                              适用于大部分谱面，防止第一个音符出现的时机奇怪和平移谱面引起的奇怪问题<br/>
                                              第一个音符会在第二小节之内出来
                                            </div>
                                          }}
                                        </NPopover>
                                        <NPopover trigger="hover">
                                          {{
                                            trigger: () => <NRadio value={ShiftMethod.Legacy} label="旧版"/>,
                                            default: () => <div>
                                              将谱面的第一押对准第二小节的第一拍<br/>
                                              v1.1.1 及以前版本默认的处理方式<br/>
                                              可能会因为谱面非整数平移而引起一些比如说 BPM 变化的谱面出现问题
                                            </div>
                                          }}
                                        </NPopover>
                                        <NPopover trigger="hover">
                                          {{
                                            trigger: () => <NRadio value={ShiftMethod.NoShift} label="不移动谱面"/>,
                                            default: () => <div>
                                              完全不修改谱面，从音频中删除 &first 的长度（如果有）<br/>
                                              可能会导致第一个音符出现的时机比较奇怪，比如说刚开始就有音符
                                            </div>
                                          }}
                                        </NPopover>
                                    </NRadioGroup>
                                </NFlex>
                            </NFlex>
                        </NFormItem>
                        <NCheckbox v-model:checked={props.savedOptions.noScale}>
                            不要缩放 BGA 到 1080 宽度，此选项会记住
                        </NCheckbox>
                    </NFlex>
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
    utage: {type: Boolean, required: true},
  },
  setup(props) {
    const dxBase = computed(() => {
      const dx = props.meta.isDx ? 1e4 : 0
      const utage = props.utage ? 1e5 : 0
      return dx + utage;
    });
    const img = computed(() => props.meta.bg ? URL.createObjectURL(props.meta.bg) : noJacket);

    return () => <NFlex align="center" size="large">
      <img src={img.value} class="h-16 w-16 object-fill shrink-0"/>
      <div class="w-0 grow">{props.meta.name}</div>
      <MusicIdConflictNotifier id={props.meta.id}/>
      <NInputNumber v-model:value={props.meta.id} min={dxBase.value + 1} max={dxBase.value + 1e4 - 1} step={1} class="shrink-0"/>
    </NFlex>
  }
})
