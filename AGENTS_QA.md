# QA 经验

## Photino 静态资源

- `Front` 的 `pnpm build` 只更新 `MaiChartManager/wwwroot`；LinuxDebug 运行时的 ContentRoot 是 `bin/LinuxDebug/net10.0/linux-x64`。
- 浏览器 QA 前还要执行 `dotnet build MaiChartManager/MaiChartManager.csproj -c LinuxDebug`，否则后端仍会提供旧的 `bin/.../wwwroot`。
- 可用首页引用的 `assets/index-*.js` 哈希确认运行中的服务是否已加载最新前端。

## 受控 Radio

- `@munet/ui` 的 Radio 会在 click 中调用 `preventDefault()`；更新 Vue 状态后，浏览器可能在事件结束时回滚原生 `checked`，造成内容已切换但圆点仍显示旧状态。
- 关键模式选择应同时断言业务内容和 `input.isChecked()`；需要受控状态时使用原生 radio 的 `checked` + `onChange`，或先修复共享组件。
- Radio 有 250ms 颜色过渡，截图应在状态断言通过并等待过渡结束后采集。

## 弹窗滚动

- 限高滚动区不要让纵向 flex 子项默认收缩，否则 Select 等控件会被压成细条；使用普通块级流，或显式禁止子项收缩。
- 响应式弹窗应同时断言弹窗矩形、标题和操作按钮都位于视口内，不能只检查文档没有横向滚动。

## 无后端前端动效 QA

- 只验证前端动效且后端未启动时，初始化错误弹窗会遮住真实页面；可以仅在 QA 浏览器会话中关闭弹窗和根节点的 modal 状态，再采集页面证据，不要修改产品错误处理。
- 动效证据矩阵送审前要逐项检查文件存在且非空，尤其是反向切换的 settled 帧；运行时 transform 数据不能替代缺失的视觉帧。

## Linux 下验证 Windows 私有逻辑

- 临时测试程序直接项目引用主项目时，默认配置会把主项目解析成 Windows TFM；先构建 `LinuxDebugBackend`，再引用其输出 DLL。
- 引用主 Web 程序集的临时测试项目还需声明 `Microsoft.AspNetCore.App` FrameworkReference，否则运行时无法加载 MVC 程序集。

## 重新生成前端 API client（Linux）

- `pnpm genClient` 要连 `http://localhost:5181/swagger/v1/swagger.json`。这个端口来自
  `MaiChartManager/Properties/launchSettings.json`，**只有 `dotnet run` 会读它**；
  直接跑编译出来的 exe 会落到 Kestrel 默认的 5000，脚本连不上。
- 但就算 `dotnet run` 起了 5181，走 `ServerManager` 的真实应用里 `/swagger/v1/swagger.json`
  是 404（`/` 也是 404）。要生成 client 请用专门的 `MaiChartManager.GenClient`：
  `dotnet run --project MaiChartManager.GenClient/MaiChartManager.GenClient.csproj -c LinuxDebugBackend`，
  它只挂 Swagger + Controllers，跑完自动退出。
- `GenClient` 原先用 `cmd.exe /c` 调 pnpm，Linux 上会直接抛 “No such file or directory”，
  已改成按平台选 `cmd.exe` / `pnpm`。
- backend 目录里跑的进程不要用 `pkill -f <模式>` 收尾：模式会匹配到自己所在的 shell 命令行，
  把当前命令一起杀掉（表现为退出码 144）。用 `ss -ltnp` 拿 PID 再 `kill`。

## 构建 AquaMai 配置 WASM

- `dotnet publish AquaMai.Config.Wasm/AquaMai.Config.Wasm.csproj -c Release` 在没装
  `wasm-tools` workload 的机器上也能跑通，只会警告 “Publishing without optimizations”。
- 产物在 `AquaMai.Config.Wasm/bin/Release/net9.0/publish/wwwroot/_framework/`，编辑器的
  `src/wasm/dotnet.ts` 直接按相对路径引用它，没发布过就构建不出来。
## 前端接入 tsc 类型检查（2026-10-09）

