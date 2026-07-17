/**
 * HTML page templates for the VS Code webview panel.
 *
 * HTML source lives in `./templates/*.html` and is imported at build time
 * via esbuild's text loader.  Runtime placeholders (e.g. `{{message}}`) are
 * replaced with escaped user-provided values.
 */

import loadingHtml from "./templates/loading.html";
import errorHtml from "./templates/error.html";
import iframeHtml from "./templates/iframe.html";

// ---------------------------------------------------------------------------
// filler
// ---------------------------------------------------------------------------

/**
 * Replace `{{key}}` placeholders in `template` with the corresponding values
 * from `values`.  Keys are matched literally — no escaping is performed by
 * this function; callers must HTML-escape values before passing them in.
 */
function fill(template: string, values: Record<string, string>): string {
	let result = template;
	for (const [key, value] of Object.entries(values)) {
		result = result.replaceAll(`{{${key}}}`, value);
	}
	return result;
}

// ---------------------------------------------------------------------------
// public API
// ---------------------------------------------------------------------------

/**
 * Generate a loading page with a spinner and message text.
 *
 * @param message - Text to display below the spinner.
 * @returns Complete HTML document as a string.
 */
export function getLoadingPageHtml(message: string): string {
	return fill(loadingHtml, { message: escapeHtml(message) });
}

/**
 * Generate an error page with an optional retry button.
 *
 * @param message - Error message to display. Newlines are converted to
 *   `<br>` elements.
 * @param canRetry - When `true`, a "Retry" button is rendered that posts
 *   `{ type: 'retry' }` back to the extension host via the VS Code
 *   webview message API.
 * @returns Complete HTML document as a string.
 */
export function getErrorPageHtml(message: string, canRetry: boolean): string {
	const messageHtml = message
		.split("\n")
		.map((line) => escapeHtml(line))
		.join("<br>");

	const retryScript = canRetry
		? `<button id="retry-btn">Retry</button>
<script>
const vscode = acquireVsCodeApi();
document.getElementById('retry-btn').addEventListener('click', () => {
    vscode.postMessage({ type: 'retry' });
});
</script>`
		: "";

	return fill(errorHtml, { message: messageHtml, retryScript });
}

/**
 * Full-viewport iframe that loads the session through the proxy.
 * Posts a `{ type: 'ready' }` message when the iframe finishes loading.
 *
 * @param src - The URL to load in the iframe.
 * @returns Complete HTML document as a string.
 */
export function getIframeHtml(src: string): string {
	return fill(iframeHtml, { src: escapeAttr(src) });
}

/**
 * Static loading page served by the proxy server while the upstream
 * OpenCode server is starting.  No dynamic content — the message is
 * hard-coded.
 */
export function getProxyLoadingHtml(): string {
	return loadingHtml.replace("{{message}}", "Loading OpenCode\u2026");
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

/**
 * Escape user-provided text for safe HTML embedding.
 */
function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

/**
 * Escape a string for safe inclusion in an HTML attribute value
 * (double-quoted).
 */
function escapeAttr(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}
