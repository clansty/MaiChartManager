import { computed, defineComponent, ref, watch } from "vue";
import { DialogOptions, NButton, NFlex, NForm, NFormItem, NInputNumber, NModal, useDialog } from "naive-ui";
import { globalCapture, musicList, selectedADir, selectMusicId, updateAll } from "@/store/refs";
import api from "@/client/api";
import MusicIdConflictNotifier from "@/components/MusicIdConflictNotifier";

export default defineComponent({
  props: {
    show: Boolean,
  },
  setup(props, {emit}) {
    const show = computed({
      get: () => props.show,
      set: (val) => emit('update:show', val)
    })
    const id = ref(0);
    watch(() => show.value, val => {
      if (!val) return;
      id.value = selectMusicId.value;
    })
    const dialog = useDialog();
    const loading = ref(false);

    const awaitDialog = (options: DialogOptions) => new Promise<boolean>(resolve => {
      dialog.create({
        ...options,
        onPositiveClick: () => resolve(true),
        onNegativeClick: () => resolve(false),
      });
    })

    const save = async () => {
      if (musicList.value.find(it => it.id === id.value)) {
        const choice = await awaitDialog({
          type: 'warning',
          title: 'ID 已存在',
          content: '要覆盖吗？',
          positiveText: '覆盖',
          negativeText: '取消',
        });
        if (!choice) return;
      }
      if (Math.floor(id.value / 1e4) !== Math.floor(selectMusicId.value / 1e4)) {
        const choice = await awaitDialog({
          type: 'warning',
          title: '继续的话可能会改变乐曲属性',
          content: '比如说 DX 和标准乐谱、宴会场之类。要继续吗？',
          positiveText: '继续',
          negativeText: '取消',
        });
        if (!choice) return;
      }
      try {
        loading.value = true;
        await api.ModifyId(selectMusicId.value, selectedADir.value, id.value);
        await updateAll();
        selectMusicId.value = id.value;
        show.value = false;
      } catch (e) {
        globalCapture(e, '修改 ID 时出现错误');
      } finally {
        loading.value = false;
      }
    }

    return () => <NModal
      preset="card"
      class="w-[min(30vw,25em)]"
      title="更改 ID"
      v-model:show={show.value}
    >{{
      default: () => <NForm label-placement="left" labelWidth="5em" showFeedback={false} disabled={loading.value}>
        <NFlex vertical size="large">
          <NFormItem label="新的 ID">
            <NFlex align="center" wrap={false}>
              <NInputNumber v-model:value={id.value} class="w-full" min={1} max={999999}/>
              <MusicIdConflictNotifier id={id.value}/>
            </NFlex>
          </NFormItem>
        </NFlex>
      </NForm>,
      footer: () => <NFlex justify="end">
        <NButton onClick={save} disabled={id.value === selectMusicId.value} loading={loading.value}>确定</NButton>
      </NFlex>
    }}</NModal>;
  }
})
