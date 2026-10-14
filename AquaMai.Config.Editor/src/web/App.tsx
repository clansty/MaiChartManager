import { Button, DropMenu, GlobalElementsContainer, showTransactionalDialog } from '@munet/ui';
import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ZodError } from 'zod';
import { AquaMaiConfigurator } from '../components/AquaMaiConfigurator';
import {
  downloadAquaMaiDll,
  fetchAquaMaiVersions,
  findAquaMaiVersion,
  verifyAquaMaiSignature,
  type AquaMaiVersionEntry,
} from '../latest';
import type {
  AquaMaiConfigBackend,
  AquaMaiDll,
  ConfigDto,
  ConfigSaveDto,
  SignatureResult,
  SignatureStatus,
} from '../types';
import { createWasmBackend, NotAquaMaiAssemblyError } from '../wasm/backend';
import {
  fileHandleFromDrop,
  openFileViaPicker,
  resolveSaveTarget,
  writeFileToHandle,
} from './fileAccess';
import { base64ToArrayBuffer, getEditorHost, type AquaMaiEditorCommands } from './host';

/** 把异常变成能给用户看的一句话。WASM 桥那边的 schema 校验失败会抛 ZodError，
 * 它的 message 是一大坨 JSON，糊到界面上没有意义 */
const describeError = (cause: unknown): string => {
  if (cause instanceof ZodError) {
    return '';
  }
  if (cause instanceof Error) {
    return cause.message;
  }
  return String(cause);
};

/** 拖进来的文件按扩展名分流 */
type DropKind = 'toml' | 'dll' | 'unknown';

/** 签名状态的文案键。status 是给机器看的码，直接摊到界面上没意义 */
const SIGNATURE_STATUS_KEYS: Record<SignatureStatus, string> = {
  valid: 'mod.web.signatureValid',
  invalid: 'mod.web.signatureInvalid',
  invalid_key: 'mod.web.signatureInvalidKey',
  not_found: 'mod.web.signatureNotFound',
  unsupported: 'mod.web.signatureUnsupported',
};

const dropKindOf = (name: string): DropKind => {
  const lower = name.toLowerCase();
  if (lower.endsWith('.toml')) {
    return 'toml';
  }
  if (lower.endsWith('.dll')) {
    return 'dll';
  }
  return 'unknown';
};

interface DroppedFile {
  readonly file: File;
  readonly handle: FileSystemFileHandle | undefined;
}

/** 主要按钮的强调样式：只动文字颜色，不去跟主题给的按钮背景较劲 */
const PRIMARY_BUTTON_CLASS = 'font-600 text-[var(--link-color)]';

