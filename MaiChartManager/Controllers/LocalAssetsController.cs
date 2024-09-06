using Microsoft.AspNetCore.Mvc;
using Sitreamai.Models;

namespace MaiChartManager.Controllers;

[ApiController]
[Route("MaiChartManagerServlet/[action]Api")]
public class LocalAssetsController(StaticSettings settings, ILogger<StaticSettings> logger) : ControllerBase
{
    [HttpGet]
    [Route("{fileName}")]
    public ActionResult GetLocalAsset(string fileName)
    {
        var fileNameSanitized = Path.GetFileName(fileName);
        foreach (var extension in MusicXml.jacketExtensions)
        {
            var path = Path.Combine(StaticSettings.GamePath, "LocalAssets", $"{fileNameSanitized}.{extension}");
            if (System.IO.File.Exists(path))
            {
                return PhysicalFile(path, "image/png");
            }
        }

        return NotFound();
    }
}
