import type { OpencodeClient } from "@opencode-ai/sdk/v2";
import type {
	SessionInfo,
	SessionSummary,
	SessionTime,
	ShareInfo,
	RevertInfo,
	FileDiff,
	PathInfo,
	ProjectInfo,
	ProjectTimeInfo,
} from "../types";

// ---------------------------------------------------------------------------
// JSON → TS key mapping helpers
//
// The OpenCode server uses PascalCase keys for ID fields:
//   projectID → projectId, parentID → parentId, etc.
//
// The server also uses `initialized` for project timestamps, which we map
// to `updated` in our ProjectTimeInfo type.
//
// The SDK client returns numeric timestamps; the raw fetch returns strings.
// Our interfaces accept both and convert to strings in the mapping layer.
// ---------------------------------------------------------------------------

/** Raw server/SDK shape for a session (PascalCase ID keys). */
interface ServerSession {
	id: string;
	projectID?: string;
	parentID?: string;
	directory?: string;
	title?: string;
	version?: string;
	summary?: ServerSessionSummary;
	share?: ServerShareInfo;
	time?: ServerSessionTime;
	revert?: ServerRevertInfo;
}

interface ServerSessionSummary {
	additions: number;
	deletions: number;
	files: number;
	diffs?: ServerFileDiff[];
}

interface ServerFileDiff {
	file: string;
	additions: number;
	deletions: number;
}

interface ServerShareInfo {
	url?: string;
}

/** SDK returns numbers, raw fetch returns strings — accept both. */
interface ServerSessionTime {
	created?: string | number;
	updated?: string | number;
	compacting?: boolean | number;
}

interface ServerRevertInfo {
	messageID?: string;
	partID?: string;
	snapshot?: string;
	diff?: string;
}

/** Raw server/SDK shape for a project (PascalCase ID keys, `initialized` timestamp). */
interface ServerProject {
	id: string;
	worktree?: string;
	vcsDir?: string;
	vcs?: string;
	time?: ServerProjectTime;
}

/** SDK returns numbers, raw fetch returns strings — accept both. */
interface ServerProjectTime {
	created?: string | number;
	initialized?: string | number;
}

/** Raw server/SDK shape for path info. */
interface ServerPath {
	state?: string;
	config?: string;
	worktree?: string;
	directory?: string;
}

// ---------------------------------------------------------------------------
// Mapping functions
//
// Because the project enables `exactOptionalPropertyTypes`, each return
// value is asserted to its target type — the spread operators with
// `&& { key: val }` ensure optional sub-objects are only included when
// present, while top-level optional fields (`?: string`) use `as` to pass
// the strictness check.  The runtime shapes are correct; this is purely a
// compile-time noise issue at the mapping boundary.
// ---------------------------------------------------------------------------

function toStr(v: string | number | undefined): string | undefined {
	return v != null ? String(v) : undefined;
}

function mapFileDiff(raw: ServerFileDiff): FileDiff {
	return {
		path: raw.file,
		additions: raw.additions,
		deletions: raw.deletions,
	};
}

function mapSessionSummary(raw: ServerSessionSummary): SessionSummary {
	const diffs = raw.diffs?.map(mapFileDiff);
	return {
		additions: raw.additions,
		deletions: raw.deletions,
		files: raw.files,
		...(diffs !== undefined ? { diffs } : {}),
	} as SessionSummary;
}

function mapShareInfo(raw: ServerShareInfo): ShareInfo {
	return { url: raw.url } as ShareInfo;
}

function mapSessionTime(raw: ServerSessionTime): SessionTime {
	return {
		created: toStr(raw.created),
		updated: toStr(raw.updated),
		compacting:
			raw.compacting != null ? Boolean(raw.compacting) : undefined,
	} as SessionTime;
}

function mapRevertInfo(raw: ServerRevertInfo): RevertInfo {
	return {
		messageId: raw.messageID,
		partId: raw.partID,
		snapshot: raw.snapshot,
		diff: raw.diff,
	} as RevertInfo;
}

