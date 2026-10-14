using System.Text.Json;
using System.Text.Json.Serialization;
using AquaMai.Config.Interfaces;

namespace AquaMai.Config.Dto;

/// <summary>
/// AquaMai 配置的 JSON 契约。
///
/// 有两个产出方，形状必须一致，因此放在这里共用：
/// - MCM 后端（<c>ConfigurationController</c>）直接从已安装的 AquaMai.dll 解析后返回；
/// - 浏览器里的 <c>AquaMai.Config.Wasm</c>（给独立编辑器用）。
///
/// 前端 <c>@aquamai/config-editor</c> 的 <c>src/types.ts</c> 就是照着这份契约写的，
/// 改动这里必须同步改那边。
/// </summary>
public static class AquaMaiConfigDto
{
    public sealed record Comment(string? CommentEn, string? CommentZh, string? NameZh);

    public sealed record EntryAttribute(Comment Comment, bool HideWhenDefault);

    public sealed record SectionAttribute(Comment Comment, bool ExampleHidden, bool DefaultOn, bool AlwaysEnabled);

    public sealed record Entry(string Path, string Name, EntryAttribute Attribute, string FieldType);

    public sealed record Section(string Path, IReadOnlyList<Entry> Entries, SectionAttribute Attribute);

    public sealed record SectionState(bool IsDefault, bool DefaultEnabled, bool Enabled);

    public sealed record EntryState(bool IsDefault, JsonElement DefaultValue, JsonElement Value);

    public sealed record ConfigDto(
        IReadOnlyList<Section> Sections,
        IReadOnlyDictionary<string, SectionState> SectionStates,
        IReadOnlyDictionary<string, EntryState> EntryStates,
        // 由 configSort.yaml 原文提供，前端解析（省得两边各带一个 YAML 解析器）
        string? ConfigSortYaml);

    public sealed record EntrySave(bool IsDefault, JsonElement DefaultValue, JsonElement Value);

    public sealed record SectionSave(bool IsDefault, bool DefaultEnabled, bool Enabled);

    public sealed record ConfigSave(
        IReadOnlyDictionary<string, SectionSave> SectionStates,
        IReadOnlyDictionary<string, EntrySave> EntryStates);

    // 以下是 WASM 桥的返回值，MCM 不走这两个（MCM 用异常表达失败）
    public sealed record ParseResult(
        bool Success,
        string? ErrorMessage,
        ConfigDto? Config,
        string? ApiVersion,
        string? ModVersion,
        string? OriginalConfigVersion,
        string? LatestConfigVersion);

    public sealed record SerializeResult(bool Success, string? ErrorMessage, string? Toml, string? ConfigVersion);

    /// <summary>
    /// 序列化配置值。枚举必须转成名字：前端的 Select 选项用的就是枚举名。
    /// </summary>
    private static readonly JsonSerializerOptions ValueJsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        Converters = { new JsonStringEnumConverter() }
    };

    /// <summary>
    /// 把已解析的配置映射成传输对象。
    /// </summary>
    /// <param name="configSortYaml">AquaMai.dll 里嵌入的 configSort.yaml 原文，没有则为 null。</param>
    public static ConfigDto From(IConfig config, string? configSortYaml)
    {
        var sections = config.ReflectionManager.Sections
            .Select(section => new Section(
                section.Path,
                section.Entries
                    .Select(entry => new Entry(
                        entry.Path,
                        entry.Name,
                        ToDto(entry.Attribute),
                        entry.Field.FieldType.FullName ?? entry.Field.FieldType.Name))
                    .ToArray(),
                ToDto(section.Attribute)))
            .ToArray();

        var sectionStates = config.ReflectionManager.Sections.ToDictionary(
            section => section.Path,
            section =>
            {
                var state = config.GetSectionState(section);
                return new SectionState(state.IsDefault, state.DefaultEnabled, state.Enabled);
            });

        var entryStates = config.ReflectionManager.Entries.ToDictionary(
            entry => entry.Path,
            entry =>
            {
                var state = config.GetEntryState(entry);
                return new EntryState(state.IsDefault, SerializeValue(state.DefaultValue), SerializeValue(state.Value));
            });

        return new ConfigDto(sections, sectionStates, entryStates, configSortYaml);
    }

    public static JsonElement SerializeValue(object? value) =>
        value is null
            ? JsonSerializer.SerializeToElement<object?>(null, ValueJsonOptions)
            : JsonSerializer.SerializeToElement(value, value.GetType(), ValueJsonOptions);

    public static Comment ToDto(IConfigComment comment) =>
        new(comment.CommentEn, comment.CommentZh, comment.NameZh);

    public static EntryAttribute ToDto(IConfigEntryAttribute attribute) =>
        new(ToDto(attribute.Comment), attribute.HideWhenDefault);

    public static SectionAttribute ToDto(IConfigSectionAttribute attribute) =>
        new(ToDto(attribute.Comment), attribute.ExampleHidden, attribute.DefaultOn, attribute.AlwaysEnabled);
}
