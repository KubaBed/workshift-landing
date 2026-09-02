/**
 * Publikacja postów z bloga na Facebook Page + Instagram (Graph API).
 *
 * Co robi:
 *  - FB feed: PLANUJE natywnie (scheduled_publish_time) - jedno uruchomienie
 *    ustawia wszystkie posty, Meta publikuje o czasie. Link w treści posta.
 *  - IG feed + Stories: Graph API NIE planuje - publikacja jest natychmiastowa.
 *    Skrypt publikuje pozycje, których `publishAt` już minął, a które nie są
 *    w pliku stanu (.social-state.json). Uruchamiaj z crona (np. co 15 min)
 *    albo ręcznie. Po publikacji feedu dodaje link jako pierwszy komentarz.
 *
 * Obrazki: IG wymaga PUBLICZNEGO URL-a - dlatego grafiki leżą w public/social/
 * i są serwowane z workshift.pl/social/... (muszą być wdrożone PRZED runem).
 *
 * Wymagane env (.env.local, NIE commitować):
 *  - SOCIAL_ACCESS_TOKEN  token użytkownika/systemowy ze scope:
 *      pages_manage_posts, pages_read_engagement, instagram_basic,
 *      instagram_content_publish, business_management
 *  - SOCIAL_PAGE_ID       (opcjonalnie) ID strony FB; bez tego skrypt
 *                         wylistuje strony dostępne dla tokenu.
 *  - SOCIAL_ASSET_BASE    (opcjonalnie) baza URL obrazków,
 *                         domyślnie https://workshift.pl/social
 *
 * Tryby:
 *  node --env-file=.env.local scripts/social-posts.js --plan       # tylko pokazuje harmonogram
 *  node --env-file=.env.local scripts/social-posts.js --fb         # planuje wszystkie posty FB
 *  node --env-file=.env.local scripts/social-posts.js --ig         # publikuje dojrzałe IG (feed+story) - do crona
 *  node --env-file=.env.local scripts/social-posts.js --ig --force <slug>  # publikuje 1 pozycję IG od razu
 */

import fs from 'node:fs';
import path from 'node:path';

const API = 'https://graph.facebook.com/v21.0';
const TOKEN = process.env.SOCIAL_ACCESS_TOKEN;
const ASSET_BASE = (process.env.SOCIAL_ASSET_BASE || 'https://workshift.pl/social').replace(/\/$/, '');
const STATE_FILE = path.join(process.cwd(), '.social-state.json');
const BLOG_BASE = 'https://workshift.pl/blog';

if (!TOKEN) {
    console.error('Brak SOCIAL_ACCESS_TOKEN. node --env-file=.env.local scripts/social-posts.js --plan');
    process.exit(1);
}

