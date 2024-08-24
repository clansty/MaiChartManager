using AssetStudio;
using Microsoft.AspNetCore.Mvc;
using Sitreamai.Models;

namespace MaiChartManager.Controllers;

[ApiController]
[Route("MaiChartManagerServlet/[action]Api/{id:int}")]
public class MusicController(StaticSettings settings, ILogger<StaticSettings> logger) : ControllerBase
{
    [HttpGet]
    public MusicXml? GetMusicDetail(int id)
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

        if (music.AssetBundleJacket is null) return NotFound();

        var manager = new AssetsManager();
        manager.LoadFiles([music.AssetBundleJacket]);
        var asset = manager.assetsFileList[0].Objects.Find(it => it.type == ClassIDType.Texture2D);
        if (asset is null) return NotFound();

        var texture = asset as Texture2D;
        return File(texture.ConvertToStream(ImageFormat.Png, true).GetBuffer(), "image/png");
    }
}
