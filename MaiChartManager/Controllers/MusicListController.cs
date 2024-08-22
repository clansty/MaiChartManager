using Microsoft.AspNetCore.Mvc;

namespace MaiChartManager.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class MusicListController(StaticSettings settings, ILogger<StaticSettings> logger) : ControllerBase
{
    [HttpPost]
    [Consumes("application/json")]
    public void SetAssetsDir([FromBody] string dir)
    {
        settings.AssetDir = dir;
        settings.ScanMusicList();
    }

    [HttpGet]
    public IEnumerable<string> GetAssetsDirs()
    {
        return StaticSettings.AssetsDirs;
    }

    [HttpGet]
    public string GetSelectedAssetsDir()
    {
        return Path.GetFileName(settings.AssetDir);
    }

    [HttpGet]
    public IEnumerable<MusicBrief> GetMusicList()
    {
        return settings.MusicList.Select(it => it.GetBrief());
    }

    [HttpGet]
    [Route("{id:int}")]
    public ActionResult GetJacket(int id)
    {
        var music = settings.MusicList.FirstOrDefault(it => it.Id == id);
        if (music == null)
        {
            return NotFound();
        }

        if (!System.IO.File.Exists(music.JacketPath))
        {
            return NotFound();
        }

        return File(System.IO.File.OpenRead(music.JacketPath), "image/png");
    }
}
