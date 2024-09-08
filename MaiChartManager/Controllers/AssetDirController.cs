using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic.FileIO;

namespace MaiChartManager.Controllers;

[ApiController]
[Route("MaiChartManagerServlet/[action]Api")]
public class AssetDirController(StaticSettings settings, ILogger<AssetDirController> logger)
{
    [HttpPost]
    public void CreateAssetDir([FromBody] string dir)
    {
        Directory.CreateDirectory(Path.Combine(StaticSettings.StreamingAssets, dir));
    }

    [HttpDelete]
    public void DeleteAssetDir([FromBody] string dir)
    {
        FileSystem.DeleteDirectory(Path.Combine(StaticSettings.StreamingAssets, dir), UIOption.AllDialogs, RecycleOption.SendToRecycleBin);
    }

    public record GetAssetsDirsResult(string DirName, IEnumerable<string> SubFiles);

    [HttpGet]
    public IEnumerable<GetAssetsDirsResult> GetAssetsDirs()
    {
        return StaticSettings.AssetsDirs.Select(path => new GetAssetsDirsResult(path, Directory.EnumerateFiles(Path.Combine(StaticSettings.StreamingAssets, path)).Select(Path.GetFileName)!));
    }

    public record GetAssetDirTxtValueRequest(string DirName, string FileName);

    [HttpPost]
    public string GetAssetDirTxtValue([FromBody] GetAssetDirTxtValueRequest req)
    {
        return File.ReadAllText(Path.Combine(StaticSettings.StreamingAssets, req.DirName, req.FileName));
    }

    [HttpDelete]
    public void DeleteAssetDirTxt([FromBody] GetAssetDirTxtValueRequest req)
    {
        FileSystem.DeleteFile(Path.Combine(StaticSettings.StreamingAssets, req.DirName, req.FileName), UIOption.OnlyErrorDialogs, RecycleOption.SendToRecycleBin);
    }

    public record PutAssetDirTxtValueRequest(string DirName, string FileName, string Content);

    [HttpPut]
    public void PutAssetDirTxtValue([FromBody] PutAssetDirTxtValueRequest req)
    {
        File.WriteAllText(Path.Combine(StaticSettings.StreamingAssets, req.DirName, req.FileName), req.Content);
    }

    [HttpPost]
    public void RequestLocalImportDir()
    {
        if (Program.BrowserWin is null) return;
        var dialog = new FolderBrowserDialog
        {
            Description = "请选择资源目录（OPT）的文件夹",
            ShowNewFolderButton = false
        };
        if (Program.BrowserWin.Invoke(() => dialog.ShowDialog(Program.BrowserWin)) != DialogResult.OK) return;
        var src = dialog.SelectedPath;
        logger.LogInformation("LocalImportDir: {src}", src);
        if (src is null) return;
        var destName = Path.GetFileName(src);
        if (!StaticSettings.ADirRegex().IsMatch(destName))
        {
            var maybeRealDir = Directory.EnumerateDirectories(src).FirstOrDefault(it => StaticSettings.ADirRegex().IsMatch(Path.GetFileName(it)));
            if (maybeRealDir is not null)
            {
                src = maybeRealDir;
                destName = Path.GetFileName(src);
            }
        }

        if (!StaticSettings.ADirRegex().IsMatch(destName) || StaticSettings.AssetsDirs.Contains(destName))
        {
            var id = 0;
            // 找到下一个未被使用的名称
            foreach (var dir in StaticSettings.AssetsDirs)
            {
                var strId = StaticSettings.ADirRegex().Match(dir).Groups[1].Value;
                var num = int.Parse(strId);
                if (num > id) id = num;
            }

            id++;
            if (id > 999)
            {
                id = 999;
                while (StaticSettings.AssetsDirs.Contains($"A{id:000}"))
                {
                    id--;
                }
            }

            destName = $"A{id:000}";
        }

        var dest = Path.Combine(StaticSettings.StreamingAssets, destName);
        logger.LogInformation("Src: {src} Dest: {dest}", src, dest);
        FileSystem.CopyDirectory(src, dest, UIOption.AllDialogs);
        settings.ScanGenre();
        settings.ScanVersionList();
        settings.ScanAssetBundles();
        settings.ScanSoundData();
        settings.ScanMovieData();
    }
}
