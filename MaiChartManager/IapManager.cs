using Windows.Services.Store;

namespace MaiChartManager;

public static class IapManager
{
    private const string storeId = "9NPJ5N4MMBR5";

    private static StoreContext StoreContext { get; } = StoreContext.GetDefault();

    private static Form _form;

    public enum LicenseStatus
    {
        Pending,
        Active,
        Inactive
    }

    public static LicenseStatus License { get; private set; } = LicenseStatus.Pending;

    public static async Task Init()
    {
        var license = await StoreContext.GetAppLicenseAsync();
        if (license is null)
        {
            License = LicenseStatus.Inactive;
            return;
        }

        var item = license.AddOnLicenses.FirstOrDefault(x => x.Value.SkuStoreId.StartsWith(storeId));
        if (item.Value is null)
        {
            License = LicenseStatus.Inactive;
            return;
        }

        if (item.Value.IsActive)
        {
            License = LicenseStatus.Active;
        }
        else
        {
            License = LicenseStatus.Inactive;
        }
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
}
