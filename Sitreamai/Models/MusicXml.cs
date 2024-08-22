using System.IO;
using System.Text.Json.Serialization;
using System.Xml;

namespace Sitreamai.Models;

public class MusicXml
{
    private XmlDocument xmlDoc;
    public string FilePath { get; set; }
    [JsonIgnore] public string GamePath { get; }

    public MusicXml(string filePath, string gamePath)
    {
        FilePath = filePath;
        GamePath = gamePath;
        xmlDoc = new XmlDocument();
        xmlDoc.Load(filePath);

        var notes = xmlDoc.SelectSingleNode("MusicData/notesData")?.ChildNodes;
        for (var i = 0; i < 6; i++)
        {
            Charts[i] = new Chart(notes[i], this);
        }
    }

    public int Id => int.Parse(xmlDoc.SelectSingleNode("/MusicData/name/id")?.InnerText);

    public int NonDxId => Id % 10000;

    public bool Modified { get; private set; }

    // netOpenName 和 releaseTagName 游戏里看起来没有用到

    public string Name
    {
        get => xmlDoc.SelectSingleNode("/MusicData/name/str")?.InnerText;
        set
        {
            Modified = true;
            xmlDoc.SelectSingleNode("/MusicData/name/str").InnerText = value;
            xmlDoc.SelectSingleNode("/MusicData/movieName/str").InnerText = value;
            xmlDoc.SelectSingleNode("/MusicData/cueName/str").InnerText = value;
            xmlDoc.SelectSingleNode("/MusicData/sortName").InnerText = value;
        }
    }

    public int GenreId
    {
        get => int.Parse(xmlDoc.SelectSingleNode("/MusicData/genreName/id").InnerText);
        set
        {
            Modified = true;
            xmlDoc.SelectSingleNode("/MusicData/genreName/id").InnerText = value.ToString();
            xmlDoc.SelectSingleNode("/MusicData/genreName/str").InnerText = "";
        }
    }

    public int AddVersionId
    {
        get => int.Parse(xmlDoc.SelectSingleNode("/MusicData/AddVersion/id").InnerText);
        set
        {
            Modified = true;
            xmlDoc.SelectSingleNode("/MusicData/AddVersion/id").InnerText = value.ToString();
            xmlDoc.SelectSingleNode("/MusicData/AddVersion/str").InnerText = "";
        }
    }

    public string Artist
    {
        get => xmlDoc.SelectSingleNode("/MusicData/artistName/str").InnerText;
        set
        {
            Modified = true;
            xmlDoc.SelectSingleNode("/MusicData/artistName/str").InnerText = value;
            xmlDoc.SelectSingleNode("/MusicData/artistName/id").InnerText = "999";
        }
    }

    public int Version
    {
        get => int.Parse(xmlDoc.SelectSingleNode("/MusicData/version").InnerText);
        set
        {
            Modified = true;
            xmlDoc.SelectSingleNode("/MusicData/version").InnerText = value.ToString();
        }
    }

    public int Bpm
    {
        get => int.Parse(xmlDoc.SelectSingleNode("/MusicData/bpm").InnerText);
        set
        {
            Modified = true;
            xmlDoc.SelectSingleNode("/MusicData/bpm").InnerText = value.ToString();
        }
    }

    public bool Disable
    {
        get => bool.Parse(xmlDoc.SelectSingleNode("/MusicData/disable").InnerText);
        set
        {
            Modified = true;
            xmlDoc.SelectSingleNode("/MusicData/version").InnerText = value ? "true" : "false";
        }
    }

    public class Chart(XmlNode node, MusicXml parent)
    {
        public string Path
        {
            get => node.SelectSingleNode("file/path").InnerText;
            set
            {
                parent.Modified = true;
                node.SelectSingleNode("file/path").InnerText = value;
            }
        }

        public int Level
        {
            get => int.Parse(node.SelectSingleNode("level").InnerText);
            set
            {
                parent.Modified = true;
                node.SelectSingleNode("level").InnerText = value.ToString();
            }
        }

        public int LevelDecimal
        {
            get => int.Parse(node.SelectSingleNode("levelDecimal").InnerText);
            set
            {
                parent.Modified = true;
                node.SelectSingleNode("levelDecimal").InnerText = value.ToString();
            }
        }

        public int LevelId
        {
            get => int.Parse(node.SelectSingleNode("musicLevelID").InnerText);
            set
            {
                parent.Modified = true;
                node.SelectSingleNode("musicLevelID").InnerText = value.ToString();
            }
        }

        public int MaxNotes
        {
            get => int.Parse(node.SelectSingleNode("maxNotes").InnerText);
            set
            {
                parent.Modified = true;
                node.SelectSingleNode("maxNotes").InnerText = value.ToString();
            }
        }

        public bool Enable
        {
            get => bool.Parse(node.SelectSingleNode("isEnable").InnerText);
            set
            {
                parent.Modified = true;
                node.SelectSingleNode("isEnable").InnerText = value ? "true" : "false";
            }
        }

        public string Designer
        {
            get => node.SelectSingleNode("notesDesigner/str").InnerText;
            set
            {
                parent.Modified = true;
                node.SelectSingleNode("notesDesigner/str").InnerText = value;
                node.SelectSingleNode("notesDesigner/id").InnerText = "999";
            }
        }
    }

    public Chart[] Charts { get; } = new Chart[6];

    private static readonly string[] _jacketExtensions = ["jpg", "png", "jpeg"];

    [JsonIgnore]
    public string JacketPath
    {
        get
        {
            foreach (var ext in _jacketExtensions)
            {
                var path = Path.Combine(GamePath, "LocalAssets", $"{NonDxId:000000}.{ext}");
                if (File.Exists(path))
                {
                    return path;
                }
            }

            return null;
        }
    }

    public bool HasJacket => JacketPath is not null;

    public void Save()
    {
        Modified = false;
        xmlDoc.Save(FilePath);
    }
}
