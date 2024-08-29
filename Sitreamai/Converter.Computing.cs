using System.IO;
using MaiLib;
using SimaiSharp;
using SimaiSharp.Structures;

namespace Sitreamai;

// 计算相关方法

public partial class Converter
{
    // 计算为了把第一押对到第二小节第一拍上需要给音频增加空白的时间
    public static float CalcMusicPadding(MaiChart chart, float first)
    {
        // TimingChanges 对应的是所有的 {int}
        var bpm = chart.TimingChanges[0].tempo;
        // 一小节多长
        var bar = 60 / bpm * 4;

        // 第一押什么时候出来
        var firstTiming = chart.NoteCollections[0].time + first;
        return bar - firstTiming;
    }

    // 看起来不工作
    public static void NormalizeChart(MaiChart chart)
    {
        // 这里不需要考虑 first，因为是谱面内部的
        var bpm = chart.TimingChanges[0].tempo;
        var bar = 60 / bpm * 4;
        var firstTiming = chart.NoteCollections[0].time;
        var padding = bar - firstTiming;
        foreach (var noteCollection in chart.NoteCollections)
        {
            noteCollection.time += padding;
        }

        for (var i = 0; i < chart.TimingChanges.Length; i++)
        {
            chart.TimingChanges[i].time += padding;
        }
    }

    private static float CalcMusicPaddingTestFile(string file, int level)
    {
        var simaiText = File.ReadAllText(file);
        var simai = new SimaiFile(simaiText);

        var firstStr = simai.GetValue("first");
        if (!float.TryParse(firstStr, out var first))
        {
            first = 0;
        }

        var chartStr = simai.GetValue($"inote_{level}");
        var chart = SimaiConvert.Deserialize(chartStr);
        return CalcMusicPadding(chart, first);
    }

    public static void CalcMusicPaddingTest()
    {
        var simaiText = File.ReadAllText(@"E:\Downloads\maidata.txt");
        var simai = new SimaiFile(simaiText);

        var parser = new SimaiParser();
        var candidate = parser.ChartOfToken(new SimaiTokenizer().TokensFromText(simai.GetValue("inote_6")));
        // Console.WriteLine(candidate.Compose(ChartEnum.ChartVersion.SimaiFes));

        // var chart = SimaiConvert.Deserialize(simai.GetValue("inote_6"));
        // Console.WriteLine(SimaiConvert.Serialize(chart));

        // Console.WriteLine(CalcMusicPaddingTestFile(@"E:\Desktop\恭喜发财 (2)\maidata.txt", 7)); // 应该大约等于 -2.128，需要裁掉 2.128 秒
        // Console.WriteLine(CalcMusicPaddingTestFile(@"E:\Desktop\潮風香る街 (2)\maidata.txt", 5)); // 2.08
    }
}
