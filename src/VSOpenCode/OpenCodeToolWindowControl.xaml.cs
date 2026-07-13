using System;
using System.IO;
using System.Reflection;
using System.Threading.Tasks;
using System.Windows.Controls;
using Microsoft.VisualStudio.Shell;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.Wpf;
using VSOpenCode.Commands;
using VSOpenCode.Resources;
using VSOpenCode.Services;

namespace VSOpenCode
{
    public partial class OpenCodeToolWindowControl : UserControl, IDisposable
    {
        private IServiceProvider _serviceProvider;

        private CoreWebView2Environment _environment;
        private IProjectRootResolver _projectRootResolver;
        private ServerController _serverController;

        private const string ErrorPageHost = "https://vscode-error.local/";

        private string _currentProjectRoot;
        private bool _isDisposed;
        private bool _isStarting;
        private bool _retryDisabled;
        private bool _isShowingError;
        private System.Threading.Timer _projRootTimer;

        private static readonly string ErrorPageTemplate;
        private static readonly string LoadingPageTemplate;
        private static readonly string InjectProjectScript;

        static OpenCodeToolWindowControl()
        {
            var assembly = Assembly.GetExecutingAssembly();
            ErrorPageTemplate = LoadResourceString(assembly, "VSOpenCode.Resources.ErrorPage.html");
            LoadingPageTemplate = LoadResourceString(assembly, "VSOpenCode.Resources.LoadingPage.html");
            InjectProjectScript = LoadResourceString(assembly, "VSOpenCode.Resources.InjectProject.js");
        }

        private static string LoadResourceString(Assembly assembly, string name)
        {
            using (var stream = assembly.GetManifestResourceStream(name))
            using (var reader = new StreamReader(stream))
            {
                return reader.ReadToEnd();
            }
        }

        public OpenCodeToolWindowControl()
        {
            InitializeComponent();
            _ = InitWebViewCoreAsync()
                .ContinueWith(_ => WaitServerAsync(), TaskScheduler.Current);
        }

        public void SetServiceProvider(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        /// <summary>
        /// Set the shared server controller. Must be called before StartAsync.
        /// </summary>
        public void SetServerController(ServerController controller)
        {
            _serverController = controller;
            if (_serverController != null)
            {
                _serverController.ConnectionLost += OnServerConnectionLost;
                _serverController.ConnectionRestored += OnServerConnectionRestored;
            }
        }

        private async Task InitWebViewCoreAsync()
        {
            try
            {
                var userDataFolder = Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                    "VSOpenCode",
                    "WebView2");

                Directory.CreateDirectory(userDataFolder);

                _environment = await CoreWebView2Environment.CreateAsync(
                    browserExecutableFolder: null,
                    userDataFolder: userDataFolder);

                await webView.EnsureCoreWebView2Async(_environment);

                webView.CoreWebView2.NavigationStarting += OnNavigationStarting;
                webView.CoreWebView2.WebMessageReceived += OnWebMessageReceived;

                await ShowLoadingPageAsync(StringsHelper.UILoading);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"WebView2 init failed: {ex.Message}");
                await ShowErrorPageAsync(
                    $"{StringsHelper.ErrorWebViewInitFailed}: {ex.Message}", false);
            }
        }

        private async Task WaitServerAsync()
        {
            await Task.Delay(500);
            if(_serverController == null)
            {
                await ThreadHelper.JoinableTaskFactory.SwitchToMainThreadAsync();
                ShowOpenCodeWindowCommand.Instance.RefreshWindow();
            }
        }

        public async Task StartAsync()
        {
            if (_isStarting) return;
            _isStarting = true;

            try
            {
                // Check server status before starting flow
                if (webView.CoreWebView2 != null && _serverController != null)
                {
                    var isRunning = _serverController.State == ConnectionState.Connected;
                    System.Diagnostics.Debug.WriteLine(
                        $"Tool window init: server running={isRunning}, proj={_currentProjectRoot}");
                }

                await StartFlowAsync();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Start flow failed: {ex}");
                await ShowErrorPageAsync($"Failed: {ex.Message}", true);
            }
            finally
            {
                _isStarting = false;
            }
        }

        public void OnWindowClosing()
        {
            _projRootTimer?.Dispose();
            _projRootTimer = null;
        }

