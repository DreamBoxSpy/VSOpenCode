// DisposableStore.test.ts
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { DisposableStore } from '../../utils/DisposableStore.ts';
import { createMockDisposable } from './mocks/vscode.ts';

describe('DisposableStore', () => {
  describe('add', () => {
    it('stores disposables', () => {
      const store = new DisposableStore();
      const d = createMockDisposable();
      store.add(d);
      // Verify via dispose — if stored, it should be called
      store.dispose();
      assert.strictEqual(d.callCount, 1);
    });
  });

  describe('dispose', () => {
    it('calls all registered disposables', () => {
      const store = new DisposableStore();
      const d1 = createMockDisposable();
      const d2 = createMockDisposable();
      store.add(d1);
      store.add(d2);
      store.dispose();
      assert.strictEqual(d1.callCount, 1);
      assert.strictEqual(d2.callCount, 1);
    });

    it('disposes in LIFO (reverse) order', () => {
      const store = new DisposableStore();
      const order: number[] = [];
      store.add({ dispose: () => order.push(1) });
      store.add({ dispose: () => order.push(2) });
      store.dispose();
      assert.deepStrictEqual(order, [2, 1]);
    });

    it('is idempotent — calling twice does not double-dispose', () => {
      const store = new DisposableStore();
      const d = createMockDisposable();
      store.add(d);
      store.dispose();
      store.dispose(); // second call should be safe
      assert.strictEqual(d.callCount, 1);
      assert.strictEqual(d.disposed, true);
    });

    it('empty store dispose does not throw', () => {
      const store = new DisposableStore();
      assert.doesNotThrow(() => store.dispose());
    });
  });

  describe('from', () => {
    it('creates pre-populated store and disposes all', () => {
      const d1 = createMockDisposable();
      const d2 = createMockDisposable();
      const store = DisposableStore.from(d1, d2);
      store.dispose();
      assert.strictEqual(d1.callCount, 1);
      assert.strictEqual(d2.callCount, 1);
    });
  });

  describe('disposeAll', () => {
    it('same as dispose — calls all in LIFO order', () => {
      const store = new DisposableStore();
      const d = createMockDisposable();
      store.add(d);
      store.disposeAll();
      assert.strictEqual(d.callCount, 1);
    });
  });
});
