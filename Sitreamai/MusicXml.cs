using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json.Serialization;
using System.Xml;

namespace Sitreamai;

public class MusicXml
{
    private XmlDocument xmlDoc;
    public string FilePath { get; set; }
    public string GamePath { get; set; }

    public MusicXml(string filePath, string gamePath)
    {
        FilePath = filePath;
        GamePath = gamePath;
        xmlDoc = new XmlDocument();
        xmlDoc.Load(filePath);
    }

    public int Id
    {
        get => int.Parse(xmlDoc.SelectSingleNode("/MusicData/name/id")?.InnerText);
        set => xmlDoc.SelectSingleNode("/MusicData/name/id").InnerText = value.ToString();
    }

    public int nonDxId => Id % 10000;

    public string name
    {
        get => xmlDoc.SelectSingleNode("/MusicData/name/str")?.InnerText;
        set => xmlDoc.SelectSingleNode("/MusicData/name/str").InnerText = value;
    }

    private static readonly string[] _jacketExtensions = ["jpg", "png", "jpeg"];

    public string jacketPath
    {
        get
        {
            foreach (var ext in _jacketExtensions)
            {
                var path = Path.Combine(GamePath, "LocalAssets", $"{nonDxId:000000}.{ext}");
                if (File.Exists(path))
                {
                    return path;
                }
            }

            return null;
        }
    }

    public int[] getAvaliableLevels()
    {
        var notes = xmlDoc.SelectSingleNode("MusicData/notesData")?.ChildNodes;
        var levels = new List<int>();
        for (int i = 0; i < 6; i++)
        {
            if (notes[i].SelectSingleNode("isEnable").InnerText == "true")
            {
                levels.Add(i);
            }
        }

        return levels.ToArray();
    }
}
