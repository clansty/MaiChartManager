using System.IO.Compression;
using System.Text;
using MaiChartManager.Utils;
using MaiLib;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic.FileIO;
using SimaiSharp;
using Xabe.FFmpeg;

namespace MaiChartManager.Controllers.Music;

[ApiController]
[Route("MaiChartManagerServlet/[action]Api/{assetDir}/{id:int}")]
public class MusicTransferController(StaticSettings settings, ILogger<MusicTransferController> logger) : ControllerBase
{
    [HttpPost]
    public void RequestCopyTo(int id, string assetDir)
    {
        if (Program.BrowserWin is null) return;
        var dialog = new FolderBrowserDialog
        {
            Description = "请选择要复制到的另一份游戏的资源目录（Axxx）位置"
        };
        if (Program.BrowserWin.Invoke(() => dialog.ShowDialog(Program.BrowserWin)) != DialogResult.OK) return;
        var dest = dialog.SelectedPath;
        logger.LogInformation("CopyTo: {dest}", dest);

        var music = settings.GetMusic(id, assetDir);
        if (music is null) return;

        // copy music
        Directory.CreateDirectory(Path.Combine(dest, "music"));
        FileSystem.CopyDirectory(Path.GetDirectoryName(music.FilePath), Path.Combine(dest, $@"music\music{music.Id:000000}"), UIOption.OnlyErrorDialogs);

        // copy jacket
        Directory.CreateDirectory(Path.Combine(dest, @"AssetBundleImages\jacket"));
        if (music.JacketPath is not null)
        {
            FileSystem.CopyFile(music.JacketPath, Path.Combine(dest, $@"AssetBundleImages\jacket\ui_jacket_{music.NonDxId:000000}{Path.GetExtension(music.JacketPath)}"), UIOption.OnlyErrorDialogs);
        }
        else if (music.AssetBundleJacket is not null)
        {
            FileSystem.CopyFile(music.AssetBundleJacket, Path.Combine(dest, $@"AssetBundleImages\jacket\{Path.GetFileName(music.AssetBundleJacket)}"), UIOption.OnlyErrorDialogs);
            if (System.IO.File.Exists(music.AssetBundleJacket + ".manifest"))
            {
                FileSystem.CopyFile(music.AssetBundleJacket + ".manifest", Path.Combine(dest, $@"AssetBundleImages\jacket\{Path.GetFileName(music.AssetBundleJacket)}.manifest"), UIOption.OnlyErrorDialogs);
            }
        }
        else if (music.PseudoAssetBundleJacket is not null)
        {
            FileSystem.CopyFile(music.PseudoAssetBundleJacket, Path.Combine(dest, $@"AssetBundleImages\jacket\{Path.GetFileName(music.PseudoAssetBundleJacket)}"), UIOption.OnlyErrorDialogs);
        }

        // copy acbawb
        Directory.CreateDirectory(Path.Combine(dest, "SoundData"));
        if (StaticSettings.AcbAwb.TryGetValue($"music{music.NonDxId:000000}.acb", out var acb))
        {
            FileSystem.CopyFile(acb, Path.Combine(dest, $@"SoundData\music{music.NonDxId:000000}.acb"), UIOption.OnlyErrorDialogs);
        }

        if (StaticSettings.AcbAwb.TryGetValue($"music{music.NonDxId:000000}.awb", out var awb))
        {
            FileSystem.CopyFile(awb, Path.Combine(dest, $@"SoundData\music{music.NonDxId:000000}.awb"), UIOption.OnlyErrorDialogs);
        }

        // copy movie data
        if (StaticSettings.MovieDataMap.TryGetValue(music.NonDxId, out var movie))
        {
            Directory.CreateDirectory(Path.Combine(dest, "MovieData"));
            FileSystem.CopyFile(movie, Path.Combine(dest, $@"MovieData\{music.NonDxId:000000}.dat"), UIOption.OnlyErrorDialogs);
        }
    }

