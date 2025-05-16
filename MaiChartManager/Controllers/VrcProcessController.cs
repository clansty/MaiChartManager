using MaiChartManager.Utils;
using Microsoft.AspNetCore.Mvc;
using Xabe.FFmpeg;

namespace MaiChartManager.Controllers;

[ApiController]
[Route("MaiChartManagerServlet/[action]Api")]
public class VrcProcessController(StaticSettings settings, ILogger<VrcProcessController> logger) : ControllerBase
{
    [HttpPost]
    public void GenAllMusicPreviewMp3ForVrc([FromForm] string targetDir, [FromForm] int maxConcurrency)
    {
        Task.Run(async () =>
        {
            // using var semaphore = new SemaphoreSlim(maxConcurrency);
            // var tasks = new List<Task>();
            var allAcb = StaticSettings.AcbAwb.Where(x => x.Key.StartsWith("music") && x.Key.EndsWith(".acb")).ToDictionary();
            foreach (var key in allAcb.Keys)
            {
                // await semaphore.WaitAsync();
                // tasks.Add(Task.Run(async () =>
                // {
                try
                {
                    var musicId = int.Parse(key[5..^4]);
                    var previewTime = CriUtils.GetAudioPreviewTime(allAcb[key]);
                    var wav = await AudioConvert.GetCachedWavPath(musicId);

                    if (wav is null)
                    {
                        logger.LogWarning("音频文件不存在 {musicId}", musicId);
                        continue;
                    }
                    if (previewTime.EndTime < previewTime.StartTime)
                    {
                        logger.LogWarning("previewTime.EndTime < previewTime.StartTime {musicId} {endTime} {startTime}", musicId, previewTime.EndTime, previewTime.StartTime);
                    }
                    var mp3Path = Path.Combine(targetDir, $"{musicId}.mp3");
                    // logger.LogInformation("转换中 {musicId}", musicId);
                    var conversion = await FFmpeg.Conversions.FromSnippet
                        .Split(wav, mp3Path, TimeSpan.FromSeconds(previewTime.StartTime), TimeSpan.FromSeconds(previewTime.EndTime - previewTime.StartTime));

                    await conversion.SetOutputFormat(Format.mp3)
                        .Start();
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "处理音频文件出错 {key}", key);
                }
                //     finally
                //     {
                //         semaphore.Release(); // 释放信号量
                //     }
                // }));
            }

            // await Task.WhenAll(tasks);
        });
    }
}