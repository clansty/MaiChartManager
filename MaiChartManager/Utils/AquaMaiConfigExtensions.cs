using AquaMai.Config.Interfaces;

namespace MaiChartManager.Utils;

public static class AquaMaiConfigExtensions
{
    public static IConfig.IEntryState? GetEntryState(this IConfig config, string path)
    {
        try
        {
            var entry = config.ReflectionManager.GetEntry(path);
            return entry is null ? null : config.GetEntryState(entry);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return null;
        }
    }
}