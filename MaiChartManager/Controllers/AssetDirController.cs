using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic.FileIO;

namespace MaiChartManager.Controllers;

[ApiController]
[Route("MaiChartManagerServlet/[action]Api")]
public class AssetDirController
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
}
