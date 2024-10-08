﻿using MaiChartManager.Attributes;
using MaiLib;
using Microsoft.AspNetCore.Mvc;

namespace MaiChartManager.Controllers.Charts;

[ApiController]
[Route("MaiChartManagerServlet/[controller]Api/{assetDir}/{id:int}/{level:int}/[action]/1")]
public class ChartPreviewController(StaticSettings settings, ILogger<StaticSettings> logger) : ControllerBase
{
    [HttpGet]
    public string Maidata(int id, int level, string assetDir)
    {
        var music = settings.GetMusic(id, assetDir);
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

    [NoCache]
    [HttpGet]
    public ActionResult Track(int id, int level, string assetDir)
    {
        return RedirectToAction("GetMusicWav", "CueConvert", new { id, assetDir });
    }

    [NoCache]
    [HttpGet]
    public ActionResult ImageFull(int id, int level, string assetDir)
    {
        return RedirectToAction("GetJacket", "Music", new { id, assetDir });
    }
}
