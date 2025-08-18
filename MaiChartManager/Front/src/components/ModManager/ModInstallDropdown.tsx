import { defineComponent, PropType, ref, computed } from 'vue';
import { NButton, NDropdown, NText } from "naive-ui";
import { globalCapture, modInfo, modUpdateInfo, updateModInfo } from "@/store/refs";
import api from "@/client/api";
import styles from './ModInstallDropdown.module.sass'

export default defineComponent({
  props: {
    updateAquaMaiConfig: { type: Function, required: true }
  },
  setup(props, { emit }) {
    const installingAquaMai = ref(false)
    const showAquaMaiInstallDone = ref(false)

    const installAquaMai = async (type: string) => {
      console.log(type)
      try {
        // 但是你根本看不到这个加载图标，因为太快了
        installingAquaMai.value = true
        if (type === 'builtin') {
          await api.InstallAquaMai()
        } else {
          const version = modUpdateInfo.value?.find(it => it.type === type);
          if (!version) {
            throw new Error('未找到对应版本');
          }
          const urls = [version.url!];
          if (version.url2) {
            urls.push(version.url2);
          }
          await api.InstallAquaMaiOnline({
            type,
            urls,
            sign: version.sign,
          });
        }
        await updateModInfo()
        await props.updateAquaMaiConfig()
        showAquaMaiInstallDone.value = true
        setTimeout(() => showAquaMaiInstallDone.value = false, 3000);
      } catch (e: any) {
        globalCapture(e, "安装 AquaMai 失败，文件可能被占用了？")
      } finally {
        installingAquaMai.value = false
      }
    }

    const options = computed(() => [
      ...modUpdateInfo.value?.map(it => ({
        key: it.type,
        label: () => <div class="h-min lh-normal py-1">
          <div>
            {it.type === 'builtin' && '内置'}
            {it.type === 'ci' && '开发版'}
            {it.type === 'release' && '正式版'}
          </div>
          <NText depth={3} class={'text-sm'}>
            {it.type === 'builtin' ? `v${modInfo.value?.bundledAquaMaiVersion}` : it.version}
          </NText>
        </div>
      })),
      { type: 'divider' },
      {
        key: 'tip',
        type: 'render',
        render: () => <NText depth={3} class={'px-3'}>开发版很可能比正式版稳定。 ——鲁迅没说过</NText>,
      }
    ])


    return () => <NDropdown trigger="click" options={options.value} class={styles.options} onSelect={installAquaMai}>
      <NButton secondary loading={installingAquaMai.value}
               type={showAquaMaiInstallDone.value ? 'success' : 'default'}>
        {showAquaMaiInstallDone.value ? <span class="i-material-symbols-done"/> : modInfo.value?.aquaMaiInstalled ? '重新安装 / 更新' : '安装'}
      </NButton>
    </NDropdown>
  },
});
