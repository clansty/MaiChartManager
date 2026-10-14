import { computed, defineComponent, ref, watch, type PropType } from 'vue';
import { TextInput, theme, WhateverNaviBar } from '@munet/ui';
import { flatten, uniq } from 'lodash-es';
import { useMagicKeys, useStorage, whenever } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import configSortStub from '../configSort.yaml';
import type { ConfigDto, ConfigSection as ConfigSectionModel } from '../types';
import { getBigSectionName, normalizeConfigSort, parseConfigSort } from '../utils';
import type { SectionPanelOverride } from '../overrides';
import { ConfigSection } from './ConfigSection';

const FAVORITES_TAB_KEY = '__favorites__';

export const AquaMaiConfigurator = defineComponent({
  props: {
    config: { type: Object as PropType<ConfigDto>, required: true },
    useNewSort: { type: Boolean, default: false },
    favoriteStorageKey: { type: String, default: 'aquamai-config-favorite-sections' },
    getSectionPanelOverride: {
      type: Function as PropType<(path: string) => SectionPanelOverride | undefined>,
      default: undefined,
    },
  },
  setup(props) {
    const search = ref('');
    const searchRef = ref<{ select: () => void }>();
    const activeTab = ref<string | null>(null);
    const scrollContainerRef = ref<HTMLElement>();
    const { t, locale } = useI18n();
    const favoriteSectionPaths = useStorage<string[]>(props.favoriteStorageKey, []);

    const configSort = computed(() =>
      props.config.configSort
      ?? parseConfigSort(props.config.configSortYaml ?? null)
      ?? normalizeConfigSort(configSortStub)
      ?? {},
    );
    const communityList = computed(() => configSort.value['社区功能'] ?? []);
    const configSections = computed(() => props.config.sections);
    const favoritePathList = computed(() =>
      Array.isArray(favoriteSectionPaths.value) ? favoriteSectionPaths.value : [],
    );
    const favoritePathSet = computed(() => new Set(favoritePathList.value));
    const sectionByPath = computed(() =>
      new Map(configSections.value.map((section) => [section.path, section])),
    );

    const { ctrl_f } = useMagicKeys({
      passive: false,
      onEventFired(event) {
        if (event.ctrlKey && event.key === 'f' && event.type === 'keydown') {
          event.preventDefault();
        }
      },
    });
    if (ctrl_f) {
      whenever(ctrl_f, () => searchRef.value?.select());
    }

    const sectionMatchesSearch = (section: ConfigSectionModel, keyword: string) => {
      const comment = section.attribute.comment;
      return section.path.toLowerCase().includes(keyword)
        || comment.nameZh?.toLowerCase().includes(keyword)
        || comment.commentZh?.toLowerCase().includes(keyword)
        || comment.commentEn?.toLowerCase().includes(keyword)
        || section.entries.some((entry) => {
          const entryComment = entry.attribute.comment;
          return entry.name.toLowerCase().includes(keyword)
            || entry.path.toLowerCase().includes(keyword)
            || entryComment.commentZh?.toLowerCase().includes(keyword)
            || entryComment.commentEn?.toLowerCase().includes(keyword)
            || entryComment.nameZh?.toLowerCase().includes(keyword);
        });
    };

    const filteredSections = computed(() => {
      if (!search.value) {
        return configSections.value;
      }
      const keyword = search.value.toLowerCase();
      return configSections.value.filter((section) => sectionMatchesSearch(section, keyword));
    });

    const favoriteSections = computed(() => {
      const seen = new Set<string>();
      return favoritePathList.value
        .filter((path) => {
          if (typeof path !== 'string' || seen.has(path)) {
            return false;
          }
          seen.add(path);
          return true;
        })
        .map((path) => sectionByPath.value.get(path))
        .filter((section): section is ConfigSectionModel => Boolean(section && !section.attribute.exampleHidden));
    });

    const toggleFavoriteSection = (path: string) => {
      if (favoritePathSet.value.has(path)) {
        favoriteSectionPaths.value = favoritePathList.value.filter((item) => item !== path);
        return;
      }
      favoriteSectionPaths.value = [...favoritePathList.value, path];
    };

    const bigSections = computed(() => {
      if (props.useNewSort) {
        return Object.keys(configSort.value)
          .filter((key) => key !== '社区功能')
          .filter((key) => filteredSections.value.some((section) => configSort.value[key]?.includes(section.path)));
      }
      return uniq(
        filteredSections.value
          .filter((section) => !section.attribute.exampleHidden)
          .map((section) => section.path.split('.')[0])
          .filter((key): key is string => Boolean(key)),
      );
    });

    const otherSections = computed(() => {
      if (!props.useNewSort) {
        return [];
      }
      const knownSections = flatten(Object.values(configSort.value));
      return filteredSections.value.filter(
        (section) => !knownSections.includes(section.path) && !section.attribute.exampleHidden,
      );
    });

    const allTabs = computed(() => {
      const tabs = bigSections.value.map((key) => ({
        key,
        label: getBigSectionName(key, locale.value),
      }));
      if (favoriteSections.value.length > 0) {
        tabs.unshift({ key: FAVORITES_TAB_KEY, label: t('mod.favorite') });
      }
      if (otherSections.value.length > 0) {
        tabs.push({ key: '__other__', label: t('mod.other') });
      }
      return tabs;
    });

    watch(allTabs, (tabs) => {
      if (tabs.length > 0 && (!activeTab.value || !tabs.some((tab) => tab.key === activeTab.value))) {
        activeTab.value = tabs[0]?.key ?? null;
      }
    }, { immediate: true });

    watch(activeTab, () => {
      scrollContainerRef.value?.scrollTo(0, 0);
    });

    const currentSections = computed(() => {
      if (search.value) {
        return filteredSections.value.filter((section) => !section.attribute.exampleHidden);
      }
      if (!activeTab.value) {
        return [];
      }
      if (activeTab.value === FAVORITES_TAB_KEY) {
        return favoriteSections.value;
      }
      if (activeTab.value === '__other__') {
        return otherSections.value;
      }

      return filteredSections.value
        .filter((section) => {
          if (props.useNewSort) {
            return configSort.value[activeTab.value ?? '']?.includes(section.path) ?? false;
          }
          return section.path.split('.')[0] === activeTab.value && !section.attribute.exampleHidden;
        })
        .sort((left, right) => {
          if (!props.useNewSort) {
            return 0;
          }
          const order = configSort.value[activeTab.value ?? ''] ?? [];
          return order.indexOf(left.path) - order.indexOf(right.path);
        });
    });

    return () => (
      <div class="grid cols-[15em_auto] rows-1 max-[900px]:cols-1 flex-1 min-h-0">
        <div class="flex flex-col gap-0.5 max-[900px]:hidden of-y-auto h-full">
          {allTabs.value.map((tab) => (
            <div
              key={tab.key}
              class={[
                'px-3 py-1.5 rd cursor-pointer text-sm transition-colors',
                activeTab.value === tab.key && theme.value.listItemSelect,
                theme.value.listItemHover,
              ]}
              onClick={() => {
                activeTab.value = tab.key;
              }}
            >
              {tab.label}
            </div>
          ))}
        </div>
        <div class="flex flex-col h-full min-h-0">
          <div class="min-[900px]:hidden shrink-0">
            <WhateverNaviBar items={allTabs.value.map((tab) => ({
              name: tab.label,
              onClick: () => {
                activeTab.value = tab.key;
              },
              selected: activeTab.value === tab.key,
            }))} />
          </div>
          <div class="flex gap-2 p-2 shrink-0">
            <TextInput
              v-model:value={search.value}
              placeholder={t('mod.searchPlaceholder')}
              ref={searchRef}
              innerClass="h-42px!"
              class="flex-1"
            />
          </div>
          <div ref={scrollContainerRef} class="of-y-auto cst flex-1 p-2 pt-0 text-14px">
            <div class="flex flex-col gap-1">
              {currentSections.value.map((section) => {
                const sectionState = props.config.sectionStates[section.path];
                if (!sectionState) {
                  return null;
                }
                return (
                  <ConfigSection
                    key={section.path}
                    section={section}
                    entryStates={props.config.entryStates}
                    sectionState={sectionState}
                    allSectionStates={props.config.sectionStates}
                    isCommunity={communityList.value.includes(section.path)}
                    isFavorite={favoritePathSet.value.has(section.path)}
                    toggleFavorite={() => toggleFavoriteSection(section.path)}
                    getSectionPanelOverride={props.getSectionPanelOverride ?? (() => undefined)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  },
});
