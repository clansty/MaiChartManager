using System.ComponentModel;

namespace MaiChartManager;

partial class Browser
{
    /// <summary>
    /// Required designer variable.
    /// </summary>
    private IContainer components = null;

    /// <summary>
    /// Clean up any resources being used.
    /// </summary>
    /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
    protected override void Dispose(bool disposing)
    {
        if (disposing && (components != null))
        {
            components.Dispose();
        }

        base.Dispose(disposing);
    }

    #region Windows Form Designer generated code

    /// <summary>
    /// Required method for Designer support - do not modify
    /// the contents of this method with the code editor.
    /// </summary>
    private void InitializeComponent()
    {
        ComponentResourceManager resources = new ComponentResourceManager(typeof(Browser));
        webView21 = new Microsoft.Web.WebView2.WinForms.WebView2();
        ((ISupportInitialize)webView21).BeginInit();
        SuspendLayout();
        //
        // webView21
        //
        webView21.AllowExternalDrop = true;
        webView21.CreationProperties = null;
        webView21.DefaultBackgroundColor = System.Drawing.Color.White;
        webView21.Dock = System.Windows.Forms.DockStyle.Fill;
        webView21.Location = new System.Drawing.Point(0, 0);
        webView21.Name = "webView21";
        webView21.Size = new System.Drawing.Size(1782, 1253);
        webView21.TabIndex = 0;
        webView21.ZoomFactor = 1D;
        webView21.CoreWebView2InitializationCompleted += webView21_CoreWebView2InitializationCompleted;
        //
        // Browser
        //
        AutoScaleDimensions = new System.Drawing.SizeF(8F, 20F);
        AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
        ClientSize = new System.Drawing.Size(2000, 1253);
        Controls.Add(webView21);
        Icon = (System.Drawing.Icon)resources.GetObject("$this.Icon");
        Name = "Browser";
        Text = "MaiChartManager";
        FormClosed += Browser_FormClosed;
        ((ISupportInitialize)webView21).EndInit();
        ResumeLayout(false);
    }

    #endregion

    private Microsoft.Web.WebView2.WinForms.WebView2 webView21;
}