    [HttpGet]
    public void ExportOpt(int id, string assetDir, bool removeEvents = false)
    {
        var music = settings.GetMusic(id, assetDir);
        if (music is null) return;

        var zipStream = HttpContext.Response.BodyWriter.AsStream();
        using var zipArchive = new ZipArchive(zipStream, ZipArchiveMode.Create, leaveOpen: true);

        // copy music
        foreach (var file in Directory.EnumerateFiles(Path.GetDirectoryName(music.FilePath)))
        {
            if (Path.GetFileName(file).Equals("Music.xml", StringComparison.InvariantCultureIgnoreCase) && removeEvents)
            {
                logger.LogInformation("Remove events and rights from Music.xml");
                var xmlDoc = music.GetXmlWithoutEventsAndRights();
                var entry = zipArchive.CreateEntry($"music/music{music.Id:000000}/Music.xml");
                using var stream = entry.Open();
                xmlDoc.Save(stream);
                continue;
            }

            zipArchive.CreateEntryFromFile(file, $"music/music{music.Id:000000}/{Path.GetFileName(file)}");
        }

        // copy jacket
        if (music.JacketPath is not null)
        {
            zipArchive.CreateEntryFromFile(music.JacketPath, $"AssetBundleImages/jacket/ui_jacket_{music.NonDxId:000000}{Path.GetExtension(music.JacketPath)}");
        }
        else if (music.AssetBundleJacket is not null)
        {
            zipArchive.CreateEntryFromFile(music.AssetBundleJacket, $"AssetBundleImages/jacket/{Path.GetFileName(music.AssetBundleJacket)}");
            if (System.IO.File.Exists(music.AssetBundleJacket + ".manifest"))
            {
                zipArchive.CreateEntryFromFile(music.AssetBundleJacket + ".manifest", $"AssetBundleImages/jacket/{Path.GetFileName(music.AssetBundleJacket)}.manifest");
            }
        }
        else if (music.PseudoAssetBundleJacket is not null)
        {
            zipArchive.CreateEntryFromFile(music.PseudoAssetBundleJacket, $"AssetBundleImages/jacket/{Path.GetFileName(music.PseudoAssetBundleJacket)}");
        }

        // copy acbawb
        if (StaticSettings.AcbAwb.TryGetValue($"music{music.NonDxId:000000}.acb", out var acb))
        {
            zipArchive.CreateEntryFromFile(acb, $"SoundData/music{music.NonDxId:000000}.acb");
        }

        if (StaticSettings.AcbAwb.TryGetValue($"music{music.NonDxId:000000}.awb", out var awb))
        {
            zipArchive.CreateEntryFromFile(awb, $"SoundData/music{music.NonDxId:000000}.awb");
        }

        // copy movie data
        if (StaticSettings.MovieDataMap.TryGetValue(music.NonDxId, out var movie))
        {
            zipArchive.CreateEntryFromFile(movie, $"MovieData/{music.NonDxId:000000}.dat");
        }
    }

    private static void DeleteIfExists(params string[] path)
    {
        foreach (var p in path)
        {
            if (Directory.Exists(p))
            {
                FileSystem.DeleteDirectory(p, UIOption.OnlyErrorDialogs, RecycleOption.SendToRecycleBin);
            }

            if (System.IO.File.Exists(p))
            {
                FileSystem.DeleteFile(p, UIOption.OnlyErrorDialogs, RecycleOption.SendToRecycleBin);
            }
        }
    }

    [HttpPost]
    public void ModifyId(int id, [FromBody] int newId, string assetDir)
    {
        if (IapManager.License != IapManager.LicenseStatus.Active) return;
        var music = settings.GetMusic(id, assetDir);
        if (music is null) return;
        var newNonDxId = newId % 10000;

        var abJacketTarget = Path.Combine(assetDir, "AssetBundleImages", "jacket", $"ui_jacket_{newNonDxId:000000}.ab");
        var acbawbTarget = Path.Combine(assetDir, "SoundData", $"music{newNonDxId:000000}");
        var movieTarget = Path.Combine(assetDir, "MovieData", $"{newNonDxId:000000}.dat");
        var newMusicDir = Path.Combine(assetDir, "music", $"music{newNonDxId:000000}");
        DeleteIfExists(abJacketTarget, abJacketTarget + ".manifest", acbawbTarget + ".acb", acbawbTarget + ".awb", movieTarget, newMusicDir);

        // jacket
        if (music.JacketPath is not null)
        {
            var localJacketTarget = Path.Combine(StaticSettings.GamePath, "LocalAssets", $"{newNonDxId:000000}{Path.GetExtension(music.JacketPath)}");
            DeleteIfExists(localJacketTarget);
            FileSystem.MoveFile(music.JacketPath, localJacketTarget, UIOption.OnlyErrorDialogs);
        }
        else if (music.PseudoAssetBundleJacket is not null)
        {
            var localJacketTarget = Path.Combine(StaticSettings.GamePath, "LocalAssets", $"{newNonDxId:000000}{Path.GetExtension(music.PseudoAssetBundleJacket)}");
            DeleteIfExists(localJacketTarget);
            FileSystem.MoveFile(music.PseudoAssetBundleJacket, localJacketTarget, UIOption.OnlyErrorDialogs);
        }
        else if (music.AssetBundleJacket is not null)
        {
            FileSystem.MoveFile(music.AssetBundleJacket, abJacketTarget, UIOption.OnlyErrorDialogs);
            if (System.IO.File.Exists(music.AssetBundleJacket + ".manifest"))
            {
                FileSystem.MoveFile(music.AssetBundleJacket + ".manifest", abJacketTarget + ".manifest", UIOption.OnlyErrorDialogs);
            }
        }

        // 我也不知道它需不需要重新保存，先直接移动试试
        // 是可以的
        if (StaticSettings.AcbAwb.TryGetValue($"music{music.NonDxId:000000}.acb", out var acb))
        {
            FileSystem.MoveFile(acb, acbawbTarget + ".acb", UIOption.OnlyErrorDialogs);
        }

        if (StaticSettings.AcbAwb.TryGetValue($"music{music.NonDxId:000000}.awb", out var awb))
        {
            FileSystem.MoveFile(awb, acbawbTarget + ".awb", UIOption.OnlyErrorDialogs);
        }

        // movie data
        if (StaticSettings.MovieDataMap.TryGetValue(music.NonDxId, out var movie))
        {
            FileSystem.MoveFile(movie, movieTarget, UIOption.OnlyErrorDialogs);
        }

        // 谱面
        var oldMusicDir = Path.GetDirectoryName(music.FilePath)!;
        for (var i = 0; i < 6; i++)
        {
            var chart = music.Charts[i];
            if (!chart.Enable) continue;
            if (!System.IO.File.Exists(Path.Combine(oldMusicDir, chart.Path))) continue;
            var newFileName = $"{newId:000000}_0{i}.ma2";
            FileSystem.MoveFile(Path.Combine(oldMusicDir, chart.Path), Path.Combine(oldMusicDir, newFileName));
            chart.Path = newFileName;
        }

        // xml
        music.Id = newId;
        music.Save();
        Directory.CreateDirectory(Path.Combine(assetDir, "music"));
        FileSystem.MoveDirectory(oldMusicDir, newMusicDir, UIOption.OnlyErrorDialogs);

        // rescan all
        settings.RescanAll();
    }

