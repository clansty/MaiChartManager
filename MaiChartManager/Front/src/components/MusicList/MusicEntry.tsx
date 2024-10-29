import { computed, defineComponent, PropType } from "vue";
import { MusicXmlWithABJacket } from "@/client/apiGen";
import noJacket from '@/assets/noJacket.webp';
import { NBadge, NFlex } from "naive-ui";
import { LEVEL_COLOR, LEVELS } from "@/consts";
import ProblemsDisplay from "@/components/ProblemsDisplay";
import { musicListAll, selectedADir } from "@/store/refs";
import ConflictDisplay from "@/components/MusicList/ConflictDisplay";
import { getUrl } from "@/client/api";

export default defineComponent({
  props: {
    music: {type: Object as PropType<MusicXmlWithABJacket>, required: true},
    selected: Boolean,
    onClick: Function as PropType<() => any>,
  },

  setup(props) {
    const jacketUrl = computed(() => props.music.hasJacket ?
      getUrl(`GetJacketApi/${selectedADir.value}/${props.music.id}?${(props.music as any).updateTime}`) : noJacket)

    const overridingOthers = computed(() => musicListAll.value.filter(m => m.id === props.music.id && m.assetDir! < props.music.assetDir!))
    const overrideByOthers = computed(() => musicListAll.value.filter(m => m.id === props.music.id && m.assetDir! > props.music.assetDir!))

    return () => (
      <div class={`flex gap-5 h-20 w-full p-2 m-y-1 hover:bg-op-40 rd-md relative ${props.selected ? 'bg-[var(--selected-bg)]' : 'hover:bg-zinc-3'}`} onClick={props.onClick} title={props.music.name!}>
        <img src={jacketUrl.value} class="h-16 w-16 object-fill shrink-0"/>
        <div class="flex flex-col grow-1 w-0">
          <NFlex class="text-xs c-gray-5" align="center" size="small">
            {props.music.modified && <NBadge dot type="warning"/>}
            {props.music.id?.toString().padStart(6, '0')}
          </NFlex>
          <div class="text-ellipsis of-hidden ws-nowrap">{props.music.name}</div>
          <NFlex class="pt-1 text-sm" size="small">
            {
              (props.music.charts || []).map((chart, index) =>
                chart.enable && <div key={index} class="c-white rounded-full px-2" style={{backgroundColor: LEVEL_COLOR[index!]}}>{LEVELS[chart.levelId!]}</div>)
            }
          </NFlex>
        </div>
        <NFlex class="absolute right-0 bottom-0 mr-2 mb-2" size="small">
          <ConflictDisplay conflicts={overridingOthers.value} type="up"/>
          <ConflictDisplay conflicts={overrideByOthers.value} type="down"/>
          <ProblemsDisplay problems={props.music.problems!}/>
        </NFlex>
      </div>
    )
  }
});
