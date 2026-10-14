import {
  aquaMaiVersionConfigSchema,
  type aquaMaiVersionInfoSchema,
} from './schemas';
import type { AquaMaiDll, SignatureResult } from './types';
import type { z } from 'zod';

const VersionSources = [
  {
    source: 'cos',
    url: 'https://munet-version-config-1251600285.cos.ap-shanghai.myqcloud.com/aquamai.json',
  },
  {
    source: 'cloudflare',
    url: 'https://aquamai-version-config.mumur.net/api/config',
  },
] as const;

const PublicKeys: Readonly<Record<string, string>> = {
  '1': 'MIGbMBAGByqGSM49AgEGBSuBBAAjA4GGAAQBVoScU915wnWeDOvLsQd3uWh9NwclPhup8TT+cqiV3SB683JgQTpLYv2XRCGfH/3zIwTU2KDIXwNPsDPlOpH0QIkB0aVIDo9g6mus7cTMphq/7yjQQEPnsBQO5KbtcNxcy7mSnhykSea2Gv+iOKu1C4FOaO39zNe0HULVoqMrcCNLRkg=',
  '2': 'MIGbMBAGByqGSM49AgEGBSuBBAAjA4GGAAQAvi9gtqbPF0g7K52lumBRiztMb5lVKbTwhzwVSVsMBUo5wXp9w86CnIh3/VErXtyneP1BBMLFDEtd4Cb11eQmxBMBuPjY61oca4gZhIxgQ8e0ki/pUhtUQwIQ48AN/gba/lq0GWBaPrwEyhSvHArHsPo2WxFczdsOO0mTgwq0bAw/tTw=',
};

export type AquaMaiVersionInfo = z.infer<typeof aquaMaiVersionInfoSchema>;

/** 版本列表和它的来源。两个源内容一致，谁先答应用谁的 */
export interface AquaMaiVersionEntry {
  readonly source: AquaMaiDll['source'];
  readonly versions: readonly AquaMaiVersionInfo[];
}

export class AquaMaiDownloadError extends Error {
  public constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'AquaMaiDownloadError';
  }
}

const base64ToBytes = (value: string): Uint8Array<ArrayBuffer> => {
  const binary = atob(value);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
};

const fetchVersionConfig = async (source: (typeof VersionSources)[number]) => {
  const response = await fetch(source.url, {
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    throw new AquaMaiDownloadError(`版本接口 ${source.url} 返回 ${response.status}`);
  }
  const versions = aquaMaiVersionConfigSchema.parse(await response.json());
  return { source, versions };
};

export const fetchAquaMaiVersions = async (): Promise<AquaMaiVersionEntry> => {
  try {
    const fastest = await Promise.any(VersionSources.map(fetchVersionConfig));
    return { source: fastest.source.source, versions: fastest.versions };
  } catch (error) {
    if (error instanceof AggregateError) {
      const reasons = error.errors
        .map((item) => item instanceof Error ? item.message : String(item))
        .join('；');
      throw new AquaMaiDownloadError(
        `无法从 COS 或 Cloudflare 获取 AquaMai 版本列表：${reasons}`,
        { cause: error },
      );
    }
    throw error;
  }
};

/** 通道就是版本列表里的 type：稳定（slow）/ 快速（ci）。没有下载地址的条目不认 */
export const findAquaMaiVersion = (
  entry: AquaMaiVersionEntry,
  type: string,
): AquaMaiVersionInfo | undefined =>
  entry.versions.find((item) => item.type === type && item.url && item.version);

export const downloadAquaMaiDll = async (
  entry: AquaMaiVersionEntry,
  type: string,
): Promise<AquaMaiDll> => {
  const info = findAquaMaiVersion(entry, type);
  if (!info?.url || !info.version) {
    throw new AquaMaiDownloadError(`版本列表里没有 ${type} 通道的下载地址`);
  }
  const downloadUrls = [info.url, info.url2].filter(
    (url): url is string => typeof url === 'string' && url.length > 0,
  );

  let bytes: ArrayBuffer | undefined;
  let lastError: unknown;
  for (const downloadUrl of downloadUrls) {
    try {
      const response = await fetch(downloadUrl, {
        signal: AbortSignal.timeout(60_000),
      });
      if (!response.ok) {
        throw new AquaMaiDownloadError(`AquaMai 下载地址返回 ${response.status}`);
      }
      bytes = await response.arrayBuffer();
      break;
    } catch (error) {
      lastError = error;
    }
  }
  if (!bytes) {
    throw new AquaMaiDownloadError('AquaMai DLL 下载失败', { cause: lastError });
  }
  return { bytes, version: info.version, source: entry.source };
};

export const verifyAquaMaiSignature = async (bytes: ArrayBuffer): Promise<SignatureResult> => {
  const data = new Uint8Array(bytes);
  const blockLength = 144;
  const signatureLength = 132;
  const magicLength = 10;

  if (data.length < blockLength) {
    return { status: 'not_found', keyId: 'none' };
  }

  const blockOffset = data.length - blockLength;
  const keyId = data[blockOffset] ?? 0;
  const signatureOffset = blockOffset + 1;
  const magicOffset = signatureOffset + signatureLength;
  const versionOffset = magicOffset + magicLength;
  const magic = new TextDecoder().decode(data.slice(magicOffset, versionOffset));

  if (magic !== 'AquaMaiSig' || data[versionOffset] !== 1) {
    return { status: 'not_found', keyId: 'none' };
  }

  const publicKey = PublicKeys[keyId.toString()];
  if (!publicKey) {
    return { status: 'invalid_key', keyId: keyId.toString() };
  }

  // crypto.subtle 只在安全上下文（HTTPS / localhost / file）里有，把 dist 挂在内网 HTTP
  // 上打开时是 undefined，再往下走就是一句和签名毫无关系的 TypeError
  const subtle = globalThis.crypto?.subtle as SubtleCrypto | undefined;
  if (!subtle) {
    return { status: 'unsupported', keyId: keyId.toString() };
  }

  const key = await subtle.importKey(
    'spki',
    base64ToBytes(publicKey),
    { name: 'ECDSA', namedCurve: 'P-521' },
    false,
    ['verify'],
  );
  const signature = data.slice(signatureOffset, signatureOffset + signatureLength);
  const payload = data.slice(0, blockOffset);
  const valid = await subtle.verify(
    { name: 'ECDSA', hash: 'SHA-256' },
    key,
    signature,
    payload,
  );

  return {
    status: valid ? 'valid' : 'invalid',
    keyId: keyId.toString(),
  };
};
