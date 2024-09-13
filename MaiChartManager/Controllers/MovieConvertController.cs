using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic.FileIO;
using Xabe.FFmpeg;

namespace MaiChartManager.Controllers;

[ApiController]
[Route("MaiChartManagerServlet/[action]Api/{id:int}")]
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

    [HttpPut]
    [DisableRequestSizeLimit]
    public async Task SetMovie(int id, [FromForm] float padding, IFormFile file)
    {
        Response.Headers.Append("Content-Type", "text/event-stream");
        var tmpDir = Directory.CreateTempSubdirectory();
        logger.LogInformation("Temp dir: {tmpDir}", tmpDir.FullName);
        // Convert vp9
        string outVideoPath;
        try
        {
            var srcFilePath = Path.Combine(tmpDir.FullName, Path.GetFileName(file.FileName));
            var srcFileStream = System.IO.File.OpenWrite(srcFilePath);
            await file.CopyToAsync(srcFileStream);
            await srcFileStream.DisposeAsync();

            var srcMedia = await FFmpeg.GetMediaInfo(srcFilePath);
            var conversion = FFmpeg.Conversions.New()
                .AddParameter("-hwaccel dxva2", ParameterPosition.PreInput)
                .UseMultiThread(true)
                .AddParameter("-cpu-used 5");
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
                    .AddParameter("-i color=c=black:s=720x720:r=1")
                    .UseMultiThread(true)
                    .SetOutput(blankPath);
                logger.LogInformation("About to run FFMpeg with params: {params}", blank.Build());
                await blank.Start();
                var blankVideoInfo = await FFmpeg.GetMediaInfo(blankPath);
                conversion.AddStream(blankVideoInfo.VideoStreams.First().SetCodec(Vp9Encoding));
            }

            outVideoPath = Path.Combine(tmpDir.FullName, "out.ivf");
            conversion
                .AddStream(srcMedia.VideoStreams.First().SetCodec(Vp9Encoding))
                .SetOutput(outVideoPath);
            logger.LogInformation("About to run FFMpeg with params: {params}", conversion.Build());
            conversion.OnProgress += async (sender, args) =>
            {
                logger.LogInformation("FFMpeg progress: {progress}", args.Percent);
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
        var outputFile = Path.Combine(tmpDir.FullName, "out.usm");
        try
        {
            await WannaCRI.WannaCRI.CreateUsmAsync(outVideoPath);
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
            var targetPath = Path.Combine(StaticSettings.StreamingAssets, settings.AssetDir, $@"MovieData\{id:000000}.dat");
            Directory.CreateDirectory(Path.GetDirectoryName(targetPath));
            FileSystem.CopyFile(outputFile, targetPath, true);

            StaticSettings.MovieDataMap[id] = targetPath;
            await Response.WriteAsync($"event: {SetMovieEventType.Success}\n\n");
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
