using MaiChartManager.Attributes;
using Microsoft.AspNetCore.Mvc;
using NAudio.Wave;
using Sitreamai;
using Standart.Hash.xxHash;

namespace MaiChartManager.Controllers.Music;

[ApiController]
[Route("MaiChartManagerServlet/[action]Api/{id:int}")]
public class CueConvertController(StaticSettings settings, ILogger<MusicController> logger) : ControllerBase
{
    private static async Task<string?> GetCachedWavPath(int id)
    {
        var awb = StaticSettings.AcbAwb.GetValueOrDefault($"music{(id % 10000):000000}.awb");
        if (awb is null)
        {
            return null;
        }

        string hash;
        await using (var readStream = System.IO.File.OpenRead(awb))
        {
            hash = (await xxHash64.ComputeHashAsync(readStream)).ToString();
        }

        var cachePath = Path.Combine(StaticSettings.tempPath, hash + ".wav");
        if (System.IO.File.Exists(cachePath)) return cachePath;

        var wav = Audio.AcbToWav(StaticSettings.AcbAwb[$"music{(id % 10000):000000}.acb"]);
        await System.IO.File.WriteAllBytesAsync(cachePath, wav);
        return cachePath;
    }

    [NoCache]
    [HttpGet]
    public async Task<ActionResult> GetMusicWav(int id)
    {
        var cachePath = await GetCachedWavPath(id);
        if (cachePath is null)
        {
            return NotFound();
        }

        return PhysicalFile(cachePath, "audio/wav");
    }

    [HttpPut]
    [DisableRequestSizeLimit]
    public void SetAudio(int id, [FromForm] float padding, IFormFile file, IFormFile? awb, IFormFile? preview)
    {
        id %= 10000;
        var targetAcbPath = Path.Combine(StaticSettings.StreamingAssets, settings.AssetDir, $@"SoundData\music{id:000000}.acb");
        var targetAwbPath = Path.Combine(StaticSettings.StreamingAssets, settings.AssetDir, $@"SoundData\music{id:000000}.awb");
        Directory.CreateDirectory(Path.GetDirectoryName(targetAcbPath));

        if (Path.GetExtension(file.FileName).Equals(".acb", StringComparison.InvariantCultureIgnoreCase))
        {
            if (awb is null) throw new Exception("acb 文件必须搭配 awb 文件");
            using var write = System.IO.File.Open(targetAcbPath, FileMode.Create);
            file.CopyTo(write);
            using var writeAwb = System.IO.File.Open(targetAwbPath, FileMode.Create);
            awb.CopyTo(writeAwb);
        }
        else
        {
            Audio.ConvertToMai(file.FileName, targetAcbPath, padding, file.OpenReadStream(), preview?.FileName, preview?.OpenReadStream());
        }

        StaticSettings.AcbAwb[$"music{id:000000}.acb"] = targetAcbPath;
        StaticSettings.AcbAwb[$"music{id:000000}.awb"] = targetAwbPath;
    }

    public record SetAudioPreviewRequest(double StartTime, double EndTime);

    [HttpPost]
    public async Task SetAudioPreview(int id, [FromBody] SetAudioPreviewRequest request)
    {
        if (IapManager.License != IapManager.LicenseStatus.Active) return;
        id %= 10000;
        var cachePath = await GetCachedWavPath(id);
        var targetAcbPath = StaticSettings.AcbAwb[$"music{id:000000}.acb"];
        if (cachePath is null) throw new Exception("音频文件不存在");

        await using var srcAudioFile = new AudioFileReader(cachePath);
        var sample = srcAudioFile.ToSampleProvider().Skip(TimeSpan.FromSeconds(request.StartTime)).Take(TimeSpan.FromSeconds(request.EndTime - request.StartTime));

        var stream = new MemoryStream();
        WaveFileWriter.WriteWavFileToStream(stream, sample.ToWaveProvider16());
        stream.Position = 0;

        Audio.ConvertToMai(cachePath, targetAcbPath, 0, null, cachePath, stream);
    }
}
