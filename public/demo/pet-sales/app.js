/* PET Sales - makieta koncepcyjna (vanilla JS, bez buildu). */
(() => {
  const D = window.DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const NB = ' ';
  const money = (v, cur) => (v == null ? '-' : new Intl.NumberFormat('pl-PL').format(v).replace(/\s/g, NB) + NB + (cur || ''));
  const pct = v => v == null ? '-' : v.toFixed(1).replace('.', ',') + '%';
  const dt = s => { if (!s) return '-'; const [y, m, d] = s.slice(0, 10).split('-'); return `${d}.${m}.${y}`; };
  const idToUrl = id => id.replace(/\//g, '-');
  const urlToId = u => u.replace(/-/g, '/');
  const cust = id => D.customers.find(c => c.id === id);
  const PLN = { PL: 'Polska', DE: 'Niemcy', HR: 'Chorwacja', NL: 'Holandia', CZ: 'Czechy', LT: 'Litwa', SE: 'Szwecja', RO: 'Rumunia', UA: 'Ukraina', AT: 'Austria', SK: 'Słowacja', HU: 'Węgry', LV: 'Łotwa', EE: 'Estonia', FI: 'Finlandia', NO: 'Norwegia', DK: 'Dania', BE: 'Belgia', LU: 'Luksemburg', FR: 'Francja', CH: 'Szwajcaria', IT: 'Włochy', SI: 'Słowenia', BA: 'Bośnia i Hercegowina', RS: 'Serbia', ME: 'Czarnogóra', AL: 'Albania', MK: 'Macedonia Płn.', XK: 'Kosowo', GR: 'Grecja', BG: 'Bułgaria', MD: 'Mołdawia', BY: 'Białoruś', RU: 'Rosja', ES: 'Hiszpania', PT: 'Portugalia', GB: 'Wielka Brytania', IE: 'Irlandia', IS: 'Islandia', TR: 'Turcja', CY: 'Cypr', MT: 'Malta' };
  const cname = iso => PLN[iso] || iso;
  const user = id => D.users[id];

  const I = {
    dash: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    inbox: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    pkg: '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    factory: '<path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    chart: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    map: '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    spark: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    chevR: '<path d="m9 18 6-6-6-6"/>',
    chevL: '<path d="m15 18-6-6 6-6"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    warn: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    arrowR: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    clip: '<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
    msg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    history: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
    play: '<path d="m5 3 14 9-14 9V3z"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    user: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
    building: '<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>',
    eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
  };
  const ic = (n, s = 16) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;
  const tag = (k, label) => `<span class="tag ${k}">${label || { beta: 'Etap 1', e2: 'Etap 2', ms: 'Microsoft 365', ai: 'AI, opcja' }[k]}</span>`;
  const STK = { 'nowe': 'new', 'u inżyniera': 'eng', 'w ofertowaniu': 'quo', 'zaofertowane': 'sent', 'zamknięte': 'done', 'otwarta': 'quo', 'wygrana': 'won', 'przegrana': 'lost', 'w realizacji': 'prog', 'zakończone': 'done', 'w toku': 'prog', 'robocza': 'new', 'wysłana': 'sent' };
  const st = s => `<span class="st ${STK[s] || ''}">${esc(s)}</span>`;

  const state = { role: 'sprzedaz', guide: false, step: 0, revSel: 'R3', tab: {}, filter: {}, started: false };
  const me = () => user(state.role);
  const fin = () => me().fin;
  const LOCK = `<span class="lockpill" title="brak uprawnienia oferta.finanse.odczyt">${'<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'}ukryte</span>`;
  const F = (v, cur) => fin() ? `<span class="mono">${money(v, cur)}</span>` : LOCK;
  const FP = v => fin() ? `<span class="mono">${pct(v)}</span>` : LOCK;

  /* ---------- nav ---------- */
  const NAV = [
    { sect: 'Podstawy' },
    { h: '#/dashboard', l: 'Przegląd', i: 'dash', t: null },
    { h: '#/alerty', l: 'Moje terminy', i: 'bell', t: null, cnt: () => D.alerts.length },
    { sect: 'Sprzedaż' },
    { h: '#/klienci', l: 'Klienci', i: 'users', t: null, cnt: () => D.customers.length },
    { h: '#/zapytania', l: 'Zapytania', i: 'inbox', t: null, cnt: () => D.inquiries.filter(x => x.status !== 'zamknięte').length },
    { h: '#/oferty', l: 'Oferty', i: 'file', t: null, cnt: () => D.offers.filter(o => o.result === 'otwarta').length },
    { sect: 'Realizacja' },
    { h: '#/zlecenia', l: 'Zlecenia', i: 'pkg', t: null },
    { h: '#/realizacja', l: 'Produkcja', i: 'factory', t: null },
    { h: '#/serwis', l: 'Serwis', i: 'wrench', t: 'e2' },
    { sect: 'Analiza i konto' },
    { h: '#/raporty', l: 'Raporty', i: 'chart', t: null },
    { h: '#/admin', l: 'Administracja', i: 'settings', t: null, admin: true },
    { h: '#/zakres', l: 'Mapa zakresu', i: 'map', t: null },
  ];
  function renderNav() {
    const cur = location.hash.split('/').slice(0, 2).join('/') || '#/dashboard';
    $('#nav').innerHTML = NAV.map(n => n.sect ? `<div class="sect">${n.sect}</div>` :
      (n.admin && !me().admin) ? '' :
      `<a href="${n.h}" class="${cur === n.h ? 'active' : ''}" data-nav="${n.h}">${ic(n.i)}<span>${n.l}</span>${n.cnt ? `<span class="cnt">${n.cnt()}</span>` : n.t ? tag(n.t) : ''}</a>`).join('');
    const item = NAV.find(n => n.h === cur) || NAV[1];
    $('#ttl').innerHTML = `${ic(item.i, 18)}<span>${item.l}</span>`;
  }

  /* ---------- shell helpers ---------- */
  function head(o) {
    return `<div class="page-head"><div class="t">
      ${o.crumbs ? `<div class="crumbs">${o.crumbs.map((c, i) => (c.h ? `<a href="${c.h}">${esc(c.l)}</a>` : `<span>${esc(c.l)}</span>`) + (i < o.crumbs.length - 1 ? '<span>/</span>' : '')).join('')}</div>` : ''}
      <h1>${o.title}${(o.tags || []).join('')}</h1>${o.sub ? `<div class="sub">${o.sub}</div>` : ''}</div>
      ${o.actions ? `<div class="actions">${o.actions}</div>` : ''}</div>`;
  }
  const card = (title, body, opts = {}) => `<section class="card" ${opts.spot ? `data-spot="${opts.spot}"` : ''}>${title ? `<div class="hd"><h2>${title}</h2>${opts.tags ? opts.tags.join('') : ''}<div class="right">${opts.right || ''}</div></div>` : ''}<div class="bd ${opts.tight ? 'tight' : ''}">${body}</div></section>`;
  const dl = (rows, c2) => `<dl class="dl ${c2 ? 'c2' : ''}">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;
  const files = list => list.length ? `<div class="files">${list.map(f => `<div class="file"><div class="ic">${esc(f.n.split('.').pop())}</div><span>${esc(f.n)}</span><span class="meta">${esc(f.s)} · ${dt(f.d)}</span></div>`).join('')}</div>` : `<div class="empty">Brak załączników</div>`;
  const locknote = () => fin() ? '' : `<div class="locknote">${ic('lock')}<span>Rola <b>${esc(me().role)}</b> nie ma uprawnienia <span class="mono">oferta.finanse.odczyt</span>. Cena, koszt, marża i roboczogodziny są ukryte.</span></div>`;

  /* ---------- pages ---------- */
  const pages = {};

  pages.dashboard = () => {
    const open = D.inquiries.filter(i => i.status !== 'zamknięte').length;
    const openOffers = D.offers.filter(o => o.result === 'otwarta');
    const portfolio = openOffers.reduce((s, o) => s + o.revisions.at(-1).price * (o.currency === 'PLN' ? 0.235 : 1), 0) / 1e6;
    const won = D.offers.filter(o => o.result === 'wygrana').length, lost = D.offers.filter(o => o.result === 'przegrana').length;
    const P = D.plan2026, lastI = P.real.findLastIndex(v => v != null), ytd = P.real[lastI], ytdPlan = P.plan[lastI];
    const fmt1 = v => v.toFixed(1).replace('.', ',');
    const up = ic('arrowR', 11).replace('viewBox', 'style="transform:rotate(-45deg)" viewBox');

    // plan vs realizacja: linia planu (narastająco) + słupki realizacji miesięcznej + linia realizacji narastająco
    const W = 640, H = 220, L = 36, R = 12, T = 14, B = 30, maxV = 40;
    const x = i => L + i * ((W - L - R) / 11), y = v => T + (H - T - B) * (1 - v / maxV);
    const planPath = P.plan.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');
    const realPts = P.real.map((v, i) => v == null ? null : [x(i), y(v)]).filter(Boolean);
    const realPath = realPts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
    const area = realPath + `L${realPts.at(-1)[0].toFixed(1)},${y(0)}L${realPts[0][0].toFixed(1)},${y(0)}Z`;
    const monthly = P.real.map((v, i) => v == null ? null : v - (i ? P.real[i - 1] : 0));
    const bw = 16;
    const planChart = `<svg class="chart chart2" viewBox="0 0 ${W} ${H}"><defs><linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9531F" stop-opacity=".16"/><stop offset="1" stop-color="#E9531F" stop-opacity="0"/></linearGradient></defs>
      ${[0, 10, 20, 30, 40].map(v => `<line class="grid" x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${v}</text>`).join('')}
      ${monthly.map((v, i) => v == null ? '' : `<rect class="bar mute" x="${x(i) - bw / 2}" y="${y(v)}" width="${bw}" height="${y(0) - y(v)}" style="animation-delay:${i * 40}ms"/>`).join('')}
      <path class="area" d="${area}"/><path class="plan" d="${planPath}"/><path class="real" d="${realPath}"/>
      ${realPts.map((p, i) => i === realPts.length - 1 ? `<circle class="dot" cx="${p[0]}" cy="${p[1]}" r="4"/><text class="lbl" x="${p[0]}" y="${p[1] - 12}" text-anchor="middle">${fmt1(ytd)} mln</text>` : '').join('')}
      <text x="${x(11)}" y="${y(P.plan[11]) - 8}" text-anchor="end">plan ${fmt1(P.plan[11])} mln</text>
      ${P.months.map((m, i) => `<text x="${x(i)}" y="${H - 8}" text-anchor="middle">${m}</text>`).join('')}</svg>
      <div class="legend-inline" style="margin-top:6px"><span><i style="background:var(--accent)"></i>realizacja narastająco</span><span><i style="background:var(--ink-4)"></i>plan roczny</span><span><i style="background:var(--line-2)"></i>zlecenia w miesiącu</span></div>`;

    // handlowcy: poziome słupki z planem
    const maxRep = Math.max(...D.reps.map(r => Math.max(r.value, r.plan)));
    const reps = `<div class="hbars">${[...D.reps].sort((a, b) => b.value - a.value).map(r => { const u = user(r.id); return `<div class="hbar"><div class="who"><div class="avatar">${u.ini}</div><div style="min-width:0"><span>${esc(u.name)}</span><small>${r.units} jedn. · ${r.won} wygrane, ${r.lost} przegrane</small></div></div><div class="track"><i style="--w:${(r.value / maxRep).toFixed(3)}"></i><i class="plan" style="--w:${(r.plan / maxRep).toFixed(3)}"></i></div><div class="val">${fmt1(r.value)} mln<small>plan ${fmt1(r.plan)} · ${Math.round(r.value / r.plan * 100)}%</small></div></div>`; }).join('')}</div>
      <div class="legend-inline" style="margin-top:14px"><span><i style="background:var(--accent)"></i>zlecenia YTD, mln EUR</span><span><i style="width:2px;height:10px;border-right:2px dashed var(--ink-4);background:none"></i>plan roczny</span></div>`;

    // mapa Europy
    const C = D.countries, maxC = Math.max(...Object.values(C).map(c => c.v));
    const lvl = iso => { const c = C[iso]; if (!c) return 'l0'; if (c.v === 0) return 'l1'; const r = c.v / maxC; return r > .6 ? 'l4' : r > .25 ? 'l3' : r > .08 ? 'l2' : 'l1'; };
    const map = `<div class="map-wrap"><svg class="map" viewBox="20 95 ${EUROPE.w - 40} ${EUROPE.h - 200}">${EUROPE.countries.map(c => `<path class="${lvl(c.iso)}" data-iso="${c.iso}" data-name="${esc(cname(c.iso))}" d="${c.d}"/>`).join('')}</svg><div class="tip" id="mapTip"></div></div>
      <div class="map-legend"><span>brak</span><i style="background:#EAEAE6"></i><i style="background:#F8D7C8"></i><i style="background:#F3B497"></i><i style="background:#EC8E62"></i><i style="background:var(--accent)"></i><span>${fmt1(maxC)} mln EUR</span><span style="margin-left:auto">najedź na kraj</span></div>`;
    const topC = Object.entries(C).filter(([, c]) => c.v > 0).sort((a, b) => b[1].v - a[1].v).slice(0, 5);
    const topList = `<div class="map-top">${topC.map(([iso, c]) => `<div class="r"><span class="iso">${iso}</span><div><div style="display:flex;justify-content:space-between"><span>${esc(cname(iso))}</span><span class="mono">${fmt1(c.v)} mln</span></div><div class="bar" style="margin-top:4px"><i style="--w:${(c.v / maxC).toFixed(3)}"></i></div></div><span class="muted small">${c.units} jedn.</span></div>`).join('')}</div>`;

    // sektor
    const bySector = D.dict.sektor.map(s => ({ s, w: D.offers.filter(o => o.result === 'wygrana' && cust(o.customer).sector === s).length, l: D.offers.filter(o => o.result === 'przegrana' && cust(o.customer).sector === s).length }));
    const maxS = Math.max(1, ...bySector.map(b => b.w + b.l));
    const sectorChart = `<svg class="chart chart2" viewBox="0 0 520 170">${bySector.map((b, i) => { const x0 = 30 + i * 96, hW = b.w / maxS * 110, hL = b.l / maxS * 110; return `<rect class="bar" style="fill:var(--ok);animation-delay:${i * 60}ms" x="${x0}" y="${140 - hW}" width="30" height="${hW}"/><rect class="bar mute" x="${x0 + 34}" y="${140 - hL}" width="30" height="${hL}" style="animation-delay:${i * 60 + 40}ms"/><text x="${x0 + 32}" y="160" text-anchor="middle">${esc(b.s === 'Eksport bezpośredni' ? 'Eksport' : b.s)}</text>${b.w ? `<text class="lbl" x="${x0 + 15}" y="${134 - hW}" text-anchor="middle">${b.w}</text>` : ''}${b.l ? `<text x="${x0 + 49}" y="${134 - hL}" text-anchor="middle">${b.l}</text>` : ''}`; }).join('')}<line class="grid" x1="20" y1="140.5" x2="510" y2="140.5" style="stroke-dasharray:none"/></svg><div class="legend-inline"><span><i style="background:var(--ok)"></i>wygrane</span><span><i style="background:var(--line-2)"></i>przegrane</span></div>`;

    const kpi = (icn, cls, label, value, unit, foot) => `<div class="card kpi2"><div class="l"><span class="ic ${cls}">${ic(icn)}</span>${label}</div><div class="v">${value}${unit ? `<small>${unit}</small>` : ''}</div><div class="f">${foot}</div></div>`;
    return head({ title: `Dzień dobry, ${esc(me().name.split(' ')[0])}`, sub: 'Stan na 24.09.2026. Liczby liczą się z rejestrów, nie z osobnych arkuszy.', actions: `<div class="filters"><button class="chip on" data-toast="Zakres dat: rok 2026 narastająco.">Rok 2026</button><button class="chip" data-toast="Zakres dat: ostatnie 30 dni.">30 dni</button><span class="sep"></span><button class="chip on" data-toast="Widok całego działu.">Cały dział</button><button class="chip" data-toast="Tylko sprawy, których jesteś właścicielem.">Mój portfel</button></div><button class="btn" data-csv="dashboard">${ic('download')}CSV</button>` }) +
      `<div class="grid g4" data-spot="kpi">
        ${kpi('pkg', 'acc', 'Zlecenia 2026', `<span data-count="${ytd}" data-dec="1">0</span>`, 'mln EUR', `<span class="delta ${ytd >= ytdPlan ? 'up' : 'down'}">${ytd >= ytdPlan ? '+' : ''}${fmt1(ytd - ytdPlan)} mln</span> vs plan ${fmt1(ytdPlan)} po ${P.months[lastI].toLowerCase()}`)}
        ${kpi('file', 'info', 'Portfel ofert otwartych', `<span data-count="${portfolio.toFixed(1)}" data-dec="1">0</span>`, 'mln EUR', `${openOffers.length} oferty, 2 w negocjacjach · ${fin() ? 'marża <span class="mono">22,8%</span>' : LOCK}`)}
        ${kpi('inbox', '', 'Otwarte zapytania', `<span data-count="${open}">0</span>`, '', `1 nowe, 1 u inżyniera, 1 w ofertowaniu`)}
        ${kpi('check', 'ok', 'Skuteczność ofert', `<span data-count="${Math.round(won / (won + lost) * 100)}">0</span>`, '%', `<span class="delta up">${up} +6 pp</span> vs 2025 · ${won} wygrane, ${lost} przegrane`)}
      </div>
      <div class="sect-h"><h2>Wyniki</h2><span class="m">plan roczny 38,4 mln EUR, przeliczenie z PLN po kursie NBP</span></div>
      <div class="grid" style="grid-template-columns:minmax(0,1.7fr) minmax(0,1fr)">
        ${card('Plan vs realizacja 2026', planChart, { right: `<span class="muted small">narastająco, mln EUR</span>`, spot: 'plan' })}
        ${card('Sprzedaż per handlowiec', reps, { right: `<button class="chip on" data-toast="Wartość zleceń podpisanych w 2026.">wartość</button><button class="chip" data-toast="Liczba jednostek.">jednostki</button>`, spot: 'reps' })}
      </div>
      <div class="sect-h"><h2>Rynki</h2><span class="m">gdzie sprzedajemy i gdzie przegrywamy</span></div>
      <div class="grid" style="grid-template-columns:minmax(0,1.25fr) minmax(0,1fr)">
        ${card('Sprzedaż per kraj', map, { right: `<span class="muted small">zlecenia 2026, mln EUR</span>`, spot: 'mapa' })}
        <div class="stack">
          ${card('Największe rynki', topList)}
          ${card('Wygrane i przegrane per sektor', sectorChart, { right: `<div class="filters"><button class="chip on">sektor</button><button class="chip" data-toast="Przekrój: kraj.">kraj</button><button class="chip" data-toast="Przekrój: typ zapytania.">typ</button></div>` })}
        </div>
      </div>
      <div class="sect-h"><h2>Do zrobienia</h2><span class="m">terminy z ofert, zapytań i realizacji</span></div>
      <div class="grid g-main">
        ${card('Moje terminy', `<div class="alerts">${D.alerts.slice(0, 4).map(alertRow).join('')}</div>`, { right: `<a href="#/alerty" class="btn sm ghost">wszystkie ${ic('arrowR', 13)}</a>`, spot: 'alerts' })}
        ${card('Ostatnie zapytania', `<table class="tbl">${D.inquiries.slice(0, 5).map(i => `<tr class="link" data-href="#/zapytania/${idToUrl(i.id)}"><td class="mono">${i.id}</td><td>${esc(cust(i.customer).name.split(' ')[0])} · ${esc(i.project)}</td><td>${st(i.status)}</td></tr>`).join('')}</table>`, { tight: true })}
      </div>`;
  };
  const alertRow = a => `<a class="alert ${a.type}" href="${a.link}" style="text-decoration:none"><div class="ic">${ic(a.type === 'info' ? 'info' : a.type === 'bad' ? 'warn' : 'clock')}</div><div><div>${esc(a.title)}</div><div class="sub">${esc(a.sub)}</div></div><div class="when">${esc(a.when)}</div></a>`;

  pages.klienci = () => head({ title: 'Klienci', tags: [tag('beta')], sub: `${D.customers.length} firm, ${D.customers.reduce((s, c) => s + c.contacts.length, 0)} kontaktów`, actions: `<button class="btn" data-csv="klienci">${ic('download')}CSV</button><button class="btn primary" data-toast="W etapie 1: formularz nowego klienta z walidacją NIP/VAT i deduplikacją.">${ic('plus')}Nowy klient</button>` }) +
    card('', `<table class="tbl"><thead><tr><th>Klient</th><th>Kraj</th><th>Sektor</th><th>Priorytet</th><th>Właściciel</th><th>Ostatni kontakt</th><th class="r">Zapytania</th><th class="r">Zlecenia</th></tr></thead><tbody>${D.customers.map(c => `<tr class="link" data-href="#/klienci/${c.id}"><td><a href="#/klienci/${c.id}">${esc(c.name)}</a></td><td>${c.country}</td><td>${esc(c.sector)}</td><td>${prio(c.prio)}</td><td>${esc(user(c.owner).name)}</td><td class="mono ${c.prio === 'wysoki' && daysSince(c.lastContact) > 120 ? '' : ''}">${dt(c.lastContact)}${c.prio === 'wysoki' && daysSince(c.lastContact) > 120 ? ` <span class="tag bad">${daysSince(c.lastContact)} dni</span>` : ''}</td><td class="r mono">${D.inquiries.filter(i => i.customer === c.id).length}</td><td class="r mono">${D.orders.filter(o => o.customer === c.id).length}</td></tr>`).join('')}</tbody></table>`, { tight: true });
  const daysSince = s => Math.round((new Date('2026-09-24') - new Date(s)) / 864e5);
  const prio = p => `<span class="pr ${esc(p)}">${esc(p)}</span>`;

  pages.klient = id => {
    const c = cust(id); if (!c) return notFound();
    const inq = D.inquiries.filter(i => i.customer === c.id), off = D.offers.filter(o => o.customer === c.id), ord = D.orders.filter(o => o.customer === c.id), ser = D.service.filter(s => s.customer === c.id);
    const tab = state.tab[id] || 'zapytania';
    const tabs = [['zapytania', inq.length], ['oferty', off.length], ['zlecenia', ord.length], ['reklamacje', ser.length], ['spotkania', 3]];
    const body = { zapytania: `<table class="tbl">${inq.map(i => `<tr class="link" data-href="#/zapytania/${idToUrl(i.id)}"><td class="mono">${i.id}</td><td>${esc(i.project)}</td><td class="mono">${dt(i.date)}</td><td>${st(i.status)}</td></tr>`).join('') || '<tr><td class="empty">Brak</td></tr>'}</table>`,
      oferty: `<table class="tbl">${off.map(o => `<tr class="link" data-href="#/oferty/${idToUrl(o.id)}"><td class="mono">${o.id} ${o.revisions.at(-1).r}</td><td>${esc(o.project)}</td><td>${F(o.revisions.at(-1).price, o.currency)}</td><td>${st(o.result)}</td></tr>`).join('') || '<tr><td class="empty">Brak</td></tr>'}</table>`,
      zlecenia: `<table class="tbl">${ord.map(o => `<tr class="link" data-href="#/zlecenia/${idToUrl(o.id)}"><td class="mono">${o.id}</td><td>${esc(o.project)}</td><td class="mono">${dt(o.delivery)}</td><td>${st(o.status)}</td></tr>`).join('') || '<tr><td class="empty">Brak</td></tr>'}</table>`,
      reklamacje: `<table class="tbl">${ser.map(s => `<tr class="link" data-href="#/serwis/${idToUrl(s.id)}"><td class="mono">${s.id}</td><td class="mono">${s.sn}</td><td>${esc(s.desc.slice(0, 60))}...</td><td>${st(s.status)}</td></tr>`).join('') || '<tr><td class="empty">Brak</td></tr>'}</table>`,
      spotkania: `<table class="tbl"><tr><td class="mono">${dt(c.lastContact)}</td><td>Spotkanie w siedzibie klienta, przegląd programu inwestycji</td><td>${esc(user(c.owner).name)}</td></tr><tr><td class="mono">12.02.2026</td><td>Wizyta referencyjna w PET, zwiedzanie hali</td><td>${esc(user(c.owner).name)}</td></tr><tr><td class="mono">21.11.2025</td><td>Targi Energetab, rozmowa na stoisku</td><td>Anna Wiśniewska</td></tr></table>` }[tab];
    const stale = c.prio === 'wysoki' && daysSince(c.lastContact) > 120;
    return head({ crumbs: [{ l: 'Klienci', h: '#/klienci' }, { l: c.name }], title: esc(c.name), tags: [prio(c.prio), tag('beta')], sub: `${esc(c.sector)} · ${esc(c.city)}, ${c.country} · właściciel ${esc(user(c.owner).name)}`, actions: `<button class="btn" data-toast="Historia zmian karty: 14 wpisów (audit log).">${ic('history')}Historia</button><button class="btn primary" data-toast="W etapie 1: nowe zapytanie startuje z wypełnionym klientem i projektem.">${ic('plus')}Nowe zapytanie</button>` }) +
      (stale ? `<div class="e2-note" style="background:var(--bad-soft);border-color:#F1C3BC;color:var(--bad)" data-spot="stale">${ic('warn')}<div><b>Brak kontaktu od ${daysSince(c.lastContact)} dni</b> przy priorytecie wysokim (próg 120 dni). Ostatnie spotkanie ${dt(c.lastContact)}. Alert trafił na listę "moje terminy" właściciela.</div></div>` : '') +
      `<div class="grid g-main"><div class="stack">
        ${card('Dane firmy', dl([['Nazwa', esc(c.name)], ['NIP / VAT', `<span class="mono">${esc(c.nip)}</span>`], ['Kraj', c.country], ['Miasto', esc(c.city)], ['Sektor', esc(c.sector)], ['Priorytet', prio(c.prio)], ['Opis', esc(c.desc)]]))}
        ${card('Historia', `<div class="tabs">${tabs.map(([k, n]) => `<button class="${tab === k ? 'on' : ''}" data-tab="${id}:${k}">${k[0].toUpperCase() + k.slice(1)}<span class="n">${n}</span></button>`).join('')}</div>${body}`, { tight: true, spot: 'ctabs' })}
      </div><div class="stack">
        ${card('Osoby kontaktowe', c.contacts.map(k => `<div style="display:flex;gap:10px;align-items:center;padding:6px 0"><div class="avatar">${k.n.split(' ').map(x => x[0]).join('')}</div><div><div style="font-weight:500">${esc(k.n)}</div><div class="small muted">${esc(k.p)} · ${esc(k.m)} · ${esc(k.t)}</div></div></div>`).join(''), { right: `<button class="btn sm ghost">${ic('plus', 13)}dodaj</button>` })}
        ${card('Projekty i inwestycje', c.projects.length ? c.projects.map(p => `<div style="padding:8px 0;border-bottom:1px solid var(--line)"><div style="font-weight:500">${esc(p.n)}</div><div class="small muted">inwestor ${esc(p.inv)} · ${esc(p.place)}</div><div class="small" style="margin-top:3px">${esc(p.d)}</div></div>`).join('') : '<div class="empty">Brak projektów</div>')}
      </div></div>`;
  };

  pages.zapytania = () => {
    const f = state.filter.inq || 'wszystkie';
    const list = D.inquiries.filter(i => f === 'wszystkie' || i.status === f);
    return head({ title: 'Rejestr zapytań', tags: [tag('beta')], sub: 'Numer nadawany automatycznie, sekwencyjnie per rok. Kanał Teams sprawy zakładany przy rejestracji.', actions: `<button class="btn" data-csv="zapytania">${ic('download')}CSV</button><a href="#/zapytania/nowe" class="btn primary">${ic('plus')}Nowe zapytanie</a>` }) +
      `<div class="filters" style="margin-bottom:12px" data-spot="filters">${['wszystkie', ...D.dict.status_zapytania].map(s => `<button class="chip ${f === s ? 'on' : ''}" data-filter="inq:${s}">${s}${s !== 'wszystkie' ? ` <span class="mono small">${D.inquiries.filter(i => i.status === s).length}</span>` : ''}</button>`).join('')}<span class="muted small" style="margin-left:auto">zapisane widoki: <b>moje otwarte</b>, <b>termin w tym tygodniu</b></span></div>` +
      card('', list.length ? `<table class="tbl"><thead><tr><th>Numer</th><th>Wpływ</th><th>Klient / inwestor</th><th>Projekt</th><th>Pozycje</th><th>Termin oferty</th><th>Termin techn.</th><th>Priorytet</th><th>Status</th><th>Teams</th></tr></thead><tbody>${list.map(i => `<tr class="link" data-href="#/zapytania/${idToUrl(i.id)}"><td><a class="mono" href="#/zapytania/${idToUrl(i.id)}">${i.id}</a></td><td class="mono">${dt(i.date)}</td><td>${esc(cust(i.customer).name.replace(/ sp\. z o\.o\.| S\.A\.| GmbH| AB| d\.d\./, ''))}<div class="small muted">${esc(i.investor)}</div></td><td>${esc(i.project)}</td><td class="mono small">${i.items.map(x => `${x.qty} x ${x.power}`).join(', ') || '-'}</td><td class="mono">${dt(i.deadline)}</td><td class="mono">${dt(i.techDeadline)}</td><td>${prio(i.prio)}</td><td>${st(i.status)}</td><td>${i.teams ? tag('ms', 'kanał') : '<span class="muted small">-</span>'}</td></tr>`).join('')}</tbody></table>` : '<div class="empty">Brak zapytań o tym statusie</div>', { tight: true });
  };

  pages.zapytanie = id => {
    const i = D.inquiries.find(x => x.id === id); if (!i) return notFound();
    const c = cust(i.customer);
    const off = D.offers.filter(o => o.inquiry === i.id);
    return head({ crumbs: [{ l: 'Zapytania', h: '#/zapytania' }, { l: i.id }], title: `<span class="mono">${i.id}</span>`, tags: [st(i.status), prio(i.prio), tag('beta')], sub: `${esc(i.project)} · ${esc(c.name)} dla inwestora ${esc(i.investor)} · wpływ ${dt(i.date)} · ${esc(user(i.owner).name)}`, actions: `<button class="btn" data-toast="Historia zmian: ${i.history.length || 4} wpisy w audit logu.">${ic('history')}Historia</button>${i.status === 'u inżyniera' ? `<button class="btn" data-toast="Bramka: status zmienia się dopiero po odnotowaniu odpowiedzi technicznej.">${ic('check')}Odnotuj odpowiedź techniczną</button>` : ''}${off.length ? `<a class="btn primary" href="#/oferty/${idToUrl(off[0].id)}">Przejdź do oferty ${ic('arrowR')}</a>` : `<button class="btn primary" data-toast="Bramka: ofertę można utworzyć po odpowiedzi technicznej.">${ic('file')}Utwórz ofertę</button>`}` }) +
      `<div class="grid g-main"><div class="stack">
        ${card('Dane zapytania', dl([['Klient', `<a href="#/klienci/${c.id}">${esc(c.name)}</a>`], ['Inwestor końcowy', esc(i.investor)], ['Projekt', esc(i.project)], ['Osoba kontaktowa', esc(i.contact)], ['Źródło', esc(i.source)], ['Typ zapytania', esc(i.type)], ['Kraj dostawy', i.country], ['Sektor rynku', esc(i.sector)], ['Miejsce zainstalowania', esc(i.place)], ['Termin złożenia oferty', `<span class="mono">${dt(i.deadline)}</span>`], ['Termin odp. technicznej', `<span class="mono">${dt(i.techDeadline)}</span>`], ['Komentarz', esc(i.comment || '-')]], true))}
        ${card('Pozycje techniczne', i.items.length ? `<table class="tbl"><thead><tr><th>#</th><th>Moc znamionowa</th><th>Napięcie GN</th><th>Napięcie SN</th><th>Napięcie DN</th><th>Uzwojenia</th><th>Częstotliwość</th><th>Chłodzenie</th><th class="r">Sztuk</th></tr></thead><tbody>${i.items.map((x, n) => `<tr><td class="mono">${n + 1}</td><td class="mono">${x.power}</td><td class="mono">${x.hv}</td><td class="mono">${x.mv}</td><td class="mono">${x.lv}</td><td class="mono">${x.wind}</td><td class="mono">${x.freq}</td><td class="mono">${x.cool}</td><td class="r mono">${x.qty}</td></tr>`).join('')}</tbody></table>` : '<div class="empty">Brak pozycji (części zamienne / serwis)</div>', { tight: true, spot: 'items' })}
        ${card('Historia sprawy', i.history.length ? `<div class="tl">${i.history.map(h => `<div class="it"><div class="dot">${h.who === 'PET Sales' ? ic('spark', 11) : esc(h.who.split(' ').map(x => x[0]).join(''))}</div><div class="t"><b>${esc(h.who)}</b> <span class="when">${esc(h.d)}</span><div class="why">${esc(h.t)}</div></div></div>`).join('')}</div>` : '<div class="empty">Zapytanie zarejestrowane, brak dalszych zdarzeń</div>')}
      </div><div class="stack">
        ${i.teams ? `<div class="teams" data-spot="teams"><div class="h"><span class="ic">T</span>Kanał Teams sprawy ${tag('ms')}<span class="muted small" style="margin-left:auto">${esc(i.teams.team)}</span></div>
          <div class="small muted" style="margin-top:6px">Kanał <b class="mono">${esc(i.teams.channel)}</b> założony automatycznie ${esc(i.teams.created)} przy rejestracji. Ten sam kanał dziedziczą oferta i zlecenie.</div>
          <div class="msg"><div class="av">${esc(user(i.owner).ini)}</div><div><div class="who">${esc(user(i.owner).name)} <span>${esc(i.teams.created)}</span></div><div class="body">Nowe zapytanie <span class="link">${i.id}</span>: ${esc(i.project)}, ${i.items.map(x => `${x.qty} x ${x.power} ${x.hv}/${x.mv}`).join(', ')}. Proszę o odpowiedź techniczną do <b>${dt(i.techDeadline)}</b>. Załączniki w karcie zapytania i w mailu.</div></div></div>
          ${i.history.length > 2 ? `<div class="msg"><div class="av">JK</div><div><div class="who">Jan Kowalczyk (projektowanie elektryczne) <span>22.09 09:12</span></div><div class="body">Wykonalne w standardzie. Straty jałowe 22 kW, obciążeniowe 160 kW, masa całkowita ok. 68 t. OLTC 17 pozycji bez dopłaty do terminu. Monitoring on-line jako opcja, kalkulacja w załączniku.</div></div></div>` : ''}
          <div style="display:flex;gap:8px;margin-top:12px"><button class="btn sm" data-toast="Otwiera kanał w Teams (webUrl z Microsoft Graph).">Otwórz w Teams</button><button class="btn sm ghost" data-toast="Mail Mail.Send ze skrzynki współdzielonej sprzedaz@..., załączniki z Azure Blob.">${ic('mail', 13)}Mail do inżyniera wysłany ${dt(i.date)}</button></div></div>` :
          `<div class="teams"><div class="h"><span class="ic">T</span>Kanał Teams sprawy ${tag('ms')}</div><div class="small muted" style="margin-top:6px">Kanał powstanie po uzupełnieniu terminu odpowiedzi technicznej i kliknięciu "Przekaż do inżynierów".</div><div style="margin-top:10px"><button class="btn sm primary" data-toast="Graph API: kanał w zespole Sprawy 2026 + pierwsza wiadomość z terminem + mail z załącznikami.">Przekaż do inżynierów</button></div></div>`}
        ${card('Załączniki w platformie', files(i.files) + `<div class="small muted" style="margin-top:10px">Pliki w Azure Blob w Waszym tenancie, podpisane linki po sprawdzeniu uprawnień, wersjonowanie, backup.</div>`, { right: `<button class="btn sm ghost">${ic('upload', 13)}dodaj</button>`, spot: 'files' })}
        ${card('Bramki statusu', `<div class="tl">${[['nowe', 'zarejestrowane, numer nadany', true], ['u inżyniera', 'kanał Teams i mail z terminem', true], ['w ofertowaniu', 'odpowiedź techniczna odnotowana', i.status !== 'nowe' && i.status !== 'u inżyniera'], ['zaofertowane', 'rewizja oferty wysłana', ['zaofertowane', 'zamknięte'].includes(i.status)], ['zamknięte', 'wynik oferty wpisany', i.status === 'zamknięte']].map(([s, d, on]) => `<div class="it"><div class="dot ${on ? 'won' : 'draft'}">${on ? ic('check', 11) : ''}</div><div class="t"><b>${s}</b><div class="why">${d}</div></div></div>`).join('')}</div>`)}
      </div></div>`;
  };

  pages.nowe = () => head({ crumbs: [{ l: 'Zapytania', h: '#/zapytania' }, { l: 'Nowe zapytanie' }], title: 'Nowe zapytanie', tags: [tag('beta'), tag('ai')], sub: 'Rejestracja ręczna albo z asystentem RFQ: model czyta PDF i proponuje pola, człowiek akceptuje. Do modelu idzie tylko treść RFQ, nigdy ceny ani marże.' }) +
    `<div class="rfq">
      <div class="stack">
        <section class="card" data-spot="rfq-drop"><div class="hd"><h2>Dokument RFQ</h2>${tag('ai')}</div><div class="bd" id="rfqLeft">
          <div class="drop" id="drop">${ic('upload', 26)}<div><b>Wrzuć plik RFQ</b> (PDF, DOCX, mail .eml)</div><div class="small" style="margin-top:4px">albo kliknij, żeby użyć przykładu: RFQ_GPZ_Kobylnica_v2.pdf</div></div>
        </div></section>
        <div class="gate">${ic('shield')}<div><b>Bramka akceptacji.</b> Nic nie zapisze się bez Twojego kliknięcia. Każde wywołanie modelu jest logowane: kto, kiedy, jaki plik, jaki wynik. Dostawca: Azure OpenAI w Waszym tenancie (strefa danych UE).</div></div>
      </div>
      <section class="card" data-spot="rfq-ext"><div class="hd"><h2>Propozycja pól</h2><span class="muted small" id="rfqStatus">czeka na dokument</span><div class="right"><button class="btn sm ghost" data-toast="Formularz pusty, wypełniasz ręcznie. Ta sama karta, bez asystenta.">wypełnij ręcznie</button></div></div>
        <div class="bd"><div class="ext" id="ext"><div class="empty">Po wczytaniu dokumentu pojawi się tu propozycja pól z pewnością per pole. Pola o niskiej pewności wymagają Twojej ręki.</div></div>
        <div id="rfqActions" style="display:none;margin-top:14px;display:none;gap:8px;justify-content:flex-end"><button class="btn" data-toast="Odrzucono propozycję, formularz pusty.">Odrzuć</button><button class="btn primary" id="rfqAccept">${ic('check')}Akceptuj i zarejestruj zapytanie</button></div></div>
      </section>
    </div>`;
  const RFQ_FIELDS = [
    ['Klient', 'GreenVolt Engineering sp. z o.o.', 96], ['Inwestor końcowy', 'Enea Operator', 92], ['Projekt', 'GPZ Kobylnica 110/15 kV', 94], ['Osoba kontaktowa', 'Michał Grabowski', 88],
    ['Kraj dostawy', 'PL', 99], ['Miejsce zainstalowania', 'Dystrybucja GPZ', 81], ['Typ zapytania', 'nowy transformator', 95], ['Termin złożenia oferty', '06.10.2026', 90],
    ['Pozycja 1: moc', '40 MVA', 97], ['Pozycja 1: napięcia', '110 / 15 kV', 97], ['Pozycja 1: chłodzenie', 'ONAN/ONAF', 74], ['Pozycja 1: sztuk', '2', 93], ['Regulacja napięcia', 'OLTC, do potwierdzenia', 52],
  ];
  function runRfq() {
    const left = $('#rfqLeft');
    left.innerHTML = `<div class="file" style="margin-bottom:12px"><div class="ic">pdf</div><span>RFQ_GPZ_Kobylnica_v2.pdf</span><span class="meta">1,8 MB · 3 strony</span></div>
      <div class="pdf scanning" id="pdf"><div class="scan"></div><div class="pt">ZAPYTANIE OFERTOWE nr GV/2026/RFQ-118</div>
      Zamawiający: <mark data-f="0">GreenVolt Engineering sp. z o.o.</mark>, ul. Przykładowa 12, Warszawa, działający na rzecz inwestora <mark data-f="1">Enea Operator sp. z o.o.</mark><br>
      Przedmiot: dostawa transformatorów mocy dla zadania <mark data-f="2">"Rozbudowa GPZ Kobylnica 110/15 kV"</mark>, lokalizacja Kobylnica, gm. Swarzędz, <mark data-f="4">Polska</mark>.<br>
      Zakres: <mark data-f="11">2 szt.</mark> transformatorów trójfazowych, moc znamionowa <mark data-f="8">40 MVA</mark>, przekładnia <mark data-f="9">110/15 kV</mark>, układ chłodzenia <mark data-f="10">ONAN/ONAF</mark>, 50 Hz, grupa połączeń YNd11. Wymagana <mark data-f="12">regulacja napięcia pod obciążeniem</mark> (do uzgodnienia zakres +/-). Instalacja w stacji GPZ operatora dystrybucyjnego (<mark data-f="5">stanowisko napowietrzne</mark>).<br>
      Termin składania ofert: <mark data-f="7">6 października 2026</mark>. Osoba do kontaktu: <mark data-f="3">Michał Grabowski</mark>, Dyrektor ds. zakupów. Oferta powinna zawierać wariant z monitoringiem on-line jako opcję. Dostawa DAP plac budowy.</div>`;
    $('#rfqStatus').textContent = 'model czyta dokument...';
    const ext = $('#ext'); ext.innerHTML = '';
    RFQ_FIELDS.forEach(([k, v, c], n) => {
      setTimeout(() => {
        const cls = c >= 85 ? 'hi' : c >= 65 ? 'mid' : 'lo';
        const row = document.createElement('div'); row.className = 'row';
        row.innerHTML = `<span class="k">${esc(k)}</span><span class="v"><input value="${esc(v)}"></span><span class="conf ${cls}" title="pewność modelu">${c}%</span>`;
        ext.appendChild(row); requestAnimationFrame(() => row.classList.add('in'));
        const m = $(`#pdf mark[data-f="${n}"]`); if (m) m.classList.add('on');
        $('#rfqStatus').textContent = `${n + 1} z ${RFQ_FIELDS.length} pól`;
        if (n === RFQ_FIELDS.length - 1) { $('#rfqStatus').innerHTML = `13 pól, <span class="conf hi">10</span> <span class="conf mid">2</span> <span class="conf lo">1</span> do sprawdzenia`; const a = $('#rfqActions'); a.style.display = 'flex'; }
      }, 500 + n * 260);
    });
  }

  pages.oferty = () => {
    const f = state.filter.off || 'wszystkie';
    const list = D.offers.filter(o => f === 'wszystkie' || o.result === f);
    return head({ title: 'Rejestr ofert', tags: [tag('beta')], sub: 'Rewizja wysłana jest niezmienna. Każda zmiana to nowa rewizja z powodem. Wynik dotyczy oferty, nie rewizji.', actions: `<button class="btn" data-csv="oferty">${ic('download')}CSV</button>` }) + locknote() +
      `<div class="filters" style="margin:12px 0">${['wszystkie', 'otwarta', 'wygrana', 'przegrana'].map(s => `<button class="chip ${f === s ? 'on' : ''}" data-filter="off:${s}">${s}${s !== 'wszystkie' ? ` <span class="mono small">${D.offers.filter(o => o.result === s).length}</span>` : ''}</button>`).join('')}</div>` +
      card('', `<table class="tbl"><thead><tr><th>Numer</th><th>Rewizja</th><th>Klient</th><th>Projekt</th><th class="r">Cena</th><th class="r">Marża</th><th class="r">Marża / rbh</th><th>Ważność</th><th class="r">Prawd.</th><th>Wynik</th></tr></thead><tbody>${list.map(o => { const r = o.revisions.at(-1); const m = r.price - r.cost - r.service; return `<tr class="link" data-href="#/oferty/${idToUrl(o.id)}"><td><a class="mono" href="#/oferty/${idToUrl(o.id)}">${o.id}</a></td><td class="mono">${r.r} <span class="muted small">${r.status}</span></td><td>${esc(cust(o.customer).name.split(' ').slice(0, 2).join(' '))}</td><td>${esc(o.project)}</td><td class="r">${F(r.price, o.currency)}</td><td class="r">${FP(m / r.price * 100)}</td><td class="r">${F(Math.round(m / r.hours), o.currency)}</td><td class="mono">${dt(r.valid)}</td><td class="r mono">${o.probability}%</td><td>${st(o.result)}${o.substate ? ` <span class="tag grey">${o.substate}</span>` : ''}</td></tr>`; }).join('')}</tbody></table>`, { tight: true });
  };

  pages.oferta = id => {
    const o = D.offers.find(x => x.id === id); if (!o) return notFound();
    const c = cust(o.customer), inq = D.inquiries.find(i => i.id === o.inquiry);
    const sel = o.revisions.find(r => r.r === state.revSel) || o.revisions.at(-1);
    const prev = o.revisions[Math.max(0, o.revisions.indexOf(sel) - 1)];
    const m = r => r.price - r.cost - r.service;
    const rows = [['Cena sprzedaży', r => money(r.price, o.currency), true], ['Techniczny koszt wyprodukowania', r => money(r.cost, o.currency), true], ['Koszt serwisu i transportu', r => money(r.service, o.currency), true], ['Marża kwotowa', r => money(m(r), o.currency), true], ['Marża %', r => pct(m(r) / r.price * 100), true], ['Roboczogodziny', r => new Intl.NumberFormat('pl-PL').format(r.hours), true], ['Marża na 1 rbh', r => money(Math.round(m(r) / r.hours), o.currency), true], ['Termin realizacji', r => dt(r.delivery)], ['Termin ważności oferty', r => dt(r.valid)], ['Warunki płatności', r => r.payment], ['Incoterms', r => r.incoterms]];
    const diff = `<table class="tbl diff"><thead><tr><th>Pole</th><th>${prev.r} <span class="muted">${prev.status}</span></th><th>${sel.r} <span class="muted">${sel.status}</span></th></tr></thead><tbody>${rows.map(([k, f, isFin]) => { const a = f(prev), b = f(sel), chg = a !== b && prev !== sel; const hide = isFin && !fin(); const wrap = v => hide ? LOCK : `<span class="mono">${v}</span>`; return `<tr><td>${k}</td><td>${wrap(a)}</td><td class="${chg ? 'chg' : ''}">${chg && !hide ? `<span class="from">${a}</span>` : ''}${wrap(b)}</td></tr>`; }).join('')}</tbody></table>`;
    const wonOrLost = o.result !== 'otwarta';
    return head({ crumbs: [{ l: 'Oferty', h: '#/oferty' }, { l: o.id }], title: `<span class="mono">${o.id}</span>`, tags: [st(o.result), o.substate ? `<span class="tag grey">${o.substate}</span>` : '', tag('beta')], sub: `${esc(o.project)} · ${esc(c.name)} · z zapytania <a href="#/zapytania/${idToUrl(o.inquiry)}" class="mono">${o.inquiry}</a> · waluta ${o.currency} · ${esc(user(o.owner).name)}`, actions: `<button class="btn" data-toast="Prosty PDF rewizji: tabela pozycji, warunki, ważność. Szablon firmowy to etap 2.">${ic('file')}PDF rewizji ${sel.r}</button>${sel.status === 'robocza' ? `<button class="btn" data-toast="Bramka wysłania: wymaga ceny, terminu ważności i Incoterms. Po wysłaniu rewizja jest zamknięta.">${ic('mail')}Wyślij ${sel.r}</button>` : `<button class="btn" data-toast="Rewizja ${sel.r} jest wysłana i niezmienna. Edycja tworzy nową rewizję z wymaganym powodem zmian.">${ic('plus')}Nowa rewizja</button>`}${wonOrLost ? '' : `<button class="btn primary" id="btnResult" data-spot="result">Wpisz wynik</button>`}` }) + locknote() +
      `<div class="grid g-main" style="margin-top:${fin() ? 0 : 12}px"><div class="stack">
        ${card('Rewizje', `<div class="rev-strip" data-spot="revs">${o.revisions.map(r => `<button class="rev ${r.r === sel.r ? 'on' : ''}" data-rev="${r.r}"><div class="id">${r.r}${r.status === 'wysłana' ? ic('lock', 13) : ''}</div><div class="m">${r.status} · ${dt(r.sent || r.prepared)}</div><div class="m">${fin() ? money(r.price, o.currency) : '***'}</div></button>`).join('')}</div>
          <div style="margin-top:14px;padding:12px 14px;background:var(--paper);border-radius:var(--r);font-size:13px"><b>Powód zmian ${sel.r}:</b> ${esc(sel.reason)}<div class="small muted" style="margin-top:4px">przygotowana ${dt(sel.prepared)}${sel.sent ? `, wysłana ${dt(sel.sent)}, od tej chwili niezmienna (snapshot)` : ', robocza, można edytować'}</div></div>`)}
        ${card(`Porównanie ${prev.r} → ${sel.r}`, diff, { tight: true, spot: 'diff', right: `<span class="muted small">zmienione pola podświetlone</span>` })}
      </div><div class="stack">
        ${card('Wynik oferty', dl([['Wynik', st(o.result) + (o.substate ? ` <span class="tag grey">${o.substate}</span>` : '')], ['Prawdopodobieństwo', `<span class="mono">${o.probability}%</span>`], ['Konkurencja', esc(o.competitors)], o.contract ? ['Numer umowy', `<span class="mono">${o.contract}</span>`] : null, o.lostReason ? ['Powód przegranej', esc(o.lostReason)] : null, ['Rewizja bazowa', o.result === 'wygrana' ? `<span class="mono">${o.revisions.at(-1).r}</span>, z niej powstało zlecenie ${D.orders.filter(x => x.offer === o.id).map(x => `<a href="#/zlecenia/${idToUrl(x.id)}" class="mono">${x.id}</a>`).join('') || '-'}` : '-']].filter(Boolean)), { spot: 'resultcard' })}
        ${inq ? card('Zapytanie źródłowe', dl([['Numer', `<a href="#/zapytania/${idToUrl(inq.id)}" class="mono">${inq.id}</a>`], ['Pozycje', inq.items.map(x => `${x.qty} x ${x.power} ${x.hv}/${x.mv} ${x.cool}`).join('<br>') || '-'], ['Termin złożenia', `<span class="mono">${dt(inq.deadline)}</span>`], ['Kanał Teams', inq.teams ? `${tag('ms', 'kanał')} <span class="small mono">${esc(inq.teams.channel)}</span>` : '-']])) : ''}
        ${card('Dokumenty', files(o.files), { right: `<button class="btn sm ghost">${ic('upload', 13)}dodaj</button>` })}
      </div></div>`;
  };

  pages.zlecenia = () => head({ title: 'Zlecenia', tags: [tag('beta')], sub: 'Zlecenie powstaje z wygranej rewizji. Jednostki z numerami fabrycznymi, dokumenty, FAT/SAT.', actions: `<button class="btn" data-csv="zlecenia">${ic('download')}CSV</button>` }) + locknote() +
    card('', `<table class="tbl" style="margin-top:${fin() ? 0 : 12}px"><thead><tr><th>Numer</th><th>Klient</th><th>Projekt</th><th>Umowa</th><th class="r">Wartość</th><th>Termin dostawy</th><th>Jednostki</th><th>PM</th><th>Etap</th><th>Status</th></tr></thead><tbody>${D.orders.map(o => { const cur = o.stages.findIndex(s => s.st !== 'done'); return `<tr class="link" data-href="#/zlecenia/${idToUrl(o.id)}"><td><a class="mono" href="#/zlecenia/${idToUrl(o.id)}">${o.id}</a></td><td>${esc(cust(o.customer).name.split(' ').slice(0, 2).join(' '))}</td><td>${esc(o.project)}</td><td class="mono">${o.contract}</td><td class="r">${F(o.value, o.currency)}</td><td class="mono">${dt(o.delivery)}</td><td class="mono small">${o.units.map(u => u.sn).join(', ')}</td><td>${esc(user(o.pm).name)}</td><td class="small">${cur < 0 ? '13/13' : `${cur}/13 · ${esc(D.dict.etapy[cur])}`}</td><td>${st(o.status)}</td></tr>`; }).join('')}</tbody></table>`, { tight: true });

  const stagesView = (o, big) => `<div class="stages" data-spot="stages">${o.stages.map((s, n) => `<button class="stg ${s.st}" data-stage="${o.id}:${n}" title="${esc(D.dict.etapy[n])}"><div class="bar"><i></i>${s.st === 'risk' ? '<span class="risk-dot"></span>' : ''}</div><div class="lbl"><span class="n">${String(n + 1).padStart(2, '0')}</span><br>${esc(D.dict.etapy[n])}</div></button>`).join('')}</div>`;

  pages.zlecenie = id => {
    const o = D.orders.find(x => x.id === id); if (!o) return notFound();
    const c = cust(o.customer), off = D.offers.find(x => x.id === o.offer);
    const cur = o.stages.findIndex(s => s.st !== 'done');
    const selN = state.tab[o.id] != null ? state.tab[o.id] : (cur < 0 ? 12 : cur);
    const s = o.stages[selN];
    return head({ crumbs: [{ l: 'Zlecenia', h: '#/zlecenia' }, { l: o.id }], title: `<span class="mono">${o.id}</span>`, tags: [st(o.status), tag('beta')], sub: `${esc(o.project)} · ${esc(c.name)} · z oferty <a href="#/oferty/${idToUrl(o.offer)}" class="mono">${o.offer} ${o.rev}</a> · PM ${esc(user(o.pm).name)}`, actions: `<button class="btn" data-toast="Kanał Teams dziedziczony z zapytania: ten sam wątek od RFQ do SAT.">${ic('msg')}Kanał Teams ${tag('ms')}</button><button class="btn" data-toast="Zadanie przypisane do PM z terminem, trafi na jego listę 'moje terminy'.">${ic('plus')}Zadanie</button>` }) + locknote() +
      `<div class="stack" style="margin-top:${fin() ? 0 : 12}px">
        ${card('Realizacja: 13 etapów', stagesView(o) + `<div class="grid g2" style="margin-top:18px"><div>
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"><h3>${String(selN + 1).padStart(2, '0')} · ${esc(D.dict.etapy[selN])}</h3>${s.st === 'done' ? st('zakończone') : s.st === 'risk' ? `<span class="st risk">ryzyko</span>` : s.st === 'prog' ? st('w toku') : `<span class="st">planowany</span>`}</div>
            ${dl([['Planowany termin', `<span class="mono">${dt(s.plan)}</span>`], ['Rzeczywisty termin', `<span class="mono">${dt(s.real)}</span>`], ['Odpowiedzialny', esc(s.who)], ['Status produkcji', s.st === 'done' ? 'zakończony' : s.st === 'todo' ? 'nierozpoczęty' : 'w toku'], ['Status dokumentacji', s.st === 'done' ? 'kompletna' : '-'], ['Status płatności', selN === 0 ? 'zaliczka 30% otrzymana' : selN === 6 ? 'rata 60% po FAT, informacyjnie' : '-']])}
            <div class="small muted" style="margin-top:10px">Źródło statusów: PM wpisuje ręcznie po ustaleniach z produkcją. Bez integracji z Symfonią.</div></div>
          <div>${s.risk ? `<div class="e2-note" style="background:var(--bad-soft);border-color:#F1C3BC;color:var(--bad);margin:0 0 12px" data-spot="risk">${ic('warn')}<div><b>Ryzyko etapu.</b> ${esc(s.risk)}</div></div>` : ''}
            <h3 style="margin-bottom:8px">Zadania etapu</h3>
            <div class="alerts">${(s.st === 'risk' ? [['bad', 'Uzgodnić nowy termin FAT z klientem', 'Piotr Nowicki · do 12.02.2027'], ['warn', 'Potwierdzić dostępność pieca VPD nr 2', 'Kierownik suszarni · do 05.02.2027']] : s.st === 'done' ? [['info', 'Etap zamknięty', `zakończony ${dt(s.real)}`]] : [['info', 'Brak zadań', 'etap jeszcze nie rozpoczęty']]).map(([t, a, b]) => `<div class="alert ${t}"><div class="ic">${ic(t === 'info' ? 'check' : t === 'bad' ? 'warn' : 'clock')}</div><div><div>${a}</div><div class="sub">${b}</div></div><div></div></div>`).join('')}</div>
            <button class="btn sm" style="margin-top:10px" data-toast="Zmiana statusu etapu przez PM, wpis do historii zmian.">Zmień status etapu</button></div></div>`, { right: `<span class="muted small">kliknij etap</span>` })}
        <div class="grid g-main">
          <div class="stack">
            ${card('Dane zlecenia', dl([['Numer zamówienia', `<span class="mono">${o.id}</span>`], ['Data otrzymania', `<span class="mono">${dt(o.received)}</span>`], ['Numer oferty', `<a href="#/oferty/${idToUrl(o.offer)}" class="mono">${o.offer} ${o.rev}</a>`], ['Klient', `<a href="#/klienci/${c.id}">${esc(c.name)}</a>`], ['Numer umowy', `<span class="mono">${o.contract}</span>`], ['Data podpisania', `<span class="mono">${dt(o.signed)}</span>`], ['Wartość kontraktu', F(o.value, o.currency)], ['Termin dostawy', `<span class="mono">${dt(o.delivery)}</span>`], ['Kierownik projektu', esc(user(o.pm).name)], ['Zakres prób FAT', esc(o.fat)], ['Zakres prób SAT', esc(o.sat)]], true))}
          </div>
          <div class="stack">
            ${card('Jednostki', `<table class="tbl"><thead><tr><th>Numer fabryczny</th><th>FAT</th><th>Dostawa</th><th>SAT</th><th>Gwarancja do</th></tr></thead><tbody>${o.units.map(u => `<tr><td class="mono"><b>${u.sn}</b></td><td class="mono">${dt(u.fat)}</td><td class="mono">${dt(u.delivered)}</td><td class="mono">${dt(u.sat)}</td><td class="mono">${dt(u.warranty)}</td></tr>`).join('')}</tbody></table><div class="small muted" style="padding:10px 14px">Jedna jednostka na każdą sztukę z rewizji. Po numerze fabrycznym serwis odnajdzie zlecenie, ofertę i klienta po latach.</div>`, { tight: true, spot: 'units' })}
            ${card('Dokumenty', files(o.files), { right: `<button class="btn sm ghost">${ic('upload', 13)}dodaj</button>` })}
          </div>
        </div>
      </div>`;
  };

  pages.realizacja = () => head({ title: 'Realizacja', tags: [tag('beta')], sub: 'Wszystkie zlecenia w toku na jednym ekranie. Etapy ze słownika, statusy od PM.' }) +
    `<div class="stack">${D.orders.filter(o => o.status === 'w realizacji').map(o => card(`<a href="#/zlecenia/${idToUrl(o.id)}" class="mono" style="text-decoration:none">${o.id}</a> <span class="muted" style="font-weight:400">${esc(o.project)} · ${esc(cust(o.customer).name.split(' ')[0])} · dostawa ${dt(o.delivery)}</span>`, stagesView(o), { right: `<span class="small muted">PM ${esc(user(o.pm).name)}</span>` })).join('')}</div>`;

  pages.serwis = () => head({ title: 'Serwis i gwarancje', tags: [tag('e2')], sub: 'Zgłoszenie startuje od numeru fabrycznego. Przez jednostkę zna zlecenie, ofertę i klienta.' }) +
    `<div class="e2-note">${ic('info')}<div><b>Etap 2, klocek w retainerze.</b> W etapie 1 powstaje encja Jednostka z numerem fabrycznym i gwarancją (już w zleceniach). Pełny moduł zgłoszeń, kosztów i raportów serwisowych to dodatkowa funkcjonalność: w ramach stałej obsługi albo osobnej wyceny, w kolejności ustalonej z Wami.</div></div>` +
    card('', `<table class="tbl"><thead><tr><th>Zgłoszenie</th><th>Numer fabryczny</th><th>Klient</th><th>Data</th><th>Opis</th><th>Priorytet</th><th>Termin odp.</th><th class="r">Koszt</th><th>Status</th></tr></thead><tbody>${D.service.map(s => `<tr class="link" data-href="#/serwis/${idToUrl(s.id)}"><td><a class="mono" href="#/serwis/${idToUrl(s.id)}">${s.id}</a></td><td class="mono">${s.sn}</td><td>${esc(cust(s.customer).name.split(' ').slice(0, 2).join(' '))}</td><td class="mono">${dt(s.date)}</td><td>${esc(s.desc.slice(0, 70))}${s.desc.length > 70 ? '...' : ''}</td><td>${prio(s.prio)}</td><td class="mono">${dt(s.respondBy)}</td><td class="r mono">${money(s.cost, s.currency)}</td><td>${st(s.status)}</td></tr>`).join('')}</tbody></table>`, { tight: true });

  pages.serwisCase = id => {
    const s = D.service.find(x => x.id === id); if (!s) return notFound();
    const c = cust(s.customer);
    const years = ((new Date(s.date) - new Date(s.unitDelivered)) / 31557600000).toFixed(1).replace('.', ',');
    return head({ crumbs: [{ l: 'Serwis', h: '#/serwis' }, { l: s.id }], title: `<span class="mono">${s.id}</span>`, tags: [st(s.status), prio(s.prio), tag('e2')], sub: `Jednostka <b class="mono">${s.sn}</b> · ${esc(c.name)} · dostarczona ${dt(s.unitDelivered)}, zgłoszenie po ${years} latach` }) +
      `<div class="e2-note">${ic('info')}<div><b>Etap 2.</b> Ten ekran pokazuje, jak zgłoszenie po numerze fabrycznym łączy się z całą historią jednostki. Moduł do dołożenia po etapie 1.</div></div>
      <div class="grid g-main"><div class="stack">
        ${card('Zgłoszenie', dl([['Numer fabryczny', `<span class="mono">${s.sn}</span>`], ['Klient', `<a href="#/klienci/${c.id}">${esc(c.name)}</a>`], ['Data zgłoszenia', `<span class="mono">${dt(s.date)}</span>`], ['Opis problemu', esc(s.desc)], ['Priorytet', prio(s.prio)], ['Osoba odpowiedzialna', esc(user(s.owner).name)], ['Termin odpowiedzi', `<span class="mono">${dt(s.respondBy)}</span>`], ['Termin zakończenia', `<span class="mono">${dt(s.closeBy)}</span>`], ['Status', st(s.status)]], true), { spot: 'sercase' })}
        ${card('Analiza i działania', dl([['Przyczyna problemu', esc(s.cause)], ['Działania korygujące', esc(s.actions)], ['Koszt reklamacji', `<span class="mono">${money(s.cost, s.currency)}</span>`], ['Dokumentacja zdjęciowa', `${s.photos} zdjęć`], ['Raport serwisowy', `<span class="mono">${esc(s.report)}</span>`], ['Wnioski', esc(s.conclusions)]]))}
      </div><div class="stack">
        ${card('Historia jednostki', `<div class="tl">${[[dt(s.unitDelivered), 'Dostawa i SAT', 'zlecenie z 2023, gwarancja 24 miesiące'], ['03.2024', 'Przegląd gwarancyjny', 'bez uwag'], [dt(s.date), 'Zgłoszenie ' + s.id, s.desc.slice(0, 50) + '...']].map(([a, b, c2]) => `<div class="it"><div class="dot">${ic('check', 11)}</div><div class="t"><b>${b}</b> <span class="when">${a}</span><div class="why">${esc(c2)}</div></div></div>`).join('')}</div>`)}
        ${card('Co widzi klient (etap 2, opcja)', `<div class="small" style="color:var(--ink-2)">Raport serwisowy PDF wysyłany z platformy. Zgłoszenia widoczne dla dyrektora i sprzedaży na karcie klienta, żeby przy kolejnym zapytaniu wiedzieć o historii serwisowej.</div>`)}
      </div></div>`;
  };

  pages.alerty = () => head({ title: 'Moje terminy', tags: [tag('beta')], sub: 'Zbierane raz dziennie: terminy ofert, ważność ofert, odpowiedzi techniczne, etapy realizacji, brak kontaktu. Lista tutaj plus mail poranny.' }) +
    `<div class="alerts" data-spot="alertlist">${D.alerts.map(alertRow).join('')}</div>`;

  pages.raporty = () => head({ title: 'Raporty', tags: [tag('beta')], sub: 'Każda lista ma eksport CSV. Raporty w szablonach grupy KONČAR (XLSX/PDF) to etap 2.' }) +
    `<div class="grid g3">
      ${card('Eksporty CSV', `<div class="stack">${[['klienci', 'Klienci z kontaktami'], ['zapytania', 'Rejestr zapytań'], ['oferty', 'Rejestr ofert z rewizjami'], ['zlecenia', 'Zlecenia i jednostki']].map(([k, l]) => `<button class="btn" data-csv="${k}" style="justify-content:space-between">${l}${ic('download')}</button>`).join('')}</div>`, { tags: [tag('beta')] })}
      ${card('Przekroje wygranych i przegranych', `<div class="small" style="color:var(--ink-2)">Per kraj, sektor, miejsce zainstalowania, handlowiec, typ zapytania. Widok na dashboardzie, eksport tutaj.</div><div style="margin-top:10px"><a class="btn" href="#/dashboard">Otwórz dashboard ${ic('arrowR')}</a></div>`, { tags: [tag('beta')] })}
      ${card('Raporty do grupy KONČAR', `<div class="small" style="color:var(--ink-2)">Znane Wam zestawienia w Waszych szablonach, generowane z jednej master-tabeli: marżowość, czas przygotowania oferty, terminowość realizacji, koszty reklamacji.</div>`, { tags: [tag('e2')] })}
    </div>`;

  pages.admin = () => {
    if (!me().admin) return head({ title: 'Administracja' }) + `<div class="locknote">${ic('lock')}Rola ${esc(me().role)} nie ma dostępu do administracji.</div>`;
    const step = state.tab.imp || 1;
    return head({ title: 'Administracja', tags: [tag('beta')], sub: 'Użytkownicy z Waszego Entra ID, role, słowniki, numeracja, import z Exceli.' }) +
      `<div class="grid g-main"><div class="stack">
        ${card('Import z Exceli', `<div class="steps">${['plik', 'mapowanie kolumn', 'walidacja', 'import'].map((s, n) => `<span class="${n + 1 === step ? 'on' : ''}">${n + 1}. ${s}</span>${n < 3 ? '<i></i>' : ''}`).join('')}</div>
          <div style="margin-top:14px">${step === 1 ? `<div class="drop" id="impDrop">${ic('upload', 26)}<div><b>Oferty_2024.xlsx</b> i 14 innych plików</div><div class="small" style="margin-top:4px">kliknij, żeby przejść do mapowania</div></div>` :
            step === 2 ? `<div class="map">${[['Nr oferty', 'Numer oferty'], ['Klient', 'Klient (deduplikacja po nazwie i NIP)'], ['Data', 'Data przygotowania'], ['Wartość EUR', 'Cena sprzedaży + waluta EUR'], ['Marża %', 'Marża %'], ['Status', 'Wynik oferty (słownik)'], ['Uwagi', 'Komentarz']].map(([a, b]) => `<span class="src">${a}</span><span class="arr">${ic('arrowR', 14)}</span><select><option>${b}</option><option>pomiń kolumnę</option></select><span></span>`).join('')}</div><div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end"><button class="btn" data-imp="1">Wstecz</button><button class="btn primary" data-imp="3">Waliduj</button></div>` :
            step === 3 ? `<div class="alerts"><div class="alert warn"><div class="ic">${ic('warn')}</div><div><div>Wiersz 41: "Status" = "negocjacje?" poza słownikiem</div><div class="sub">propozycja: otwarta · negocjacje</div></div><div></div></div><div class="alert warn"><div class="ic">${ic('warn')}</div><div><div>Wiersze 12 i 88: klient "ENEA Operator" i "Enea Operator Sp z o o"</div><div class="sub">scalono do jednej karty po NIP</div></div><div></div></div><div class="alert info"><div class="ic">${ic('check')}</div><div><div>212 wierszy poprawnych, 2 do decyzji, 0 błędów krytycznych</div><div class="sub">raport błędów do pobrania</div></div><div></div></div></div><div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end"><button class="btn" data-imp="2">Wstecz</button><button class="btn primary" data-imp="4">Importuj 214 wierszy</button></div>` :
            `<div class="alert info"><div class="ic">${ic('check')}</div><div><div>Zaimportowano 214 ofert z pliku Oferty_2024.xlsx</div><div class="sub">wpis w audit logu, możliwe cofnięcie w ciągu 24 h</div></div><div></div></div><div style="margin-top:12px"><button class="btn" data-imp="1">Kolejny plik</button></div>`}</div>`, { spot: 'import' })}
        ${card('Słowniki', `<div class="grid g2">${Object.entries({ 'Status zapytania': D.dict.status_zapytania, 'Źródło zapytania': D.dict.zrodlo, 'Sektor rynku': D.dict.sektor, 'Miejsce zainstalowania': D.dict.miejsce, 'Incoterms': D.dict.incoterms, 'Etapy realizacji': D.dict.etapy }).map(([k, v]) => `<div><h3 style="margin-bottom:6px">${k} <span class="muted small mono">${v.length}</span></h3><div style="display:flex;flex-wrap:wrap;gap:4px">${v.map(x => `<span class="tag grey">${esc(x)}</span>`).join('')}</div></div>`).join('')}</div><div class="small muted" style="margin-top:12px">Pozycje archiwizuje się, nie usuwa: stare rekordy zachowują wartość.</div>`)}
      </div><div class="stack">
        ${card('Użytkownicy i role', `<table class="tbl"><thead><tr><th>Osoba</th><th>Rola</th><th>Finanse</th><th>Logowanie</th></tr></thead><tbody>${Object.values(D.users).map(u => `<tr><td>${esc(u.name)}<div class="small muted">${esc(u.name.toLowerCase().replace(' ', '.').normalize('NFD').replace(/[̀-ͯ]/g, '').replace('ł', 'l'))}@petransformatory.pl</div></td><td>${esc(u.role)}</td><td>${u.fin ? ic('check', 14) : '<span class="muted">-</span>'}</td><td>${tag('ms', 'Entra SSO')}</td></tr>`).join('')}</tbody></table><div class="small muted" style="padding:10px 14px">Konta tylko dla działu (5 ról + admin). Inżynierowie z projektowania bez kont: dostają kanał Teams i mail.</div>`, { tight: true, tags: [tag('ms')] })}
        ${card('Numeracja', dl([['Zapytania', `<span class="mono">ZAP/{rok}/{nnnn}</span>`], ['Oferty', `<span class="mono">OF/{rok}/{nnnn}</span> + <span class="mono">R{n}</span>`], ['Zlecenia', `<span class="mono">ZL/{rok}/{nnnn}</span>`], ['Zgłoszenia', `<span class="mono">SER/{rok}/{nnnn}</span>`]]) + `<div class="small muted" style="margin-top:8px">Sekwencja per rok, format edytowalny, luki dozwolone.</div>`)}
        ${card('Bezpieczeństwo i eksploatacja', `<div class="stack small" style="color:var(--ink-2)"><div>${ic('check', 13)} Logowanie kontem Microsoft (Entra ID), bez osobnych haseł</div><div>${ic('check', 13)} Audit log każdej zmiany, widok "historia" na kartach</div><div>${ic('check', 13)} Hosting Azure w Waszym tenancie (Poland Central), kopie zapasowe codziennie</div><div>${ic('check', 13)} Kod na własność PET po każdym odebranym etapie</div></div>`, { tags: [tag('ms')] })}
      </div></div>`;
  };

  pages.zakres = () => head({ title: 'Mapa zakresu', sub: 'Etap 0 i 1 to działające narzędzie zgodne z Waszymi wymaganiami. Etap 2 to dodatkowe funkcjonalności, dokładane w ramach stałej obsługi albo osobnej wyceny. Bez kwot: te są w ofercie.' }) +
    `<div class="scope-cols" data-spot="scope">
      <div class="scope-col"><div class="hd2">${tag('beta', 'Etap 0')}<h2>Rozpoznanie i architektura</h2></div><ul>${['Warsztat: proces od zapytania do zlecenia', 'Warsztat: raporty i zestawienia, których używacie', 'Przegląd Waszych plików Excel i mapa migracji', 'Potwierdzony model danych i słowniki', 'Klikalny prototyp kluczowych ekranów', 'Lista zgód Entra i Graph dla Waszego IT', 'Plan sprintów z kryteriami odbioru'].map(x => `<li>${ic('check', 14)}${x}</li>`).join('')}</ul><div class="small muted" style="margin-top:8px">Dwa tygodnie. Wynik: decyzja o etapie 1 na twardych ustaleniach, nie na założeniach.</div></div>
      <div class="scope-col"><div class="hd2">${tag('beta')}<h2>Funkcjonalne narzędzie</h2></div><ul>${['Logowanie Microsoft, 5 ról + admin, uprawnienia do finansów', 'Klienci, kontakty, projekty, historia', 'Rejestr zapytań, pozycje techniczne, załączniki', 'Handoff do inżynierów: kanał Teams + mail z terminem', 'Oferty z rewizjami, diff, powód zmian, wynik z konkurentem', 'PDF rewizji (prosty szablon)', 'Zlecenia, jednostki z numerem fabrycznym', 'Realizacja: 13 etapów, ryzyka, zadania', 'Alerty terminów: lista + mail', 'Dashboard: plan vs realizacja, handlowcy, rynki, eksport CSV', 'Import ok. 15 plików Excel od 2023', 'Audit log, backup, dokumentacja, szkolenie'].map(x => `<li>${ic('check', 14)}${x}</li>`).join('')}<li>${ic('spark', 14)}Asystent RFQ (po Waszej decyzji o polityce AI)${tag('ai')}</li></ul><div class="small muted" style="margin-top:8px">Sprinty z demem po każdym, testy z Waszym działem, odbiór na kryteriach z etapu 0. Kod na własność PET.</div></div>
      <div class="scope-col"><div class="hd2">${tag('e2')}<h2>Dodatkowe funkcjonalności</h2></div><ul>${['Serwis i gwarancje: zgłoszenia, koszty, raport serwisowy', 'Marketing: wydarzenia, wizyty, konkurenci', 'Raporty do grupy KONČAR w Waszych szablonach', 'Synchronizacja Outlook: wątki mailowe przy sprawach', 'AI: analiza draftu umowy pod ryzyka', 'Monitoring rynku i przetargów', 'Aplikacja na telefon (PWA), tylko odczyt', 'Generator oferty handlowej z szablonu firmowego', 'Rozszerzony dashboard zarządu'].map(x => `<li>${ic('plus', 14)}${x}</li>`).join('')}</ul><div class="small muted" style="margin-top:8px">Dokładane w ramach stałej obsługi albo osobnej wyceny. Które i kiedy: decydujecie Wy, harmonogram ustalamy razem z tą decyzją.</div></div>
    </div>
    <section class="card" style="margin-top:20px"><div class="hd"><h2>Integracje Microsoft 365</h2>${tag('ms')}</div><div class="bd"><div class="int">${[['ID', 'Entra ID', 'Logowanie kontem firmowym, MFA i polityki po Waszej stronie'], ['T', 'Teams', 'Kanał per sprawa w zespole "Sprawy {rok}", tworzony przez platformę'], ['M', 'Exchange', 'Mail do inżynierów ze skrzynki współdzielonej, alerty poranne'], ['Az', 'Azure', 'Hosting w Waszym tenancie: App Service, PostgreSQL, Blob. Faktura Microsoft, ok. 160-220 zł miesięcznie'], ['AI', 'Azure OpenAI', 'Asystent RFQ w strefie danych UE, opcja'], ['Sy', 'Symfonia', 'Bez integracji, zgodnie z Waszą decyzją z 11.09. Statusy realizacji wpisuje PM']].map(([a, b, c]) => `<div class="it"><div class="ic">${a}</div><div><b>${b}</b><span class="m">${c}</span></div></div>`).join('')}</div></div></section>`;

  const notFound = () => head({ title: 'Nie znaleziono' }) + `<div class="empty">Brak rekordu w danych przykładowych.</div>`;

  /* ---------- router ---------- */
  function route() {
    const h = location.hash || '#/dashboard';
    const [, p, id] = h.split('/');
    let html;
    if (p === 'klienci' && id) html = pages.klient(id);
    else if (p === 'zapytania' && id === 'nowe') html = pages.nowe();
    else if (p === 'zapytania' && id) html = pages.zapytanie(urlToId(id));
    else if (p === 'oferty' && id) html = pages.oferta(urlToId(id));
    else if (p === 'zlecenia' && id) html = pages.zlecenie(urlToId(id));
    else if (p === 'serwis' && id) html = pages.serwisCase(urlToId(id));
    else html = (pages[p] || pages.dashboard)();
    const v = $('#view'); v.innerHTML = `<div class="page">${html}</div>`;
    renderNav(); window.scrollTo(0, 0);
    v.querySelectorAll('[data-count]').forEach(countUp);
    if (p === 'zapytania' && id === 'nowe') $('#drop')?.addEventListener('click', runRfq);
    $('#rfqAccept')?.addEventListener('click', e => { e.target.classList.add('loading'); setTimeout(() => { toast('Zapytanie ZAP/2026/0087 zarejestrowane. Kanał Teams założony, mail do inżynierów wysłany.'); location.hash = '#/zapytania/ZAP-2026-0087'; }, 900); });
    $('#btnResult')?.addEventListener('click', () => openResult(urlToId(id)));
    $('#impDrop')?.addEventListener('click', () => { state.tab.imp = 2; route(); });
    if (state.guide) setTimeout(spotlight, 120);
  }
  function countUp(el) {
    const to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), t0 = performance.now(), dur = 900;
    const tick = t => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = (to * e).toFixed(dec).replace('.', ','); if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick); setTimeout(() => { el.textContent = to.toFixed(dec).replace('.', ','); }, dur + 150);
  }

  /* ---------- interactions ---------- */
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-toast],[data-tab],[data-filter],[data-rev],[data-stage],[data-csv],[data-imp],tr.link');
    if (!t) return;
    if (t.dataset.toast) { toast(t.dataset.toast); return; }
    if (t.dataset.tab) { const [k, v] = t.dataset.tab.split(':'); state.tab[k] = v; route(); return; }
    if (t.dataset.filter) { const [k, v] = t.dataset.filter.split(':'); state.filter[k] = v; route(); return; }
    if (t.dataset.rev) { state.revSel = t.dataset.rev; route(); return; }
    if (t.dataset.stage) { const [k, n] = t.dataset.stage.split(':'); state.tab[k] = +n; if (location.hash.includes('zlecenia/')) route(); else location.hash = '#/zlecenia/' + idToUrl(k); return; }
    if (t.dataset.csv) { csv(t.dataset.csv); return; }
    if (t.dataset.imp) { state.tab.imp = +t.dataset.imp; route(); return; }
    if (t.matches('tr.link') && !e.target.closest('a,button')) location.hash = t.dataset.href;
  });
  document.addEventListener('mousemove', e => {
    const tip = $('#mapTip'); if (!tip) return;
    const p = e.target.closest && e.target.closest('.map path');
    if (!p) { tip.classList.remove('on'); return; }
    const c = D.countries[p.dataset.iso]; const wrap = p.closest('.map-wrap').getBoundingClientRect();
    tip.style.left = (e.clientX - wrap.left) + 'px'; tip.style.top = (e.clientY - wrap.top) + 'px';
    tip.innerHTML = `<b>${esc(p.dataset.name)}</b>` + (c ? `<div class="row"><span>zlecenia 2026</span><span>${c.v.toFixed(1).replace('.', ',')} mln EUR</span></div><div class="row"><span>jednostki</span><span>${c.units}</span></div><div class="row"><span>wygrane / przegrane</span><span>${c.won} / ${c.lost}</span></div>` : `<div class="row"><span>brak zapytań w 2026</span></div>`);
    tip.classList.add('on');
  });
  let toastT; function toast(msg) { const el = $('#toast'); el.innerHTML = ic('check') + esc(msg); el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 3800); }
  function csv(k) {
    const rows = { klienci: [['Nazwa', 'NIP', 'Kraj', 'Sektor', 'Priorytet', 'Ostatni kontakt'], ...D.customers.map(c => [c.name, c.nip, c.country, c.sector, c.prio, c.lastContact])],
      zapytania: [['Numer', 'Data', 'Klient', 'Inwestor', 'Projekt', 'Status', 'Termin oferty'], ...D.inquiries.map(i => [i.id, i.date, cust(i.customer).name, i.investor, i.project, i.status, i.deadline])],
      oferty: [['Numer', 'Rewizja', 'Klient', 'Projekt', 'Waluta', ...(fin() ? ['Cena', 'Marża %'] : []), 'Wynik'], ...D.offers.map(o => { const r = o.revisions.at(-1); return [o.id, r.r, cust(o.customer).name, o.project, o.currency, ...(fin() ? [r.price, ((r.price - r.cost - r.service) / r.price * 100).toFixed(1)] : []), o.result]; })],
      zlecenia: [['Numer', 'Klient', 'Projekt', 'Umowa', 'Termin dostawy', 'Jednostki', 'Status'], ...D.orders.map(o => [o.id, cust(o.customer).name, o.project, o.contract, o.delivery, o.units.map(u => u.sn).join(' '), o.status])],
      dashboard: [['Wskaźnik', 'Wartość'], ['Otwarte zapytania', D.inquiries.filter(i => i.status !== 'zamknięte').length], ['Oferty otwarte', D.offers.filter(o => o.result === 'otwarta').length]] }[k];
    const txt = '﻿' + rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'text/csv;charset=utf-8' })); a.download = `pet-sales-${k}-2026-09-24.csv`; a.click();
    toast(`Pobrano ${a.download} (${rows.length - 1} wierszy)`);
  }
  function openResult(id) {
    const o = D.offers.find(x => x.id === id); let res = 'wygrana';
    const root = $('#modalRoot');
    const draw = () => { root.innerHTML = `<div class="modal-bg" id="mbg"><div class="modal" role="dialog" aria-modal="true"><div class="hd"><h2>Wynik oferty <span class="mono">${o.id}</span></h2><button class="x" id="mx">${ic('x', 15)}</button></div><div class="bd stack">
      <div class="seg"><button class="${res === 'wygrana' ? 'on won' : ''}" data-res="wygrana">Wygrana</button><button class="${res === 'przegrana' ? 'on lost' : ''}" data-res="przegrana">Przegrana</button><button class="${res === 'anulowana' ? 'on' : ''}" data-res="anulowana">Anulowana</button></div>
      ${res === 'wygrana' ? `<div class="field"><label>Rewizja bazowa (z niej powstanie zlecenie)</label><select>${o.revisions.filter(r => r.status === 'wysłana').map(r => `<option>${r.r}, wysłana ${dt(r.sent)}, ${fin() ? money(r.price, o.currency) : '***'}</option>`).reverse().join('')}</select></div><div class="field" id="fContract"><label>Numer umowy</label><input placeholder="np. UM/2026/021" id="contractIn"><div class="hint">Bramka: wygrana wymaga numeru umowy albo zaznaczenia "bez umowy".</div></div><label class="small" style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="noContract">zamówienie bez umowy</label>` :
        res === 'przegrana' ? `<div class="field"><label>Powód przegranej</label><select><option>cena</option><option>termin dostawy</option><option>parametry techniczne</option><option>referencje / kwalifikacja</option><option>relacja z konkurentem</option><option>inny</option></select></div><div class="field"><label>Kto wygrał (konkurent)</label><input value="Konkurent A (DE)"></div><div class="field"><label>Komentarz, czego się nauczyliśmy</label><textarea rows="2" placeholder="np. cena ok. 6% wyżej, klient docenił krótszy termin konkurenta"></textarea></div>` :
        `<div class="field"><label>Powód anulowania</label><input placeholder="np. inwestor wstrzymał projekt"></div>`}
      <div class="small muted">Feedback z przegranych zostaje w systemie i zasila przekroje na dashboardzie.</div></div>
      <div class="ft"><button class="btn" id="mcancel">Anuluj</button><button class="btn primary" id="msave">Zapisz wynik</button></div></div></div>`;
      root.querySelectorAll('[data-res]').forEach(b => b.onclick = () => { res = b.dataset.res; draw(); });
      $('#mx').onclick = $('#mcancel').onclick = () => root.innerHTML = '';
      $('#mbg').onclick = e => { if (e.target.id === 'mbg') root.innerHTML = ''; };
      $('#msave').onclick = () => {
        if (res === 'wygrana' && !$('#contractIn').value && !$('#noContract').checked) { const f = $('#fContract'); f.classList.add('err'); f.querySelector('.hint').classList.add('err'); f.querySelector('.hint').textContent = 'Podaj numer umowy albo zaznacz "bez umowy".'; return; }
        $('#msave').classList.add('loading');
        setTimeout(() => {
          o.result = res; o.substate = null; o.probability = res === 'wygrana' ? 100 : 0;
          if (res === 'wygrana') { o.contract = $('#contractIn').value || 'bez umowy'; const r = o.revisions.filter(x => x.status === 'wysłana').at(-1); const nid = 'ZL/2026/0008'; D.orders.unshift({ id: nid, offer: o.id, rev: r.r, customer: o.customer, project: o.project, received: '2026-09-24', contract: o.contract, signed: '2026-09-24', value: r.price, currency: o.currency, delivery: r.delivery, pm: 'pm', status: 'w realizacji', fat: 'Standard PET.', sat: 'Standard PET.', units: [{ sn: 'PET-2026-0313', fat: null, sat: null, delivered: null, warranty: null }, { sn: 'PET-2026-0314', fat: null, sat: null, delivered: null, warranty: null }], files: [], stages: D.dict.etapy.map(() => ({ plan: null, real: null, st: 'todo', who: '-' })) }); const inq = D.inquiries.find(i => i.id === o.inquiry); if (inq) inq.status = 'zamknięte'; }
          if (res === 'przegrana') o.lostReason = 'cena';
          root.innerHTML = ''; toast(res === 'wygrana' ? `Oferta wygrana. Utworzono zlecenie ZL/2026/0008 z rewizji ${o.revisions.filter(x => x.status === 'wysłana').at(-1).r}, 2 jednostki, 13 etapów.` : 'Wynik zapisany. Powód i konkurent trafiły do przekrojów.'); route();
        }, 700);
      };
    };
    draw();
  }

  /* ---------- search ---------- */
  const idx = () => [...D.customers.map(c => ({ l: c.name, k: 'klient', h: '#/klienci/' + c.id })), ...D.inquiries.map(i => ({ l: `${i.id} · ${i.project}`, k: 'zapytanie', h: '#/zapytania/' + idToUrl(i.id) })), ...D.offers.map(o => ({ l: `${o.id} · ${o.project}`, k: 'oferta', h: '#/oferty/' + idToUrl(o.id) })), ...D.orders.map(o => ({ l: `${o.id} · ${o.project}`, k: 'zlecenie', h: '#/zlecenia/' + idToUrl(o.id) })), ...D.orders.flatMap(o => o.units.map(u => ({ l: `${u.sn} · ${o.project}`, k: 'jednostka', h: '#/zlecenia/' + idToUrl(o.id) }))), ...D.service.map(s => ({ l: `${s.id} · ${s.sn}`, k: 'zgłoszenie', h: '#/serwis/' + idToUrl(s.id) }))];
  const q = $('#q'), sugg = $('#sugg'), sbox = $('#search');
  q.addEventListener('input', () => { const v = q.value.trim().toLowerCase(); if (v.length < 2) { sbox.classList.remove('open'); return; } const hits = idx().filter(x => x.l.toLowerCase().includes(v)).slice(0, 8); sugg.innerHTML = hits.length ? hits.map(x => `<a href="${x.h}">${esc(x.l)}<span class="k">${x.k}</span></a>`).join('') : `<div class="empty" style="padding:12px">Brak wyników</div>`; sbox.classList.add('open'); });
  q.addEventListener('blur', () => setTimeout(() => sbox.classList.remove('open'), 150));
  q.addEventListener('focus', () => { if (q.value.trim().length >= 2) sbox.classList.add('open'); });
  sugg.addEventListener('click', () => { q.value = ''; sbox.classList.remove('open'); });

  /* ---------- role ---------- */
  const rs = $('#roleSel');
  rs.innerHTML = Object.values(D.users).map(u => `<option value="${u.id}">${esc(u.name)} · ${esc(u.role)}</option>`).join('');
  rs.value = state.role;
  rs.addEventListener('change', () => { state.role = rs.value; $('#avatar').textContent = me().ini; route(); toast(fin() ? `Patrzysz jako ${me().role}: pola finansowe widoczne.` : `Patrzysz jako ${me().role}: cena, koszt i marża ukryte (brak uprawnienia).`); });

  /* ---------- guide ---------- */
  const STEPS = [
    { h: '#/dashboard', spot: '[data-spot="plan"]', t: 'Jeden ekran zamiast kilkunastu Exceli', p: 'Plan i realizacja, sprzedaż per handlowiec, mapa rynków i skuteczność ofert liczą się same z rejestrów. Dyrektor widzi cały dział, handlowiec swój portfel. Każdą listę można wyeksportować do CSV, więc znane Wam zestawienia dalej powstają, tylko bez przepisywania.', tags: ['beta'] },
    { h: '#/klienci/enea', spot: '[data-spot="stale"]', t: 'Karta klienta z całą historią', p: 'Dane, kontakty, projekty i zakładki: zapytania, oferty, zamówienia, reklamacje, spotkania. Platforma sama przypomina, gdy klient z priorytetem wysokim nie miał kontaktu przez 120 dni. Rola inżyniera after-sales widzi tę kartę, ale nie widzi marż.', tags: ['beta'] },
    { h: '#/zapytania/nowe', spot: '[data-spot="rfq-drop"]', t: 'Z RFQ do zapytania w 2 minuty', p: 'Kliknij pole z plikiem. Model czyta PDF i proponuje pola z pewnością per pole. Ty akceptujesz albo poprawiasz. To opcja: uruchamiamy ją dopiero po Waszej decyzji o polityce AI, w Azure OpenAI w Waszym tenancie.', tags: ['ai'], act: 'rfq' },
    { h: '#/zapytania/ZAP-2026-0087', spot: '[data-spot="teams"]', t: 'Inżynier dostaje sprawę z terminem, bez ręcznego maila', p: 'Przy rejestracji zapytania platforma zakłada kanał Teams sprawy i wysyła mail z załącznikami do działu projektowania. Inżynierowie nie potrzebują kont. Odpowiedź wraca w kanale, handlowiec odnotowuje ją i status idzie dalej. Ten sam kanał zostaje z ofertą i zleceniem.', tags: ['beta', 'ms'] },
    { h: '#/oferty/OF-2026-0042', spot: '[data-spot="revs"]', t: 'Rewizje zamiast "-14" w nazwie pliku', p: 'Wysłana rewizja jest zamknięta na zawsze (kłódka). Każda zmiana to nowa rewizja z obowiązkowym powodem. Porównanie R2 z R3 pokazuje dokładnie, co się zmieniło: cena, Incoterms, płatność. Marża i marża na roboczogodzinę liczą się same.', tags: ['beta'], pre: () => { state.revSel = 'R3'; } },
    { h: '#/oferty/OF-2026-0042', spot: '[data-spot="result"]', t: 'Wynik z powodem: feedback nie ginie', p: 'Kliknij "Wpisz wynik". Wygrana wymaga numeru umowy i wskazania rewizji bazowej, z której powstaje zlecenie. Przegrana wymaga powodu i konkurenta. Te dane zasilają przekroje na dashboardzie, więc po roku widać, gdzie i dlaczego przegrywamy.', tags: ['beta'] },
    { h: '#/zlecenia/ZL-2026-0007', spot: '[data-spot="units"]', t: 'Zlecenie z jednostkami i numerami fabrycznymi', p: 'Zlecenie powstaje z wygranej rewizji, bez przepisywania. Każda sztuka to jednostka z numerem fabrycznym, FAT, SAT i gwarancją. Handlowiec zostaje PM-em zlecenia, a kanał Teams z zapytania idzie dalej.', tags: ['beta'] },
    { h: '#/zlecenia/ZL-2026-0007', spot: '[data-spot="stages"]', t: '13 etapów realizacji, ryzyka widoczne od razu', p: 'Etapy od projektowania elektrycznego do zakończenia. PM ustawia statusy ręcznie po ustaleniach z produkcją, bez integracji z Symfonią. Ryzyko na etapie "suszenie" wpada na listę terminów i do zadań. Kliknij etap, żeby zobaczyć szczegóły.', tags: ['beta'], pre: () => { state.tab['ZL/2026/0007'] = 4; } },
    { h: '#/serwis/SER-2026-0003', spot: '[data-spot="sercase"]', t: 'Reklamacja po trzech latach, po numerze fabrycznym', p: 'Serwis zaczyna od numeru fabrycznego i przez jednostkę widzi zlecenie, ofertę i klienta. Koszt, przyczyna, działania, raport serwisowy. To etap 2: w etapie 1 jest już jednostka z gwarancją, moduł zgłoszeń dokładamy w ramach stałej obsługi albo osobnej wyceny.', tags: ['e2'] },
    { h: '#/zakres', spot: '[data-spot="scope"]', t: 'Co dostajecie i co możecie dołożyć', p: 'Etap 0 i 1 to działające narzędzie zgodne z Waszym dokumentem: sprinty z demem po każdym, odbiór na kryteriach ustalonych w etapie 0. Etap 2 to dodatkowe funkcjonalności, które dokładamy w ramach stałej obsługi albo osobnej wyceny. Które i kiedy: decydujecie Wy. Wszystko na Waszym Microsoft 365 i Azure, kod na własność PET.', tags: ['beta', 'e2', 'ms'] },
  ];
  const g = $('#guide'), spot = $('#spot');
  function renderGuide() {
    const s = STEPS[state.step];
    g.innerHTML = `<div class="gh"><span class="step">krok ${state.step + 1} / ${STEPS.length}</span><span class="muted small">przewodnik</span><button class="x" id="gx" title="Zamknij (Esc)">${ic('x', 14)}</button></div>
      <div class="gb"><h3>${esc(s.t)}</h3><p>${esc(s.p)}</p><div class="tags">${s.tags.map(t => tag(t)).join('')}</div></div>
      <div class="gf"><div class="dots">${STEPS.map((_, i) => `<i class="${i === state.step ? 'on' : i < state.step ? 'done' : ''}"></i>`).join('')}</div><button class="btn sm" id="gprev" ${state.step === 0 ? 'disabled' : ''}>${ic('chevL', 13)}Wstecz</button><button class="btn sm primary" id="gnext">${state.step === STEPS.length - 1 ? 'Zakończ' : 'Dalej'} ${ic('chevR', 13)}</button></div>`;
    $('#gx').onclick = stopGuide; $('#gprev').onclick = () => goStep(state.step - 1); $('#gnext').onclick = () => state.step === STEPS.length - 1 ? stopGuide() : goStep(state.step + 1);
  }
  function goStep(n) {
    state.step = Math.max(0, Math.min(STEPS.length - 1, n)); const s = STEPS[state.step];
    s.pre && s.pre(); renderGuide();
    if (location.hash !== s.h) location.hash = s.h; else route();
  }
  function spotlight() {
    const s = STEPS[state.step]; const el = s && document.querySelector(s.spot);
    if (!el) { spot.classList.remove('on'); return; }
    el.scrollIntoView({ block: 'center', behavior: 'auto' });
    setTimeout(() => { const r = el.getBoundingClientRect(); spot.style.left = (r.left - 8) + 'px'; spot.style.top = (r.top - 8) + 'px'; spot.style.width = (r.width + 16) + 'px'; spot.style.height = (r.height + 16) + 'px'; spot.classList.add('on');
      const g2 = g.getBoundingClientRect(); const overlapRight = r.right > innerWidth - 420 && r.bottom > innerHeight - (g2.height || 320) - 40; g.classList.toggle('left', overlapRight && r.left > 660); }, 60);
  }
  function startGuide(from = 0) { state.guide = true; g.classList.add('on'); $('#modalRoot').innerHTML = ''; goStep(from); }
  function stopGuide() { state.guide = false; g.classList.remove('on'); spot.classList.remove('on'); }
  $('#guideBtn').onclick = () => state.guide ? stopGuide() : startGuide(0);
  document.addEventListener('keydown', e => {
    if (e.target.matches('input,textarea,select')) return;
    if (e.key.toLowerCase() === 'g') { state.guide ? stopGuide() : startGuide(0); }
    if (e.key === '/') { e.preventDefault(); q.focus(); }
    if (e.key === 'Escape') { stopGuide(); $('#modalRoot').innerHTML = ''; }
    if (state.guide && e.key === 'ArrowRight') goStep(state.step + 1);
    if (state.guide && e.key === 'ArrowLeft') goStep(state.step - 1);
  });
  window.addEventListener('resize', () => state.guide && spotlight());
  window.addEventListener('scroll', () => { if (state.guide) { const s = STEPS[state.step], el = document.querySelector(s.spot); if (el) { const r = el.getBoundingClientRect(); spot.style.left = (r.left - 8) + 'px'; spot.style.top = (r.top - 8) + 'px'; } } }, { passive: true });

  function startScreen() {
    $('#modalRoot').innerHTML = `<div class="gstart" id="gs"><div class="box"><span class="tag acc">makieta koncepcyjna</span><h1 style="margin-top:12px">PET Sales: tak może działać platforma Waszego działu sprzedaży</h1>
      <p>To nie jest gotowy program, tylko klikalna makieta na dane przykładowe. Pokazuje mechanikę: od zapytania, przez inżynierów i rewizje oferty, po zlecenie, 13 etapów realizacji i serwis. Znaczniki mówią, co jest w etapie 1, co można dołożyć w etapie 2, a co jest integracją z Waszym Microsoft 365.</p>
      <div class="row"><button class="btn primary" id="gsStart">${ic('play')}Przewodnik, 10 kroków</button><button class="btn" id="gsFree">Klikam sam</button></div>
      <div class="meta"><span><kbd>G</kbd> przewodnik</span><span><kbd>←</kbd> <kbd>→</kbd> kroki</span><span><kbd>Esc</kbd> zamknij</span><span>Przełącznik roli w górnym pasku pokazuje uprawnienia.</span></div></div></div>`;
    $('#gsStart').onclick = () => startGuide(0); $('#gsFree').onclick = () => $('#modalRoot').innerHTML = '';
  }

  window.addEventListener('hashchange', route);
  $('#avatar').textContent = me().ini;
  route();
  const qs = new URLSearchParams(location.search);
  if (qs.get('step')) { startGuide(Math.max(0, Math.min(STEPS.length - 1, +qs.get('step') - 1))); if (qs.get('rfq')) setTimeout(() => $('#drop') && runRfq(), 600); }
  else if (qs.get('role') && D.users[qs.get('role')]) { state.role = qs.get('role'); rs.value = state.role; $('#avatar').textContent = me().ini; route(); }
  else if (!location.hash || location.hash === '#/dashboard') startScreen();
})();
