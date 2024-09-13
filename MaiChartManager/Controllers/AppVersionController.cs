using System.Windows.Forms;
using Microsoft.AspNetCore.Mvc;

namespace MaiChartManager.Controllers;

[ApiController]
[Route("MaiChartManagerServlet/[action]Api")]
public class AppVersionController(StaticSettings settings, ILogger<StaticSettings> logger) : ControllerBase
{
    public record AppVersionResult(string Version, int GameVersion, IapManager.LicenseStatus License, MovieConvertController.HardwareAccelerationStatus HardwareAcceleration);

    [HttpGet]
    public AppVersionResult GetAppVersion()
    {
        return new AppVersionResult(Application.ProductVersion, settings.gameVersion, IapManager.License, MovieConvertController.HardwareAcceleration);
    }
}
