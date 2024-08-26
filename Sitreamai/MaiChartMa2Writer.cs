using System;
using System.Linq;
using System.Text;
using SimaiSharp.Structures;

namespace Sitreamai;

public class MaiChartMa2Writer(MaiChart chart)
{
    private const int DEFAULT_RESOLUTION_TIME = 1920;

    public string Convert()
    {
        var builder = new StringBuilder();

        builder.AppendLine("CONVERTER\tMaiChartMa2Writer");
        builder.AppendLine($"CONVERT_TIME\t{DateTime.Now}");

        builder.AppendLine("VERSION\t0.00.00\t1.04.00");
        builder.AppendLine("FES_MODE\t0");

        // first default max min
        builder.AppendLine($"BPM_DEF\t{chart.TimingChanges.First().tempo}\t{chart.TimingChanges.First().tempo}\t" +
                           $"{chart.TimingChanges.Select(it => it.tempo).Max()}\t{chart.TimingChanges.Select(it => it.tempo).Min()}");

        builder.AppendLine($"MET_DEF\t4\t4");
        builder.AppendLine($"RESOLUTION\t{DEFAULT_RESOLUTION_TIME}");
        builder.AppendLine($"CLK_DEF\t{DEFAULT_RESOLUTION_TIME}");
        builder.AppendLine($"COMPATIBLE_CODE\tMA2");

        return builder.ToString();
    }
}
