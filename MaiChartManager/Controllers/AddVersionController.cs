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

    [HttpPost]
    [Route("{id:int}")]
    public void EditVersion(int id, GenreController.GenreEditRequest request)
    {
        var genre = settings.VersionList.FirstOrDefault(x => x.Id == id);
        if (genre == null)
        {
            throw new Exception("Version not found");
        }

        genre.GenreName = request.Name;
        genre.GenreNameTwoLine = request.NameTwoLine;
        genre.ColorR = request.r;
        genre.ColorG = request.g;
        genre.ColorB = request.b;
        genre.Save();
    }

    [HttpPost]
    public string AddVersion(GenreController.GenreAddRequest req)
    {
        if (settings.VersionList.Any(x => x.Id == req.id))
        {
            var existed = settings.VersionList.First(x => x.Id == req.id);
            if (existed.AssetDir == req.assetDir)
            {
                return "相同的资源目录里已经存在一个 ID 相同的版本了";
            }

            if (string.Compare(existed.AssetDir, req.assetDir, StringComparison.Ordinal) > 0)
            {
                return "一个优先级更高的资源目录里已经存在一个 ID 相同的版本了，这样的话，新创建的版本不会被识别\n" +
                       "如果要覆盖现有的版本，请在一个数字更大的资源目录中创建";
            }

            settings.VersionList.Remove(existed);
        }

        var genre = VersionXml.CreateNew(req.id, req.assetDir, StaticSettings.GamePath);
        settings.VersionList.Add(genre);
        return "";
    }
}
