import { defineComponent, PropType } from "vue";
import { GenreXml } from "@/client/apiGen";
import { NFlex } from "naive-ui";

export default defineComponent({
  props: {
    genre: {type: Object as PropType<GenreXml>, required: true},
  },
  setup(props) {
    return () => (
      <div class="grid cols-[10em_2em_1.3fr_1fr_2em] items-center gap-5 m-x">
        <NFlex class="c-gray-6" size="small">
          {props.genre.id}
          <span class="op-60">@</span>
          <span class="op-80">{props.genre.assetDir}</span>
        </NFlex>
        <div class="h-6 w-6 rounded-full" style={{backgroundColor: `rgb(${props.genre.colorR}, ${props.genre.colorG}, ${props.genre.colorB})`}} />
        <pre class="b b-gray-3 b-solid p-auto rounded-sm h-6 lh-normal text-align-center box-content flex items-center justify-center">{props.genre.genreName}</pre>
        <pre class="b b-gray-3 b-solid p-auto rounded-sm h-12 lh-normal text-align-center box-content flex items-center justify-center">{props.genre.genreNameTwoLine}</pre>
        <div class="i-material-symbols-edit-off text-6 c-gray-6"/>
      </div>
    );
  },
});
