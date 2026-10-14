export type ConfigSort = Record<string, string[]>;

export interface ConfigComment {
  readonly commentEn: string | null;
  readonly commentZh: string | null;
  readonly nameZh: string | null;
}

export interface EntryAttribute {
  readonly comment: ConfigComment;
  readonly hideWhenDefault: boolean;
}

export interface SectionAttribute {
  readonly comment: ConfigComment;
  readonly exampleHidden: boolean;
  readonly defaultOn: boolean;
  readonly alwaysEnabled: boolean;
}

export interface ConfigEntry {
  readonly path: string;
  readonly name: string;
  readonly attribute: EntryAttribute;
  readonly fieldType: string;
}

export interface ConfigSection {
  readonly path: string;
  readonly entries: readonly ConfigEntry[];
  readonly attribute: SectionAttribute;
}

export interface SectionState {
  isDefault: boolean;
  defaultEnabled: boolean;
  enabled: boolean;
}

export type ConfigValue = string | number | boolean | null;

export interface EntryState {
  isDefault: boolean;
  defaultValue: ConfigValue;
  value: ConfigValue;
}

export interface ConfigDto {
  readonly sections: readonly ConfigSection[];
  readonly sectionStates: Record<string, SectionState>;
  readonly entryStates: Record<string, EntryState>;
  readonly configSort?: ConfigSort | null;
  readonly configSortYaml?: string | null;
}

export interface ConfigSaveDto {
  readonly sectionStates: Record<string, SectionState>;
  readonly entryStates: Record<string, EntryState>;
}

export interface ParseResult {
  readonly success: boolean;
  readonly errorMessage: string | null;
  readonly config: ConfigDto | null;
  readonly apiVersion: string | null;
  readonly modVersion: string | null;
  readonly originalConfigVersion: string | null;
  readonly latestConfigVersion: string | null;
}

export interface SerializeResult {
  readonly success: boolean;
  readonly errorMessage: string | null;
  readonly toml: string | null;
  readonly configVersion: string | null;
}

export interface AquaMaiDll {
  readonly bytes: ArrayBuffer;
  readonly version: string;
  readonly source: 'cos' | 'cloudflare';
}

/** unsupported：当前环境没有 Web Crypto（非安全上下文），没法校验签名 */
export type SignatureStatus = 'valid' | 'invalid' | 'invalid_key' | 'not_found' | 'unsupported';

export interface SignatureResult {
  readonly status: SignatureStatus;
  readonly keyId: string;
}

export interface AquaMaiConfigBackend {
  readonly parse: (assembly: ArrayBuffer, toml: string) => Promise<ParseResult>;
  readonly serialize: (
    assembly: ArrayBuffer,
    config: ConfigSaveDto,
    lang: string,
  ) => Promise<SerializeResult>;
  readonly getModVersion: (assembly: ArrayBuffer) => Promise<string>;
}