        private void OnServerConnectionLost()
        {
            var state = _serverController?.State ?? ConnectionState.Disconnected;
            System.Diagnostics.Debug.WriteLine($"Server connection lost! State: {state}");

            _ = ThreadHelper.JoinableTaskFactory.RunAsync(async () =>
            {
                await ThreadHelper.JoinableTaskFactory.SwitchToMainThreadAsync();
                var msg = state switch
                {
                    ConnectionState.Error => "OpenCode server encountered an error.\n\nClick Retry to restart.",
                    _ => StringsHelper.ErrorConnectionLost
                };
                await ShowErrorPageAsync(msg, true);
            });
        }

        private void OnServerConnectionRestored()
        {
            System.Diagnostics.Debug.WriteLine("Server connection restored!");
            _ = ThreadHelper.JoinableTaskFactory.RunAsync(async () =>
            {
                await ThreadHelper.JoinableTaskFactory.SwitchToMainThreadAsync();
                var url = _serverController?.GetSessionUrl();
                if (url != null && webView.CoreWebView2 != null)
                    webView.CoreWebView2.Navigate(url);
                else
                    await StartFlowAsync();
            });
        }

        private async Task StartFlowAsync()
        {
            await ShowLoadingPageAsync(StringsHelper.UIConnecting);
            await ThreadHelper.JoinableTaskFactory.SwitchToMainThreadAsync();

            // Resolve project root
            if (_projectRootResolver == null)
                _projectRootResolver = new ProjectRootResolver(_serviceProvider);
            var newProjectRoot = _projectRootResolver.ResolveProjectRoot();
            System.Diagnostics.Debug.WriteLine($"Project root: {newProjectRoot} (current: {_currentProjectRoot})");

            if (_serverController == null) return;

            // If workspace unchanged and server already connected, just navigate
            if (string.Equals(newProjectRoot, _currentProjectRoot, StringComparison.OrdinalIgnoreCase)
                && _serverController.State == ConnectionState.Connected
                && !string.IsNullOrEmpty(_serverController.CurrentSessionId))
            {
                var existingUrl = _serverController.GetSessionUrl();
                if (existingUrl != null)
                {
                    NavigateToSession(existingUrl, newProjectRoot);
                    return;
                }
            }

            _currentProjectRoot = newProjectRoot;

            // Start server and get session
            var success = await _serverController.StartAsync(_currentProjectRoot);
            if (!success)
            {
                await ShowErrorPageAsync(StringsHelper.ErrorServerStartFailed, true);
                return;
            }

            var sessionUrl = _serverController.GetSessionUrl();
            if (sessionUrl != null)
            {
                NavigateToSession(sessionUrl, _currentProjectRoot);
            }

            _projRootTimer?.Dispose();
            _projRootTimer = new System.Threading.Timer(_ =>
            {
                _ = ThreadHelper.JoinableTaskFactory.RunAsync(async () =>
                {
                    try
                    {
                        // Direct HTTP health check every 5s
                        if (_serverController?.ServerService != null)
                        {
                            var healthy = await _serverController.ServerService.CheckHealthAsync();
                            if (!healthy && _serverController.State != ConnectionState.Connecting
                                && !_isStarting && !_isShowingError)
                            {
                                await ThreadHelper.JoinableTaskFactory.SwitchToMainThreadAsync();
                                await ShowErrorPageAsync(StringsHelper.ErrorConnectionLost, true);
                                return;
                            }
                        }

                        await ThreadHelper.JoinableTaskFactory.SwitchToMainThreadAsync();
                        if (_projectRootResolver == null)
                            _projectRootResolver = new ProjectRootResolver(_serviceProvider);
                        var resolved = _projectRootResolver.ResolveProjectRoot();
                        if (!string.Equals(resolved, _currentProjectRoot, StringComparison.OrdinalIgnoreCase))
                        {
                            System.Diagnostics.Debug.WriteLine($"proj_root changed: {_currentProjectRoot} -> {resolved}");
                            _currentProjectRoot = resolved;
                            _serverController?.UpdateProjectRoot(resolved);
                        }
                    }
                    catch (Exception ex)
                    {
                        System.Diagnostics.Debug.WriteLine($"timer: {ex.Message}");
                    }
                });
            }, null, 5000, 5000);
        }

