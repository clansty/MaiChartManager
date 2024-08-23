import { computed, ref } from "vue";
import { GenreXml, MusicBrief, VersionXml } from "@/client/apiGen";
import api from "@/client/api";

export const selectMusicId = ref(0)
export const genreList = ref<GenreXml[]>([]);
export const addVersionList = ref<VersionXml[]>([]);
export const selectedADir = ref<string>('');
export const musicList = ref<MusicBrief[]>([]);

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
