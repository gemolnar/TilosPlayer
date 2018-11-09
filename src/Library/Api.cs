using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Threading.Tasks;
using TilosPlayer.Library.Domain;

namespace TilosPlayer.Library
{
    public class Api
    {
        private const string API_ENDPOINT = "https://tilos.hu/api/v1/";

        public async Task<Episode> GetEpisode(string episodeId)
        {
            var apiClient = new HttpClient();
            apiClient.BaseAddress = new Uri(API_ENDPOINT);

            var response = await apiClient.GetAsync($"episode/{episodeId}");
            var responseContent = await response.Content.ReadAsStringAsync();

            var result = JsonConvert.DeserializeObject<Episode>(responseContent);
            return result;
        }

        //public async Task<ShowDetails> GetShowDetails

        public async Task<Show[]> GetAllShows()
        {
            var apiClient = new HttpClient();
            apiClient.BaseAddress = new Uri(API_ENDPOINT);
            var response = await apiClient.GetAsync("show?status=all");
            var responseContent = await response.Content.ReadAsStringAsync();

            var result = JsonConvert.DeserializeObject<Show[]>(responseContent);
            return result;
        }


        public async Task<Episode[]> GetEpisodesByTimeRange(DateTimeOffset startDate, DateTimeOffset endDate)
        {
            var apiClient = new HttpClient();
            apiClient.BaseAddress = new Uri(API_ENDPOINT);

            var requestUri = $"episode?start={startDate.ToUnixTimeMilliseconds()}&end={endDate.ToUnixTimeMilliseconds()}";
            var response = await apiClient.GetAsync(requestUri);
            var responseContent = await response.Content.ReadAsStringAsync();

            var result = Newtonsoft.Json.JsonConvert.DeserializeObject<Episode[]>(responseContent);
            return result;
        }

        public async Task<Episode[]> GetEpisodesFromLastWeek()
        {
            var apiClient = new HttpClient();
            apiClient.BaseAddress = new Uri(API_ENDPOINT);

            var requestUri = $"episode/lastWeek";
            var response = await apiClient.GetAsync(requestUri);
            var responseContent = await response.Content.ReadAsStringAsync();

            var result = Newtonsoft.Json.JsonConvert.DeserializeObject<Episode[]>(responseContent);
            return result;
        }


    }
}
