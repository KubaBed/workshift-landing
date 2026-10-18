import { useEffect, useRef, useState } from 'react';
import {
  DEFAULT_CAMERA,
  clampCamera,
  clampScale,
  fitRect,
  getStorage,
  readCamera,
  revealRect,
  writeCamera,
  zoomAt,
} from './cameraMath';

/**
 * Kamera płótna: przesuwanie, zoom, klawiatura, odsłanianie fokusu, linki i zapis kamery.
 *
 * - Transformacja świata trafia do DOM najwyżej raz na klatkę (requestAnimationFrame),
 *   bez stanu Reacta na każdą klatkę. Rozmiary świata i ekranu czyta ResizeObserver,
 *   więc gesty nie przeplatają odczytów układu z zapisami.
 * - Przesuwanie zaczyna się tylko na pustym tle (`data-canvas-pan`) albo z wciśniętą spacją.
 *   W przykładach klik, zaznaczanie, pisanie i przewijanie zostają natywne.
 * - Skróty (strzałki, +/-, 0, F, spacja, Escape) działają tylko, gdy fokus ma samo płótno.
 * - Zapisywana jest wyłącznie kamera (cameraMath.js). Reset zmienia tylko kamerę.
 */

const PAN_STEP = 80;
const ZOOM_STEP = 1.2;
const SETTLE_MS = 250;
const SETTLE_MAX_MS = 2000;
const PERSIST_MS = 400;
const NOTICE_MS = 4000;
const REVEAL_MARGIN = 48;

const isPanSurface = (target) => target instanceof Element && target.hasAttribute('data-canvas-pan');
const midpoint = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

