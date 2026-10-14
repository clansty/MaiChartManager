import {
  modVersionResultSchema,
  parseResultSchema,
  serializeResultSchema,
} from '../schemas';
import type { AquaMaiConfigBackend } from '../types';
import { dotnet } from './dotnet';

interface WasmMainClass {
  readonly GetModVersion: (assemblyBytes: Uint8Array) => string;
  readonly ParseConfig: (assemblyBytes: Uint8Array, configString: string) => string;
  readonly SerializeConfig: (
    assemblyBytes: Uint8Array,
    configJson: string,
    lang: string,
  ) => string;
}

interface WasmExports {
  readonly AquaMai: {
    readonly Config: {
      readonly Wasm: {
        readonly MainClass: WasmMainClass;
      };
    };
  };
}

/** 拖进来的 dll 是个托管程序集，但不是 AquaMai 自己那个。
 * 文案归界面管（界面才知道当前语言），这里只报语义 */
export class NotAquaMaiAssemblyError extends Error {
  public constructor(public readonly assemblyName: string) {
    super(`Not the AquaMai assembly: ${assemblyName || '(unknown)'}`);
    this.name = 'NotAquaMaiAssemblyError';
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const readWasmExports = (value: unknown): WasmExports => {
  if (!isRecord(value)) {
    throw new Error('AquaMai WASM 导出对象无效');
  }
  const aquaMai = value.AquaMai;
  if (!isRecord(aquaMai)) {
    throw new Error('AquaMai WASM 导出缺少 AquaMai 命名空间');
  }
  const config = aquaMai.Config;
  if (!isRecord(config)) {
    throw new Error('AquaMai WASM 导出缺少 Config 命名空间');
  }
  const wasm = config.Wasm;
  if (!isRecord(wasm)) {
    throw new Error('AquaMai WASM 导出缺少 Wasm 命名空间');
  }
  const mainClass = wasm.MainClass;
  if (!isRecord(mainClass)) {
    throw new Error('AquaMai WASM 导出缺少 MainClass');
  }
  const getModVersion = mainClass.GetModVersion;
  const parseConfig = mainClass.ParseConfig;
  const serializeConfig = mainClass.SerializeConfig;
  if (
    typeof getModVersion !== 'function'
    || typeof parseConfig !== 'function'
    || typeof serializeConfig !== 'function'
  ) {
    throw new Error('AquaMai WASM 导出方法不完整');
  }
  return {
    AquaMai: {
      Config: {
        Wasm: {
          MainClass: {
            GetModVersion: getModVersion as WasmMainClass['GetModVersion'],
            ParseConfig: parseConfig as WasmMainClass['ParseConfig'],
            SerializeConfig: serializeConfig as WasmMainClass['SerializeConfig'],
          },
        },
      },
    },
  };
};

let runtimePromise: ReturnType<typeof dotnet.create> | undefined;
let exportsPromise: Promise<WasmExports> | undefined;

const getExports = async (): Promise<WasmExports> => {
  runtimePromise ??= dotnet.create();
  exportsPromise ??= (async () => {
    const runtime = await runtimePromise;
    const config = runtime.getConfig();
    const mainAssemblyName = config.mainAssemblyName;
    if (!mainAssemblyName) {
      throw new Error('AquaMai WASM 缺少主程序集名称');
    }
    const exports: unknown = await runtime.getAssemblyExports(mainAssemblyName);
    return readWasmExports(exports);
  })();
  return exportsPromise;
};

const parseJson = (value: string): unknown => JSON.parse(value) as unknown;

export const createWasmBackend = async (): Promise<AquaMaiConfigBackend> => {
  const exports = await getExports();
  const mainClass = exports.AquaMai.Config.Wasm.MainClass;

  return {
    async parse(assembly, toml) {
      const result = parseJson(
        mainClass.ParseConfig(new Uint8Array(assembly), toml),
      );
      const parsed = parseResultSchema.parse(result);
      return {
        success: parsed.success,
        errorMessage: parsed.errorMessage,
        config: parsed.config ?? null,
        apiVersion: parsed.apiVersion ?? null,
        modVersion: parsed.modVersion ?? null,
        originalConfigVersion: parsed.originalConfigVersion ?? null,
        latestConfigVersion: parsed.latestConfigVersion ?? null,
      };
    },
    async serialize(assembly, config, lang) {
      const result = parseJson(
        mainClass.SerializeConfig(
          new Uint8Array(assembly),
          JSON.stringify(config),
          lang,
        ),
      );
      const parsed = serializeResultSchema.parse(result);
      return {
        success: parsed.success,
        errorMessage: parsed.errorMessage,
        toml: parsed.toml ?? null,
        configVersion: parsed.configVersion ?? null,
      };
    },
    async getModVersion(assembly) {
      const parsed = modVersionResultSchema.parse(
        parseJson(mainClass.GetModVersion(new Uint8Array(assembly))),
      );
      // schema 放宽了 version（出错分支没有这个字段），这里必须自己判，
      // 不然拿到的会是个 undefined，把一个不是 AquaMai 的 dll 当成有效内核
      if (!parsed.success || !parsed.version) {
        throw new Error(parsed.errorMessage || '获取 AquaMai 版本失败');
      }
      // 光能读出程序集版本不算数：随便一个托管 dll（0Harmony 之类）都读得出来，
      // 放进来的话要等打开配置时才报一句和「选错文件」毫无关系的错。
      // name 缺省说明用的是没带这个字段的旧 WASM 桥，那会儿判断不了，只能放过
      if (parsed.name !== undefined && parsed.name !== 'AquaMai') {
        throw new NotAquaMaiAssemblyError(parsed.name);
      }
      return parsed.version;
    },
  };
};
