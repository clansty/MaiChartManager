using System.Text.RegularExpressions;
using Sitreamai.Models;

namespace MaiChartManager;

public partial class StaticSettings
{
    private readonly ILogger<StaticSettings> _logger;
    private string _assetDir;

    public StaticSettings(ILogger<StaticSettings> logger)
    {
        _logger = logger;
        if (!string.IsNullOrEmpty(GamePath))
        {
            AssetDir = "A500";
            ScanMusicList();
            ScanGenre();
            ScanVersionList();
        }
    }

    [GeneratedRegex(@"^\w\d{3}$")]
    private static partial Regex ADirRegex();

    public static string GamePath { get; set; }
    public static string StreamingAssets => Path.Combine(GamePath, "Sinmai_Data", "StreamingAssets");

    public static IEnumerable<string> AssetsDirs => Directory.EnumerateDirectories(StreamingAssets)
        .Select(Path.GetFileName).Where(it => ADirRegex().IsMatch(it));

    public string AssetDir
    {
        get => _assetDir;
        set
        {
            if (!value.StartsWith(StreamingAssets))
                value = Path.Combine(StreamingAssets, value);
            _assetDir = value;
        }
    }

    public List<MusicXml> MusicList { get; set; } = new();
    public List<GenreXml> GenreList { get; set; } = new();
    public List<VersionXml> VersionList { get; set; } = new();

    public void ScanMusicList()
    {
        MusicList.Clear();
        var musicDir = Path.Combine(AssetDir, "music");
        if (!Directory.Exists(musicDir))
        {
            Directory.CreateDirectory(musicDir);
        }

        foreach (var subDir in Directory.EnumerateDirectories(musicDir))
        {
            if (!File.Exists(Path.Combine(subDir, "Music.xml"))) continue;
            var musicXml = new MusicXml(Path.Combine(subDir, "Music.xml"), GamePath);
            MusicList.Add(musicXml);
        }

        _logger.LogInformation($"Scan music list, found {MusicList.Count} music.");
    }

    public void ScanGenre()
    {
        GenreList.Clear();

        foreach (var a in AssetsDirs)
        {
            if (!Directory.Exists(Path.Combine(StreamingAssets, a, "musicGenre"))) continue;
            foreach (var genreDir in Directory.EnumerateDirectories(Path.Combine(StreamingAssets, a, "musicGenre"), "musicgenre*"))
            {
                if (!File.Exists(Path.Combine(genreDir, "MusicGenre.xml"))) continue;
                var id = int.Parse(Path.GetFileName(genreDir).Substring("musicgenre".Length));
                var genreXml = new GenreXml(id, a, GamePath);

                var existed = GenreList.Find(it => it.Id == id);
                if (existed != null)
                {
                    GenreList.Remove(existed);
                }

                GenreList.Add(genreXml);
            }
        }

        _logger.LogInformation($"Scan genre list, found {GenreList.Count} genre.");
    }

    public void ScanVersionList()
    {
        VersionList.Clear();
        foreach (var a in AssetsDirs)
        {
            if (!Directory.Exists(Path.Combine(StreamingAssets, a, "musicVersion"))) continue;
            foreach (var versionDir in Directory.EnumerateDirectories(Path.Combine(StreamingAssets, a, "musicVersion"), "musicversion*"))
            {
                if (!File.Exists(Path.Combine(versionDir, "MusicVersion.xml"))) continue;
                var id = int.Parse(Path.GetFileName(versionDir).Substring("musicversion".Length));
                var versionXml = new VersionXml(id, a, GamePath);

                var existed = VersionList.Find(it => it.Id == id);
                if (existed != null)
                {
                    VersionList.Remove(existed);
                }

                VersionList.Add(versionXml);
            }
        }

        _logger.LogInformation($"Scan version list, found {VersionList.Count} version.");
    }
}
