using System.Text.Json;
using System.Text.Json.Serialization;
using AquaMai.Config.Dto;
using AquaMai.Config.HeadlessLoader;
using AquaMai.Config.Interfaces;
using MaiChartManager.Utils;
using Microsoft.AspNetCore.Mvc;
using Mono.Cecil;

namespace MaiChartManager.Controllers.Mod;

[ApiController]
[Route("MaiChartManagerServlet/[action]Api")]
public class ConfigurationController : ControllerBase
{
    private readonly StaticSettings settings;
    private readonly ILogger<ConfigurationController> logger;
    private readonly ModConfigService modConfigService;

    public ConfigurationController(StaticSettings settings, ILogger<ConfigurationController> logger, ModConfigService modConfigService)
    {
        this.settings = settings;
        this.logger = logger;
        this.modConfigService = modConfigService;
    }

    [HttpGet]
    public async Task<AquaMaiConfigDto.ConfigDto> GetAquaMaiConfig(bool forceDefault = false, bool skipSignatureCheck = false)
    {
        var dllPath = await modConfigService.GetAquaMaiDllPath();
        var configSortYaml = ReadConfigSortYaml(dllPath);
        var shouldSkipSignatureCheck = skipSignatureCheck || !string.Equals(dllPath, ModPaths.AquaMaiDllInstalledPath, StringComparison.OrdinalIgnoreCase);
        var config = await modConfigService.GetCurrentAquaMaiConfig(forceDefault, shouldSkipSignatureCheck);
        return AquaMaiConfigDto.From(config, configSortYaml);
    }

    [HttpPut]
    public async Task SetAquaMaiConfig(AquaMaiConfigDto.ConfigSave config)
    {
        var dllPath = await modConfigService.GetAquaMaiDllPath();
        var jsonOptions = new JsonSerializerOptions();
        jsonOptions.Converters.Add(new JsonStringEnumConverter());

        var configInterface = HeadlessConfigLoader.LoadFromPacked(dllPath);
        modConfigService.CheckConfigApiVersion(configInterface);
        var configEdit = configInterface.CreateConfig();

        foreach (var section in configEdit.ReflectionManager.Sections)
        {
            var newState = config.SectionStates[section.Path];
            var oldState = configEdit.GetSectionState(section);
            if (newState.Enabled != oldState.Enabled)
                configEdit.SetSectionEnabled(section, newState.Enabled);

            // 看起来现在如果禁用了 section 并且改了选项，选项会被写到上一个 section 里面
            // 两个 section 有名字一样的选项怕不是会出问题
            if (!newState.Enabled) continue;

            foreach (var entry in section.Entries)
            {
                var newEntryState = config.EntryStates[entry.Path];
                var oldEntryState = configEdit.GetEntryState(entry);
                var newEntryValue = newEntryState.Value.Deserialize(entry.Field.FieldType, jsonOptions);
                if (!oldEntryState.Value.Equals(newEntryValue))
                {
                    configEdit.SetEntryValue(entry, newEntryValue);
                }
                else if (!newEntryState.IsDefault)
                {
                    configEdit.SetEntryValue(entry, newEntryValue);
                }
            }
        }

        modConfigService.SyncExclusiveFullscreenCompatFlag(configEdit);

        var serializer = configInterface.CreateConfigSerializer(new IConfigSerializer.Options()
        {
            Lang = StaticSettings.CurrentLocale.StartsWith("zh") ? "zh" : "en",
            IncludeBanner = true,
        });
        var serializedConfig = serializer.Serialize(configEdit);

        if (System.IO.File.Exists(ModPaths.AquaMaiConfigPath))
        {
            var originalContent = await System.IO.File.ReadAllTextAsync(ModPaths.AquaMaiConfigPath);
            if (originalContent == serializedConfig)
            {
                // 没改动就不写了
                return;
            }
            Directory.CreateDirectory(ModPaths.AquaMaiConfigBackupDirPath);
            var backupPath = Path.Combine(ModPaths.AquaMaiConfigBackupDirPath, $"{DateTime.Now:yyyy-MM-dd_HH-mm-ss}.toml");
            await System.IO.File.WriteAllTextAsync(backupPath, originalContent);
        }

        await System.IO.File.WriteAllTextAsync(Path.Combine(StaticSettings.GamePath, "AquaMai.toml"), serializer.Serialize(configEdit));
        StaticSettings.UpdateAssetPathsFromAquaMaiConfig(configEdit);
        // 可能修改了歌曲封面目录
        settings.ScanMusicList();
    }

    /// <summary>
    /// 读 AquaMai.dll 里嵌入的 configSort.yaml 原文，交给前端解析（和 WASM 那条路保持一致）。
    /// </summary>
    private static string? ReadConfigSortYaml(string dllPath)
    {
        using var stream = new FileStream(dllPath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
        var asm = ModuleDefinition.ReadModule(stream);
        var configSortRes = asm.Resources.FirstOrDefault(it => it is EmbeddedResource { Name: "configSort.yaml.compressed" } or EmbeddedResource { Name: "configSort.yaml" });
        if (configSortRes is null)
        {
            return null;
        }

        var (_, res) = ResourceLoader.LoadResource(configSortRes);
        using (res)
        using (var reader = new StreamReader(res))
        {
            return reader.ReadToEnd();
        }
    }
}
