import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { SessionService, SessionServiceError } from '../../services/SessionService.ts';
import type { SessionInfo } from '../../types.ts';

describe('SessionService', () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  /**
   * Create a fetch mock that returns `responseData` as JSON with the given
   * `status`. The returned function satisfies `typeof globalThis.fetch` but
   * strips the complex overloads via `as` — safe because the mock returns
   * a minimal Response-shaped object.
   */
  function mockFetch(
    responseData: unknown,
    status = 200,
  ): typeof globalThis.fetch {
    return (async (input: RequestInfo | URL, _init?: RequestInit) => {
      const url =
        typeof input === 'string'
          ? input
          : input instanceof URL
            ? input.href
            : input.url;
      return {
        ok: status >= 200 && status < 300,
        status,
        url,
        json: async () => responseData,
        text: async () => JSON.stringify(responseData),
        headers: new Headers(),
        redirected: false,
        type: 'basic' as const,
      } as Response;
    }) as typeof globalThis.fetch;
  }

  // -----------------------------------------------------------------------
  // JSON key mapping: the server uses PascalCase; SessionService maps to
  // the camelCase SessionInfo shape in src/types.ts.
  // -----------------------------------------------------------------------
  describe('JSON key mapping', () => {
    it('maps projectID → projectId', async () => {
      const svc = new SessionService('http://localhost:4096');
      globalThis.fetch = mockFetch([{ id: 's1', projectID: 'p1' }]);
      const sessions = await svc.listSessions('/some/dir');
      assert.strictEqual(sessions[0]!.projectId, 'p1');
      assert.strictEqual(
        (sessions[0] as Record<string, unknown>).projectID,
        undefined,
      );
    });

    it('maps parentID → parentId', async () => {
      const svc = new SessionService('http://localhost:4096');
      globalThis.fetch = mockFetch([{ id: 's1', parentID: 'parent1' }]);
      const sessions = await svc.listSessions('/some/dir');
      assert.strictEqual(sessions[0]!.parentId, 'parent1');
    });

    it('maps diffs[].file → diffs[].path', async () => {
      const svc = new SessionService('http://localhost:4096');
      globalThis.fetch = mockFetch([
        {
          id: 's1',
          summary: {
            additions: 5,
            deletions: 2,
            files: 1,
            diffs: [{ file: 'src/a.ts', additions: 5, deletions: 2 }],
          },
        },
      ]);
      const sessions = await svc.listSessions('/some/dir');
      assert.strictEqual(sessions[0]!.summary?.diffs?.[0]?.path, 'src/a.ts');
      assert.strictEqual(sessions[0]!.summary?.diffs?.[0]?.additions, 5);
      assert.strictEqual(sessions[0]!.summary?.diffs?.[0]?.deletions, 2);
    });

    it('maps revert.messageID → revert.messageId', async () => {
      const svc = new SessionService('http://localhost:4096');
      globalThis.fetch = mockFetch([
        {
          id: 's1',
          revert: { messageID: 'msg1', partID: 'part1' },
        },
      ]);
      const sessions = await svc.listSessions('/some/dir');
      assert.strictEqual(sessions[0]!.revert?.messageId, 'msg1');
      assert.strictEqual(sessions[0]!.revert?.partId, 'part1');
    });

    it('maps revert.snapshot and revert.diff pass through unchanged', async () => {
      const svc = new SessionService('http://localhost:4096');
      globalThis.fetch = mockFetch([
        {
          id: 's1',
          revert: {
            messageID: 'm1',
            partID: 'p1',
            snapshot: 'snap content',
            diff: 'diff content',
          },
        },
      ]);
      const sessions = await svc.listSessions('/some/dir');
      assert.strictEqual(sessions[0]!.revert?.snapshot, 'snap content');
      assert.strictEqual(sessions[0]!.revert?.diff, 'diff content');
    });
  });

  // -----------------------------------------------------------------------
  // createSession
  // -----------------------------------------------------------------------
  describe('createSession', () => {
    it('sends POST request', async () => {
      let capturedMethod: string | undefined;
      globalThis.fetch = (async (
        _input: RequestInfo | URL,
        init?: RequestInit,
      ) => {
        capturedMethod = init?.method;
        return {
          ok: true,
          status: 200,
          json: async () => ({ id: 'new-session' }),
        } as Response;
      }) as typeof globalThis.fetch;

      const svc = new SessionService('http://localhost:4096');
      await svc.createSession('/some/dir', 'My Session');
      assert.strictEqual(capturedMethod, 'POST');
    });

    it('sends Content-Type: application/json header', async () => {
      let capturedHeaders: HeadersInit | undefined;
      globalThis.fetch = (async (
        _input: RequestInfo | URL,
        init?: RequestInit,
      ) => {
        capturedHeaders = init?.headers;
        return {
          ok: true,
          status: 200,
          json: async () => ({ id: 'new-session' }),
        } as Response;
      }) as typeof globalThis.fetch;

      const svc = new SessionService('http://localhost:4096');
      await svc.createSession('/some/dir', 'My Session');
      const headers = new Headers(capturedHeaders);
      assert.strictEqual(headers.get('Content-Type'), 'application/json');
    });

    it('sends title in body', async () => {
      let capturedBody: string | undefined;
      globalThis.fetch = (async (
        _input: RequestInfo | URL,
        init?: RequestInit,
      ) => {
        capturedBody = init?.body as string;
        return {
          ok: true,
          status: 200,
          json: async () => ({ id: 'new-session' }),
        } as Response;
      }) as typeof globalThis.fetch;

      const svc = new SessionService('http://localhost:4096');
      await svc.createSession('/some/dir', 'My Session');
      const parsed = JSON.parse(capturedBody ?? '{}');
      assert.strictEqual(parsed.title, 'My Session');
    });

    it('uses default title when not provided', async () => {
      let capturedBody: string | undefined;
      globalThis.fetch = (async (
        _input: RequestInfo | URL,
        init?: RequestInit,
      ) => {
        capturedBody = init?.body as string;
        return {
          ok: true,
          status: 200,
          json: async () => ({ id: 's1' }),
        } as Response;
      }) as typeof globalThis.fetch;

      const svc = new SessionService('http://localhost:4096');
      await svc.createSession('/some/dir');
      assert.ok(capturedBody!.includes('VS Code OpenCode'));
    });

    it('returns the mapped SessionInfo', async () => {
      globalThis.fetch = mockFetch({
        id: 's1',
        projectID: 'proj1',
        title: 'My Title',
      });
      const svc = new SessionService('http://localhost:4096');
      const session = await svc.createSession('/dir', 'My Title');
      assert.strictEqual(session.id, 's1');
      assert.strictEqual(session.projectId, 'proj1');
      assert.strictEqual(session.title, 'My Title');
    });

    it('url-encodes the directory param', async () => {
      let capturedUrl = '';
      globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
        capturedUrl = typeof input === 'string' ? input : input.toString();
        return {
          ok: true,
          status: 200,
          json: async () => ({ id: 's1' }),
        } as Response;
      }) as typeof globalThis.fetch;

      const svc = new SessionService('http://localhost:4096');
      await svc.createSession('/path with spaces');
      assert.ok(capturedUrl.includes('path%20with%20spaces'));
      // Method and body should still be set
      assert.ok(capturedUrl.startsWith('http://localhost:4096/session?directory='));
    });
  });

  // -----------------------------------------------------------------------
  // Error handling
  // -----------------------------------------------------------------------
  describe('error handling', () => {
    it('throws SessionServiceError on non-2xx', async () => {
      globalThis.fetch = mockFetch({ error: 'not found' }, 404);
      const svc = new SessionService('http://localhost:4096');
      await assert.rejects(
        () => svc.listSessions('/dir'),
        (err: unknown) => {
          assert.ok(err instanceof SessionServiceError);
          assert.strictEqual((err as SessionServiceError).status, 404);
          return true;
        },
      );
    });

    it('includes status code in error message', async () => {
      globalThis.fetch = mockFetch({ detail: 'gone' }, 500);
      const svc = new SessionService('http://localhost:4096');
      await assert.rejects(
        () => svc.listSessions('/dir'),
        (err: unknown) => {
          assert.ok((err as Error).message.includes('500'));
          return true;
        },
      );
    });

    it('includes method name in error message', async () => {
      globalThis.fetch = mockFetch({}, 400);
      const svc = new SessionService('http://localhost:4096');
      await assert.rejects(
        () => svc.listSessions('/dir'),
        (err: unknown) => {
          assert.ok((err as Error).message.includes('listSessions'));
          return true;
        },
      );
    });

    it('has error name set to SessionServiceError', async () => {
      globalThis.fetch = mockFetch({}, 403);
      const svc = new SessionService('http://localhost:4096');
      await assert.rejects(
        () => svc.listSessions('/dir'),
        (err: unknown) => {
          assert.strictEqual((err as Error).name, 'SessionServiceError');
          return true;
        },
      );
    });

    it('handles unreadable response body gracefully', async () => {
      // When response.text() throws, assertOk catches and uses empty string
      globalThis.fetch = (async () => {
        return {
          ok: false,
          status: 503,
          text: async () => {
            throw new Error('body unreadable');
          },
        } as unknown as Response;
      }) as typeof globalThis.fetch;

      const svc = new SessionService('http://localhost:4096');
      await assert.rejects(
        () => svc.listSessions('/dir'),
        (err: unknown) => {
          assert.ok(err instanceof SessionServiceError);
          // Message should contain 503 but empty body
          assert.ok((err as Error).message.includes('503'));
          return true;
        },
      );
    });
  });

  // -----------------------------------------------------------------------
  // URL encoding
  // -----------------------------------------------------------------------
  describe('URL encoding', () => {
    it('encodes directory param with spaces', async () => {
      let capturedUrl = '';
      globalThis.fetch = (async (input: RequestInfo | URL) => {
        capturedUrl = typeof input === 'string' ? input : input.toString();
        return {
          ok: true,
          status: 200,
          json: async () => [],
        } as Response;
      }) as typeof globalThis.fetch;

      const svc = new SessionService('http://localhost:4096');
      await svc.listSessions('/path with spaces');
      assert.ok(capturedUrl.includes('path%20with%20spaces'));
    });

    it('encodes special characters in directory', async () => {
      let capturedUrl = '';
      globalThis.fetch = (async (input: RequestInfo | URL) => {
        capturedUrl = typeof input === 'string' ? input : input.toString();
        return {
          ok: true,
          status: 200,
          json: async () => [],
        } as Response;
      }) as typeof globalThis.fetch;

      const svc = new SessionService('http://localhost:4096');
      // & and = are meaningful in query strings and must be encoded
      await svc.listSessions('/path&special=value');
      assert.ok(capturedUrl.includes('path%26special%3Dvalue'));
    });

    it('encodes directory with Unicode characters', async () => {
      let capturedUrl = '';
      globalThis.fetch = (async (input: RequestInfo | URL) => {
        capturedUrl = typeof input === 'string' ? input : input.toString();
        return {
          ok: true,
          status: 200,
          json: async () => [],
        } as Response;
      }) as typeof globalThis.fetch;

      const svc = new SessionService('http://localhost:4096');
      await svc.listSessions('/中文目录');
      // Percent-encoded UTF-8
      assert.ok(capturedUrl.includes('%E4%B8%AD%E6%96%87%E7%9B%AE%E5%BD%95'));
    });
  });

  // -----------------------------------------------------------------------
  // baseUrl — trailing slash handling
  // -----------------------------------------------------------------------
  describe('baseUrl', () => {
    it('strips single trailing slash from baseUrl', async () => {
      let capturedUrl = '';
      globalThis.fetch = (async (input: RequestInfo | URL) => {
        capturedUrl = typeof input === 'string' ? input : input.toString();
        return {
          ok: true,
          status: 200,
          json: async () => [],
        } as Response;
      }) as typeof globalThis.fetch;

      const svc = new SessionService('http://localhost:4096/');
      await svc.listSessions('/dir');
      assert.ok(!capturedUrl.includes('4096//'), 'should not contain double slash');
      assert.ok(
        capturedUrl.startsWith('http://localhost:4096/session'),
        `expected http://localhost:4096/session…, got ${capturedUrl}`,
      );
    });

    it('strips multiple trailing slashes', async () => {
      let capturedUrl = '';
      globalThis.fetch = (async (input: RequestInfo | URL) => {
        capturedUrl = typeof input === 'string' ? input : input.toString();
        return {
          ok: true,
          status: 200,
          json: async () => [],
        } as Response;
      }) as typeof globalThis.fetch;

      const svc = new SessionService('http://localhost:4096///');
      await svc.listSessions('/dir');
      assert.ok(
        capturedUrl.startsWith('http://localhost:4096/session'),
        `expected http://localhost:4096/session…, got ${capturedUrl}`,
      );
    });

    it('no trailing slash produces correct URL', async () => {
      let capturedUrl = '';
      globalThis.fetch = (async (input: RequestInfo | URL) => {
        capturedUrl = typeof input === 'string' ? input : input.toString();
        return {
          ok: true,
          status: 200,
          json: async () => [],
        } as Response;
      }) as typeof globalThis.fetch;

      const svc = new SessionService('http://localhost:4096');
      await svc.listSessions('/dir');
      assert.ok(
        capturedUrl ===
          'http://localhost:4096/session?directory=%2Fdir',
        `got ${capturedUrl}`,
      );
    });
  });

  // -----------------------------------------------------------------------
  // Integration-style: combined mapping across a full session shape
  // -----------------------------------------------------------------------
  describe('full session shape', () => {
    it('maps a complete session with all optional fields', async () => {
      const svc = new SessionService('http://localhost:4096');
      globalThis.fetch = mockFetch([
        {
          id: 's-full',
          projectID: 'proj-full',
          parentID: 'parent-full',
          directory: '/home/user/project',
          title: 'Full Session',
          version: '1.2.3',
          summary: {
            additions: 100,
            deletions: 50,
            files: 10,
            diffs: [
              { file: 'src/a.ts', additions: 60, deletions: 30 },
              { file: 'src/b.ts', additions: 40, deletions: 20 },
            ],
          },
          share: { url: 'https://share.example.com/s-full' },
          time: {
            created: '2026-01-01T00:00:00Z',
            updated: '2026-07-17T12:00:00Z',
            compacting: false,
          },
          revert: {
            messageID: 'rev-msg',
            partID: 'rev-part',
            snapshot: 'before snap',
            diff: 'revert diff',
          },
        },
      ]);

      const [s] = await svc.listSessions('/home/user/project');
      assert.ok(s);
      assert.strictEqual(s.id, 's-full');
      assert.strictEqual(s.projectId, 'proj-full');
      assert.strictEqual(s.parentId, 'parent-full');
      assert.strictEqual(s.directory, '/home/user/project');
      assert.strictEqual(s.title, 'Full Session');
      assert.strictEqual(s.version, '1.2.3');
      assert.strictEqual(s.summary?.additions, 100);
      assert.strictEqual(s.summary?.deletions, 50);
      assert.strictEqual(s.summary?.files, 10);
      assert.strictEqual(s.summary?.diffs?.length, 2);
      assert.strictEqual(s.summary?.diffs?.[0]?.path, 'src/a.ts');
      assert.strictEqual(s.summary?.diffs?.[1]?.path, 'src/b.ts');
      assert.strictEqual(s.share?.url, 'https://share.example.com/s-full');
      assert.strictEqual(s.time?.created, '2026-01-01T00:00:00Z');
      assert.strictEqual(s.time?.updated, '2026-07-17T12:00:00Z');
      assert.strictEqual(s.time?.compacting, false);
      assert.strictEqual(s.revert?.messageId, 'rev-msg');
      assert.strictEqual(s.revert?.partId, 'rev-part');
      assert.strictEqual(s.revert?.snapshot, 'before snap');
      assert.strictEqual(s.revert?.diff, 'revert diff');
    });
  });
});
