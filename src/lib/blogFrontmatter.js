/**
 * Plik wpisu bloga (content/blog/<slug>.md): frontmatter między liniami `---`, potem treść.
 *
 * Frontmatter to płaskie pary `klucz: wartość`, jedna na linię. Wartość w cudzysłowie jest
 * stringiem JSON (tak zapisuje się tytuły z dwukropkiem czy cudzysłowem), bez cudzysłowu
 * zostaje jak jest. Celowo bez biblioteki YAML: ten plik działa i w przeglądarce
 * (leniwa treść wpisu), i w Node (build SEO, wtyczka Vite).
 */
export function parseBlogFile(text, file = 'wpis') {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!match) throw new Error(`${file}: brak frontmattera między liniami ---`);

  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const sep = line.indexOf(':');
    if (sep < 1) throw new Error(`${file}: zła linia frontmattera "${line}"`);
    const key = line.slice(0, sep).trim();
    const raw = line.slice(sep + 1).trim();
    meta[key] = raw.startsWith('"') ? JSON.parse(raw) : raw;
  }
  return { meta, content: match[2] };
}

/** Pola wymagane w każdym wpisie. */
export const REQUIRED_POST_FIELDS = ['slug', 'title', 'category', 'date', 'excerpt', 'image', 'author'];
