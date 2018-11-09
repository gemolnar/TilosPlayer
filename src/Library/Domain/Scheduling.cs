using Newtonsoft.Json;

namespace TilosPlayer.Library.Domain
{
    public partial class Scheduling
    {
        [JsonProperty("id")]
        public long Id { get; set; }

        [JsonProperty("weekDay")]
        public long WeekDay { get; set; }

        [JsonProperty("hourFrom")]
        public long HourFrom { get; set; }

        [JsonProperty("minFrom")]
        public long MinFrom { get; set; }

        [JsonProperty("duration")]
        public long Duration { get; set; }

        [JsonProperty("validFrom")]
        public long ValidFrom { get; set; }

        [JsonProperty("validTo")]
        public long ValidTo { get; set; }

        [JsonProperty("base")]
        public long Base { get; set; }

        [JsonProperty("weekType")]
        public long WeekType { get; set; }

        [JsonProperty("text")]
        public string Text { get; set; }
    }
}
