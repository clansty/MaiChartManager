import { computed, defineComponent, PropType } from "vue";
import { GenreXml } from "@/client/apiGen";
import { NFlex, NSelect, SelectOption } from "naive-ui";

export default defineComponent({
  props: {
    options: {type: Array as PropType<GenreXml[]>, required: true},
    value: Number
  },
  setup(props, {emit}) {
    const options = computed(() => props.options.map(genre => ({label: genre.genreName, value: genre.id})));
    const value = computed({
      get: () => props.value,
      set: (v) => emit('update:value', v)
    })

    return () => <NSelect options={options.value as any} v-model:value={value.value} status={props.options.some(it => it.id === value.value) ? undefined : 'error'}
                          renderLabel={(option: SelectOption) => <GenreOption genre={props.options.find(it => it.id === option.value)!}/>}/>
  }
})

const GenreOption = defineComponent({
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
