using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace MaiChartManager.Attributes;

// https://code-maze.com/aspnetcore-upload-large-files/

[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
public class MultipartFormDataAttribute : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext context)
    {
        var request = context.HttpContext.Request;
        if (request.HasFormContentType
            && request.ContentType.StartsWith("multipart/form-data", StringComparison.OrdinalIgnoreCase))
        {
            return;
        }
        context.Result = new StatusCodeResult(StatusCodes.Status415UnsupportedMediaType);
    }
}
