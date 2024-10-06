using MaiChartManager.Models;
using Microsoft.AspNetCore.Mvc;

namespace MaiChartManager.Controllers;

[ApiController]
[Route("MaiChartManagerServlet/[action]Api")]
public class MusicListController(StaticSettings settings, ILogger<StaticSettings> logger) : ControllerBase
{
    [HttpGet]
    public IEnumerable<MusicXmlWithABJacket> GetMusicList()
    {
        return settings.GetMusicList();
    }

    [HttpPost]
    public void ReloadAll()
    {
        settings.RescanAll();
    }
}
