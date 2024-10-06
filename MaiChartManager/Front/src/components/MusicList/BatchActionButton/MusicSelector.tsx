import { computed, defineComponent, PropType } from "vue";
import { DataTableColumns, NButton, NFlex, NVirtualList } from "naive-ui";
import { musicList } from "@/store/refs";
import { MusicXmlWithABJacket } from "@/client/apiGen";
import MusicEntry from "@/components/MusicList/MusicEntry";
import JacketBox from "@/components/JacketBox";

const columns: DataTableColumns<MusicXmlWithABJacket> = [
  {type: 'selection'},
  {title: '资源目录', key: 'assetDir'},
  {title: 'ID', key: 'id'},
  {
    title: '封面',
    key: 'jacket',
    render: (row) => <JacketBox info={row} upload={false}/>
  },
  {title: '标题', key: 'title'},
]

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
          default({item}: { item: MusicXmlWithABJacket }) {
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
