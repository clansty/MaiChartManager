using System.IO.Compression;
using System.Text.Json;
using System.Text.Json.Serialization;
using AquaMai.Config.HeadlessLoader;
using AquaMai.Config.Interfaces;
using MaiChartManager.Models;
using Microsoft.AspNetCore.Mvc;

namespace MaiChartManager.Controllers;

[ApiController]
[Route("MaiChartManagerServlet/[action]Api")]
public class ModController(StaticSettings settings, ILogger<ModController> logger) : ControllerBase
{
    private static string judgeDisplay4BPath = Path.Combine(StaticSettings.exeDir, "Resources", "JudgeDisplay4B");

    [HttpGet]
    public bool IsMelonInstalled()
    {
        return System.IO.File.Exists(Path.Combine(StaticSettings.GamePath, "dobby.dll"))
               && System.IO.File.Exists(Path.Combine(StaticSettings.GamePath, "version.dll"))
               && Directory.Exists(Path.Combine(StaticSettings.GamePath, "MelonLoader"));
    }

    [HttpGet]
    public bool IsAquaMaiInstalled()
    {
        return System.IO.File.Exists(AquaMaiDllInstalledPath);
    }

    public record GameModInfo(bool MelonLoaderInstalled, bool AquaMaiInstalled, string AquaMaiVersion, string BundledAquaMaiVersion, bool IsJudgeDisplay4BInstalled);

    private static string AquaMaiConfigPath => Path.Combine(StaticSettings.GamePath, "AquaMai.toml");
    private static string AquaMaiConfigBackupDirPath => Path.Combine(StaticSettings.GamePath, "AquaMai.toml.bak");
    private static string AquaMaiDllInstalledPath => Path.Combine(StaticSettings.GamePath, @"Mods\AquaMai.dll");
    private static string AquaMaiDllBuiltinPath => Path.Combine(StaticSettings.exeDir, "AquaMai.dll");
    private static string SkinPath => Path.Combine(StaticSettings.GamePath, "LocalAssets", "Skins");

    [HttpGet]
    public GameModInfo GetGameModInfo()
    {
        var aquaMaiInstalled = IsAquaMaiInstalled();
        var aquaMaiVersion = "N/A";
        if (aquaMaiInstalled)
        {
            aquaMaiVersion = System.Diagnostics.FileVersionInfo.GetVersionInfo(AquaMaiDllInstalledPath).ProductVersion ?? "N/A";
        }

        var aquaMaiBuiltinVersion = System.Diagnostics.FileVersionInfo.GetVersionInfo(AquaMaiDllBuiltinPath).ProductVersion;

        return new GameModInfo(IsMelonInstalled(), aquaMaiInstalled, aquaMaiVersion, aquaMaiBuiltinVersion!, GetIsJudgeDisplay4BInstalled());
    }

    [NonAction]
    private static bool GetIsJudgeDisplay4BInstalled()
    {
        if (!Directory.Exists(SkinPath)) return false;

        var filesShouldBeInstalled = Directory.EnumerateFiles(judgeDisplay4BPath);
        return filesShouldBeInstalled.Select(file => Path.Combine(SkinPath, Path.GetFileName(file))).All(System.IO.File.Exists);
    }

    [HttpPost]
    public void InstallJudgeDisplay4B()
    {
        Directory.CreateDirectory(SkinPath);

        foreach (var file in Directory.EnumerateFiles(judgeDisplay4BPath))
        {
            System.IO.File.Copy(file, Path.Combine(SkinPath, Path.GetFileName(file)), true);
        }
    }

    public class UnsupportedConfigApiVersionException() : Exception("无法兼容的配置文件版本");

    public class AquaMaiNotInstalledException() : Exception("AquaMai 没有安装");

    [NonAction]
    private static void CheckConfigApiVersion(HeadlessConfigInterface configInterface)
    {
        var currentSupportedApiVersion = new Version(1, 0);
        var configApiVersion = new Version(configInterface.ApiVersion);
        if (currentSupportedApiVersion.Major != configApiVersion.Major)
        {
            throw new UnsupportedConfigApiVersionException();
        }

        if (currentSupportedApiVersion.Minor > configApiVersion.Minor)
        {
            throw new UnsupportedConfigApiVersionException();
        }
    }

