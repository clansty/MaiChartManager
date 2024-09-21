using System.IO.Compression;
using System.Text.Json;
using System.Text.Json.Serialization;
using AssetStudio;
using MaiChartManager.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic.FileIO;
using Sitreamai;
using Sitreamai.Models;
using Standart.Hash.xxHash;
using Xabe.FFmpeg;

namespace MaiChartManager.Controllers;

[ApiController]
[Route("MaiChartManagerServlet/[action]Api/{id:int}")]
public class MusicTransferController(StaticSettings settings, ILogger<MusicTransferController> logger) : ControllerBase
{
    [HttpPost]
    public void RequestCopyTo(int id)
    {
        if (Program.BrowserWin is null) return;
        var dialog = new FolderBrowserDialog
        {
            Description = "请选择要复制到的另一份游戏的资源目录（Axxx）位置"
        };
        if (Program.BrowserWin.Invoke(() => dialog.ShowDialog(Program.BrowserWin)) != DialogResult.OK) return;
        var dest = dialog.SelectedPath;
        logger.LogInformation("CopyTo: {dest}", dest);

        var music = settings.MusicList.Find(it => it.Id == id);
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
    public void ExportOpt(int id)
    {
        var music = settings.MusicList.Find(it => it.Id == id);
        if (music is null) return;

        var zipStream = HttpContext.Response.BodyWriter.AsStream();
        using var zipArchive = new ZipArchive(zipStream, ZipArchiveMode.Create, leaveOpen: true);

        // copy music
        foreach (var file in Directory.EnumerateFiles(Path.GetDirectoryName(music.FilePath)))
        {
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
    public void ModifyId(int id, [FromBody] int newId)
    {
        if (IapManager.License != IapManager.LicenseStatus.Active) return;
        var music = settings.MusicList.Find(it => it.Id == id);
        if (music is null) return;
        var newNonDxId = newId % 10000;

        var abJacketTarget = Path.Combine(settings.AssetDir, "AssetBundleImages", "jacket", $"ui_jacket_{newNonDxId:000000}.ab");
        var acbawbTarget = Path.Combine(settings.AssetDir, "SoundData", $"music{newNonDxId:000000}");
        var movieTarget = Path.Combine(settings.AssetDir, "MovieData", $"{newNonDxId:000000}.dat");
        var newMusicDir = Path.Combine(settings.AssetDir, "music", $"music{newNonDxId:000000}");
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

        // xml
        music.Id = newId;
        music.Save();
        Directory.CreateDirectory(Path.Combine(settings.AssetDir, "music"));
        FileSystem.MoveDirectory(Path.GetDirectoryName(music.FilePath), newMusicDir, UIOption.OnlyErrorDialogs);

        // rescan all
        settings.RescanAll();
    }
}
