using System;
using System.Security.Cryptography;
using System.Text;
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

        private CancellationTokenSource _shutdownCts;
        private CancellationTokenSource _workspaceCheckCts;
        private const int ShutdownIdleMinutes = 5;
        private const int AgentCheckIntervalMs = 10000;
        private const int WorkspaceCheckIntervalMs = 5000;
        private bool _isDisposed;

        public IOpenCodeServerService ServerService => _serverService;
        public IOpenCodeSessionService SessionService => _sessionService;
        public ConnectionState State => _serverService.State;
        public string CurrentSessionId => _currentSessionId;
        public string CurrentProjectRoot => _currentProjectRoot;

        public void UpdateProjectRoot(string newRoot)
        {
            if (!string.Equals(newRoot, _currentProjectRoot, StringComparison.OrdinalIgnoreCase))
                _currentProjectRoot = newRoot;
        }

        public event Action<ConnectionState> ServerStateChanged;
        public event Action ConnectionLost;
        public event Action ConnectionRestored;
        public event Action WorkspaceMismatch;

        public ServerController()
        {
            _serverService = new OpenCodeServerService();
            _serverService.StateChanged += s => ServerStateChanged?.Invoke(s);
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

            StartWorkspaceCheck();

            return true;
        }


        /// <summary>
        /// Get navigation URL for current project/session.
        /// Uses http://{proj_root_sha}.vsoc-app/... so WebView2 origin is tied to the project root.
        /// </summary>
        public string GetSessionUrl()
        {
            if (_serverService.ServerInfo == null || string.IsNullOrEmpty(_currentSessionId))
                return null;

            var osPath = (_currentProjectRoot ?? "").Replace('/', '\\');
            var b64 = ToUrlSafeBase64(osPath);
            return $"http://opencode.vsoc-app/{b64}/session/{_currentSessionId}";
        }

        public void Stop()
        {
            CancelShutdown();
            _connectionMonitor?.Dispose();
            _connectionMonitor = null;
            _serverService.Stop();
        }

        private void StartWorkspaceCheck()
        {
            _workspaceCheckCts?.Cancel();
            _workspaceCheckCts = new CancellationTokenSource();
            var ct = _workspaceCheckCts.Token;

            _ = Task.Run(async () =>
            {
                while (!ct.IsCancellationRequested)
                {
                    await Task.Delay(WorkspaceCheckIntervalMs, ct);
                    if (ct.IsCancellationRequested) return;

                    if (_serverService.State != ConnectionState.Connected) continue;

                    try
                    {
                        var pathInfo = await _sessionService.GetServerPathAsync();
                        if (pathInfo == null) continue;

                        var dir = ProjectRootResolver.NormalizePath(pathInfo.Directory ?? "");
                        if (string.IsNullOrEmpty(dir)) continue;

                        if (!string.Equals(dir, _currentProjectRoot, StringComparison.OrdinalIgnoreCase))
                        {
                            System.Diagnostics.Debug.WriteLine(
                                $"Server directory changed: {_currentProjectRoot} -> {dir}");
                            _currentProjectRoot = dir;
                            WorkspaceMismatch?.Invoke();
                        }
                    }
                    catch { }
                }
            });
        }

        private void CancelWorkspaceCheck()
        {
            _workspaceCheckCts?.Cancel();
            _workspaceCheckCts?.Dispose();
            _workspaceCheckCts = null;
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
                    System.Diagnostics.Debug.WriteLine($"ServerController shutdown error: {ex}");
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

            Stop();
        }
    }
}
