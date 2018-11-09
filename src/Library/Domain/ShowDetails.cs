using Newtonsoft.Json;
namespace TilosPlayer.Library.Domain

{
    public partial class ShowDetails
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("title")]
        public object Title { get; set; }

        [JsonProperty("alias")]
        public string Alias { get; set; }

        [JsonProperty("definition")]
        public string Definition { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("statusTxt")]
        public object StatusTxt { get; set; }

        [JsonProperty("stats")]
        public Stats Stats { get; set; }

        [JsonProperty("mixes")]
        public object[] Mixes { get; set; }

        [JsonProperty("contributors")]
        public Contributor[] Contributors { get; set; }

        [JsonProperty("schedulings")]
        public Scheduling[] Schedulings { get; set; }

        [JsonProperty("urls")]
        public object[] Urls { get; set; }
    }



}
