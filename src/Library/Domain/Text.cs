namespace TilosPlayer.Library.Domain
{
    using Newtonsoft.Json;

    public partial class Text
        {
            [JsonProperty("title")]
            public string Title { get; set; }

            [JsonProperty("type")]
            public string Type { get; set; }

            [JsonProperty("format")]
            public string Format { get; set; }

            [JsonProperty("content")]
            public string Content { get; set; }

            [JsonProperty("formatted")]
            public string Formatted { get; set; }
        }



}
