import React, { useMemo, useRef } from 'react';
import { Maximize, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CanvasGroup } from './CanvasGroup';
import { GROUP_IDS, groupDomId } from './variants';
import { useCanvasCamera } from './useCanvasCamera';

/**
 * Powłoka płótna: pełny ekran, świat z grupami w dwóch kolumnach i pasek kamery.
 *
 * Grupy stoją w zwykłym przepływie (flex), więc rozwinięta treść spycha następne grupy
 * w dół zamiast na nie nachodzić. Kamera tylko przesuwa i skaluje cały świat.
 * Pasek jest w DOM przed płótnem, żeby Tab dochodził do niego nawet po zgubieniu widoku.
 */

const COLUMN_COUNT = 2;

// Pierścień fokusu przycisków ciemniejszy niż domyślny limonkowy, żeby był widoczny na sage.
const FOCUS = 'focus-visible:ring-black/40';

function CanvasToolbar({ actions, zoomPercent }) {
  const run = (name, ...args) => () => actions.current?.[name]?.(...args);
  return (
    <div
      role="toolbar"
      aria-label="Kamera płótna"
      className="fixed bottom-5 right-5 z-20 flex items-center gap-1 rounded-xl border border-black/10 bg-sage/95 p-1.5 shadow-sm"
    >
      <Button variant="ghost" size="icon-sm" className={FOCUS} aria-label="Oddal" title="Oddal (-)" onClick={run('zoomBy', 1 / 1.2)}>
        <ZoomOut />
      </Button>
      <span className="w-12 text-center font-mono text-xs tabular-nums text-muted-dark">
        {zoomPercent}%
      </span>
      <Button variant="ghost" size="icon-sm" className={FOCUS} aria-label="Przybliż" title="Przybliż (+)" onClick={run('zoomBy', 1.2)}>
        <ZoomIn />
      </Button>
      <Button variant="ghost" size="icon-sm" className={FOCUS} aria-label="Pokaż wszystkie grupy" title="Pokaż wszystkie grupy (F)" onClick={run('fitAll')}>
        <Maximize />
      </Button>
      <Button variant="ghost" size="icon-sm" className={FOCUS} aria-label="Resetuj widok do 100%" title="Resetuj widok do 100% (0)" onClick={run('reset')}>
        <RotateCcw />
      </Button>
    </div>
  );
}

export function CanvasShell({ groups }) {
  const viewportRef = useRef(null);
  const worldRef = useRef(null);
  const { actions, zoomPercent, ready, notice } = useCanvasCamera({
    viewportRef,
    worldRef,
    groupIds: GROUP_IDS,
    groupDomId,
  });

  const columns = useMemo(
    () => Array.from({ length: COLUMN_COUNT }, (_, i) => groups.filter((group) => (group.column ?? 0) === i)),
    [groups],
  );

  return (
    <div className="fixed inset-0 overflow-hidden bg-sage font-sans text-black antialiased selection:bg-lime selection:text-black">
      <CanvasToolbar actions={actions} zoomPercent={zoomPercent} />

      <div
        ref={viewportRef}
        data-canvas-pan
        data-lenis-prevent
        tabIndex={0}
        role="region"
        aria-roledescription="płótno"
        aria-label="Płótno komponentów. Strzałki przesuwają widok, plus i minus zmieniają przybliżenie, 0 wraca do 100%, F pokazuje wszystkie grupy, spacja z przeciąganiem przesuwa widok."
        aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight + - 0 F Space"
        className="absolute inset-0 cursor-grab touch-none overflow-hidden outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-black/50 data-panning:cursor-grabbing data-panning:select-none"
      >
        <div
          ref={worldRef}
          data-canvas-pan
          className={`absolute left-0 top-0 flex w-max origin-top-left items-start gap-24 p-24 transition-opacity duration-200 ${ready ? 'opacity-100' : 'opacity-0'}`}
        >
          {columns.map((column, i) => (
            <div key={i} data-canvas-pan className="flex w-[1280px] flex-col gap-24">
              {column.map((group) => <CanvasGroup key={group.id} group={group} />)}
            </div>
          ))}
        </div>
      </div>

      <p
        role="status"
        className={`pointer-events-none fixed bottom-5 left-5 z-20 max-w-md rounded-lg bg-black px-3 py-2 text-xs text-white transition-opacity ${notice ? 'opacity-100' : 'opacity-0'}`}
      >
        {notice ?? ''}
      </p>
    </div>
  );
}
