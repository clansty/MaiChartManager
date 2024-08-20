using Sitreamai;

namespace MaiChartManager;

public class StaticSettings
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
        }
    }

    public static string GamePath { get; set; } = @"D:\Maimai HDD\sdga145";

    public string AssetDir
    {
        get => _assetDir;
        set
        {
            if (!value.StartsWith(Path.Combine(GamePath, @"Sinmai_Data\StreamingAssets")))
                value = Path.Combine(GamePath, @"Sinmai_Data\StreamingAssets", value);
            _assetDir = value;
        }
    }

    public List<MusicXml> MusicList { get; set; } = new();

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
}
