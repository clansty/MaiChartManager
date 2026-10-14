using System.Runtime.InteropServices.JavaScript;
using System.Runtime.Versioning;
using System.Text.Json;
using System.Text.Json.Serialization;
using AquaMai.Config.HeadlessLoader;
using AquaMai.Config.Interfaces;
using AquaMai.Config.Dto;
using Mono.Cecil;

namespace AquaMai.Config.Wasm;

[SupportedOSPlatform("browser")]
public static partial class MainClass
{
    private const string SupportedConfigApiVersion = "1.1";

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        Converters = { new JsonStringEnumConverter() }
    };

    [JSExport]
    public static string GetModVersion(byte[] assemblyBytes)
    {
        try
        {
            using var stream = new MemoryStream(assemblyBytes);
            using var assembly = AssemblyDefinition.ReadAssembly(stream);
            return JsonSerializer.Serialize(new
            {
                success = true,
                // 程序集名要返回给前端：光看版本号认不出「这不是 AquaMai」
                name = assembly.Name.Name,
                version = assembly.Name.Version?.ToString() ?? ""
            }, JsonOptions);
        }
        catch (Exception error)
        {
            return Error("获取 AquaMai 版本失败", error);
        }
    }

    [JSExport]
    public static string ParseConfig(byte[] assemblyBytes, string configString)
    {
        try
        {
            var configInterface = HeadlessConfigLoader.LoadFromPacked(assemblyBytes);
            CheckConfigApiVersion(configInterface);

            var config = configInterface.CreateConfig();
            var migrationManager = configInterface.GetConfigMigrationManager();
            var originalVersion = "";
            var latestVersion = migrationManager.LatestVersion;

            if (!string.IsNullOrWhiteSpace(configString))
            {
                var view = configInterface.CreateConfigView(configString);
                originalVersion = migrationManager.GetVersion(view);

                if (originalVersion != latestVersion)
                {
                    view = migrationManager.Migrate(view);
                }

                configInterface.GetConfigParser().Parse(config, view);
            }

            var result = new AquaMaiConfigDto.ParseResult(
                true,
                null,
                AquaMaiConfigDto.From(config, ReadConfigSortYaml(assemblyBytes)),
                configInterface.ApiVersion,
                ReadModVersion(assemblyBytes),
                originalVersion,
                latestVersion);

            return JsonSerializer.Serialize(result, JsonOptions);
        }
        catch (Exception error)
        {
            return Error("解析 AquaMai 配置失败", error);
        }
    }

    [JSExport]
    public static string SerializeConfig(byte[] assemblyBytes, string configJson, string lang)
    {
        try
        {
            var save = JsonSerializer.Deserialize<AquaMaiConfigDto.ConfigSave>(configJson, JsonOptions)
                ?? throw new InvalidOperationException("配置数据为空");

            var configInterface = HeadlessConfigLoader.LoadFromPacked(assemblyBytes);
            CheckConfigApiVersion(configInterface);
            var config = configInterface.CreateConfig();

            foreach (var section in config.ReflectionManager.Sections)
            {
                if (!save.SectionStates.TryGetValue(section.Path, out var newState))
                {
                    continue;
                }

                var oldState = config.GetSectionState(section);
                if (newState.Enabled != oldState.Enabled)
                {
                    config.SetSectionEnabled(section, newState.Enabled);
                }

                if (!newState.Enabled)
                {
                    continue;
                }

                foreach (var entry in section.Entries)
                {
                    if (!save.EntryStates.TryGetValue(entry.Path, out var newEntryState))
                    {
                        continue;
                    }

                    var oldEntryState = config.GetEntryState(entry);
                    var newValue = newEntryState.Value.Deserialize(entry.Field.FieldType, JsonOptions)
                        ?? throw new InvalidOperationException($"配置项 {entry.Path} 的值不能为空");

                    if (!oldEntryState.Value.Equals(newValue) || !newEntryState.IsDefault)
                    {
                        config.SetEntryValue(entry, newValue);
                    }
                }
            }

            var serializer = configInterface.CreateConfigSerializer(new IConfigSerializer.Options
            {
                Lang = lang == "en" ? "en" : "zh",
                IncludeBanner = true
            });

            var result = new AquaMaiConfigDto.SerializeResult(
                true,
                null,
                serializer.Serialize(config),
                configInterface.GetConfigMigrationManager().LatestVersion);

            return JsonSerializer.Serialize(result, JsonOptions);
        }
        catch (Exception error)
        {
            return Error("序列化 AquaMai 配置失败", error);
        }
    }

    private static string ReadModVersion(byte[] assemblyBytes)
    {
        using var stream = new MemoryStream(assemblyBytes);
        using var assembly = AssemblyDefinition.ReadAssembly(stream);
        return assembly.Name.Version?.ToString() ?? "";
    }

    private static string? ReadConfigSortYaml(byte[] assemblyBytes)
    {
        using var stream = new MemoryStream(assemblyBytes);
        using var assembly = AssemblyDefinition.ReadAssembly(stream);
        var resource = assembly.MainModule.Resources.FirstOrDefault(
            item => item.Name is "configSort.yaml" or "configSort.yaml.compressed");

        if (resource is null)
        {
            return null;
        }

        var (_, resourceStream) = ResourceLoader.LoadResource(resource);
        using (resourceStream)
        using (var reader = new StreamReader(resourceStream))
        {
            return reader.ReadToEnd();
        }
    }

    private static void CheckConfigApiVersion(HeadlessConfigInterface configInterface)
    {
        var supported = new Version(SupportedConfigApiVersion);
        var current = new Version(configInterface.ApiVersion);

        if (supported.Major != current.Major || supported.Minor > current.Minor)
        {
            throw new InvalidOperationException($"不支持的 AquaMai 配置 API 版本: {current}");
        }
    }

    private static string Error(string prefix, Exception error) =>
        JsonSerializer.Serialize(new
        {
            success = false,
            errorMessage = $"{prefix}: {error.Message}"
        }, JsonOptions);
}
