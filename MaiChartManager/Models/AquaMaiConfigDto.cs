using AquaMai.Config.Interfaces;

namespace MaiChartManager.Models;

public static class AquaMaiConfigDto
{
    public record Entry(string Path, string Name, IConfigEntryAttribute Attribute, string FieldType);

    public record Section(string Path, IEnumerable<Entry> Entries, IConfigSectionAttribute Attribute);

    public record ConfigDto(IEnumerable<Section> Sections, Dictionary<string, IConfig.ISectionState> SectionStates, Dictionary<string, IConfig.IEntryState> EntryStates);

    public record ConfigSaveDto(Dictionary<string, IConfig.ISectionState> SectionStates, Dictionary<string, IConfig.IEntryState> EntryStates);
}