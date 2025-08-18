using System.Xml;
using Microsoft.VisualBasic.FileIO;
using Sitreamai.Models;

namespace MaiChartManager.Models;

public class MusicXmlWithABJacket(string filePath, string gamePath, string assetDir) : MusicXml(filePath, gamePath)
{
    public string? AssetBundleJacket => StaticSettings.AssetBundleJacketMap.GetValueOrDefault(NonDxId);
    public string? PseudoAssetBundleJacket => StaticSettings.PseudoAssetBundleJacketMap.GetValueOrDefault(NonDxId);
    public string AssetDir => assetDir;

    // 在 mod 里文件的 jacket 是优先的
    public new bool HasJacket => JacketPath is not null || AssetBundleJacket is not null || PseudoAssetBundleJacket is not null;

    public new static MusicXmlWithABJacket CreateNew(int id, string gamePath, string assetDir)
    {
        var old = MusicXml.CreateNew(id, gamePath, assetDir);
        return new MusicXmlWithABJacket(old.FilePath, old.GamePath, assetDir);
    }

    public override void Refresh()
    {
        var notes = xmlDoc.SelectSingleNode("MusicData/notesData")?.ChildNodes;
        for (var i = 0; i < 6; i++)
        {
            Charts[i] = new Chart(notes[i], this);
        }

        foreach (var ext in jacketExtensions)
        {
            var path = Path.Combine(StaticSettings.ImageAssetsDir, $"{NonDxId:000000}.{ext}");
            if (File.Exists(path))
            {
                JacketPath = path;
                break;
            }
        }
    }

    public bool isAcbAwbExist => StaticSettings.AcbAwb.ContainsKey($"music{CueId:000000}.acb") && StaticSettings.AcbAwb.ContainsKey($"music{CueId:000000}.awb");

    public XmlDocument GetInnerXmlClone()
    {
        return (XmlDocument)xmlDoc.Clone();
    }

    public XmlDocument GetXmlWithoutEventsAndRights()
    {
        var clone = GetInnerXmlClone();
        var root = clone.SelectSingleNode("/MusicData");

        root.SelectSingleNode("rightsInfoName/id").InnerText = "0";
        root.SelectSingleNode("eventName/id").InnerText = "1";
        root.SelectSingleNode("eventName2/id").InnerText = "0";
        root.SelectSingleNode("subEventName/id").InnerText = "0";
        root.SelectSingleNode("lockType").InnerText = "0";
        root.SelectSingleNode("subLockType").InnerText = "0";

        return clone;
    }

    public int CueId
    {
        get => int.Parse(RootNode.SelectSingleNode("cueName/id")?.InnerText);
        set
        {
            Modified = true;
            var nonDxId = value % 10000;
            RootNode.SelectSingleNode("cueName/id").InnerText = nonDxId.ToString();
        }
    }

    public int MovieId
    {
        get => int.Parse(RootNode.SelectSingleNode("movieName/id")?.InnerText);
        set
        {
            Modified = true;
            var nonDxId = value % 10000;
            RootNode.SelectSingleNode("movieName/id").InnerText = nonDxId.ToString();
        }
    }

    public List<string> Problems
    {
        get
        {
            var res = new List<string>();
            if (!isAcbAwbExist)
            {
                res.Add("音频 ACB / AWB 缺失");
            }

            if (StaticSettings.GenreList.All(it => it.Id != GenreId))
            {
                res.Add("无效的流派");
            }

            if (StaticSettings.VersionList.All(it => it.Id != AddVersionId))
            {
                res.Add("无效的版本");
            }

            if (Charts.All(it => !it.Enable))
            {
                res.Add("没有启用的谱面");
            }

            if (GenreId == 107 && !Charts[0].Enable)
            {
                res.Add("宴会场必须启用绿谱");
            }

            if (GenreId == 107 && Id < 100000)
            {
                res.Add("宴会场歌曲的 ID 小于 100000");
            }

            return res;
        }
    }

    public void Delete()
    {
        if (HasJacket)
        {
            FileSystem.DeleteFile(JacketPath);
        }

        if (StaticSettings.AcbAwb.TryGetValue($"music{NonDxId:000000}.acb", out var acb))
        {
            FileSystem.DeleteFile(acb);
        }

        if (StaticSettings.AcbAwb.TryGetValue($"music{NonDxId:000000}.awb", out var awb))
        {
            FileSystem.DeleteFile(awb);
        }

        if (StaticSettings.MovieDataMap.TryGetValue(NonDxId, out var movieData))
        {
            FileSystem.DeleteFile(movieData);
        }

        FileSystem.DeleteDirectory(Path.GetDirectoryName(FilePath), DeleteDirectoryOption.DeleteAllContents);
    }
}