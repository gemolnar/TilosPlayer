using Newtonsoft.Json;
using System;
using System.Linq;

namespace TilosPlayer.Library.Domain
{
    public partial class Episode
    {
        private static TimeZoneInfo _cetTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Central Europe Standard Time");

        private static DateTimeOffset GetHungarianLocalTime(long unixTimeStamp)
        {
            var utcResult = DateTimeOffset.FromUnixTimeMilliseconds(unixTimeStamp);
            var cetResult = TimeZoneInfo.ConvertTime(utcResult, _cetTimeZone);
            return cetResult;
        }

        [JsonProperty("plannedFrom")]
        public long PlannedFromTimestamp { get; set; }
        //[JsonIgnore]
        [JsonProperty("plannedFromDateTime")]
        public DateTimeOffset PlannedFrom { get => GetHungarianLocalTime(PlannedFromTimestamp); }

        [JsonProperty("plannedTo")]
        public long PlannedToTimestamp { get; set; }
        //[JsonIgnore]
        [JsonProperty("plannedToDateTime")]
        public DateTimeOffset PlannedTo { get => GetHungarianLocalTime(PlannedToTimestamp); }

        [JsonProperty("realFrom")]
        public long RealFromTimestamp { get; set; }
        //[JsonIgnore]
        [JsonProperty("realFromDateTime")]
        public DateTimeOffset RealFrom { get => GetHungarianLocalTime(RealFromTimestamp); }

        [JsonProperty("realTo")]
        public long RealToTimestamp { get; set; }
        //[JsonIgnore]
        [JsonProperty("realToDateTime")]
        public DateTimeOffset RealTo { get => GetHungarianLocalTime(RealToTimestamp); }

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("show")]
        public Show Show { get; set; }

        [JsonProperty("text")]
        public Text Text { get; set; }

        [JsonProperty("m3uUrl")]
        public Uri M3UUrl { get; set; }

        [JsonProperty("extra")]
        public bool Extra { get; set; }

        [JsonProperty("original")]
        public bool Original { get; set; }

        [JsonProperty("url")]
        public string Url { get; set; }

        [JsonProperty("tags")]
        public object[] Tags { get; set; }

        [JsonProperty("bookmarks")]
        public object[] Bookmarks { get; set; }

        [JsonProperty("events")]
        public object[] Events { get; set; }

        [JsonProperty("persistent")]
        public bool Persistent { get; set; }

        [JsonProperty("statListeners")]
        public StatListeners StatListeners { get; set; }

        [JsonProperty("inThePast")]
        public bool InThePast { get; set; }

        [JsonProperty("mediaUrl")]
        public string MediaUrl { get => $"https://archive.tilos.hu/mp3/tilos-{RealFrom.ToString("yyyyMMdd")}-{RealFrom.ToString("HHmmss")}-{RealTo.ToString("HHmmss")}.mp3"; }

        [JsonProperty("lengthInSeconds")]
        public int LengthInSeconds { get => (int)RealTo.Subtract(RealFrom).TotalSeconds; }

        [JsonProperty("composedTitle")]
        public string ComposedTitle
        {
            get => Text?.Title ?? Show?.Definition ?? string.Empty;
        }

        public string FormattedAgo
        {
            get
            {
                var ago = DateTimeOffset.Now.Subtract(RealFrom);
                string formattedAgo;
                if (ago.Days > 7)
                {
                    var days = ago.Days % 7;
                    var weeks = ago.Days / 7;
                    formattedAgo = $"{weeks} hete és {ago.Days} napja";
                }
                else if (ago.Days > 0)
                {
                    formattedAgo = $"{ago.Days} napja és {ago.Hours} órája";
                }
                else
                {
                    formattedAgo = $"{ago.Hours} órája és {ago.Minutes} perce";
                }
                return formattedAgo;
            }
        }

    }
}
