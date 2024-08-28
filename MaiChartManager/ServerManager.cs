using System.Net;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text.Json.Serialization;

namespace MaiChartManager;

public static class ServerManager
{
    public static WebApplication? app;

    public static async Task StopAsync()
    {
        if (app == null) return;
        await app.StopAsync();
        await app.DisposeAsync();
        app = null;
    }

    public static bool IsRunning => app != null;

    private static string GetCert()
    {
        var path = Path.Combine(StaticSettings.appData, "cert.pfx");
        if (File.Exists(path)) return path;

        var ecdsa = ECDsa.Create();
        var req = new CertificateRequest("CN=MaiChartManager", ecdsa, HashAlgorithmName.SHA256);
        var cert = req.CreateSelfSigned(DateTimeOffset.Now, DateTimeOffset.Now.AddYears(5));

        File.WriteAllBytes(path, cert.Export(X509ContentType.Pfx));
        return path;
    }

    public static void StartApp(bool export, Action? onStart = null)
    {
        var builder = WebApplication.CreateBuilder();

        builder.Services.AddSingleton<StaticSettings>()
            .AddEndpointsApiExplorer()
            .AddSwaggerGen()
            .AddControllers()
            .AddJsonOptions(options =>
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

# if !DEBUG
        builder.WebHost.ConfigureKestrel((context, serverOptions) =>
        {
            serverOptions.Listen(IPAddress.Loopback, 0);
            if (export)
            {
                serverOptions.Listen(IPAddress.Any, 5001, listenOptions => { listenOptions.UseHttps(GetCert()); });
            }
        });
# endif

        app = builder.Build();
        app.Lifetime.ApplicationStarted.Register(() => { app.Services.GetService<StaticSettings>(); });

# if DEBUG
        app.Lifetime.ApplicationStopped.Register(Application.Exit);
# endif

        if (onStart != null)
            app.Lifetime.ApplicationStarted.Register(onStart);

        app.UseSwagger();
        app.UseSwaggerUI();
        app.UseFileServer();
        app.MapControllers();
        Task.Run(app.Run);
    }
}
