import { capitalCase } from 'change-case';
import { parse as parseYaml } from 'yaml';
import { modComments } from './modComments';
import type { ConfigSort } from './types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

export const normalizeConfigSort = (value: unknown): ConfigSort | null => {
  if (!isRecord(value)) {
    return null;
  }

  const result: ConfigSort = {};
  for (const [key, entryValue] of Object.entries(value)) {
    if (isStringArray(entryValue)) {
      result[key] = entryValue;
    }
  }
  return result;
};

export const parseConfigSort = (yamlText: string | null): ConfigSort | null => {
  if (!yamlText) {
    return null;
  }
  return normalizeConfigSort(parseYaml(yamlText));
};

/**
 * 配置项的显示名：中文界面优先用 [ConfigEntry] 自带的 zh 名称，其它语言用字段名的 CapitalCase。
 * 抽取成独立组件时这里丢过 locale 判断，结果英文界面会显示中文名。
 */
export const getNameForPath = (
  path: string,
  name: string,
  nameBuiltin: string | null | undefined,
  locale: string,
) => {
  void path;
  if (locale.startsWith('zh')) {
    return nameBuiltin || capitalCase(name);
  }
  return capitalCase(name);
};

export const getBigSectionName = (originalKey: string, locale: string) => {
  if (locale.startsWith('zh')) {
    return originalKey;
  }
  return modComments.sectionNameEn[originalKey] || originalKey;
};
