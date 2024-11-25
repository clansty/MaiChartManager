using System.IO.Compression;
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

    [HttpGet]
    public AquaMaiConfigDto.ConfigDto GetAquaMaiConfig()
    {
        if (!IsAquaMaiInstalled())
        {
            throw new InvalidOperationException("AquaMai 没有安装");
        }

        var configInterface = HeadlessConfigLoader.LoadFromPacked(AquaMaiDllInstalledPath);
        var view = configInterface.CreateConfigView(System.IO.File.ReadAllText(AquaMaiConfigPath));
        var migrationManager = configInterface.GetConfigMigrationManager();

        if (migrationManager.GetVersion(view) != migrationManager.LatestVersion)
        {
            view = migrationManager.Migrate(view);
        }

        var parser = configInterface.GetConfigParser();
        var config = configInterface.CreateConfig();
        parser.Parse(config, view);

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
        // var configInterface = HeadlessConfigLoader.LoadFromPacked(AquaMaiDllInstalledPath);
        // var serializer = configInterface.CreateConfigSerializer(new IConfigSerializer.Options()
        // {
        //     Lang = "zh",
        //     IncludeBanner = true
        // });
        // System.IO.File.WriteAllText(Path.Combine(StaticSettings.GamePath, "AquaMai.toml"), serializer.Serialize(config));
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