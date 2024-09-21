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

    public static MusicXml CreateNew(int dxId, string gamePath, string assetDir)
    {
        var id = dxId % 10000;
        // var isDx = dxId % 100000 >= 10000;
        // var isUtage = dxId >= 100000;
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

    private XmlNode RootNode => xmlDoc.SelectSingleNode("/MusicData");

    public int Id
    {
        get => int.Parse(RootNode.SelectSingleNode("name/id")?.InnerText);
        set
        {
            var nonDxId = value % 10000;
            Modified = true;
            RootNode.SelectSingleNode("name/id").InnerText = value.ToString();
            RootNode.SelectSingleNode("movieName/id").InnerText = nonDxId.ToString();
            RootNode.SelectSingleNode("cueName/id").InnerText = nonDxId.ToString();
            RootNode.SelectSingleNode("dataName").InnerText = $"music{value:000000}";
        }
    }

    public int NonDxId => Id % 10000;

    public bool Modified { get; private set; }

    // netOpenName 和 releaseTagName 游戏里看起来没有用到

    public string Name
    {
        get => RootNode.SelectSingleNode("name/str")?.InnerText;
        set
        {
            Modified = true;
            RootNode.SelectSingleNode("name/str").InnerText = value;
            RootNode.SelectSingleNode("movieName/str").InnerText = value;
            RootNode.SelectSingleNode("cueName/str").InnerText = value;
            RootNode.SelectSingleNode("sortName").InnerText = value;
        }
    }

    public int GenreId
    {
        get => int.Parse(RootNode.SelectSingleNode("genreName/id")?.InnerText ?? "0");
        set
        {
            Modified = true;
            RootNode.SelectSingleNode("genreName/id").InnerText = value.ToString();
            RootNode.SelectSingleNode("genreName/str").InnerText = "";
        }
    }

    public int AddVersionId
    {
        get => int.Parse(RootNode.SelectSingleNode("AddVersion/id")?.InnerText ?? "0");
        set
        {
            Modified = true;
            RootNode.SelectSingleNode("AddVersion/id").InnerText = value.ToString();
            RootNode.SelectSingleNode("AddVersion/str").InnerText = "";
        }
    }

    public string Artist
    {
        get => RootNode.SelectSingleNode("artistName/str")?.InnerText;
        set
        {
            Modified = true;
            RootNode.SelectSingleNode("artistName/str").InnerText = value;
            RootNode.SelectSingleNode("artistName/id").InnerText = "999";
        }
    }

    private const string utageKanjiNode = "utageKanjiName";

    public string UtageKanji
    {
        get => RootNode.SelectSingleNode(utageKanjiNode)?.InnerText;
        set
        {
            Modified = true;
            var node = RootNode.SelectSingleNode(utageKanjiNode);
            if (node is null)
            {
                node = xmlDoc.CreateNode(XmlNodeType.Element, utageKanjiNode, null);
                node.InnerText = value;
                RootNode.AppendChild(node);
                return;
            }

            RootNode.SelectSingleNode(utageKanjiNode).InnerText = value;
        }
    }

    private const string commentNode = "comment";

    public string Comment
    {
        get => RootNode.SelectSingleNode(commentNode)?.InnerText;
        set
        {
            Modified = true;
            var node = RootNode.SelectSingleNode(commentNode);
            if (node is null)
            {
                node = xmlDoc.CreateNode(XmlNodeType.Element, commentNode, null);
                node.InnerText = value;
                RootNode.AppendChild(node);
                return;
            }

            RootNode.SelectSingleNode(commentNode).InnerText = value;
        }
    }

    public int Version
    {
        get => int.Parse(RootNode.SelectSingleNode("version")?.InnerText ?? "0");
        set
        {
            Modified = true;
            RootNode.SelectSingleNode("version").InnerText = value.ToString();
        }
    }

    public int Bpm
    {
        get => int.Parse(RootNode.SelectSingleNode("bpm")?.InnerText ?? "0");
        set
        {
            Modified = true;
            RootNode.SelectSingleNode("bpm").InnerText = value.ToString();
        }
    }

    public bool Disable
    {
        get => bool.Parse(RootNode.SelectSingleNode("disable")?.InnerText ?? "false");
        set
        {
            Modified = true;
            RootNode.SelectSingleNode("version").InnerText = value ? "true" : "false";
        }
    }

    public class Chart(XmlNode node, MusicXml parent)
    {
        public string Path
        {
            get => node.SelectSingleNode("file/path")?.InnerText;
            set
            {
                parent.Modified = true;
                node.SelectSingleNode("file/path").InnerText = value;
            }
        }

        public int Level
        {
            get => int.Parse(node.SelectSingleNode("level")?.InnerText ?? "0");
            set
            {
                parent.Modified = true;
                node.SelectSingleNode("level").InnerText = value.ToString();
            }
        }

        public int LevelDecimal
        {
            get => int.Parse(node.SelectSingleNode("levelDecimal")?.InnerText ?? "0");
            set
            {
                parent.Modified = true;
                node.SelectSingleNode("levelDecimal").InnerText = value.ToString();
            }
        }

        public int LevelId
        {
            get => int.Parse(node.SelectSingleNode("musicLevelID")?.InnerText ?? "0");
            set
            {
                parent.Modified = true;
                node.SelectSingleNode("musicLevelID").InnerText = value.ToString();
            }
        }

        public int MaxNotes
        {
            get => int.Parse(node.SelectSingleNode("maxNotes")?.InnerText ?? "0");
            set
            {
                parent.Modified = true;
                node.SelectSingleNode("maxNotes").InnerText = value.ToString();
            }
        }

        public bool Enable
        {
            get => bool.Parse(node.SelectSingleNode("isEnable")?.InnerText ?? "false");
            set
            {
                parent.Modified = true;
                node.SelectSingleNode("isEnable").InnerText = value ? "true" : "false";
            }
        }

        public string Designer
        {
            get => node.SelectSingleNode("notesDesigner/str")?.InnerText;
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
