using MaiChartManager.Models;
using Microsoft.AspNetCore.Mvc;

namespace MaiChartManager.Controllers;

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
        if (StaticSettings.GenreList.Any(x => x.Id == req.id))
        {
            var existed = StaticSettings.GenreList.First(x => x.Id == req.id);
            if (existed.AssetDir == req.assetDir)
            {
                return "相同的资源目录里已经存在一个 ID 相同的流派了";
            }

            if (string.Compare(existed.AssetDir, req.assetDir, StringComparison.Ordinal) > 0)
            {
                return "一个优先级更高的资源目录里已经存在一个 ID 相同的流派了，这样的话，新创建的流派不会被识别\n" +
                       "如果要覆盖现有的流派，请在一个数字更大的资源目录中创建";
            }

            StaticSettings.GenreList.Remove(existed);
        }

        var genre = GenreXml.CreateNew(req.id, req.assetDir, StaticSettings.GamePath);
        StaticSettings.GenreList.Add(genre);
        return "";
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
        Directory.CreateDirectory(Path.Combine(StaticSettings.GamePath, "LocalAssets"));
        var path = Path.Combine(genre.GamePath, "LocalAssets", genre.FileName + Path.GetExtension(image.FileName));
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
