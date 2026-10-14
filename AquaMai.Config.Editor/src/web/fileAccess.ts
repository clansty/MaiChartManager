// 浏览器的 File System Access API。lib.dom 里只声明了拖拽 / OPFS 用到的那部分，
// picker 和权限查询都没有官方声明，这里就地 cast 出最小可用的形状，
// 不去 declare global，将来 TS 补上声明时也不会冲突
interface PickerOptions {
  readonly suggestedName?: string;
  readonly types?: readonly {
    readonly description?: string;
    readonly accept: Readonly<Record<string, readonly string[]>>;
  }[];
}

interface PickerWindow {
  readonly showOpenFilePicker?: (options?: PickerOptions) => Promise<FileSystemFileHandle[]>;
  readonly showSaveFilePicker?: (options?: PickerOptions) => Promise<FileSystemFileHandle>;
}

type HandleWithPermission = FileSystemFileHandle & {
  queryPermission: (options?: { mode?: 'read' | 'readwrite' }) => Promise<PermissionState>;
  requestPermission: (options?: { mode?: 'read' | 'readwrite' }) => Promise<PermissionState>;
};

const pickers = window as unknown as PickerWindow;

const TOML_PICKER_TYPES = [
  { description: 'AquaMai.toml', accept: { 'text/plain': ['.toml'] } },
];

export type OpenFileResult =
  | { readonly kind: 'opened'; readonly handle: FileSystemFileHandle; readonly file: File }
  /** 用户自己取消了对话框，不要再去弹 input，那会像弹了两次 */
  | { readonly kind: 'cancel' }
  /** 当前环境没有 File System Access API（Firefox / Safari / 部分 WebView），调用方改用 <input type=file> */
  | { readonly kind: 'unsupported' };

export type SaveTarget =
  | { readonly kind: 'write'; readonly handle: FileSystemFileHandle }
  | { readonly kind: 'cancel' }
  /** 拿不到可写的句柄，调用方退回下载 */
  | { readonly kind: 'download' };

const isAbort = (cause: unknown): boolean =>
  cause instanceof DOMException && cause.name === 'AbortError';

export const openFileViaPicker = async (): Promise<OpenFileResult> => {
  if (!pickers.showOpenFilePicker) {
    return { kind: 'unsupported' };
  }
  try {
    const [handle] = await pickers.showOpenFilePicker({ types: TOML_PICKER_TYPES });
    if (!handle) {
      return { kind: 'unsupported' };
    }
    return { kind: 'opened', handle, file: await handle.getFile() };
  } catch (cause) {
    // picker 存在但被环境挡掉（比如没给权限的 WebView）时也退回 input
    return isAbort(cause) ? { kind: 'cancel' } : { kind: 'unsupported' };
  }
};

// 优先写回打开时那个文件（也就是"保存到源文件"）；没有句柄或权限被回收了就弹保存对话框
export const resolveSaveTarget = async (
  current: FileSystemFileHandle | undefined,
  suggestedName: string,
): Promise<SaveTarget> => {
  if (current && await ensureWritePermission(current)) {
    return { kind: 'write', handle: current };
  }
  if (!pickers.showSaveFilePicker) {
    return { kind: 'download' };
  }
  try {
    const handle = await pickers.showSaveFilePicker({ suggestedName, types: TOML_PICKER_TYPES });
    return handle ? { kind: 'write', handle } : { kind: 'download' };
  } catch (cause) {
    return isAbort(cause) ? { kind: 'cancel' } : { kind: 'download' };
  }
};

export const writeFileToHandle = async (
  handle: FileSystemFileHandle,
  content: string,
): Promise<void> => {
  // createWritable 默认在临时文件上写、close 时才整体替换，不需要先截断
  const writable = await handle.createWritable();
  await writable.write(content);
  await writable.close();
};

// 页面重开后句柄保留但写权限会被回收，得重新申请。
// requestPermission 要求 user activation，所以调用它的时机必须是点击事件里、
// 任何耗时 await（序列化要跑 WASM）之前
const ensureWritePermission = async (handle: FileSystemFileHandle): Promise<boolean> => {
  try {
    const writable = handle as HandleWithPermission;
    if (await writable.queryPermission({ mode: 'readwrite' }) === 'granted') {
      return true;
    }
    return await writable.requestPermission({ mode: 'readwrite' }) === 'granted';
  } catch {
    // 句柄指向的文件被删掉 / 移走了，当作没句柄处理
    return false;
  }
};

/** 拖放进来的文件在 Chromium 里同样能拿到句柄，有句柄就能像打开的文件一样直接写回。
 * getAsFileSystemHandle 只在 drop 事件里有效，事件处理完就再也拿不到了 */
export const fileHandleFromDrop = (
  item: DataTransferItem,
): Promise<FileSystemFileHandle | undefined> => {
  const droppable = item as DataTransferItem & {
    getAsFileSystemHandle?: () => Promise<FileSystemHandle | null>;
  };
  if (!droppable.getAsFileSystemHandle) {
    return Promise.resolve(undefined);
  }
  return droppable.getAsFileSystemHandle()
    .then((handle) => (handle && handle.kind === 'file' ? handle as FileSystemFileHandle : undefined))
    .catch(() => undefined);
};
