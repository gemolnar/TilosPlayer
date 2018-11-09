using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Threading.Tasks;
using tilos;
using TilosPlayer.Library;
using TilosPlayer.Library.Domain;

namespace TilosPlayer.Website.Controllers
{
    public class HomeController : Controller
    {
        public IServiceProvider ServiceProvider { get; }
        public string WebRootPath { get; }

        public HomeController(IServiceProvider serviceProvider)
        {
            ServiceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
            WebRootPath = serviceProvider.GetService<WebRootPathProvider>().ContentRootPath;
        }


        public async Task<IActionResult> Index(int w)
        {
            var api = new Api();
            var now = DateTimeOffset.UtcNow;
            var episodes = await api.GetEpisodesByTimeRange(now.AddDays(-7 * (w+1)), now.AddDays(-7*w));
            var shows = await api.GetAllShows();
            foreach (var episode in episodes)
            {
                var show = shows.Where(s => s.Id == episode.Show.Id).SingleOrDefault();
                episode.Show = show;
            }
            episodes = episodes.OrderByDescending(e => e.RealFrom).ToArray();
            return View(episodes);
        }

        //public async Task<IActionResult> Index()
        //{
        //    //TimeZoneInfo.ConvertTime(DateTime.UtcNow, TimeZoneInfo.GetSystemTimeZones)



        //    //var source = "https://tilos.hu/feed/podcast";
        //    var baseDir = WebRootPath;
        //    var source = string.Concat(baseDir, @"\weekly.atom.xml");
        //    //var source = @"C:\Users\geri\source\repos\tilos\tilos\podcast.atom.xml";
        //    try
        //    {
        //        var atomReader = new AtomFeedReader();
        //        var atomFeedModel = await atomReader.ParseAtomFeed(source);
        //        var tilosFeedModel = new TilosPodcastModel(atomFeedModel);
        //        var xy = tilosFeedModel.Items;
        //        var httpClient = new HttpClient();

        //        //return Json(tilosFeedModel, new Newtonsoft.Json.JsonSerializerSettings() { Formatting  = Newtonsoft.Json.Formatting.Indented });
        //        return View(tilosFeedModel);
        //    }
        //    catch(FileNotFoundException fex)
        //    {
        //        return Json(new { Files = Directory.GetFileSystemEntries(Path.GetDirectoryName(source)), Root = source, Ex = fex.Message, ExFile = fex.FileName });
        //    }
        //}

        //public IActionResult About()
        //{
        //    ViewData["Message"] = "Your application description page.";

        //    return View();
        //}

        //public IActionResult Contact()
        //{
        //    ViewData["Message"] = "Your contact page.";

        //    return View();
        //}

        //public IActionResult Privacy()
        //{
        //    return View();
        //}

        //[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        //public IActionResult Error()
        //{
        //    return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        //}
    }
}
