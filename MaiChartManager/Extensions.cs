using Sitreamai;

namespace MaiChartManager;

public static class Extensions
{
    public static MusicBrief GetBrief(this MusicXml xml)
    {
        return new MusicBrief(xml.Id, xml.nonDxId, xml.name, xml.jacketPath is not null);
    }
}
