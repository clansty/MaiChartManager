using Windows.Services.Store;

namespace MaiChartManager;

public static class IapManager
{
    private const string storeId = "9NPJ5N4MMBR5";

    private static StoreContext StoreContext { get; } = StoreContext.GetDefault();

    private static StoreAppLicense? _license;

    private static Form _form;

    public static async Task Init()
    {
        _license = await StoreContext.GetAppLicenseAsync();
    }

    public static void BindToForm(Form form)
    {
        _form = form;
        WinRT.Interop.InitializeWithWindow.Initialize(StoreContext, form.Handle);
    }

    public static async Task<StorePurchaseResult> Purchase()
    {
        if (_form.WindowState == FormWindowState.Minimized)
        {
            _form.WindowState = FormWindowState.Normal;
        }

        _form.Show();
        _form.Activate();
        var res = await StoreContext.RequestPurchaseAsync(storeId);
        if (res.Status == StorePurchaseStatus.Succeeded)
        {
            await Init();
        }

        return res;
    }

    public static bool IsPurchased
    {
        get
        {
            if (_license is null)
            {
                return false;
            }

            var item = _license.AddOnLicenses.FirstOrDefault(x => x.Value.SkuStoreId.StartsWith(storeId));
            if (item.Value is null)
            {
                return false;
            }

            return item.Value.IsActive;
        }
    }
}
