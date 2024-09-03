import { computed, ref } from "vue";
import { AppVersionResult, GenreXml, MusicBrief, VersionXml } from "@/client/apiGen";
import api from "@/client/api";
import { captureException } from "@sentry/vue";

export const error = ref();
export const errorId = ref<string>();
export const errorContext = ref<string>();

export const globalCapture = (err: any, context: string) => {
  error.value = err;
  errorContext.value = context;
  errorId.value = captureException(err.error || err, {
    tags: {
      context
    }
  })
}

export const selectMusicId = ref(0)
export const genreList = ref<GenreXml[]>([]);
export const addVersionList = ref<VersionXml[]>([]);
export const selectedADir = ref<string>('');
export const musicList = ref<MusicBrief[]>([]);
export const assetDirs = ref<string[]>([]);
export const version = ref<AppVersionResult>();

export const selectedMusicBrief = computed(() => musicList.value.find(m => m.id === selectMusicId.value));

export const updateGenreList = async () => {
  const response = await api.GetAllGenres();
  genreList.value = response.data;
}

export const updateAddVersionList = async () => {
  const response = await api.GetAllAddVersions();
  addVersionList.value = response.data;
}

export const updateSelectedAssetDir = async () => {
  selectedADir.value = (await api.GetSelectedAssetsDir()).data;
}

export const updateMusicList = async () => {
  musicList.value = (await api.GetMusicList()).data;
}

export const updateAssetDirs = async () => {
  assetDirs.value = (await api.GetAssetsDirs()).data;
}

export const updateVersion = async () => {
  version.value = (await api.GetAppVersion()).data;
}
