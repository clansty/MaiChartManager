using Microsoft.AspNetCore.Mvc;

namespace MaiChartManager.Controllers.App;

[ApiController]
[Route("MaiChartManagerServlet/[action]Api")]
public class AppStatusController(StaticSettings settings, ILogger<AppStatusController> logger) : ControllerBase
{
    public IEnumerable<string> GetAppStartupErrors()
    {
        return StaticSettings.StartupErrorsList;
    }
}