- 没有 `skipLibCheck` 时全项目 18 条报错里有 9 条来自三方 `.d.ts`（vueuse 引 `Bluetooth*`、naive-ui 引没装的 `katex`、vue-i18n 引 vue 里不存在的 `GenericComponentInstance`、`@f3ve/vue-markdown-it` 引 `markdown-it`），真正的源码错只有 9 条。**先开 `skipLibCheck` 把噪音降到 0 再看剩什么**，否则会把三方问题误判成自己的工作。
- 生成文件 `src/client/apiGen.ts` / `aquaMaiVersionConfigApiGen.ts` 头部的 `// @ts-nocheck` 来自 swagger-typescript-api 硬编码的 `FILE_PREFIX`，`generateApi` 没有开关能关掉。实测剥掉后这两份文件（约 3400 行）零报错，所以在 `genClient.ts` 里做了生成后剥离，并写成「找不到就抛错退出」，避免库升级后静默失效。
- `src/icons/*.svg` 当组件用时类型是错的：`vite/client` 声明 `*.svg` 是 `string`，而 vite-svg-loader 把它编译成组件。**不要**自己在 `env.d.ts` 里再声明一遍 `*.svg`——两份同名 ambient module 会合并，产生重复的 `export default`（`tsc` 报 TS2300），而 `skipLibCheck: true` 恰好把这条报错也吞掉，表现为 JSX 属性莫名不认，极难定位。正解是用 loader 支持的 `?component` 后缀：`vite/client` 没有这个 pattern，可以安全地单独声明。
- 判断一个 `@ts-ignore` 是不是承重不能靠读代码。临时把所有 `@ts-ignore` 一次失效再跑一次 `tsc` 最快；注意 **TS 认的是「以 `@ts-ignore` 开头的行注释」**，把 `@ts-ignore` 改成 `@ts-ignore-defused` 仍然是生效的指令，要让行号不变地把指令挪到注释中间（例如 `// DISABLED @ts-ignore`）。
- **最大的一条**：`skipLibCheck: true` 不只跳过 node_modules，它会跳过程序里**所有** `.d.ts`，包括我们自己写的 `env.d.ts` / `shims-vue.d.ts`。实测在 `.d.ts` 里写 `declare const x: ThisTypeDoesNotExist;` → `tsc` exit 0 无任何输出；同一行放进 `.ts` → TS2304。这次真的被这个坑咬到过：第一版把 `*.svg` 声明进 `env.d.ts`，与 `vite/client` 的同名 ambient module 合并产生重复 `export default`（TS2300），恰好被 skipLibCheck 吞掉，表现为 JSX 属性莫名不认、改 tsconfig 都没用。解法是把环境声明从 `.d.ts` 改名成 `.ts`（没有任何代码 import 它们，纯声明文件，改后缀不影响运行时），这样既保留 skipLibCheck 挡三方噪音，自家的声明又照常被检查。
- `Button` 这类组件补事件 props 有个坑：**声明过的 prop 会从 `$attrs` 里被摘掉，不再走 fallthrough**，所以补 props 时必须同时在组件内部的根元素上显式绑定，否则调用方的 handler 静默失效（不报错、也不生效）。用 `@munet/ui` 的 Button + `onMouseleave` 做过正反对照：只声明不绑定 → 事件不触发；补上显式绑定 → 触发。
- 验证「事件到底有没有绑上」，可以在 `MaiChartManager/Front` 下临时放一个 `verify-btn/index.html` + `main.tsx`，用项目自己的 `vite --port 5199 --strictPort` 起 dev server（能直接解析 `@munet/ui` 的 TSX 源码），再用 `chromium --headless --no-sandbox --disable-dev-shm-usage --virtual-time-budget=10000 --dump-dom <url>` 把页面内 `dispatchEvent` 的结果写进 `<pre>` 读出来；`--dump-dom` 会等模块执行完，`--virtual-time-budget` 足够。改完记得删临时目录并 kill 掉 dev server（`pkill -f vite` 会连带杀掉自己的 shell，用 PID kill 更稳）。

## 子模块 bump 之后必须重新同步 pnpm lockfile（2026-10-09）

