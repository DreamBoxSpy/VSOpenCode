import * as vscode from "vscode";
import { DisposableStore } from "./utils/DisposableStore";
import { Logger } from "./utils/Logger";
import { getServerController } from "./services/ServerController";
import type { ServerController } from "./services/ServerController";
import { ProxyServer } from "./services/ProxyServer";
import { ProjectRootResolver } from "./services/ProjectRootResolver";
import { ToolWebviewProvider } from "./views/ToolWebviewProvider";
import { setupThemeSync } from "./theme";
import { registerCommands } from "./commands/registerCommands";

// ---------------------------------------------------------------------------
// ExtensionController
// ---------------------------------------------------------------------------

/**
 * Owns the extension's entire lifecycle.
 *
 * Pattern mirrors `VSOpenCodePackage` in the VS extension (`vs/`):
 * a single orchestrator that wires up services, registers commands
 * and providers, and tears everything down on `deactivate()`.
 */
export class ExtensionController {
	private readonly context: vscode.ExtensionContext;
	private readonly disposables = new DisposableStore();

	private logger!: Logger;
	private provider!: ToolWebviewProvider;
	private proxyServer: ProxyServer | null = null;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
	}

	// -----------------------------------------------------------------------
	// activate
	// -----------------------------------------------------------------------

	/** Wire everything up. Called once by `extension.activate()`. */
	activate(): void {
		// 1. Create Logger — every service logs through it
		this.logger = new Logger();
		this.disposables.add(this.logger);
		this.logger.info("OpenCode extension activating\u2026");

		// 2. Register commands (focus sidebar, refresh, etc.)
		registerCommands(this.context, () => {
			void this._startServerFlow(serverController, projectRoot);
		});

		// 3. Get ServerController singleton
		const serverController = getServerController();

		// 4. Create ProjectRootResolver, resolve project root
		const rootResolver = new ProjectRootResolver();
		let projectRoot = rootResolver.resolve();

		// 5–7. Create ToolWebviewProvider (proxy URL resolved lazily so
		//      the provider can be constructed before the proxy is ready).
		this.provider = new ToolWebviewProvider(
			() => this.proxyServer?.getProxyUrl() ?? "http://127.0.0.1:0",
		);

		// 8. Register WebviewViewProvider for the sidebar tool window
		this.disposables.add(
			vscode.window.registerWebviewViewProvider(
				"vscode-opencode.toolView",
				this.provider,
			),
		);

		// 9. Set up theme sync — posts theme changes into the webview
		setupThemeSync(this.context, (data) => this.provider.postMessage(data));

		// 10. Subscribe to serverController events
		serverController.onConnectionLost = () => {
			this.provider.showError(
				"Connection to OpenCode server lost.",
				true,
			);
		};

		serverController.onConnectionRestored = () => {
			try {
				const sessionPath = new URL(
					serverController.getSessionUrl(),
				).pathname;
				this.provider.navigateToSession(sessionPath);
			} catch {
				// Server not started yet — ignore
			}
		};

		serverController.onWorkspaceMismatch = () => {
			this.logger.info(
				"Workspace mismatch detected, re-resolving project root\u2026",
			);
			projectRoot = rootResolver.resolve();
			serverController.updateProjectRoot(projectRoot);
			void this._startServerFlow(serverController, projectRoot);
		};

		// Retry handler: user clicked the retry button on the error page
		this.provider.onDidRequestRetry(() => {
			this.logger.info("Retry requested by user");
			void this._startServerFlow(serverController, projectRoot);
		});

		// 11. Subscribe workspace folder changes → re-resolve project root
		this.disposables.add(
			vscode.workspace.onDidChangeWorkspaceFolders((event) => {
				this.logger.info(
					`Workspace folders changed: added=${event.added.length}, removed=${event.removed.length}`,
				);
				projectRoot = rootResolver.resolve();
				serverController.updateProjectRoot(projectRoot);
			}),
		);

		// 12. Push the DisposableStore to context.subscriptions
		//     VS Code will call dispose() on deactivation.
		this.context.subscriptions.push(this.disposables);

		// Kick off server startup (fire-and-forget — webview shows loading spinner)
		void this._startServerFlow(serverController, projectRoot);

		this.logger.info("OpenCode extension activated.");
	}

	// -----------------------------------------------------------------------
	// deactivate
	// -----------------------------------------------------------------------

	/**
	 * Tear everything down.
	 *
	 * Returns a `Promise<void>` so VS Code can await it (5-second
	 * grace period). The DisposableStore is pushed to
	 * `context.subscriptions` which VS Code also disposes, but we
	 * explicitly dispose here for deterministic ordering.
	 */
	async deactivate(): Promise<void> {
		this.logger.info("OpenCode extension deactivating\u2026");

		const serverController = getServerController();
		await serverController.stop();

		if (this.proxyServer) {
			await this.proxyServer.stop();
		}

		this.provider.dispose();

		this.logger.info("OpenCode extension deactivated.");
	}

	// -----------------------------------------------------------------------
	// Private helpers
	// -----------------------------------------------------------------------

	/**
	 * Start (or restart) the full server → proxy → webview pipeline.
	 *
	 * 1. Start the OpenCode server via {@link ServerController.start},
	 *    which also handles session lookup/creation and starts the
	 *    {@link ConnectionMonitor}.
	 * 2. Create a {@link ProxyServer} pointed at the server's base URL
	 *    and bind it to a local port.
	 * 3. Navigate the webview to the session via the proxy.
	 *
	 * On failure the webview displays an error page with a retry button.
	 */
	private async _startServerFlow(
		serverController: ServerController,
		projectRoot: string,
	): Promise<void> {
		try {
			const result = await serverController.start(projectRoot);
			const sessionUrl = result.sessionUrl;

			// Extract the upstream base URL (origin) from the session URL
			const baseUrl = new URL(sessionUrl).origin;
			console.log(`[OpenCode] Proxy target: ${baseUrl}`);

			// Stop existing proxy if any (server may have moved ports)
			if (this.proxyServer) {
				await this.proxyServer.stop();
			}

			// Start proxy with the upstream server URL
			this.proxyServer = new ProxyServer(baseUrl);
			await this.proxyServer.start();
			console.log(
				`[OpenCode] Proxy started on port: ${new URL(this.proxyServer.getProxyUrl()).port}`,
			);

			// Navigate webview to the session (e.g. /session/abc123)
			const sessionPath = new URL(sessionUrl).pathname;
			this.provider.navigateToSession(sessionPath);
		} catch (err) {
			const message =
				err instanceof Error ? err.message : String(err);
			this.logger.error(`Failed to start server: ${message}`);
			this.provider.showError(
				`Failed to start OpenCode: ${message}`,
				true,
			);
		}
	}
}
