using MaiChartManager.Models;
using Microsoft.AspNetCore.Mvc;

namespace MaiChartManager.Controllers.Catagory;

[ApiController]
[Route("MaiChartManagerServlet/[action]Api")]
public class AddVersionController(StaticSettings settings, ILogger<StaticSettings> logger) : ControllerBase
{
    [HttpGet]
    public IEnumerable<VersionXml> GetAllAddVersions()
    {
        return StaticSettings.VersionList;
    }

    [HttpPost]
    [Route("{id:int}")]
    public void EditVersion(int id, GenreController.GenreEditRequest request)
    {
        var genre = StaticSettings.VersionList.FirstOrDefault(x => x.Id == id);
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
        if (GenreController.IsUnwritableAssetDir(req.assetDir))
        {
            return Locale.GenreAssetDirInvalid;
        }

        if (StaticSettings.VersionList.Any(x => x.Id == req.id))
        {
            var existed = StaticSettings.VersionList.First(x => x.Id == req.id);
            if (existed.AssetDir == req.assetDir)
            {
                return Locale.VersionIdExists;
            }

            if (string.Compare(existed.AssetDir, req.assetDir, StringComparison.Ordinal) > 0)
            {
                return Locale.VersionIdExistsHigherPriority;
            }

            StaticSettings.VersionList.Remove(existed);
        }

        var genre = VersionXml.CreateNew(req.id, req.assetDir, StaticSettings.GamePath);
        StaticSettings.VersionList.Add(genre);
        return "";
    }

    [HttpPut]
    public void SetVersionTitleImage([FromForm] int id, IFormFile image)
    {
        var genre = StaticSettings.VersionList.FirstOrDefault(x => x.Id == id);
        if (genre == null)
        {
            throw new Exception("Version not found");
        }

        genre.FileName = $"UI_CMN_TabTitle_MaimaiTitle_VerCustom{id}";
        genre.Save();
        var path = Path.Combine(StaticSettings.ImageAssetsDir, genre.FileName + Path.GetExtension(image.FileName));
        using var stream = new FileStream(path, FileMode.Create);
        image.CopyTo(stream);
    }

    [HttpDelete]
    [Route("{id:int}")]
    public void DeleteVersion(int id)
    {
        var genre = StaticSettings.VersionList.FirstOrDefault(x => x.Id == id);
        if (genre == null)
        {
            throw new Exception("Version not found");
        }

        genre.Delete();
        StaticSettings.VersionList.Remove(genre);
    }
}