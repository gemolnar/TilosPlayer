using Newtonsoft.Json;

namespace TilosPlayer.Library.Domain
{
    public partial class Contributor
    {
        [JsonProperty("nick")]
        public string Nick { get; set; }

        [JsonProperty("author")]
        public Author Author { get; set; }
    }
}
