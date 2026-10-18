import React from 'react';
import { GroupSample } from './samples';
import { groupDomId } from './variants';

/**
 * Układ grupy na płótnie: tytuł 8 px nad przerywaną ramką, w środku porównania,
 * w każdym porównaniu sloty równej szerokości zawijane w rzędy.
 *
 * `data-canvas-pan` oznacza puste tło (ramka, odstępy między slotami): stąd zaczyna się
 * przesuwanie widoku. Tytuły, etykiety i same przykłady go nie mają, więc zaznaczanie
 * tekstu, kliknięcia i przewijanie w środku działają normalnie.
 */

const SURFACES = {
  sage: 'bg-transparent text-black',
  white: 'bg-white text-black',
  black: 'bg-black text-white',
};

function Slot({ label, surface, stretch, children }) {
  return (
    <div className="flex min-w-0 cursor-auto flex-col gap-2">
      <span className="font-mono text-xs text-muted-dark">{label}</span>
      <div
        className={`flex min-h-16 min-w-0 flex-col justify-center rounded-lg p-6 ${stretch ? 'items-stretch' : 'items-start'} ${SURFACES[surface] ?? SURFACES.sage}`}
      >
        {children}
      </div>
    </div>
  );
}

function Comparison({ groupId, comparison }) {
  const surface = comparison.surface ?? 'sage';
  return (
    <div data-canvas-pan className="flex flex-col gap-4">
      <h3 className="cursor-auto self-start font-mono text-xs uppercase tracking-[0.16em] text-muted-dark">
        {comparison.label}
      </h3>
      <div
        data-canvas-pan
        className="grid gap-8"
        style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${comparison.slotMin ?? 200}px, 1fr))` }}
      >
        {comparison.variants.map((variant) => (
          <Slot
            key={variant.id}
            label={variant.label}
            stretch={comparison.stretch}
            surface={variant.surface ?? surface}
          >
            <GroupSample groupId={groupId} comparisonId={comparison.id} variantId={variant.id} />
          </Slot>
        ))}
      </div>
      {comparison.note && (
        <p className="max-w-[72ch] cursor-auto self-start text-xs leading-relaxed text-muted-dark">{comparison.note}</p>
      )}
    </div>
  );
}

export function CanvasGroup({ group }) {
  const titleId = `${groupDomId(group.id)}-title`;
  return (
    <section id={groupDomId(group.id)} aria-labelledby={titleId} className="cursor-auto">
      <h2 id={titleId} className="mb-2 text-sm font-normal text-muted-dark">
        {group.title}
      </h2>
      <div
        data-canvas-pan
        className="flex cursor-grab flex-col gap-12 rounded-2xl border border-dashed border-muted-dark/25 p-10"
      >
        {group.comparisons.map((comparison) => (
          <Comparison key={comparison.id} groupId={group.id} comparison={comparison} />
        ))}
      </div>
    </section>
  );
}