// ── Harmonogram: 3 posty/tydz (wt/czw/sob) 10:00 Europe/Warsaw ──────────────
// publishAt w ISO z offsetem +02:00 (CEST). Skoryguj daty do woli.
const POSTS = [
    { slug: 'o-co-chodzi-z-tymi-agentami', img: 'WS-post-03-agenci-1080x1080.png', story: 'WS-story-03-agenci-1080x1920.png', publishAt: '2026-07-14T10:00:00+02:00',
      fb: 'Każdy software house, startup i LinkedInowy guru „buduje agenta AI". Tylko że za tym pojęciem stoi zwykle cokolwiek - od chatbota po Excela z dopiętym ChatemGPT. A różnica ma znaczenie, jeśli masz za to zapłacić.\n\nRozłożyłem „agenta" na czynniki pierwsze - konkretnie, bez infantylizacji.',
      ig: '„Buduję agenta AI" 😎 - mówi każdy. A to zwykle chatbot albo Excel z ChatemGPT.\n\nRozkładam pojęcie „agent" na czynniki pierwsze. Co nim jest, a co tylko udaje.\n\n🔗 Cały wpis - link w komentarzu 👇\n.\n#AI #agentAI #automatyzacja #sztucznainteligencja #MŚP #biznes #technologia' },

    { slug: 'zatrudnie-juniora-ai', img: 'WS-post-07-junior-1080x1080.png', story: 'WS-story-07-junior-1080x1920.png', publishAt: '2026-07-16T10:00:00+02:00',
      fb: 'Zatrudnię juniora za 2000$ miesięcznie. Pracuje 24/7, nie bierze L4, nie zapomina o zadaniach.\n\nTwist? To agent AI.\n\nPokazuję junior.so i nową rzeczywistość, w której część powtarzalnej roboty przejmują agenci - i co to znaczy dla małej i średniej firmy.',
      ig: 'Junior, który pracuje 24/7 i nigdy nie bierze L4. 🤖\n\nTwist: to agent AI. Poznaj junior.so i nową rzeczywistość automatyzacji pracy.\n\n🔗 Cały wpis - link w komentarzu 👇\n.\n#AI #agentAI #automatyzacja #sztucznainteligencja #MŚP #biznes #praca' },

    { slug: 'vibe-coding-demokratyzacja-software', img: 'WS-post-06-vibe-coding-1080x1080.png', story: 'WS-story-06-vibe-coding-1080x1920.png', publishAt: '2026-07-18T10:00:00+02:00',
      fb: '„AI w rękach laików to budowa domu narzędziami z Lidla." Słyszę ten argument często. I się z nim nie zgadzam - bo „good enough" dowiezione dzisiaj zwykle bije perfekcję, która nigdy nie wychodzi poza prezentację.\n\nO demokratyzacji tworzenia oprogramowania i sile szybkiego MVP.',
      ig: '„Good enough" dzisiaj > perfekcja, która nigdy nie wychodzi. 🚀\n\nVibe-coding i demokratyzacja tworzenia software\'u - szansa czy problem?\n\n🔗 Link w komentarzu 👇\n.\n#AI #MVP #startup #biznes #nocode #software #innowacje #przedsiębiorczość' },

    { slug: 'pomelli-od-dzis-w-eu', img: 'WS-post-04-pomelli-1080x1080.png', story: 'WS-story-04-pomelli-1080x1920.png', publishAt: '2026-07-21T10:00:00+02:00',
      fb: 'Koniec z szukaniem „logo_final_final_v2.png" po dyskach. 🎨\n\nPomelli od Google jest już dostępne w UE. Pobiera branding wprost z Twojej strony WWW i automatycznie generuje kreacje reklamowe oraz grafiki na social media - spójne z Twoją identyfikacją.\n\nSprawdziłem, jak działa i dla kogo to realna oszczędność czasu.',
      ig: '„logo_final_final_v2.png" - brzmi znajomo? 😅\n\nPomelli od Google (już w UE) bierze branding z Twojej strony i sam robi grafiki social media i reklamy.\n\n🔗 Link w komentarzu 👇\n.\n#AI #marketing #branding #socialmedia #MŚP #grafika #automatyzacja' },

    { slug: 'google-turboquant-kompresja-ai', img: 'WS-post-05-turboquant-1080x1080.png', story: 'WS-story-05-turboquant-1080x1920.png', publishAt: '2026-07-23T10:00:00+02:00',
      fb: 'Potężne AI działające offline, na samym telefonie - bez wysyłania czegokolwiek do chmury?\n\nGoogle zaprezentowało TurboQuant: algorytm bezstratnej kompresji KV cache. W praktyce - szybsze i bardziej prywatne AI działające lokalnie na urządzeniu.\n\nWyjaśniam, co to zmienia dla prywatności i szybkości.',
      ig: 'Mocne AI na samym telefonie, offline? 📱\n\nGoogle TurboQuant - kompresja, która mieści duże modele na urządzeniu. Szybciej i prywatniej.\n\n🔗 Link w komentarzu 👇\n.\n#AI #prywatność #sztucznainteligencja #technologia #innowacje #Google #ondevice' },

    { slug: 'polskie-modele-pllum-w-firmie', img: 'WS-post-02-pllum-1080x1080.png', story: 'WS-story-02-pllum-1080x1920.png', publishAt: '2026-07-25T10:00:00+02:00',
      fb: 'Wysyłasz firmowe dane do amerykańskich modeli AI? Jest polska alternatywa.\n\nMinisterstwo Cyfryzacji wypuściło nową odsłonę PLLuM: 11 modeli w 4 rozmiarach, wszystkie po polsku, wszystkie do lokalnych wdrożeń (dane nie opuszczają Twojej infrastruktury).\n\nTłumaczę, który rozmiar do czego pasuje - także pod kątem RODO.',
      ig: 'Dane firmy lecą do USA za każdym zapytaniem do AI? 🇵🇱\n\nPLLuM od Ministerstwa Cyfryzacji: 11 polskich modeli do wdrożenia lokalnie. Dane zostają u Ciebie.\n\n🔗 Link w komentarzu 👇\n.\n#AI #RODO #PLLuM #sztucznainteligencja #MŚP #bezpieczeństwodanych #polskieAI' },

    { slug: 'open-knowledge-format-google-cloud', img: 'WS-post-01-open-knowledge-format-1080x1080.png', story: 'WS-story-01-open-knowledge-format-1080x1920.png', publishAt: '2026-07-28T10:00:00+02:00',
      fb: '„Nasze AI nic nie wie o naszej firmie" - słyszę to na co drugim spotkaniu.\n\nGoogle Cloud wypuściło Open Knowledge Format: otwartą specyfikację, jak podać agentowi AI wiedzę o firmie. Zero SDK, zero vendor lock-in - katalog plików markdown, które agent czyta jak dokumentację.\n\nCo to znaczy dla polskiej firmy - w środku.',
      ig: 'Twoje AI nie wie nic o Twojej firmie? 🧠\n\nGoogle Cloud pokazało Open Knowledge Format - wiedza firmowa dla agenta bez żadnego SDK. Katalog plików markdown i tyle.\n\n🔗 Cały wpis - link w komentarzu 👇\n.\n#AI #automatyzacja #sztucznainteligencja #MŚP #agentAI #biznes #GoogleCloud' },

    // ── Wydarzenie: prelekcja ai use_case 11.08.2026 ────────────────────────
    // Pozycja wydarzeniowa: własny `link` (zapisy na Lumie) zamiast wpisu na blogu,
    // oraz osobna grafika na FB (16:9 od organizatora) niż na IG (1:1 w brandzie WS).
    { slug: 'ai-use-case-11-08', img: 'WS-post-08-aiusecase-1080x1080.png', fbImg: 'WS-event-aiusecase-fb.jpg',
      story: 'WS-story-08-aiusecase-1080x1920.png', publishAt: '2026-08-06T10:00:00+02:00',
      link: 'https://luma.com/sp9da9rc', linkLabel: '👉 Zapisy:',
      fb: 'Wiedza w firmie zwykle jest. Problem w tym, że siedzi w głowie jednej osoby, która akurat jest na urlopie. 🌴\n\nA że sezon urlopowy w pełni, to zapraszam 11 sierpnia na ai use_case, gdzie opowiem, jak sobie z tym poradziłem (Pawel Sieczkiewicz, dzięki za zaproszenie).\nPrzyjdźcie pogadać po prelekcji i wymienić się doświadczeniami.\n\nA jeżeli chodzi o konkrety:\n- Po pierwsze, firmowa baza wiedzy zbudowana z tego, co firma i tak już miała. Blog, stare oferty, transkrypty rozmów z klientami, stawki opłat. Nic nowego nie trzeba było pisać, trzeba było to poukładać. W efekcie, cały zespół odpowiada klientom tak samo, niezależnie od tego, kto odbiera telefon.\n- Po drugie, inny problem, ale ta sama choroba. Każda kancelaria to zna: dokumenty przychodzą mailem jako skany, często niewyraźne zdjęcia zrobione telefonem pod kątem. O wersji edytowalnej można pomarzyć, więc nie da się znaleźć niczego, dopóki ktoś nie przejrzy tego ręcznie, strona po stronie.\nWdrożyliśmy OCR, który to rozwiązuje. Wysyłasz maila ze skanami na wewnętrzny adres, w odpowiedzi dostajesz plik z edytowalnym tekstem, obrobiony przez bezpieczny, lokalny model.\n\nOpowiem o tym, co zadziałało, ile trwało i gdzie się po drodze wyłożyłem.\n\n11 sierpnia, 18:00, Toast, Targowa 76, Warszawa.',
      ig: 'Wiedza w firmie zwykle jest. Tylko siedzi w głowie jednej osoby, która akurat jest na urlopie. 🌴\n\nA że sezon urlopowy w pełni - 11 sierpnia w Warszawie opowiem, jak sobie z tym poradziłem.\n\n🧠 Firmowa baza wiedzy zbudowana z tego, co firma i tak już miała: bloga, starych ofert, transkryptów rozmów z klientami. Cały zespół odpowiada klientom tak samo, niezależnie od tego, kto odbiera telefon.\n\n📄 OCR dla kancelarii. Wysyłasz maila ze skanami na wewnętrzny adres, w odpowiedzi dostajesz plik z edytowalnym tekstem - obrobiony przez bezpieczny, lokalny model.\n\nBez działu IT. Bez wdrożenia na pół roku.\n\nOpowiem, co zadziałało, ile trwało i gdzie się po drodze wyłożyłem. Przyjdźcie pogadać po prelekcji.\n\n📍 ai use_case · 11.08, 18:00 · Toast, Targowa 76, Warszawa\n\n🔗 Zapisy - link w komentarzu 👇\n.\n#AI #sztucznainteligencja #automatyzacja #MŚP #biznes #kancelaria #legaltech #bazawiedzy #OCR #Warszawa #wydarzenie #przedsiębiorczość' },
    // ── Wpis z 30.08: baza wiedzy, ktora przekonala sceptykow ────────────────
    // Link idzie w PIERWSZYM KOMENTARZU na obu kanalach (FB przez --fb-now).
    { slug: 'baza-wiedzy-ktora-przekonala-sceptykow', img: 'WS-post-09-baza-wiedzy-1080x1080.png', story: 'WS-story-09-baza-wiedzy-1080x1920.png', publishAt: '2026-08-30T10:00:00+02:00',
      fb: 'Sceptyka w zespole nie przekona prezentacja o agentach AI. Przekona go pierwszy moment, w którym coś realnie oszczędza mu czas.\n\nSpisałem całe nasze wdrożenie firmowej bazy wiedzy - uczciwie, z porażką włącznie. Baza poległa na najprostszym pytaniu świata: ile wynosi opłata roczna. W środku siedział stary wpis z bloga ze stawką 100 zł zamiast 200. Trafiło na nową osobę, która nie miała jak wiedzieć, że to nieaktualne.\n\nWe wpisie: z czego zbudowaliśmy bazę (nie napisaliśmy ani jednego nowego dokumentu), ile to naprawdę trwało i dlaczego akurat takie nudne wdrożenie przekonuje sceptyków szybciej niż ambitny projekt.',
      ig: 'Sceptyka w zespole nie przekona prezentacja o agentach AI. 🤷\n\nPrzekona go pierwszy moment, w którym coś realnie oszczędza mu czas.\n\nOpisałem nasze wdrożenie firmowej bazy wiedzy: co zadziałało, ile naprawdę trwało i na czym poległo. Na najprostszym pytaniu świata: ile wynosi opłata roczna. 100 zamiast 200 zł, stary wpis z bloga i nowa osoba, która nie miała jak wiedzieć.\n\nPlus rzecz, w którą naprawdę wierzę: takie z pozoru błahe wdrożenie robi dla adopcji AI więcej niż niejeden ambitny projekt.\n\n🔗 Cały wpis - link w komentarzu 👇\n.\n#AI #bazawiedzy #automatyzacja #sztucznainteligencja #MŚP #biznes #wdrożenieAI #NotebookLM' },

];

