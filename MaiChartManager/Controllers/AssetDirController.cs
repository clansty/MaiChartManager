using System.IO.Compression;
using MaiChartManager.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Net.Http.Headers;
using Microsoft.VisualBasic.FileIO;

namespace MaiChartManager.Controllers;

[ApiController]
[Route("MaiChartManagerServlet/[action]Api")]
public class AssetDirController(StaticSettings settings, ILogger<AssetDirController> logger) : ControllerBase
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
        return System.IO.File.ReadAllText(Path.Combine(StaticSettings.StreamingAssets, req.DirName, req.FileName));
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
        System.IO.File.WriteAllText(Path.Combine(StaticSettings.StreamingAssets, req.DirName, req.FileName), req.Content);
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
            destName = settings.GetFreeAssetDir();
        }

        var dest = Path.Combine(StaticSettings.StreamingAssets, destName);
        logger.LogInformation("Src: {src} Dest: {dest}", src, dest);
        FileSystem.CopyDirectory(src, dest, UIOption.AllDialogs);
        settings.RescanAll();
    }

    public record UploadAssetDirResult(string DirName);

    [HttpPost]
    // https://code-maze.com/aspnetcore-upload-large-files/
    [DisableRequestSizeLimit]
    [DisableFormValueModelBinding]
    [Route("{destName}")]
    // 看起来就算用 IAsyncEnumerable 获取文件，还是会等所以文件都上传完了再调用这个方法
    // 而且不知道为什么上传到一半会 Network Error
    public async Task<UploadAssetDirResult> UploadAssetDir(string? destName)
    {
        logger.LogInformation("UploadAssetDir");

        if (destName is null || !StaticSettings.ADirRegex().IsMatch(destName) || StaticSettings.AssetsDirs.Contains(destName))
        {
            destName = settings.GetFreeAssetDir();
        }

        var dest = Path.Combine(StaticSettings.StreamingAssets, destName);

        // https://stackoverflow.com/questions/36437282/dealing-with-large-file-uploads-on-asp-net-core-1-0
        var boundary = HeaderUtilities.RemoveQuotes(MediaTypeHeaderValue.Parse(Request.ContentType).Boundary).Value;
        var reader = new MultipartReader(boundary!, Request.Body);
        var section = await reader.ReadNextSectionAsync();

        while (section != null)
        {
            if (ContentDispositionHeaderValue.TryParse(section.ContentDisposition, out var contentDisposition))
            {
                if (contentDisposition.DispositionType.Equals("form-data") && !string.IsNullOrEmpty(contentDisposition.FileName.Value))
                {
                    var fileName = contentDisposition.FileName.Value;
                    await using var stream = section.Body;
                    // 处理文件流
                    logger.LogInformation("UploadAssetDir: {destName} {file}", destName, fileName);
                    var filePath = Path.Combine(dest, fileName.TrimStart('/', '\\'));
                    Directory.CreateDirectory(Path.GetDirectoryName(filePath));
                    await using var fileStream = new FileStream(filePath, FileMode.Create);
                    await stream.CopyToAsync(fileStream);
                }
            }

            section = await reader.ReadNextSectionAsync();
        }

        settings.RescanAll();

        return new UploadAssetDirResult(destName);
    }
}
