using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using SonicAudioLib.CriMw;
using VGAudio.Containers.Wave;
using VGAudio.Formats.Pcm16;

namespace MaiChartManager.Utils;

public static class CriUtils
{
    [Obsolete("这样之后不会循环，自己搓 acb 吧")]
    public static byte[] SetAcbPreview(string acbPath, TimeSpan loopStart, TimeSpan loopEnd)
    {
        var criTable = new CriTable();
        criTable.Load(File.ReadAllBytes(acbPath));

        // var trackEventTable = criTable.Rows[0].GetTable("TrackEventTable");
        var trackEventTable = new CriTable();

        trackEventTable.Fields.Add("Command", typeof(byte[]));
        var row0 = trackEventTable.NewRow();
        row0["Command"] = (byte[]) [7, 208, 4, 0, 2, 0, 0, 0, 0, 0];
        trackEventTable.Rows.Add(row0);
        var row1 = trackEventTable.NewRow();
        row1["Command"] = MakeCommandForPreview(loopStart, loopEnd);
        trackEventTable.Rows.Add(row1);

        criTable.Rows[0]["TrackEventTable"] = trackEventTable.Save();
        return criTable.Save();
    }

    public static async Task<byte[]> CreateAcbWithPreview(string wavPath, byte[] awbBytes, TimeSpan loopStart, TimeSpan loopEnd)
    {
        using var sha1 = SHA1.Create();
        var sha1HashOfAwb = await sha1.ComputeHashAsync(new MemoryStream(awbBytes));

        var waveReader = new WaveReader();
        var audioData = waveReader.Read(File.ReadAllBytes(wavPath));
        var format = audioData.GetFormat<Pcm16Format>();

        var criTable = new CriTable();
        criTable.Load(File.ReadAllBytes(Path.Combine(StaticSettings.exeDir, "templateV3.acb")));

        var cueTable = criTable.Rows[0].GetTable("CueTable");
        cueTable.Rows[0]["Length"] = (int)((float)format.SampleCount / format.SampleRate * 1000);
        criTable.WriterSettings = CriTableWriterSettings.Adx2Settings;
        criTable.Rows[0]["CueTable"] = cueTable.Save();

        var trackEventTable = criTable.Rows[0].GetTable("TrackEventTable");
        trackEventTable.Rows[1]["Command"] = MakeCommandForPreview(loopStart, loopEnd);
        criTable.Rows[0]["TrackEventTable"] = trackEventTable.Save();

        var awbHashTable = criTable.Rows[0].GetTable("StreamAwbHash");
        awbHashTable.Rows[0]["Hash"] = sha1HashOfAwb;
        criTable.Rows[0]["StreamAwbHash"] = awbHashTable.Save();

        var waveFormTable = criTable.Rows[0].GetTable("WaveformTable");
        waveFormTable.Rows[0]["SamplingRate"] = (ushort)format.SampleRate;
        waveFormTable.Rows[0]["NumSamples"] = (byte)format.SampleCount;
        criTable.Rows[0]["WaveformTable"] = waveFormTable.Save();

        // 修复歌曲持续时间
        var count = BitConverter.ToInt32(awbBytes, 8) + 1;
        var headSize = 16 + awbBytes[5] * count + awbBytes[6] * count + awbBytes[7] * count;
        var header = new byte[headSize];
        Array.Copy(awbBytes, header, headSize);
        var streamAwbAfs2Header = criTable.Rows[0].GetTable("StreamAwbAfs2Header");
        streamAwbAfs2Header.Rows[0]["Header"] = header;
        criTable.Rows[0]["StreamAwbAfs2Header"] = streamAwbAfs2Header.Save();

        criTable.WriterSettings = CriTableWriterSettings.Adx2Settings;
        return criTable.Save();
    }

    public record AudioPreviewTime(double StartTime, double EndTime);

    public static AudioPreviewTime GetAudioPreviewTime(string acbPath)
    {
        var criTable = new CriTable();
        criTable.Load(File.ReadAllBytes(acbPath));
        var trackEventTable = criTable.Rows[0].GetTable("TrackEventTable");
        var command = trackEventTable.Rows[1]["Command"] as byte[];
        var loopStart = BitConverter.ToUInt32(command[3..7].Reverse().ToArray(), 0);
        var loopEnd = BitConverter.ToUInt32(command[17..21].Reverse().ToArray(), 0);
        return new AudioPreviewTime(loopStart / 1000.0, loopEnd / 1000.0);
    }

    private static byte[] MakeCommandForPreview(TimeSpan loopStart, TimeSpan loopEnd)
    {
        using var ms = new MemoryStream();
        using var bw = new BinaryWriter(ms, Encoding.Default, true);
        bw.Write([3, 231, 4]);
        bw.Write(BitConverter.GetBytes((uint)loopStart.TotalMilliseconds).Reverse().ToArray());
        bw.Write([7, 208, 4, 0, 2, 0, 1, 7, 209, 4]);
        bw.Write(BitConverter.GetBytes((uint)loopEnd.TotalMilliseconds).Reverse().ToArray());
        bw.Write([15, 160, 0, 0, 0, 0]);
        return ms.ToArray();
    }

    private static byte[] ReadResourceFile(string filename)
    {
        using var s = Assembly.GetExecutingAssembly().GetManifestResourceStream(filename);
        var buffer = new byte[1024];
        using var ms = new MemoryStream();
        while (true)
        {
            var read = s!.Read(buffer, 0, buffer.Length);
            if (read <= 0)
                return ms.ToArray();
            ms.Write(buffer, 0, read);
        }
    }

    private static CriTable GetTable(this CriRow row, string name)
    {
        var table = new CriTable();
        table.Load(row[name] as byte[]);
        return table;
    }
}