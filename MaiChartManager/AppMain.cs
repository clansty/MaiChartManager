using SingleInstanceCore;
using System.Text.Json;
using MaiChartManager.Controllers.Music;
using Xabe.FFmpeg;

namespace MaiChartManager;

public class AppMain : ISingleInstance
{
    public const string Version = "1.4.2";
    public static Browser? BrowserWin { get; set; }

    private Launcher _launcher;

    private static ILoggerFactory _loggerFactory = LoggerFactory.Create(builder =>
    {
        builder.AddConsole();
        builder.SetMinimumLevel(LogLevel.Information);
    });

    public static ILogger GetLogger<T>() => _loggerFactory.CreateLogger<T>();

    public void Run()
    {
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
            var cfgFilePath = Path.Combine(StaticSettings.appData, "config.json");
            if (File.Exists(cfgFilePath))
            {
                try
                {
                    StaticSettings.Config = JsonSerializer.Deserialize<Config>(File.ReadAllText(Path.Combine(StaticSettings.appData, "config.json")));
                }
                catch (Exception e)
                {
                    SentrySdk.CaptureException(e, s => s.TransactionName = "读取配置文件");
                    MessageBox.Show("看起来配置文件损坏了…已经重置配置文件", "不太对劲", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    File.Delete(cfgFilePath);
                }
            }

            IapManager.Init();

            _launcher = new Launcher();

            Application.Run();
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            MessageBox.Show(e.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            throw;
        }
    }

    public void OnInstanceInvoked(string[] args)
    {
        _launcher.ShowWindow();
    }
}