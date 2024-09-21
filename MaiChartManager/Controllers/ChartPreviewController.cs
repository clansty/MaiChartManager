using MaiLib;
using Microsoft.AspNetCore.Mvc;

namespace MaiChartManager.Controllers;

[ApiController]
[Route("MaiChartManagerServlet/[controller]/{id:int}/{level:int}/[action]/1")]
public class ChartPreviewController(StaticSettings settings, ILogger<StaticSettings> logger) : ControllerBase
{
    [HttpGet]
    public string Maidata(int id, int level)
    {
        var music = settings.MusicList.Find(it => it.Id == id);
        var chart = music?.Charts[level];
        if (chart == null)
        {
            return "No chart found";
        }

        var path = Path.Combine(Path.GetDirectoryName(music!.FilePath)!, chart.Path);
        if (!System.IO.File.Exists(path))
        {
            return "No chart found";
        }

        var ma2Content = System.IO.File.ReadAllLines(path);
        Ma2Parser parser = new();
        var ma2 = parser.ChartOfToken(ma2Content);
        var simai = ma2.Compose(ChartEnum.ChartVersion.SimaiFes);


        return $"""
                &first=0
                &lv_1=1
                &inote_1={simai}
                """;
    }

    [HttpGet]
    public ActionResult Track(int id, int level)
    {
        return RedirectToAction("GetMusicWav", "CueConvert", new { id });
    }

    [HttpGet]
    public ActionResult ImageFull(int id, int level)
    {
        return RedirectToAction("GetJacket", "Music", new { id });
    }
}
