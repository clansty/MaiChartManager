import rawComments from './modComments.yaml';

export interface CommentOption {
  readonly label: string;
  readonly value: string;
}

export interface ModComments {
  readonly shouldEnableOptions: Record<string, boolean>;
  readonly options: Record<string, readonly CommentOption[]>;
  readonly commentOverrides: Record<string, string>;
  readonly nameOverrides: Record<string, string>;
  readonly sectionNameEn: Record<string, string>;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const readBooleanMap = (value: unknown): Record<string, boolean> => {
  if (!isRecord(value)) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, boolean] => typeof entry[1] === 'boolean'),
  );
};

const readStringMap = (value: unknown): Record<string, string> => {
  if (!isRecord(value)) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
  );
};

const readOptions = (value: unknown): Record<string, readonly CommentOption[]> => {
  if (!isRecord(value)) {
    return {};
  }

  const result: Record<string, readonly CommentOption[]> = {};
  for (const [key, rawOptions] of Object.entries(value)) {
    if (!Array.isArray(rawOptions)) {
      continue;
    }

    const options = rawOptions.flatMap((rawOption): CommentOption[] => {
      if (!isRecord(rawOption)) {
        return [];
      }
      const label = rawOption.label;
      const optionValue = rawOption.value;
      if (typeof label !== 'string' || typeof optionValue !== 'string') {
        return [];
      }
      return [{ label, value: optionValue }];
    });
    result[key] = options;
  }
  return result;
};

const comments = isRecord(rawComments) ? rawComments : {};

export const modComments: ModComments = {
  shouldEnableOptions: readBooleanMap(comments.shouldEnableOptions),
  options: readOptions(comments.options),
  commentOverrides: readStringMap(comments.commentOverrides),
  nameOverrides: readStringMap(comments.nameOverrides),
  sectionNameEn: readStringMap(comments.sectionNameEn),
};
