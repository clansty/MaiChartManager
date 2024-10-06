using Microsoft.AspNetCore.Mvc;

namespace MaiChartManager.Controllers.Music;

[ApiController]
[Route("MaiChartManagerServlet/[action]Api")]
public class MusicBatchController(StaticSettings settings, ILogger<MusicBatchController> logger) : ControllerBase
{
    public record MusicIdAndAssetDirPair(int Id, string AssetDir);

    public record BatchSetPropsRequest(MusicIdAndAssetDirPair[] Ids, int AddVersionId, int GenreId, bool removeLevels, int Version);

    [HttpPost]
    public void BatchSetProps([FromBody] BatchSetPropsRequest request)
    {
        foreach (var id in request.Ids)
        {
            var music = settings.GetMusic(id.Id, id.AssetDir);
            if (music == null)
            {
                logger.LogWarning("Music with id {id} not found", id);
                continue;
            }

            if (request.AddVersionId > -1)
                music.AddVersionId = request.AddVersionId;
            if (request.GenreId > -1)
                music.GenreId = request.GenreId;
            if (request.Version > -1)
                music.Version = request.Version;

            if (request.removeLevels)
            {
                foreach (var chart in music.Charts)
                {
                    chart.Level = 0;
                    chart.LevelDecimal = 0;
                }
            }

            music.Save();
        }
    }

    [HttpDelete]
    public void BatchDeleteMusic([FromBody] MusicIdAndAssetDirPair[] ids)
    {
        foreach (var id in ids)
        {
            var music = settings.GetMusic(id.Id, id.AssetDir);
            if (music == null)
            {
                logger.LogWarning("Music with id {id} not found", id);
                continue;
            }

            music.Delete();
            settings.GetMusicList().Remove(music);
        }
    }
}
