using MaiLib;
using Microsoft.AspNetCore.Mvc;
using SimaiSharp;
using SimaiSharp.Structures;
using Sitreamai;

namespace MaiChartManager.Controllers;

[ApiController]
[Route("MaiChartManagerServlet/[action]Api")]
public class ImportChartController(StaticSettings settings, ILogger<StaticSettings> logger) : ControllerBase
{
    public enum MessageLevel
    {
        Info,
        Warning,
        Fatal
    }

    private SimaiParser simaiParser = new();
    private SimaiTokenizer simaiTokenizer = new();

    public record ImportChartMessage(string Message, MessageLevel Level);

    public record ImportChartCheckResult(bool Accept, IEnumerable<ImportChartMessage> Errors, float MusicPadding, bool IsDx, string? Title);

    [HttpPost]
    public ImportChartCheckResult ImportChartCheck(IFormFile file)
    {
        var maiData = new Dictionary<string, string>(new SimaiFile(file.OpenReadStream()).ToKeyValuePairs());
        var errors = new List<ImportChartMessage>();
        var fatal = false;

        var title = maiData.GetValueOrDefault("title");
        if (string.IsNullOrWhiteSpace(maiData.GetValueOrDefault("title")))
        {
            errors.Add(new ImportChartMessage("乐曲没有标题", MessageLevel.Fatal));
            fatal = true;
        }

        var levels = new bool[5];
        var allChartText = new Dictionary<int, string>();

        for (var i = 0; i < 5; i++)
        {
            // maidata 里 2 是绿谱，6 是白谱
            if (!string.IsNullOrWhiteSpace(maiData.GetValueOrDefault($"inote_{i + 2}")))
            {
                levels[i] = true;
                allChartText.Add(i + 2, maiData.GetValueOrDefault($"inote_{i + 2}"));
            }
        }

        if (levels.Any(it => it))
        {
            string[] levelNames = ["绿", "黄", "红", "紫", "白"];
            var message = "将导入以下难度：";
            for (var i = 0; i < 5; i++)
            {
                if (levels[i])
                {
                    message += levelNames[i] + " ";
                }
            }

            errors.Add(new ImportChartMessage(message, MessageLevel.Info));
        }

        foreach (var i in (int[]) [7, 8, 0])
        {
            if (string.IsNullOrWhiteSpace(maiData.GetValueOrDefault($"inote_{i}"))) continue;
            allChartText.Add(i, maiData.GetValueOrDefault($"inote_{i}"));
            if (!levels[3])
            {
                levels[3] = true;
                errors.Add(new ImportChartMessage($"有一个难度为 {i} 的谱面，将导入为紫谱", MessageLevel.Warning));
            }
            else if (!levels[4])
            {
                levels[4] = true;
                errors.Add(new ImportChartMessage($"有一个难度为 {i} 的谱面，将导入为白谱", MessageLevel.Warning));
            }
            else if (!levels[0])
            {
                levels[0] = true;
                errors.Add(new ImportChartMessage($"有一个难度为 {i} 的谱面，将导入为绿谱", MessageLevel.Warning));
            }
            else
            {
                errors.Add(new ImportChartMessage($"有一个难度为 {i} 的谱面将被忽略", MessageLevel.Warning));
            }
        }

        if (!levels.Any(it => it))
        {
            errors.Add(new ImportChartMessage("乐曲没有谱面", MessageLevel.Fatal));
            fatal = true;
            return new ImportChartCheckResult(!fatal, errors, 0.0f, false, title);
        }

        var paddings = new List<float>();
        float.TryParse(maiData.GetValueOrDefault("first"), out var first);
        var isDx = false;

        foreach (var kvp in allChartText)
        {
            var chartText = kvp.Value;
            try
            {
                var chart = SimaiConvert.Deserialize(chartText);
                paddings.Add(Converter.CalcMusicPadding(chart, first));

                // 防止谱面不标准 MaiLib 解析不了
                chartText = SimaiConvert.Serialize(chart);
                var candidate = simaiParser.ChartOfToken(simaiTokenizer.TokensFromText(chartText));
                isDx = isDx || candidate.IsDxChart;
            }
            catch (Exception e)
            {
                logger.LogError(e, "解析谱面失败");
                errors.Add(new ImportChartMessage($"谱面难度 {kvp.Key} 解析失败", MessageLevel.Fatal));
                fatal = true;
            }
        }

        var padding = paddings.Max();
        if (padding > 0)
        {
            errors.Add(new ImportChartMessage($"将在音频前面加上 {padding:F3} 秒空白以保证第一押在第二小节", MessageLevel.Info));
        }
        else if (padding < 0)
        {
            errors.Add(new ImportChartMessage($"将裁剪 {-padding:F3} 秒音频以保证第一押在第二小节", MessageLevel.Info));
        }

        return new ImportChartCheckResult(!fatal, errors, padding, isDx, title);
    }

    public record ImportChartResult(bool ShiftNoteEaten);

