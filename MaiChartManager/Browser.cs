using Microsoft.Web.WebView2.Core;
using WinBlur;

namespace MaiChartManager;

public sealed partial class Browser : Form
{
    private readonly Uri loopbackUrl;
    private static ILogger logger = Program.GetLogger<Browser>();

    public Browser(string loopbackUrl)
    {
        InitializeComponent();
        this.loopbackUrl = new Uri(loopbackUrl);
        Text += $" ({StaticSettings.GamePath})";
        webView21.Source = new Uri("https://mcm.invalid/index.html");
        webView21.DefaultBackgroundColor = Color.Transparent;
        UI.SetBlurStyle(this, blurType: UI.BlurType.Mica, UI.Mode.LightMode);
        IapManager.BindToForm(this);
    }

    private void webView21_CoreWebView2InitializationCompleted(object sender, CoreWebView2InitializationCompletedEventArgs e)
    {
# if !DEBUG
        webView21.CoreWebView2.Settings.AreDevToolsEnabled = false;
        webView21.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;
# endif
        // 这里如果直接写 mcm 的话会让启动的时候白屏时间更久
        webView21.CoreWebView2.SetVirtualHostNameToFolderMapping("mcm.invalid", Path.Combine(StaticSettings.exeDir, "wwwroot"), CoreWebView2HostResourceAccessKind.Deny);
        webView21.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync($"globalThis.backendUrl = `{loopbackUrl.ToString().TrimEnd('/')}`");

        // webView21.CoreWebView2.AddWebResourceRequestedFilter("*://mcm.invalid/MaiChartManagerServlet/*", CoreWebView2WebResourceContext.All);
        // webView21.CoreWebView2.WebResourceRequested += OnWebResourceRequested;

        webView21.CoreWebView2.PermissionRequested += webView21_PermissionRequested;
    }

    private async void OnWebResourceRequested(object? sender, CoreWebView2WebResourceRequestedEventArgs args)
    {
        logger.LogInformation("Handle request: {uri}", args.Request.Uri);
        var uri = new UriBuilder(args.Request.Uri)
        {
            Host = loopbackUrl.Host
        };
        using var client = new HttpClient();
        var req = new HttpRequestMessage
        {
            Method = HttpMethod.Parse(args.Request.Method),
            RequestUri = uri.Uri,
            Content = args.Request.Content != null ? new StreamContent(args.Request.Content) : null,
        };
        foreach (var header in args.Request.Headers)
        {
            req.Headers.TryAddWithoutValidation(header.Key, header.Value);
        }

        var response = await client.SendAsync(req);
        args.Response = webView21.CoreWebView2.Environment.CreateWebResourceResponse(await response.Content.ReadAsStreamAsync(), (int)response.StatusCode, response.ReasonPhrase, response.Headers.ToString());
    }

    private static void webView21_PermissionRequested(object? sender, CoreWebView2PermissionRequestedEventArgs e)
    {
        if (e.PermissionKind is CoreWebView2PermissionKind.FileReadWrite or CoreWebView2PermissionKind.Autoplay)
        {
            e.State = CoreWebView2PermissionState.Allow;
        }
    }

    private void Browser_FormClosed(object sender, FormClosedEventArgs e)
    {
        webView21.Dispose();
        if (!StaticSettings.Config.Export)
            Application.Exit();
    }
}