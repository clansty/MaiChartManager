using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic.FileIO;
using Xabe.FFmpeg;

namespace MaiChartManager.Controllers.Music;

[ApiController]
[Route("MaiChartManagerServlet/[action]Api/{assetDir}/{id:int}")]
public class MovieConvertController(StaticSettings settings, ILogger<MovieConvertController> logger) : ControllerBase
{
    public enum HardwareAccelerationStatus
    {
        Pending,
        Enabled,
        Disabled
    }

    public static HardwareAccelerationStatus HardwareAcceleration { get; private set; } = HardwareAccelerationStatus.Pending;

    public static async Task CheckHardwareAcceleration()
    {
        var tmpDir = Directory.CreateTempSubdirectory();
        try
        {
            var blankPath = Path.Combine(tmpDir.FullName, "blank.ivf");
            await FFmpeg.Conversions.New()
                .SetOutputTime(TimeSpan.FromSeconds(2))
                .SetInputFormat(Format.lavfi)
                .AddParameter("-i color=c=black:s=720x720:r=1")
                .AddParameter("-c:v vp9_qsv")
                .UseMultiThread(true)
                .SetOutput(blankPath)
                .Start();
            HardwareAcceleration = HardwareAccelerationStatus.Enabled;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            HardwareAcceleration = HardwareAccelerationStatus.Disabled;
        }
    }

    private static string Vp9Encoding => HardwareAcceleration == HardwareAccelerationStatus.Enabled ? "vp9_qsv" : "vp9";

    public enum SetMovieEventType
    {
        Progress,
        Success,
        Error
    }

    private static IConversion Concatenate(string vf, params IMediaInfo[] mediaInfos)
    {
        var conversion = FFmpeg.Conversions.New();
        foreach (var inputVideo in mediaInfos)
        {
            conversion.AddParameter("-i " + inputVideo.Path.Escape() + " ");
        }

        conversion.AddParameter("-filter_complex \"");
        var videoStream = mediaInfos.Select((Func<IMediaInfo, IVideoStream>)(x => x.VideoStreams.OrderByDescending<IVideoStream, int>(z => z.Width).First())).OrderByDescending((Func<IVideoStream, int>)(x => x.Width)).First();
        for (var index = 0; index < mediaInfos.Length; ++index)
            conversion.AddParameter($"[{index}:v] ");
        conversion.AddParameter($"concat=n={mediaInfos.Length}:v=1 [v]; [v]{vf}[vout]\" -map \"[vout]\"");

        conversion.AddParameter("-aspect " + videoStream.Ratio);
        return conversion;
    }