        private void NavigateToSession(string sessionUrl, string projectRoot)
        {
            _isShowingError = false;
            if (webView.CoreWebView2 == null) return;

            System.Diagnostics.Debug.WriteLine($"Navigating to: {sessionUrl}");

            var osPath = projectRoot.Replace('/', '\\');
            var injectOnce = false;
            EventHandler<CoreWebView2NavigationCompletedEventArgs> onLoaded = null;
            onLoaded = (s, args) =>
            {
                webView.CoreWebView2.NavigationCompleted -= onLoaded;
                if (injectOnce || !args.IsSuccess) return;
                injectOnce = true;

#pragma warning disable VSSDK007
                _ = ThreadHelper.JoinableTaskFactory.RunAsync(async () =>
                {
                    await InjectProjectIntoLocalStorageAsync(osPath);
                    await ThreadHelper.JoinableTaskFactory.SwitchToMainThreadAsync();
                    webView.CoreWebView2.Reload();
                });
#pragma warning restore VSSDK007
            };
            webView.CoreWebView2.NavigationCompleted += onLoaded;
            webView.CoreWebView2.Navigate(sessionUrl);
        }

        private void OnWebMessageReceived(object sender, CoreWebView2WebMessageReceivedEventArgs e)
        {
            var message = e.TryGetWebMessageAsString();
            if (message == "retry" && !_retryDisabled)
            {
                _retryDisabled = true;
                _isShowingError = false;
#pragma warning disable VSSDK007
                _ = ThreadHelper.JoinableTaskFactory.RunAsync(async () =>
                {
                    await ThreadHelper.JoinableTaskFactory.SwitchToMainThreadAsync();
                    try
                    {
                        await StartFlowAsync();
                    }
                    finally
                    {
                        _retryDisabled = false;
                    }
                });
#pragma warning restore VSSDK007
            }
        }

        private async Task ShowLoadingPageAsync(string message)
        {
            var html = LoadingPageTemplate.Replace("{message}", message);
            await ThreadHelper.JoinableTaskFactory.SwitchToMainThreadAsync();
            if (webView.CoreWebView2 != null)
            {
                webView.CoreWebView2.NavigateToString(html);
            }
        }

        private async Task ShowErrorPageAsync(string message, bool showRetry)
        {
            var escapedMessage = System.Net.WebUtility.HtmlEncode(message)
                .Replace("\n", "<br>")
                .Replace("\\n", "<br>");
            var retryButton = showRetry
                ? $@"<button id=""retryBtn"" onclick=""handleRetry()"">{StringsHelper.UIRetry}</button>"
                : "";
            var retryScript = showRetry
                ? @"var disabled=false;function handleRetry(){if(disabled)return;disabled=true;var b=document.getElementById('retryBtn');b.disabled=true;b.style.opacity='0.5';b.style.cursor='not-allowed';try{window.chrome.webview.postMessage('retry')}catch(e){}}"
                : "";

            var html = ErrorPageTemplate
                .Replace("{message}", escapedMessage)
                .Replace("{retryButton}", retryButton)
                .Replace("{retryScript}", retryScript);

            await ThreadHelper.JoinableTaskFactory.SwitchToMainThreadAsync();
            if (webView.CoreWebView2 != null)
            {
                webView.CoreWebView2.NavigateToString(html);
            }
        }

        private void OnNavigationStarting(object sender, CoreWebView2NavigationStartingEventArgs e)
        {
            if (e.Uri?.StartsWith(ErrorPageHost) == true) e.Cancel = true;
        }

        private async Task InjectProjectIntoLocalStorageAsync(string worktree)
        {
            if (webView?.CoreWebView2 == null) return;
            try
            {
                var escaped = worktree.Replace("\\", "\\\\").Replace("'", "\\'");
                var script = InjectProjectScript.Replace("{worktree}", escaped);
                await webView.CoreWebView2.ExecuteScriptAsync(script);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Inject localStorage failed: {ex.Message}");
            }
        }

        public void Dispose()
        {
            if (_isDisposed) return;
            _isDisposed = true;
            _projRootTimer?.Dispose();
            webView?.Dispose();
        }
    }
}
