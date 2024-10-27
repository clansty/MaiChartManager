using System.IO.Compression;
using System.Reflection;
using AquaMai;
using AquaMai.Attributes;
using Microsoft.AspNetCore.Mvc;
using Tomlet;
using Tomlet.Models;

namespace MaiChartManager.Controllers;

[ApiController]
[Route("MaiChartManagerServlet/[action]Api")]
public class ModController(StaticSettings settings, ILogger<ModController> logger) : ControllerBase
{
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
        return System.IO.File.Exists(Path.Combine(StaticSettings.GamePath, @"Mods\AquaMai.dll"));
    }

    public record GameModInfo(bool MelonLoaderInstalled, bool AquaMaiInstalled, string AquaMaiVersion, string BundledAquaMaiVersion);

    [HttpGet]
    public GameModInfo GetGameModInfo()
    {
        var aquaMaiInstalled = IsAquaMaiInstalled();
        var aquaMaiVersion = "N/A";
        if (aquaMaiInstalled)
        {
            aquaMaiVersion = System.Diagnostics.FileVersionInfo.GetVersionInfo(Path.Combine(StaticSettings.GamePath, @"Mods\AquaMai.dll")).ProductVersion ?? "N/A";
        }

        return new GameModInfo(IsMelonInstalled(), aquaMaiInstalled, aquaMaiVersion, AquaMai.BuildInfo.Version);
    }

    public record AquaMaiConfigAndComments(AquaMai.Config Config, Dictionary<string, Dictionary<string, string>> Comments);

    [HttpGet]
    public AquaMaiConfigAndComments GetAquaMaiConfig()
    {
        var path = Path.Combine(StaticSettings.GamePath, "AquaMai.toml");
        var config = System.IO.File.Exists(path)
            ? TomletMain.To<AquaMai.Config>(System.IO.File.ReadAllText(path))
            : new AquaMai.Config();
        var comments = new Dictionary<string, Dictionary<string, string>>();
        var sections = new Dictionary<string, string>();
        foreach (var property in typeof(AquaMai.Config).GetProperties())
        {
            var comment = property.GetCustomAttribute<ConfigCommentAttribute>();
            if (comment == null) continue;
            sections[property.Name] = comment.CommentZh;
            var subComments = new Dictionary<string, string>();

            foreach (var subProp in property.PropertyType.GetProperties())
            {
                var subComment = subProp.GetCustomAttribute<ConfigCommentAttribute>();
                if (subComment == null) continue;
                subComments[subProp.Name] = subComment.CommentZh;
            }

            comments[property.Name] = subComments;
        }

        comments["sections"] = sections;
        return new AquaMaiConfigAndComments(config, comments);
    }

    [HttpPut]
    public void SetAquaMaiConfig(AquaMai.Config config)
    {
        System.IO.File.WriteAllText(Path.Combine(StaticSettings.GamePath, "AquaMai.toml"), ConfigGenerator.SerializeConfigWithComments(config, "zh"));
    }

    [HttpPost]
    public void InstallMelonLoader()
    {
        if (IsMelonInstalled())
        {
            logger.LogInformation("MelonLoader is already installed.");
            return;
        }

        using var s = Assembly.GetExecutingAssembly().GetManifestResourceStream("MaiChartManager.Resources.MelonLoader.x64.zip")!;
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
