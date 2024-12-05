import {musicListAll} from "@/store/refs";

export default (extraExistedIds = [] as number[]) => {
  const existedIds = musicListAll.value.map(v => v.id!).concat(extraExistedIds).map(it => it % 1e4);
  let id = 4999;
  for (const existed of existedIds) {
    if (id < existed) {
      id = existed;
    }
  }
  id++;
  if (id > 9999) {
    id = 9999;
    while (existedIds.includes(id)) {
      id--;
    }
  }
  return id;
}
