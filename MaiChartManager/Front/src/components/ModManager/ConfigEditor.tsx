import { computed, defineComponent, onMounted, PropType, ref, watch } from "vue";
import { NAnchor, NAnchorLink, NButton, NCheckbox, NDivider, NFlex, NFormItem, NInput, NInputNumber, NModal, NScrollbar, NSelect, NSwitch, useDialog } from "naive-ui";
import { AquaMaiConfig, GameModInfo } from "@/client/apiGen";
import comments from './modComments.yaml';
import api from "@/client/api";
import { capitalCase, pascalCase } from "change-case";
import ProblemsDisplay from "@/components/ProblemsDisplay";
import { globalCapture, modInfo, updateModInfo } from "@/store/refs";

export default defineComponent({
  props: {
    show: Boolean,
    disableBadge: Boolean,
    badgeType: String,
  },
  setup(props, {emit}) {
    const show = computed({
      get: () => props.show,
      set: (val) => emit('update:show', val)
    })
    const disableBadge = computed({
      get: () => props.disableBadge,
      set: (val) => emit('update:disableBadge', val)
    })

    const config = ref<AquaMaiConfig>()
    const commentsEmbedded = ref<Record<string, Record<string, string>>>({})
    const dialog = useDialog()
    const installingMelonLoader = ref(false)
    const installingAquaMai = ref(false)
    const showAquaMaiInstallDone = ref(false)
    const customSettingsPanels = import.meta.glob('./customSettingPanels/**/Panel.tsx', {eager: true})

    onMounted(async () => {
      const ret = (await api.GetAquaMaiConfig()).data;
      config.value = ret.config
      commentsEmbedded.value = ret.comments!
    })

    const installMelonLoader = async () => {
      try {
        installingMelonLoader.value = true
        await api.InstallMelonLoader()
        await updateModInfo()
      } catch (e: any) {
        globalCapture(e, "安装 MelonLoader 失败")
      } finally {
        installingMelonLoader.value = false
      }
    }

    const installAquaMai = async () => {
      try {
        // 但是你根本看不到这个加载图标，因为太快了
        installingAquaMai.value = true
        await api.InstallAquaMai()
        await updateModInfo()
        showAquaMaiInstallDone.value = true
        setTimeout(() => showAquaMaiInstallDone.value = false, 3000);
      } catch (e: any) {
        globalCapture(e, "安装 AquaMai 失败，文件可能被占用了？")
      } finally {
        installingAquaMai.value = false
      }
    }

    watch(() => show.value, async (val) => {
      if (!val && config.value) {
        try {
          await api.SetAquaMaiConfig(config.value)
        } catch (e) {
          globalCapture(e, "保存 AquaMai 配置失败")
        }
      }
    })

    const getSectionTitle = (key: string) => comments.sections[key] || commentsEmbedded.value.sections?.[pascalCase(key)]

    const getCustomPanelForSetting = (section: string, key?: string) => {
      if (!key) {
        return (customSettingsPanels[`./customSettingPanels/${section}/Panel.tsx`] as any)?.default
      }
      return (customSettingsPanels[`./customSettingPanels/${section}/${key}/Panel.tsx`] as any)?.default
    }

    return () => <NModal
      preset="card"
      class="w-[min(90vw,90em)]"
      title="Mod 管理"
      v-model:show={show.value}
    >
      {!!modInfo.value && <NFlex vertical>
        <NFlex align="center">
          MelonLoader:
          {modInfo.value.melonLoaderInstalled ? <span class="c-green-6">已安装</span> : <span class="c-red-6">未安装</span>}
          {!modInfo.value.melonLoaderInstalled && <NButton secondary loading={installingMelonLoader.value} onClick={installMelonLoader}>安装</NButton>}
          <div class="w-8"/>
          AquaMai:
          {modInfo.value.aquaMaiInstalled ?
            modInfo.value.aquaMaiVersion === modInfo.value.bundledAquaMaiVersion ? <span class="c-green-6">已安装</span> : <span class="c-orange">可更新</span> :
            <span class="c-red-6">未安装</span>}
          <NButton secondary loading={installingAquaMai.value} onClick={() => installAquaMai()}
                   type={showAquaMaiInstallDone.value ? 'success' : 'default'}>
            {showAquaMaiInstallDone.value ? <span class="i-material-symbols-done"/> : modInfo.value.aquaMaiInstalled ? '重新安装 / 更新' : '安装'}
          </NButton>
          已安装:
          <span>{modInfo.value.aquaMaiVersion}</span>
          可安装:
          <span class={modInfo.value.aquaMaiVersion === modInfo.value.bundledAquaMaiVersion ? "" : "c-orange"}>{modInfo.value.bundledAquaMaiVersion}</span>
        </NFlex>
        {props.badgeType && <NCheckbox v-model:checked={disableBadge.value}>隐藏按钮上的角标</NCheckbox>}
        <div class="grid cols-[17em_auto]">
          <NAnchor type="block" offsetTarget="#scroll">
            {Object.keys(config.value!).map((key) => <NAnchorLink key={key} title={getSectionTitle(key)} href={`#${key}`}/>)}
          </NAnchor>
          {config.value && <NScrollbar class="max-h-60vh p-2"
            // @ts-ignore
                                       id="scroll"
          >
            {Object.entries(config.value).map(([key, section]) => {
              // 这里开始某个分类设置的渲染
              const CustomPanel = getCustomPanelForSetting(key)

              return !!section && <div id={key} key={key}>
                  <NDivider titlePlacement="left" key={key}>{getSectionTitle(key)}</NDivider>
                {CustomPanel ?
                  <CustomPanel config={section} commentsEmbedded={commentsEmbedded.value}/> :
                  Object.keys(section).map((k) => {
                    // 这里开始某个设置子项的渲染
                    const CustomPanelSub = getCustomPanelForSetting(key, k)

                    if (CustomPanelSub) {
                      return <CustomPanelSub config={section} commentsEmbedded={commentsEmbedded.value} key={k}/>
                    }

                    return <NFormItem key={k} label={capitalCase(k)} labelPlacement="left" labelWidth="10em">
                      <NFlex vertical class="w-full ws-pre-line">
                        <NFlex class="h-34px" align="center">
                          {(() => {
                            const choices = comments.options[key]?.[k]
                            if (choices) {
                              return <NSelect v-model:value={section[k]} options={choices} clearable/>
                            }
                            return <>
                              {typeof section[k] === 'boolean' && <NSwitch v-model:value={section[k]}/>}
                              {typeof section[k] === 'string' && <NInput v-model:value={section[k]} placeholder="" onUpdateValue={v => section[k] = typeof v === 'string' ? v : ''}/>}
                              {typeof section[k] === 'number' && <NInputNumber value={section[k]} onUpdateValue={v => section[k] = typeof v === 'number' ? v : 0} placeholder="" step={comments.steps[k] || 1}/>}
                            </>
                          })()}
                          {comments.shouldEnableOptions[key]?.[k] && !section[k] && <ProblemsDisplay problems={['需要开启此选项']}/>}
                        </NFlex>
                        {comments[key]?.[k] || commentsEmbedded.value[pascalCase(key)]?.[pascalCase(k)]}
                      </NFlex>
                    </NFormItem>;
                  })
                }
              </div>;
            })}
          </NScrollbar>}
        </div>
      </NFlex>}
    </NModal>;
  }
})
