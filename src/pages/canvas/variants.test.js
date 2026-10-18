// Test pokrycia płótna: node --test src/pages/canvas/ (npm run test:canvas).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { CANVAS_GROUPS, GROUP_IDS, UI_FILES } from './variants.js';

const uiDir = new URL('../../components/ui/', import.meta.url);
const samples = readFileSync(new URL('./samples.jsx', import.meta.url), 'utf8');

test('każdy plik z src/components/ui/ jest na liście płótna', () => {
  const onDisk = readdirSync(uiDir).filter((f) => f.endsWith('.jsx')).sort();
  assert.deepEqual([...UI_FILES].sort(), onDisk);
});

test('każdy plik z listy ma grupę', () => {
  const covered = new Set(CANVAS_GROUPS.flatMap((g) => g.files));
  for (const file of UI_FILES) assert.ok(covered.has(file), `brak grupy dla ${file}`);
});

test('id grup i porównań są unikalne, każde porównanie ma warianty', () => {
  assert.equal(new Set(GROUP_IDS).size, GROUP_IDS.length);
  for (const group of CANVAS_GROUPS) {
    assert.ok(group.comparisons.length > 0, `${group.id}: brak porównań`);
    const ids = group.comparisons.map((c) => c.id);
    assert.equal(new Set(ids).size, ids.length, `${group.id}: powtórzone id porównania`);
    for (const comparison of group.comparisons) {
      const variants = comparison.variants.map((v) => v.id);
      assert.ok(variants.length > 0, `${group.id}/${comparison.id}: brak wariantów`);
      assert.equal(new Set(variants).size, variants.length, `${group.id}/${comparison.id}: powtórzony wariant`);
      assert.ok([0, 1, 2, 3].includes(group.column), `${group.id}: kolumna poza zakresem`);
    }
  }
});

test('każde porównanie ma renderer w samples.jsx', () => {
  for (const group of CANVAS_GROUPS) {
    const start = samples.indexOf(`'${group.id}': {`);
    assert.ok(start >= 0, `samples.jsx: brak grupy '${group.id}'`);
    const block = samples.slice(start, samples.indexOf('\n  },', start));
    for (const comparison of group.comparisons) {
      assert.ok(block.includes(`'${comparison.id}':`), `samples.jsx: brak '${group.id}/${comparison.id}'`);
    }
  }
});

test('teksty płótna bez pauzy i półpauzy', () => {
  const files = ['variants.js', 'samples.jsx', 'CanvasGroup.jsx', 'CanvasShell.jsx', 'CanvasPage.jsx', 'useCanvasCamera.js', 'cameraMath.js'];
  for (const file of files) {
    const text = readFileSync(new URL(`./${file}`, import.meta.url), 'utf8');
    assert.ok(!/[\u2013\u2014]/.test(text), `${file}: pauza lub półpauza`);
  }
});
