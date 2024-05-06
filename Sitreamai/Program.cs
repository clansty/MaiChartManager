using System.IO;
using System.Linq;
using Microsoft.Extensions.Logging;
using Sitreamai;

using var factory = LoggerFactory.Create(builder => builder.AddConsole());
var logger = factory.CreateLogger($"Main");

logger.LogInformation("FromDir: {}", args[1]);
logger.LogInformation("AssetsDir: {}", args[0]);

var musicDir = Path.Join(args[0], "music");
var musicEntities = Directory.EnumerateDirectories(musicDir);

var musicId = 5000;
if (musicEntities.Any())
{
    musicId = musicEntities.Select(it => int.Parse(it[^4..])).Max() + 1;
}

logger.LogInformation("自动选择歌曲 ID: {}", musicId);

if (!File.Exists(Path.Join(args[1], "maidata.txt")))
{
    logger.LogInformation("批量模式");
    var fromDirs = Directory.EnumerateDirectories(args[1]);
    foreach (var fromDir in fromDirs)
    {
        var converter = new Converter(musicId++, fromDir, args[0]);
        converter.Convert();
    }
}
else
{
    var converter = new Converter(musicId, args[1], args[0]);
    converter.Convert();
}