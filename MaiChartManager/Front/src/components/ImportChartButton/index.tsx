import { defineComponent, ref } from "vue";
import { NButton, useDialog } from "naive-ui";
import SelectFileTypeTip from "@/components/ImportChartButton/SelectFileTypeTip";
import { ImportChartMessage, MessageLevel } from "@/client/apiGen";
import CheckingModal from "@/components/ImportChartButton/CheckingModal";
import api from "@/client/api";
import { musicList, selectMusicId, updateMusicList } from "@/store/refs";
import ErrorDisplayIdInput from "@/components/ImportChartButton/ErrorDisplayIdInput";
import ImportStepDisplay from "@/components/ImportChartButton/ImportStepDisplay";

enum STEP {
  none,
  selectFile,
  checking,
  showWarning,
  importing
}

export enum IMPORT_STEP {
  start,
  create,
  chart,
  music,
  jacket,
  finish
}

const tryGetFile = async (dir: FileSystemDirectoryHandle, file: string) => {
  try {
    const handle = await dir.getFileHandle(file);
    return await handle.getFile();
  } catch (e) {
    return;
  }
}

export default defineComponent({
  setup(props) {
    const step = ref(STEP.none);
    const importStep = ref(IMPORT_STEP.start);
    const reject = ref(false);
    const ignoreLevel = ref(false);
    const dialog = useDialog();
    const errors = ref<ImportChartMessage[]>([]);
    const modalResolve = ref<(qwq?: any) => any>();
    const modalReject = ref<Function>();
    const id = ref(0);

    const closeModal = () => {
      step.value = STEP.none;
      modalReject.value && modalReject.value({name: 'AbortError'});
    }

    const startProcess = async () => {
      id.value = 0;
      for (const existedMusic of musicList.value) {
        if (id.value < existedMusic.id! % 1e4) {
          id.value = existedMusic.id! % 1e4;
        }
      }
      id.value++;
      errors.value = [];
      reject.value = false;
      ignoreLevel.value = false;
      step.value = STEP.selectFile;
      importStep.value = IMPORT_STEP.start;
      try {
        const dir = await window.showDirectoryPicker({
          id: 'maidata-dir',
          startIn: 'downloads',
        });
        step.value = STEP.checking;

        const maidata = await tryGetFile(dir, 'maidata.txt');
        if (!maidata) {
          reject.value = true;
          errors.value.push({level: MessageLevel.Fatal, message: '未找到 maidata.txt'});
        }
        const track = await tryGetFile(dir, 'track.mp3') || await tryGetFile(dir, 'track.wav') || await tryGetFile(dir, 'track.ogg');
        if (!track) {
          reject.value = true;
          errors.value.push({level: MessageLevel.Fatal, message: '未找到音频文件'});
        }
        const bg = await tryGetFile(dir, 'bg.jpg') || await tryGetFile(dir, 'bg.png');
        if (!bg) {
          errors.value.push({level: MessageLevel.Warning, message: '未找到背景图片'});
        }

        let musicPadding = 0;
        if (maidata) {
          const checkRet = (await api.ImportChartCheck({file: maidata})).data;
          reject.value = reject.value || !checkRet.accept;
          errors.value.push(...checkRet.errors || []);
          musicPadding = checkRet.musicPadding!;
          if (checkRet.isDx) id.value += 1e4;
        }

        step.value = STEP.showWarning;

        await new Promise((resolve, reject) => {
          modalResolve.value = resolve;
          modalReject.value = reject;
        });

        step.value = STEP.importing;
        importStep.value = IMPORT_STEP.create;

        const createRet = (await api.AddMusic(id.value)).data;
        if (createRet) throw new Error(createRet);

        importStep.value = IMPORT_STEP.chart;
        await api.ImportChart({file: maidata, id: id.value, ignoreLevelNum: ignoreLevel.value});

        importStep.value = IMPORT_STEP.music;
        await api.SetAudio(id.value, {file: track, padding: musicPadding});

        importStep.value = IMPORT_STEP.jacket;
        if (bg) await api.SetMusicJacket(id.value, {file: bg});

        importStep.value = IMPORT_STEP.finish;

        await updateMusicList();
        selectMusicId.value = id.value;
        step.value = STEP.none;
      } catch (e: any) {
        if (e.name === 'AbortError') return
        console.log(e)
        dialog.error({
          title: '错误',
          content: e.message,
        })
        api.DeleteMusic(id.value);
      } finally {
        step.value = STEP.none
      }
    }

    return () => <NButton onClick={startProcess} secondary>
      导入乐曲
      <SelectFileTypeTip show={step.value === STEP.selectFile} closeModal={closeModal}/>
      <CheckingModal title="正在检查..." show={step.value === STEP.checking} closeModal={closeModal}/>
      <ErrorDisplayIdInput show={step.value === STEP.showWarning} closeModal={closeModal} proceed={modalResolve.value!} v-model:id={id.value} v-model:ignoreLevel={ignoreLevel.value} errors={errors.value} reject={reject.value}/>
      <ImportStepDisplay show={step.value === STEP.importing} closeModal={closeModal} current={importStep.value}/>
    </NButton>;
  }
})
