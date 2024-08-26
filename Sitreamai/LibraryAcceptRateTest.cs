using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using MaiLib;
using SimaiSharp;

namespace Sitreamai;

internal static class LibraryAcceptRateTest
{
    private static int total = 0;
    private static int maiLib = 0;
    private static int simaiSharp = 0;

    public static void Test()
    {
        TestDir(@"E:\Desktop\dist");
        Console.WriteLine($"MaiLib: {maiLib}/{total}\nSimaiSharp: {simaiSharp}/{total}");
    }

    private static void TestDir(string dir)
    {
        foreach (var file in Directory.EnumerateFiles(dir, "*.txt"))
        {
            TestFile(file);
        }

        foreach (var subDir in Directory.EnumerateDirectories(dir))
        {
            TestDir(subDir);
        }
    }

    private static void TestFile(string file)
    {
        total++;
        var content = File.ReadAllText(file);

        try
        {
            content = SimaiConvert.Serialize(SimaiConvert.Deserialize(content));
        }
        catch
        {
        }

        // Test MaiLib
        try
        {
            var parser = new SimaiParser();
            var candidate = parser.ChartOfToken(TokensFromText(content));
            // var converted = new Ma2(candidate) { ChartVersion = ChartEnum.ChartVersion.Ma2_104 };
            // converted.Compose();
            maiLib++;
        }
        catch
        {
        }

        // Test SimaiSharp
        try
        {
            // SimaiConvert.Deserialize(content);
            // simaiSharp++;
        }
        catch
        {
        }
    }

    private static string[] TokensFromText(string text)
    {
        return new string(text.ToCharArray().Where((Func<char, bool>)(c => !char.IsWhiteSpace(c))).ToArray()).Split(',');
    }
}