- 只改 `MuNET-UI` 子模块指针、不跑 `pnpm install`，会让根 `pnpm-lock.yaml` 与 `MuNET-UI/package.json` 失同步。GitHub Actions 里 `CI=true` 会让 pnpm 的 `frozen-lockfile` 默认为 true，于是 `pnpm install` 直接 `ERR_PNPM_OUTDATED_LOCKFILE` 失败——**现有的 Build Canary 也会一起挂**，不只是新加的 CI。
- 只跑 `pnpm install --no-frozen-lockfile` 还不够：pnpm 会保留旧 lockfile 里已存在的解析结果，于是 Front 的 vue 停在 3.5.32，而 MuNET-UI 的 vue 按自己的 `^3.5.38` 升到 3.5.43 —— **workspace 里出现两份 vue**。因为 `@munet/ui` 是被 Front 以源码形式消费的，tsc 会同时看到两份 Vue 类型，症状是报错里出现 `VNodeRef & VNodeRef` 这种「类型和自己交叉」的怪东西（实测 `AquaMaiConfigurator.tsx` 的 `ref={searchRef}` 报 TS2322），改代码是修不好的。看到 `X & X` 这种交叉，先怀疑依赖有重复副本，别去改业务代码。
- 正解是让 workspace 内共享包只保留一个版本：`pnpm update <pkg> --filter <成员>` 把 Front 的 specifier 抬到与 MuNET-UI **解析出同一个版本**（注意不是"specifier 数值相等"——实际是让两者的 semver 范围相交、解析器收敛到同一版）。本次抬到 vue 3.5.43 / vite 8.3.4 / unocss 66.10.5 / sass 1.105.1 / typescript 6.0.3 / @vueuse/core 14.4.0 / @vitejs/plugin-vue 6.0.9 / @vitejs/plugin-vue-jsx 5.1.6。
- `pnpm update -r` 会连子模块里的 `MuNET-UI/package.json` 一起改，用 `--filter mcm-frontend` 可以只动 Front。
- 光靠 `pnpm update` 还不够：pnpm 会保留 lockfile 里已有的解析结果，所以像 `@vitejs/plugin-vue-jsx` 这种两边范围本来不相交的包会留下两份。收尾要跑一次 `pnpm dedupe`，然后逐包断言 `packages:` 段里只剩一个版本（`@babel/*` 之类被顺带清掉的重复也有 29 个）。
- 之后加 CI 时又发现两个覆盖盲区，都不是这次改动引入的，但要知道：① `pnpm typecheck` 只跑 `tsc`，不跑 `vite build`，而 `build.yml` 只在 push 到 main 触发、不在 PR 触发，所以 PR 可以类型全绿却把打包弄挂，要等合并后才由 Build Canary 暴露；② `pnpm -r run typecheck` 只会跑**定义了 typecheck 脚本**的成员，新增 workspace 成员时漏写脚本会静默跳过（日志里的 `Scope: N of M workspace projects` 不反映谁有脚本），没有任何内置开关能让它报错。
- `.vue` 的类型检查盲区是整个 workspace 的：Front 1 个 + MuNET-UI 2 个，共 3 个 `.vue` 组件没人检查（plain tsc 不解析 `.vue`，MuNET-UI tsconfig 里 `src/**/*.vue` 那条 include 是 no-op）。
- 判断「是不是真修好了」不能只看 lockfile：要同时确认 `install --frozen-lockfile` 通过、`pnpm typecheck` 通过、以及 `pnpm build` 仍然通过。本次 vite 从 8.0.8 跳到 8.3.4（打包器换成 rolldown），实测 build 12.1s 正常完成、只有 chunk 体积等既有警告。


## 合并 main / bump 子模块的顺序（2026-10-12）

- 顺序必须是「**先**把子模块工作区同步到新指针，**再**跑 `pnpm install`」。反过来的话 pnpm 会按**旧子模块**的
  manifest 写 lockfile；之后再把子模块 bump 上去，lockfile 里记的 specifier 就和 manifest 对不上，
  而 CI（`CI=true`）与 `typecheck.yml` 跑的都是 `pnpm install --frozen-lockfile`，会直接失败：
  `- vue (lockfile: ^3.5.32, manifest: ^3.5.38)`。补跑一次不带 `--frozen-lockfile` 的 install 即可，
  正常情况下只会改 specifier、不改解析出的版本。
- 光 `git submodule update` 把指针切过去还不够，工作区得真的检出到新提交；`git submodule status` 里
  带 `+` 前缀就说明记录与实际不一致，这时 lockfile 也可能是错的。

## AquaMai 配置编辑器网页版（2026-10-13）

- 独立网页版（`AquaMai.Config.Editor/src/web`）不需要 dotnet 后端：`pnpm build` 后的 `dist/` 就是全部产物
  （`dist/` 已被 gitignore），`python3 -m http.server` 起个静态服务就能测。WASM 运行时是构建时就打进去的，
  页面首屏会拉十几个 MB 的 `_framework`，本地很快，别被 `wait_for_selector` 的默认超时坑到，给到 120s。
