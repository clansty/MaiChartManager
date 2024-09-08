using MaiChartManager.Models;
using Microsoft.AspNetCore.Mvc;

namespace MaiChartManager.Controllers;

[ApiController]
[Route("MaiChartManagerServlet/[action]Api")]
public class MusicListController(StaticSettings settings, ILogger<StaticSettings> logger) : ControllerBase
{
    [HttpPost]
    public void SetAssetsDir([FromBody] string dir)
    {
        settings.AssetDir = dir;
        settings.ScanMusicList();
    }

    [HttpGet]
    public string GetSelectedAssetsDir()
    {
        return Path.GetFileName(settings.AssetDir);
    }

    [HttpGet]
    public IEnumerable<MusicXmlWithABJacket.MusicBrief> GetMusicList()
    {
        return settings.MusicList.Select(it => it.GetBrief());
    }

    [HttpPost]
    public void ReloadAll()
    {
        settings.ScanMusicList();
        settings.ScanGenre();
        settings.ScanVersionList();
        settings.ScanAssetBundles();
        settings.ScanSoundData();
        settings.ScanMovieData();
    }
}
