import { computed, defineComponent, PropType, ref } from "vue";
import { HttpResponse, MusicXmlWithABJacket } from "@/client/apiGen";
import { NButton, NDrawer, NDrawerContent, NFlex, NForm, NFormItem, NInputNumber, NModal, NRadio, useDialog } from "naive-ui";
import noJacket from "@/assets/noJacket.webp";
import { selectedADir } from "@/store/refs";
import FileTypeIcon from "@/components/FileTypeIcon";
import stdIcon from "@/assets/stdIcon.png";
import dxIcon from "@/assets/dxIcon.png";
import api from "@/client/api";

export default defineComponent({
  props: {
    song: {type: Object as PropType<MusicXmlWithABJacket>, required: true},
  },
  setup(props) {
    const updateTime = ref(0)
    const url = computed(() => `/MaiChartManagerServlet/GetMusicWavApi/${props.song.id}?${updateTime.value}`)
    const tipShow = ref(false)
    const tipSelectAwbShow = ref(false)
    const setOffsetShow = ref(false)
    const offset = ref(0)
    const load = ref(false)
    const okResolve = ref<Function>(() => {
    })
    const dialog = useDialog();

    const uploadFlow = async () => {
      tipShow.value = true
      try {
        const [fileHandle] = await window.showOpenFilePicker({
          id: 'acbawb',
          startIn: 'downloads',
          types: [
            {
              description: "支持的文件类型",
              accept: {
                "application/x-supported": [".mp3", ".wav", ".ogg", ".acb"],
              },
            },
          ],
        });
        tipShow.value = false;
        if (!fileHandle) return;
        const file = await fileHandle.getFile() as File;

        let res: HttpResponse<any>;
        if (file.name.endsWith('.acb')) {
          tipSelectAwbShow.value = true;
          const [fileHandle] = await window.showOpenFilePicker({
            id: 'acbawb',
            startIn: 'downloads',
            types: [
              {
                description: "支持的文件类型",
                accept: {
                  "application/x-supported": [".awb"],
                },
              },
            ],
          });
          tipSelectAwbShow.value = false;
          if (!fileHandle) return;

          load.value = true;
          const awb = await fileHandle.getFile() as File;
          res = await api.SetAudio(props.song.id!, {file, awb, padding: 0});
        } else {
          offset.value = 0;
          setOffsetShow.value = true;
          await new Promise((resolve) => {
            okResolve.value = resolve;
          });
          load.value = true;
          setOffsetShow.value = false;
          res = await api.SetAudio(props.song.id!, {file, padding: offset.value});
        }
        if (res.error) {
          const error = res.error as any;
          dialog.warning({title: '设置失败', content: error.message || error});
          return;
        }
        updateTime.value = Date.now()
        props.song.isAcbAwbExist = true;
      } catch (e: any) {
        if (e.name === 'AbortError') return
        console.log(e)
        dialog.error({
          title: '错误',
          content: e.message,
        })
      } finally {
        tipShow.value = false;
        tipSelectAwbShow.value = false;
        setOffsetShow.value = false;
        load.value = false;
      }
    }

    return () => <NFlex align="center">
      {props.song.isAcbAwbExist && <audio controls src={url.value} class="w-0 grow"/>}
      {selectedADir.value !== 'A000' && <NButton secondary class={`${!props.song.isAcbAwbExist && "w-full"}`} onClick={uploadFlow} loading={load.value}>{props.song.isAcbAwbExist ? '替换' : '设置'}音频</NButton>}

      {/* 打开文件对话框一般在左上角，所以在右边显示一个 Drawer */}
      <NDrawer v-model:show={tipShow.value} width={500} placement="right">
        <NDrawerContent title="可以选择的文件类型">
          <div class="grid cols-2 justify-items-center text-8em gap-10">
            <FileTypeIcon type="WAV"/>
            <FileTypeIcon type="MP3"/>
            <FileTypeIcon type="OGG"/>
            <FileTypeIcon type="ACB"/>
          </div>
        </NDrawerContent>
      </NDrawer>
      <NDrawer v-model:show={tipSelectAwbShow.value} width={500} placement="right">
        <NDrawerContent title="请选择对应的 AWB 文件"/>
      </NDrawer>
      <NModal
        preset="card"
        class="w-[min(30vw,25em)]"
        title="设置偏移"
        v-model:show={setOffsetShow.value}
      >{{
        default: () => <NFlex vertical size="large">
          <div>设为正数可以在歌曲前面添加空白，设为负数则裁掉歌曲前面的一部分</div>
          <NInputNumber v-model:value={offset.value} class="w-full" step={0.01}/>
        </NFlex>,
        footer: () => <NFlex justify="end">
          <NButton onClick={okResolve.value as any}>确定</NButton>
        </NFlex>
      }}</NModal>
    </NFlex>
  }
})