    [HttpPost]
    // 创建完 Music 后调用
    public ImportChartResult ImportChart([FromForm] int id, IFormFile file, [FromForm] bool ignoreLevelNum, [FromForm] int addVersionId, [FromForm] int genreId, [FromForm] int version)
    {
        var music = settings.MusicList.First(it => it.Id == id);
        var maiData = new Dictionary<string, string>(new SimaiFile(file.OpenReadStream()).ToKeyValuePairs());

        // Debug
        var shiftNoteEaten = false;

        var allCharts = new Dictionary<int, MaiChart>();
        for (var i = 2; i < 9; i++)
        {
            if (!string.IsNullOrWhiteSpace(maiData.GetValueOrDefault($"inote_{i}")))
            {
                allCharts.Add(i, SimaiConvert.Deserialize(maiData[$"inote_{i}"]));
            }
        }

        if (!string.IsNullOrWhiteSpace(maiData.GetValueOrDefault("inote_0")))
        {
            allCharts.Add(0, SimaiConvert.Deserialize(maiData["inote_0"]));
        }

        float.TryParse(maiData.GetValueOrDefault("first"), out var first);

        var paddings = allCharts.Values.Select(chart => Converter.CalcMusicPadding(chart, first)).ToList();
        // 音频前面被增加了多少
        var audioPadding = paddings.Max();
        // 见下方注释
        var chartPadding = audioPadding + first; // = bar - firstTiming

        foreach (var (level, chart) in allCharts)
        {
            // var levelPadding = Converter.CalcMusicPadding(chart, first);
            var bpm = chart.TimingChanges[0].tempo;
            music.Bpm = (int)Math.Floor(bpm);
            // 一个小节多少秒
            var bar = 60 / bpm * 4;

            // 我们要让这个谱面真正的内容（忽略 first）延后多少
            // levelPadding 似乎不需要算，因为每个谱面真正的内容都是从同一个地方开始
            // 所以只要在前面加上 audioPadding + first 时间的休止符
            // 最早出音符的那个谱面的第一押之前一定是 1bar（小节）的休止符
            //       |_| levelPadding
            // |_______| audioPadding
            //       |________________| bar
            // |________________| bar
            // |-------|---|----|-----|-----
            // |       |   |    |     | 这个谱面的第一押
            // |       |   |    | 可能是另一个谱面难度的第一押，firstTiming，它可能导致 audioPadding > levelPadding
            // |       |   |____| 这一段是休止符
            // |       |   | 每个谱面真正的内容都是从这里开始
            // |       |___| first skip 掉的部分
            // |       | 原先音频的开头
            // | 加了 padding 的音频开头

            var targetLevel = level - 2;

            if (level is > 6 or < 1)
            {
                // 分给 3 4 0
                if (!music.Charts[3].Enable)
                {
                    targetLevel = 3;
                }
                else if (!music.Charts[4].Enable)
                {
                    targetLevel = 4;
                }
                else if (!music.Charts[0].Enable)
                {
                    targetLevel = 0;
                }
                else
                {
                    continue;
                }
            }

            var targetChart = music.Charts[targetLevel];
            targetChart.Path = $"{id:000000}_0{targetLevel}.ma2";
            var levelNumStr = maiData.GetValueOrDefault($"lv_{level}");
            if (!string.IsNullOrWhiteSpace(levelNumStr))
            {
                levelNumStr = levelNumStr.Replace("+", ".7");
            }

            float.TryParse(levelNumStr, out var levelNum);
            targetChart.LevelId = MusicXmlConverter.GetLevelId((int)(levelNum * 10));
            // 忽略定数
            if (!ignoreLevelNum)
            {
                targetChart.Level = (int)Math.Floor(levelNum);
                targetChart.LevelDecimal = (int)Math.Floor(levelNum * 10 % 10);
            }

            targetChart.Designer = maiData.GetValueOrDefault($"des_{level}") ?? maiData.GetValueOrDefault("des") ?? "";
            var maiLibChart = simaiParser.ChartOfToken(simaiTokenizer.TokensFromText(SimaiConvert.Serialize(chart)));
            var originalConverted = maiLibChart.Compose(ChartEnum.ChartVersion.Ma2_104);
            if (chartPadding != 0)
            {
                maiLibChart.ShiftByOffset((int)(chartPadding / bar * maiLibChart.Definition));
            }

            var shiftedConverted = maiLibChart.Compose(ChartEnum.ChartVersion.Ma2_104);

            if (shiftedConverted.Split('\n').Length != originalConverted.Split('\n').Length)
            {
                shiftNoteEaten = true;
                logger.LogWarning("BUG! shiftedConverted: {shiftedLen}, originalConverted: {originalLen}", shiftedConverted.Split('\n').Length, originalConverted.Split('\n').Length);
            }

            targetChart.MaxNotes = maiLibChart.AllNoteNum;
            System.IO.File.WriteAllText(Path.Combine(Path.GetDirectoryName(music.FilePath), targetChart.Path), shiftedConverted);

            targetChart.Enable = true;
        }

        music.Name = maiData["title"];
        music.Artist = maiData.GetValueOrDefault("artist") ?? "";
        music.AddVersionId = addVersionId;
        music.GenreId = genreId;
        music.Version = version;
        music.Save();
        return new ImportChartResult(shiftNoteEaten);
    }
}
