import { defineComponent, ref } from "vue";
import { NButton, useDialog, useNotification } from "naive-ui";
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
  importing,
  showResultError
}

export enum IMPORT_STEP {
  start,
  create,
  chart,
  music,
  jacket,
  finish
}

export type ImportMeta = {
  id: number,
  importStep: IMPORT_STEP,
  maidata?: File,
  track?: File,
  bg?: File,
  name: string,
  musicPadding: number,
}

export type ImportChartMessageEx = ImportChartMessage & { name: string }

const tryGetFile = async (dir: FileSystemDirectoryHandle, file: string) => {
  try {
    const handle = await dir.getFileHandle(file);
    return await handle.getFile();
  } catch (e) {
    return;
  }
}

const dummyMeta = {name: '', importStep: IMPORT_STEP.start} as ImportMeta

export default defineComponent({
  setup(props) {
    const step = ref(STEP.none);
    const ignoreLevel = ref(false);
    const dialog = useDialog();
    const errors = ref<ImportChartMessageEx[]>([]);
    const modalResolve = ref<(qwq?: any) => any>(() => {
    });
    const modalReject = ref<Function>();
    const meta = ref<ImportMeta[]>([]);
    const currentProcessing = ref<ImportMeta>(dummyMeta);

    const closeModal = () => {
      step.value = STEP.none;
      modalReject.value && modalReject.value({name: 'AbortError'});
    }

    const prepareFolder = async (dir: FileSystemDirectoryHandle, id: number) => {
      let reject = false;

      const maidata = await tryGetFile(dir, 'maidata.txt');
      if (!maidata) {
        reject = true;
        errors.value.push({level: MessageLevel.Fatal, message: '未找到 maidata.txt', name: dir.name});
      }
      const track = await tryGetFile(dir, 'track.mp3') || await tryGetFile(dir, 'track.wav') || await tryGetFile(dir, 'track.ogg');
      if (!track) {
        reject = true;
        errors.value.push({level: MessageLevel.Fatal, message: '未找到音频文件', name: dir.name});
      }
      const bg = await tryGetFile(dir, 'bg.jpg') || await tryGetFile(dir, 'bg.png');
      if (!bg) {
        errors.value.push({level: MessageLevel.Warning, message: '未找到背景图片', name: dir.name});
      }

      let musicPadding = 0;
      if (maidata) {
        const checkRet = (await api.ImportChartCheck({file: maidata})).data;
        reject = reject || !checkRet.accept;
        errors.value.push(...(checkRet.errors || []).map(it => ({...it, name: dir.name})));
        musicPadding = checkRet.musicPadding!;
        if (checkRet.isDx) id += 1e4;
      }

      if (!reject) {
        meta.value.push({
          id, maidata, bg, track, musicPadding,
          importStep: IMPORT_STEP.start,
          name: dir.name,
        })
      }
      return !reject;
    }

    const processMusic = async (music: ImportMeta) => {
      try {
        music.importStep = IMPORT_STEP.create;

        const createRet = (await api.AddMusic(music.id)).data;
        if (createRet) throw new Error(createRet);

        music.importStep = IMPORT_STEP.chart;
        const {shiftNoteEaten} = (await api.ImportChart({file: music.maidata, id: music.id, ignoreLevelNum: ignoreLevel.value})).data;

        if (shiftNoteEaten) {
          errors.value.push({
            level: MessageLevel.Warning, message: '看起来有音符被吃掉了！不出意外的话是遇到了 Bug，如果你能提供谱面文件的话我们会很感谢！', name: music.name
          });
        }

        music.importStep = IMPORT_STEP.music;
        await api.SetAudio(music.id, {file: music.track, padding: music.musicPadding});

        music.importStep = IMPORT_STEP.jacket;
        if (music.bg) await api.SetMusicJacket(music.id, {file: music.bg});

        music.importStep = IMPORT_STEP.finish;
      } catch (e: any) {
        console.log(music, e)
        errors.value.push({level: MessageLevel.Fatal, message: e.message || e.toString(), name: music.name});
        try {
          await api.DeleteMusic(music.id);
        } catch {
        }
      }
    }

    const startProcess = async () => {
      let id = 0;
      for (const existedMusic of musicList.value) {
        if (id < existedMusic.id! % 1e4) {
          id = existedMusic.id! % 1e4;
        }
      }
      id++;
      errors.value = [];
      ignoreLevel.value = false;
      step.value = STEP.selectFile;
      meta.value = [];
      currentProcessing.value = dummyMeta;
      try {
        const dir = await window.showDirectoryPicker({
          id: 'maidata-dir',
          startIn: 'downloads',
        });
        step.value = STEP.checking;

        if (await tryGetFile(dir, 'maidata.txt')) {
          await prepareFolder(dir, id);
        } else {
          for await (const entry of dir.values()) {
            if (entry.kind !== 'directory') continue;
            if (await prepareFolder(entry, id)) id++;
          }
        }

        step.value = STEP.showWarning;

        await new Promise((resolve, reject) => {
          modalResolve.value = resolve;
          modalReject.value = reject;
        });

        step.value = STEP.importing;
        errors.value = [];

        for (const music of meta.value) {
          currentProcessing.value = music;
          // 自带 try 了
          await processMusic(music);
        }

        await updateMusicList();
        selectMusicId.value = meta.value[0].id;

        if (errors.value.length) {
          step.value = STEP.showResultError
        }
      } catch (e: any) {
        if (e.name === 'AbortError') return
        console.log(e)
        dialog.error({
          title: '错误',
          content: e.message,
        })
      } finally {
        if (step.value !== STEP.showResultError)
          step.value = STEP.none
      }
    }

    return () => <NButton onClick={startProcess} secondary>
      导入乐曲
      <SelectFileTypeTip show={step.value === STEP.selectFile} closeModal={closeModal}/>
      <CheckingModal title="正在检查..." show={step.value === STEP.checking} closeModal={closeModal}/>
      <ErrorDisplayIdInput show={step.value === STEP.showWarning} closeModal={closeModal} proceed={modalResolve.value!} meta={meta.value} v-model:ignoreLevel={ignoreLevel.value} errors={errors.value}/>
      <ImportStepDisplay show={step.value === STEP.importing} closeModal={closeModal} current={currentProcessing.value}/>
      <ErrorDisplayIdInput show={step.value === STEP.showResultError} closeModal={closeModal} proceed={() => {
      }} meta={[]} ignoreLevel errors={errors.value}/>
    </NButton>;
  }
})
