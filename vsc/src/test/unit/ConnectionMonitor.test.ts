// ConnectionMonitor.test.ts
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { ConnectionMonitor } from '../../services/ConnectionMonitor.ts';

describe('ConnectionMonitor', () => {
  let monitor: ConnectionMonitor;

  describe('start and initial poll', () => {
    it('establishes baseline without firing events', async () => {
      let lost = false, restored = false;
      monitor = new ConnectionMonitor(async () => true);
      monitor.onConnectionLost = () => { lost = true; };
      monitor.onConnectionRestored = () => { restored = true; };

      // Use _handleResult directly to simulate poll
      (monitor as any)._handleResult(true);
      assert.strictEqual(lost, false);
      assert.strictEqual(restored, false);
      assert.strictEqual(monitor.isHealthy, true);
      // After first poll, _initialized should be true
      assert.strictEqual((monitor as any)._initialized, true);
    });

    it('start() is idempotent', () => {
      monitor = new ConnectionMonitor(async () => true);
      monitor.start();
      const firstInterval = (monitor as any)._interval;
      assert.ok(firstInterval !== null);
      monitor.start(); // second call should not create another interval
      const secondInterval = (monitor as any)._interval;
      assert.strictEqual(firstInterval, secondInterval);
      monitor.stop();
    });
  });

  describe('edge-triggered callbacks', () => {
    beforeEach(() => {
      monitor = new ConnectionMonitor(async () => true);
      (monitor as any)._handleResult(true); // set baseline: healthy
    });

    it('fires onConnectionLost when transitioning healthy→unhealthy', () => {
      let lost = false;
      monitor.onConnectionLost = () => { lost = true; };
      (monitor as any)._handleResult(false);
      assert.strictEqual(lost, true);
    });

    it('fires onConnectionRestored when transitioning unhealthy→healthy', () => {
      // First set to unhealthy
      (monitor as any)._handleResult(false);
      let restored = false;
      monitor.onConnectionRestored = () => { restored = true; };
      (monitor as any)._handleResult(true);
      assert.strictEqual(restored, true);
    });

    it('does NOT fire on same-state repeat (healthy→healthy)', () => {
      let restored = false;
      monitor.onConnectionRestored = () => { restored = true; };
      (monitor as any)._handleResult(true); // same state
      assert.strictEqual(restored, false);
    });

    it('does NOT fire on same-state repeat (unhealthy→unhealthy)', () => {
      (monitor as any)._handleResult(false); // set unhealthy
      let lost = false;
      monitor.onConnectionLost = () => { lost = true; };
      (monitor as any)._handleResult(false); // same state
      assert.strictEqual(lost, false);
    });
  });

  describe('dispose', () => {
    it('stops polling interval', () => {
      monitor = new ConnectionMonitor(async () => true);
      monitor.start();
      assert.ok((monitor as any)._interval !== null);
      monitor.dispose();
      // After dispose, interval should be null (stopped)
      assert.strictEqual((monitor as any)._interval, null);
    });
  });
});