/** Czy element pod kółkiem sam przewinie się w tym kierunku (zagnieżdżone przewijanie). */
function canScrollNatively(target, stopAt, dx, dy) {
  for (let el = target instanceof Element ? target : null; el && el !== stopAt; el = el.parentElement) {
    const style = getComputedStyle(el);
    const scrollY = /(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight;
    const scrollX = /(auto|scroll)/.test(style.overflowX) && el.scrollWidth > el.clientWidth;
    if (scrollY && ((dy > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1) || (dy < 0 && el.scrollTop > 0))) return true;
    if (scrollX && ((dx > 0 && el.scrollLeft + el.clientWidth < el.scrollWidth - 1) || (dx < 0 && el.scrollLeft > 0))) return true;
  }
  return false;
}

/** Piksele z delty kółka niezależnie od deltaMode (linie, strony). */
function wheelPixels(e, pageSize) {
  const k = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? pageSize : 1;
  return { dx: e.deltaX * k, dy: e.deltaY * k };
}

export function useCanvasCamera({ viewportRef, worldRef, groupIds, groupDomId }) {
  const [zoomPercent, setZoomPercent] = useState(100);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState(null);
  // Akcje dla przycisków paska (fit, reset, zoom). Wywoływane tylko w handlerach zdarzeń.
  const actions = useRef(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const world = worldRef.current;
    if (!viewport || !world) return undefined;

    const storage = getStorage();
    const saved = readCamera(storage);
    const sizes = { viewportWidth: 0, viewportHeight: 0, worldWidth: 0, worldHeight: 0 };
    let camera = { ...(saved ?? DEFAULT_CAMERA) };
    let frame = 0;
    let lastPercent = -1;
    let persistTimer = 0;
    let settleTimer = 0;
    let noticeTimer = 0;
    let initialized = false;
    const settleDeadline = Date.now() + SETTLE_MAX_MS;

    // --- render i zapis ---

    const render = () => {
      frame = 0;
      world.style.transform = `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`;
      const percent = Math.round(camera.scale * 100);
      if (percent !== lastPercent) {
        lastPercent = percent;
        setZoomPercent(percent);
      }
    };

    const flushPersist = () => {
      clearTimeout(persistTimer);
      persistTimer = 0;
      if (initialized) writeCamera(storage, camera);
    };

    const setCamera = (next, { persist = true } = {}) => {
      camera = clampCamera(next, sizes.worldWidth ? sizes : null);
      if (!frame) frame = requestAnimationFrame(render);
      if (persist && storage) {
        clearTimeout(persistTimer);
        persistTimer = setTimeout(flushPersist, PERSIST_MS);
      }
    };

    const measure = () => {
      sizes.viewportWidth = viewport.clientWidth;
      sizes.viewportHeight = viewport.clientHeight;
      sizes.worldWidth = world.offsetWidth;
      sizes.worldHeight = world.offsetHeight;
    };

    // --- akcje ---

    const worldRect = () => ({ x: 0, y: 0, width: sizes.worldWidth, height: sizes.worldHeight });
    const fitAll = (options) => setCamera(fitRect(worldRect(), sizes.viewportWidth, sizes.viewportHeight), options);
    const reset = () => setCamera(DEFAULT_CAMERA);
    const zoomBy = (factor) => setCamera(zoomAt(camera, factor, sizes.viewportWidth / 2, sizes.viewportHeight / 2));
    const panBy = (dx, dy) => setCamera({ ...camera, x: camera.x + dx, y: camera.y + dy });

    // Prostokąt elementu w układzie świata (niezależny od bieżącej transformacji).
    const rectInWorld = (el) => {
      const r = el.getBoundingClientRect();
      const w = world.getBoundingClientRect();
      return {
        x: (r.left - w.left) / camera.scale,
        y: (r.top - w.top) / camera.scale,
        width: r.width / camera.scale,
        height: r.height / camera.scale,
      };
    };

    const revealGroup = (id, options) => {
      if (!groupIds.includes(id)) return false;
      const el = document.getElementById(groupDomId(id));
      if (!el || !world.contains(el)) return false;
      if (frame) { cancelAnimationFrame(frame); render(); }
      setCamera(fitRect(rectInWorld(el), sizes.viewportWidth, sizes.viewportHeight, 64, 1), options);
      return true;
    };

    const hashGroup = () => {
      try {
        return decodeURIComponent(window.location.hash.slice(1));
      } catch {
        return '';
      }
    };

    const showNotice = (text) => {
      clearTimeout(noticeTimer);
      setNotice(text);
      noticeTimer = setTimeout(() => setNotice(null), NOTICE_MS);
    };

    actions.current = { fitAll: () => fitAll(), reset, zoomBy };

    // --- start: kamera dopiero, gdy układ przestanie się zmieniać ---

    const initCamera = () => {
      if (initialized) return;
      measure();
      initialized = true;
      if (!revealGroup(hashGroup(), { persist: false })) {
        if (saved) setCamera(saved, { persist: false });
        else fitAll({ persist: false });
      }
      setReady(true);
    };

    const resizeObserver = new ResizeObserver(() => {
      measure();
      if (!initialized) {
        clearTimeout(settleTimer);
        settleTimer = setTimeout(initCamera, Date.now() >= settleDeadline ? 0 : SETTLE_MS);
      } else {
        // Treść urosła albo zmienił się ekran: tylko pilnujemy granic, bez przestawiania grup.
        setCamera(camera, { persist: false });
      }
    });
    resizeObserver.observe(world);
    resizeObserver.observe(viewport);
    frame = requestAnimationFrame(render);

    // --- wskaźnik: przesuwanie i pinch ---

    const pointers = new Map();
    let gesture = null;
    let origin = { left: 0, top: 0 };
    let spaceHeld = false;

    const local = (e) => ({ x: e.clientX - origin.left, y: e.clientY - origin.top });

    // Każda zmiana liczby wskaźników zaczyna gest od nowa od bieżącej kamery (bez skoku).
    const rebase = () => {
      const points = [...pointers.values()];
      if (!points.length) {
        gesture = null;
        viewport.removeAttribute('data-panning');
        return;
      }
      const [a, b] = points;
      gesture = { camera: { ...camera }, mid: b ? midpoint(a, b) : a, dist: b ? distance(a, b) : 0 };
      viewport.setAttribute('data-panning', '');
    };

    const release = (id) => {
      try {
        if (viewport.hasPointerCapture(id)) viewport.releasePointerCapture(id);
      } catch { /* wskaźnik już zniknął */ }
    };

    const endAll = () => {
      for (const id of pointers.keys()) release(id);
      pointers.clear();
      rebase();
      spaceHeld = false;
      viewport.removeAttribute('data-space');
    };

    const onPointerDown = (e) => {
      if (pointers.size === 0) {
        if (e.pointerType === 'mouse' && e.button !== 0 && e.button !== 1) return;
        const fromSurface = isPanSurface(e.target);
        if (!fromSurface && !(spaceHeld && e.button === 0)) return;
        if (fromSurface && document.activeElement !== viewport) viewport.focus({ preventScroll: true });
        // Bez zaznaczania tekstu i autoscrolla środkowym przyciskiem przy przeciąganiu tła.
        e.preventDefault();
        origin = viewport.getBoundingClientRect();
      } else if (e.pointerType === 'mouse') {
        return;
      }
      // Drugi palec dołącza do gestu, nawet jeśli wylądował na przykładzie (pinch).
      try { viewport.setPointerCapture(e.pointerId); } catch { /* nieobsługiwane */ }
      pointers.set(e.pointerId, local(e));
      rebase();
    };

    const onPointerMove = (e) => {
      if (!gesture || !pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, local(e));
      const points = [...pointers.values()];
      const start = gesture.camera;
      if (points.length === 1) {
        setCamera({ ...start, x: start.x + points[0].x - gesture.mid.x, y: start.y + points[0].y - gesture.mid.y });
        return;
      }
      const mid = midpoint(points[0], points[1]);
      const ratio = gesture.dist > 0 ? distance(points[0], points[1]) / gesture.dist : 1;
      const scale = clampScale(start.scale * ratio);
      const k = scale / start.scale;
      setCamera({ scale, x: mid.x - (gesture.mid.x - start.x) * k, y: mid.y - (gesture.mid.y - start.y) * k });
    };

    const onPointerEnd = (e) => {
      if (!pointers.delete(e.pointerId)) return;
      release(e.pointerId);
      rebase();
    };

    // --- kółko i gesty trackpada ---

    let safariGesture = null;

    const onWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        // Pinch na trackpadzie (Chrome, Firefox) i Ctrl/Cmd + kółko: zoom wokół kursora.
        e.preventDefault();
        if (safariGesture) return;
        const { dy } = wheelPixels(e, sizes.viewportHeight);
        const r = viewport.getBoundingClientRect();
        setCamera(zoomAt(camera, Math.exp(-dy * 0.01), e.clientX - r.left, e.clientY - r.top));
        return;
      }
      const { dx, dy } = wheelPixels(e, sizes.viewportHeight);
      if (canScrollNatively(e.target, viewport, dx, dy)) return;
      e.preventDefault();
      panBy(-dx, -dy);
    };

    // Safari na macOS zgłasza pinch jako gesturestart/gesturechange zamiast Ctrl + kółko.
    const onGestureStart = (e) => {
      e.preventDefault();
      const r = viewport.getBoundingClientRect();
      safariGesture = { camera: { ...camera }, x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onGestureChange = (e) => {
      if (!safariGesture) return;
      e.preventDefault();
      const { camera: start, x, y } = safariGesture;
      setCamera(zoomAt(start, e.scale, x, y));
    };
    const onGestureEnd = (e) => {
      e.preventDefault();
      safariGesture = null;
    };

    // --- klawiatura (tylko na samym płótnie) ---

    const onKeyDown = (e) => {
      if (e.target !== viewport || e.metaKey || e.ctrlKey || e.altKey) return;
      const step = e.shiftKey ? PAN_STEP * 3 : PAN_STEP;
      switch (e.key) {
        case 'ArrowLeft': panBy(step, 0); break;
        case 'ArrowRight': panBy(-step, 0); break;
        case 'ArrowUp': panBy(0, step); break;
        case 'ArrowDown': panBy(0, -step); break;
        case '+':
        case '=': zoomBy(ZOOM_STEP); break;
        case '-':
        case '_': zoomBy(1 / ZOOM_STEP); break;
        case '0': reset(); break;
        case 'f':
        case 'F': fitAll(); break;
        case ' ':
          spaceHeld = true;
          viewport.setAttribute('data-space', '');
          break;
        case 'Escape':
          // Escape przerywa przeciąganie i wraca do kamery sprzed gestu.
          if (!gesture) return;
          setCamera(gesture.camera);
          endAll();
          break;
        default:
          return;
      }
      e.preventDefault();
    };

    const onKeyUp = (e) => {
      if (e.key === ' ') {
        spaceHeld = false;
        viewport.removeAttribute('data-space');
      }
    };

    // --- fokus poza ekranem i natywne przewijanie ---

    const onFocusIn = (e) => {
      const el = e.target;
      if (!(el instanceof Element) || el === viewport || !world.contains(el)) return;
      // Przeglądarka mogła przewinąć viewport do fokusu. Cofamy to, zanim zmierzymy element.
      viewport.scrollTop = 0;
      viewport.scrollLeft = 0;
      if (frame) { cancelAnimationFrame(frame); render(); }
      const r = el.getBoundingClientRect();
      const v = viewport.getBoundingClientRect();
      const rect = { left: r.left - v.left, top: r.top - v.top, right: r.right - v.left, bottom: r.bottom - v.top };
      const next = revealRect(camera, rect, sizes.viewportWidth, sizes.viewportHeight, REVEAL_MARGIN);
      if (next.x !== camera.x || next.y !== camera.y) setCamera(next);
    };

    // Natywne przewijanie (np. scrollIntoView w przykładzie) nie może ruszać płótna.
    const onScroll = () => {
      if (viewport.scrollTop || viewport.scrollLeft) {
        viewport.scrollTop = 0;
        viewport.scrollLeft = 0;
      }
    };

    // --- linki ---

    const onClickCapture = (e) => {
      if (e.defaultPrevented || !(e.target instanceof Element)) return;
      const link = e.target.closest('a[href]');
      if (!link || !world.contains(link)) return;
      const href = link.getAttribute('href') ?? '';
      if (href.startsWith('#')) {
        // Kotwica do grupy przesuwa kamerę zamiast przewijać stronę.
        e.preventDefault();
        if (!revealGroup(href.slice(1))) showNotice(`Na płótnie nie ma grupy ${href}.`);
        return;
      }
      // Cmd/Ctrl/Shift + klik i target=_blank zostają natywne: link otwiera się w nowej karcie.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0 || link.target === '_blank') return;
      e.preventDefault();
      showNotice(`Link ${href} zatrzymany, żeby nie opuszczać płótna. Cmd albo Ctrl + klik otwiera go w nowej karcie.`);
    };

    const onHashChange = () => revealGroup(hashGroup());

    // --- utrata wskaźnika, okna i karty ---

    const onVisibility = () => {
      if (document.hidden) {
        endAll();
        flushPersist();
      }
    };

    viewport.addEventListener('pointerdown', onPointerDown);
    viewport.addEventListener('pointermove', onPointerMove);
    viewport.addEventListener('pointerup', onPointerEnd);
    viewport.addEventListener('pointercancel', onPointerEnd);
    viewport.addEventListener('lostpointercapture', onPointerEnd);
    viewport.addEventListener('wheel', onWheel, { passive: false });
    viewport.addEventListener('gesturestart', onGestureStart);
    viewport.addEventListener('gesturechange', onGestureChange);
    viewport.addEventListener('gestureend', onGestureEnd);
    viewport.addEventListener('keydown', onKeyDown);
    viewport.addEventListener('focusin', onFocusIn);
    viewport.addEventListener('scroll', onScroll);
    world.addEventListener('click', onClickCapture, true);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', endAll);
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('pagehide', flushPersist);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      viewport.removeEventListener('pointerdown', onPointerDown);
      viewport.removeEventListener('pointermove', onPointerMove);
      viewport.removeEventListener('pointerup', onPointerEnd);
      viewport.removeEventListener('pointercancel', onPointerEnd);
      viewport.removeEventListener('lostpointercapture', onPointerEnd);
      viewport.removeEventListener('wheel', onWheel);
      viewport.removeEventListener('gesturestart', onGestureStart);
      viewport.removeEventListener('gesturechange', onGestureChange);
      viewport.removeEventListener('gestureend', onGestureEnd);
      viewport.removeEventListener('keydown', onKeyDown);
      viewport.removeEventListener('focusin', onFocusIn);
      viewport.removeEventListener('scroll', onScroll);
      world.removeEventListener('click', onClickCapture, true);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', endAll);
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('pagehide', flushPersist);
      document.removeEventListener('visibilitychange', onVisibility);
      resizeObserver.disconnect();
      endAll();
      if (persistTimer) flushPersist();
      cancelAnimationFrame(frame);
      clearTimeout(settleTimer);
      clearTimeout(noticeTimer);
      actions.current = null;
    };
  }, [viewportRef, worldRef, groupIds, groupDomId]);

  return { actions, zoomPercent, ready, notice };
}