async function graph(pathname, { method = 'GET', params, token = TOKEN } = {}) {
    const url = new URL(API + pathname);
    if (method === 'GET' && params) for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    const body = method === 'POST' && params ? new URLSearchParams({ ...params, access_token: token }) : undefined;
    if (method === 'GET') url.searchParams.set('access_token', token);
    const res = await fetch(url, { method, body });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.error) {
        const e = json.error || {};
        throw new Error(`Graph ${method} ${pathname} → ${e.message || res.status} (code ${e.code ?? '?'})`);
    }
    return json;
}

function loadState() {
    try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); } catch { return {}; }
}
function saveState(s) { fs.writeFileSync(STATE_FILE, JSON.stringify(s, null, 2)); }

const imgUrl = (f) => `${ASSET_BASE}/${f}`;
// Domyślnie wpis na blogu. Pozycje wydarzeniowe podają własny `link` (np. zapisy na Lumie)
// oraz opcjonalnie `linkLabel` (etykieta przed URL-em w poście FB / komentarzu IG).
const linkFor = (p) => p.link || `${BLOG_BASE}/${p.slug}`;
const fbLinkLine = (p) => `${p.linkLabel || '📖'} ${linkFor(p)}`;
const igLinkLine = (p) => `${p.linkLabel ? p.linkLabel : 'Cały wpis 👉'} ${linkFor(p)}`;

