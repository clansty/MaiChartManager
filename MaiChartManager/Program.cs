using System.Runtime.InteropServices;
using System.Text.Json;
using MaiChartManager.Controllers;
using Xabe.FFmpeg;

namespace MaiChartManager;

static class Program
{
    public static Browser? BrowserWin { get; set; }

    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern bool SetConsoleOutputCP(uint wCodePageID);

    /// <summary>
    ///  The main entry point for the application.
    /// </summary>
    [STAThread]
    static void Main()
    {
        SetConsoleOutputCP(65001);
        try
        {
            SentrySdk.Init(o =>
                {
                    // Tells which project in Sentry to send events to:
                    o.Dsn = "https://be7a9ae3a9a88f4660737b25894b3c20@sentry.c5y.moe/3";
                    // Set TracesSampleRate to 1.0 to capture 100% of transactions for tracing.
                    // We recommend adjusting this value in production.
                    o.TracesSampleRate = 0.5;
# if DEBUG
                    o.Environment = "development";
# endif
                }
            );

            Application.SetUnhandledExceptionMode(UnhandledExceptionMode.ThrowException);
            ApplicationConfiguration.Initialize();
            FFmpeg.SetExecutablesPath(Path.Combine(StaticSettings.exeDir, "FFMpeg"));
            IapManager.Init();
            MovieConvertController.CheckHardwareAcceleration();

            Directory.CreateDirectory(StaticSettings.appData);
            Directory.CreateDirectory(StaticSettings.tempPath);
            if (File.Exists(Path.Combine(StaticSettings.appData, "config.json")))
                StaticSettings.Config = JsonSerializer.Deserialize<Config>(File.ReadAllText(Path.Combine(StaticSettings.appData, "config.json")));

            new Launcher();

            Application.Run();
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            MessageBox.Show(e.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            throw;
        }
    }
}
