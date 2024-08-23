import { computed, defineComponent, PropType } from "vue";
import { MusicBrief } from "@/client/apiGen";
import noJacket from '@/assets/noJacket.webp';
import { NBadge, NFlex } from "naive-ui";

export default defineComponent({
  props: {
    music: {type: Object as PropType<MusicBrief>, required: true},
    selected: Boolean,
    onClick: Function as PropType<() => any>,
  },

  setup(props) {
    const jacketUrl = computed(() => props.music.hasJacket ?
      `/api/Music/GetJacket/${props.music.id}` : noJacket)

    return () => (
      <div class={`flex gap-5 h-20 w-full p-2 m-y-1 hover:bg-zinc-2 rd-md ${props.selected && 'bg-[var(--selected-bg)]'}`} onClick={props.onClick} title={props.music.name!}>
        <img src={jacketUrl.value} class="h-16 w-16 object-fill shrink-0"/>
        <div class="flex flex-col grow-1 w-0">
          <NFlex class="text-sm c-gray-5" align="center" size="small">
            {props.music.modified && <NBadge dot type="warning"/>}
            {props.music.id?.toString().padStart(6, '0')}
          </NFlex>
          <div class="text-ellipsis of-hidden ws-nowrap">{props.music.name}</div>
        </div>
      </div>
    )
  }
});
