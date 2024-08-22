using Microsoft.AspNetCore.Mvc;
using Sitreamai.Models;

namespace MaiChartManager.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class GenreController(StaticSettings settings, ILogger<StaticSettings> logger) : ControllerBase
{
    [HttpGet]
    public IEnumerable<GenreXml> GetAllGenres()
    {
        return settings.GenreList;
    }
}
