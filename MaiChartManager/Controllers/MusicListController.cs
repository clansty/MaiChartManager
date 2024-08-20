using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using Sitreamai;

namespace MaiChartManager.Controllers;

[ApiController]
[Route("api/[controller]")]
public partial class MusicListController : ControllerBase
{
    private StaticSettings _settings;
    private readonly ILogger<StaticSettings> _logger;

    public MusicListController(StaticSettings settings, ILogger<StaticSettings> logger)
    {
        _settings = settings;
        _logger = logger;
    }

    [HttpPost]
    [Consumes("application/json")]
    [Route("SetAssetsDir")]
    public void SetAssetsDir([FromBody] string dir)
    {
        _settings.AssetDir = dir;
        _settings.ScanMusicList();
    }

    [GeneratedRegex(@"^\w\d{3}$")]
    private static partial Regex ADirRegex();

    [HttpGet]
    [Route("GetAssetsDirs")]
    public IEnumerable<string> GetAssetsDirs()
    {
        return Directory.EnumerateDirectories(Path.Combine(StaticSettings.GamePath, @"Sinmai_Data\StreamingAssets"))
            .Select(Path.GetFileName).Where(it => ADirRegex().IsMatch(it));
    }

    [HttpGet]
    [Route("GetMusicList")]
    public IEnumerable<MusicXml> GetMusicList()
    {
        return _settings.MusicList;
    }

    [HttpGet]
    [Route("GetJacket/{id:int}")]
    public ActionResult GetJacket(int id)
    {
        var music = _settings.MusicList.FirstOrDefault(it => it.Id == id);
        if (music == null)
        {
            return NotFound();
        }

        if (!System.IO.File.Exists(music.jacketPath))
        {
            return NotFound();
        }

        return File(System.IO.File.OpenRead(music.jacketPath), "image/png");
    }
}
