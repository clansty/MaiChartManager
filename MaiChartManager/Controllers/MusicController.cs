using Microsoft.AspNetCore.Mvc;
using Sitreamai.Models;

namespace MaiChartManager.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class MusicController(StaticSettings settings, ILogger<StaticSettings> logger) : ControllerBase
{
    [HttpGet]
    [Route("{id:int}")]
    public MusicXml? GetMusicDetail(int id)
    {
        return settings.MusicList.Find(it => it.Id == id);
    }

    [HttpPost]
    [Route("{id:int}")]
    public void EditMusicName(int id, [FromBody] string value)
    {
        var music = settings.MusicList.Find(it => it.Id == id);
        if (music != null)
        {
            music.Name = value;
        }
    }

    [HttpPost]
    [Route("{id:int}")]
    public void EditMusicArtist(int id, [FromBody] string value)
    {
        var music = settings.MusicList.Find(it => it.Id == id);
        if (music != null)
        {
            music.Artist = value;
        }
    }
}