// ── Discovery: strona FB + konto IG ─────────────────────────────────────────
async function resolveTargets() {
    const { data = [] } = await graph('/me/accounts', { params: { fields: 'id,name,access_token,instagram_business_account' } });
    if (!data.length) throw new Error('Token nie widzi żadnej strony FB. Sprawdź scope pages_show_list / pages_manage_posts.');
    let page = process.env.SOCIAL_PAGE_ID ? data.find((p) => p.id === process.env.SOCIAL_PAGE_ID) : (data.length === 1 ? data[0] : null);
    if (!page) {
        console.log('Wiele stron - ustaw SOCIAL_PAGE_ID na jedną z:');
        for (const p of data) console.log(`  ${p.id}  ${p.name}${p.instagram_business_account ? '  (IG: ' + p.instagram_business_account.id + ')' : '  (brak IG)'}`);
        process.exit(2);
    }
    return { pageId: page.id, pageToken: page.access_token, igId: page.instagram_business_account?.id || null };
}

// ── FB: zaplanuj wszystkie posty natywnie ───────────────────────────────────
async function scheduleFacebook({ pageId, pageToken }) {
    const state = loadState();
    for (const p of POSTS) {
        const key = `fb:${p.slug}`;
        if (state[key]) { console.log(`FB pominięty (już zaplanowany): ${p.slug}`); continue; }
        const ts = Math.floor(new Date(p.publishAt).getTime() / 1000);
        if (ts < Math.floor(Date.now() / 1000) + 600) { console.log(`FB pominięty (termin <10 min od teraz): ${p.slug}`); continue; }
        const res = await graph(`/${pageId}/photos`, {
            method: 'POST',
            token: pageToken,
            params: { url: imgUrl(p.fbImg || p.img), caption: `${p.fb}\n\n${fbLinkLine(p)}`, published: 'false', scheduled_publish_time: String(ts) },
        });
        state[key] = { id: res.id || res.post_id, at: p.publishAt };
        saveState(state);
        console.log(`FB zaplanowany: ${p.slug} → ${p.publishAt} (${res.id || res.post_id})`);
    }
}

