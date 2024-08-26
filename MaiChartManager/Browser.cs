using System.Drawing;
using System.Windows.Forms;
using WinBlur;

namespace MaiChartManager;

public partial class Browser : Form
{
    public Browser(string url)
    {
        InitializeComponent();
        webView21.Source = new Uri(url);
        webView21.DefaultBackgroundColor = Color.Transparent;
        UI.SetBlurStyle(this, blurType: UI.BlurType.Mica, UI.Mode.LightMode);
    }

    private void webView21_CoreWebView2InitializationCompleted(object sender, Microsoft.Web.WebView2.Core.CoreWebView2InitializationCompletedEventArgs e)
    {
        webView21.CoreWebView2.Settings.AreDevToolsEnabled = false;
        webView21.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;
    }
}
