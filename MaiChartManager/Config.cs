namespace MaiChartManager;

public class Config
{
    public bool Export { get; set; } = false;
    public string GamePath { get; set; } = "";
    public string OfflineKey { get; set; } = "";
    public bool UseAuth { get; set; } = false;
    public string AuthUsername { get; set; } = "";
    public string AuthPassword { get; set; } = "";
    public HashSet<string> HistoryPath { get; set; } = [];
}