using Newtonsoft.Json;

namespace VSOpenCode.Models
{
    /// <summary>
    /// Health check response from GET /global/health.
    /// </summary>
    public class HealthInfo
    {
        [JsonProperty("healthy")]
        public bool Healthy { get; set; }

        [JsonProperty("version")]
        public string Version { get; set; }
    }
}
