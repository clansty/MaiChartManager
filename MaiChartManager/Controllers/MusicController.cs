using System.Diagnostics;
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

        var music = settings.MusicList.Find(it => it.Id == id);
        while (music?.JacketPath is not null)
        {
            FileSystem.DeleteFile(music.JacketPath, UIOption.OnlyErrorDialogs, RecycleOption.SendToRecycleBin);
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
        manager.LoadFiles(music.AssetBundleJacket);
        var asset = manager.assetsFileList[0].Objects.Find(it => it.type == ClassIDType.Texture2D);
        if (asset is null) return NotFound();

        var texture = asset as Texture2D;
        return File(texture.ConvertToStream(ImageFormat.Png, true).GetBuffer(), "image/png");
    }

    [HttpPost]
    public void RequestOpenExplorer(int id)
    {
        var music = settings.MusicList.Find(it => it.Id == id);
        if (music != null)
        {
            Process.Start("explorer.exe", $"/select,\"{music.FilePath}\"");
        }
    }
}
