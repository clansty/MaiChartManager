using MaiChartManager.Models;
using Microsoft.AspNetCore.Mvc;

namespace MaiChartManager.Controllers.Catagory;

[ApiController]
[Route("MaiChartManagerServlet/[action]Api")]
public class GenreController(StaticSettings settings, ILogger<StaticSettings> logger) : ControllerBase
{
    [HttpGet]
    public IEnumerable<GenreXml> GetAllGenres()
    {
        return StaticSettings.GenreList;
    }

    public record GenreEditRequest(string Name, string NameTwoLine, int r, int g, int b);

    [HttpPost]
    [Route("{id:int}")]
    public void EditGenre(int id, GenreEditRequest request)
    {
        var genre = StaticSettings.GenreList.FirstOrDefault(x => x.Id == id);
        if (genre == null)
        {
            throw new Exception("Genre not found");
        }

        genre.GenreName = request.Name;
        genre.GenreNameTwoLine = request.NameTwoLine;
        genre.ColorR = request.r;
        genre.ColorG = request.g;
        genre.ColorB = request.b;
        genre.Save();
    }

    public record GenreAddRequest(int id, string assetDir);

    [HttpPost]
    public string AddGenre(GenreAddRequest req)
    {
        if (IsUnwritableAssetDir(req.assetDir))
        {
            return Locale.GenreAssetDirInvalid;
        }

        if (StaticSettings.GenreList.Any(x => x.Id == req.id))
        {
            var existed = StaticSettings.GenreList.First(x => x.Id == req.id);
            if (existed.AssetDir == req.assetDir)
            {
                return Locale.GenreIdExists;
            }

            if (string.Compare(existed.AssetDir, req.assetDir, StringComparison.Ordinal) > 0)
            {
                return Locale.GenreIdExistsHigherPriority;
            }

            StaticSettings.GenreList.Remove(existed);
        }

        var genre = GenreXml.CreateNew(req.id, req.assetDir, StaticSettings.GamePath);
        StaticSettings.GenreList.Add(genre);
        return "";
    }

    // A000 是游戏内置资源目录，如果写入进去，产生的流派既不会被游戏正常加载，也无法在界面里删除
    internal static bool IsUnwritableAssetDir(string? assetDir)
    {
        return string.IsNullOrWhiteSpace(assetDir) || string.Equals(assetDir, "A000", StringComparison.OrdinalIgnoreCase);
    }

    [HttpPut]
    public void SetGenreTitleImage([FromForm] int id, IFormFile image)
    {
        var genre = StaticSettings.GenreList.FirstOrDefault(x => x.Id == id);
        if (genre == null)
        {
            throw new Exception("Genre not found");
        }

        genre.FileName = $"UI_CMN_TabTitle_{id}";
        genre.Save();
        var path = Path.Combine(StaticSettings.ImageAssetsDir, genre.FileName + Path.GetExtension(image.FileName));
        using var stream = new FileStream(path, FileMode.Create);
        image.CopyTo(stream);
    }

    [HttpDelete]
    [Route("{id:int}")]
    public void DeleteGenre(int id)
    {
        var genre = StaticSettings.GenreList.FirstOrDefault(x => x.Id == id);
        if (genre == null)
        {
            throw new Exception("Genre not found");
        }

        genre.Delete();
        StaticSettings.GenreList.Remove(genre);
    }
}