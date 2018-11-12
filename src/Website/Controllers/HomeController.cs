﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System;
using System.Globalization;
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


        public async Task<IActionResult> Index(string id) 
        {
            DateTime requestedDate;
            if (id == null || !DateTime.TryParseExact(id, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out requestedDate))
            {
                return RedirectToAction("Index", "Home", new { id = DateTime.UtcNow.ToString("yyyy-MM-dd") });
            }

            var api = new Api();
            var now = DateTimeOffset.UtcNow; 
            var episodes = await api.GetEpisodesByTimeRange(requestedDate.AddDays(-7), requestedDate);
            var shows = await api.GetAllShows();
            foreach (var episode in episodes)
            {
                var show = shows.Where(s => s.Id == episode.Show.Id).SingleOrDefault();
                episode.Show = show;
            }
            episodes = episodes.OrderByDescending(e => e.RealFrom).ToArray();
            return View(episodes);
        }
    }
}
