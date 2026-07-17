import { describe, it, after } from 'node:test';
import assert from 'node:assert/strict';
import * as http from 'node:http';
import { ProxyServer } from '../../services/ProxyServer.ts';

describe('ProxyServer', () => {
	// --- Private helper: _djb2 ---
	describe('_djb2', () => {
		it('is deterministic — same input → same output', () => {
			const p = new ProxyServer('http://localhost:4096');
			const h1 = (p as any)._djb2('hello');
			const h2 = (p as any)._djb2('hello');
			assert.strictEqual(h1, h2);
		});

		it('different inputs → different outputs', () => {
			const p = new ProxyServer('http://localhost:4096');
			const h1 = (p as any)._djb2('hello');
			const h2 = (p as any)._djb2('world');
			assert.notStrictEqual(h1, h2);
		});

		it('returns unsigned 32-bit integer', () => {
			const p = new ProxyServer('http://localhost:4096');
			const h = (p as any)._djb2('test');
			assert.ok(typeof h === 'number');
			assert.ok(h >= 0);
			assert.ok(h <= 0xFFFFFFFF);
		});

		it('known value: empty string', () => {
			const p = new ProxyServer('http://localhost:4096');
			assert.strictEqual((p as any)._djb2(''), 5381);
		});
	});

	// --- Private helper: _injectScriptTag ---
	describe('_injectScriptTag', () => {
		it('injects before </head> when present', () => {
			const p = new ProxyServer('http://localhost:4096');
			const html = '<html><head></head><body></body></html>';
			const result = (p as any)._injectScriptTag(html);
			assert.ok(result.includes('<script src="/inject.js"></script>\n</head>'));
			assert.ok(result.startsWith('<html><head>'));
		});

		it('injects before </body> when no </head>', () => {
			const p = new ProxyServer('http://localhost:4096');
			const html = '<html><body></body></html>';
			const result = (p as any)._injectScriptTag(html);
			assert.ok(result.includes('<script src="/inject.js"></script>\n</body>'));
		});

		it('appends when neither </head> nor </body> present', () => {
			const p = new ProxyServer('http://localhost:4096');
			const html = '<div>content</div>';
			const result = (p as any)._injectScriptTag(html);
			assert.ok(result.endsWith('<script src="/inject.js"></script>'));
		});
	});

	// --- Private helper: _firstHeader ---
	describe('_firstHeader', () => {
		it('returns string value', () => {
			const p = new ProxyServer('http://localhost:4096');
			const result = (p as any)._firstHeader({ 'content-type': 'text/html' }, 'content-type');
			assert.strictEqual(result, 'text/html');
		});

		it('returns first element for string array', () => {
			const p = new ProxyServer('http://localhost:4096');
			const result = (p as any)._firstHeader({ 'set-cookie': ['a=1', 'b=2'] }, 'set-cookie');
			assert.strictEqual(result, 'a=1');
		});

		it('returns undefined for missing header', () => {
			const p = new ProxyServer('http://localhost:4096');
			const result = (p as any)._firstHeader({}, 'content-type');
			assert.strictEqual(result, undefined);
		});

		it('is case-insensitive for the header name parameter', () => {
			const p = new ProxyServer('http://localhost:4096');
			// Node's IncomingHttpHeaders always lowercases keys; test that the
			// name parameter is lowercased before lookup.
			const result = (p as any)._firstHeader({ 'content-type': 'text/html' }, 'Content-Type');
			assert.strictEqual(result, 'text/html');
		});
	});

	// --- Server lifecycle ---
	describe('lifecycle', () => {
		let proxy: ProxyServer;

		after(async () => {
			if (proxy) await proxy.stop().catch(() => {});
		});

		it('start() returns a port number', async () => {
			proxy = new ProxyServer('http://localhost:4096');
			const port = await proxy.start();
			assert.ok(port > 0);
			assert.ok(port < 65536);
		});

		it('getProxyUrl() returns correct URL', async () => {
			proxy = new ProxyServer('http://localhost:4096');
			const port = await proxy.start();
			const url = proxy.getProxyUrl();
			assert.strictEqual(url, `http://127.0.0.1:${port}`);
		});

		it('GET / returns loading page with "OpenCode"', async () => {
			proxy = new ProxyServer('http://localhost:4096');
			const port = await proxy.start();
			const response = await fetch(`http://127.0.0.1:${port}/`);
			const body = await response.text();
			assert.ok(body.includes('OpenCode'), 'loading page should mention OpenCode');
		});

		it('GET /inject.js returns JavaScript', async () => {
			proxy = new ProxyServer('http://localhost:4096');
			const port = await proxy.start();
			const response = await fetch(`http://127.0.0.1:${port}/inject.js`);
			const ct = response.headers.get('content-type');
			assert.ok(ct!.includes('javascript'));
			const body = await response.text();
			assert.ok(body.length > 50, 'inject script should not be empty');
		});

		it('stop() shuts down the server', async () => {
			proxy = new ProxyServer('http://localhost:4096');
			const port = await proxy.start();
			await proxy.stop();
			// After stop, attempting to connect should fail
			try {
				await fetch(`http://127.0.0.1:${port}/`, { signal: AbortSignal.timeout(500) });
				assert.fail('should not be reachable after stop');
			} catch {
				// Expected — connection refused
			}
		});
	});

	// --- Proxy forwarding to echo server ---
	describe('proxy forwarding', () => {
		let echoServer: http.Server;
		let echoPort: number;
		let proxy: ProxyServer;

		after(async () => {
			if (proxy) await proxy.stop().catch(() => {});
			if (echoServer) await new Promise(r => echoServer.close(r));
		});

		it('forwards GET requests to upstream', async () => {
			// Start echo server
			echoServer = http.createServer((req, res) => {
				res.writeHead(200, { 'Content-Type': 'text/plain' });
				res.end(`echo: ${req.url}`);
			});
			await new Promise<void>((resolve) => echoServer.listen(0, '127.0.0.1', resolve));
			echoPort = (echoServer.address() as any).port;

			// Start proxy pointing at echo server
			proxy = new ProxyServer(`http://127.0.0.1:${echoPort}`);
			const proxyPort = await proxy.start();

			// Make request through proxy
			const response = await fetch(`http://127.0.0.1:${proxyPort}/test/path`);
			const body = await response.text();
			assert.strictEqual(body, 'echo: /test/path');
		});
	});
});
