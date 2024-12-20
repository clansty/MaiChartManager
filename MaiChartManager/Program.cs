using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text.Json;
using Windows.ApplicationModel;
using MaiChartManager.Controllers.Music;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using Xabe.FFmpeg;

namespace MaiChartManager;

public static partial class Program
{
    public const string Version = "1.3.2";
    public static Browser? BrowserWin { get; set; }

    [LibraryImport("kernel32.dll", SetLastError = true)]
    private static partial void SetConsoleOutputCP(uint wCodePageID);

    private static ILoggerFactory _loggerFactory = LoggerFactory.Create(builder =>
    {
        builder.AddConsole();
        builder.SetMinimumLevel(LogLevel.Information);
    });

    public static ILogger GetLogger<T>() => _loggerFactory.CreateLogger<T>();

    /// <summary>
    ///  The main entry point for the application.
    /// </summary>
    [STAThread]
    public static void Main()
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
            FFmpeg.SetExecutablesPath(StaticSettings.exeDir);
            MovieConvertController.CheckHardwareAcceleration();

            Directory.CreateDirectory(StaticSettings.appData);
            Directory.CreateDirectory(StaticSettings.tempPath);
            if (File.Exists(Path.Combine(StaticSettings.appData, "config.json")))
                StaticSettings.Config = JsonSerializer.Deserialize<Config>(File.ReadAllText(Path.Combine(StaticSettings.appData, "config.json")));
            IapManager.Init();

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