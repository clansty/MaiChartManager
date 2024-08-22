using Sitreamai;
using Sitreamai.Models;

namespace MaiChartManager;

public static class Extensions
{
    public static MusicBrief GetBrief(this MusicXml xml)
    {
        return new MusicBrief(xml.Id, xml.NonDxId, xml.Name, xml.JacketPath is not null);
    }
}
