namespace TilosPlayer.Library.Domain
{
    using Newtonsoft.Json;

    public partial class StatListeners
        {
            [JsonProperty("max")]
            public long Max { get; set; }

            [JsonProperty("mean")]
            public long Mean { get; set; }

            [JsonProperty("min")]
            public long Min { get; set; }
        }



}