export const App = defineComponent({
  setup() {
    const { locale, t } = useI18n();
    const host = getEditorHost();
    const backend = ref<AquaMaiConfigBackend>();
    const dll = ref<AquaMaiDll>();
    const signature = ref<SignatureResult>();
    const config = ref<ConfigDto>();
    const fileName = ref('');
    const rawToml = ref('');
    // 通道菜单要显示版本号和日期，列表拉一次就留着
    const versionsEntry = ref<AquaMaiVersionEntry>();
    const status = ref('');
    const error = ref('');
    const loading = ref(true);
    const dirty = ref(false);
    const justLoaded = ref(false);
    // 浏览器打开的那个文件句柄，保存时优先写回它，见 fileAccess.ts
    const fileHandle = ref<FileSystemFileHandle>();
    const fileInput = ref<HTMLInputElement>();
    const dllInput = ref<HTMLInputElement>();
    // 拖放状态。dragDepth 计数是为了忽略在子元素之间来回移动时成对出现的 enter / leave
    const dragging = ref(false);
    const dragDepth = ref(0);
    const dragKind = ref<DropKind>('unknown');
    const dragName = ref('');

    if (host?.locale) {
      locale.value = host.locale;
    }
    // 宿主自己画了工具栏时，页面上那一条（标题、打开、保存、状态）就是重复的
    const hideToolbar = Boolean(host?.hideToolbar);
    // 宿主藏了工具栏就得自己管那两个按钮的可用性：内核没就绪时打开文件也解析不了
    watch(dll, (value) => host?.notifyReady?.(Boolean(value)), { immediate: true });

    const canSave = computed(() => Boolean(config.value && dll.value && dirty.value && !loading.value));
    const signatureValid = computed(() => signature.value?.status === 'valid');
    const signatureText = computed(() =>
      signature.value ? t(SIGNATURE_STATUS_KEYS[signature.value.status]) : '');
    // keyId 为 'none' 是「压根没有签名块」，抖一个 key none 出来没意义
    const signatureKeyId = computed(() => {
      const keyId = signature.value?.keyId;
      return keyId && keyId !== 'none' ? keyId : '';
    });
    const kernelText = computed(() => {
      if (dll.value) {
        return t('mod.web.kernelReady', { version: dll.value.version });
      }
      return loading.value ? t('mod.web.kernelLoading') : t('mod.web.kernelFailed');
    });
    const dropTitle = computed(() => {
      switch (dragKind.value) {
        case 'toml':
          return t('mod.web.dropToml');
        case 'dll':
          return t('mod.web.dropDll');
        default:
          return t('mod.web.dropFile');
      }
    });

    // 换配置文件会丢掉没保存的改动，先问一句。拖放比点按钮更容易误触，
    // 所以两种入口都要过这道关
    const confirmDiscard = async (): Promise<boolean> => {
      if (!config.value || !dirty.value) {
        return true;
      }
      const discard = await showTransactionalDialog(
        t('mod.web.discardTitle'),
        t('mod.web.discardMessage'),
        [
          { text: t('mod.web.discard'), action: true, danger: true },
          { text: t('mod.web.cancel'), action: false },
        ],
        true,
      );
      return discard === true;
    };

    /** 把已经打开的配置整个卸掉。换内核之后旧解析结果就没用了，见 reparseForKernel */
    const unloadConfig = () => {
      config.value = undefined;
      rawToml.value = '';
      fileName.value = '';
      fileHandle.value = undefined;
      dirty.value = false;
      status.value = '';
      host?.notifyDirty(false);
    };

    /** 换内核之后必须用新内核把开着的配置重新解析一遍：sections、默认值、字段类型
     * 都会跟着内核走，拿旧内核的解析结果去保存会静默丢条目，甚至直接报类型错 */
    const reparseForKernel = async () => {
      // 判断只看 config：空文件也是解析成功的一份配置（全是默认值），
      // rawToml 为空串时同样得用新内核重来一遍
      if (!config.value) {
        return;
      }
      // 新内核读不了这份配置（比如切到了更老的通道）时不能把旧结果留在界面上，
      // 那会让显示的条目和新内核能写出的东西彻底对不上
      if (!await parseToml(rawToml.value, fileName.value)) {
        unloadConfig();
      }
    };

    // 换配置内核的入口有两个（菜单里的通道、拖入 / 选一个本地 dll），未保存的改动
    // 会在重新解析时作废，所以两边都要过这道关。返回 false 表示用户取消了这次换内核
    const confirmKernelSwitch = async (): Promise<boolean> => {
      if (!config.value || !dirty.value) {
        return true;
      }
      const choice = await showTransactionalDialog(
        t('mod.web.kernelSwitchTitle'),
        t('mod.web.kernelSwitchMessage'),
        [
          { text: t('mod.web.kernelSwitch'), action: 'save' },
          { text: t('mod.web.kernelSwitchDiscard'), action: 'discard', danger: true },
          { text: t('mod.web.cancel'), action: 'cancel' },
        ],
        true,
      );
      if (choice === 'save') {
        // 存不下来就别换内核了，不然刚写的改动和新内核对不上
        return await save();
      }
      return choice === 'discard';
    };

    const setDll = async (bytes: ArrayBuffer, version: string, source: AquaMaiDll['source']) => {
      signature.value = await verifyAquaMaiSignature(bytes);
      dll.value = { bytes, version, source };
      status.value = t('mod.web.kernelReady', { version });
    };

    const ensureVersionEntry = async (): Promise<AquaMaiVersionEntry> => {
      if (!versionsEntry.value) {
        versionsEntry.value = await fetchAquaMaiVersions();
      }
      return versionsEntry.value;
    };

    // 换内核是「谁最后完成谁生效」：正在飞的通道下载会把用户刚拖进来的本地 dll 覆盖掉。
    // 用一个递增序号把过期的那次操作作废；顺带保证「未保存的改动」是在真正动手之前
    // 那一刻问的，下载期间用户改的东西不会因为早就问过而被无声抹掉
    let kernelEpoch = 0;

    const loadChannelDll = async (type: string) => {
      const epoch = ++kernelEpoch;
      error.value = '';
      loading.value = true;
      try {
        const entry = await ensureVersionEntry();
        const downloaded = await downloadAquaMaiDll(entry, type);
        if (epoch !== kernelEpoch) {
          return;
        }
        if (!await confirmKernelSwitch()) {
          return;
        }
        await setDll(downloaded.bytes, downloaded.version, downloaded.source);
        await reparseForKernel();
      } catch (cause) {
        error.value = describeError(cause) || t('mod.web.dllLoadFailed');
      } finally {
        // 已经有更新的换内核操作接手了，loading 归它管
        if (epoch === kernelEpoch) {
          loading.value = false;
        }
      }
    };

    const loadDll = async () => {
      if (host) {
        const hosted = await host.loadDll();
        const bytes = base64ToArrayBuffer(hosted.base64);
        const verified = await verifyAquaMaiSignature(bytes);
        // 只有「校验过而且不通过」才拒绝。环境里没有 Web Crypto 时是校验不了，
        // 不是这个 DLL 有问题，宿主既然把它递过来了就先按它的用（徽章会说明校验不了）
        if (verified.status !== 'valid' && verified.status !== 'unsupported') {
          throw new Error(t('mod.web.hostDllInvalidSignature', {
            status: t(SIGNATURE_STATUS_KEYS[verified.status]),
          }));
        }
        await setDll(bytes, hosted.version, 'cloudflare');
        return;
      }

      // 首屏用快速通道，稳定通道等用户自己从菜单里挑
      const entry = await ensureVersionEntry();
      const latest = await downloadAquaMaiDll(entry, 'ci');
      await setDll(latest.bytes, latest.version, latest.source);
    };

    /** 换内核。
     * reloadConfig=false 用于紧接着就要导入新 toml 的场景：那份配置马上整个被替换掉，
     * 既不用问未保存的改动，也没必要拿新内核再解析一遍旧的 */
    const importDllFile = async (file: File, reloadConfig = true): Promise<boolean> => {
      if (!backend.value) {
        error.value = t('mod.web.notReady');
        return false;
      }
      const epoch = ++kernelEpoch;
      error.value = '';
      loading.value = true;
      try {
        const bytes = await file.arrayBuffer();
        const version = await backend.value.getModVersion(bytes);
        if (epoch !== kernelEpoch) {
          return false;
        }
        if (reloadConfig && !await confirmKernelSwitch()) {
          return false;
        }
        await setDll(bytes, version, 'cloudflare');
        if (reloadConfig) {
          await reparseForKernel();
        }
        return true;
      } catch (cause) {
        // 拖进来一个不是 AquaMai 的 dll 时 getModVersion 会直接抛，
        // 不接住的话就成了没有任何提示的 unhandled rejection
        const detail = cause instanceof NotAquaMaiAssemblyError
          ? t('mod.web.notAquaMaiAssembly', {
            name: cause.assemblyName || t('mod.web.unknownVersion'),
          })
          : describeError(cause);
        error.value = detail ? `${t('mod.web.dllLoadFailed')} (${detail})` : t('mod.web.dllLoadFailed');
        return false;
      } finally {
        if (epoch === kernelEpoch) {
          loading.value = false;
        }
      }
    };

    const parseToml = async (content: string, name: string): Promise<boolean> => {
      // 宿主藏了工具栏时打开文件是它自己的按钮触发的，这时候内核可能还没加载完。
      // 直接 return false 的话用户选的文件就凭空消失了，得说清楚是没准备好
      if (!backend.value || !dll.value) {
        error.value = t('mod.web.notReady');
        return false;
      }
      loading.value = true;
      error.value = '';
      try {
        const result = await backend.value.parse(dll.value.bytes, content);
        if (!result.success || !result.config) {
          error.value = result.errorMessage ?? t('mod.web.parseFailed');
          return false;
        }
        rawToml.value = content;
        fileName.value = name;
        justLoaded.value = true;
        config.value = result.config;
        dirty.value = false;
        host?.notifyDirty(false);
        status.value = result.originalConfigVersion && result.originalConfigVersion !== result.latestConfigVersion
          ? t('mod.web.versionMigrated', {
            from: result.originalConfigVersion,
            to: result.latestConfigVersion,
          })
          : t('mod.web.configVersion', {
            version: result.latestConfigVersion ?? t('mod.web.unknownVersion'),
          });
        return true;
      } catch (cause) {
        error.value = describeError(cause) || t('mod.web.parseFailed');
        return false;
      } finally {
        loading.value = false;
      }
    };

    const loadTomlFile = async (
      content: string,
      name: string,
      handle?: FileSystemFileHandle,
    ): Promise<boolean> => {
      if (!await parseToml(content, name)) {
        return false;
      }
      // 换了文件，旧的句柄不能再用（保存会写错文件）；拖进来的是 Chromium 的话
      // 还能拿到句柄写回原文件，见 fileAccess.ts
      fileHandle.value = handle;
      return true;
    };

    const openToml = async () => {
      if (!dll.value) {
        error.value = t('mod.web.notReady');
        return;
      }
      if (host) {
        const selected = await host.loadToml();
        if (selected && await confirmDiscard()) {
          await loadTomlFile(selected.content, selected.name);
        }
        return;
      }
      const picked = await openFileViaPicker();
      if (picked.kind === 'cancel') {
        return;
      }
      if (picked.kind === 'unsupported') {
        fileInput.value?.click();
        return;
      }
      // 拿到文件之后再问，别让确认框耗掉 picker 需要的 user activation
      if (!await confirmDiscard()) {
        return;
      }
      await loadTomlFile(await picked.file.text(), picked.file.name, picked.handle);
    };

    const openDll = () => {
      dllInput.value?.click();
    };

    const onTomlSelected = async (event: Event) => {
      const input = event.target;
      if (!(input instanceof HTMLInputElement)) {
        return;
      }
      const file = input.files?.[0];
      input.value = '';
      if (!file || !await confirmDiscard()) {
        return;
      }
      await loadTomlFile(await file.text(), file.name);
    };

    const onDllSelected = async (event: Event) => {
      const input = event.target;
      if (!(input instanceof HTMLInputElement)) {
        return;
      }
      const file = input.files?.[0];
      input.value = '';
      if (!file) {
        return;
      }
      await importDllFile(file);
    };

    const hasFiles = (event: DragEvent) =>
      Array.from(event.dataTransfer?.types ?? []).includes('Files');

    const updateDropHint = (event: DragEvent) => {
      let name = '';
      try {
        name = event.dataTransfer?.items[0]?.getAsFile()?.name ?? '';
      } catch {
        // 有的浏览器在 dragover 阶段不给文件信息，那就不猜类型
      }
      dragName.value = name;
      dragKind.value = name ? dropKindOf(name) : 'unknown';
    };

    const onDragEnter = (event: DragEvent) => {
      if (!hasFiles(event)) {
        return;
      }
      event.preventDefault();
      dragDepth.value += 1;
      dragging.value = true;
      updateDropHint(event);
    };

    const onDragOver = (event: DragEvent) => {
      if (!hasFiles(event)) {
        return;
      }
      // 不拦掉的话浏览器会直接跳到这个文件上，把编辑器顶掉
      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'copy';
      }
      // 从别的窗口拖进来时可能收不到 dragenter，这里补一刀
      dragging.value = true;
      updateDropHint(event);
    };

    const onDragLeave = (event: DragEvent) => {
      if (!hasFiles(event)) {
        return;
      }
      dragDepth.value = Math.max(0, dragDepth.value - 1);
      if (dragDepth.value === 0) {
        dragging.value = false;
      }
    };

    const onDrop = async (event: DragEvent) => {
      if (!hasFiles(event)) {
        return;
      }
      event.preventDefault();
      dragDepth.value = 0;
      dragging.value = false;

      const items = Array.from(event.dataTransfer?.items ?? [])
        .filter((item) => item.kind === 'file');
      // getAsFileSystemHandle 只在 drop 事件里可用，先把 promise 起出来再慢慢 await
      const pending = items.map((item) => ({
        file: item.getAsFile(),
        handle: fileHandleFromDrop(item),
      }));
      const dropped: DroppedFile[] = [];
      for (const item of pending) {
        const handle = await item.handle;
        if (item.file) {
          dropped.push({ file: item.file, handle });
        }
      }

      const dllFile = dropped.find((item) => dropKindOf(item.file.name) === 'dll');
      const tomlFile = dropped.find((item) => dropKindOf(item.file.name) === 'toml');
      if (!dllFile && !tomlFile) {
        error.value = t('mod.web.unsupportedDrop');
        return;
      }
      if (tomlFile && !await confirmDiscard()) {
        return;
      }
      // 先换内核，这样 toml 是用新内核解析的。同时拖了 toml 的话那份配置整个要换掉，
      // 内核这边就不用再问一遍未保存的改动，也不用拿新内核去解析旧的那份
      const kernelSwitched = dllFile ? await importDllFile(dllFile.file, !tomlFile) : false;
      // dll 没换成时 error 里是原因，但（成功的）toml 解析会把 error 清空，
      // 两个一起拖时这条提示得留到最后
      const dllError = dllFile && !kernelSwitched ? error.value : '';
      if (tomlFile) {
        const loaded = await loadTomlFile(
          await tomlFile.file.text(),
          tomlFile.file.name,
          tomlFile.handle,
        );
        if (!loaded && kernelSwitched) {
          // 换了内核，但这份 toml 新内核读不了（比如拖的是更新版本的配置），
          // 界面上的旧配置已经和新内核不是一回事了
          unloadConfig();
        }
        if (loaded && dllError) {
          error.value = dllError;
        }
      }
    };

    const downloadToml = (content: string) => {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName.value || 'AquaMai.toml';
      anchor.click();
      URL.revokeObjectURL(url);
    };

    const save = async (): Promise<boolean> => {
      if (!backend.value || !dll.value || !config.value) {
        return false;
      }
      error.value = '';
      // 弹保存对话框 / 申请写权限都要 user activation，必须赶在序列化（跑 WASM）之前，
      // 否则点下按钮时的激活早就过期，浏览器会直接拒绝
      const target = host?.saveToml
        ? undefined
        : await resolveSaveTarget(fileHandle.value, fileName.value || 'AquaMai.toml');
      if (target?.kind === 'cancel') {
        return false;
      }
      loading.value = true;
      try {
        const saveData: ConfigSaveDto = {
          sectionStates: config.value.sectionStates,
          entryStates: config.value.entryStates,
        };
        const result = await backend.value.serialize(
          dll.value.bytes,
          saveData,
          locale.value.startsWith('zh') ? 'zh' : 'en',
        );
        if (!result.success || !result.toml) {
          error.value = result.errorMessage ?? t('mod.web.saveFailed');
          return false;
        }
        if (host?.saveToml) {
          await host.saveToml(result.toml);
        } else if (target?.kind === 'write') {
          await writeFileToHandle(target.handle, result.toml);
          fileHandle.value = target.handle;
        } else {
          downloadToml(result.toml);
        }
        rawToml.value = result.toml;
        dirty.value = false;
        host?.notifyDirty(false);
        status.value = t('mod.web.saved', {
          version: result.configVersion ?? t('mod.web.unknownVersion'),
        });
        return true;
      } catch (cause) {
        error.value = describeError(cause) || t('mod.web.saveFailed');
        return false;
      } finally {
        loading.value = false;
      }
    };

    watch(config, () => {
      if (!config.value) {
        return;
      }
      if (justLoaded.value) {
        justLoaded.value = false;
        return;
      }
      dirty.value = true;
      host?.notifyDirty(true);
    }, { deep: true });

    // 关页面 / 刷新时拦一下没保存的改动。宿主自己实现了 saveToml 的话，
    // dirty 的生命周期归它（notifyDirty），页面不插手
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty.value) {
        return;
      }
      event.preventDefault();
      event.returnValue = '';
    };

    // 顶栏藏掉之后宿主没有别的办法触发打开 / 保存，得走这个对象
    const commands: AquaMaiEditorCommands = { openToml, openDll, save };

    onMounted(async () => {
      window.aquaMaiEditor = commands;
      if (!host?.saveToml) {
        window.addEventListener('beforeunload', onBeforeUnload);
      }
      try {
        backend.value = await createWasmBackend();
        await loadDll();
        if (host) {
          const selected = await host.loadToml();
          if (selected) {
            await loadTomlFile(selected.content, selected.name);
          }
        }
      } catch (cause) {
        const detail = describeError(cause);
        error.value = detail
          ? `${detail}\n${t('mod.web.kernelFailed')}`
          : t('mod.web.kernelFailed');
      } finally {
        loading.value = false;
      }
    });

    onUnmounted(() => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      if (window.aquaMaiEditor === commands) {
        delete window.aquaMaiEditor;
      }
    });

    // 通道来自版本列表，本地文件是兜底。列表拿不到（离线）时就只剩本地那一项
    const dllOptions = computed(() => {
      const entry = versionsEntry.value;
      const describe = (type: string) => {
        const info = entry && findAquaMaiVersion(entry, type);
        if (!info?.version) {
          return '';
        }
        return info.createdAt
          ? `${info.version} · ${new Date(info.createdAt).toLocaleDateString()}`
          : info.version;
      };
      const channels = [
        { type: 'slow', label: t('mod.stableChannel') },
        { type: 'ci', label: t('mod.fastChannel') },
      ]
        .filter((channel) => Boolean(entry && findAquaMaiVersion(entry, channel.type)))
        .map((channel) => ({
          label: channel.label,
          desc: describe(channel.type),
          action: () => loadChannelDll(channel.type),
        }));
      return [
        ...channels,
        {
          label: t('mod.web.localDll'),
          desc: t('mod.web.localDllHint'),
          action: openDll,
        },
      ];
    });

    const renderDllMenu = (label: string, align: 'center' | 'right', buttonClass = '') => (
      <DropMenu options={dllOptions.value} align={align}>
        {{
          trigger: (onClick: () => void) => (
            <Button
              onClick={onClick}
              disabled={loading.value || !backend.value}
              class={buttonClass}
            >
              {label}
            </Button>
          ),
        }}
      </DropMenu>
    );

    const renderStatus = () => (
      <div class="flex items-center gap-2 flex-wrap text-13px min-h-20px">
        {dll.value && (
          <span class="flex items-center gap-1.5 px-2 py-0.5 rd-2 bg-[var(--modal-button-bg)]">
            <span class="i-material-symbols:memory-alt-rounded text-4 op-60" />
            <span>AquaMai {dll.value.version}</span>
          </span>
        )}
        {signatureText.value && (
          <span
            class={[
              'flex items-center gap-1.5 px-2 py-0.5 rd-2 bg-[var(--modal-button-bg)]',
              signatureValid.value ? 'c-green-6' : 'c-orange-6',
            ]}
            title={signatureKeyId.value
              ? t('mod.web.signatureKey', { keyId: signatureKeyId.value })
              : undefined}
          >
            <span class={signatureValid.value ? 'i-material-symbols:verified-rounded' : 'i-material-symbols:warning-rounded'} />
            <span class="c-[var(--text-color)]">{signatureText.value}</span>
          </span>
        )}
        {fileName.value && (
          <span class="flex items-center gap-1.5 px-2 py-0.5 rd-2 bg-[var(--modal-button-bg)] max-w-60">
            <span class="i-material-symbols:description-outline text-4 op-60 shrink-0" />
            <span class="font-mono truncate">{fileName.value}</span>
          </span>
        )}
        {status.value && <span class="op-70">{status.value}</span>}
        {dirty.value && <span class="c-orange-6">● {t('mod.web.unsaved')}</span>}
      </div>
    );

    const renderEmpty = () => (
      <div class="h-full flex items-center justify-center p-4">
        <div
          class={[
            'w-full max-w-160 flex flex-col items-center gap-3 px-8 py-10 text-center',
            'rd-4 border-2 border-dashed transition-colors duration-200',
            dragging.value
              ? 'border-[var(--link-color)] bg-[color-mix(in_oklab,var(--link-color)_6%,transparent)]'
              : 'border-[color-mix(in_oklab,currentColor_20%,transparent)]',
          ]}
        >
          <div
            class={[
              'i-material-symbols:upload-file-rounded text-14 transition-transform duration-200',
              dragging.value ? 'text-[var(--link-color)] scale-110' : 'op-30',
            ]}
          />
          <div class="text-2xl font-600">{t('mod.web.emptyTitle')}</div>
          <div class="text-sm op-60 lh-1.8em ws-pre-line max-w-130">{t('mod.web.emptyHint')}</div>
          <div class="flex gap-3 flex-wrap justify-center mt-2">
            <Button
              onClick={openToml}
              disabled={loading.value || !dll.value}
              class={dll.value ? PRIMARY_BUTTON_CLASS : ''}
            >
              {t('mod.web.chooseToml')}
            </Button>
            {renderDllMenu(t('mod.web.chooseDll'), 'center', dll.value ? '' : PRIMARY_BUTTON_CLASS)}
          </div>
          <div class={['flex items-center gap-2 text-13px mt-1', dll.value ? 'op-55' : 'c-orange-6']}>
            {!dll.value && loading.value && <span class="i-mdi-loading animate-spin" />}
            {!dll.value && !loading.value && <span class="i-material-symbols:error-outline" />}
            <span>{kernelText.value}</span>
          </div>
        </div>
      </div>
    );

    const renderDropOverlay = () => (
      <div
        // 常驻在 DOM 里才有淡入淡出，拖拽结束时的淡出同理
        aria-hidden={!dragging.value}
        class={[
          'absolute inset-0 z-100 flex items-center justify-center p-4',
          'bg-[color-mix(in_oklab,currentColor_8%,transparent)] backdrop-blur-sm',
          'transition-opacity duration-150',
          dragging.value ? 'op-100' : 'op-0 pointer-events-none',
        ]}
      >
        <div class="flex flex-col items-center gap-2 px-10 py-8 rd-4 border-2 border-dashed border-[var(--link-color)] bg-[var(--modal-backdrop-bg)] text-center shadow-xl">
          <div class="i-material-symbols:download-rounded text-12 text-[var(--link-color)]" />
          <div class="text-lg font-600">{dropTitle.value}</div>
          {dragName.value && (
            <div class="text-13px op-60 font-mono max-w-80 truncate">{dragName.value}</div>
          )}
        </div>
      </div>
    );

    return () => (
      <div
        class="relative h-100dvh flex flex-col of-hidden p-2 gap-2"
        onDragenter={onDragEnter}
        onDragover={onDragOver}
        onDragleave={onDragLeave}
        onDrop={onDrop}
      >
        <GlobalElementsContainer />
        <input
          ref={fileInput}
          type="file"
          accept=".toml,text/plain"
          class="hidden"
          onChange={onTomlSelected}
        />
        <input
          ref={dllInput}
          type="file"
          accept=".dll,application/octet-stream"
          class="hidden"
          onChange={onDllSelected}
        />
        {/* hideToolbar 时整条不渲染（宿主自己画），但错误条不是工具栏的一部分：
            藏掉之后解析失败、签名不对这类问题在界面上就一点痕迹都没有了 */}
        {!hideToolbar && (
          <div class="flex flex-col gap-2 shrink-0">
            <div class="flex items-center gap-3 flex-wrap">
              <div class="text-xl">{t('mod.editorTitle', 'AquaMai 配置编辑器')}</div>
              <div class="flex-1" />
              {config.value && (
                <>
                  <Button onClick={openToml} disabled={loading.value || !dll.value}>
                    {t('mod.openToml', '选择 TOML')}
                  </Button>
                  {renderDllMenu(t('mod.openDll', '选择 DLL'), 'right')}
                  <Button variant="primary" onClick={save} disabled={!canSave.value}>
                    {t('mod.save', '保存')}
                  </Button>
                </>
              )}
            </div>
            {config.value && renderStatus()}
          </div>
        )}
        {error.value && (
          <div class="flex items-start gap-2 text-13px c-red-6 ws-pre-line bg-red-1 dark:bg-red-9/20 px-3 py-2 rd-1 shrink-0">
            <span class="i-material-symbols:error-outline shrink-0" />
            <span>{error.value}</span>
          </div>
        )}
        {/* 必须是 flex 容器：AquaMaiConfigurator 的根节点靠 flex-1 拿高度，
            落在普通块级父元素里会按内容撑高，内部那几个 of-y-auto 就永远滚不动 */}
        <div class="flex-1 min-h-0 flex flex-col">
          {config.value
            ? <AquaMaiConfigurator config={config.value} useNewSort />
            : renderEmpty()}
        </div>
        {renderDropOverlay()}
      </div>
    );
  },
});
