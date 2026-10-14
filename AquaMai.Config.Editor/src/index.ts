export { AquaMaiConfigurator } from './components/AquaMaiConfigurator';
export {
  ConfigEntry,
  optionsIoKeyMap,
  optionsKeyCodeOrName,
  optionsVKCode,
} from './components/ConfigEntry';
export { ConfigSection } from './components/ConfigSection';
export {
  downloadAquaMaiDll,
  fetchAquaMaiVersions,
  findAquaMaiVersion,
  verifyAquaMaiSignature,
} from './latest';
export {
  getSectionPanelOverride,
  type SectionPanelOverride,
  type SectionPanelPosition,
} from './overrides';
// 编辑器界面的文案（src/locales/*.yaml），宿主用 mergeEditorMessages 并进自己的 messages，见 i18n.ts
export { aquaMaiEditorMessages, mergeEditorMessages, type AquaMaiEditorMessages } from './i18n';
// 宿主自定义分区面板（MCM 的 PDX / JudgeDisplay4B 等）需要的写作套件
export { ENTRY_GROUP_PADDING, ENTRY_LABEL_CLASS } from './constants';
export { getNameForPath } from './utils';
export type {
  AquaMaiConfigBackend,
  AquaMaiDll,
  ConfigDto,
  ConfigSort,
  ConfigEntry as AquaMaiConfigEntry,
  ConfigSaveDto,
  ConfigSection as AquaMaiConfigSection,
  ConfigValue,
  EntryState,
  ParseResult,
  SectionState,
  SerializeResult,
  SignatureResult,
  SignatureStatus,
} from './types';
