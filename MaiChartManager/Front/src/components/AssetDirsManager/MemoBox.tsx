import { computed, defineComponent, PropType, ref, watch } from "vue";
import { NButton, NFlex, NFormItem, NInput, NModal } from "naive-ui";
import { GetAssetsDirsResult } from "@/client/apiGen";
import api from "@/client/api";
import { selectMusicId, updateAssetDirs, updateMusicList } from "@/store/refs";

export default defineComponent({
  props: {
    show: Boolean,
    dir: {type: Object as PropType<GetAssetsDirsResult>, required: true},
    name: {type: String, required: true},
  },
  setup(props, {emit}) {
    const show = computed({
      get: () => props.show,
      set: (val) => emit('update:show', val)
    })

    const content = ref('');
    const name = ref('');
    const load = ref(false);

    watch(() => props.show, async (newValue, oldValue) => {
      if (newValue) {
        load.value = true;
        content.value = '';
        name.value = '';
        if (props.name !== 'add') {
          const req = await api.GetAssetDirTxtValue({dirName: props.dir.dirName, fileName: props.name});
          content.value = req.data;
        }
        load.value = false;
      }
    })

    const save = async () => {
      load.value = true;
      await api.PutAssetDirTxtValue({dirName: props.dir.dirName, fileName: props.name === 'add' ? name.value + '.txt' : props.name, content: content.value});
      await updateAssetDirs();
      show.value = false;
      load.value = false;
    }

    const deleteLoading = ref(false);
    const deleteConfirm = ref(false);

    const del = async () => {
      if (!deleteConfirm.value) {
        deleteConfirm.value = true;
        return;
      }
      deleteConfirm.value = false;
      deleteLoading.value = true;
      await api.DeleteAssetDirTxt({dirName: props.dir.dirName, fileName: props.name});
      deleteLoading.value = false;
      show.value = false;
      updateAssetDirs();
    }

    return () => <NModal
      preset="card"
      class="w-[min(60vw,80em)]"
      title="编辑"
      v-model:show={show.value}
      maskClosable={false}
    >{{
      default: () =>
        <NFlex vertical size="large">
          {props.name === 'add' && <NFormItem label="名称" labelPlacement="left" showFeedback={false}>
            <NInput v-model:value={name.value}/>
          </NFormItem>}
          <NInput type="textarea" v-model:value={content.value} class="h-60vh" disabled={load.value} resizable={false}/>
        </NFlex>,
      footer: () =>
        <NFlex justify="space-between">
          {props.name !== 'add' ? <NButton secondary onClick={del} loading={deleteLoading.value} type={deleteConfirm.value ? 'error' : 'default'}
            // @ts-ignore
                                           onMouseleave={() => deleteConfirm.value = false}>删除</NButton> : <div/>}
          <NButton secondary onClick={save}>保存</NButton>
        </NFlex>
    }}</NModal>;
  }
})
