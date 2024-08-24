import { computed, defineComponent, PropType, ref } from "vue";
import { ContentType, MusicXml } from "@/client/apiGen";
import noJacket from "@/assets/noJacket.webp";
import api from "@/client/api";
import { useDialog } from "naive-ui";
import { selectedMusicBrief } from "@/store/refs";

export default defineComponent({
  props: {
    info: {type: Object as PropType<MusicXml>, required: true}
  },
  setup(props) {
    const dialog = useDialog();
    const updateTime = ref(0)
    const jacketUrl = computed(() => props.info.hasJacket ?
      `/MaiChartManagerServlet/GetJacketApi/${props.info.id}?${updateTime.value}` : noJacket)

    const upload = async () => {
      // @ts-ignore
      const [fileHandle] = await window.showOpenFilePicker({
        id: 'jacket',
        startIn: 'downloads',
        types: [
          {
            description: "图片",
            accept: {
              "application/jpeg": [".jpeg", ".jpg"],
              "application/png": [".png"],
            },
          },
        ],
      });

      if (!fileHandle) return;
      const file = await fileHandle.getFile();

      const res = await api.SetMusicJacket(props.info.id!, {file});
      if (res.error) {
        const error = res.error as any;
        dialog.warning({title: '设置失败', content: error.message || error});
        return;
      }
      if (res.data) {
        dialog.info({title: '设置失败', content: res.data})
        return;
      }
      updateTime.value = Date.now()
      props.info.hasJacket = true;
      selectedMusicBrief.value!.hasJacket = true;
      (selectedMusicBrief.value as any).updateTime = updateTime.value
    }

    return () => <img src={jacketUrl.value} class="w-full h-full object-fill rounded-lg cursor-pointer" onClick={upload}/>
  }
})
