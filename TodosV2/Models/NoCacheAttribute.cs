using System;
using Microsoft.AspNetCore.Mvc.Filters;

namespace TodosV2.Infrastructure
{
    // this attribute to be sure that we have Get request all the time we call it 
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public sealed class NoCacheAttribute : ActionFilterAttribute
    {
        public override void OnResultExecuting(ResultExecutingContext context)
        {
            context.HttpContext.Response.Headers["Cache-Control"] = "no-cache, no-store, max-age=0";
            context.HttpContext.Response.Headers["Pragma"] = "no-cache";
            context.HttpContext.Response.Headers["Expires"] = "-1";

            base.OnResultExecuting(context);
        }
    }
}