# AquaMai.Config.Wasm

浏览器内运行的 AquaMai 配置解析、迁移和序列化桥。

## API

- `ParseConfig(byte[] assemblyBytes, string toml)`：加载 `AquaMai.dll` 内嵌配置程序集，返回结构化配置 JSON。
- `SerializeConfig(byte[] assemblyBytes, string configJson, string lang)`：根据编辑后的状态生成 `AquaMai.toml`。
- `GetModVersion(byte[] assemblyBytes)`：从程序集元数据读取 AquaMai 版本。

## 构建

```bash
dotnet publish AquaMai.Config.Wasm/AquaMai.Config.Wasm.csproj -c Release
```

产物位于 `AquaMai.Config.Wasm/bin/Release/net9.0/publish/wwwroot/_framework/`。
