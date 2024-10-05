using MaiChartManager.Models;
using Microsoft.AspNetCore.Mvc;

namespace MaiChartManager.Controllers;

[ApiController]
[Route("MaiChartManagerServlet/[action]Api")]
public class MusicListController(StaticSettings settings, ILogger<StaticSettings> logger) : ControllerBase
{
    [HttpGet]
    public IEnumerable<MusicXmlWithABJacket.MusicBrief> GetMusicList()
    {
        return settings.GetMusicList().Select(it => it.GetBrief());
    }

    [HttpPost]
    public void ReloadAll()
    {
        settings.RescanAll();
    }
}
