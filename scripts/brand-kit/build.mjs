#!/usr/bin/env node
// Workshift brand kit - generuje paczkę marki dla partnerów do public/brand/
// (serwowane jako workshift.pl/brand/).
//
//   node scripts/brand-kit/build.mjs
//
// Źródła prawdy (nie duplikujemy ich tutaj, tylko czytamy):
//   - kolory, radius: src/index.css (@theme + :root) - build przerywa się, gdy tokeny się rozjadą
//   - geometria sygnetu: BRAND.md §2.2 (stałe SYGNET poniżej, sprawdzane względem logo-icon.svg)
//   - fonty: public/fonts/*.woff2 (strona) + scripts/fonts/*.ttf (do zamiany wordmarku na krzywe)
// Treść ręczna: scripts/brand-kit/{DESIGN.body.md, components.css, index.html, ws-email.html, README.txt}
//
// Wymaga opentype.js (devDependency). Uruchom: npm run brand:build

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = path.join(ROOT, 'scripts/brand-kit');
const OUT = path.join(ROOT, 'public/brand');
const VERSION = '1.0';
const DATE = new Date().toISOString().slice(0, 10);

const opentype = require(process.env.OPENTYPE_PATH || 'opentype.js');
const sharp = require('sharp');

// ---------------------------------------------------------------- tokeny
const css = fs.readFileSync(path.join(ROOT, 'src/index.css'), 'utf8');
const fromCss = (name) => {
  const m = css.match(new RegExp(`--${name}:\\s*([^;]+);`));
  if (!m) throw new Error(`Brak tokenu --${name} w src/index.css`);
  return m[1].trim();
};