    [HttpGet]
    public async Task ExportAsMaidata(int id, string assetDir, bool ignoreVideo = false)
    {
        var music = settings.GetMusic(id, assetDir);
        if (music is null) return;

        await using var zipStream = HttpContext.Response.BodyWriter.AsStream();
        using var zipArchive = new ZipArchive(zipStream, ZipArchiveMode.Create, leaveOpen: true);

        Ma2Parser parser = new();
        var simaiFile = new StringBuilder();

        simaiFile.AppendLine($"&title={music.Name}");
        simaiFile.AppendLine($"&artist={music.Artist}");
        simaiFile.AppendLine($"&wholebpm={music.Bpm}");
        simaiFile.AppendLine("&first=0");
        simaiFile.AppendLine($"&shortid={music.Id}");
        simaiFile.AppendLine($"&chartconverter=MaiChartManager v{Application.ProductVersion}");

        for (var i = 0; i < 5; i++)
        {
            var chart = music.Charts[i];
            if (chart is null) continue;

            var path = Path.Combine(Path.GetDirectoryName(music.FilePath)!, chart.Path);
            if (!System.IO.File.Exists(path)) continue;
            var ma2Content = await System.IO.File.ReadAllLinesAsync(path);
            var ma2 = parser.ChartOfToken(ma2Content);
            var simai = ma2.Compose(ChartEnum.ChartVersion.SimaiFes);
            simaiFile.AppendLine($"&lv_{i + 2}={chart.Level}.{chart.LevelDecimal}");
            simaiFile.AppendLine($"&inote_{i + 2}={simai}");
        }

        var maidataEntry = zipArchive.CreateEntry("maidata.txt");
        await using var maidataStream = maidataEntry.Open();
        await maidataStream.WriteAsync(Encoding.UTF8.GetBytes(simaiFile.ToString()));
        maidataStream.Close();


        var soundEntry = zipArchive.CreateEntry("track.mp3");
        await using var soundStream = soundEntry.Open();
        AudioConvert.ConvertWavPathToMp3Stream(await AudioConvert.GetCachedWavPath(id), soundStream);
        soundStream.Close();

        // copy jacket
        var img = ImageConvert.GetMusicJacketPngData(music);
        if (img is not null)
        {
            var imageEntry = zipArchive.CreateEntry("bg.png");
            await using var imageStream = imageEntry.Open();
            await imageStream.WriteAsync(img);
            imageStream.Close();
        }

        if (!ignoreVideo && StaticSettings.MovieDataMap.TryGetValue(music.NonDxId, out var movieUsmPath))
        {
            var tmpDir = Directory.CreateTempSubdirectory();
            logger.LogInformation("Temp dir: {tmpDir}", tmpDir.FullName);
            var movieUsm = Path.Combine(tmpDir.FullName, "movie.usm");
            FileSystem.CopyFile(movieUsmPath, movieUsm, UIOption.OnlyErrorDialogs);
            await WannaCRI.WannaCRI.UnpackUsmAsync(movieUsm);
            var outputIvfFile = Directory.EnumerateFiles(Path.Combine(tmpDir.FullName, @"output\movie.usm\videos")).FirstOrDefault();
            if (outputIvfFile is not null)
            {
                var pvMp4Path = Path.Combine(tmpDir.FullName, "pv.mp4");
                await FFmpeg.Conversions.New()
                    .AddParameter("-i " + outputIvfFile)
                    .AddParameter("-c:v copy")
                    .SetOutput(pvMp4Path)
                    .Start();

                zipArchive.CreateEntryFromFile(pvMp4Path, "pv.mp4");
            }
        }
    }
}
