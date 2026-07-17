import { createOpencode } from "@opencode-ai/sdk/v2";
import type { OpencodeClient } from "@opencode-ai/sdk/v2";
import type { ConnectionState, ServerInfo } from "../types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Callback invoked whenever `ConnectionState` changes. */
export type StateChangeListener = (state: ConnectionState) => void;

// ---------------------------------------------------------------------------
// ServerService
// ---------------------------------------------------------------------------

/**
 * Manages the lifecycle of an OpenCode server process via the SDK.
 *
 * The SDK handles process startup, binary resolution, and health checking.
 *
 * ## Usage
 *
 * ```ts
 * const svc = new ServerService();
 * svc.onStateChange = (state) => console.log("State:", state);
 * await svc.start("/path/to/project");
 * const { baseUrl, sdkClient } = svc.getClient();
 * // ... use baseUrl and sdkClient ...
 * await svc.stop();
 * ```
 */
export class ServerService {
	// -----------------------------------------------------------------------
	// Public callback
	// -----------------------------------------------------------------------

	/** Set this to receive state-change notifications. */
	public onStateChange: StateChangeListener | undefined;

	// -----------------------------------------------------------------------
	// Private state
	// -----------------------------------------------------------------------

	private _state: ConnectionState = "disconnected";
	private _serverInfo: ServerInfo | null = null;
	private _opencode: Awaited<ReturnType<typeof createOpencode>> | null = null;
	/** True when `stop()` is in progress — suppresses crash→error transitions. */
	private _stopping = false;

	// -----------------------------------------------------------------------
	// State management
	// -----------------------------------------------------------------------

	/** Current connection state. */
	public get state(): ConnectionState {
		return this._state;
	}

	/**
	 * Transition to a new state.  If the state actually changes, the
	 * {@link onStateChange} callback is fired synchronously.
	 */
	private _setState(newState: ConnectionState): void {
		if (this._state === newState) {
			return;
		}
		this._state = newState;
		this.onStateChange?.(newState);
	}

	// -----------------------------------------------------------------------
	// start
	// -----------------------------------------------------------------------

	/**
	 * Start the OpenCode server for the given project root via the SDK.
	 *
	 * If a server is already running it is stopped first.
	 *
	 * The SDK spawns `opencode serve`, waits for the listening URL, and
	 * configures a typed REST client pointed at that server.
	 *
	 * @param projectRoot Absolute path to the project working directory.
	 * @returns The {@link ServerInfo} for the running server.
	 * @throws If the server fails to start or times out.
	 */
	public async start(projectRoot: string): Promise<ServerInfo> {
		// Stop any existing server
		if (this._opencode) {
			await this.stop();
		}

		this._stopping = false;
		this._setState("connecting");

		// The SDK spawns the server in the current working directory.
		// Switch to the project root so that the server serves the
		// correct directory.
		const originalCwd = process.cwd();
		try {
			process.chdir(projectRoot);
		} catch {
			// If chdir fails, proceed anyway — the server will use the
			// current cwd which is usually already the workspace root.
			console.warn(`[OpenCode] Could not chdir to ${projectRoot}, using current cwd`);
		}

		try {
			const oc = await createOpencode({
				hostname: "127.0.0.1",
				port: 4096,
				timeout: 30_000,
			});
			this._opencode = oc;

			const url = new URL(oc.server.url);
			const serverInfo: ServerInfo = {
				host: url.hostname,
				port: parseInt(url.port, 10),
				baseUrl: oc.server.url.replace(/\/+$/, ""),
			} as ServerInfo;
			this._serverInfo = serverInfo;

			this._setState("connected");
			console.log(`[OpenCode] SDK server started: ${oc.server.url}`);
			return serverInfo;
		} catch (err) {
			this._setState("error");
			throw err;
		} finally {
			// Restore original cwd
			try {
				process.chdir(originalCwd);
			} catch {
				// Best effort
			}
		}
	}

	// -----------------------------------------------------------------------
	// checkHealth
	// -----------------------------------------------------------------------

	/**
	 * Call the server health endpoint via the SDK client.
	 *
	 * @returns `true` if the server reports `healthy: true`, `false` otherwise.
	 */
	public async checkHealth(): Promise<boolean> {
		if (!this._opencode?.client) {
			return false;
		}

		try {
			const result = await this._opencode.client.global.health();
			return result.data?.healthy === true;
		} catch {
			return false;
		}
	}

	// -----------------------------------------------------------------------
	// waitForHealth
	// -----------------------------------------------------------------------

	/**
	 * Poll {@link checkHealth} every 500 ms until the server responds or
	 * `timeoutMs` elapses.
	 *
	 * @param timeoutMs Maximum time to wait in milliseconds.
	 * @returns `true` if the server becomes healthy, `false` on timeout.
	 */
	public async waitForHealth(timeoutMs: number): Promise<boolean> {
		const deadline = Date.now() + timeoutMs;

		while (Date.now() < deadline) {
			const healthy = await this.checkHealth();
			if (healthy) {
				return true;
			}
			await new Promise((resolve) => setTimeout(resolve, 500));
		}

		return false;
	}

	// -----------------------------------------------------------------------
	// stop
	// -----------------------------------------------------------------------

	/**
	 * Close the SDK-managed server and transition to `"disconnected"`.
	 */
	public async stop(): Promise<void> {
		this._stopping = true;

		if (this._opencode) {
			try {
				this._opencode.server.close();
			} catch {
				// Ignore close errors
			}
			this._opencode = null;
		}

		this._serverInfo = null;
		this._stopping = false;
		this._setState("disconnected");
	}

	// -----------------------------------------------------------------------
	// getClient
	// -----------------------------------------------------------------------

	/**
	 * Return the current server's base URL and the SDK client.
	 *
	 * @throws If the server hasn't been started yet.
	 */
	public getClient(): { baseUrl: string; sdkClient: OpencodeClient } {
		if (!this._serverInfo || !this._opencode?.client) {
			throw new Error(
				"Server is not running. Call start() before getClient().",
			);
		}
		return {
			baseUrl: this._serverInfo.baseUrl,
			sdkClient: this._opencode.client,
		};
	}
}
