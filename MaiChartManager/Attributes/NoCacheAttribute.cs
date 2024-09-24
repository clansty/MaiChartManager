using Microsoft.AspNetCore.Mvc.Filters;

namespace MaiChartManager.Attributes;

public class NoCacheAttribute : ActionFilterAttribute
{
    public override void OnResultExecuting(ResultExecutingContext filterContext)
    {
        base.OnResultExecuting(filterContext);

        filterContext.HttpContext.Response.Headers.CacheControl = "no-cache, no-store, must-revalidate";
        filterContext.HttpContext.Response.Headers.Expires = "-1";
        filterContext.HttpContext.Response.Headers.Pragma = "no-cache";
    }
}
