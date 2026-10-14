import { computed, defineComponent, h, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { CheckBox, Popover, TransitionVertical } from '@munet/ui';
import { modComments } from '../modComments';
import type { ConfigSection as ConfigSectionModel, EntryState, SectionState } from '../types';
import { getNameForPath } from '../utils';
import { ENTRY_GROUP_PADDING } from '../constants';
import {
  getSectionPanelOverride as getBuiltInSectionPanelOverride,
  type SectionPanelOverride,
  type SectionPanelPosition,
} from '../overrides';
import { ConfigEntry } from './ConfigEntry';
import { ProblemsDisplay } from './ProblemsDisplay';

export const ConfigSection = defineComponent({
  props: {
    section: { type: Object as PropType<ConfigSectionModel>, required: true },
    entryStates: { type: Object as PropType<Record<string, EntryState>>, required: true },
    sectionState: { type: Object as PropType<SectionState>, required: true },
    allSectionStates: { type: Object as PropType<Record<string, SectionState>>, default: undefined },
    isCommunity: Boolean,
    isFavorite: Boolean,
    toggleFavorite: Function as PropType<() => void>,
    getSectionPanelOverride: {
      type: Function as PropType<(path: string) => SectionPanelOverride | undefined>,
      default: undefined,
    },
  },
  setup(props) {
    const { t, te, locale } = useI18n();
    // 两层可以各占一个位置槽，各自按面板自己声明的位置（panelPosition）落位，同一个槽位宿主优先：
    // 宿主那份只管自己需要的那层，自带的面板照样补上另一层。ADX / Maimoller 就是这么拆的——
    // 硬件状态只有 MCM 有（top），条目排版是共享的（override）
    const panels = computed(() =>
      [
        props.getSectionPanelOverride?.(props.section.path),
        getBuiltInSectionPanelOverride(props.section.path),
      ].filter((panel): panel is SectionPanelOverride => Boolean(panel)),
    );
    const comment = computed(() => {
      const localeKey = `mod.commentOverrides.${props.section.path.replace(/\./g, '_')}`;
      if (te(localeKey)) {
        return t(localeKey);
      }
      if (locale.value.startsWith('zh')) {
        return props.section.attribute.comment.commentZh;
      }
      return props.section.attribute.comment.commentEn;
    });
    const isEnabled = computed(() =>
      props.section.attribute.alwaysEnabled || props.sectionState.enabled,
    );

    const resetSection = () => {
      for (const entry of props.section.entries) {
        const state = props.entryStates[entry.path];
        if (state) {
          state.value = state.defaultValue;
          state.isDefault = true;
        }
      }
    };

    const favoriteIcon = () => (
      <div
        class={[
          props.isFavorite
            ? 'i-material-symbols:star-rounded c-yellow-4 opacity-90 hover:opacity-100'
            : 'i-material-symbols:star-outline-rounded opacity-0 group-hover:opacity-50 hover:opacity-80',
          'text-lg cursor-pointer transition-opacity shrink-0',
        ]}
        title={props.isFavorite ? t('mod.removeFavorite') : t('mod.addFavorite')}
        onClick={() => props.toggleFavorite?.()}
      />
    );

    const resetIcon = () => isEnabled.value ? (
      <div
        class="i-carbon:reset text-lg cursor-pointer opacity-0 group-hover:opacity-50 hover:opacity-80 transition-opacity shrink-0"
        title={t('mod.resetToDefault')}
        onClick={resetSection}
      />
    ) : null;

    // 位置没声明的面板按 override 处理：顶掉配置项。找不到面板就返回 null，
    // override 槽返回 null 时由调用处回退到配置项本身
    const renderSlot = (position: SectionPanelPosition) => {
      const panel = panels.value.find((item) => (item.position ?? 'override') === position);
      if (!panel) {
        return null;
      }
      return h(panel.component, {
        entryStates: props.entryStates,
        sectionState: props.sectionState,
        section: props.section,
        allSectionStates: props.allSectionStates,
      });
    };

    return () => (
      <div class={[
        'flex flex-col p-1 border-transparent border-solid border-1px rd group',
        'hover:border-[oklch(0.68_0.17_var(--hue))]',
      ]}>
        {!props.section.attribute.alwaysEnabled && (
          <div class="flex gap-2 items-start" title={props.section.path}>
            <div class="ml-1 text-lg w-9em shrink-0">
              {getNameForPath(
                props.section.path,
                props.section.path.split('.').pop() ?? props.section.path,
                props.section.attribute.comment.nameZh,
                locale.value,
              )}
            </div>
            <div class="flex flex-col gap-2 w-full ws-pre-line">
              <div class="flex gap-2 h-28px items-center">
                <CheckBox v-model:value={props.sectionState.enabled}>
                  {props.sectionState.enabled ? t('mod.on') : t('mod.off')}
                </CheckBox>
                {modComments.shouldEnableOptions[props.section.path] && !props.sectionState.enabled && (
                  <ProblemsDisplay problems={[t('mod.needEnableOption')]} />
                )}
                {props.isCommunity && (
                  <Popover trigger="hover">
                    {{
                      trigger: () => <div class="i-ic-baseline-info text-lg c-neutral-5" />,
                      default: () => (
                        <div>
                          <div class="text-lg mb-2">{t('mod.community.title')}</div>
                          <div class="text-sm whitespace-pre-line lh-1.7em">
                            {t('mod.community.description')}
                          </div>
                        </div>
                      ),
                    }}
                  </Popover>
                )}
                <div class="flex-1" />
                {favoriteIcon()}
                {resetIcon()}
              </div>
              <div class="text-sm op-80">{comment.value}</div>
            </div>
          </div>
        )}
        <TransitionVertical>
          {props.sectionState.enabled && (
            <div class="flex flex-col gap-2 mt-2">
              {renderSlot('top')}
              {renderSlot('override')
                ?? (props.section.entries.length > 0 && (
                  <div class={['flex flex-col gap-2', ENTRY_GROUP_PADDING]}>
                    {props.section.entries
                      .filter((entry) => {
                        const state = props.entryStates[entry.path];
                        return !entry.attribute.hideWhenDefault || (state && !state.isDefault);
                      })
                      .map((entry) => {
                        const state = props.entryStates[entry.path];
                        if (!state) {
                          return null;
                        }
                        return <ConfigEntry key={entry.path} entry={entry} entryState={state} />;
                      })}
                  </div>
                ))}
              {renderSlot('bottom')}
            </div>
          )}
        </TransitionVertical>
      </div>
    );
  },
});