function mapSession(raw: ServerSession): SessionInfo {
	return {
		id: raw.id,
		projectId: raw.projectID,
		parentId: raw.parentID,
		directory: raw.directory,
		title: raw.title,
		version: raw.version,
		...(raw.summary ? { summary: mapSessionSummary(raw.summary) } : {}),
		...(raw.share ? { share: mapShareInfo(raw.share) } : {}),
		...(raw.time ? { time: mapSessionTime(raw.time) } : {}),
		...(raw.revert ? { revert: mapRevertInfo(raw.revert) } : {}),
	} as SessionInfo;
}

function mapProjectTime(raw: ServerProjectTime): ProjectTimeInfo {
	return {
		created: toStr(raw.created),
		updated: toStr(raw.initialized),
	} as ProjectTimeInfo;
}

function mapProject(raw: ServerProject): ProjectInfo {
	return {
		id: raw.id,
		worktree: raw.worktree,
		vcsDir: raw.vcsDir,
		vcs: raw.vcs,
		...(raw.time ? { time: mapProjectTime(raw.time) } : {}),
	} as ProjectInfo;
}

function mapPath(raw: ServerPath): PathInfo {
	return {
		state: raw.state,
		config: raw.config,
		worktree: raw.worktree,
		directory: raw.directory,
	} as PathInfo;
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

/** An error thrown when the HTTP response is an error status. */
export class SessionServiceError extends Error {
	public readonly status: number;
	constructor(
		message: string,
		status: number,
	) {
		super(message);
		this.name = "SessionServiceError";
		this.status = status;
	}
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract a human-readable message from an SDK error payload. */
function extractSdkError(err: unknown, fallback: string): string {
	if (typeof err === "object" && err !== null) {
		const e = err as Record<string, unknown>;
		if (typeof e.message === "string") return e.message;
		if (
			typeof e.data === "object" &&
			e.data !== null &&
			typeof (e.data as Record<string, unknown>).message === "string"
		) {
			return (e.data as Record<string, string>).message;
		}
	}
	return fallback;
}

// ---------------------------------------------------------------------------
// SessionService
// ---------------------------------------------------------------------------

/**
 * Typed REST client for the OpenCode HTTP API.
 *
 * Prefers the SDK client when available (properly typed requests with
 * error handling), and falls back to raw {@link fetch} otherwise.
 */
export class SessionService {
	private readonly baseUrl: string;
	private readonly _sdkClient: OpencodeClient | null;

	/**
	 * @param baseUrl — full base URL of the OpenCode server,
	 *   e.g. `http://localhost:4096`.
	 * @param sdkClient — optional SDK client. When provided, all methods
	 *   use the typed SDK instead of raw fetch.
	 */
	constructor(baseUrl: string, sdkClient?: OpencodeClient) {
		this.baseUrl = baseUrl.replace(/\/+$/, "");
		this._sdkClient = sdkClient ?? null;
	}

	// -----------------------------------------------------------------------
	// Sessions
	// -----------------------------------------------------------------------

	/**
	 * List all sessions for a given directory.
	 *
	 * Calls `GET /session?directory={dir}`.
	 */
	async listSessions(directory: string): Promise<SessionInfo[]> {
		if (this._sdkClient) {
			const result = await this._sdkClient.session.list({
				query: { directory },
			});
			if (result.error) {
				throw new SessionServiceError(
					extractSdkError(result.error, "listSessions failed"),
					result.response.status,
				);
			}
			return (result.data ?? []).map(mapSession);
		}

		const url = `${this.baseUrl}/session?directory=${encodeURIComponent(directory)}`;
		const response = await fetch(url);
		await this.assertOk(response, "listSessions");
		const data: ServerSession[] = await response.json();
		return data.map(mapSession);
	}

	/**
	 * Create a new session in the given directory.
	 *
	 * Calls `POST /session?directory={dir}` with a JSON body
	 * `{ title }`.
	 */
	async createSession(
		directory: string,
		title = "VS Code OpenCode",
	): Promise<SessionInfo> {
		if (this._sdkClient) {
			const result = await this._sdkClient.session.create({
				query: { directory },
				body: { title },
			});
			if (result.error) {
				throw new SessionServiceError(
					extractSdkError(result.error, "createSession failed"),
					result.response.status,
				);
			}
			return mapSession(result.data!);
		}

		const url = `${this.baseUrl}/session?directory=${encodeURIComponent(directory)}`;
		const response = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ title }),
		});
		await this.assertOk(response, "createSession");
		const data: ServerSession = await response.json();
		return mapSession(data);
	}

	// -----------------------------------------------------------------------
	// Paths
	// -----------------------------------------------------------------------

	/**
	 * Get path information for a specific directory.
	 *
	 * Calls `GET /path?directory={dir}`.
	 */
	async getPath(directory: string): Promise<PathInfo> {
		if (this._sdkClient) {
			const result = await this._sdkClient.path.get({
				query: { directory },
			});
			if (result.error) {
				throw new SessionServiceError(
					extractSdkError(result.error, "getPath failed"),
					result.response.status,
				);
			}
			return mapPath(result.data!);
		}

		const url = `${this.baseUrl}/path?directory=${encodeURIComponent(directory)}`;
		const response = await fetch(url);
		await this.assertOk(response, "getPath");
		const data: ServerPath = await response.json();
		return mapPath(data);
	}

	/**
	 * Get the server's own path information (no directory filter).
	 *
	 * Calls `GET /path`.
	 */
	async getServerPath(): Promise<PathInfo> {
		if (this._sdkClient) {
			const result = await this._sdkClient.path.get();
			if (result.error) {
				throw new SessionServiceError(
					extractSdkError(result.error, "getServerPath failed"),
					result.response.status,
				);
			}
			return mapPath(result.data!);
		}

		const url = `${this.baseUrl}/path`;
		const response = await fetch(url);
		await this.assertOk(response, "getServerPath");
		const data: ServerPath = await response.json();
		return mapPath(data);
	}

	// -----------------------------------------------------------------------
	// Projects
	// -----------------------------------------------------------------------

	/**
	 * List all known projects for a given directory.
	 *
	 * Calls `GET /project?directory={dir}`.
	 */
	async listProjects(directory: string): Promise<ProjectInfo[]> {
		if (this._sdkClient) {
			const result = await this._sdkClient.project.list({
				query: { directory },
			});
			if (result.error) {
				throw new SessionServiceError(
					extractSdkError(result.error, "listProjects failed"),
					result.response.status,
				);
			}
			return (result.data ?? []).map(mapProject);
		}

		const url = `${this.baseUrl}/project?directory=${encodeURIComponent(directory)}`;
		const response = await fetch(url);
		await this.assertOk(response, "listProjects");
		const data: ServerProject[] = await response.json();
		return data.map(mapProject);
	}

	/**
	 * Get the current project info for a given directory.
	 *
	 * Calls `GET /project/current?directory={dir}`.
	 */
	async getCurrentProject(directory: string): Promise<ProjectInfo> {
		if (this._sdkClient) {
			const result = await this._sdkClient.project.current({
				query: { directory },
			});
			if (result.error) {
				throw new SessionServiceError(
					extractSdkError(result.error, "getCurrentProject failed"),
					result.response.status,
				);
			}
			return mapProject(result.data!);
		}

		const url = `${this.baseUrl}/project/current?directory=${encodeURIComponent(directory)}`;
		const response = await fetch(url);
		await this.assertOk(response, "getCurrentProject");
		const data: ServerProject = await response.json();
		return mapProject(data);
	}

	// -----------------------------------------------------------------------
	// Internal helpers
	// -----------------------------------------------------------------------

	private async assertOk(
		response: Response,
		method: string,
	): Promise<void> {
		if (!response.ok) {
			let body = "";
			try {
				body = await response.text();
			} catch {
				// ignore — body may be unreadable
			}
			throw new SessionServiceError(
				`${method} failed with ${response.status}: ${body}`,
				response.status,
			);
		}
	}
}
