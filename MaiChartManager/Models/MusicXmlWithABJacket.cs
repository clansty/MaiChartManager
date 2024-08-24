using Sitreamai.Models;

namespace MaiChartManager.Models;

public class MusicXmlWithABJacket(string filePath, string gamePath) : MusicXml(filePath, gamePath)
{
    public string? AssetBundleJacket => StaticSettings.AssetBundleJacketMap.TryGetValue(NonDxId, out var value) ? value : null;

    // 在 mod 里文件的 jacket 是优先的
    public new bool HasJacket => JacketPath is not null || AssetBundleJacket is not null;

    public record ChartAvailable(int index, int levelId);

    public record MusicBrief(int Id, int NonDxId, string Name, bool HasJacket, bool Modified, IEnumerable<ChartAvailable> ChartsAvailable);

    public MusicBrief GetBrief()
    {
        var chartsAvailable = new List<ChartAvailable>();
        for (var i = 0; i < 5; i++)
        {
            if (Charts[i].Enable)
            {
                chartsAvailable.Add(new ChartAvailable(i, Charts[i].LevelId));
            }
        }

        return new MusicBrief(Id, NonDxId, Name, HasJacket, Modified, chartsAvailable);
    }
}
