import { defineComponent, ref } from "vue";
import { NButton, useDialog } from "naive-ui";
import SelectFileTypeTip from "./SelectFileTypeTip";
import { LicenseStatus, MessageLevel, ShiftMethod } from "@/client/apiGen";
import CheckingModal from "./CheckingModal";
import api, { getUrl } from "@/client/api";
import { aquaMaiConfig, globalCapture, musicList, selectedADir, selectMusicId, updateMusicList, version as appVersion } from "@/store/refs";
import ErrorDisplayIdInput from "./ErrorDisplayIdInput";
import ImportStepDisplay from "./ImportStepDisplay";
import { useStorage } from "@vueuse/core";
import { captureException } from "@sentry/vue";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { defaultSavedOptions, defaultTempOptions, dummyMeta, IMPORT_STEP, ImportChartMessageEx, ImportMeta, MOVIE_CODEC, STEP } from "./types";
import getNextUnusedMusicId from "@/utils/getNextUnusedMusicId";

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
    const savedOptions = useStorage('importMusicOptions', defaultSavedOptions, undefined, {mergeDefaults: true});
    const tempOptions = ref({...defaultTempOptions});
    const step = ref(STEP.none);
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

      let musicPadding = 0, first = 0, bar = 0, name = dir.name, isDx = false;
      if (maidata) {
        const checkRet = (await api.ImportChartCheck({file: maidata})).data;
        reject = reject || !checkRet.accept;
        errors.value.push(...(checkRet.errors || []).map(it => ({...it, name: dir.name})));
        musicPadding = checkRet.musicPadding!;
        first = checkRet.first!;
        bar = checkRet.bar!;
        errors.value.push({first, padding: musicPadding, name: dir.name});
        // 为了本地的错误和远程的错误都显示本地的名称，这里在修改 name
        name = checkRet.title!;
        if (checkRet.isDx) id += 1e4;
        isDx = checkRet.isDx!;
      }

      if (!reject) {
        meta.value.push({
          id, maidata, bg, track, musicPadding, name, first, movie, bar, isDx,
          importStep: IMPORT_STEP.start,
        })
      }
      return !reject;
    }

    const shouldUseH264 = () => {
      if (savedOptions.value.movieCodec === MOVIE_CODEC.ForceH264) return true;
      if (savedOptions.value.movieCodec === MOVIE_CODEC.ForceVP9) return false;
      return aquaMaiConfig.value?.sectionStates?.['GameSystem.Assets.MovieLoader']?.enabled && aquaMaiConfig.value?.entryStates?.['GameSystem.Assets.MovieLoader.LoadMp4Movie']?.value;
    }

    const uploadMovie = (id: number, movie: File, offset: number) => new Promise<void>((resolve, reject) => {
      currentMovieProgress.value = 0;
      const body = new FormData();
      const h264 = shouldUseH264();
      console.log('use h264', h264);
      body.append('h264', h264.toString());
      body.append('file', movie);
      body.append('padding', offset.toString());
      body.append('noScale', savedOptions.value.noScale.toString());
      const controller = new AbortController();
      fetchEventSource(getUrl(`SetMovieApi/${selectedADir.value}/${id}`), {
        signal: controller.signal,
        method: 'PUT',
        body,
        onerror(e) {
          reject(e);
          controller.abort();
          throw new Error("disable retry onerror");
        },
        onclose() {
          reject(new Error("EventSource Close"));
          controller.abort();
          throw new Error("disable retry onclose");
        },
        openWhenHidden: true,
        onmessage: (e) => {
          switch (e.event) {
            case 'Progress':
              currentMovieProgress.value = parseInt(e.data);
              break;
            case 'Success':
              resolve();
              controller.abort();
              currentMovieProgress.value = 0;
              break;
            case 'Error':
              reject(new Error(e.data));
              controller.abort();
              currentMovieProgress.value = 0;
              break;
          }
        }
      });
    })

    const processMusic = async (music: ImportMeta) => {
      try {
        music.importStep = IMPORT_STEP.create;

        const createRet = (await api.AddMusic(music.id, selectedADir.value)).data;
        if (createRet) throw new Error(createRet);

        music.importStep = IMPORT_STEP.chart;
        const res = (await api.ImportChart({
          file: music.maidata,
          id: music.id,
          ignoreLevelNum: savedOptions.value.ignoreLevel,
          genreId: savedOptions.value.genreId,
          addVersionId: savedOptions.value.addVersionId,
          version: savedOptions.value.version,
          shift: tempOptions.value.shift,
          debug: import.meta.env.DEV,
          assetDir: selectedADir.value,
        })).data;

        errors.value.push(...res.errors!.map(it => ({...it, name: music.name})));
        if (res.fatal) {
          try {
            await api.DeleteMusic(music.id, selectedADir.value);
          } catch {
          }
          return;
        }

        music.importStep = IMPORT_STEP.music;
        let padding = 0;
        if (tempOptions.value.shift === ShiftMethod.Legacy) {
          padding = music.musicPadding;
        } else if (tempOptions.value.shift === ShiftMethod.Bar) {
          if (music.musicPadding + music.first > 0.1)
            padding = music.bar - music.first;
          else
            padding = -music.first;
        } else if (tempOptions.value.shift === ShiftMethod.NoShift) {
          padding = -music.first;
        }

        await api.SetAudio(music.id, selectedADir.value, {file: music.track, padding});

        if (music.movie && !savedOptions.value.disableBga) {
          currentMovieProgress.value = 0;
          music.importStep = IMPORT_STEP.movie;
          try {
            await uploadMovie(music.id, music.movie, padding);
          } catch (e: any) {
            errors.value.push({level: MessageLevel.Warning, message: `视频转换失败: ${e.error?.message || e.error?.detail || e?.message || e?.toString() || '我也不知道为什么'}`, name: music.name});
          }
        }

        music.importStep = IMPORT_STEP.jacket;
        if (music.bg) await api.SetMusicJacket(music.id, selectedADir.value, {file: music.bg});

        music.importStep = IMPORT_STEP.finish;
      } catch (e: any) {
        console.log(music, e)
        captureException(e.error || e, {
          tags: {
            context: '导入乐曲出错',
            step: music.importStep,
          }
        })
        errors.value.push({level: MessageLevel.Fatal, message: e.error?.message || e.error?.detail || e.message || e.toString(), name: music.name});
        try {
          await api.DeleteMusic(music.id, selectedADir.value);
        } catch {
        }
      }
    }

    const startProcess = async () => {
      let id = getNextUnusedMusicId();
      const usedIds = [] as number[];
      errors.value = [];
      tempOptions.value = {...defaultTempOptions};
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
            if (await prepareFolder(entry, id)) {
              usedIds.push(id);
              id = getNextUnusedMusicId(usedIds);
            }
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
                           savedOptions={savedOptions.value} tempOptions={tempOptions.value}/>
      <ImportStepDisplay show={step.value === STEP.importing} closeModal={closeModal} current={currentProcessing.value} movieProgress={currentMovieProgress.value}/>
      <ErrorDisplayIdInput show={step.value === STEP.showResultError} closeModal={closeModal} proceed={() => {
      }} meta={[]} savedOptions={savedOptions.value} tempOptions={tempOptions.value} errors={errors.value}/>
    </NButton>;
  }
})
