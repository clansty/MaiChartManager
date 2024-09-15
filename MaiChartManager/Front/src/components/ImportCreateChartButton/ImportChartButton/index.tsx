import { defineComponent, ref } from "vue";
import { NButton, useDialog, useNotification } from "naive-ui";
import SelectFileTypeTip from "./SelectFileTypeTip";
import { ImportChartMessage, LicenseStatus, MessageLevel } from "@/client/apiGen";
import CheckingModal from "./CheckingModal";
import api from "@/client/api";
import { globalCapture, musicList, selectMusicId, updateMusicList, version as appVersion } from "@/store/refs";
import ErrorDisplayIdInput from "./ErrorDisplayIdInput";
import ImportStepDisplay from "./ImportStepDisplay";
import { useStorage } from "@vueuse/core";
import { captureException } from "@sentry/vue";
import { fetchEventSource } from "@microsoft/fetch-event-source";

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
  movie,
  jacket,
  finish
}

export type ImportMeta = {
  id: number,
  importStep: IMPORT_STEP,
  maidata?: File,
  track?: File,
  bg?: File,
  movie?: File,
  name: string,
  musicPadding: number,
  first: number,
}

export type FirstPaddingMessage = { first: number, padding: number }
export type ImportChartMessageEx = (ImportChartMessage | FirstPaddingMessage) & { name: string, isPaid?: boolean }

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
    const noShiftChart = ref(false);
    const addVersionId = useStorage('importMusicAddVersionId', 0);
    const genreId = useStorage('importMusicGenreId', 1);
    // 大家都喜欢写 22001，甚至不理解这个选项是干什么的
    const version = useStorage('importMusicVersion', 22001);
    const dialog = useDialog();
    const errors = ref<ImportChartMessageEx[]>([]);
    const modalResolve = ref<(qwq?: any) => any>(() => {
    });
    const modalReject = ref<Function>();
    const meta = ref<ImportMeta[]>([]);
    const currentProcessing = ref<ImportMeta>(dummyMeta);
    const currentMovieProgress = ref(0);

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
      const bg = await tryGetFile(dir, 'bg.jpg') || await tryGetFile(dir, 'bg.png') || await tryGetFile(dir, 'bg.jpeg');
      if (!bg) {
        errors.value.push({level: MessageLevel.Warning, message: '未找到背景图片', name: dir.name});
      }
      let movie = await tryGetFile(dir, 'pv.mp4') || await tryGetFile(dir, 'mv.mp4') || await tryGetFile(dir, 'bg.mp4');
      if (movie && appVersion.value?.license !== LicenseStatus.Active) {
        movie = undefined;
        errors.value.push({level: MessageLevel.Warning, message: '转换 PV 目前是赞助版功能，点击获取', name: dir.name, isPaid: true});
      }

      let musicPadding = 0, first = 0, name = dir.name;
      if (maidata) {
        const checkRet = (await api.ImportChartCheck({file: maidata})).data;
        reject = reject || !checkRet.accept;
        errors.value.push(...(checkRet.errors || []).map(it => ({...it, name: dir.name})));
        musicPadding = checkRet.musicPadding!;
        first = checkRet.first!;
        errors.value.push({first, padding: musicPadding, name: dir.name});
        // 为了本地的错误和远程的错误都显示本地的名称，这里在修改 name
        name = checkRet.title!;
        if (checkRet.isDx) id += 1e4;
      }

      if (!reject) {
        meta.value.push({
          id, maidata, bg, track, musicPadding, name, first, movie,
          importStep: IMPORT_STEP.start,
        })
      }
      return !reject;
    }

    const uploadMovie = (id: number, movie: File, offset: number) => new Promise<void>((resolve, reject) => {
      currentMovieProgress.value = 0;
      const body = new FormData();
      body.append('file', movie);
      body.append('offset', offset.toString());
      fetchEventSource(`/MaiChartManagerServlet/SetMovieApi/${id}`, {
        method: 'PUT',
        body,
        onerror: reject,
        onmessage: (e) => {
          switch (e.event) {
            case 'Progress':
              currentMovieProgress.value = parseInt(e.data);
              break;
            case 'Success':
              resolve();
              break;
            case 'Error':
              reject(e.data);
              break;
          }
        }
      });
    })

    const processMusic = async (music: ImportMeta) => {
      try {
        music.importStep = IMPORT_STEP.create;

        const createRet = (await api.AddMusic(music.id)).data;
        if (createRet) throw new Error(createRet);

        music.importStep = IMPORT_STEP.chart;
        const res = (await api.ImportChart({
          file: music.maidata,
          id: music.id,
          ignoreLevelNum: ignoreLevel.value,
          genreId: genreId.value,
          addVersionId: addVersionId.value,
          version: version.value,
          noShiftChart: noShiftChart.value,
          debug: import.meta.env.DEV,
        })).data;

        errors.value.push(...res.errors!.map(it => ({...it, name: music.name})));
        if (res.fatal) {
          try {
            await api.DeleteMusic(music.id);
          } catch {
          }
          return;
        }

        music.importStep = IMPORT_STEP.music;
        const padding = noShiftChart.value ? -music.first : music.musicPadding;
        await api.SetAudio(music.id, {file: music.track, padding});

        if (music.movie) {
          music.importStep = IMPORT_STEP.movie;
          try {
            await uploadMovie(music.id, music.movie, padding);
          } catch (e: any) {
            errors.value.push({level: MessageLevel.Warning, message: `视频转换失败: ${e.message || e.toString()}`, name: music.name});
          }
        }

        music.importStep = IMPORT_STEP.jacket;
        if (music.bg) await api.SetMusicJacket(music.id, {file: music.bg});

        music.importStep = IMPORT_STEP.finish;
      } catch (e: any) {
        console.log(music, e)
        captureException(e.error || e, {
          tags: {
            context: '导入乐曲出错',
            step: music.importStep,
          }
        })
        errors.value.push({level: MessageLevel.Fatal, message: e.error?.message || e.message || e.toString(), name: music.name});
        try {
          await api.DeleteMusic(music.id);
        } catch {
        }
      }
    }

    const startProcess = async () => {
      let id = 4999;
      for (const existedMusic of musicList.value) {
        if (id < existedMusic.id! % 1e4) {
          id = existedMusic.id! % 1e4;
        }
      }
      id++;
      errors.value = [];
      ignoreLevel.value = false;
      noShiftChart.value = false;
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

        if (!meta.value.length && !errors.value.length)
          throw new Error('没有找到可以导入的乐曲');

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
        globalCapture(e, "导入乐曲出错（全局）")
      } finally {
        if (step.value !== STEP.showResultError)
          step.value = STEP.none
      }
    }

    return () => <NButton onClick={startProcess} secondary>
      导入乐曲
      <SelectFileTypeTip show={step.value === STEP.selectFile} closeModal={closeModal}/>
      <CheckingModal title="正在检查..." show={step.value === STEP.checking} closeModal={closeModal}/>
      <ErrorDisplayIdInput show={step.value === STEP.showWarning} closeModal={closeModal} proceed={modalResolve.value!} meta={meta.value} errors={errors.value}
        // 这个组件的 props 数量是不是有点多了
                           v-model:ignoreLevel={ignoreLevel.value} v-model:addVersionId={addVersionId.value} v-model:genreId={genreId.value} v-model:version={version.value} v-model:noShiftChart={noShiftChart.value}/>
      <ImportStepDisplay show={step.value === STEP.importing} closeModal={closeModal} current={currentProcessing.value} movieProgress={currentMovieProgress.value}/>
      <ErrorDisplayIdInput show={step.value === STEP.showResultError} closeModal={closeModal} proceed={() => {
      }} meta={[]} ignoreLevel errors={errors.value}/>
    </NButton>;
  }
})
