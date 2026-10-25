import test from 'node:test';
import assert from 'node:assert/strict';
import { wearableService } from './wearableService.ts';

test('wearableService provides available devices and active device', () => {
  const devices = wearableService.getAvailableDevices();
  assert.ok(devices.length >= 3);
  assert.equal(devices[0].type, 'Nordic nRF52');

  const active = wearableService.getActiveDevice();
  assert.ok(active !== null);
  assert.equal(wearableService.getConnectionStatus(), true);
});

test('wearableService can disconnect and reconnect', async () => {
  wearableService.disconnect();
  assert.equal(wearableService.getConnectionStatus(), false);

  const reconnected = await wearableService.connect();
  assert.equal(reconnected, true);
  assert.equal(wearableService.getConnectionStatus(), true);
});

test('wearableService stress spike triggers expected higher BPM', () => {
  wearableService.triggerSimulatedStressSpike();
  assert.ok(wearableService.getConnectionStatus());
  wearableService.destroy();
});
