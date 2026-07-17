// templates.test.ts — inline tests for escapeHtml, escapeAttr, and fill
// These functions are module-private in templates.ts. Implementations are
// mirrored from vsc/src/views/templates.ts.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Inlined from templates.ts
function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function escapeAttr(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

function fill(template: string, values: Record<string, string>): string {
	let result = template;
	for (const [key, value] of Object.entries(values)) {
		result = result.replaceAll(`{{${key}}}`, value);
	}
	return result;
}

describe('escapeHtml', () => {
	it('escapes &', () => {
		assert.strictEqual(escapeHtml('a & b'), 'a &amp; b');
	});
	it('escapes <', () => {
		assert.strictEqual(escapeHtml('a < b'), 'a &lt; b');
	});
	it('escapes >', () => {
		assert.strictEqual(escapeHtml('a > b'), 'a &gt; b');
	});
	it('escapes "', () => {
		assert.strictEqual(escapeHtml('a " b'), 'a &quot; b');
	});
	it("escapes '", () => {
		assert.strictEqual(escapeHtml("a ' b"), 'a &#39; b');
	});
	it('handles multiple special chars', () => {
		assert.strictEqual(escapeHtml('<script>alert("xss")</script>'),
			'&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
	});
	it('leaves safe strings unchanged', () => {
		assert.strictEqual(escapeHtml('hello world'), 'hello world');
	});
	it('handles empty string', () => {
		assert.strictEqual(escapeHtml(''), '');
	});
});

describe('escapeAttr', () => {
	it('escapes &', () => {
		assert.strictEqual(escapeAttr('a & b'), 'a &amp; b');
	});
	it('escapes "', () => {
		assert.strictEqual(escapeAttr('a " b'), 'a &quot; b');
	});
	it('escapes <', () => {
		assert.strictEqual(escapeAttr('a < b'), 'a &lt; b');
	});
	it('escapes >', () => {
		assert.strictEqual(escapeAttr('a > b'), 'a &gt; b');
	});
	it('does NOT escape single quotes', () => {
		assert.strictEqual(escapeAttr("a ' b"), "a ' b");
	});
	it('handles empty string', () => {
		assert.strictEqual(escapeAttr(''), '');
	});
});

describe('fill', () => {
	it('replaces a single placeholder', () => {
		assert.strictEqual(fill('Hello {{name}}!', { name: 'World' }), 'Hello World!');
	});
	it('replaces multiple placeholders', () => {
		assert.strictEqual(fill('{{greeting}} {{name}}!', { greeting: 'Hello', name: 'World' }), 'Hello World!');
	});
	it('leaves unmatched placeholders unchanged', () => {
		assert.strictEqual(fill('Hello {{name}}!', {}), 'Hello {{name}}!');
	});
	it('handles empty template', () => {
		assert.strictEqual(fill('', {}), '');
	});
});
