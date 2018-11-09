using System;
using Newtonsoft.Json;

namespace TilosPlayer.Library.Domain
{
    public partial class Author
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("name")]
        public object Name { get; set; }

        [JsonProperty("alias")]
        public string Alias { get; set; }

        [JsonProperty("avatar")]
        public Uri Avatar { get; set; }
    }
}
