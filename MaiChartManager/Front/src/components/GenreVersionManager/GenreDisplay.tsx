import { defineComponent, PropType } from "vue";
import { GenreXml } from "@/client/apiGen";
import { NButton, NFlex } from "naive-ui";
import api from "@/client/api";
import { updateAddVersionList, updateGenreList } from "@/store/refs";

export default defineComponent({
  props: {
    genre: {type: Object as PropType<GenreXml>, required: true},
    editing: Boolean,
    disabled: Boolean,
    setEdit: {type: Function as PropType<(edit: boolean) => void>, required: true},
    type: String as PropType<"genre" | "version">,
  },
  setup(props) {
    const save = async () => {
      props.setEdit(false);
      await (props.type === 'genre' ? api.EditGenre : api.EditVersion)(props.genre.id!, {
        name: props.genre.genreName,
        nameTwoLine: props.genre.genreNameTwoLine,
        r: props.genre.colorR,
        g: props.genre.colorG,
        b: props.genre.colorB,
      });
      updateGenreList();
      updateAddVersionList();
    }

    return () => (
      <div class="grid cols-[10em_2em_1.3fr_1fr_3em] items-center gap-5 m-x">
        <NFlex class="c-gray-6" size="small">
          {props.genre.id}
          <span class="op-60">@</span>
          <span class="op-80">{props.genre.assetDir}</span>
        </NFlex>
        <div class="h-6 w-6 rounded-full" style={{backgroundColor: `rgb(${props.genre.colorR}, ${props.genre.colorG}, ${props.genre.colorB})`}}/>
        <input v-model={props.genre.genreName} disabled={!props.editing}
               class={`b b-gray-3 bg-white b-solid rounded-sm lh-normal text-align-center box-content ${props.editing ? 'cursor-text' : 'cursor-default'}`}/>
        {
          props.editing ?
            <textarea v-model={props.genre.genreNameTwoLine} disabled={!props.editing} rows={2}
                      class="b b-gray-3 b-solid rounded-sm h-12 lh-normal box-content text-align-center resize-none cursor-text p-0 my-4 text-1em"
                      onKeydown={e => {
                        if (e.key === 'Enter') {
                          if (props.genre.genreNameTwoLine?.includes('\n')) { // 不能有两个换行
                            e.stopPropagation();
                            e.preventDefault();
                          }
                        }
                      }}
            /> :
            // contenteditable 的换行有疑难杂症
            <pre class="b b-gray-3 b-solid rounded-sm h-12 lh-normal box-content text-align-center flex items-center justify-center my-4">{props.genre.genreNameTwoLine}</pre>
        }
        {
          props.genre.assetDir === 'A000' ?
            <div class="i-material-symbols-edit-off text-6 c-gray-6"/> :
            props.editing ?
              <NButton size="large" type="primary" style={{'--n-padding': 0}} secondary onClick={save}><span class="i-material-symbols-done text-6 c-gray-6"/></NButton> :
              <NButton size="large" style={{'--n-padding': 0}} secondary onClick={() => props.setEdit(true)}><span class="i-material-symbols-edit text-6 c-gray-6"/></NButton>
        }
      </div>
    );
  },
});
