/**
 * Wejście serwerowe: renderuje aplikację do HTML przy buildzie (prerender).
 *
 * scripts/build-seo-html.mjs woła render(url) dla każdej indeksowanej trasy i wstawia wynik
 * do #root. Przeglądarka dostaje gotową treść (bez czekania na JS), a src/main.jsx ją hydratuje.
 * prerenderToNodeStream czeka na wszystkie granice Suspense, więc leniwe strony też są w HTML.
 */
import { StrictMode } from 'react';
import { prerenderToNodeStream } from 'react-dom/static';
import { StaticRouter } from 'react-router';
import App from './App.jsx';
import { LenisProvider } from './components/LenisProvider';

async function streamToString(stream) {
  const decoder = new TextDecoder();
  let html = '';
  for await (const chunk of stream) html += typeof chunk === 'string' ? chunk : decoder.decode(chunk, { stream: true });
  return html + decoder.decode();
}

export async function render(url) {
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <StaticRouter location={url}>
        <LenisProvider>
          <App />
        </LenisProvider>
      </StaticRouter>
    </StrictMode>,
    // Bez limitu: inaczej React wynosi większe granice Suspense do <div hidden> i odsłania je skryptem,
    // a treść ma być widoczna w samym HTML (dla crawlerów bez JS i przed załadowaniem skryptów).
    { progressiveChunkSize: Number.POSITIVE_INFINITY },
  );
  return streamToString(prelude);
}
