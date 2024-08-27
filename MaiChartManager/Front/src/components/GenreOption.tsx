import { defineComponent, PropType } from "vue";
import { GenreXml } from "@/client/apiGen";
import { NFlex } from "naive-ui";

export default defineComponent({
  props: {
    genre: {type: Object as PropType<GenreXml>, required: true},
  },
  setup(props) {
    return () => <NFlex align="center">
      <div class="h-4 w-4 rounded-full" style={{backgroundColor: props.genre ? `rgb(${props.genre.colorR}, ${props.genre.colorG}, ${props.genre.colorB})` : 'white'}}/>
      {props.genre ? props.genre.genreName : '???'}
    </NFlex>;
  },
})
