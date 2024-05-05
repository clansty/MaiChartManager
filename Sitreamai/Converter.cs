using System;
using System.IO;
using MaiLib;

namespace Sitreamai;

public class Converter
{
    public static void ConvertOne(int musicId, string fromDir, string assetsDir)
    {
        var simaiTokenizer = new SimaiTokenizer();
        simaiTokenizer.UpdateFromPath(Path.Join(fromDir, "maidata.txt"));

        Console.WriteLine(simaiTokenizer.SimaiTrackInformation.TrackName);

        var strMusicId = musicId.ToString().PadLeft(6, '0');
        // 写出歌曲 XML
        var xml = MusicXml.build(musicId, simaiTokenizer, out var strMusicIdDx);
        var musicDir = Path.Join(assetsDir, "music", $"music{strMusicIdDx}");
        if (!Directory.Exists(musicDir))
        {
            Directory.CreateDirectory(musicDir);
        }

        File.WriteAllText(Path.Join(musicDir, "Music.xml"), xml);

        // 转换谱面
        foreach (var (level, tokensCandidates) in simaiTokenizer.ChartCandidates)
        {
            var parser = new SimaiParser();
            var candidate = parser.ChartOfToken(tokensCandidates);

            var converted = new Ma2(candidate) { ChartVersion = ChartEnum.ChartVersion.Ma2_104 };
            var result = converted.Compose();

            File.WriteAllText(Path.Join(musicDir, $"{strMusicIdDx}_0{int.Parse(level) - 2}.ma2"), result);
        }

        // 找到图片
        foreach (var ext in new[] { ".jpg", ".png", ".webp", ".bmp", ".gif" })
        {
            var imgPath = Path.Join(fromDir, "bg" + ext);
            if (File.Exists(imgPath))
            {
                File.Copy(imgPath, Path.Join(assetsDir, "LocalAssets", strMusicId + ext), true);
            }
        }

        // 找到音频
        foreach (var ext in new[] { ".mp3", ".wav", ".aac" })
        {
            var mp3Path = Path.Join(fromDir, "track" + ext);
            if (File.Exists(mp3Path))
            {
                Audio.ConvertToMai(mp3Path, Path.Join(assetsDir, "SoundData", $"music{strMusicId}"));
            }
        }
    }
}