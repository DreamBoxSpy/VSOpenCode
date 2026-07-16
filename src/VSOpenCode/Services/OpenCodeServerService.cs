using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using VSOpenCode.Models;

namespace VSOpenCode.Services
{
    public class OpenCodeServerService : IOpenCodeServerService
    {
        private const int ConnectTimeoutMs = 30000;
        private const int HealthCheckIntervalMs = 500;

        private System.Diagnostics.Process _process;
        private HttpClient _httpClient;
        private ServerInfo _serverInfo;
        private ConnectionState _state = ConnectionState.Disconnected;

        public ServerInfo ServerInfo => _serverInfo;
        public ConnectionState State => _state;
        public event Action<ConnectionState> StateChanged;

        public HttpClient GetClient()
        {
            return _httpClient;
        }

        public async Task<bool> StartAsync(string projectRoot)
        {
            Stop();
            SetState(ConnectionState.Connecting);

            try
            {
                var opencodePath = ResolveOpenCodePath();
                if (opencodePath == null)
                {
                    SetState(ConnectionState.Error);
                    return false;
                }

                var psi = new System.Diagnostics.ProcessStartInfo
                {
                    FileName = opencodePath,
                    Arguments = "serve",
                    WorkingDirectory = projectRoot,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                _process = System.Diagnostics.Process.Start(psi);
                if (_process == null)
                {
                    SetState(ConnectionState.Error);
                    return false;
                }

                ProcessBinding.BindToCurrentProcess(_process);

                var resolvedInfo = await ResolveServerUrlAsync(_process, ConnectTimeoutMs);
                if (resolvedInfo == null)
                {
                    System.Diagnostics.Debug.WriteLine("Failed to detect server URL from process output");
                    SetState(ConnectionState.Error);
                    return false;
                }

                _serverInfo = resolvedInfo;

                var healthy = await WaitForHealthAsync(ConnectTimeoutMs);
                if (healthy)
                {
                    await InitializeHttpClientAsync();
                    SetState(ConnectionState.Connected);
                    return true;
                }

                SetState(ConnectionState.Error);
                return false;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Failed to start server: {ex}");
                SetState(ConnectionState.Error);
                return false;
            }
        }

        public async Task<bool> CheckHealthAsync()
        {
            if (_httpClient == null) return false;
            try
            {
                var response = await _httpClient.GetAsync("/global/health");
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var health = JsonConvert.DeserializeObject<HealthInfo>(json);
                    return health?.Healthy == true;
                }
                return false;
            }
            catch { return false; }
        }

        public void Stop()
        {
            _httpClient?.Dispose();
            _httpClient = null;
            _serverInfo = null;

            if (_process != null && !_process.HasExited)
            {
                try { _process.Kill(); _process.WaitForExit(5000); } catch { }
                _process.Dispose();
            }
            _process = null;
            SetState(ConnectionState.Disconnected);
        }

        public void UpdateConnectionState(bool connected)
        {
            if (connected)
                SetState(ConnectionState.Connected);
            else
                SetState(ConnectionState.Disconnected);
        }

        private static async Task<ServerInfo> ResolveServerUrlAsync(
            System.Diagnostics.Process process, int timeoutMs)
        {
            var tcs = new TaskCompletionSource<ServerInfo>();
            var deadline = DateTime.UtcNow.AddMilliseconds(timeoutMs);

            async Task ReadStreamAsync(System.IO.StreamReader reader, string label)
            {
                try
                {
                    while (DateTime.UtcNow < deadline)
                    {
                        var lineTask = reader.ReadLineAsync();
                        var delayTask = Task.Delay(1000);
                        var completed = await Task.WhenAny(lineTask, delayTask);
                        if (completed == delayTask) continue;
                        var line = await lineTask;
                        if (line == null) break;
                        System.Diagnostics.Debug.WriteLine($"OpenCode {label}: {line}");
                        if (TryParseListenLine(line, out string host, out int port))
                        {
                            tcs.TrySetResult(new ServerInfo(host, port));
                            return;
                        }
                    }
                }
                catch { }
            }

            var stdoutTask = ReadStreamAsync(process.StandardOutput, "stdout");
            var stderrTask = ReadStreamAsync(process.StandardError, "stderr");
            var timeoutTask = Task.Delay(timeoutMs);

            await Task.WhenAny(tcs.Task, timeoutTask);
            return tcs.Task.IsCompleted ? await tcs.Task : null;
        }

