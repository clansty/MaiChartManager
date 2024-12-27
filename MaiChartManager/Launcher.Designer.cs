using System.ComponentModel;
using System.Windows.Forms;

namespace MaiChartManager;

partial class Launcher
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
        components = new Container();
        ComponentResourceManager resources = new ComponentResourceManager(typeof(Launcher));
        folderBrowserDialog1 = new FolderBrowserDialog();
        textBox1 = new TextBox();
        button1 = new Button();
        button2 = new Button();
        button4 = new Button();
        label1 = new LinkLabel();
        tableLayoutPanel2 = new TableLayoutPanel();
        label2 = new Label();
        tableLayoutPanel3 = new TableLayoutPanel();
        pictureBox1 = new PictureBox();
        label3 = new Label();
        flowLayoutPanel1 = new FlowLayoutPanel();
        checkBox1 = new CheckBox();
        checkBox_startup = new CheckBox();
        checkBoxLanAuth = new CheckBox();
        textBoxLanAuthUser = new TextBox();
        textBoxLanAuthPass = new TextBox();
        toolTip1 = new ToolTip(components);
        notifyIcon1 = new NotifyIcon(components);
        tableLayoutPanel2.SuspendLayout();
        tableLayoutPanel3.SuspendLayout();
        ((ISupportInitialize)pictureBox1).BeginInit();
        flowLayoutPanel1.SuspendLayout();
        SuspendLayout();
        // 
        // folderBrowserDialog1
        // 
        folderBrowserDialog1.Description = "请选择游戏目录";
        folderBrowserDialog1.RootFolder = Environment.SpecialFolder.MyComputer;
        folderBrowserDialog1.ShowNewFolderButton = false;
        // 
        // textBox1
        // 
        tableLayoutPanel2.SetColumnSpan(textBox1, 2);
        textBox1.Dock = DockStyle.Fill;
        textBox1.Location = new Point(163, 303);
        textBox1.Name = "textBox1";
        textBox1.Size = new Size(458, 27);
        textBox1.TabIndex = 0;
        // 
        // button1
        // 
        button1.Dock = DockStyle.Fill;
        button1.Location = new Point(627, 303);
        button1.Name = "button1";
        button1.Size = new Size(194, 28);
        button1.TabIndex = 1;
        button1.Text = "选择游戏目录";
        button1.UseVisualStyleBackColor = true;
        button1.Click += button1_Click;
        // 
        // button2
        // 
        button2.Dock = DockStyle.Fill;
        button2.Location = new Point(3, 37);
        button2.Name = "button2";
        button2.Size = new Size(194, 81);
        button2.TabIndex = 2;
        button2.Text = "启动";
        button2.UseVisualStyleBackColor = true;
        button2.Click += StartClicked;
        // 
        // button4
        // 
        button4.Dock = DockStyle.Fill;
        button4.Location = new Point(3, 3);
        button4.Name = "button4";
        button4.Size = new Size(194, 28);
        button4.TabIndex = 4;
        button4.Text = "退出";
        button4.UseVisualStyleBackColor = true;
        button4.Click += button4_Click;
        // 
        // label1
        // 
        label1.AutoSize = true;
        label1.Dock = DockStyle.Fill;
        label1.Location = new Point(395, 334);
        label1.Name = "label1";
        label1.Size = new Size(226, 160);
        label1.TabIndex = 5;
        label1.TextAlign = ContentAlignment.TopCenter;
        label1.LinkClicked += label1_LinkClicked;
        // 
        // tableLayoutPanel2
        // 
        tableLayoutPanel2.ColumnCount = 4;
        tableLayoutPanel2.ColumnStyles.Add(new ColumnStyle(SizeType.Absolute, 160F));
        tableLayoutPanel2.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 50F));
        tableLayoutPanel2.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 50F));
        tableLayoutPanel2.ColumnStyles.Add(new ColumnStyle(SizeType.Absolute, 200F));
        tableLayoutPanel2.Controls.Add(label1, 2, 2);
        tableLayoutPanel2.Controls.Add(button1, 3, 1);
        tableLayoutPanel2.Controls.Add(textBox1, 1, 1);
        tableLayoutPanel2.Controls.Add(label2, 0, 1);
        tableLayoutPanel2.Controls.Add(tableLayoutPanel3, 3, 2);
        tableLayoutPanel2.Controls.Add(pictureBox1, 0, 0);
        tableLayoutPanel2.Controls.Add(label3, 0, 2);
        tableLayoutPanel2.Controls.Add(flowLayoutPanel1, 1, 2);
        tableLayoutPanel2.Dock = DockStyle.Fill;
        tableLayoutPanel2.Location = new Point(0, 0);
        tableLayoutPanel2.Margin = new Padding(8);
        tableLayoutPanel2.Name = "tableLayoutPanel2";
        tableLayoutPanel2.RowCount = 3;
        tableLayoutPanel2.RowStyles.Add(new RowStyle(SizeType.Absolute, 300F));
        tableLayoutPanel2.RowStyles.Add(new RowStyle(SizeType.Absolute, 34F));
        tableLayoutPanel2.RowStyles.Add(new RowStyle(SizeType.Percent, 100F));
        tableLayoutPanel2.Size = new Size(824, 494);
        tableLayoutPanel2.TabIndex = 1;
        // 
        // label2
        // 
        label2.AutoSize = true;
        label2.Dock = DockStyle.Fill;
        label2.Location = new Point(3, 300);
        label2.Name = "label2";
        label2.Size = new Size(154, 34);
        label2.TabIndex = 1;
        label2.Text = "游戏目录";
        label2.TextAlign = ContentAlignment.MiddleRight;
        // 
        // tableLayoutPanel3
        // 
        tableLayoutPanel3.ColumnCount = 1;
        tableLayoutPanel3.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100F));
        tableLayoutPanel3.Controls.Add(button2, 0, 1);
        tableLayoutPanel3.Controls.Add(button4, 0, 0);
        tableLayoutPanel3.Dock = DockStyle.Bottom;
        tableLayoutPanel3.Location = new Point(624, 373);
        tableLayoutPanel3.Margin = new Padding(0);
        tableLayoutPanel3.Name = "tableLayoutPanel3";
        tableLayoutPanel3.RowCount = 2;
        tableLayoutPanel3.RowStyles.Add(new RowStyle(SizeType.Absolute, 34F));
        tableLayoutPanel3.RowStyles.Add(new RowStyle(SizeType.Absolute, 60F));
        tableLayoutPanel3.RowStyles.Add(new RowStyle(SizeType.Absolute, 20F));
        tableLayoutPanel3.Size = new Size(200, 121);
        tableLayoutPanel3.TabIndex = 2;
        // 
        // pictureBox1
        // 
        pictureBox1.BackColor = Color.White;
        tableLayoutPanel2.SetColumnSpan(pictureBox1, 4);
        pictureBox1.Dock = DockStyle.Fill;
        pictureBox1.Image = Properties.Resources.Wide310x150Logo_scale_400;
        pictureBox1.Location = new Point(3, 3);
        pictureBox1.Name = "pictureBox1";
        pictureBox1.Size = new Size(818, 294);
        pictureBox1.SizeMode = PictureBoxSizeMode.Zoom;
        pictureBox1.TabIndex = 6;
        pictureBox1.TabStop = false;
        // 
        // label3
        // 
        label3.AutoSize = true;
        label3.Dock = DockStyle.Fill;
        label3.Location = new Point(3, 334);
        label3.Name = "label3";
        label3.Size = new Size(154, 160);
        label3.TabIndex = 7;
        label3.Text = "label3";
        label3.TextAlign = ContentAlignment.BottomLeft;
        label3.Click += label3_Click;
        // 
        // flowLayoutPanel1
        // 
        flowLayoutPanel1.Controls.Add(checkBox1);
        flowLayoutPanel1.Controls.Add(checkBox_startup);
        flowLayoutPanel1.Controls.Add(checkBoxLanAuth);
        flowLayoutPanel1.Controls.Add(textBoxLanAuthUser);
        flowLayoutPanel1.Controls.Add(textBoxLanAuthPass);
        flowLayoutPanel1.Dock = DockStyle.Fill;
        flowLayoutPanel1.FlowDirection = FlowDirection.TopDown;
        flowLayoutPanel1.Location = new Point(160, 334);
        flowLayoutPanel1.Margin = new Padding(0);
        flowLayoutPanel1.Name = "flowLayoutPanel1";
        flowLayoutPanel1.Size = new Size(232, 160);
        flowLayoutPanel1.TabIndex = 8;
        // 
        // checkBox1
        // 
        checkBox1.AutoSize = true;
        checkBox1.Location = new Point(3, 3);
        checkBox1.Name = "checkBox1";
        checkBox1.Size = new Size(121, 23);
        checkBox1.TabIndex = 0;
        checkBox1.Text = "开放到局域网";
        checkBox1.UseVisualStyleBackColor = true;
        checkBox1.CheckedChanged += checkBox1_CheckedChanged;
        // 
        // checkBox_startup
        // 
        checkBox_startup.AutoSize = true;
        checkBox_startup.Location = new Point(3, 32);
        checkBox_startup.Name = "checkBox_startup";
        checkBox_startup.Size = new Size(121, 23);
        checkBox_startup.TabIndex = 2;
        checkBox_startup.Text = "开机自动运行";
        toolTip1.SetToolTip(checkBox_startup, "开机自动以服务器模式运行并最小化到托盘");
        checkBox_startup.UseVisualStyleBackColor = true;
        checkBox_startup.Visible = false;
        checkBox_startup.Click += checkBox_startup_Click;
        // 
        // checkBoxLanAuth
        // 
        checkBoxLanAuth.AutoSize = true;
        checkBoxLanAuth.Location = new Point(3, 61);
        checkBoxLanAuth.Name = "checkBoxLanAuth";
        checkBoxLanAuth.Size = new Size(91, 23);
        checkBoxLanAuth.TabIndex = 3;
        checkBoxLanAuth.Text = "需要登录";
        checkBoxLanAuth.UseVisualStyleBackColor = true;
        checkBoxLanAuth.Visible = false;
        checkBoxLanAuth.CheckedChanged += checkBoxLanAuth_CheckedChanged;
        // 
        // textBoxLanAuthUser
        // 
        textBoxLanAuthUser.Location = new Point(3, 90);
        textBoxLanAuthUser.Name = "textBoxLanAuthUser";
        textBoxLanAuthUser.Size = new Size(226, 27);
        textBoxLanAuthUser.TabIndex = 4;
        textBoxLanAuthUser.Visible = false;
        textBoxLanAuthUser.PlaceholderText = "用户名";
        // 
        // textBoxLanAuthPass
        // 
        textBoxLanAuthPass.Location = new Point(3, 123);
        textBoxLanAuthPass.Name = "textBoxLanAuthPass";
        textBoxLanAuthPass.Size = new Size(226, 27);
        textBoxLanAuthPass.TabIndex = 5;
        textBoxLanAuthPass.Visible = false;
        textBoxLanAuthPass.UseSystemPasswordChar = true;
        textBoxLanAuthPass.PlaceholderText = "密码";
        // 
        // toolTip1
        // 
        toolTip1.AutomaticDelay = 200;
        // 
        // notifyIcon1
        // 
        notifyIcon1.Icon = (Icon)resources.GetObject("notifyIcon1.Icon");
        notifyIcon1.Text = "MaiChartManager";
        notifyIcon1.Click += ShowWindow;
        notifyIcon1.DoubleClick += ShowWindow;
        // 
        // Launcher
        // 
        AutoScaleDimensions = new SizeF(9F, 19F);
        AutoScaleMode = AutoScaleMode.Font;
        ClientSize = new Size(824, 494);
        Controls.Add(tableLayoutPanel2);
        FormBorderStyle = FormBorderStyle.FixedSingle;
        Icon = (Icon)resources.GetObject("$this.Icon");
        MaximizeBox = false;
        Name = "Launcher";
        SizeGripStyle = SizeGripStyle.Hide;
        Text = "Launcher";
        FormClosed += Launcher_FormClosed;
        tableLayoutPanel2.ResumeLayout(false);
        tableLayoutPanel2.PerformLayout();
        tableLayoutPanel3.ResumeLayout(false);
        ((ISupportInitialize)pictureBox1).EndInit();
        flowLayoutPanel1.ResumeLayout(false);
        flowLayoutPanel1.PerformLayout();
        ResumeLayout(false);
    }

    #endregion

    private System.Windows.Forms.FolderBrowserDialog folderBrowserDialog1;
    private System.Windows.Forms.TextBox textBox1;
    private Button button1;
    private Button button2;
    private Button button4;
    private LinkLabel label1;
    private TableLayoutPanel tableLayoutPanel2;
    private Label label2;
    private CheckBox checkBox1;
    private TableLayoutPanel tableLayoutPanel3;
    private PictureBox pictureBox1;
    private System.Windows.Forms.Label label3;
    private FlowLayoutPanel flowLayoutPanel1;
    private CheckBox checkBox_startup;
    private ToolTip toolTip1;
    private NotifyIcon notifyIcon1;
    private CheckBox checkBoxLanAuth;
    private TextBox textBoxLanAuthUser;
    private TextBox textBoxLanAuthPass;
}
