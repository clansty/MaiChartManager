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

        Directory.CreateDirectory(StaticSettings.appData);
        if (File.Exists(Path.Combine(StaticSettings.appData, "config.json")))
            StaticSettings.Config = JsonSerializer.Deserialize<Config>(File.ReadAllText(Path.Combine(StaticSettings.appData, "config.json")));

        new Launcher().Show();

        Application.Run();
    }
}
