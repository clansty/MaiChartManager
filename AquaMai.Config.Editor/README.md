# AquaMai Config Editor

AquaMai 可视化配置编辑器。既是给 MCM 前端复用的 Vue 组件，也能单独构建成网页版。

## 两种用法

**1. MCM 前端里的组件**

MCM 的后端从已安装的 AquaMai.dll 里解析出配置，通过 `GetAquaMaiConfigApi` 返回，
前端把它交给 `<AquaMaiConfigurator config>` 渲染。

分区面板分两层，两边的面板都按 `<分区 path>/index.tsx` 的目录约定被 `import.meta.glob`
收录（新建目录即生效，不用登记），查表返回 `SectionPanelOverride`（`{ component, position }`）：
需要宿主能力（读写游戏目录、驱动状态、装资源）的面板在 MCM 那边
（`MaiChartManager/Front/src/views/ModManager/sectionPanelOverride/`），通过
`getSectionPanelOverride` prop 传进来；纯配置项的面板（键位、音量路由、解锁、窗口预设等）
在本组件自带的 `src/overrides/` 里，宿主那层没命中时自动回退。

面板自己的摆放位置就写在面板模块里：`export const panelPosition = 'top'`（`bottom` 在配置项
下方、`override` 顶掉配置项，不写就是 `override`）。放在面板跟前而不是集中在一张位置表里，
是因为这本来就是「这个面板长什么样」的一部分。

两层各占一个位置槽、可以同时生效，同一个槽位宿主优先。ADX / Maimoller 就是这么拆的：
条目排版（1P 左、2P 右，触屏 / 按键 / 灯光那几个开关）不需要宿主能力，在自带那层挂
`override`，独立编辑器也吃得到；硬件状态（Mod 冲突、依赖库有没有装）只有 MCM 拿得到，
在宿主那层挂 `top`。写宿主面板时可以直接用
本包导出的 `ConfigEntry`、`ENTRY_LABEL_CLASS`、`ENTRY_GROUP_PADDING`、`getNameForPath`
和数据结构类型，保持和自带面板一致的外观。

界面的文案（编辑器自己渲染的所有 `mod.*`）在 `src/locales/{zh,zh-TW,en}.yaml`，**只写这一份**，
宿主不要再抄：用本包导出的 `mergeEditorMessages(messages, locale)` 合并进自己的 messages 即可
（MCM 前端在 `MaiChartManager/Front/src/locales/index.ts` 里就是这么用的）。必须用它做递归合并——
`mod.keyMap` 这类命名空间两边的 yaml 里各有一半键，浅拷贝会让其中一半整个消失，界面上直接显示 key。

**2. 独立网页**

`src/web/` 是独立入口：先在浏览器里用 Web Crypto 校验 AquaMai.dll 签名，再用
`AquaMai.Config.Wasm`（AquaMai 自己的配置库编译成的 WASM）解析 `AquaMai.toml`。

存在 `window.aquaMaiEditorHost` 时打开 / 保存都走宿主；宿主再实现了 `saveToml` 就
由它接管保存，页面的 dirty 生命周期也归它（`notifyDirty`）。

宿主自己画了工具栏（标题、打开、保存、状态）时，可以在 host 上带 `hideToolbar: true`：
页面顶部那一条整个不渲染，配置区域直接顶到最上面，打开 / 保存改由宿主调页面挂到
`window.aquaMaiEditor` 上的 `openToml` / `openDll` / `save`（`AquaMaiEditorCommands`，
其中 `save` 返回是否真的保存成功）。这两个动作要在内核就绪之后才调得动——内核还在加载时
`openToml` 会直接报「编辑器还没准备好」，所以藏了工具栏的宿主该用 host 上的
`notifyReady` 开关自己那两个按钮。错误条不跟着藏——它不是工具栏的一部分，
藏了解析失败之类的问题在界面上就没痕迹了。

