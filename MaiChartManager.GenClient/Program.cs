// MaiChartManager.GenClient — 生成前端 API 客户端的最小化开发工具
// 启动仅含 Swagger 的 ASP.NET Core 服务器，运行 genClient.ts 后自动退出
// 用法: dotnet run --project MaiChartManager.GenClient

using System.Diagnostics;
using System.Net;
using System.Runtime.CompilerServices;
using System.Text.Json.Serialization;
using MaiChartManager;

var frontDir = Path.GetFullPath(Path.Combine(GetProjectDir(), "..", "MaiChartManager", "Front"));
if (!Directory.Exists(frontDir))
{
    Console.Error.WriteLine($"Front directory not found: {frontDir}");
    return 1;
}

var builder = WebApplication.CreateBuilder();

builder.Logging.SetMinimumLevel(LogLevel.Warning);

builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.Listen(IPAddress.Loopback, 5181);
});

builder.Services
    .AddEndpointsApiExplorer()
    .AddSwaggerGen(options =>
    {
        options.CustomSchemaIds(type => type.Name == "Config" ? type.FullName : type.Name);
    })
    .AddControllers()
    .AddApplicationPart(typeof(ServerManager).Assembly)
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

var app = builder.Build();

app.UseSwagger();
app.MapControllers();

var exitCode = 0;

app.Lifetime.ApplicationStarted.Register(() =>
{
    Task.Run(async () =>
    {
        try
        {
            Console.WriteLine($"Running genClient in {frontDir} ...");

            // Linux 下没有 cmd.exe，直接调 pnpm
            var psi = new ProcessStartInfo
            {
                FileName = OperatingSystem.IsWindows() ? "cmd.exe" : "pnpm",
                Arguments = OperatingSystem.IsWindows() ? "/c pnpm exec tsx genClient.ts" : "exec tsx genClient.ts",
                WorkingDirectory = frontDir,
                UseShellExecute = false,
            };

            using var process = Process.Start(psi)!;
            await process.WaitForExitAsync();
            exitCode = process.ExitCode;

            Console.WriteLine(exitCode == 0
                ? "genClient completed successfully."
                : $"genClient failed with exit code {exitCode}");
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error: {ex.Message}");
            exitCode = 1;
        }
        finally
        {
            await app.StopAsync();
        }
    });
});

app.Run();
return exitCode;

static string GetProjectDir([CallerFilePath] string? path = null) => Path.GetDirectoryName(path)!;
