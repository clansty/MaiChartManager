import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { NButton, NDivider, NFlex, NFormItem, NInput, NModal, NScrollbar, NSwitch, useDialog } from "naive-ui";
import { Config } from "@/client/apiGen";
import comments from './modComments.yaml';
import api from "@/client/api";
import { capitalCase } from "change-case";
import ProblemsDisplay from "@/components/ProblemsDisplay";

export default defineComponent({
  props: {
    show: Boolean,
    isMelonLoaderInstalled: Boolean,
    isAquaMaiInstalled: Boolean,
  },
  setup(props, {emit}) {
    const show = computed({
      get: () => props.show,
      set: (val) => emit('update:show', val)
    })
    const isMelonLoaderInstalled = computed({
      get: () => props.isMelonLoaderInstalled,
      set: (val) => emit('update:isMelonLoaderInstalled', val)
    })
    const isAquaMaiInstalled = computed({
      get: () => props.isAquaMaiInstalled,
      set: (val) => emit('update:isAquaMaiInstalled', val)
    })

    const config = ref<Config>()
    const dialog = useDialog()
    const installingMelonLoader = ref(false)
    const installingAquaMai = ref(false)
    const showAquaMaiInstallDone = ref(false)

    onMounted(async () => {
      config.value = (await api.GetAquaMaiConfig()).data;
    })

    const installMelonLoader = async () => {
      try {
        installingMelonLoader.value = true
        await api.InstallMelonLoader()
        isMelonLoaderInstalled.value = true
      } catch (e: any) {
        dialog.error({title: '安装失败', content: e.toString()})
      } finally {
        installingMelonLoader.value = false
      }
    }

    const installAquaMai = async () => {
      if (showAquaMaiInstallDone.value) return
      try {
        // 但是你根本看不到这个加载图标，因为太快了
        installingAquaMai.value = true
        await api.InstallAquaMai()
        isAquaMaiInstalled.value = true
        showAquaMaiInstallDone.value = true
        setTimeout(() => showAquaMaiInstallDone.value = false, 3000);
      } catch (e: any) {
        dialog.error({title: '安装失败', content: e.toString()})
      } finally {
        installingAquaMai.value = false
      }
    }

    watch(() => show.value, async (val) => {
      if (!val && config.value) {
        await api.SetAquaMaiConfig(config.value)
      }
    })

    return () => <NModal
      preset="card"
      class="w-[min(65vw,70em)]"
      title="Mod 管理"
      v-model:show={show.value}
    >
      <NFlex vertical>
        <NFlex align="center">
          MelonLoader:
          {isMelonLoaderInstalled.value ? <span class="c-green-6">已安装</span> : <span class="c-red-6">未安装</span>}
          {!isMelonLoaderInstalled.value && <NButton secondary loading={installingMelonLoader.value} onClick={installMelonLoader}>安装</NButton>}
          <div class="w-8"/>
          AquaMai:
          {isAquaMaiInstalled.value ? <span class="c-green-6">已安装</span> : <span class="c-red-6">未安装</span>}
          <NButton secondary loading={installingAquaMai.value} onClick={installAquaMai} type={showAquaMaiInstallDone.value ? 'success' : 'default'}>
            {showAquaMaiInstallDone.value ? <span class="i-material-symbols-done"/> : isAquaMaiInstalled.value ? '重新安装 / 更新' : '安装'}
          </NButton>
        </NFlex>
        {config.value && <NScrollbar class="max-h-60vh p-2">
          {Object.entries(config.value).map(([key, section]) => !!section && <>
            <NDivider titlePlacement="left">{comments.sections[key]}</NDivider>
            {Object.keys(section).map((k) => <NFormItem label={capitalCase(k)} labelPlacement="left" labelWidth="10em">
              <NFlex vertical class="w-full ws-pre-line">
                <NFlex class="h-34px" align="center">
                  {typeof section[k] === 'boolean' ? <NSwitch v-model:value={section[k]}/> : <NInput v-model:value={section[k]} placeholder=""/>}
                  {comments.shouldEnableOptions[key]?.[k] && !section[k] && <ProblemsDisplay problems={['需要开启此选项']}/>}
                </NFlex>
                {comments[key]?.[k]}
              </NFlex>
            </NFormItem>)}
          </>)}
        </NScrollbar>}
      </NFlex>
    </NModal>;
  }
})
