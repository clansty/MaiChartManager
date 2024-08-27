using System.IO.Compression;
using System.Windows.Forms;
using Microsoft.AspNetCore.Mvc;
using Tomlet;

namespace MaiChartManager.Controllers;

[ApiController]
[Route("MaiChartManagerServlet/[action]Api")]
public class ModController(StaticSettings settings, ILogger<StaticSettings> logger) : ControllerBase
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

    [HttpGet]
    public AquaMai.Config GetAquaMaiConfig()
    {
        var path = Path.Combine(StaticSettings.GamePath, "AquaMai.toml");
        return System.IO.File.Exists(path) ? TomletMain.To<AquaMai.Config>(System.IO.File.ReadAllText(path)) : new AquaMai.Config();
    }

    [HttpPut]
    public void SetAquaMaiConfig(AquaMai.Config config)
    {
        System.IO.File.WriteAllText(Path.Combine(StaticSettings.GamePath, "AquaMai.toml"), TomletMain.DocumentFrom(config).SerializedValue);
    }

    [HttpPost]
    public void InstallMelonLoader()
    {
        if (IsMelonInstalled())
        {
            logger.LogInformation("MelonLoader is already installed.");
            return;
        }

        var zipFile = Path.Combine(Path.GetDirectoryName(Application.ExecutablePath), @"AquaMai\MelonLoader.x64.zip");
        var zip = ZipFile.OpenRead(zipFile);
        foreach (var entry in zip.Entries)
        {
            if (entry.Name == "NOTICE.txt")
                continue;
            if (entry.FullName.EndsWith('/'))
            {
                Directory.CreateDirectory(Path.Combine(StaticSettings.GamePath, entry.FullName));
                continue;
            }

            entry.ExtractToFile(Path.Combine(StaticSettings.GamePath, entry.FullName), true);
        }
    }

    [HttpPost]
    public void InstallAquaMai()
    {
        var version = "145";
        if (settings.gameVersion < 45)
        {
            version = "140";
        }

        var src = Path.Combine(Path.GetDirectoryName(Application.ExecutablePath), "AquaMai", version, "AquaMai.dll");
        var dest = Path.Combine(StaticSettings.GamePath, @"Mods\AquaMai.dll");
        Directory.CreateDirectory(Path.GetDirectoryName(dest));
        System.IO.File.Copy(src, dest, true);
    }
}
