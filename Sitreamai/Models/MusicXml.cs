using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json.Serialization;
using System.Xml;
using Microsoft.VisualBasic.FileIO;

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

    public static MusicXml CreateNew(int id, string gamePath, string assetDir, bool isDx)
    {
        if (id > 10000)
        {
            throw new ArgumentException("id must be less than 10000");
        }

        var dxId = isDx ? id + 10000 : id;
        var data = $"""
                    <?xml version="1.0" encoding="utf-8"?>
                    <MusicData xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
                      <dataName>music{dxId:000000}</dataName>
                      <netOpenName>
                        <id>230922</id>
                        <str>Net230922</str>
                      </netOpenName>
                      <releaseTagName>
                        <id>4001</id>
                        <str>Ver1.40.00</str>
                      </releaseTagName>
                      <disable>false</disable>
                      <name>
                        <id>{dxId}</id>
                        <str></str>
                      </name>
                      <rightsInfoName>
                        <id>0</id>
                        <str />
                      </rightsInfoName>
                      <sortName></sortName>
                      <artistName>
                        <id>{id}</id>
                        <str></str>
                      </artistName>
                      <genreName>
                        <id>101</id>
                        <str>POPSアニメ</str>
                      </genreName>
                      <bpm>0</bpm>
                      <version>22001</version>
                      <AddVersion>
                        <id>22</id>
                        <str>test</str>
                      </AddVersion>
                      <movieName>
                        <id>{id}</id>
                        <str></str>
                      </movieName>
                      <cueName>
                        <id>{id}</id>
                        <str></str>
                      </cueName>
                      <dresscode>false</dresscode>
                      <eventName>
                        <id>1</id>
                        <str>無期限常時解放</str>
                      </eventName>
                      <eventName2>
                        <id>0</id>
                        <str>解放なし</str>
                      </eventName2>
                      <subEventName>
                        <id>0</id>
                        <str>解放なし</str>
                      </subEventName>
                      <lockType>0</lockType>
                      <subLockType>0</subLockType>
                      <dotNetListView>true</dotNetListView>
                      <notesData>
                        <Notes>
                          <file>
                            <path>{dxId:000000}_00.ma2</path>
                          </file>
                          <level>0</level>
                          <levelDecimal>0</levelDecimal>
                          <notesDesigner>
                            <id>999</id>
                            <str/>
                          </notesDesigner>
                          <notesType>0</notesType>
                          <musicLevelID>0</musicLevelID>
                          <maxNotes>0</maxNotes>
                          <isEnable>false</isEnable>
                        </Notes>
                        <Notes>
                          <file>
                            <path>{dxId:000000}_01.ma2</path>
                          </file>
                    <level>0</level>
                    <levelDecimal>0</levelDecimal>
                    <notesDesigner>
                      <id>999</id>
                      <str/>
                    </notesDesigner>
                    <notesType>0</notesType>
                    <musicLevelID>0</musicLevelID>
                    <maxNotes>0</maxNotes>
                    <isEnable>false</isEnable>
                        </Notes>
                        <Notes>
                          <file>
                            <path>{dxId:000000}_02.ma2</path>
                          </file>
                    <level>0</level>
                    <levelDecimal>0</levelDecimal>
                    <notesDesigner>
                      <id>999</id>
                      <str/>
                    </notesDesigner>
                    <notesType>0</notesType>
                    <musicLevelID>0</musicLevelID>
                    <maxNotes>0</maxNotes>
                    <isEnable>false</isEnable>
                        </Notes>
                        <Notes>
                          <file>
                            <path>{dxId:000000}_03.ma2</path>
                          </file>
                    <level>0</level>
                    <levelDecimal>0</levelDecimal>
                    <notesDesigner>
                      <id>999</id>
                      <str/>
                    </notesDesigner>
                    <notesType>0</notesType>
                    <musicLevelID>0</musicLevelID>
                    <maxNotes>0</maxNotes>
                    <isEnable>false</isEnable>
                        </Notes>
                         <Notes>
                          <file>
                            <path>{dxId:000000}_04.ma2</path>
                          </file>
                    <level>0</level>
                    <levelDecimal>0</levelDecimal>
                    <notesDesigner>
                      <id>999</id>
                      <str/>
                    </notesDesigner>
                    <notesType>0</notesType>
                    <musicLevelID>0</musicLevelID>
                    <maxNotes>0</maxNotes>
                    <isEnable>false</isEnable>
                        </Notes>
                        <Notes>
                          <file>
                            <path>{dxId:000000}_05.ma2</path>
                          </file>
                    <level>0</level>
                    <levelDecimal>0</levelDecimal>
                    <notesDesigner>
                      <id>999</id>
                      <str/>
                    </notesDesigner>
                    <notesType>0</notesType>
                    <musicLevelID>0</musicLevelID>
                    <maxNotes>0</maxNotes>
                    <isEnable>false</isEnable>
                        </Notes>
                     </notesData>
                      <jacketFile />
                      <thumbnailName />
                      <rightFile />
                      <priority>0</priority>
                    </MusicData>
                    """;
        var path = Path.Combine(gamePath, @"Sinmai_Data\StreamingAssets", assetDir, $@"music\music{dxId:000000}");
        Directory.CreateDirectory(path);
        File.WriteAllText(Path.Combine(path, "Music.xml"), data);
        return new MusicXml(Path.Combine(path, "Music.xml"), gamePath);
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
        get => xmlDoc.SelectSingleNode("/MusicData/artistName/str")?.InnerText;
        set
        {
            Modified = true;
            xmlDoc.SelectSingleNode("/MusicData/artistName/str").InnerText = value;
            xmlDoc.SelectSingleNode("/MusicData/artistName/id").InnerText = "999";
        }
    }

    private const string utageKanjiNode = "utageKanjiName";

    public string UtageKanji
    {
        get => xmlDoc.SelectSingleNode(utageKanjiNode)?.InnerText;
        set
        {
            Modified = true;
            var node = xmlDoc.SelectSingleNode(utageKanjiNode);
            if (node is null)
            {
                node = xmlDoc.CreateNode(XmlNodeType.Element, utageKanjiNode, null);
                node.InnerText = value;
                xmlDoc.DocumentElement.AppendChild(node);
                return;
            }

            xmlDoc.SelectSingleNode(utageKanjiNode).InnerText = value;
        }
    }

    private const string commentNode = "comment";

    public string Comment
    {
        get => xmlDoc.SelectSingleNode(commentNode)?.InnerText;
        set
        {
            Modified = true;
            var node = xmlDoc.SelectSingleNode(commentNode);
            if (node is null)
            {
                node = xmlDoc.CreateNode(XmlNodeType.Element, commentNode, null);
                node.InnerText = value;
                xmlDoc.DocumentElement.AppendChild(node);
                return;
            }

            xmlDoc.SelectSingleNode(commentNode).InnerText = value;
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

        public List<string> Problems
        {
            get
            {
                var res = new List<string>();
                if (!File.Exists(System.IO.Path.Combine(System.IO.Path.GetDirectoryName(parent.FilePath), Path)))
                {
                    res.Add("谱面文件不存在");
                }

                return res;
            }
        }
    }

    public Chart[] Charts { get; } = new Chart[6];

    public static readonly string[] jacketExtensions = ["jpg", "png", "jpeg"];

    [JsonIgnore]
    public string JacketPath
    {
        get
        {
            foreach (var ext in jacketExtensions)
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

    public void Delete()
    {
        FileSystem.DeleteDirectory(Path.GetDirectoryName(FilePath), UIOption.AllDialogs, RecycleOption.SendToRecycleBin);
    }
}
