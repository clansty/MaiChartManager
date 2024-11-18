using System.Diagnostics;
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

    private static void RunWannaCRIWithArgs(string[] args, string workDir)
    {
        PythonEngine.Initialize();
        using (Py.GIL())
        {
            using var scope = Py.CreateScope();

            var sys = scope.Import("sys");
            var argv = new PyList();
            argv.Append(new PyString("qwq"));
            foreach (var arg in args)
            {
                argv.Append(new PyString(arg));
            }

            argv.Append(new PyString("--ffprobe"));
            argv.Append(new PyString(Path.Combine(StaticSettings.exeDir, "ffprobe.exe")));
            argv.Append(new PyString("--output"));
            argv.Append(new PyString(workDir));
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
        RunWannaCRIWithArgs(["createusm", src, "--key", key], Path.GetDirectoryName(src));
    }

    public static void UnpackUsm(string src, string key = defaultKey)
    {
        RunWannaCRIWithArgs(["extractusm", src, "--key", key], Path.GetDirectoryName(src));
    }
}