// FB natychmiast + link w PIERWSZYM KOMENTARZU (zamiast w treści posta).
// Zaplanowanemu postowi nie da się dodać komentarza przed publikacją, więc ten
// tryb publikuje od razu i dopiero wtedy komentuje. Do postów, gdzie zależy nam
// na zasięgu - link w treści go obniża.
async function publishFacebookNow({ pageId, pageToken }, forceSlug) {
    const state = loadState();
    for (const p of POSTS) {
        if (forceSlug && p.slug !== forceSlug) continue;
        const key = `fb:${p.slug}`;
        if (state[key]) { console.log(`FB pominięty (już opublikowany/zaplanowany): ${p.slug}`); continue; }
        const res = await graph(`/${pageId}/photos`, {
            method: 'POST',
            token: pageToken,
            params: { url: imgUrl(p.fbImg || p.img), caption: p.fb, published: 'true' },
        });
        const postId = res.post_id || res.id;
        state[key] = { id: postId, at: new Date().toISOString(), mode: 'now' };
        saveState(state);
        console.log(`FB opublikowany: ${p.slug} (${postId})`);
        try {
            const c = await graph(`/${postId}/comments`, { method: 'POST', token: pageToken, params: { message: fbLinkLine(p) } });
            console.log(`  komentarz z linkiem dodany (${c.id})`);
        } catch (e) { console.log(`  (komentarz FB nie dodany: ${e.message})`); }
    }
}

