using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace AngularStudy.Controllers
{

    public class ProxyResult : IActionResult
    {
        private readonly HttpResponseMessage originalResponse;


        public ProxyResult(HttpResponseMessage originalResponse)
        {
            this.originalResponse = originalResponse;
        }

        public async Task ExecuteResultAsync(ActionContext context)
        {
            using(originalResponse)
            {
                var response = context.HttpContext.Response;

                response.StatusCode = (int)originalResponse.StatusCode;
                response.ContentType = originalResponse.Content?.Headers?.ContentType?.ToString() ?? string.Empty;
                response.ContentLength = originalResponse.Content?.Headers?.ContentLength;
            
                var originalResponseStream = await originalResponse.Content.ReadAsStreamAsync();
                await originalResponseStream.CopyToAsync(response.Body);
                await response.CompleteAsync();
            }
        }
    }

    //[ApiController]
    [Route("api/v1")]
    [Route("upload/musorok")]
    //[Route("upload/musorok")]
    public class TilosProxyController : ControllerBase
    {
        private static readonly HttpClient _apiClient = new HttpClient();

        private readonly ILogger<TilosProxyController> _logger;

        public TilosProxyController(ILogger<TilosProxyController> logger)
        {
            _logger = logger;
        }


        [HttpGet]
        [Route("{*catchall}")]
        public async Task<IActionResult> Get(string catchall)
        {
            var pathSegment = Request.Path.Value.Contains("api/v1") ?
                "api/v1" :
                "upload/musorok";
            var originalSourceUrl = $"http://tilos.hu/{pathSegment}/{catchall}{Request.QueryString}";
            var originalSourceResponse = await _apiClient.GetAsync(originalSourceUrl);
            return new ProxyResult(originalSourceResponse);
        }
    }


    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }
    }
}
