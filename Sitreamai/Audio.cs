using System.IO;
using System.Reflection;
using NAudio.Wave;
using VGAudio;
using VGAudio.Cli;
using Xv2CoreLib.ACB;

namespace Sitreamai;

public class Audio
{
    public static void ConvertToMai(string srcPath, string savePath)
    {
        var wrapper = new ACB_Wrapper(ACB_File.Load(ReadResourceFile("Sitreamai.Resources.template.acb"), null));
        var trackBytes = LoadAndConvertFile(srcPath, FileType.Hca, false, 9170825592834449000);

        wrapper.Cues[0].AddTrackToCue(trackBytes, true, false, EncodeType.HCA);
        wrapper.AcbFile.Save(savePath);
    }

    private static byte[] ReadResourceFile(string filename)
    {
        using var s = Assembly.GetExecutingAssembly().GetManifestResourceStream(filename);
        var buffer = new byte[1024];
        using var ms = new MemoryStream();
        while (true)
        {
            var read = s.Read(buffer, 0, buffer.Length);
            if (read <= 0)
                return ms.ToArray();
            ms.Write(buffer, 0, read);
        }
    }

    public static byte[] LoadAndConvertFile(string path, FileType convertToType, bool loop, ulong encrpytionKey = 0)
    {
        switch (Path.GetExtension(path).ToLower())
        {
            case ".wav":
                return ConvertFile(File.ReadAllBytes(path), FileType.Wave, convertToType, loop, encrpytionKey);
            case ".mp3":
            case ".ogg":
            case ".wma":
            case ".aac":
                return ConvertFile(ConvertToWav(path), FileType.Wave, convertToType, loop, encrpytionKey);
            case ".hca":
                return ConvertFile(File.ReadAllBytes(path), FileType.Hca, convertToType, loop, encrpytionKey);
            case ".adx":
                if (convertToType == FileType.Adx) return File.ReadAllBytes(path);
                return ConvertFile(File.ReadAllBytes(path), FileType.Adx, convertToType, loop, encrpytionKey);
            case ".at9":
                return ConvertFile(File.ReadAllBytes(path), FileType.Atrac9, convertToType, loop, encrpytionKey);
            case ".dsp":
                return ConvertFile(File.ReadAllBytes(path), FileType.Dsp, convertToType, loop, encrpytionKey);
            case ".bcwav":
                return ConvertFile(File.ReadAllBytes(path), FileType.Bcwav, convertToType, loop, encrpytionKey);
        }

        throw new InvalidDataException($"Filetype of \"{path}\" is not supported.");
    }

    public static byte[] ConvertToWav(string path)
    {
        byte[] outBytes;

        using (var reader = new MediaFoundationReader(path))
        {
            using (var stream = new MemoryStream())
            {
                WaveFileWriter.WriteWavFileToStream(stream, reader);
                outBytes = stream.ToArray();
            }
        }

        return outBytes;
    }

    public static byte[] ConvertFile(byte[] bytes, FileType encodeType, FileType convertToType, bool loop,
        ulong encryptionKey = 0)
    {
        ConvertStatics.SetLoop(loop, 0, 0);

        using (var ms = new MemoryStream(bytes))
        {
            var options = new Options();
            options.KeyCode = encryptionKey;
            options.Loop = loop;

            if (options.Loop)
                options.LoopEnd = int.MaxValue;

            byte[] track = ConvertStream.ConvertFile(options, ms, encodeType, convertToType);

            //if (convertToType == FileType.Hca && loop)
            //    track = HCA.EncodeLoop(track, loop);

            return track;
        }
    }
}