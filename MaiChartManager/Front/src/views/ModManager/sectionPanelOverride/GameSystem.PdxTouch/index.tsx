import { Button, DropMenu, TextInput, addToast } from '@munet/ui';
import type { AquaMaiConfigSection, EntryState, SectionState } from '@aquamai/config-editor';
import { ConfigEntry, ENTRY_GROUP_PADDING, ENTRY_LABEL_CLASS } from '@aquamai/config-editor';
import { defineComponent, onMounted, ref, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import api from '@/client/api';
import { globalCapture } from '@/store/refs';

interface PdxDriverStatus {
  available: boolean;
  deviceCount: number;
  isUsingWinusb: boolean;
  devicePaths: string[];
}

export default defineComponent({
  props: {
    section: { type: Object as PropType<AquaMaiConfigSection>, required: true },
    entryStates: { type: Object as PropType<Record<string, EntryState>>, required: true },
    sectionState: { type: Object as PropType<SectionState>, required: true },
  },
  setup(props) {
    const { t } = useI18n();
    const deviceStatus = ref<PdxDriverStatus | null>(null);
    const statusLoading = ref(false);
    const switchLoading = ref(false);
    const PREFIX = 'GameSystem.PdxTouch.';
    const knownPaths = [PREFIX + 'Path1p', PREFIX + 'Path2p'];

    const refresh = async () => {
      statusLoading.value = true;
      try {
        const status = (await api.GetPdxDriverStatus()).data;
        // apiGen 生成的字段全是可选的，收窄成面板要的形状
        deviceStatus.value = status
          ? {
            available: status.available ?? false,
            deviceCount: status.deviceCount ?? 0,
            isUsingWinusb: status.isUsingWinusb ?? false,
            devicePaths: status.devicePaths ?? [],
          }
          : null;
      } catch (error) {
        globalCapture(error, t('mod.pdx.switchFailed'));
      } finally {
        statusLoading.value = false;
      }
    };

    const switchDriver = async () => {
      const isWinusb = deviceStatus.value?.isUsingWinusb;
      const direction = isWinusb ? 'wintouch' : 'exclusive';
      switchLoading.value = true;
      try {
        await api.SwitchPdxDriver({ direction });
        addToast({ message: t('mod.pdx.switchSuccess'), type: 'success' });
      } catch (error) {
        const fallback = (error as { status?: number } | null)?.status === 400
          ? 'mod.pdx.switchCancelled'
          : 'mod.pdx.switchFailed';
        globalCapture(error, t(fallback));
      } finally {
        switchLoading.value = false;
        await refresh();
      }
    };

    onMounted(refresh);

    return () => {
      const status = deviceStatus.value;
      const paths = status?.devicePaths ?? [];

      return <div class={["flex flex-col gap-2", ENTRY_GROUP_PADDING]}>
        {/* Device status area */}
        <div class="flex gap-2 items-center m-l-35 flex-wrap">
          {status && !status.available && <span class="op-60">{t('mod.pdx.unavailable')}</span>}
          {status?.available && status.deviceCount === 0 && <span class="op-60">{t('mod.pdx.noDevice')}</span>}
          {status?.available && !!status.deviceCount && <>
            <span>{t('mod.pdx.deviceCount', { count: status.deviceCount })}</span>
            <span class="op-60 text-sm">
              {status.isUsingWinusb ? t('mod.pdx.driverWinusb') : t('mod.pdx.driverDefault')}
            </span>
          </>}
          <Button onClick={refresh} ing={statusLoading.value}>
            {t('mod.pdx.refresh')}
          </Button>
          {status?.available && (status?.deviceCount ?? 0) > 0 &&
            <Button
              onClick={switchDriver}
              ing={switchLoading.value}
            >
              {status?.isUsingWinusb ? t('mod.pdx.switchToWintouch') : t('mod.pdx.switchToExclusive')}
            </Button>
          }
        </div>

        <div class="grid grid-cols-1 min-[500px]:grid-cols-2 gap-y-12px">
          {/* path1p input */}
          {props.section.entries?.some(it => it.path === PREFIX + 'Path1p') &&
            <div class="flex gap-2 items-start">
              <div class={ENTRY_LABEL_CLASS}>{t('mod.pdx.path1P')}</div>
              <div class="flex-1 flex flex-col gap-1">
                <DropMenu
                  options={(paths).map(p => ({
                    label: p,
                    action: () => { props.entryStates[PREFIX + 'Path1p']!.value = p; },
                  }))}
                >
                  {{
                    trigger: (toggle: (val?: boolean) => void) =>
                      <TextInput
                        class="w-full" innerClass="h-42px!"
                        v-model:value={props.entryStates[PREFIX + 'Path1p']!.value}
                        onFocus={() => paths.length > 0 && toggle(true)}
                      />,
                  }}
                </DropMenu>
                <div class="text-sm op-80">{t('mod.pdx.pathDesc')}</div>
              </div>
            </div>
          }

          {/* path2p input */}
          {props.section.entries?.some(it => it.path === PREFIX + 'Path2p') &&
            <div class="flex gap-2 items-start">
              <div class={ENTRY_LABEL_CLASS}>{t('mod.pdx.path2P')}</div>
              <div class="flex-1 flex flex-col gap-1">
                <DropMenu
                  options={(paths).map(p => ({
                    label: p,
                    action: () => { props.entryStates[PREFIX + 'Path2p']!.value = p; },
                  }))}
                >
                  {{
                    trigger: (toggle: (val?: boolean) => void) =>
                      <TextInput
                        class="w-full" innerClass="h-42px!"
                        v-model:value={props.entryStates[PREFIX + 'Path2p']!.value}
                        onFocus={() => paths.length > 0 && toggle(true)}
                      />,
                  }}
                </DropMenu>
              </div>
            </div>
          }
        </div>

        {/* remaining entries (e.g. radius) */}
        {props.section.entries?.filter(it => !knownPaths.includes(it.path!))
          .map((entry) => {
            const state = props.entryStates[entry.path];
            return state ? <ConfigEntry key={entry.path} entry={entry} entryState={state} /> : null;
          })}
      </div>;
    };
  },
});
