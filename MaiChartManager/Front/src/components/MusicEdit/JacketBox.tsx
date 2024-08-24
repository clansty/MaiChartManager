import { computed, defineComponent, PropType } from "vue";
import { MusicXml } from "@/client/apiGen";
import noJacket from "@/assets/noJacket.webp";

export default defineComponent({
  props: {
    info: {type: Object as PropType<MusicXml>, required: true}
  },
  setup(props) {
    const jacketUrl = computed(() => props.info.hasJacket ?
      `/MaiChartManagerServlet/GetJacketApi/${props.info.id}` : noJacket)

    return () => <div>
      <img src={jacketUrl.value} class="w-full h-full object-fill rounded-lg"/>
    </div>
  }
})