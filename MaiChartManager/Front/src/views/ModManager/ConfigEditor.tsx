import { defineComponent, nextTick, ref, watch } from "vue";

import api from "@/client/api";
import { globalCapture, modInfo, updateModInfo, updateMusicList } from "@/store/refs";
import { AquaMaiConfigurator } from '@aquamai/config-editor';
import type { ConfigDto as EditorConfigDto } from '@aquamai/config-editor';
import { toEditorConfig, toSaveDto } from './editorAdapter';
import { getMcmSectionPanelOverride } from './sectionPanelOverride';
import { latestVersion, shouldShowUpdate, isMuModMode } from "./shouldShowUpdateController";
import ModInstallDropdown from "@/views/ModManager/ModInstallDropdown";
import { useI18n } from 'vue-i18n';
import { Button, addToast, Radio } from '@munet/ui';
import { debounce } from 'perfect-debounce';
import AquaMaiSignatureStatusDisplay from "./AquaMaiSignatureStatusDisplay";
import { useAsyncState } from '@vueuse/core';
import { aquaMaiConfig as config, configReadErr, configReadErrTitle, updateAquaMaiConfig, configJustLoaded, muModChannel, isBothModsPresent, updateMuModChannel } from "./refs";

export default defineComponent({
  setup() {

    const { t } = useI18n();
    const editorConfig = ref<EditorConfigDto>();
    const { isLoading: installingMelonLoader, execute: installMelonLoader } = useAsyncState(async () => {
      await api.InstallMelonLoader()
      await updateModInfo()
    }, undefined, {
      immediate: false,
      onError: (e: any) => globalCapture(e, t('mod.installMelonLoaderFailed')),
    })


    const saveImpl = async () => {
      if (!editorConfig.value) return;
      try {
        await api.SetAquaMaiConfig(toSaveDto(editorConfig.value))
        await updateMusicList()
        addToast({ message: t('music.save.saveSuccess'), type: 'success' })
      } catch (e) {
        globalCapture(e, t('mod.saveConfigFailed'))
      }
    }
    const save = debounce(saveImpl, 2000);

    watch(() => config.value, (value) => {
      editorConfig.value = value ? toEditorConfig(value) : undefined;
    }, { immediate: true });

    watch(editorConfig, async () => {
      if (!editorConfig.value) return;
      if (configJustLoaded.value) {
        configJustLoaded.value = false;
        console.log('配置刚加载')
        return;
      }
      if (configReadErr.value) return;
      console.log('配置变动');
      save();
    }, { deep: true })

    const resetToDefault = async () => {
      await updateAquaMaiConfig(true);
      await nextTick();
      await saveImpl();
    }

    const loadConfigIgnoreSignature = async () => {
      await updateAquaMaiConfig(false, true);
    }

    const localMuModChannel = ref(muModChannel.value);
    watch(muModChannel, (v) => { localMuModChannel.value = v; });

    const { execute: deleteAquaMai } = useAsyncState(async () => {
      await api.DeleteAquaMai();
      await updateModInfo();
      await updateAquaMaiConfig();
    }, undefined, {
      immediate: false,
      onError: (e: any) => globalCapture(e, t('mod.conflict.deleteAquaMai')),
    });

    const { execute: deleteMuMod } = useAsyncState(async () => {
      await api.DeleteMuMod();
      await updateModInfo();
      await updateAquaMaiConfig();
    }, undefined, {
      immediate: false,
      onError: (e: any) => globalCapture(e, t('mod.conflict.deleteMuMod')),
    });

    watch(localMuModChannel, (v) => {
      if (v !== muModChannel.value) {
        updateMuModChannel(v);
      }
    });

    return () => {

      let editorPart = <></>;
      if (configReadErrTitle.value.includes('ConfigCorruptedException')) {
        editorPart = <div class="flex flex-col gap-2 justify-center items-center min-h-100">
          <div class="text-8">{t('mod.configCorrupted')}</div>
          <div class="c-gray-5 text-lg">{t('mod.configCorruptedMessage')}</div>
          <div>
            <Button onClick={resetToDefault}>
              {t('mod.resetToDefault')}
            </Button>
          </div>
        </div>
      }
      else if (configReadErrTitle.value.includes('AquaMaiSignatureVerificationFailedException')) {
        editorPart = <div class="flex flex-col gap-2 justify-center items-center min-h-100">
          <div class="text-8">{t('mod.aquaMaiSignatureVerificationFailed')}</div>
          <div class="c-gray-5 text-lg">{t('mod.aquaMaiSignatureVerificationFailedMessage')}</div>
          <div>
            <Button onClick={loadConfigIgnoreSignature}>
              {t('mod.loadConfigIgnoreSignature')}
            </Button>
          </div>
        </div>
      }
      else if (configReadErr.value) {
        const errTitle = t(configReadErrTitle.value === 'mod.configVersionHigher' ? 'mod.configVersionHigher' : 'mod.needInstallOrUpdate');
        const errMsg = configReadErr.value.startsWith('mod.') ? t(configReadErr.value) : configReadErr.value;
        editorPart = <div class="flex flex-col gap-2 justify-center items-center min-h-100">
          <div class="text-8">{errTitle}</div>
          <div class="c-gray-5 text-lg">{errMsg}</div>
          <div class="c-gray-4 text-sm">{configReadErrTitle.value}</div>
        </div>
      }
      else {
        editorPart = editorConfig.value
          ? <AquaMaiConfigurator config={editorConfig.value} useNewSort={true} getSectionPanelOverride={getMcmSectionPanelOverride}/>
          : <></>
      }

      return <div class="flex flex-col gap-2 flex-1 min-h-0">
        {!!modInfo.value && <div class="flex flex-col gap-2 flex-1 min-h-0">
          <div class="flex gap-2 items-center flex-wrap">
            <span class="max-[1060px]:hidden">MelonLoader:</span>
            {modInfo.value.melonLoaderInstalled ? <span class="c-green-6 max-[1060px]:hidden">{t('mod.installed')}</span> : <span class="c-red-6">{t('mod.notInstalled')}</span>}
            {!modInfo.value.melonLoaderInstalled && <Button ing={installingMelonLoader.value} onClick={() => installMelonLoader()}>{t('mod.install')}</Button>}
            <div class={["w-8", "max-[1060px]:hidden"]}/>
            <span class="max-[1060px]:hidden">{isMuModMode.value ? 'MuMod:' : 'AquaMai:'}</span>
            {isMuModMode.value ? (
              <span class="c-green-6 max-[1060px]:hidden">{t('mod.mumodInstalled')}</span>
            ) : (
              modInfo.value.aquaMaiInstalled ?
                !shouldShowUpdate.value ? <span class="c-green-6 max-[1060px]:hidden">{t('mod.installed')}</span> : <span class="c-orange">{t('mod.updateAvailable')}</span> :
                <span class="c-red-6">{t('mod.notInstalled')}</span>
            )}
            <ModInstallDropdown/>
            <span class="max-[1060px]:hidden">{t('mod.installedVersion')}:</span>
            {isMuModMode.value ? (
              <span class="max-[450px]:hidden">v{modInfo.value.muModVersion ?? 'N/A'}</span>
            ) : (
              <span class="max-[450px]:hidden">{modInfo.value.aquaMaiVersion !== 'N/A' && 'v'}{modInfo.value.aquaMaiVersion}</span>
            )}
            <AquaMaiSignatureStatusDisplay/>
            <span class="max-[1060px]:hidden">{t('mod.availableVersion')}:</span>
            <span class={[shouldShowUpdate.value && "c-orange", "max-[1060px]:hidden"]}>{latestVersion.value.version}{isMuModMode.value && ` (${t('mod.loaded')})`}</span>
            <Button onClick={() => api.KillGameProcess()}>
              {t('mod.killGameProcess')}
            </Button>
            {isMuModMode.value && (
              <div class="flex gap-2 items-center">
                <span class="shrink-0">{t('mod.mumodChannel')}:</span>
                <Radio k={'slow'} v-model:value={localMuModChannel.value}>{t('mod.mumodChannelSlow')}</Radio>
                <Radio k={'fast'} v-model:value={localMuModChannel.value}>{t('mod.mumodChannelFast')}</Radio>
              </div>
            )}
          </div>
          {isBothModsPresent.value && (
            <div class="flex flex-col gap-2 p-4 bg-orange-50 border border-orange-200 border-solid rounded-xl">
              <div class="font-semibold c-orange-7">{t('mod.conflict.title')}</div>
              <div class="c-orange-6">{t('mod.conflict.message')}</div>
              <div class="flex gap-2">
                <Button onClick={() => deleteAquaMai()}>{t('mod.conflict.deleteAquaMai')}</Button>
                <Button onClick={() => deleteMuMod()}>{t('mod.conflict.deleteMuMod')}</Button>
              </div>
            </div>
          )}
          {!isBothModsPresent.value && editorPart}
        </div>}
      </div>
    };
  }
})
