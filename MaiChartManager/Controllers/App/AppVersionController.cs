using MaiChartManager.Controllers.Music;
using Microsoft.AspNetCore.Mvc;

namespace MaiChartManager.Controllers.App;

[ApiController]
[Route("MaiChartManagerServlet/[action]Api")]
public class AppVersionController(StaticSettings settings, ILogger<StaticSettings> logger) : ControllerBase
{
    public record AppVersionResult(string Version, int GameVersion, IapManager.LicenseStatus License, MovieConvertController.HardwareAccelerationStatus HardwareAcceleration, string H264Encoder);

    [HttpGet]
    public AppVersionResult GetAppVersion()
    {
        return new AppVersionResult(Application.ProductVersion, settings.gameVersion, IapManager.License, MovieConvertController.HardwareAcceleration, MovieConvertController.H264Encoder);
    }
}