    [HttpPut]
    [DisableRequestSizeLimit]
    public async Task SetMovie(int id, [FromForm] double padding, IFormFile file, [FromForm] bool noScale, [FromForm] bool h264, string assetDir)
    {
        h264 = true;
        id %= 10000;

        if (Path.GetExtension(file.FileName).Equals(".dat", StringComparison.InvariantCultureIgnoreCase))
        {
            var targetPath = Path.Combine(StaticSettings.StreamingAssets, assetDir, $@"MovieData\{id:000000}.dat");
            Directory.CreateDirectory(Path.GetDirectoryName(targetPath));
            await using var stream = System.IO.File.Open(targetPath, FileMode.Create);
            await file.CopyToAsync(stream);
            StaticSettings.MovieDataMap[id] = targetPath;
            return;
        }

        if (IapManager.License != IapManager.LicenseStatus.Active) return;
        Response.Headers.Append("Content-Type", "text/event-stream");
        var tmpDir = Directory.CreateTempSubdirectory();
        logger.LogInformation("Temp dir: {tmpDir}", tmpDir.FullName);
        // Convert vp9
        var outVideoPath = Path.Combine(tmpDir.FullName, h264 ? "out.mp4" : "out.ivf");
        try
        {
            var srcFilePath = Path.Combine(tmpDir.FullName, Path.GetFileName(file.FileName));
            var srcFileStream = System.IO.File.OpenWrite(srcFilePath);
            await file.CopyToAsync(srcFileStream);
            await srcFileStream.DisposeAsync();

            var srcMedia = await FFmpeg.GetMediaInfo(srcFilePath);
            var firstStream = h264 ? srcMedia.VideoStreams.First().SetCodec(VideoCodec.h264) : srcMedia.VideoStreams.First().SetCodec(Vp9Encoding);
            var conversion = FFmpeg.Conversions.New()
                .AddStream(firstStream);
            if (file.ContentType.StartsWith("image/"))
            {
                padding = 0;
                conversion.AddParameter("-r 1 -t 2");
                conversion.AddParameter("-loop 1", ParameterPosition.PreInput);
            }

            if (padding is > 0 and < 0.05)
            {
                padding = 0;
            }

            var vf = "";
            if (!noScale)
            {
                var scale = h264 ? 2160 : 1080;
                vf = $"scale={scale}:-1,pad=2160:2160:(2160-iw)/2:(2160-ih)/2:black";
            }

            if (padding < 0)
            {
                conversion.SetSeek(TimeSpan.FromSeconds(-padding));
            }
            else if (padding > 0)
            {
                var blankPath = Path.Combine(tmpDir.FullName, "blank.mp4");
                var blank = FFmpeg.Conversions.New()
                    .SetOutputTime(TimeSpan.FromSeconds(padding))
                    .SetInputFormat(Format.lavfi)
                    .AddParameter($"-i color=c=black:s={srcMedia.VideoStreams.First().Width}x{srcMedia.VideoStreams.First().Height}:r=30")
                    .UseMultiThread(true)
                    .SetOutput(blankPath);
                logger.LogInformation("About to run FFMpeg with params: {params}", blank.Build());
                await blank.Start();
                var blankVideoInfo = await FFmpeg.GetMediaInfo(blankPath);
                conversion = Concatenate(vf, blankVideoInfo, srcMedia);
                conversion.AddParameter($"-c:v {(h264 ? "h264" : Vp9Encoding)}");
            }

            conversion
                .SetOutput(outVideoPath)
                .AddParameter("-hwaccel dxva2", ParameterPosition.PreInput)
                .UseMultiThread(true);
            if (!h264)
                conversion.AddParameter("-cpu-used 5");
            if (!noScale && padding <= 0)
            {
                conversion.AddParameter($"-vf {vf}");
            }

            logger.LogInformation("About to run FFMpeg with params: {params}", conversion.Build());
            conversion.OnProgress += async (sender, args) =>
            {
                await Response.WriteAsync($"event: {SetMovieEventType.Progress}\ndata: {args.Percent}\n\n");
                await Response.Body.FlushAsync();
            };
            await conversion.Start();
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to convert video");
            SentrySdk.CaptureException(e);
            await Response.WriteAsync($"event: {SetMovieEventType.Error}\ndata: 视频转换为 VP9 失败：{e.Message}\n\n");
            await Response.Body.FlushAsync();
            return;
        }

        // Convert ivf to usm
        if (!System.IO.File.Exists(outVideoPath) || new FileInfo(outVideoPath).Length == 0)
        {
            await Response.WriteAsync($"event: {SetMovieEventType.Error}\ndata: 视频转换为 VP9 失败：输出文件不存在\n\n");
            await Response.Body.FlushAsync();
            return;
        }

        var outputFile = Path.Combine(tmpDir.FullName, "out.usm");
        if (h264)
        {
            outputFile = outVideoPath;
        }
        else
            try
            {
                WannaCRI.WannaCRI.CreateUsm(outVideoPath);
                if (!System.IO.File.Exists(outputFile) || new FileInfo(outputFile).Length == 0)
                {
                    throw new Exception("Output file not found or empty");
                }
            }
            catch (Exception e)
            {
                logger.LogError(e, "Failed to convert ivf to usm");
                SentrySdk.CaptureException(e);
                await Response.WriteAsync($"event: {SetMovieEventType.Error}\ndata: 视频转换为 USM 失败：{e.Message}\n\n");
                await Response.Body.FlushAsync();
                return;
            }

        try
        {
            var targetPath = Path.Combine(StaticSettings.StreamingAssets, assetDir, $@"MovieData\{id:000000}.{(h264 ? "mp4" : "dat")}");
            Directory.CreateDirectory(Path.GetDirectoryName(targetPath));
            FileSystem.CopyFile(outputFile, targetPath, true);

            StaticSettings.MovieDataMap[id] = targetPath;
            await Response.WriteAsync($"event: {SetMovieEventType.Success}\ndata: {SetMovieEventType.Success}\n\n");
            await Response.Body.FlushAsync();
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to copy movie data");
            SentrySdk.CaptureException(e);
            await Response.WriteAsync($"event: {SetMovieEventType.Error}\ndata: 复制文件失败：{e.Message}\n\n");
            await Response.Body.FlushAsync();
        }
    }
}