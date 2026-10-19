import { Button, Modal, NumberInput, Select, showTransactionalDialog } from "@munet/ui";
import { computed, defineComponent, PropType, ref } from "vue";
import { addVersionList, assetDirs, genreList, selectedADir, updateAddVersionList, updateGenreList } from "@/store/refs";
import api from "@/client/api";
import { EDIT_TYPE } from "./index";
import { useI18n } from 'vue-i18n';

export default defineComponent({
  props: {
    setEditId: {type: Function as PropType<(id: number) => any>, required: true},
    type: Number as PropType<EDIT_TYPE>,
  },
  setup(props) {
    const show = ref(false);
    const { t } = useI18n();
    const type = computed(() => props.type ?? EDIT_TYPE.Genre);
    const text = computed(() => type.value === EDIT_TYPE.Genre ? t('genre.title') : t('version.title'));
    // 必须响应 tab 切换，否则会拿错列表去找空 ID
    const list = computed(() => type.value === EDIT_TYPE.Genre ? genreList.value : addVersionList.value);
    // A000 是游戏内置资源目录，不可写；写进去的流派在列表里也删不掉，所以这里直接排除
    const dirOptions = computed(() => assetDirs.value
      .filter(it => it.dirName && it.dirName !== 'A000')
      .map(dir => ({label: dir.dirName!, value: dir.dirName!})));

    const assetDir = ref('')
    const id = ref(0)

    const setShow = () => {
      // 不能沿用可能是 A000 的 selectedADir，否则会出现"显示请选择但实际已绑定 A000"的情况
      assetDir.value = dirOptions.value.some(it => it.value === selectedADir.value)
        ? selectedADir.value
        : (dirOptions.value[0]?.value ?? '');
      for (let i = 100; i < 1000; i++) {
        if (list.value.some(it => it.id === i)) continue
        id.value = i;
        break;
      }
      show.value = true
    }

    const save = async () => {
      if (!assetDir.value) {
        await showTransactionalDialog(t('genre.createFailed'), t('genre.assetDirRequired'), undefined, true);
        return;
      }
      show.value = false
      const res = await (type.value === EDIT_TYPE.Genre ? api.AddGenre : api.AddVersion)({
        assetDir: assetDir.value,
        id: id.value,
      });
      if (res.error) {
        const error = res.error as any;
        await showTransactionalDialog(t('genre.createFailed'), error.message || error, undefined, true);
        return;
      }
      if (res.data) {
        await showTransactionalDialog(t('genre.createFailed'), res.data, undefined, true);
        return;
      }
      await updateAddVersionList();
      await updateGenreList();
      props.setEditId(id.value);
    }

    return () => (
      <Button onClick={setShow}>
        {t('common.create')}

        <Modal
          width="min(30vw,25em)"
          title={`${t('common.create')}${text.value}`}
          v-model:show={show.value}
        >{{
          default: () => <div class="flex flex-col gap-3">
            <div>
              <div class="ml-1 text-sm">ID</div>
              <NumberInput v-model:value={id.value} class="w-full" min={1}/>
            </div>
            <div>
              <div class="ml-1 text-sm">Opt</div>
              <Select
                v-model:value={assetDir.value}
                options={dirOptions.value}
              />
            </div>
          </div>,
          actions: () => <>
            <Button onClick={save}>{t('common.confirm')}</Button>
          </>
        }}</Modal>
      </Button>
    )
  }
})
