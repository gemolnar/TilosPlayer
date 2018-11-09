namespace TilosPlayer.Library.Domain
{
    using Newtonsoft.Json;

    public partial class Stats
        {
            [JsonProperty("mixCount")]
            public long MixCount { get; set; }

            [JsonProperty("bookmarkCount")]
            public long BookmarkCount { get; set; }
        }



}
