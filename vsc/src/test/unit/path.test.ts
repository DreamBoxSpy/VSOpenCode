import { describe, it, after } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { normalizePath, findGitRoot } from '../../utils/path.ts';

// ── normalizePath ─────────────────────────────────────────────

describe('normalizePath', () => {
	it('resolves a relative path to an absolute path with forward slashes', () => {
		const result = normalizePath('.');
		assert.ok(path.isAbsolute(result), `expected absolute path, got: ${result}`);
		assert.ok(
			!result.includes('\\'),
			`expected no backslashes, got: ${result}`,
		);
	});

	it('replaces backslashes with forward slashes', () => {
		const result = normalizePath('foo\\bar\\baz');
		const expected = path.resolve('foo/bar/baz').replace(/\\/g, '/');
		assert.strictEqual(result, expected);
	});

	it('returns the same result for an already-normalized absolute path', () => {
		const cwd = normalizePath('.');
		const result = normalizePath(cwd);
		assert.strictEqual(result, cwd);
	});
});

// ── findGitRoot ───────────────────────────────────────────────

describe('findGitRoot', () => {
	let activeTempDir: string | null = null;

	after(() => {
		if (activeTempDir) {
			fs.rmSync(activeTempDir, { recursive: true, force: true });
		}
	});

	/**
	 * Create a fresh temporary directory, cleaning up the previous one
	 * if it still exists.  Only one temp dir is alive at a time so the
	 * `after` hook always knows what to remove.
	 */
	function freshTempDir(): string {
		if (activeTempDir) {
			fs.rmSync(activeTempDir, { recursive: true, force: true });
		}
		activeTempDir = fs.mkdtempSync(
			path.join(os.tmpdir(), 'vsc-opencode-test-'),
		);
		return activeTempDir;
	}

	it('finds the .git directory in an ancestor directory', () => {
		const root = freshTempDir();
		fs.mkdirSync(path.join(root, '.git'));
		const nested = path.join(root, 'a', 'b', 'c');
		fs.mkdirSync(nested, { recursive: true });

		const result = findGitRoot(nested);
		assert.strictEqual(normalizePath(result!), normalizePath(root));
	});

	it('finds a .git file (worktree or submodule)', () => {
		const root = freshTempDir();
		fs.writeFileSync(
			path.join(root, '.git'),
			'gitdir: ../.git/modules/foo\n',
		);
		const nested = path.join(root, 'sub', 'dir');
		fs.mkdirSync(nested, { recursive: true });

		const result = findGitRoot(nested);
		assert.strictEqual(normalizePath(result!), normalizePath(root));
	});

	it('finds .git when the start directory itself contains it', () => {
		const root = freshTempDir();
		fs.mkdirSync(path.join(root, '.git'));

		const result = findGitRoot(root);
		assert.strictEqual(normalizePath(result!), normalizePath(root));
	});

	it('returns null when no .git is found in the directory hierarchy', () => {
		const root = freshTempDir();
		const result = findGitRoot(root);
		assert.strictEqual(
			result,
			null,
			`expected null, but found .git at ${result}`,
		);
	});
});
