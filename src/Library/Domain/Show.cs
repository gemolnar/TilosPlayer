using Newtonsoft.Json;
namespace TilosPlayer.Library.Domain

{

    public partial class Show
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("alias")]
        public string Alias { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("definition")]
        public string Definition { get; set; }

    }



}
