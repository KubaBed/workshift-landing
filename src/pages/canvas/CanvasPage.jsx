import React, { useEffect } from 'react';
import { CanvasShell } from './CanvasShell';
import { CANVAS_GROUPS } from './variants';

/**
 * /canvas - płótno komponentów z src/components/ui/ (tylko dev, patrz App.jsx).
 *
 * Pokazuje istniejące komponenty i ich warianty, z przesuwaniem i zoomem. Niczego
 * w komponentach nie zmienia: grupy i warianty w variants.js, przykłady w samples.jsx,
 * kamera w useCanvasCamera.js i cameraMath.js.
 */
export default function CanvasPage() {
  // Strona nie przewija się pod płótnem; tytuł karty jak na /showcase. Oba wracają przy wyjściu.
  useEffect(() => {
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    const prevTitle = document.title;
    html.style.overflow = 'hidden';
    document.title = 'Płótno komponentów | Workshift (dev)';
    return () => {
      html.style.overflow = prevOverflow;
      document.title = prevTitle;
    };
  }, []);

  return <CanvasShell groups={CANVAS_GROUPS} />;
}
