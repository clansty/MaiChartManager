using Microsoft.AspNetCore.Mvc;
using Sitreamai.Models;

namespace MaiChartManager.Controllers;

[ApiController]
[Route("MaiChartManagerServlet/[action]Api")]
public class AddVersionController(StaticSettings settings, ILogger<StaticSettings> logger) : ControllerBase
{
    [HttpGet]
    public IEnumerable<VersionXml> GetAllAddVersions()
    {
        return settings.VersionList;
    }
}
