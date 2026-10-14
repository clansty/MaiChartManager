#if WINDOWS
using Windows.Services.Store;
#endif
using Microsoft.AspNetCore.Mvc;

namespace MaiChartManager.Controllers.App;

#if !WINDOWS
/// <summary>
/// Linux 下编译（MaiChartManager.GenClient 生成前端 API client 走的就是这条路）没有
/// Windows.Services.Store，但线上跑的是 Windows 版，契约必须一致：同名的枚举、同样的字符串取值。
/// 否则生成出来的 client 里 status 会退化成 number，StorePurchaseStatus 整个消失，
/// 前端照枚举写就永远不成立。成员顺序也跟 Windows 的原版对齐。
/// </summary>
public enum StorePurchaseStatus
{
    Succeeded,
    AlreadyPurchased,
    NotPurchased,
    NetworkError,
    ServerError,
}
#endif

[ApiController]
[Route("MaiChartManagerServlet/[action]Api")]
public class AppLicenseController : Controller
{
#if WINDOWS
    public record RequestPurchaseResult(string? ErrorMessage, StorePurchaseStatus Status);

    [HttpPost]
    public async Task<RequestPurchaseResult> RequestPurchase()
    {
        var res = await IapManager.Purchase();
        if (res.ExtendedError is not null)
        {
            return new RequestPurchaseResult(res.ExtendedError.Message, res.Status);
        }

        return new RequestPurchaseResult(null, res.Status);
    }

    [HttpPost]
    public async Task<bool> VerifyOfflineKey([FromBody] string key)
    {
        var result = await OfflineReg.VerifyAsync(key);
        if (!result.IsValid) return false;

        StaticSettings.Config.OfflineKey = key;
        StaticSettings.Config.Save();
        IapManager.SetOfflineLicenseActive();
        return true;
    }
#else
    // Linux：始终已授权——不支持商店 / IAP
    public record RequestPurchaseResult(string? ErrorMessage, StorePurchaseStatus Status);

    [HttpPost]
    public Task<RequestPurchaseResult> RequestPurchase()
    {
        return Task.FromResult(new RequestPurchaseResult(null, StorePurchaseStatus.Succeeded));
    }

    [HttpPost]
    public Task<bool> VerifyOfflineKey([FromBody] string key)
    {
        // Linux 不做离线密钥验证；始终视为已授权
        return Task.FromResult(true);
    }
#endif
}