const C = {
  sage: fromCss('color-sage'),
  lime: fromCss('color-lime'),
  ink: fromCss('color-dark'),
  mutedDark: fromCss('color-muted-dark'),
  mutedLight: fromCss('color-muted-light'),
  white: '#FFFFFF',
  limeDeep: '#81C44E', // tylko drugi stop gradientu w sygnecie (BRAND.md §3.1)
  destructive: '#DD453D',
};
for (const [k, v] of Object.entries(C)) if (!/^#[0-9A-Fa-f]{6}$/.test(v)) throw new Error(`Token ${k}=${v} nie jest hexem`);
C.sage = C.sage.toUpperCase(); C.lime = C.lime.toUpperCase(); C.mutedDark = C.mutedDark.toUpperCase(); C.mutedLight = C.mutedLight.toUpperCase();

const LINES = {
  line: 'rgba(0,0,0,0.12)',
  lineStrong: 'rgba(0,0,0,0.2)',
  lineOnInk: 'rgba(255,255,255,0.16)',
  onInkBody: 'rgba(255,255,255,0.72)',
  onInkLabel: 'rgba(255,255,255,0.55)',
};

const T = {
  color: {
    sage: [C.sage, 'Tło strony i grafik (domyślne)'],
    lime: [C.lime, 'Jedyny akcent: CTA, wyróżnienie, przesunięta warstwa'],
    'lime-deep': [C.limeDeep, 'Wyłącznie drugi stop gradientu sygnetu'],
    ink: [C.ink, 'Tekst; tło sekcji i grafik ciemnych'],
    white: [C.white, 'Karty na sage; tekst na czarnym'],
    'muted-dark': [C.mutedDark, 'Tekst drugorzędny, metadane'],
    'muted-light': [C.mutedLight, 'Podpisy, placeholdery, elementy wyłączone'],
    destructive: [C.destructive, 'Tylko błędy. Nigdy dekoracja'],
  },
  radius: { none: '0px', sm: '4px', md: '8px', default: '10px', card: '20px', panel: '24px', pill: '999px' },
  space: { xs: '8px', sm: '12px', md: '24px', lg: '48px', xl: '96px', section: '112px', container: '1320px', gutter: '24px', 'gutter-mobile': '16px' },
  font: {
    sans: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    mono: '"IBM Plex Mono", ui-monospace, "SFMono-Regular", Menlo, monospace',
  },
  motion: { ease: 'cubic-bezier(0.21, 0.47, 0.32, 0.98)', 'dur-fast': '0.2s', 'dur-enter': '0.8s' },
};

// ---------------------------------------------------------------- sygnet
// BRAND.md §2.2, viewBox 512. Zmiana geometrii = zmiana logo, nie tego pliku.
const SYGNET = [
  [[141, 141], [371, 141], [333, 205], [103, 205]],
  [[192, 237], [422, 237], [384, 301], [154, 301]],
  [[141, 333], [371, 333], [333, 397], [103, 397]],
];
{
  const icon = fs.readFileSync(path.join(ROOT, 'public/brand-assets/logo-icon.svg'), 'utf8');
  for (const p of SYGNET) if (!icon.includes(p.map((xy) => xy.join(',')).join(' '))) throw new Error('Geometria sygnetu rozjechała się z public/brand-assets/logo-icon.svg');
}
const BAR = { w: 230, h: 64, skew: 38, gap: 32, shift: 51 }; // proporcje warstwy z sygnetu

const THEME = {
  light: { word: C.ink, bar: '#000000', a0: 0.15, a1: 0.05 },
  dark: { word: C.white, bar: '#FFFFFF', a0: 0.3, a1: 0.1 },
};

const r = (n) => Math.round(n * 100) / 100;
const pts = (poly, dx = 0, dy = 0, s = 1) => poly.map(([x, y]) => `${r((x + dx) * s)},${r((y + dy) * s)}`).join(' ');

let gid = 0;
function grads(theme) {
  const t = THEME[theme];
  const id = ++gid;
  return {
    id,
    defs:
      `<linearGradient id="m${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.bar}" stop-opacity="${t.a0}"/><stop offset="1" stop-color="${t.bar}" stop-opacity="${t.a1}"/></linearGradient>` +
      `<linearGradient id="a${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.lime}"/><stop offset="1" stop-color="${C.limeDeep}"/></linearGradient>`,
  };
}
const sygnetPolys = (g, dx, dy, s) =>
  SYGNET.map((p, i) => `<polygon points="${pts(p, dx, dy, s)}" fill="url(#${i === 1 ? 'a' : 'm'}${g.id})"/>`).join('');

// ---------------------------------------------------------------- wordmark na krzywych
const inter = opentype.loadSync(path.join(ROOT, 'scripts/fonts/Inter-Bold.ttf'));
function wordmark(text = 'Workshift', size = 140, tracking = -0.04) {
  const scale = size / inter.unitsPerEm;
  const glyphs = inter.stringToGlyphs(text);
  let x = 0;
  const parts = [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  glyphs.forEach((g, i) => {
    const p = g.getPath(x, 0, size);
    const bb = p.getBoundingBox();
    if (bb.x1 < bb.x2) { minX = Math.min(minX, bb.x1); minY = Math.min(minY, bb.y1); maxX = Math.max(maxX, bb.x2); maxY = Math.max(maxY, bb.y2); }
    parts.push(p.toPathData(2));
    x += g.advanceWidth * scale + tracking * size;
    if (i < glyphs.length - 1) x += inter.getKerningValue(g, glyphs[i + 1]) * scale;
  });
  return { d: parts.join(''), minX, minY, maxX, maxY };
}
const WM = wordmark();

// lockup poziomy: układ jak w public/brand-assets/logo-light.svg (sygnet scale .6 @50,50; tekst x=350, baseline 240)
function logoHorizontal(theme) {
  const g = grads(theme);
  const sx0 = 50 + 103 * 0.6, sy0 = 50 + 141 * 0.6, sx1 = 50 + 422 * 0.6, sy1 = 50 + 397 * 0.6;
  const x0 = Math.min(sx0, 350 + WM.minX), y0 = Math.min(sy0, 240 + WM.minY);
  const x1 = Math.max(sx1, 350 + WM.maxX), y1 = Math.max(sy1, 240 + WM.maxY);
  const w = r(x1 - x0), h = r(y1 - y0);
  return svg(w, h, `<defs>${g.defs}</defs>` +
    `<g transform="translate(${r(50 - x0)} ${r(50 - y0)}) scale(0.6)">${sygnetPolys(g, 0, 0, 1)}</g>` +
    `<path transform="translate(${r(350 - x0)} ${r(240 - y0)})" fill="${THEME[theme].word}" d="${WM.d}"/>`);
}

// lockup pionowy: sygnet nad wordmarkiem, wyśrodkowane; odstęp = wysokość jednej warstwy
function logoStacked(theme) {
  const g = grads(theme);
  const s = 0.6, sw = 319 * s, sh = 256 * s; // ta sama skala sygnetu co w logo poziomym
  const ww = WM.maxX - WM.minX, wh = WM.maxY - WM.minY;
  const w = Math.max(sw, ww), gap = BAR.h * s;
  const h = sh + gap + wh;
  return svg(r(w), r(h), `<defs>${g.defs}</defs>` +
    `<g transform="translate(${r((w - sw) / 2)} 0) scale(${s})">${sygnetPolys(g, -103, -141, 1)}</g>` +
    `<path transform="translate(${r((w - ww) / 2 - WM.minX)} ${r(sh + gap - WM.minY)})" fill="${THEME[theme].word}" d="${WM.d}"/>`);
}

function sygnetSvg(theme) {
  const g = grads(theme);
  return svg(319, 256, `<defs>${g.defs}</defs>${sygnetPolys(g, -103, -141, 1)}`);
}

// awatar / favicon: sygnet na kwadratowym tle (ten sam układ co public/favicon.svg, ale z tłem)
function avatarSvg(theme, size = 512) {
  const g = grads(theme);
  const bg = theme === 'dark' ? C.ink : C.sage;
  return svg(size, size, `<defs>${g.defs}</defs><rect width="${size}" height="${size}" fill="${bg}"/>` +
    `<g transform="scale(${size / 512}) translate(-6.5 -13)">${sygnetPolys(g, 0, 0, 1)}</g>`);
}

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>\n`;

// ---------------------------------------------------------------- motyw warstw
// Reguła znaku przeniesiona na dekorację: wszystkie warstwy stoją, przesuwa się jedna i tylko ona jest lime.
function bar(x, y, len, h = BAR.h, skew = BAR.skew) {
  return [[x + skew, y], [x + skew + len, y], [x + len, y + h], [x, y + h]];
}
function motif({ n, active, len = BAR.w, shift = BAR.shift }, theme) {
  const g = grads(theme);
  const polys = [];
  for (let i = 0; i < n; i++) {
    const p = bar(i === active ? shift : 0, i * (BAR.h + BAR.gap), len);
    polys.push(`<polygon points="${pts(p)}" fill="url(#${i === active ? 'a' : 'm'}${g.id})"/>`);
  }
  const w = BAR.skew + len + shift, h = n * BAR.h + (n - 1) * BAR.gap;
  return { w, h, inner: `<defs>${g.defs}</defs>${polys.join('')}`, svg: svg(w, h, `<defs>${g.defs}</defs>${polys.join('')}`) };
}
const MOTIFS = [
  { slug: '01-warstwy', n: 3, active: 1, title: 'Warstwy', desc: 'Geometria sygnetu bez napisu. Duży element przycięty krawędzią formatu.' },
  { slug: '02-warstwy-5', n: 5, active: 2, title: 'Pięć warstw', desc: 'Gęstszy stos do formatów pionowych i plansz tytułowych.' },
  { slug: '03-pasy', n: 3, active: 1, len: BAR.w * 4, shift: BAR.shift * 2, title: 'Pasy', desc: 'Wydłużone warstwy do banerów i nagłówków maili.' },
  { slug: '04-kolumna', n: 7, active: 4, title: 'Kolumna', desc: 'Wysoki stos przy krawędzi stories i slajdów.' },
  { slug: '05-akcent', n: 1, active: 0, shift: 0, title: 'Akcent', desc: 'Pojedyncza warstwa lime: znacznik, podkreślenie, punkt na osi.' },
];

// ---------------------------------------------------------------- szablony social (tło + motyw + logo, bez tekstu)
const TEMPLATES = [
  { slug: 'og-1200x630', w: 1200, h: 630, title: 'Open Graph / link' },
  { slug: 'post-1080x1080', w: 1080, h: 1080, title: 'Post kwadratowy' },
  { slug: 'post-1080x1350', w: 1080, h: 1350, title: 'Post pionowy 4:5' },
  { slug: 'story-1080x1920', w: 1080, h: 1920, title: 'Story / Reels 9:16' },
  { slug: 'banner-1584x396', w: 1584, h: 396, title: 'Baner LinkedIn' },
  { slug: 'slide-1920x1080', w: 1920, h: 1080, title: 'Slajd 16:9' },
];
function template({ w, h }, theme) {
  const bg = theme === 'dark' ? C.ink : C.sage;
  const tall = h > w * 1.2, wide = w > h * 2.5;
  const m = motif(tall ? { n: 7, active: 4 } : { n: 3, active: 1 }, theme);
  // motyw przycięty prawą krawędzią, ~45% wysokości formatu (baner: ~110%)
  const target = wide ? h * 1.1 : tall ? h * 0.5 : h * 0.62;
  const s = target / m.h;
  const mx = w - m.w * s * 0.72, my = wide ? (h - m.h * s) / 2 : tall ? h * 0.12 : (h - m.h * s) / 2;
  // logo lewy dolny róg, margines = 6% krótszego boku
  const margin = Math.round(Math.min(w, h) * (wide ? 0.12 : 0.074));
  const logoH = Math.round(Math.min(w, h) * (wide ? 0.11 : 0.05));
  const lg = grads(theme);
  // lockup w układzie 1200x400 -> skala do logoH (wysokość sygnetu 153.6)
  const ls = logoH / 153.6;
  const lx = margin - (50 + 103 * 0.6) * ls, ly = h - margin - (50 + 397 * 0.6) * ls;
  return svg(w, h,
    `<rect width="${w}" height="${h}" fill="${bg}"/>` +
    `<g transform="translate(${r(mx)} ${r(my)}) scale(${r(s * 1000) / 1000})">${m.inner}</g>` +
    `<defs>${lg.defs}</defs><g transform="translate(${r(lx)} ${r(ly)}) scale(${r(ls * 10000) / 10000})">` +
    `<g transform="translate(50 50) scale(0.6)">${sygnetPolys(lg, 0, 0, 1)}</g>` +
    `<path transform="translate(350 240)" fill="${THEME[theme].word}" d="${WM.d}"/></g>`);
}

// ---------------------------------------------------------------- pliki tokenów
function tokensCss() {
  const lines = ['/* Workshift - tokeny. Generowane przez scripts/brand-kit/build.mjs; nie edytuj ręcznie. */', ':root {'];
  for (const [k, [v]] of Object.entries(T.color)) lines.push(`  --ws-${k}: ${v};`);
  lines.push('', '  /* linie i tekst na czarnym */');
  lines.push(`  --ws-line: ${LINES.line};`, `  --ws-line-strong: ${LINES.lineStrong};`, `  --ws-line-on-ink: ${LINES.lineOnInk};`);
  lines.push(`  --ws-on-ink-body: ${LINES.onInkBody};`, `  --ws-on-ink-label: ${LINES.onInkLabel};`);
  lines.push('', '  /* gradient - wyłącznie w sygnecie i przesuniętej warstwie motywu */');
  lines.push(`  --ws-gradient-lime: linear-gradient(90deg, ${C.lime}, ${C.limeDeep});`);
  lines.push('', '  /* pisma */', `  --ws-font-sans: ${T.font.sans};`, `  --ws-font-mono: ${T.font.mono};`);
  lines.push('', '  /* promienie */');
  for (const [k, v] of Object.entries(T.radius)) lines.push(`  --ws-radius-${k}: ${v};`);
  lines.push('', '  /* układ */');
  for (const [k, v] of Object.entries(T.space)) lines.push(`  --ws-space-${k}: ${v};`);
  lines.push('', '  /* ruch */');
  for (const [k, v] of Object.entries(T.motion)) lines.push(`  --ws-${k}: ${v};`);
  lines.push('}', '@media (max-width: 767px) { :root { --ws-space-gutter: 16px; --ws-space-section: 80px; } }', '');
  return lines.join('\n');
}
function tokensJson() {
  const out = { $description: `Workshift design tokens ${VERSION} (format W3C Design Tokens)`, color: {}, dimension: {}, fontFamily: {}, duration: {}, cubicBezier: {} };
  for (const [k, [v, d]] of Object.entries(T.color)) out.color[k] = { $type: 'color', $value: v, $description: d };
  for (const [k, v] of Object.entries(T.radius)) out.dimension[`radius-${k}`] = { $type: 'dimension', $value: v };
  for (const [k, v] of Object.entries(T.space)) out.dimension[`space-${k}`] = { $type: 'dimension', $value: v };
  out.fontFamily.sans = { $type: 'fontFamily', $value: ['Inter', 'system-ui', 'sans-serif'] };
  out.fontFamily.mono = { $type: 'fontFamily', $value: ['IBM Plex Mono', 'ui-monospace', 'monospace'] };
  out.duration.fast = { $type: 'duration', $value: T.motion['dur-fast'] };
  out.duration.enter = { $type: 'duration', $value: T.motion['dur-enter'] };
  out.cubicBezier.ease = { $type: 'cubicBezier', $value: [0.21, 0.47, 0.32, 0.98] };
  return JSON.stringify(out, null, 2) + '\n';
}
function tailwindV4() {
  return `/* Workshift - Tailwind v4. Wklej po @import "tailwindcss"; */
@theme {
  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
${Object.entries(T.color).map(([k, [v]]) => `  --color-${k}: ${v};`).join('\n')}
  --radius-card: ${T.radius.card};
  --radius-panel: ${T.radius.panel};
  --container-site: ${T.space.container};
}
`;
}
function tailwindV3() {
  return `// Workshift - preset Tailwind v3. module.exports = { presets: [require('./tailwind.preset.js')] }
module.exports = {
  theme: {
    extend: {
      colors: {
${Object.entries(T.color).map(([k, [v]]) => `        '${k}': '${v}',`).join('\n')}
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: { card: '${T.radius.card}', panel: '${T.radius.panel}' },
      maxWidth: { site: '${T.space.container}' },
      transitionTimingFunction: { ws: '${T.motion.ease}' },
    },
  },
};
`;
}

// DESIGN.md: front matter YAML (standard google-labs-code/design.md) generowany z tokenów + treść ręczna
function designMd() {
  const y = [];
  y.push('---', 'version: alpha', 'name: Workshift', 'description: >-',
    '  System wizualny Workshift (workshift.pl), butikowego doradztwa AI dla polskich MŚP.',
    '  Jasna baza sage, czarny tekst, jeden akcent lime. Inter mówi, IBM Plex Mono opisuje.',
    '  Jedyny motyw graficzny to warstwy z sygnetu: stoją wszystkie, przesuwa się jedna.');
  y.push('colors:');
  for (const [k, [v]] of Object.entries(T.color)) y.push(`  ${k}: "${v}"`);
  y.push('  primary: "{colors.lime}"', '  on-primary: "{colors.ink}"', '  background: "{colors.sage}"', '  on-background: "{colors.ink}"',
    '  on-background-muted: "{colors.muted-dark}"', '  surface: "{colors.white}"', '  inverse-background: "{colors.ink}"', '  on-inverse: "{colors.white}"',
    `  line: "${LINES.line}"`, `  line-strong: "${LINES.lineStrong}"`, `  line-on-ink: "${LINES.lineOnInk}"`);
  const ty = {
    display: ['Inter', '96px', 400, 1.02, '-0.04em'],
    'headline-lg': ['Inter', '72px', 400, 1.05, '-0.05em'],
    'headline-md': ['Inter', '48px', 400, 1.1, '-0.025em'],
    'headline-sm': ['Inter', '30px', 400, 1.2, '-0.02em'],
    title: ['Inter', '20px', 500, 1.3, '-0.01em'],
    'body-lg': ['Inter', '18px', 400, 1.6, '0'],
    'body-md': ['Inter', '16px', 400, 1.6, '0'],
    'body-sm': ['Inter', '14px', 400, 1.55, '0'],
    numeral: ['IBM Plex Mono', '56px', 400, 1, '-0.02em'],
    label: ['IBM Plex Mono', '11px', 400, 1.4, '0.2em'],
    meta: ['IBM Plex Mono', '12px', 400, 1.6, '0.08em'],
    'graphic-headline': ['Inter', '96px', 800, 0.98, '-0.03em'],
    wordmark: ['Inter', '140px', 700, 1, '-0.04em'],
  };
  y.push('typography:');
  for (const [k, [f, s, w, lh, ls]] of Object.entries(ty)) y.push(`  ${k}:`, `    fontFamily: ${f}`, `    fontSize: ${s}`, `    fontWeight: ${w}`, `    lineHeight: ${lh}`, `    letterSpacing: ${ls}`);
  y.push('rounded:');
  for (const [k, v] of Object.entries(T.radius)) y.push(`  ${k}: ${v}`);
  y.push('spacing:');
  for (const [k, v] of Object.entries(T.space)) y.push(`  ${k}: ${v}`);
  y.push('components:',
    '  button-primary:', '    backgroundColor: "{colors.ink}"', '    textColor: "{colors.white}"', '    typography: "{typography.title}"', '    rounded: "{rounded.pill}"', '    padding: 8px 8px 8px 20px',
    '  button-primary-hover:', '    backgroundColor: "{colors.ink}"', '    textColor: "{colors.lime}"',
    '  button-accent:', '    backgroundColor: "{colors.lime}"', '    textColor: "{colors.ink}"', '    rounded: "{rounded.pill}"', '    padding: 12px 22px',
    '  button-outline:', '    backgroundColor: transparent', '    textColor: "{colors.ink}"', '    rounded: "{rounded.pill}"', '    padding: 12px 22px',
    '  card:', '    backgroundColor: "{colors.white}"', '    textColor: "{colors.ink}"', '    rounded: "{rounded.card}"', '    padding: 32px',
    '  card-dark:', '    backgroundColor: "{colors.ink}"', '    textColor: "{colors.white}"', '    rounded: "{rounded.panel}"', '    padding: 56px',
    '  kicker:', '    textColor: "{colors.muted-dark}"', '    typography: "{typography.label}"',
    '  tag:', '    backgroundColor: "{colors.lime}"', '    textColor: "{colors.ink}"', '    typography: "{typography.label}"', '    rounded: "{rounded.pill}"', '    padding: 4px 12px',
    '  stat-tile:', '    backgroundColor: "{colors.sage}"', '    textColor: "{colors.ink}"', '    typography: "{typography.numeral}"', '    rounded: "{rounded.none}"', '    padding: 28px',
    '---', '');
  return y.join('\n') + fs.readFileSync(path.join(SRC, 'DESIGN.body.md'), 'utf8');
}

// ---------------------------------------------------------------- zapis
const files = []; // manifest
function write(rel, content, meta) {
  const p = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
  if (meta) files.push({ file: rel, size: Buffer.byteLength(content), ...meta });
}
async function png(rel, svgStr, width, meta) {
  const p = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  await sharp(Buffer.from(svgStr), { density: 300 }).resize({ width }).png({ compressionLevel: 9 }).toFile(p);
  const { size } = fs.statSync(p);
  const { height } = await sharp(p).metadata();
  if (meta) files.push({ file: rel, size, w: width, h: height, ...meta });
}
const dims = (s) => { const m = s.match(/width="([\d.]+)" height="([\d.]+)"/); return { w: +m[1], h: +m[2] }; };

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const ON = { light: 'na jasne tła (sage, białe)', dark: 'na ciemne tła (czarne)' };
for (const theme of ['light', 'dark']) {
  const h = logoHorizontal(theme), s = logoStacked(theme), sy = sygnetSvg(theme), av = avatarSvg(theme);
  write(`logo/ws-logo-${theme}.svg`, h, { cat: 'logo', title: `Logo poziome · ${theme}`, desc: `Podstawowa wersja znaku, ${ON[theme]}.`, ...dims(h) });
  write(`logo/ws-logo-stacked-${theme}.svg`, s, { cat: 'logo', title: `Logo pionowe · ${theme}`, desc: `Sygnet nad napisem, do formatów kwadratowych i pionowych, ${ON[theme]}.`, ...dims(s) });
  write(`logo/ws-sygnet-${theme}.svg`, sy, { cat: 'logo', title: `Sygnet · ${theme}`, desc: `Sam znak, gdy nazwa stoi obok albo jest oczywista z kontekstu, ${ON[theme]}.`, ...dims(sy) });
  write(`logo/ws-avatar-${theme}.svg`, av, { cat: 'logo', title: `Awatar · ${theme}`, desc: 'Sygnet na kwadratowym tle: profile, aplikacje, favicon.', ...dims(av) });
  await png(`logo/png/ws-logo-${theme}-1600.png`, h, 1600, { cat: 'png', title: `Logo poziome PNG · ${theme}` });
  await png(`logo/png/ws-logo-stacked-${theme}-1200.png`, s, 1200, { cat: 'png', title: `Logo pionowe PNG · ${theme}` });
  await png(`logo/png/ws-sygnet-${theme}-1024.png`, sy, 1024, { cat: 'png', title: `Sygnet PNG · ${theme}` });
  await png(`logo/png/ws-avatar-${theme}-1024.png`, av, 1024, { cat: 'png', title: `Awatar PNG · ${theme}` });
}
for (const sz of [32, 180, 512]) await png(`logo/png/ws-favicon-${sz}.png`, avatarSvg('light'), sz, { cat: 'png', title: `Favicon ${sz} px` });

for (const m of MOTIFS) for (const theme of ['light', 'dark']) {
  const mm = motif(m, theme);
  write(`motifs/ws-motif-${m.slug}-${theme}.svg`, mm.svg, { cat: 'motif', title: `${m.title} · ${theme}`, desc: m.desc, w: mm.w, h: mm.h });
}
for (const t of TEMPLATES) for (const theme of ['light', 'dark']) {
  const s = template(t, theme);
  write(`templates/ws-bg-${t.slug}-${theme}.svg`, s, { cat: 'template', title: `${t.title} · ${theme}`, desc: 'Tło z motywem warstw i logo. Tekst dodajesz w lewej części.', w: t.w, h: t.h });
  await png(`templates/png/ws-bg-${t.slug}-${theme}.png`, s, t.w, { cat: 'template-png', title: `${t.title} PNG · ${theme}` });
}

write('tokens.css', tokensCss(), { cat: 'code', title: 'tokens.css', desc: 'Zmienne CSS --ws-*' });
write('tokens.json', tokensJson(), { cat: 'code', title: 'tokens.json', desc: 'Tokeny w formacie W3C Design Tokens' });
write('tailwind-theme.css', tailwindV4(), { cat: 'code', title: 'tailwind-theme.css', desc: 'Blok @theme dla Tailwind v4' });
write('tailwind.preset.js', tailwindV3(), { cat: 'code', title: 'tailwind.preset.js', desc: 'Preset dla Tailwind v3' });

const fontFaces = fs.readFileSync(path.join(SRC, 'components.css'), 'utf8');
write('ws.css', `/* Workshift - ws.css: pisma + tokeny + komponenty (.wsk-*). Generowane przez scripts/brand-kit/build.mjs. */\n${fontFaces.split('/* @@TOKENS@@ */')[0]}${tokensCss()}${fontFaces.split('/* @@TOKENS@@ */')[1]}`, { cat: 'code', title: 'ws.css', desc: 'Pisma, tokeny i klasy komponentów .wsk-*' });
fs.mkdirSync(path.join(OUT, 'fonts'), { recursive: true });
for (const f of fs.readdirSync(path.join(ROOT, 'public/fonts'))) fs.copyFileSync(path.join(ROOT, 'public/fonts', f), path.join(OUT, 'fonts', f));

write('DESIGN.md', designMd(), { cat: 'doc', title: 'DESIGN.md', desc: 'Zasady i tokeny dla ludzi i agentów AI' });
for (const f of ['ws-email.html']) write(`templates/${f}`, fs.readFileSync(path.join(SRC, f), 'utf8'), { cat: 'template', title: 'Szablon maila', desc: 'Tabele + style inline, 600 px, logo w PNG.' });
if (fs.existsSync(path.join(SRC, 'VOICE.md'))) write('VOICE.md', fs.readFileSync(path.join(SRC, 'VOICE.md'), 'utf8'), { cat: 'doc', title: 'VOICE.md', desc: 'Głos marki: jak piszemy' });
write('README.txt', fs.readFileSync(path.join(SRC, 'README.txt'), 'utf8').replaceAll('@@VERSION@@', VERSION).replaceAll('@@DATE@@', DATE));
write('manifest.json', JSON.stringify(files, null, 1) + '\n');
write('index.html', fs.readFileSync(path.join(SRC, 'index.html'), 'utf8').replaceAll('@@VERSION@@', VERSION).replaceAll('@@DATE@@', DATE));

// ZIP (bez index.html - przewodnik żyje online)
const zipName = 'workshift-brand-kit.zip';
execFileSync('zip', ['-qr', zipName, '.', '-x', 'index.html', '-x', zipName, '-x', '.DS_Store'], { cwd: OUT });

// kontrola typografii: zero em/en dashy w tekstach paczki
let bad = 0;
for (const f of ['DESIGN.md', 'README.txt', 'index.html', 'ws.css', 'templates/ws-email.html', 'VOICE.md']) {
  const p = path.join(OUT, f);
  if (fs.existsSync(p)) { const n = (fs.readFileSync(p, 'utf8').match(/[–—]/g) || []).length; if (n) { console.error(`  ${f}: ${n} pauz`); bad += n; } }
}
console.log(`brand kit ${VERSION}: ${files.length} plików w manifeście -> public/brand/ (${(fs.statSync(path.join(OUT, zipName)).size / 1024).toFixed(0)} KB zip)`);
if (bad) { console.error(`BŁĄD: ${bad} em/en dashy w paczce`); process.exit(1); }