配置内核可以从顶部的「选择 DLL」菜单里挑：稳定通道 / 快速通道来自 AquaMai 的版本列表
（`fetchAquaMaiVersions` 拉列表、`downloadAquaMaiDll` 下载，菜单里带上版本号和日期），
第三项是本地文件。首屏默认加载快速通道，列表拉不到（离线）时只剩本地那一项。
本地文件按**程序集名**认，只收 AquaMai 自己的那个程序集：别的托管 dll 也读得出程序集版本，
放进来会等到打开配置时才报一句和「选错文件」毫无关系的错。

换内核（菜单里挑通道，或者拖入 / 选一个本地 dll）时，如果还有没保存的改动会问一句
要不要保存（通道那条路是等下载完、真正动手之前才问的，免得下载期间改的东西被早就问过的结论抹掉）。换完之后会用新内核把当前打开的配置**重新解析一遍**：sections、默认值和字段类型
都跟着新内核走，否则界面显示的条目和新内核能写出的东西对不上，保存时静默丢条目甚至报类型错。
新内核读不了这份配置（切到了更老的通道）时，配置整个卸掉并保留解析错误的提示。

页面支持把 `AquaMai.toml` / `AquaMai.dll` 直接拖进来（拖 toml 就是换配置，拖 dll 就是换内核），
拖进来的 toml 在 Chromium 里同样能拿到文件句柄，保存会写回原文件；换配置文件前如果还有没保存的
改动会先问一句。同时拖一个 toml 和一个 dll 时先换内核再用新内核解析这份 toml，
中间不会再问一遍（配置整个要换掉）。

没有宿主，或者宿主没实现 `saveToml` 时，页面自己负责保存：打开和保存都走浏览器的
File System Access API，保存直接写回打开时那个文件（也就是 `AquaMai.toml` 本身），
句柄不可用才弹保存对话框；浏览器没有这套 API（Firefox / Safari）时退回
`<input type=file>` + 下载。这条路上页面还会在未保存就关闭时拦一下。

两条路拿到的配置形状是完全一样的，契约在 `../AquaMai.Config.Dto/AquaMaiConfigDto.cs`
（MCM 后端和 WASM 共用），前端的 `src/types.ts` 照着它写。

## 开发

编辑器是仓库根 pnpm workspace 的成员，在**仓库根**装依赖：

```bash
pnpm install
```

独立网页依赖 WASM 的构建产物，先发布它（不需要 wasm-tools workload）：

```bash
dotnet publish AquaMai.Config.Wasm/AquaMai.Config.Wasm.csproj -c Release
```

然后：

```bash
cd AquaMai.Config.Editor
pnpm dev
```

## 构建

仓库根的 `build-web.ps1` 会把 WASM 和网页版一起构建出来。

```bash
pnpm typecheck
pnpm build
```

`pnpm typecheck` 会连带检查 `../MuNET-UI/src`（`@munet/ui` 是 workspace 源码依赖），
所以 tsconfig 里没有开 `exactOptionalPropertyTypes` / `noUncheckedIndexedAccess` /
`verbatimModuleSyntax`——开了会因为 UI 库的写法报一堆和编辑器无关的错误。

`pnpm typecheck` 不需要 WASM 的 publish 产物（CI 的 Typecheck 任务不发布 WASM）：`dotnet.js` 和
`blazor.boot.json` 这两处跨项目导入在 `src/vite-env.d.ts` 里有兜底声明。`pnpm build` 才真的需要
产物，缺了会以 `UNRESOLVED_IMPORT` 直接失败，不会被那两份声明掩盖。

## 主题

`@munet/ui` 的主题样式全部挂在 `body:has(.<root 类>)` 下，而那个 `<root 类>` 元素
只有 `GlobalElementsContainer` 会渲染。**任何宿主都必须渲染它**（MCM 前端在
`App.tsx` 里渲染了，独立入口在 `src/web/App.tsx` 里渲染），否则整套主题不生效：
背景、`--text-color`、按钮和弹窗的颜色变量全都拿不到。

## 布局

`AquaMaiConfigurator` 的根节点用 `flex-1` 拿高度，内部几个面板各自 `of-y-auto`。
宿主要把它放进**高度已经确定的 flex 容器**里（`flex-1 min-h-0`），否则它会按内容撑高，
自己内部就永远滚不动——外层再 `of-hidden` 的话表现为列表被裁掉且无法滚动。
