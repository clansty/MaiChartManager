#!/usr/bin/env pwsh

$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot

# dotnet publish 不会删除上一轮 _framework 里带旧哈希的产物，而编辑器的 import.meta.glob
# 会把整个 _framework 打包进去，所以先清干净
Remove-Item -Recurse -Force "./AquaMai.Config.Wasm/bin", "./AquaMai.Config.Wasm/obj" -ErrorAction SilentlyContinue
dotnet publish "./AquaMai.Config.Wasm/AquaMai.Config.Wasm.csproj" -c Release
Push-Location "./AquaMai.Config.Editor"
try {
    pnpm install
    pnpm typecheck
    pnpm build
}
finally {
    Pop-Location
}