- 联网拉 CI 版 AquaMai 的路径可以离线复现：`page.route` 把 COS 的 `**/aquamai.json` 和 Cloudflare 的
  `**/api/config` 都 fulfill 成一份只指向本地 DLL 的版本数组，DLL 本身用
  `route.fulfill(path=...)` 读 `Projects/MuNET/AquaMai/Output/AquaMai.dll`。这样空状态能进到「内核已加载」，
  而不是卡在下载失败的错误态。注意非宿主路径对签名只记录不拦截，随便一个 AquaMai.dll 都能用来跑界面。
- 想测 `<input type=file>` 回退和下载分支，得在 `add_init_script` 里
  `delete window.showOpenFilePicker; delete window.showSaveFilePicker;`——Chromium 有这两个 API，
  不删就走 picker，而 picker 是没法用 `setInputFiles` 驱动的。
- 拖放用 `page.evaluate_handle` 造 `DataTransfer` + `new File(...)`，再
  `page.dispatch_event("#app > div", "drop", {"dataTransfer": dt})`，能完整走到 drop 逻辑（`types` 里会有
  `Files`，`getAsFile()` 拿得到名字）。**File 内容要传 str 或 base64 在页面里解码**：直接传 Python `bytes`
  会被序列化成数字数组，File 里就不是原字节——我因此误判过一次「拖真 DLL 没生效」，其实是测试脚本的锅。
- playwright-python 1.63 自带的 chromium 版本与 `~/.cache/ms-playwright` 里缓存的（1161/1223/1234）对不上，
  `launch()` 直接报 `chromium_headless_shell-1243` 不存在，又不想改用户 cache，就用
  `p.chromium.launch(executable_path="/usr/bin/chromium", args=["--no-sandbox"])` 借系统 chromium。
- 页面主题是写死的 `DynamicLight`（`src/web/main.tsx` 无条件覆盖 `selectedThemeName`），所以这条路径截不到
  暗色主题。跨主题安全的颜色要么用主题给的变量（`--link-color`、`--modal-backdrop-bg`、`--modal-button-bg`），
  要么用 `color-mix(in oklab, currentColor N%, transparent)`；**别用裸 `oklch(... var(--hue))`**，
  它在暗色主题下是浅色。另：`bg-[var(--x)]/12` 的透明度修饰符对 CSS 变量无效（UnoCSS 直接丢掉透明度），
  要透明就用 `bg-[color-mix(in_oklab,var(--x)_12%,transparent)]`。
- UnoCSS 的**裸数字类名是间距倍数**：`lh-1.8` 编译成 `line-height:.45rem`，多行文字会叠在一起，
  必须写 `lh-1.8em`。怀疑某个类没生效时，最快的验证是
  `createGenerator(unoConfig).generate('...')`（临时脚本放编辑器目录里才解析得到 `unocss`），
  或者直接在 `dist/assets/*.css` 里 grep 目标类。
- 走宿主模式（注入 `window.aquaMaiEditorHost`）时，`loadDll` 给的 DLL 是**硬校验签名**的：
  非宿主路径只把结果记进 `signature`，宿主路径 `status !== 'valid'` 直接抛错、页面停在空状态。
  所以要跑宿主模式的 E2E 得用真签名的 DLL（`Projects/MuNET/AquaMai/Output/AquaMai.dll` 末尾就带
  `AquaMaiSig` 块，keyId 2，能用），随手拿个别的文件会得到「宿主提供的 AquaMai DLL 签名无效：未找到签名」（签名状态现在是本地化文案，不再是 `not_found` 这样的机器码）。
- 宿主的 `loadDll` 里别把字节从 Python 传进来：让页面自己 `fetch` 一个用 `page.route` fulfill 的 URL，
  在页面里转 base64 再返回，和拖放那次踩的是同一个序列化坑。
- 缩放顶栏这类布局开关，别只断言元素在不在。`hideToolbar: true` 时 `AquaMaiConfigurator` 的网格
  `y` 应该等于根节点 padding（8px）、对照组是 89px；顺便确认异常情况下错误条还在（它不是顶栏的一部分）。
