import { defineComponent, onMounted, PropType, ref } from "vue";
import { GenreXml } from "@/client/apiGen";
import { NButton } from "naive-ui";
import api from "@/client/api";
import SelectFileTypeTip from "@/components/GenreVersionManager/SelectFileTypeTip";
import { globalCapture, selectedMusic, updateAddVersionList, updateGenreList } from "@/store/refs";
import { EDIT_TYPE } from "./index";

export default defineComponent({
  props: {
    genre: {type: Object as PropType<GenreXml>, required: true},
    type: Number as PropType<EDIT_TYPE>,
  },
  setup(props) {
    const imageUrl = ref('');
    const showTip = ref(false);

    const refresh = async () => {
      if (!props.genre.fileName) return;
      const req = await fetch(`/MaiChartManagerServlet/GetLocalAssetApi/${props.genre.fileName}`);
      if (!req.ok) return;
      const image = await req.blob();
      imageUrl.value = URL.createObjectURL(image);
    }

    onMounted(refresh)

    const startProcess = async () => {
      showTip.value = true;
      try {
        const [fileHandle] = await window.showOpenFilePicker({
          id: 'genreTitle',
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
        showTip.value = false;

        if (!fileHandle) return;
        const file = await fileHandle.getFile();

        await (props.type === EDIT_TYPE.Genre ? api.SetGenreTitleImage : api.SetVersionTitleImage)({id: props.genre.id!, image: file});
        await updateGenreList();
        await updateAddVersionList();
        await refresh();
      } catch (e: any) {
        if (e.name === 'AbortError') return
        console.log(e)
        globalCapture(e, "设置分类图片失败")
      } finally {
        showTip.value = false;
      }
    }

    return () => <div>
      {imageUrl.value ?
        <img src={imageUrl.value} class="max-w-full max-h-3em object-cover cursor-pointer" onClick={startProcess}/> :
        <NButton secondary onClick={startProcess}>
          设置图片
        </NButton>
      }
      <SelectFileTypeTip show={showTip.value}/>
    </div>;
  }
})
