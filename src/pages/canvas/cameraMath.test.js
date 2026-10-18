// Kamera płótna: node --test src/pages/canvas/ (npm run test:canvas).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CAMERA_STORAGE_KEY,
  DEFAULT_CAMERA,
  MAX_SCALE,
  MAX_STORED_LENGTH,
  MIN_SCALE,
  clampCamera,
  fitRect,
  parseStoredCamera,
  readCamera,
  revealRect,
  serializeCamera,
  writeCamera,
  zoomAt,
} from './cameraMath.js';

const memoryStorage = (initial = {}) => {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
    removeItem: (k) => data.delete(k),
    data,
  };
};

test('zapis i odczyt kamery w wersji 1', () => {
  const storage = memoryStorage();
  assert.equal(writeCamera(storage, { x: 10.04, y: -20, scale: 0.5 }), true);
  assert.deepEqual(readCamera(storage), { x: 10, y: -20, scale: 0.5 });
  assert.match(storage.getItem(CAMERA_STORAGE_KEY), /"v":1/);
});

test('zepsuty, za duży albo nieznany wpis daje null i jest usuwany', () => {
  const cases = [
    '{nie json',
    JSON.stringify({ v: 2, camera: { x: 0, y: 0, scale: 1 } }),
    JSON.stringify({ x: 0, y: 0, scale: 1 }),
    JSON.stringify({ v: 1, camera: { x: 'a', y: 0, scale: 1 } }),
    JSON.stringify({ v: 1, camera: { x: 0, y: 0, scale: 0 } }),
    JSON.stringify({ v: 1, camera: { x: 0, y: 0, scale: 1 }, groups: 'x'.repeat(MAX_STORED_LENGTH) }),
  ];
  for (const raw of cases) {
    const storage = memoryStorage({ [CAMERA_STORAGE_KEY]: raw });
    assert.equal(readCamera(storage), null, raw.slice(0, 40));
    assert.equal(storage.getItem(CAMERA_STORAGE_KEY), null);
  }
});

test('wartości spoza zakresu są przycinane', () => {
  const camera = parseStoredCamera(JSON.stringify({ v: 1, camera: { x: 1e9, y: -1e9, scale: 50 } }));
  assert.equal(camera.scale, MAX_SCALE);
  assert.ok(Math.abs(camera.x) <= 1e6 && Math.abs(camera.y) <= 1e6);
  assert.equal(clampCamera({ x: 0, y: 0, scale: 0.001 }).scale, MIN_SCALE);
  assert.deepEqual(clampCamera({ x: NaN, y: 0, scale: 1 }), { ...DEFAULT_CAMERA });
});

test('niedostępny storage i brak miejsca nie rzucają wyjątku', () => {
  const broken = {
    getItem: () => { throw new Error('SecurityError'); },
    setItem: () => { const e = new Error('quota'); e.name = 'QuotaExceededError'; throw e; },
    removeItem: () => { throw new Error('SecurityError'); },
  };
  assert.equal(readCamera(broken), null);
  assert.equal(writeCamera(broken, DEFAULT_CAMERA), false);
  assert.equal(readCamera(null), null);
  assert.equal(writeCamera(null, DEFAULT_CAMERA), false);
});

test('zoom zostawia punkt pod kursorem w miejscu', () => {
  const camera = { x: 100, y: 50, scale: 1 };
  const next = zoomAt(camera, 2, 300, 250);
  const worldX = (300 - camera.x) / camera.scale;
  assert.equal(next.x + worldX * next.scale, 300);
  assert.equal(next.scale, 2);
});

test('granice trzymają kawałek świata na ekranie', () => {
  const bounds = { viewportWidth: 1000, viewportHeight: 800, worldWidth: 3000, worldHeight: 5000 };
  const far = clampCamera({ x: 99999, y: -99999, scale: 1 }, bounds);
  assert.equal(far.x, 1000 - 96);
  assert.equal(far.y, 96 - 5000);
});

test('fit mieści świat w ekranie bez powiększania ponad 100%', () => {
  const camera = fitRect({ x: 0, y: 0, width: 2000, height: 1000 }, 1000, 800, 50);
  assert.equal(camera.scale, 0.45);
  assert.equal(fitRect({ x: 0, y: 0, width: 100, height: 100 }, 1000, 800).scale, 1);
});

test('odsłanianie fokusu przesuwa minimalnie', () => {
  const camera = { x: 0, y: 0, scale: 1 };
  assert.deepEqual(revealRect(camera, { left: 100, top: 100, right: 200, bottom: 140 }, 1000, 800), camera);
  const moved = revealRect(camera, { left: 1100, top: 900, right: 1200, bottom: 940 }, 1000, 800, 48);
  assert.equal(moved.x, 1000 - 48 - 1200);
  assert.equal(moved.y, 800 - 48 - 940);
});

test('serializacja jest krótka', () => {
  assert.ok(serializeCamera({ x: 123.456789, y: -9.87654, scale: 0.123456789 }).length < 80);
});
