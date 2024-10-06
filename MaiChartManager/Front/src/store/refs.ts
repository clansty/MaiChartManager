import { computed, ref } from "vue";
import { AppVersionResult, GenreXml, GetAssetsDirsResult, MusicXmlWithABJacket, VersionXml } from "@/client/apiGen";
import api from "@/client/api";
import { captureException } from "@sentry/vue";
import posthog from "posthog-js";
import { useStorage } from "@vueuse/core";

export const error = ref();
export const errorId = ref<string>();
export const errorContext = ref<string>();

export const globalCapture = async (err: any, context: string) => {
  console.log(err)
  if (err instanceof Response) {
    if (!err.bodyUsed) {
      // @ts-ignore
      err.error = await err.text();
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
}

export const showNeedPurchaseDialog = ref(false);

export const selectMusicId = ref(0)
export const genreList = ref<GenreXml[]>([]);
export const addVersionList = ref<VersionXml[]>([]);
export const selectedADir = useStorage<string>('selectedADir', 'A000');
export const musicListAll = ref<MusicXmlWithABJacket[]>([]);
export const assetDirs = ref<GetAssetsDirsResult[]>([]);
export const version = ref<AppVersionResult>();

export const musicList = computed(() => musicListAll.value.filter(m => m.assetDir === selectedADir.value));
export const selectedMusic = computed(() => musicList.value.find(m => m.id === selectMusicId.value));

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

export const updateAll = async () => Promise.all([
  updateGenreList(),
  updateAddVersionList(),
  updateAssetDirs(),
  updateVersion(),
  updateMusicList(),
])
