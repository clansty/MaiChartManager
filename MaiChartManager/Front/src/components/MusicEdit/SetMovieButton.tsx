import { defineComponent, PropType, ref } from "vue";
import { NButton, NDrawer, NDrawerContent, NFlex, NInputNumber, NModal, NProgress, useDialog, useMessage } from "naive-ui";
import FileTypeIcon from "@/components/FileTypeIcon";
import { LicenseStatus, MusicXmlWithABJacket } from "@/client/apiGen";
import api from "@/client/api";
import { globalCapture, showNeedPurchaseDialog, version } from "@/store/refs";
import { fetchEventSource } from "@microsoft/fetch-event-source";

enum STEP {
  None,
  Select,
  Offset,
  Progress,
}

export default defineComponent({
  props: {
    song: {type: Object as PropType<MusicXmlWithABJacket>, required: true},
  },
  setup(props) {
    const offset = ref(0)
    const load = ref(false)
    const okResolve = ref<Function>(() => {
    })
    const dialog = useDialog();
    const step = ref(STEP.None)
    const progress = ref(0)
    const message = useMessage();

    const uploadMovie = (id: number, movie: File, offset: number) => new Promise<void>((resolve, reject) => {
      progress.value = 0;
      const body = new FormData();
      body.append('file', movie);
      body.append('offset', offset.toString());
      fetchEventSource(`/MaiChartManagerServlet/SetMovieApi/${id}`, {
        method: 'PUT',
        body,
        onerror() {
          reject();
          throw new Error("disable retry onerror");
        },
        onclose() {
          reject();
          throw new Error("disable retry onclose");
        },
        openWhenHidden: true,
        onmessage: (e) => {
          switch (e.event) {
            case 'Progress':
              progress.value = parseInt(e.data);
              break;
            case 'Success':
              console.log("success")
              resolve();
              break;
            case 'Error':
              reject(e.data);
              break;
          }
        }
      });
    })

    const uploadFlow = async () => {
      step.value = STEP.Select
      try {
        const [fileHandle] = await window.showOpenFilePicker({
          id: 'movie',
          startIn: 'downloads',
          types: [
            {
              description: "支持的文件类型",
              accept: {
                "video/*": [".dat"],
              },
            },
          ],
        });
        step.value = STEP.None
        if (!fileHandle) return;
        const file = await fileHandle.getFile() as File;

        if (file.name.endsWith('.dat')) {
          load.value = true;
          await api.SetMovie(props.song.id!, {file, padding: 0});
        } else if (version.value?.license !== LicenseStatus.Active) {
          showNeedPurchaseDialog.value = true;
        } else {
          offset.value = 0;
          step.value = STEP.Offset
          await new Promise((resolve) => {
            okResolve.value = resolve;
          });
          load.value = true;
          progress.value = 0;
          step.value = STEP.Progress
          await uploadMovie(props.song.id!, file, offset.value);
          console.log("upload movie success")
          message.success("保存成功")
        }
      } catch (e: any) {
        if (e.name === 'AbortError') return
        console.log(e)
        globalCapture(e, "导入音频出错")
      } finally {
        step.value = STEP.None
        load.value = false;
      }
    }

    return () => <NButton secondary onClick={uploadFlow} loading={load.value}>
      设置 PV

      <NDrawer show={step.value === STEP.Select} height={250} placement="bottom">
        <NDrawerContent title="可以选择的文件类型">
          <NFlex vertical>
            任何 FFmpeg 支持的视频格式（赞助版功能），或者已经自行转换好的 DAT 文件
            <div class="grid cols-4 justify-items-center text-8em gap-10">
              <FileTypeIcon type="MP4"/>
              <FileTypeIcon type="DAT"/>
            </div>
          </NFlex>
        </NDrawerContent>
      </NDrawer>
      <NModal
        preset="card"
        class="w-[min(30vw,25em)]"
        title="设置偏移（秒）"
        show={step.value === STEP.Offset}
        onUpdateShow={() => step.value = STEP.None}
      >{{
        default: () => <NFlex vertical size="large">
          <div>设为正数可以在视频前面添加黑场空白，设为负数则裁掉视频前面的一部分</div>
          <NInputNumber v-model:value={offset.value} class="w-full" step={0.01}/>
        </NFlex>,
        footer: () => <NFlex justify="end">
          <NButton onClick={okResolve.value as any}>确定</NButton>
        </NFlex>
      }}</NModal>
      <NModal
        preset="card"
        class="w-[min(40vw,40em)]"
        title="正在转换…"
        show={step.value === STEP.Progress}
        closable={false}
        maskClosable={false}
        closeOnEsc={false}
      >
        <NProgress
          type="line"
          status="success"
          percentage={progress.value}
          indicator-placement="inside"
          processing
        />
      </NModal>
    </NButton>;
  }
})