        private static bool TryParseListenLine(string line, out string host, out int port)
        {
            host = null;
            port = 0;
            if (string.IsNullOrEmpty(line)) return false;
            const string prefix = "opencode server listening on http://";
            var idx = line.IndexOf(prefix, StringComparison.OrdinalIgnoreCase);
            if (idx < 0) return false;
            var url = line.Substring(idx + prefix.Length).Trim();
            var colonIdx = url.LastIndexOf(':');
            if (colonIdx < 0) return false;
            host = url.Substring(0, colonIdx);
            return int.TryParse(url.Substring(colonIdx + 1), out port);
        }

        private async Task<bool> WaitForHealthAsync(int timeoutMs)
        {
            var deadline = DateTime.UtcNow.AddMilliseconds(timeoutMs);
            while (DateTime.UtcNow < deadline)
            {
                if (await TryConnectAsync(_serverInfo))
                    return true;
                await Task.Delay(HealthCheckIntervalMs);
            }
            return false;
        }

        private async Task<bool> TryConnectAsync(ServerInfo info)
        {
            try
            {
                using (var client = CreateHttpClient(info))
                {
                    client.Timeout = TimeSpan.FromSeconds(3);
                    var response = await client.GetAsync("/global/health");
                    if (response.IsSuccessStatusCode)
                    {
                        var json = await response.Content.ReadAsStringAsync();
                        var health = JsonConvert.DeserializeObject<HealthInfo>(json);
                        return health?.Healthy == true;
                    }
                }
            }
            catch { }
            return false;
        }

        private async Task InitializeHttpClientAsync()
        {
            _httpClient?.Dispose();
            _httpClient = CreateHttpClient(_serverInfo);
            await Task.CompletedTask;
        }

        private static HttpClient CreateHttpClient(ServerInfo info)
        {
            var handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (_, _, _, _) => true
            };
            return new HttpClient(handler)
            {
                BaseAddress = new Uri(info.BaseUrl),
                Timeout = TimeSpan.FromSeconds(30)
            };
        }

        private void SetState(ConnectionState newState)
        {
            if (_state != newState)
            {
                _state = newState;
                StateChanged?.Invoke(newState);
            }
        }

        private static string ResolveOpenCodePath()
        {
            try
            {
                var psi = new System.Diagnostics.ProcessStartInfo
                {
                    FileName = "cmd.exe",
                    Arguments = "/c where opencode 2>nul",
                    RedirectStandardOutput = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };
                using (var proc = System.Diagnostics.Process.Start(psi))
                {
                    var output = proc.StandardOutput.ReadToEnd();
                    proc.WaitForExit(3000);
                    var lines = output.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
                    foreach (var line in lines)
                    {
                        var trimmed = line.Trim();
                        if (trimmed.EndsWith(".cmd", StringComparison.OrdinalIgnoreCase))
                            return trimmed;
                        if (trimmed.EndsWith(".exe", StringComparison.OrdinalIgnoreCase))
                            return trimmed;
                    }
                }
            }
            catch { }

            var commonPaths = new[]
            {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "npm", "opencode.cmd"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "nvmw", "nodejs", "opencode.cmd"),
                Path.Combine(Environment.GetEnvironmentVariable("ProgramFiles") ?? "", "nodejs", "opencode.cmd"),
            };
            foreach (var path in commonPaths)
                if (File.Exists(path)) return path;

            return null;
        }
    }
}