// Kontener IG przetwarza się asynchronicznie - media_publish przed FINISHED
// zwraca code 9007 "Media ID is not available". Czekamy do skutku (max ~60 s).
async function waitForContainer(creationId) {
    for (let i = 0; i < 20; i++) {
        const { status_code } = await graph(`/${creationId}`, { params: { fields: 'status_code' } });
        if (status_code === 'FINISHED') return;
        if (status_code === 'ERROR') throw new Error(`Kontener ${creationId} w stanie ERROR (sprawdź URL/format obrazka).`);
        await new Promise((r) => setTimeout(r, 3000));
    }
    throw new Error(`Kontener ${creationId} nie osiągnął FINISHED w 60 s.`);
}

// ── IG: publikuj dojrzałe (feed + story), dodaj link w komentarzu ────────────
async function publishInstagram({ igId }, forceSlug) {
    if (!igId) throw new Error('Strona nie ma podpiętego konta IG Business. Podłącz IG w ustawieniach strony.');
    const state = loadState();
    const now = Date.now();
    for (const p of POSTS) {
        if (forceSlug && p.slug !== forceSlug) continue;
        const due = forceSlug || new Date(p.publishAt).getTime() <= now;
        if (!due) continue;

        // Feed
        const feedKey = `ig:${p.slug}`;
        if (!state[feedKey]) {
            const c = await graph(`/${igId}/media`, { method: 'POST', params: { image_url: imgUrl(p.img), caption: p.ig } });
            await waitForContainer(c.id);
            const pub = await graph(`/${igId}/media_publish`, { method: 'POST', params: { creation_id: c.id } });
            state[feedKey] = { id: pub.id, at: new Date().toISOString() };
            saveState(state);
            // Link jako pierwszy komentarz (IG nie lubi linków w caption).
            // BYŁO: linkFor(p.slug) - linkFor oczekuje obiektu posta, nie stringa.
            // Dla stringa `p.link` trafiało w String.prototype.link, więc komentarz
            // publikował się jako "Cały wpis 👉 function link() { [native code] }".
            try { await graph(`/${pub.id}/comments`, { method: 'POST', params: { message: igLinkLine(p) } }); } catch (e) { console.log(`  (komentarz IG nie dodany: ${e.message})`); }
            console.log(`IG feed opublikowany: ${p.slug} (${pub.id})`);
        }
        // Story
        const storyKey = `ig-story:${p.slug}`;
        if (!state[storyKey]) {
            const c = await graph(`/${igId}/media`, { method: 'POST', params: { image_url: imgUrl(p.story), media_type: 'STORIES' } });
            await waitForContainer(c.id);
            const pub = await graph(`/${igId}/media_publish`, { method: 'POST', params: { creation_id: c.id } });
            state[storyKey] = { id: pub.id, at: new Date().toISOString() };
            saveState(state);
            console.log(`IG story opublikowane: ${p.slug} (${pub.id})`);
        }
    }
}

// ── main ────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const forceSlug = has('--force') ? args[args.indexOf('--force') + 1] : null;

if (has('--plan') || args.length === 0) {
    console.log('Harmonogram (Europe/Warsaw):\n');
    for (const p of POSTS) console.log(`  ${p.publishAt}  ${p.slug}\n      FB: ${p.fb.split('\n')[0].slice(0, 70)}...\n      IG: ${p.ig.split('\n')[0].slice(0, 70)}...`);
    console.log('\nObrazki (muszą być wdrożone na workshift.pl/social/ PRZED publikacją):');
    console.log(`  baza: ${ASSET_BASE}`);
    console.log('\nUżycie: --fb (planuje FB, link w treści), --fb-now --force <slug> (FB od razu, link w komentarzu),');
    console.log('       --ig (publikuje dojrzałe IG, do crona), --ig --force <slug> (1 od razu)');
    process.exit(0);
}

const targets = await resolveTargets();
console.log(`Strona FB: ${targets.pageId}${targets.igId ? ` · IG: ${targets.igId}` : ' · brak IG'}\n`);
if (has('--fb')) await scheduleFacebook(targets);
if (has('--fb-now')) await publishFacebookNow(targets, forceSlug);
if (has('--ig')) await publishInstagram(targets, forceSlug);
console.log('\nGotowe. Stan zapisany w .social-state.json (idempotencja).');
