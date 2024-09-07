using System.Net;
using System.Net.Sockets;
using System.Text.Json;
using Windows.ApplicationModel;
using Windows.ApplicationModel.Activation;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;

namespace MaiChartManager;

public partial class Launcher : Form
{
    public Launcher()
    {
        InitializeComponent();
        label3.Text = $@"v{Application.ProductVersion}";
        checkBox1.Checked = StaticSettings.Config.Export;
        textBox1.Text = StaticSettings.Config.GamePath;
        CheckStartupStatus();
# if DEBUG
        checkBox1.Checked = true;
        StaticSettings.Config.Export = true;
        textBox1.Text = @"D:\Maimai HDD\sdga145";
        StartClicked(null, null);
        notifyIcon1.Visible = true;
        WindowState = FormWindowState.Minimized;
# endif
        if (!isFromStartup())
        {
            Visible = true;
            return;
        }

        // 开机自启
        Visible = false;
        notifyIcon1.Visible = true;
        checkBox1.Checked = true;
        StaticSettings.Config.Export = true;
        StartClicked(null, null);
    }

    private bool isFromStartup()
    {
        try
        {
            var aeArgs = AppInstance.GetActivatedEventArgs();
            return aeArgs?.Kind == ActivationKind.StartupTask;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            SentrySdk.CaptureException(e);
        }

        return false;
    }

    private async Task CheckStartupStatus()
    {
        var startupTask = await StartupTask.GetAsync("MaiChartManagerStartupId");
        switch (startupTask.State)
        {
            case StartupTaskState.Disabled:
                checkBox_startup.Checked = false;
                break;
            case StartupTaskState.Enabled:
                checkBox_startup.Checked = true;
                break;
            case StartupTaskState.DisabledByUser:
            case StartupTaskState.DisabledByPolicy:
                checkBox_startup.Enabled = false;
                checkBox_startup.Checked = false;
                break;
            case StartupTaskState.EnabledByPolicy: // ??
                checkBox_startup.Enabled = false;
                checkBox_startup.Checked = true;
                break;
        }
    }

    private void button1_Click(object sender, EventArgs e)
    {
        var result = folderBrowserDialog1.ShowDialog();
        if (result != DialogResult.OK) return;
        textBox1.Text = folderBrowserDialog1.SelectedPath;
    }

    private string loopbackUrl;

    private void StartClicked(object sender, EventArgs e)
    {
        if (button2.Text == "停止")
        {
            button2.Text = "启动";
            textBox1.Enabled = true;
            button1.Enabled = true;
            checkBox1.Enabled = true;
            label1.Text = "";
            ServerManager.StopAsync();
            return;
        }

        if (string.IsNullOrWhiteSpace(textBox1.Text)) return;
        if (!Path.Exists(textBox1.Text))
        {
            MessageBox.Show("选择的路径不存在！");
            return;
        }

        StaticSettings.GamePath = textBox1.Text;
        if (!Path.Exists(StaticSettings.StreamingAssets))
        {
            MessageBox.Show("选择的路径中看起来不包含游戏文件，请选择 Sinmai.exe 所在的文件夹");
            return;
        }

        if (!checkBox1.Checked && checkBox_startup.Checked)
        {
            checkBox_startup.Checked = false;
            checkBox_startup_Click(null, null);
        }

# if !DEBUG
        StaticSettings.Config.GamePath = textBox1.Text;
        File.WriteAllText(Path.Combine(StaticSettings.appData, "config.json"), JsonSerializer.Serialize(StaticSettings.Config));
# endif

        textBox1.Enabled = false;
        button1.Enabled = false;
        checkBox1.Enabled = false;
        button2.Text = "停止";

        ServerManager.StartApp(checkBox1.Checked, () =>
        {
            var server = ServerManager.app!.Services.GetRequiredService<IServer>();
            var serverAddressesFeature = server.Features.Get<IServerAddressesFeature>();

            if (serverAddressesFeature == null) return;

            loopbackUrl = serverAddressesFeature.Addresses.First();

            // 本地模式
            if (checkBox1.Checked) return;
            Invoke(() => label1_LinkClicked(null, null));
            Dispose();
        });

        if (!checkBox1.Checked) return;
        var localIp = Dns.GetHostAddresses(Dns.GetHostName()).First(it => it.AddressFamily == AddressFamily.InterNetwork);
        label1.Text = $@"https://{localIp}:5001";
    }

    private void button4_Click(object sender, EventArgs e)
    {
        Application.Exit();
    }

    private void label1_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
    {
        if (Program.BrowserWin is null || Program.BrowserWin.IsDisposed)
        {
            Program.BrowserWin = new Browser($"{loopbackUrl}?ts={DateTime.Now.Ticks}");
            Program.BrowserWin.Show();
        }
        else
        {
            Program.BrowserWin.Activate();
        }
    }

    private void Launcher_FormClosed(object sender, FormClosedEventArgs e)
    {
        Application.Exit();
    }

    private void checkBox1_CheckedChanged(object sender, EventArgs e)
    {
        StaticSettings.Config.Export = checkBox1.Checked;
        checkBox_startup.Visible = checkBox1.Checked;
    }

    private async void checkBox_startup_Click(object sender, EventArgs e)
    {
        await File.WriteAllTextAsync(Path.Combine(StaticSettings.appData, "config.json"), JsonSerializer.Serialize(StaticSettings.Config));
        var startupTask = await StartupTask.GetAsync("MaiChartManagerStartupId");
        if (checkBox_startup.Checked)
        {
            await startupTask.RequestEnableAsync();
        }
        else
        {
            startupTask.Disable();
        }
    }

    private void notifyIcon1_Click(object sender, EventArgs e)
    {
        Visible = true;
        WindowState = FormWindowState.Normal;
        notifyIcon1.Visible = false;
    }
}
