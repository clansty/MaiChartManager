using AssetStudio;
using MaiChartManager.Models;

namespace MaiChartManager.Utils;

public static class ImageConvert
{
    public static byte[]? GetMusicJacketPngData(MusicXmlWithABJacket? music)
    {
        if (music == null)
        {
            return null;
        }

        if (System.IO.File.Exists(music.JacketPath))
        {
            return File.ReadAllBytes(music.JacketPath);
        }

        if (System.IO.File.Exists(music.PseudoAssetBundleJacket))
        {
            return File.ReadAllBytes(music.PseudoAssetBundleJacket);
        }

        if (music.AssetBundleJacket is null) return null;

        var manager = new AssetsManager();
        manager.LoadFiles(music.AssetBundleJacket);
        var asset = manager.assetsFileList[0].Objects.Find(it => it.type == ClassIDType.Texture2D);
        if (asset is null) return null;

        var texture = asset as Texture2D;
        return texture.ConvertToStream(ImageFormat.Png, true).GetBuffer();
    }
}
