using System.Text.Json;
using System.Windows.Forms;

namespace MaiChartManager;

static class Program
{
    /// <summary>
    ///  The main entry point for the application.
    /// </summary>
    [STAThread]
    static void Main()
    {
        SentrySdk.Init(o =>
            {
                // Tells which project in Sentry to send events to:
                o.Dsn = "https://be7a9ae3a9a88f4660737b25894b3c20@sentry.c5y.moe/3";
                // Set TracesSampleRate to 1.0 to capture 100% of transactions for tracing.
                // We recommend adjusting this value in production.
                o.TracesSampleRate = 0.5;
            }
        );
        // Configure WinForms to throw exceptions so Sentry can capture them.
        Application.SetUnhandledExceptionMode(UnhandledExceptionMode.ThrowException);

        // To customize application configuration such as set high DPI settings or default font,
        // see https://aka.ms/applicationconfiguration.
        ApplicationConfiguration.Initialize();

        if (File.Exists(Path.Combine(Application.LocalUserAppDataPath, "config.json")))
            StaticSettings.Config = JsonSerializer.Deserialize<Config>(File.ReadAllText(Path.Combine(Application.LocalUserAppDataPath, "config.json")));

        new Launcher().Show();

        Application.Run();
    }
}
