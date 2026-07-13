namespace VSOpenCode.Services
{
    public enum ConnectionState
    {
        Disconnected,
        Connecting,
        Connected,
        Error
    }

    /// <summary>
    /// Manages the OpenCode server process lifecycle and HTTP connectivity.
    /// </summary>
    public interface IOpenCodeServerService
    {
        /// <summary>
        /// Current server info (host/port). Null if never started.
        /// </summary>
        Models.ServerInfo ServerInfo { get; }

        /// <summary>
        /// Current connection state.
        /// </summary>
        ConnectionState State { get; }

        /// <summary>
        /// Gets an HttpClient configured for the current server.
        /// Returns null if the server is not running.
        /// </summary>
        System.Net.Http.HttpClient GetClient();

        /// <summary>
        /// Starts the opencode serve process with the given working directory.
        /// Returns true if the server started and is reachable.
        /// </summary>
        System.Threading.Tasks.Task<bool> StartAsync(string projectRoot);

        /// <summary>
        /// Checks if the server is healthy by calling GET /global/health.
        /// </summary>
        System.Threading.Tasks.Task<bool> CheckHealthAsync();

        /// <summary>
        /// Stops the server process.
        /// </summary>
        void Stop();

        /// <summary>
        /// Raised when connection state changes.
        /// </summary>
        event System.Action<ConnectionState> StateChanged;
    }
}
