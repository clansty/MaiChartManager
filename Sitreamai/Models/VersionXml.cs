using System.IO;
using System.Text.Json.Serialization;
using System.Xml;

namespace Sitreamai.Models;

public class VersionXml
{
    private XmlDocument xmlDoc;
    [JsonIgnore] public string GamePath { get; }
    public string AssetDir { get; }

    // name.str 在游戏里不会被用到
    public int Id { get; }
    public string FilePath => Path.Combine(GamePath, @"Sinmai_Data\StreamingAssets", AssetDir, $"musicVersion/MusicVersion{Id:000000}/MusicVersion.xml");

    public VersionXml(int id, string assetDir, string gamePath)
    {
        Id = id;
        GamePath = gamePath;
        AssetDir = assetDir;
        xmlDoc = new XmlDocument();
        xmlDoc.Load(FilePath);
    }


    // 游戏识别分类的时候是对比 genreName 而不是 id，所以 genreName 不能重复
    public string GenreName
    {
        get => xmlDoc.SelectSingleNode("/MusicVersionData/genreName")?.InnerText;
        set => xmlDoc.SelectSingleNode("/MusicVersionData/genreName").InnerText = value;
    }

    public string GenreNameTwoLine
    {
        get => xmlDoc.SelectSingleNode("/MusicVersionData/genreNameTwoLine")?.InnerText;
        set => xmlDoc.SelectSingleNode("/MusicVersionData/genreNameTwoLine").InnerText = value;
    }

    public int ColorR
    {
        get => int.Parse(xmlDoc.SelectSingleNode("/MusicVersionData/Color/R")?.InnerText);
        set => xmlDoc.SelectSingleNode("/MusicVersionData/Color/R").InnerText = value.ToString();
    }

    public int ColorG
    {
        get => int.Parse(xmlDoc.SelectSingleNode("/MusicVersionData/Color/G")?.InnerText);
        set => xmlDoc.SelectSingleNode("/MusicVersionData/Color/G").InnerText = value.ToString();
    }

    public int ColorB
    {
        get => int.Parse(xmlDoc.SelectSingleNode("/MusicVersionData/Color/B")?.InnerText);
        set => xmlDoc.SelectSingleNode("/MusicVersionData/Color/B").InnerText = value.ToString();
    }

    public int Version
    {
        get => int.Parse(xmlDoc.SelectSingleNode("/MusicVersionData/version")?.InnerText);
        set => xmlDoc.SelectSingleNode("/MusicVersionData/version").InnerText = value.ToString();
    }
}
