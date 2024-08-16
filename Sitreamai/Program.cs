using System.CommandLine;
using System.IO;
using System.Linq;
using Microsoft.Extensions.Logging;
using Sitreamai;

var musicId = new Option<int>(
    name: "--id",
    description: "歌曲 ID",
    getDefaultValue: () => 0);

var fromDir = new Option<string>(
    name: "--from",
    description: "谱面目录",
    getDefaultValue: () => "."
);

var assetsDir = new Option<string>(
    name: "--assets",
    description: "A500 目录"
) { IsRequired = true };

var rootCommand = new RootCommand("Simai 谱面上机工具")
{
    musicId, fromDir, assetsDir
};

using var factory = LoggerFactory.Create(builder => builder.AddConsole());
var logger = factory.CreateLogger($"Main");

rootCommand.SetHandler((musicId, from, assetsDir) =>
    {
        if (musicId == 0)
        {
            var musicDir = Path.Join(assetsDir, "music");
            var musicEntities = Directory.EnumerateDirectories(musicDir);

            musicId = 5000;
            if (musicEntities.Any())
            {
                musicId = musicEntities.Select(it => int.Parse(it[^4..])).Max() + 1;
            }
        }

        if (!File.Exists(Path.Join(from, "maidata.txt")))
        {
            logger.LogInformation("批量模式");
            var fromDirs = Directory.EnumerateDirectories(from);
            foreach (var fromDir in fromDirs)
            {
                var localMusicId = musicId++;
                if (int.TryParse(Path.GetFileName(fromDir), out var dirId))
                {
                    localMusicId = dirId;
                }
                var converter = new Converter(localMusicId, fromDir, assetsDir);
                converter.Convert();
            }
        }
        else
        {
            var converter = new Converter(musicId, from, assetsDir);
            converter.Convert();
        }
    },
    musicId, fromDir, assetsDir);

await rootCommand.InvokeAsync(args);
