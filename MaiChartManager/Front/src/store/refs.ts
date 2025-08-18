import { computed, ref } from "vue";
import { AppVersionResult, ConfigDto, GameModInfo, GenreXml, GetAssetsDirsResult, MusicXmlWithABJacket, VersionXml } from "@/client/apiGen";
import api, { aquaMaiVersionConfig } from "@/client/api";
import { captureException } from "@sentry/vue";
import posthog from "posthog-js";
import { useStorage } from "@vueuse/core";
import deniedOgg from "@/assets/Denied.ogg";

export const error = ref();
export const errorId = ref<string>();
export const errorContext = ref<string>();

export const globalCapture = async (err: any, context: string) => {
  console.log(err)
  if (err instanceof Response) {
    if (!err.bodyUsed) {
      // @ts-ignore
      const errText = err.error = await err.text();
      try {
        const json = JSON.parse(errText);
        if (json.exception.details && json.detail) {
          // @ts-ignore
          err.error = json.detail + '\n' + json.exception.details;
        }
      } catch {
      }
    }
  }
  error.value = err;
  errorContext.value = context;
  errorId.value = captureException(err.error || err, {
    tags: {
      context
    }
  })
  posthog.capture('error: ' + context, {
    err,
    errorId: errorId.value,
    message: error.value?.error?.message || error.value?.error?.toString() || error.value?.message || error.value?.toString(),
  })
  new Audio(deniedOgg).play();
}

export const showNeedPurchaseDialog = ref(false);

export const selectMusicId = ref(0)
export const genreList = ref<GenreXml[]>([]);
export const addVersionList = ref<VersionXml[]>([]);
export const selectedADir = useStorage<string>('selectedADir', 'A000');
export const musicListAll = ref<MusicXmlWithABJacket[]>([]);
export const assetDirs = ref<GetAssetsDirsResult[]>([]);
export const version = ref<AppVersionResult>();
export const modInfo = ref<GameModInfo>();

export const musicList = computed(() => musicListAll.value.filter(m => m.assetDir === selectedADir.value));
export const selectedMusic = computed(() => musicList.value.find(m => m.id === selectMusicId.value));

export const aquaMaiConfig = ref<ConfigDto>()
export const modUpdateInfo = ref<Awaited<ReturnType<typeof aquaMaiVersionConfig.getGetConfig>>['data']>([{
  type: 'builtin',
}])

export const updateGenreList = async () => {
  const response = await api.GetAllGenres();
  genreList.value = response.data;
}

export const updateAddVersionList = async () => {
  const response = await api.GetAllAddVersions();
  addVersionList.value = response.data;
}

export const updateMusicList = async () => {
  musicListAll.value = (await api.GetMusicList()).data;
}

export const updateAssetDirs = async () => {
  assetDirs.value = (await api.GetAssetsDirs()).data;
}

export const updateVersion = async () => {
  version.value = (await api.GetAppVersion()).data;
}

export const updateModInfo = async () => {
  modInfo.value = (await api.GetGameModInfo()).data;
}

export const updateModUpdateInfo = async () => {
  try {
    modUpdateInfo.value = await Promise.any([
      (async () => {
        const res = await aquaMaiVersionConfig.getGetConfig();
        return res.data;
      })(),
      (async () => {
        const res = await fetch('https://munet-version-config-1251600285.cos.ap-shanghai.myqcloud.com/aquamai.json');
        if (!res.ok) {
          throw new Error(`Failed to fetch mod update info: ${res.status} ${res.statusText}`);
        }
        return await res.json();
      })(),
    ]);
  } catch (e) {
    console.error('Failed to get mod update info:', e);
  }
}


export const updateAll = async () => Promise.all([
  updateGenreList(),
  updateAddVersionList(),
  updateAssetDirs(),
  updateVersion(),
  updateMusicList(),
  updateModInfo(),
  updateModUpdateInfo(),
])
