using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using TilosPlayer.Library;
using TilosPlayer.Library.Domain;

namespace TilosPlayer.Tests
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public async Task CanGetEpisodeById()
        {
            var api = new Api();
            var e = await api.GetEpisode("5bcd83803c8a1c045c6d017f");

            ////https://tilos.hu/api/v1/episode?start=1540742040000&end=1540770840000
        }

        [TestMethod]
        public async Task CanGetEpisodesByTimeRange()
        {
            var api = new Api();
            var now = DateTimeOffset.Now;
            var episodes = await api.GetEpisodesByTimeRange(now.AddDays(-1), now);
        }

        [TestMethod]
        public async Task CanGetEpisodesFromLastWeek()
        {
            var api = new Api();
            var now = DateTimeOffset.Now;
            var episodes = await api.GetEpisodesFromLastWeek();
        }


        [TestMethod]
        public async Task CanDeserializeAsset()
        {
            var s = AppDomain.CurrentDomain.BaseDirectory;
            var content = await File.ReadAllTextAsync(@"C:\Users\geri\source\repos\TilosPlayer\testassets\lastweek.json");
            var episodes = JsonConvert.DeserializeObject<Episode[]>(content);
            var e1 = episodes.First();

            var urls = episodes.Select(e => $"https://archive.tilos.hu/mp3/tilos-{e.PlannedFrom.ToString("yyyyMMdd")}-{e.PlannedFrom.ToString("hhmmss")}-{e.PlannedTo.ToString("hhmmss")}.mp3").ToArray();
            
            //20181027-133000-153000
        }



    }
}
