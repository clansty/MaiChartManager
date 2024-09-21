using System.Drawing;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;
using WinBlur;

namespace MaiChartManager;

public partial class Browser : Form
{
    public Browser(string url)
    {
        InitializeComponent();
        Text += $" ({StaticSettings.GamePath})";
        webView21.Source = new Uri(url);
        webView21.DefaultBackgroundColor = Color.Transparent;
        UI.SetBlurStyle(this, blurType: UI.BlurType.Mica, UI.Mode.LightMode);
        IapManager.BindToForm(this);
    }

    private void webView21_CoreWebView2InitializationCompleted(object sender, Microsoft.Web.WebView2.Core.CoreWebView2InitializationCompletedEventArgs e)
    {
        webView21.CoreWebView2.Settings.AreDevToolsEnabled = false;
        webView21.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;
        webView21.CoreWebView2.PermissionRequested += webView21_PermissionRequested;
    }

    private static void webView21_PermissionRequested(object? sender, Microsoft.Web.WebView2.Core.CoreWebView2PermissionRequestedEventArgs e)
    {
        if (e.PermissionKind == CoreWebView2PermissionKind.FileReadWrite)
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
