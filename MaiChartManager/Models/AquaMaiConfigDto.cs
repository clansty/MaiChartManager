using System.Text.Json;
using AquaMai.Config.Interfaces;

namespace MaiChartManager.Models;

public static class AquaMaiConfigDto
{
    public record Entry(string Path, string Name, IConfigEntryAttribute Attribute, string FieldType);

    public record Section(string Path, IEnumerable<Entry> Entries, IConfigSectionAttribute Attribute);

    public record ConfigDto(
        IEnumerable<Section> Sections,
        Dictionary<string, IConfig.ISectionState> SectionStates,
        Dictionary<string, IConfig.IEntryState> EntryStates,
        Dictionary<string, string[]>? ConfigSort
    );

    public record SectionSaveDto : IConfig.ISectionState
    {
        public bool IsDefault { get; set; }
        public bool DefaultEnabled { get; init; }
        public bool Enabled { get; set; }
    }

    public record EntrySaveDto
    {
        public bool IsDefault { get; set; }
        public object DefaultValue { get; init; }
        public JsonElement Value { get; set; }
    }

    public record ConfigSaveDto(Dictionary<string, SectionSaveDto> SectionStates, Dictionary<string, EntrySaveDto> EntryStates);
}