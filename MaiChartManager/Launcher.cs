using System.Net;
using System.Net.Sockets;
using System.Text.Json;
using System.Windows.Forms;
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
# if DEBUG
        checkBox1.Checked = true;
        StaticSettings.Config.Export = true;
        textBox1.Text = @"D:\Maimai HDD\sdga145";
        button2_Click(null, null);
        WindowState = FormWindowState.Minimized;
# endif
    }

    private void button1_Click(object sender, EventArgs e)
    {
        var result = folderBrowserDialog1.ShowDialog();
        if (result != DialogResult.OK) return;
        textBox1.Text = folderBrowserDialog1.SelectedPath;
    }

    private string loopbackUrl;

    private void button2_Click(object sender, EventArgs e)
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

# if !DEBUG
        StaticSettings.Config.GamePath = textBox1.Text;
        File.WriteAllText(Path.Combine(Application.LocalUserAppDataPath, "config.json"), JsonSerializer.Serialize(StaticSettings.Config));
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


    private Browser? _browserWin;

    private void label1_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
    {
        if (_browserWin is null || _browserWin.IsDisposed)
        {
            _browserWin = new Browser($"{loopbackUrl}?ts={DateTime.Now.Ticks}");
            _browserWin.Show();
        }
        else
        {
            _browserWin.Activate();
        }
    }

    private void Launcher_FormClosed(object sender, FormClosedEventArgs e)
    {
        Application.Exit();
    }

    private void checkBox1_CheckedChanged(object sender, EventArgs e)
    {
        StaticSettings.Config.Export = checkBox1.Checked;
    }
}
