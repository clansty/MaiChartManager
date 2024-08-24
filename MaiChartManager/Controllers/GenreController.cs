using Microsoft.AspNetCore.Mvc;
using Sitreamai.Models;

namespace MaiChartManager.Controllers;

[ApiController]
[Route("MaiChartManagerServlet/[action]Api")]
public class GenreController(StaticSettings settings, ILogger<StaticSettings> logger) : ControllerBase
{
    [HttpGet]
    public IEnumerable<GenreXml> GetAllGenres()
    {
        return settings.GenreList;
    }

    public record GenreEditRequest(string Name, string NameTwoLine, int r, int g, int b);

    [HttpPost]
    [Route("{id:int}")]
    public void EditGenre(int id, GenreEditRequest request)
    {
        var genre = settings.GenreList.FirstOrDefault(x => x.Id == id);
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
        if (settings.GenreList.Any(x => x.Id == req.id))
        {
            var existed = settings.GenreList.First(x => x.Id == req.id);
            if (existed.AssetDir == req.assetDir)
            {
                return "相同的资源目录里已经存在一个 ID 相同的分类了";
            }

            if (string.Compare(existed.AssetDir, req.assetDir, StringComparison.Ordinal) > 0)
            {
                return "一个优先级更高的资源目录里已经存在一个 ID 相同的分类了，这样的话，新创建的分类不会被识别\n" +
                       "如果要覆盖现有的分类，请在一个数字更大的资源目录中创建";
            }

            settings.GenreList.Remove(existed);
        }

        var genre = GenreXml.CreateNew(req.id, req.assetDir, StaticSettings.GamePath);
        settings.GenreList.Add(genre);
        return "";
    }

    [HttpDelete]
    [Route("{id:int}")]
    public void DeleteGenre(int id)
    {
        var genre = settings.GenreList.FirstOrDefault(x => x.Id == id);
        if (genre == null)
        {
            throw new Exception("Genre not found");
        }

        genre.Delete();
        settings.GenreList.Remove(genre);
    }
}
