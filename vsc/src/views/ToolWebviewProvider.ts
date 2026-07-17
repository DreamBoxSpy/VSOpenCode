import * as vscode from "vscode";
import { getLoadingPageHtml, getErrorPageHtml, getIframeHtml } from "./templates";

// ---------------------------------------------------------------------------
// ToolWebviewProvider
// ---------------------------------------------------------------------------

/**
 * {@link vscode.WebviewViewProvider} that manages the OpenCode tool window
 * in the VS Code sidebar.
 *
 * ## HTML lifecycle
 *
 * The webview cycles through three HTML pages sourced from
 * {@link ./templates}:
 * 1. **Loading** — spinner + message (set during {@link resolveWebviewView}
 *    and via {@link showLoading}).
 * 2. **Iframe** — full-viewport iframe pointing at the local proxy server
 *    (set via {@link navigateToSession}).
 * 3. **Error** — error message with optional retry button (set via
 *    {@link showError}).
 *
 * ## Message protocol
 *
 * | Direction     | Type    | Payload | Purpose                          |
 * |---------------|---------|---------|----------------------------------|
 * | webview → ext | `retry` | —       | User clicked the retry button    |
 * | webview → ext | `ready` | —       | Session iframe finished loading  |
 */
export class ToolWebviewProvider implements vscode.WebviewViewProvider {
	// -----------------------------------------------------------------------
	// Fields
	// -----------------------------------------------------------------------

	private _view: vscode.WebviewView | null = null;
	/** Error queued before resolveWebviewView() — flushed when the view becomes ready. */
	private _pendingError: { message: string; canRetry: boolean } | null = null;
	private readonly _extensionUri: vscode.Uri;
	private readonly _getProxyUrl: () => string;

	private readonly _onDidRequestRetry = new vscode.EventEmitter<void>();
	/** Fires when the user clicks the retry button on the error page. */
	readonly onDidRequestRetry = this._onDidRequestRetry.event;

	// -----------------------------------------------------------------------
	// Constructor
	// -----------------------------------------------------------------------

	/**
	 * @param extensionUri The extension's root URI (for resolving bundled
	 *   resources — currently unused but required for future template loading).
	 * @param getProxyUrl A function that returns the local proxy server's
	 *   origin (e.g. `http://127.0.0.1:15042`), typically sourced from
	 *   {@link ProxyServer.getProxyUrl}.
	 */
	constructor(extensionUri: vscode.Uri, getProxyUrl: () => string) {
		this._extensionUri = extensionUri;
		this._getProxyUrl = getProxyUrl;
	}

	// -----------------------------------------------------------------------
	// vscode.WebviewViewProvider
	// -----------------------------------------------------------------------

	/**
	 * Called by VS Code when the sidebar webview is first created or
	 * recreated after being hidden.
	 */
	resolveWebviewView(
		webviewView: vscode.WebviewView,
		_context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	): void {
		console.log("[OpenCode] WebView resolved, showing loading...");
		this._view = webviewView;

		webviewView.webview.options = {
			enableScripts: true,
			retainContextWhenHidden: true,
		} as vscode.WebviewOptions;

		// Show the loading spinner until navigateToSession() is called.
		this.showLoading("Starting OpenCode\u2026");

		// Listen for messages from the webview.
		webviewView.webview.onDidReceiveMessage(
			(message: Record<string, unknown>) => {
				switch (message.type) {
					case "retry":
						this._onDidRequestRetry.fire();
						break;
					// 'ready' is informational — no action needed.
				}
			},
		);

		// If an error was queued before the view was ready, display it now.
		if (this._pendingError) {
			const { message, canRetry } = this._pendingError;
			this._pendingError = null;
			this._view.webview.html = getErrorPageHtml(message, canRetry);
		}
	}

	// -----------------------------------------------------------------------
	// Public navigation / display helpers
	// -----------------------------------------------------------------------

	/**
	 * Replace the webview content with an iframe that loads the given
	 * session URL through the local proxy.
	 *
	 * @param sessionUrl The path to load (e.g. `"/"` or `"/session/abc123"`).
	 *   This is appended to the proxy origin returned by `getProxyUrl()`.
	 */
	navigateToSession(sessionUrl: string): void {
		if (!this._view) {
			return;
		}
		const proxyUrl = this._getProxyUrl();
		const src = sessionUrl.startsWith("/")
			? `${proxyUrl}${sessionUrl}`
			: `${proxyUrl}/${sessionUrl}`;
		this._view.webview.html = getIframeHtml(src);
	}

	/**
	 * Show a loading spinner with a message.
	 */
	showLoading(message: string): void {
		if (!this._view) {
			return;
		}
		const html = getLoadingPageHtml(message);
		console.log(`[OpenCode] Loading HTML length: ${html.length}`);
		this._view.webview.html = html;
	}

	/**
	 * Show an error display.
	 *
	 * @param message Human-readable error description.
	 * @param canRetry When `true`, a retry button is rendered that fires
	 *   {@link onDidRequestRetry} when clicked.
	 */
	showError(message: string, canRetry: boolean): void {
		if (!this._view) {
			// View not ready yet — queue the error for resolveWebviewView()
			this._pendingError = { message, canRetry };
			return;
		}
		this._view.webview.html = getErrorPageHtml(message, canRetry);
	}

	/**
	 * Send an arbitrary message to the webview.
	 *
	 * Safe to call before {@link resolveWebviewView} — silently no-ops
	 * when `_view` is null.
	 */
	postMessage(data: unknown): void {
		this._view?.webview.postMessage(data);
	}

	// -----------------------------------------------------------------------
	// Cleanup
	// -----------------------------------------------------------------------

	/**
	 * Dispose the retry event emitter and clear the view reference.
	 * Called by the extension controller on deactivation.
	 */
	dispose(): void {
		this._onDidRequestRetry.dispose();
		this._view = null;
	}
}
