using Python.Runtime;

namespace MaiChartManager.WannaCRI;

public static class WannaCRI
{
    static WannaCRI()
    {
        Runtime.PythonDLL = Path.Combine(StaticSettings.exeDir, "Python", "python312.dll");
        PythonEngine.PythonHome = Path.Combine(StaticSettings.exeDir, "Python");
        PythonEngine.PythonPath = $"{Path.Combine(StaticSettings.exeDir, "WannaCRI")};{Path.Combine(StaticSettings.exeDir, "Python")}";
    }

    private static void RunWannaCRIWithArgs(params string[] args)
    {
        PythonEngine.Initialize();
        using (Py.GIL())
        {
            using var scope = Py.CreateScope();

            // Hook Popen
            scope.Exec("""
                       import subprocess
                       import os

                       # 保存原始的 Popen 函数
                       _orig_Popen = subprocess.Popen

                       # 定义新的 Popen 函数
                       def _Popen_no_window(*args, **kwargs):
                           # 添加 creationflags 参数，防止弹出 cmd 窗口
                           if os.name == 'nt':  # 仅在 Windows 上设置
                               kwargs['creationflags'] = subprocess.CREATE_NO_WINDOW
                           return _orig_Popen(*args, **kwargs)

                       # 替换原始 Popen 函数
                       subprocess.Popen = _Popen_no_window
                       """);

            var sys = scope.Import("sys");
            var argv = new PyList();
            argv.Append(new PyString("qwq"));
            foreach (var arg in args)
            {
                argv.Append(new PyString(arg));
            }

            sys.SetAttr("argv", argv);

            var wannacri = scope.Import("wannacri");
            wannacri.GetAttr("main").Invoke();
        }

        // 不然的话第二次转换会卡住
        PythonEngine.Shutdown();
    }

    private const string defaultKey = "0x7F4551499DF55E68";

    public static void CreateUsm(string src, string key = defaultKey)
    {
        RunWannaCRIWithArgs("createusm", src, "--key", key, "--ffprobe", Path.Combine(StaticSettings.exeDir, "ffprobe.exe"), "--output", Path.GetDirectoryName(src));
    }

    public static void UnpackUsm(string src, string output, string key = defaultKey)
    {
        RunWannaCRIWithArgs("extractusm", src, "--key", key, "--output", output);
    }
}