- 想读 MCM dev server 里**合并后**的 i18n messages，别走 `$i18n`：globalInjection 注入的那个对象上既没有
  `t` 也没有 `getLocaleMessage`（`i18n.t is not a function`）。用 dev server 的模块图直接
  `await import('/src/locales/index.ts')` 拿默认导出的 i18n 实例，再 `i18n.global.getLocaleMessage(loc)`。
- 改 `AquaMai.Config.Editor/src/locales/*.yaml` 后**一定要真的构建一次**（`pnpm build`）。
  英文文案里出现 `: `（半角冒号加空格）时是非法裸标量，vite 的 yaml 插件会直接让构建挂掉，
  `tsc` 完全查不出来。要么整条加引号，要么用全角冒号。
- 手动改前端代码后想知道 i18n 有没有漏键，用脚本抽 `t('...')` 字面量和三份 yaml 的扁平键集比对
  （`mod.soundChannel.` 这种动态拼接的会误报，忽略即可），比在界面上翻一遍快得多。
- 测「dirty 时换配置内核」这条流程（`/tmp/mcm_e2e/kernel_switch.py`）时踩到几处断言坑，都不是页面的问题：
  - **别用 `get_by_text` 找状态栏里的文案**。`showTransactionalDialog` 是全局单例，弹窗关掉之后 DOM 还在（v-show），
    里面那句「…未保存的修改…」会让 `get_by_text('未保存').count()` 永远大于 0。认未保存标记要用 `span.c-orange-6`。
  - 找内核版本也别用文本：`AquaMai 配置编辑器`（标题）和 `AquaMai 1.9.23.0`（徽章）只差一个 `\S+`，
    用 `^AquaMai \d` 这种带数字的正则，或者认徽章里的 `memory-alt` 图标。空状态里根本没有徽章，那行是 kernelText。
  - 换内核的状态栏会先变「已加载 AquaMai x」（setDll）再变「配置版本 y」（重新解析写回），中间那一下**不保证轮询得到**
    （Vue 批量更新 + WASM 解析很快）。别等瞬时态，轮询终态：徽章变了 **且** 状态栏是「配置版本」。
  - 拿开关当「脏」的素材时，`input[type=checkbox]` 的第一个是**分区的开关**，改它会把它下面的条目整个收起来、
    DOM 重排；而且 `CheckBox` 的 input 自带 `title=""`，`closest('[title]')` 会命中它自己。要先向上找**非空** title
    拿到分区 / 条目路径，再用 `[title="<path>"] input[type=checkbox]` 把它钉住。
  - 点「保存并切换」之后重新解析出来的应该是**保存过**的那份，所以用户改动还在；点「不保存」才会回到文件里的值。
    这两个方向的断言别写反。
  - 静态服务别固定用同一个端口：`TCPServer` 关掉后 8791 上留一堆 TIME-WAIT，下一轮 `bind` 直接 EADDRINUSE
    （设了 `allow_reuse_address` 也没救回来），换个端口最省事。另外 `pkill -f kernel_switch.py` 会连自己一起杀（退出码 144）。
- 合成的 `DragEvent` 偶尔会**不带 `dataTransfer.types`**，这时页面的 `hasFiles()` 会（正确地）把这个拖放当成非文件拖放忽略掉，
  表现为「拖了但什么都没发生、错误条也是空的」。这类失败重拖一次就好，别去页面里找 bug；反过来，
  如果你看到「拖了没反应」，先确认是测试脚本的问题。
- 断言自定义面板（`sectionPanelOverride` / `overrides`）时注意两点：
  - 分区**根节点没有 `title`**，带 `title` 的是里面那一行表头（分区名 + 开关 + 注释）。
    要拿根节点得 `xpath=//*[@title="<分区 path>"]/..`。
  - `ENTRY_GROUP_PADDING`（`.p-l-15`）不能用来判断「配置项被面板顶掉了没」：键位、音量路由
    这些面板自己也用它排条目行。要挑一个**面板不复用这个类**的分区来验证 override。
- `GameSystem.MaimollerIO` 排版里 `P1` / `P2`（整侧开关）那两个 `has()` 判断是给老内核留的：
  现在这版 AquaMai 里根本没有这两个条目，只有 Touch1p / Button1p / Led1p 加 2P 那三件套。
  写断言时别指望那两行一定渲染出来，分组行的标签是 `1P` / `2P`（ENTRY_LABEL_CLASS 的 div）。
