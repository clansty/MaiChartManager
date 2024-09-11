using System.Text.RegularExpressions;
using System.Xml;
using MaiChartManager.Models;

namespace MaiChartManager;

public partial class StaticSettings
{
    public static readonly string tempPath = Path.Combine(Path.GetTempPath(), "MaiChartManager");
    public static readonly string appData = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "MaiChartManager");

    public static Config Config { get; set; } = new();

    private readonly ILogger<StaticSettings> _logger;
    private string _assetDir;

    public StaticSettings(ILogger<StaticSettings> logger)
    {
        _logger = logger;

        try
        {
            if (string.IsNullOrEmpty(GamePath))
            {
                throw new ArgumentException("未指定游戏目录");
            }

            AssetDir = "A500";
            GetGameVersion();
            ScanMusicList();
            ScanGenre();
            ScanVersionList();
            ScanAssetBundles();
            ScanSoundData();
            ScanMovieData();
        }
        catch (Exception e)
        {
            _logger.LogError(e, "初始化数据目录时出错");
            SentrySdk.CaptureException(e);
            MessageBox.Show(e.Message, "初始化数据目录时出错", MessageBoxButtons.OK, MessageBoxIcon.Error);
            Application.Exit();
        }
    }

    [GeneratedRegex(@"^A(\d{3})$")]
    public static partial Regex ADirRegex();

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

    public int gameVersion;
    public List<MusicXmlWithABJacket> MusicList { get; set; } = [];
    public static List<GenreXml> GenreList { get; set; } = [];
    public static List<VersionXml> VersionList { get; set; } = [];
    public static Dictionary<int, string> AssetBundleJacketMap { get; set; } = new();
    public static Dictionary<int, string> PseudoAssetBundleJacketMap { get; set; } = new();
    public static Dictionary<int, string> MovieDataMap { get; set; } = new();
    public static Dictionary<string, string> AcbAwb { get; set; } = new();

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
            var musicXml = new MusicXmlWithABJacket(Path.Combine(subDir, "Music.xml"), GamePath);
            MusicList.Add(musicXml);
        }

        _logger.LogInformation("Scan music list, found {0} music.", MusicList.Count);
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

        _logger.LogInformation("Scan genre list, found {0} genre.", GenreList.Count);
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

    public void ScanAssetBundles()
    {
        AssetBundleJacketMap.Clear();
        PseudoAssetBundleJacketMap.Clear();
        foreach (var a in AssetsDirs)
        {
            if (!Directory.Exists(Path.Combine(StreamingAssets, a, @"AssetBundleImages\jacket"))) continue;
            foreach (var jacketFile in Directory.EnumerateFiles(Path.Combine(StreamingAssets, a, @"AssetBundleImages\jacket")))
            {
                var idStr = Path.GetFileName(jacketFile).Substring("ui_jacket_".Length, 6);
                if (!int.TryParse(idStr, out var id)) continue;
                if (Path.GetExtension(jacketFile).ToLowerInvariant() == ".ab")
                    AssetBundleJacketMap[id] = jacketFile;
                else if (((string[]) [".png", ".jpg", ".jpeg"]).Contains(Path.GetExtension(jacketFile).ToLowerInvariant()))
                    PseudoAssetBundleJacketMap[id] = jacketFile;
            }
        }

        _logger.LogInformation($"Scan AssetBundles, found {AssetBundleJacketMap.Count} AssetBundles.");
    }

    public void ScanSoundData()
    {
        AcbAwb.Clear();
        foreach (var a in AssetsDirs)
        {
            if (!Directory.Exists(Path.Combine(StreamingAssets, a, "SoundData"))) continue;
            foreach (var sound in Directory.EnumerateFiles(Path.Combine(StreamingAssets, a, @"SoundData")))
            {
                AcbAwb[Path.GetFileName(sound).ToLower()] = sound;
            }
        }

        _logger.LogInformation($"Scan SoundData, found {AcbAwb.Count} SoundData.");
    }

    public void ScanMovieData()
    {
        MovieDataMap.Clear();
        foreach (var a in AssetsDirs)
        {
            if (!Directory.Exists(Path.Combine(StreamingAssets, a, "MovieData"))) continue;
            foreach (var dat in Directory.EnumerateFiles(Path.Combine(StreamingAssets, a, @"MovieData"), "*.dat"))
            {
                if (!int.TryParse(Path.GetFileNameWithoutExtension(dat), out var id)) continue;
                MovieDataMap[id] = dat;
            }
        }

        _logger.LogInformation($"Scan MovieData, found {MovieDataMap.Count} MovieData.");
    }

    private void GetGameVersion()
    {
        try
        {
            var xmlDoc = new XmlDocument();
            xmlDoc.Load(Path.Combine(StreamingAssets, @"A000/DataConfig.xml"));
            if (!int.TryParse(xmlDoc.SelectSingleNode("/DataConfig/version/minor")?.InnerText, out gameVersion))
            {
                MessageBox.Show("无法获取游戏版本号，解析数据失败", "提示", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
        }
        catch (Exception e)
        {
            _logger.LogError(e, @"无法获取游戏版本号，可能是因为 A000\DataConfig.xml 找不到或者有错误");
            SentrySdk.CaptureException(e);
            MessageBox.Show(@"无法获取游戏版本号，可能是因为 A000\DataConfig.xml 找不到或者有错误", "提示", MessageBoxButtons.OK, MessageBoxIcon.Warning);
        }
    }

    public string GetFreeAssetDir()
    {
        var id = 0;
        // 找到下一个未被使用的名称
        foreach (var dir in AssetsDirs)
        {
            var strId = ADirRegex().Match(dir).Groups[1].Value;
            var num = int.Parse(strId);
            if (num > id) id = num;
        }

        id++;
        if (id > 999)
        {
            id = 999;
            while (AssetsDirs.Contains($"A{id:000}"))
            {
                id--;
            }
        }

        return $"A{id:000}";
    }
}
