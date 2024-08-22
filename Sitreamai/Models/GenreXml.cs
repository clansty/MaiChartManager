using System.IO;
using System.Text.Json.Serialization;
using System.Xml;

namespace Sitreamai.Models;

public class GenreXml
{
    private XmlDocument xmlDoc;
    [JsonIgnore] public string GamePath { get; }
    public string AssetDir { get; }

    // name.str 在游戏里不会被用到
    public int Id { get; }
    public string FilePath => Path.Combine(GamePath, @"Sinmai_Data\StreamingAssets", AssetDir, $"musicGenre/musicgenre{Id:000000}/MusicGenre.xml");

    public GenreXml(int id, string assetDir, string gamePath)
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
        get => xmlDoc.SelectSingleNode("/MusicGenreData/genreName")?.InnerText;
        set => xmlDoc.SelectSingleNode("/MusicGenreData/genreName").InnerText = value;
    }

    public string GenreNameTwoLine
    {
        get => xmlDoc.SelectSingleNode("/MusicGenreData/genreNameTwoLine")?.InnerText;
        set => xmlDoc.SelectSingleNode("/MusicGenreData/genreNameTwoLine").InnerText = value;
    }

    public int ColorR
    {
        get => int.Parse(xmlDoc.SelectSingleNode("/MusicGenreData/Color/R")?.InnerText);
        set => xmlDoc.SelectSingleNode("/MusicGenreData/Color/R").InnerText = value.ToString();
    }

    public int ColorG
    {
        get => int.Parse(xmlDoc.SelectSingleNode("/MusicGenreData/Color/G")?.InnerText);
        set => xmlDoc.SelectSingleNode("/MusicGenreData/Color/G").InnerText = value.ToString();
    }

    public int ColorB
    {
        get => int.Parse(xmlDoc.SelectSingleNode("/MusicGenreData/Color/B")?.InnerText);
        set => xmlDoc.SelectSingleNode("/MusicGenreData/Color/B").InnerText = value.ToString();
    }
}
