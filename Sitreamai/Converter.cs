using System.IO;
using System.Linq;
using MaiLib;
using Microsoft.Extensions.Logging;

namespace Sitreamai;

public partial class Converter
{
    private ILogger Logger { get; }
    public int MusicId { get; }
    public string FromDir { get; }
    public string AssetsDir { get; }
    public string MusicPadId => MusicId.ToString().PadLeft(6, '0');
    public int MusicIdDx => IsDx ? MusicId + 10000 : MusicId;
    public string MusicPadIdDx => MusicIdDx.ToString().PadLeft(6, '0');

    public SimaiTokenizer SimaiTokenizer = new();
    public bool IsDx { get; }
    public double Bpm { get; }

    public string MusicDir => Path.Join(AssetsDir, "music", $"music{MusicPadIdDx}");

    public MusicXmlConverter XmlConverter{ private get; init; } = new();

    public Converter(int musicId, string fromDir, string assetsDir)
    {
        MusicId = musicId;
        FromDir = fromDir;
        AssetsDir = assetsDir;

        SimaiTokenizer.UpdateFromPath(Path.Join(FromDir, "maidata.txt"));

        var parser = new SimaiParser();
        var candidate = parser.ChartOfToken(SimaiTokenizer.ChartCandidates.Values.First());

        IsDx = SimaiTokenizer.SimaiTrackInformation.IsDXChart || candidate.IsDxChart;
        Bpm = double.TryParse(SimaiTokenizer.SimaiTrackInformation.TrackBPM, out var bpm) ? bpm : candidate.BPMChanges.ChangeNotes[0].BPM;

        using var factory = LoggerFactory.Create(builder => builder.AddConsole());
        Logger = factory.CreateLogger($"Converter - {SimaiTokenizer.SimaiTrackInformation.TrackName}({MusicId})");
    }

    public void Convert()
    {
        Logger.LogInformation("开始转换");

        // 写出歌曲 XML
        var xml = XmlConverter.Convert(this);
        if (!Directory.Exists(MusicDir))
        {
            Directory.CreateDirectory(MusicDir);
        }

        File.WriteAllText(Path.Join(MusicDir, "Music.xml"), xml);

        // 转换谱面
        foreach (var (level, tokensCandidates) in SimaiTokenizer.ChartCandidates)
        {
            var parser = new SimaiParser();
            var candidate = parser.ChartOfToken(tokensCandidates);

            var converted = new Ma2(candidate) { ChartVersion = ChartEnum.ChartVersion.Ma2_104 };
            var result = converted.Compose();

            File.WriteAllText(Path.Join(MusicDir, $"{MusicPadIdDx}_0{int.Parse(level) - 2}.ma2"), result);
        }

        // 找到图片
        foreach (var ext in new[] { ".jpg", ".png", ".webp", ".bmp", ".gif" })
        {
            var imgPath = Path.Join(FromDir, "bg" + ext);
            if (File.Exists(imgPath))
            {
                File.Copy(imgPath, Path.Join(AssetsDir, "LocalAssets", MusicPadId + ext), true);
            }
        }

        // 找到音频
        foreach (var ext in new[] { ".mp3", ".wav", ".aac" })
        {
            var mp3Path = Path.Join(FromDir, "track" + ext);
            if (File.Exists(mp3Path))
            {
                Audio.ConvertToMai(mp3Path, Path.Join(AssetsDir, "SoundData", $"music{MusicPadId}"));
            }
        }

        Logger.LogInformation("转换完成");
    }
}
