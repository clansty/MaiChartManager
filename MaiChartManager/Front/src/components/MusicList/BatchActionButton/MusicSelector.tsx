import { computed, defineComponent, PropType } from "vue";
import { NButton, NFlex, NScrollbar, NVirtualList } from "naive-ui";
import { musicList, selectMusicId } from "@/store/refs";
import { MusicBrief } from "@/client/apiGen";
import MusicEntry from "@/components/MusicList/MusicEntry";

export default defineComponent({
  props: {
    selectedMusicIds: Array as PropType<number[]>,
    continue: {type: Function, required: true},
  },
  setup(props, {emit}) {
    const selectedMusicIds = computed<number[]>({
      get: () => props.selectedMusicIds!,
      set: (value) => emit('update:selectedMusicIds', value),
    });

    return () => <NFlex vertical size="large">
      <NFlex>
        <NButton onClick={() => selectedMusicIds.value = []}>全不选</NButton>
        <NButton onClick={() => selectedMusicIds.value = musicList.value.map(it => it.id!)}>全选</NButton>
        <NButton onClick={() => {
          const musicIds = musicList.value.map(it => it.id!);
          selectedMusicIds.value = musicIds.filter(id => !selectedMusicIds.value.includes(id));
        }}>反选</NButton>
      </NFlex>
      <NVirtualList class="flex-1 max-h-70vh h-70vh" itemSize={20 / 4 * 16} items={musicList.value}>
        {{
          default({item}: { item: MusicBrief }) {
            return (
              <MusicEntry music={item} selected={selectedMusicIds.value.includes(item.id!)} onClick={() => {
                selectedMusicIds.value = selectedMusicIds.value.includes(item.id!)
                  ? selectedMusicIds.value.filter(id => id !== item.id)
                  : [...selectedMusicIds.value, item.id!];
                console.log(selectedMusicIds.value)
              }} key={item.id}/>
            )
          }
        }}
      </NVirtualList>
      <NFlex justify="end">
        <NButton onClick={() => props.continue()} disabled={!selectedMusicIds.value.length}>继续</NButton>
      </NFlex>
    </NFlex>;
  }
})