    [HttpGet]
    public AquaMaiConfigDto.ConfigDto GetAquaMaiConfig()
    {
        if (!IsAquaMaiInstalled())
        {
            throw new AquaMaiNotInstalledException();
        }

        var configInterface = HeadlessConfigLoader.LoadFromPacked(AquaMaiDllInstalledPath);
        CheckConfigApiVersion(configInterface);
        var view = configInterface.CreateConfigView(System.IO.File.ReadAllText(AquaMaiConfigPath));
        var migrationManager = configInterface.GetConfigMigrationManager();

        if (migrationManager.GetVersion(view) != migrationManager.LatestVersion)
        {
            logger.LogInformation("Migrating AquaMai config from {0} to {1}", migrationManager.GetVersion(view), migrationManager.LatestVersion);
            view = migrationManager.Migrate(view);
        }

        var parser = configInterface.GetConfigParser();
        var config = configInterface.CreateConfig();

        // 未解之谜
        // logger.LogInformation("{}", lockCredits.GetType());
        // var type = typeof(ModController).GetField("lockCredits", BindingFlags.NonPublic | BindingFlags.Static).GetValue(null);
        // logger.LogInformation("{}", type.GetType());
        // logger.LogInformation("{}", AquaMaiDllInstalledPath);
        // logger.LogInformation("{}", config.GetEntryState(config.ReflectionManager.Entries.First(it => it.Path == "GameSettings.CreditConfig.LockCredits")).DefaultValue.GetType());
        // logger.LogInformation("{}", config.GetEntryState(config.ReflectionManager.Entries.First(it => it.Path == "GameSettings.CreditConfig.LockCredits")).Value.GetType());
        // logger.LogInformation("{}", config.ReflectionManager.Entries.First(it => it.Path == "GameSettings.CreditConfig.LockCredits").Field.FieldType);
        //
        parser.Parse(config, view);
        // logger.LogInformation("{}", config.GetEntryState(config.ReflectionManager.Entries.First(it => it.Path == "GameSettings.CreditConfig.LockCredits")).Value.GetType());
        // logger.LogInformation("{}", config.ReflectionManager.Entries.First(it => it.Path == "GameSettings.CreditConfig.LockCredits").Field.FieldType);

        return new AquaMaiConfigDto.ConfigDto(
            config.ReflectionManager.Sections.Select(section =>
            {
                var entries = section.Entries.Select(entry => new AquaMaiConfigDto.Entry(entry.Path, entry.Name, entry.Attribute, entry.Field.FieldType.FullName ?? entry.Field.FieldType.Name));
                return new AquaMaiConfigDto.Section(section.Path, entries, section.Attribute);
            }),
            config.ReflectionManager.Sections.ToDictionary(section => section.Path, section => config.GetSectionState(section)),
            config.ReflectionManager.Entries.ToDictionary(entry => entry.Path, entry => config.GetEntryState(entry))
        );
    }

    [HttpPut]
    public void SetAquaMaiConfig(AquaMaiConfigDto.ConfigSaveDto config)
    {
        var jsonOptions = new JsonSerializerOptions();
        jsonOptions.Converters.Add(new JsonStringEnumConverter());

        var configInterface = HeadlessConfigLoader.LoadFromPacked(AquaMaiDllInstalledPath);
        CheckConfigApiVersion(configInterface);
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
                    logger.LogInformation("Not same: {Path}, {type1}, {newEntryValue}, {type2}, {oldEntryState}", entry.Path, newEntryValue?.GetType(), newEntryValue, oldEntryState.Value?.GetType(), oldEntryState.Value);
                    configEdit.SetEntryValue(entry, newEntryValue);
                }
                else if (!newEntryState.IsDefault)
                {
                    logger.LogInformation("Not default: {Path}", entry.Path);
                    configEdit.SetEntryValue(entry, newEntryValue);
                }
            }
        }

        var serializer = configInterface.CreateConfigSerializer(new IConfigSerializer.Options()
        {
            Lang = "zh",
            IncludeBanner = true
        });

        if (System.IO.File.Exists(AquaMaiConfigPath))
        {
            Directory.CreateDirectory(AquaMaiConfigBackupDirPath);
            System.IO.File.Move(AquaMaiConfigPath, Path.Combine(AquaMaiConfigBackupDirPath, $"{DateTime.Now:yyyy-MM-dd_HH-mm-ss}.toml"));
        }

        System.IO.File.WriteAllText(Path.Combine(StaticSettings.GamePath, "AquaMai.toml"), serializer.Serialize(configEdit));
    }

    [HttpPost]
    public void InstallMelonLoader()
    {
        if (IsMelonInstalled())
        {
            logger.LogInformation("MelonLoader is already installed.");
            return;
        }

        using var s = System.IO.File.OpenRead(Path.Combine(StaticSettings.exeDir, "MelonLoader.x64.zip"));
        var zip = new ZipArchive(s, ZipArchiveMode.Read);
        foreach (var entry in zip.Entries)
        {
            if (entry.Name == "NOTICE.txt")
                continue;

            Directory.CreateDirectory(Path.GetDirectoryName(Path.Combine(StaticSettings.GamePath, entry.FullName)));
            entry.ExtractToFile(Path.Combine(StaticSettings.GamePath, entry.FullName), true);
        }
    }

    [HttpPost]
    public void InstallAquaMai()
    {
        var src = Path.Combine(StaticSettings.exeDir, "AquaMai.dll");
        var dest = Path.Combine(StaticSettings.GamePath, @"Mods\AquaMai.dll");
        Directory.CreateDirectory(Path.GetDirectoryName(dest));
        System.IO.File.Copy(src, dest, true);
    }
}