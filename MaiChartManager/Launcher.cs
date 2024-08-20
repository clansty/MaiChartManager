using System.Diagnostics;
using System.Windows.Forms;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;

namespace MaiChartManager;

public partial class Launcher : Form
{
    public Launcher()
    {
        InitializeComponent();
# if DEBUG
        textBox1.Text = @"D:\Maimai HDD\sdga145";
        button2_Click(null, null);
# endif
    }

    public WebApplication app;

    private void button1_Click(object sender, EventArgs e)
    {
        var result = folderBrowserDialog1.ShowDialog();
        if (result != DialogResult.OK) return;
        textBox1.Text = folderBrowserDialog1.SelectedPath;
    }

    private void button2_Click(object sender, EventArgs e)
    {
        if (button2.Text == "停止")
        {
            app.StopAsync();
            app.DisposeAsync();
            button2.Text = "启动";
            textBox1.Enabled = true;
            button1.Enabled = true;
            return;
        }

        textBox1.Enabled = false;
        button1.Enabled = false;
        button2.Text = "停止";
        StaticSettings.GamePath = textBox1.Text;
        Task.Run(StartApp);
    }

    private void button4_Click(object sender, EventArgs e)
    {
        Application.Exit();
    }

    private void StartApp()
    {
        var builder = WebApplication.CreateBuilder();

        builder.Services.AddSingleton<StaticSettings>();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddControllers();

        app = builder.Build();
        app.Lifetime.ApplicationStarted.Register(() =>
        {
            var server = app.Services.GetRequiredService<IServer>();
            var serverAddressesFeature = server.Features.Get<IServerAddressesFeature>();

            if (serverAddressesFeature == null) return;

            label1.Text = string.Join("\n", serverAddressesFeature.Addresses);
        });
        app.UseSwagger();
        app.UseSwaggerUI();
        app.MapGet("/api", () => "Hello");
        app.MapControllers();
        app.Run();
    }

    private void label1_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
    {
        Process.Start(new ProcessStartInfo(label1.Text.Split('\n')[0])
        {
            UseShellExecute = true
        });
    }
}
