import type {
  Comment as ApiComment,
  ConfigDto as ApiConfigDto,
  Entry as ApiEntry,
  EntryState as ApiEntryState,
  Section as ApiSection,
  SectionState as ApiSectionState,
} from '@/client/apiGen';
import type {
  AquaMaiConfigEntry,
  AquaMaiConfigSection,
  ConfigDto,
  ConfigSaveDto,
  ConfigValue,
  EntryState,
  SectionState,
} from '@aquamai/config-editor';

// 后端（MCM 的 ConfigurationController 和独立编辑器的 WASM）返回的都是
// AquaMai.Config.Dto 里的同一份契约，字段名完全对得上。
// 这里只做一件事：apiGen 生成的类型一律是可选的（Swashbuckle 没有输出 required），
// 收窄成编辑器要求的非可选形状。

const toConfigValue = (value: unknown): ConfigValue => {
  if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  return value === undefined ? null : String(value);
};

const toComment = (comment: ApiComment | undefined) => ({
  commentEn: comment?.commentEn ?? null,
  commentZh: comment?.commentZh ?? null,
  nameZh: comment?.nameZh ?? null,
});

const toEntry = (entry: ApiEntry): AquaMaiConfigEntry => ({
  path: entry.path ?? '',
  name: entry.name ?? '',
  attribute: {
    comment: toComment(entry.attribute?.comment),
    hideWhenDefault: entry.attribute?.hideWhenDefault ?? false,
  },
  fieldType: entry.fieldType ?? '',
});

const toSection = (section: ApiSection): AquaMaiConfigSection => ({
  path: section.path ?? '',
  entries: section.entries?.map(toEntry) ?? [],
  attribute: {
    comment: toComment(section.attribute?.comment),
    exampleHidden: section.attribute?.exampleHidden ?? false,
    defaultOn: section.attribute?.defaultOn ?? false,
    alwaysEnabled: section.attribute?.alwaysEnabled ?? false,
  },
});

const toSectionState = (state: ApiSectionState | undefined): SectionState => ({
  isDefault: state?.isDefault ?? true,
  defaultEnabled: state?.defaultEnabled ?? false,
  enabled: state?.enabled ?? false,
});

const toEntryState = (state: ApiEntryState | undefined): EntryState => ({
  isDefault: state?.isDefault ?? true,
  defaultValue: toConfigValue(state?.defaultValue),
  value: toConfigValue(state?.value),
});

export const toEditorConfig = (source: ApiConfigDto): ConfigDto => ({
  sections: source.sections?.map(toSection) ?? [],
  sectionStates: Object.fromEntries(
    Object.entries(source.sectionStates ?? {}).map(([path, state]) => [path, toSectionState(state)]),
  ),
  entryStates: Object.fromEntries(
    Object.entries(source.entryStates ?? {}).map(([path, state]) => [path, toEntryState(state)]),
  ),
  configSortYaml: source.configSortYaml ?? null,
});

export const toSaveDto = (source: ConfigDto): ConfigSaveDto => ({
  sectionStates: source.sectionStates,
  entryStates: source.entryStates,
});
