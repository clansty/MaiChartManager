using System.Runtime.InteropServices;
using SingleInstanceCore;

namespace MaiChartManager;

public static partial class Program
{
    [LibraryImport("kernel32.dll", SetLastError = true)]
    private static partial void SetConsoleOutputCP(uint wCodePageID);

    /// <summary>
    ///  The main entry point for the application.
    /// </summary>
    [STAThread]
    public static void Main()
    {
        SetConsoleOutputCP(65001);

        var app = new AppMain();

        var isFirstInstance = app.InitializeAsFirstInstance("MaiChartManager");
        if (isFirstInstance)
        {
            try
            {
                app.Run();
            }
            finally
            {
                SingleInstance.Cleanup();
            }
        }
    }
}