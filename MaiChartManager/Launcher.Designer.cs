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
        folderBrowserDialog1 = new FolderBrowserDialog();
        tableLayoutPanel1 = new TableLayoutPanel();
        textBox1 = new TextBox();
        button1 = new Button();
        button2 = new Button();
        button4 = new Button();
        label1 = new LinkLabel();
        tableLayoutPanel1.SuspendLayout();
        SuspendLayout();
        // 
        // folderBrowserDialog1
        // 
        folderBrowserDialog1.Description = "请选择游戏目录";
        folderBrowserDialog1.RootFolder = Environment.SpecialFolder.MyComputer;
        folderBrowserDialog1.ShowNewFolderButton = false;
        // 
        // tableLayoutPanel1
        // 
        tableLayoutPanel1.ColumnCount = 3;
        tableLayoutPanel1.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 33.3333321F));
        tableLayoutPanel1.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 33.3333359F));
        tableLayoutPanel1.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 33.3333359F));
        tableLayoutPanel1.Controls.Add(textBox1, 0, 0);
        tableLayoutPanel1.Controls.Add(button1, 2, 0);
        tableLayoutPanel1.Controls.Add(button2, 0, 1);
        tableLayoutPanel1.Controls.Add(button4, 2, 1);
        tableLayoutPanel1.Controls.Add(label1, 1, 1);
        tableLayoutPanel1.Dock = DockStyle.Fill;
        tableLayoutPanel1.Location = new System.Drawing.Point(0, 0);
        tableLayoutPanel1.Name = "tableLayoutPanel1";
        tableLayoutPanel1.RowCount = 2;
        tableLayoutPanel1.RowStyles.Add(new RowStyle(SizeType.Absolute, 34F));
        tableLayoutPanel1.RowStyles.Add(new RowStyle(SizeType.Percent, 100F));
        tableLayoutPanel1.Size = new System.Drawing.Size(806, 83);
        tableLayoutPanel1.TabIndex = 0;
        // 
        // textBox1
        // 
        tableLayoutPanel1.SetColumnSpan(textBox1, 2);
        textBox1.Dock = DockStyle.Fill;
        textBox1.Location = new System.Drawing.Point(3, 3);
        textBox1.Name = "textBox1";
        textBox1.Size = new System.Drawing.Size(530, 27);
        textBox1.TabIndex = 0;
        // 
        // button1
        // 
        button1.Dock = DockStyle.Fill;
        button1.Location = new System.Drawing.Point(539, 3);
        button1.Name = "button1";
        button1.Size = new System.Drawing.Size(264, 28);
        button1.TabIndex = 1;
        button1.Text = "浏览游戏目录";
        button1.UseVisualStyleBackColor = true;
        button1.Click += button1_Click;
        // 
        // button2
        // 
        button2.Dock = DockStyle.Fill;
        button2.Location = new System.Drawing.Point(3, 37);
        button2.Name = "button2";
        button2.Size = new System.Drawing.Size(262, 43);
        button2.TabIndex = 2;
        button2.Text = "启动";
        button2.UseVisualStyleBackColor = true;
        button2.Click += button2_Click;
        // 
        // button4
        // 
        button4.Dock = DockStyle.Fill;
        button4.Location = new System.Drawing.Point(539, 37);
        button4.Name = "button4";
        button4.Size = new System.Drawing.Size(264, 43);
        button4.TabIndex = 4;
        button4.Text = "退出";
        button4.UseVisualStyleBackColor = true;
        button4.Click += button4_Click;
        // 
        // label1
        // 
        label1.AutoSize = true;
        label1.Dock = DockStyle.Fill;
        label1.Location = new System.Drawing.Point(271, 34);
        label1.Name = "label1";
        label1.Size = new System.Drawing.Size(262, 49);
        label1.TabIndex = 5;
        label1.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
        label1.LinkClicked += label1_LinkClicked;
        // 
        // Launcher
        // 
        AutoScaleDimensions = new System.Drawing.SizeF(8F, 20F);
        AutoScaleMode = AutoScaleMode.Font;
        ClientSize = new System.Drawing.Size(806, 83);
        Controls.Add(tableLayoutPanel1);
        FormBorderStyle = FormBorderStyle.FixedSingle;
        MaximizeBox = false;
        Name = "Launcher";
        SizeGripStyle = SizeGripStyle.Hide;
        Text = "Launcher";
        tableLayoutPanel1.ResumeLayout(false);
        tableLayoutPanel1.PerformLayout();
        ResumeLayout(false);
    }

    #endregion

    private System.Windows.Forms.FolderBrowserDialog folderBrowserDialog1;
    private System.Windows.Forms.TableLayoutPanel tableLayoutPanel1;
    private System.Windows.Forms.TextBox textBox1;
    private Button button1;
    private Button button2;
    private Button button4;
    private LinkLabel label1;
}
