using System;
using System.Threading;
using System.Threading.Tasks;
using VSOpenCode.Models;

namespace VSOpenCode.Services
{
    /// <summary>
    /// Manages OpenCode server lifecycle independently of any tool window.
    /// Supports ownership transfer between windows with mutual exclusion.
    /// </summary>
    public class ServerController : IDisposable
    {
        private readonly IOpenCodeServerService _serverService;
        private IConnectionMonitor _connectionMonitor;
        private IOpenCodeSessionService _sessionService;

        private string _currentProjectRoot;
        private string _currentSessionId;

        private object _currentOwner;
        private readonly object _ownerLock = new object();

        private CancellationTokenSource _shutdownCts;
        private const int ShutdownIdleMinutes = 5;
        private const int AgentCheckIntervalMs = 10000;
        private bool _isDisposed;

        public IOpenCodeServerService ServerService => _serverService;
        public IOpenCodeSessionService SessionService => _sessionService;
        public ConnectionState State => _serverService.State;
        public string CurrentSessionId => _currentSessionId;
        public string CurrentProjectRoot => _currentProjectRoot;

        public event Action<ConnectionState> ServerStateChanged;
        public event Action ConnectionLost;
        public event Action ConnectionRestored;

        public ServerController()
        {
            _serverService = new OpenCodeServerService();
            _serverService.StateChanged += s => ServerStateChanged?.Invoke(s);
        }

        /// <summary>
        /// Try to acquire ownership. Returns true if successful.
        /// Fails if already owned by a different window.
        /// </summary>
        public bool TryAcquire(object owner)
        {
            lock (_ownerLock)
            {
                if (_currentOwner != null && _currentOwner != owner)
                    return false;

                _currentOwner = owner;
                CancelShutdown();
                return true;
            }
        }

        /// <summary>
        /// Release ownership. If no other owner, starts shutdown countdown.
        /// </summary>
        public void Release(object owner)
        {
            lock (_ownerLock)
            {
                if (_currentOwner != owner) return;
                _currentOwner = null;
            }

            _connectionMonitor?.Stop();
            StartShutdownCountdown();
        }

        /// <summary>
        /// Start server for the given project root, creating or finding a session.
        /// </summary>
        public async Task<bool> StartAsync(string projectRoot)
        {
            CancelShutdown();
            _currentProjectRoot = projectRoot;

            _sessionService = new OpenCodeSessionService(_serverService);

            var running = await _serverService.CheckHealthAsync();

            if (!running)
            {
                var started = await _serverService.StartAsync(projectRoot);
                if (!started || _serverService.State != ConnectionState.Connected)
                    return false;
            }

            // Get or create session
            Models.Session curSession = null;
            try
            {
                var sessions = await _sessionService.ListSessionsAsync(projectRoot);
                foreach (var s in sessions)
                {
                    if (string.Equals(
                        ProjectRootResolver.NormalizePath(s.Directory ?? ""),
                        projectRoot,
                        StringComparison.OrdinalIgnoreCase))
                    {
                        curSession = s;
                        break;
                    }
                }
            }
            catch { }

            if (curSession == null)
            {
                curSession = await _sessionService.CreateSessionAsync(projectRoot);
            }

            _currentSessionId = curSession.Id;

            // Start connection monitoring
            if (_connectionMonitor == null)
            {
                _connectionMonitor = new ConnectionMonitor(_serverService, 5000);
                _connectionMonitor.ConnectionLost += () => ConnectionLost?.Invoke();
                _connectionMonitor.ConnectionRestored += () => ConnectionRestored?.Invoke();
            }
            _connectionMonitor.Start();

            return true;
        }

        /// <summary>
        /// Get navigation URL for current project/session.
        /// </summary>
        public string GetSessionUrl()
        {
            if (_serverService.ServerInfo == null || string.IsNullOrEmpty(_currentSessionId))
                return null;

            var osPath = (_currentProjectRoot ?? "").Replace('/', '\\');
            var b64 = ToUrlSafeBase64(osPath);
            var host = $"{_serverService.ServerInfo.Host}:{_serverService.ServerInfo.Port}";
            return $"http://{host}/{b64}/session/{_currentSessionId}";
        }

        public void Stop()
        {
            CancelShutdown();
            _connectionMonitor?.Dispose();
            _connectionMonitor = null;
            _serverService.Stop();
        }

        private void StartShutdownCountdown()
        {
            _shutdownCts?.Cancel();
            _shutdownCts = new CancellationTokenSource();
            var ct = _shutdownCts.Token;

            _ = Task.Run(async () =>
            {
                try
                {
                    while (!ct.IsCancellationRequested)
                    {
                        var busy = await IsAgentBusyAsync(ct);
                        if (busy)
                        {
                            await Task.Delay(AgentCheckIntervalMs, ct);
                            continue;
                        }

                        await Task.Delay(ShutdownIdleMinutes * 60 * 1000, ct);

                        if (!ct.IsCancellationRequested)
                        {
                            var stillBusy = await IsAgentBusyAsync(ct);
                            if (stillBusy) continue;

                            System.Diagnostics.Debug.WriteLine("ServerController: idle timeout, stopping server");
                            Stop();
                            break;
                        }
                    }
                }
                catch (OperationCanceledException) { }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine($"ServerController shutdown error: {ex.Message}");
                }
            });
        }

        private void CancelShutdown()
        {
            if (_shutdownCts != null)
            {
                _shutdownCts.Cancel();
                _shutdownCts.Dispose();
                _shutdownCts = null;
            }
        }

        private async Task<bool> IsAgentBusyAsync(CancellationToken ct)
        {
            if (string.IsNullOrEmpty(_currentSessionId)
                || _serverService.State != ConnectionState.Connected)
                return false;

            try
            {
                var client = _serverService.GetClient();
                if (client == null) return false;

                var response = await client.GetAsync(
                    $"/session/{_currentSessionId}/status", ct);
                if (!response.IsSuccessStatusCode) return false;

                var json = await response.Content.ReadAsStringAsync();
                return json.Contains("\"status\":\"busy\"")
                    || json.Contains("\"status\":\"working\"");
            }
            catch
            {
                return false;
            }
        }

        private static string ToUrlSafeBase64(string text)
        {
            var bytes = System.Text.Encoding.UTF8.GetBytes(text);
            return Convert.ToBase64String(bytes)
                .Replace('+', '-')
                .Replace('/', '_')
                .TrimEnd('=');
        }

        public void Dispose()
        {
            if (_isDisposed) return;
            _isDisposed = true;

            lock (_ownerLock) { _currentOwner = null; }
            Stop();
        }
    }
}
