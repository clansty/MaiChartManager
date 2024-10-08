﻿using System.Diagnostics;

namespace MaiChartManager.WannaCRI;

public static class WannaCRI
{
    private static async Task RunWannaCRIWithArgsAsync(string args, string workDir)
    {
        var psi = new ProcessStartInfo
        {
            FileName = Path.Combine(StaticSettings.exeDir, "WannaCRI", "WannaCRI.exe"),
            UseShellExecute = false,
            CreateNoWindow = true,
            WorkingDirectory = workDir,
            Arguments = args,
        };
        psi.Environment["PATH"] = $"{Path.Combine(StaticSettings.exeDir, "FFMpeg")};{Environment.GetEnvironmentVariable("PATH")}";
        var process = Process.Start(psi);
        await process.WaitForExitAsync();
    }

    private const string defaultKey = "0x7F4551499DF55E68";

    public static async Task CreateUsmAsync(string src, string key = defaultKey)
    {
        await RunWannaCRIWithArgsAsync($"createusm \"{src}\" --key {key}", Path.GetDirectoryName(src));
    }

    public static async Task UnpackUsmAsync(string src, string key = defaultKey)
    {
        await RunWannaCRIWithArgsAsync($"extractusm \"{src}\" --key {key}", Path.GetDirectoryName(src));
    }
}
