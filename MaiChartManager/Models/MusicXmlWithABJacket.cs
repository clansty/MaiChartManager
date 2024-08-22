using Sitreamai.Models;

namespace MaiChartManager.Models;

public class MusicXmlWithABJacket(string filePath, string gamePath) : MusicXml(filePath, gamePath)
{
    public string? AssetBundleJacket => StaticSettings.AssetBundleJacketMap.TryGetValue(NonDxId, out var value) ? value : null;

    // 在 mod 里文件的 jacket 是优先的
    public new bool HasJacket => JacketPath is not null || AssetBundleJacket is not null;

    public MusicBrief GetBrief()
    {
        return new MusicBrief(Id, NonDxId, Name, HasJacket);
    }
}
