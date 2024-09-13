using System.Diagnostics;

namespace MaiChartManager.WannaCRI;

public static class WannaCRI
{
    public static async Task CreateUsmAsync(string src, string key = "0x7F4551499DF55E68")
    {
        var psi = new ProcessStartInfo
        {
            FileName = Path.Combine(StaticSettings.exeDir, "WannaCRI", "WannaCRI.exe"),
            UseShellExecute = false,
            RedirectStandardOutput = true,
            CreateNoWindow = true,
            WorkingDirectory = Path.GetDirectoryName(src),
            Arguments = $"createusm \"{src}\" --key {key}"
        };
        psi.Environment["PATH"] = $"{Path.Combine(StaticSettings.exeDir, "FFMpeg")};{Environment.GetEnvironmentVariable("PATH")}";
        var process = Process.Start(psi);
        await process.WaitForExitAsync();
    }
}
