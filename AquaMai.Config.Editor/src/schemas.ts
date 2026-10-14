import { z } from 'zod';

export const configValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);

const commentSchema = z.object({
  commentEn: z.string().nullable(),
  commentZh: z.string().nullable(),
  nameZh: z.string().nullable(),
});

const entryAttributeSchema = z.object({
  comment: commentSchema,
  hideWhenDefault: z.boolean(),
});

const sectionAttributeSchema = z.object({
  comment: commentSchema,
  exampleHidden: z.boolean(),
  defaultOn: z.boolean(),
  alwaysEnabled: z.boolean(),
});

const entrySchema = z.object({
  path: z.string(),
  name: z.string(),
  attribute: entryAttributeSchema,
  fieldType: z.string(),
});

const sectionSchema = z.object({
  path: z.string(),
  entries: z.array(entrySchema),
  attribute: sectionAttributeSchema,
});

const sectionStateSchema = z.object({
  isDefault: z.boolean(),
  defaultEnabled: z.boolean(),
  enabled: z.boolean(),
});

const entryStateSchema = z.object({
  isDefault: z.boolean(),
  defaultValue: configValueSchema,
  value: configValueSchema,
});

export const configDtoSchema = z.object({
  sections: z.array(sectionSchema),
  sectionStates: z.record(z.string(), sectionStateSchema),
  entryStates: z.record(z.string(), entryStateSchema),
  configSortYaml: z.string().nullable(),
});

export const parseResultSchema = z.object({
  success: z.boolean(),
  errorMessage: z.string().nullable(),
  config: configDtoSchema.nullable().optional(),
  apiVersion: z.string().nullable().optional(),
  modVersion: z.string().nullable().optional(),
  originalConfigVersion: z.string().nullable().optional(),
  latestConfigVersion: z.string().nullable().optional(),
});

export const serializeResultSchema = z.object({
  success: z.boolean(),
  errorMessage: z.string().nullable(),
  toml: z.string().nullable().optional(),
  configVersion: z.string().nullable().optional(),
});

export const modVersionResultSchema = z.object({
  success: z.boolean(),
  // 出错分支只带 errorMessage，没有 version / name（MainClass.GetModVersion）
  name: z.string().optional(),
  version: z.string().optional(),
  errorMessage: z.string().optional(),
});

export const aquaMaiVersionInfoSchema = z.object({
  version: z.string().optional(),
  createdAt: z.string().optional(),
  type: z.string(),
  url: z.string().optional(),
  url2: z.string().optional(),
  sign: z.string().optional(),
});

export const aquaMaiVersionConfigSchema = z.array(aquaMaiVersionInfoSchema);
