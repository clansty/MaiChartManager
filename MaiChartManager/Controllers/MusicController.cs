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
public class MusicController(StaticSettings settings, ILogger<MusicController> logger) : ControllerBase
{
    [HttpGet]
    public MusicXmlWithABJacket? GetMusicDetail(int id)
    {
        return settings.MusicList.Find(it => it.Id == id);
    }

    [HttpPost]
    public void EditMusicName(int id, [FromBody] string value)
    {
        var music = settings.MusicList.Find(it => it.Id == id);
        if (music != null)
        {
            music.Name = value;
        }
    }

    [HttpPost]
    public void EditMusicArtist(int id, [FromBody] string value)
    {
        var music = settings.MusicList.Find(it => it.Id == id);
        if (music != null)
        {
            music.Artist = value;
        }
    }

    [HttpPost]
    public void EditMusicUtageKanji(int id, [FromBody] string value)
    {
        var music = settings.MusicList.Find(it => it.Id == id);
        if (music != null)
        {
            music.UtageKanji = value;
        }
    }

    [HttpPost]
    // Utage 备注
    public void EditMusicComment(int id, [FromBody] string value)
    {
        var music = settings.MusicList.Find(it => it.Id == id);
        if (music != null)
        {
            music.Comment = value;
        }
    }

    [HttpPost]
    public void EditMusicBpm(int id, [FromBody] int value)
    {
        var music = settings.MusicList.Find(it => it.Id == id);
        if (music != null)
        {
            music.Bpm = value;
        }
    }

    [HttpPost]
    public void EditMusicVersion(int id, [FromBody] int value)
    {
        var music = settings.MusicList.Find(it => it.Id == id);
        if (music != null)
        {
            music.Version = value;
        }
    }

    [HttpPost]
    public void EditMusicGenre(int id, [FromBody] int value)
    {
        var music = settings.MusicList.Find(it => it.Id == id);
        if (music != null)
        {
            music.GenreId = value;
        }
    }

    [HttpPost]
    public void EditMusicAddVersion(int id, [FromBody] int value)
    {
        var music = settings.MusicList.Find(it => it.Id == id);
        if (music != null)
        {
            music.AddVersionId = value;
        }
    }

    [HttpPost]
    public void SaveMusic(int id)
    {
        var music = settings.MusicList.Find(it => it.Id == id);
        music?.Save();
    }

    [HttpDelete]
    public void DeleteMusic(int id)
    {
        var music = settings.MusicList.Find(it => it.Id == id);
        if (music != null)
        {
            music.Delete();
            settings.MusicList.Remove(music);
        }
    }

    [HttpPost]
    public string AddMusic(int id)
    {
        if (settings.MusicList.Any(it => it.Id == id))
        {
            return "当前资源目录里已经存在这个 ID 了";
        }

        var music = MusicXmlWithABJacket.CreateNew(id, StaticSettings.GamePath, settings.AssetDir);
        settings.MusicList.Add(music);

        return "";
    }

    [HttpPut]
    public string SetMusicJacket(int id, IFormFile file)
    {
        var nonDxId = id % 10000;
        Directory.CreateDirectory(Path.Combine(StaticSettings.GamePath, "LocalAssets"));
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!MusicXml.jacketExtensions.Contains(ext[1..]))
        {
            return "不支持的图片格式";
        }

        var path = Path.Combine(StaticSettings.GamePath, "LocalAssets", $"{nonDxId:000000}{ext}");
        using var write = System.IO.File.Open(path, FileMode.Create);
        file.CopyTo(write);
        write.Close();
        return "";
    }


    [HttpGet]
    public ActionResult GetJacket(int id)
    {
        var music = settings.MusicList.FirstOrDefault(it => it.Id == id);
        if (music == null)
        {
            return NotFound();
        }

        if (System.IO.File.Exists(music.JacketPath))
        {
            return File(System.IO.File.OpenRead(music.JacketPath), "image/png");
        }

        if (System.IO.File.Exists(music.PseudoAssetBundleJacket))
        {
            return File(System.IO.File.OpenRead(music.PseudoAssetBundleJacket), "image/png");
        }

        if (music.AssetBundleJacket is null) return NotFound();

        var manager = new AssetsManager();
        manager.LoadFiles([music.AssetBundleJacket]);
        var asset = manager.assetsFileList[0].Objects.Find(it => it.type == ClassIDType.Texture2D);
        if (asset is null) return NotFound();

        var texture = asset as Texture2D;
        return File(texture.ConvertToStream(ImageFormat.Png, true).GetBuffer(), "image/png");
    }

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
}
