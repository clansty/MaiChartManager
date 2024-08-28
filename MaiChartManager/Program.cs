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
        // To customize application configuration such as set high DPI settings or default font,
        // see https://aka.ms/applicationconfiguration.
        ApplicationConfiguration.Initialize();

        if (File.Exists(Path.Combine(Application.LocalUserAppDataPath, "config.json")))
            StaticSettings.Config = JsonSerializer.Deserialize<Config>(File.ReadAllText(Path.Combine(Application.LocalUserAppDataPath, "config.json")));

        new Launcher().Show();

        Application.Run();
    }
}
