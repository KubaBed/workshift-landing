/**
 * Kamera płótna: czysta matematyka i zapis w localStorage, bez Reacta i DOM-u.
 *
 * Kamera to { x, y, scale }: przesunięcie świata w pikselach ekranu i skala.
 * Zapisujemy wyłącznie kamerę, w formacie z numerem wersji. Wersja 1 jest pierwsza,
 * więc nie ma starszych formatów do migracji: każda inna wersja, zepsuty JSON albo
 * za duży wpis dają kamerę domyślną, a stary wpis jest usuwany.
 */

export const MIN_SCALE = 0.1;
export const MAX_SCALE = 3;
export const DEFAULT_CAMERA = Object.freeze({ x: 48, y: 48, scale: 1 });

export const CAMERA_STORAGE_KEY = 'workshift-landing:component-canvas:camera';
export const CAMERA_FORMAT_VERSION = 1;
// Poprawny wpis ma ok. 60 znaków. Wszystko powyżej limitu to śmieci albo cudzy format.
export const MAX_STORED_LENGTH = 512;
// Twarda granica przesunięcia, gdy rozmiar świata nie jest jeszcze znany.
const MAX_OFFSET = 1e6;

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
export const clampScale = (scale) => clamp(scale, MIN_SCALE, MAX_SCALE);

export function isFiniteCamera(camera) {
  return Boolean(camera)
    && typeof camera === 'object'
    && Number.isFinite(camera.x)
    && Number.isFinite(camera.y)
    && Number.isFinite(camera.scale)
    && camera.scale > 0;
}

/**
 * Skala w granicach, a przesunięcie takie, żeby co najmniej `margin` pikseli świata
 * zostało na ekranie. `bounds`: { viewportWidth, viewportHeight, worldWidth, worldHeight }.
 */
export function clampCamera(camera, bounds, margin = 96) {
  if (!isFiniteCamera(camera)) return { ...DEFAULT_CAMERA };
  const scale = clampScale(camera.scale);
  let { x, y } = camera;
  const known = bounds
    && bounds.worldWidth > 0 && bounds.worldHeight > 0
    && bounds.viewportWidth > 0 && bounds.viewportHeight > 0;
  if (known) {
    const m = Math.min(margin, bounds.viewportWidth / 2, bounds.viewportHeight / 2);
    x = clamp(x, m - bounds.worldWidth * scale, bounds.viewportWidth - m);
    y = clamp(y, m - bounds.worldHeight * scale, bounds.viewportHeight - m);
  } else {
    x = clamp(x, -MAX_OFFSET, MAX_OFFSET);
    y = clamp(y, -MAX_OFFSET, MAX_OFFSET);
  }
  return { x, y, scale };
}

/** Zoom wokół punktu ekranu (px, py): ten punkt świata zostaje pod kursorem. */
export function zoomAt(camera, factor, px, py) {
  const scale = clampScale(camera.scale * factor);
  const k = scale / camera.scale;
  return { x: px - (px - camera.x) * k, y: py - (py - camera.y) * k, scale };
}

/** Kamera, która mieści prostokąt świata `rect` w ekranie, bez powiększania ponad `maxScale`. */
export function fitRect(rect, viewportWidth, viewportHeight, padding = 64, maxScale = 1) {
  const fit = Math.min(
    (viewportWidth - 2 * padding) / rect.width,
    (viewportHeight - 2 * padding) / rect.height,
  );
  const scale = clamp(Number.isFinite(fit) && fit > 0 ? fit : 1, MIN_SCALE, Math.min(maxScale, MAX_SCALE));
  return {
    scale,
    x: Math.max(padding, (viewportWidth - rect.width * scale) / 2) - rect.x * scale,
    y: Math.max(padding, (viewportHeight - rect.height * scale) / 2) - rect.y * scale,
  };
}

/**
 * Najmniejsze przesunięcie, które pokazuje prostokąt ekranu `rect` (left/top/right/bottom
 * względem viewportu) z marginesem. Prostokąt większy od ekranu wyrównuje do lewego górnego rogu.
 */
export function revealRect(camera, rect, viewportWidth, viewportHeight, margin = 48) {
  const axis = (start, end, size) => {
    if (end - start > size - 2 * margin) return margin - start;
    if (start < margin) return margin - start;
    if (end > size - margin) return size - margin - end;
    return 0;
  };
  return {
    ...camera,
    x: camera.x + axis(rect.left, rect.right, viewportWidth),
    y: camera.y + axis(rect.top, rect.bottom, viewportHeight),
  };
}

/** Odczyt wpisu: kamera albo null (zepsuty, za duży, nieznana wersja). */
export function parseStoredCamera(raw) {
  if (typeof raw !== 'string' || raw.length === 0 || raw.length > MAX_STORED_LENGTH) return null;
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!data || typeof data !== 'object' || data.v !== CAMERA_FORMAT_VERSION) return null;
  if (!isFiniteCamera(data.camera)) return null;
  const { x, y, scale } = data.camera;
  return clampCamera({ x, y, scale }, null);
}

export function serializeCamera(camera) {
  const { x, y, scale } = camera;
  const round = (n, d) => Math.round(n * 10 ** d) / 10 ** d;
  return JSON.stringify({ v: CAMERA_FORMAT_VERSION, camera: { x: round(x, 1), y: round(y, 1), scale: round(scale, 4) } });
}

/** localStorage albo null, gdy niedostępny (tryb prywatny, zablokowane ciasteczka, brak okna). */
export function getStorage() {
  try {
    const storage = globalThis.localStorage;
    if (!storage) return null;
    const probe = `${CAMERA_STORAGE_KEY}:probe`;
    storage.setItem(probe, '1');
    storage.removeItem(probe);
    return storage;
  } catch {
    return null;
  }
}

export function readCamera(storage) {
  if (!storage) return null;
  try {
    const raw = storage.getItem(CAMERA_STORAGE_KEY);
    if (raw == null) return null;
    const camera = parseStoredCamera(raw);
    if (!camera) storage.removeItem(CAMERA_STORAGE_KEY);
    return camera;
  } catch {
    return null;
  }
}

/** Zapis kamery. Zwraca false przy braku miejsca (QuotaExceededError) lub innym błędzie. */
export function writeCamera(storage, camera) {
  if (!storage || !isFiniteCamera(camera)) return false;
  try {
    storage.setItem(CAMERA_STORAGE_KEY, serializeCamera(camera));
    return true;
  } catch {
    return false;
  }
}
