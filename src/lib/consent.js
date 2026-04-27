/**
 * Consent management — RODO/GDPR compliant.
 *
 * Strategia: block-by-default. Skrypty analityczne (GA4 + Clarity) ładują
 * się DOPIERO po jawnej zgodzie usera. Vercel Analytics (cookieless) leci
 * od razu — nie wymaga consent.
 *
 * Przechowywanie: localStorage z wersją (CONSENT_VERSION). Bump wersji
 * gdy zmienisz zakres cookies = wszyscy userzy znów zobaczą banner.
 *
 * Granularność: 2 kategorie poza "necessary":
 *   - analytics: GA4 (page views, events, demographics)
 *   - recordings: Microsoft Clarity (heatmaps, session replay)
 *
 * API:
 *   getConsent()                  → { analytics, recordings, timestamp, version } | null
 *   setConsent({ analytics, recordings })  → zapisz + załaduj/wyłącz skrypty
 *   hasConsent('analytics')       → boolean
 *   onConsentChange(handler)      → subscribe (returns unsubscribe)
 */

const STORAGE_KEY = 'workshift_consent';
export const CONSENT_VERSION = 1;

const GA4_ID = 'G-B6VJVVFPLR';
const CLARITY_ID = 'wifxjjszyz';

// Custom event name dla cross-component communication.
const CHANGE_EVENT = 'workshift:consent-change';

export function getConsent() {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        // Stale version = traktuj jak brak consent (re-prompt usera).
        if (parsed.version !== CONSENT_VERSION) return null;
        return parsed;
    } catch {
        return null;
    }
}

export function hasConsent(category) {
    const c = getConsent();
    return !!(c && c[category]);
}

export function setConsent({ analytics = false, recordings = false } = {}) {
    const value = {
        analytics,
        recordings,
        timestamp: Date.now(),
        version: CONSENT_VERSION,
    };
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
        // Private mode / quota exceeded — nadal stosuj ustawienia w session.
    }

    if (analytics) loadGA4();
    if (recordings) loadClarity();
    // Note: nie odładowujemy skryptów po withdrawal — wymagałoby reload.
    // Banner pokazuje to userowi i sugeruje refresh.

    // Emit event dla innych komponentów (np. footer link "zmień zgodę").
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: value }));
}

export function onConsentChange(handler) {
    const wrapped = (e) => handler(e.detail);
    window.addEventListener(CHANGE_EVENT, wrapped);
    return () => window.removeEventListener(CHANGE_EVENT, wrapped);
}

/** Otwórz banner z dowolnego miejsca (np. link w stopce). */
export function openConsentBanner() {
    window.dispatchEvent(new CustomEvent('workshift:consent-open'));
}

// ─── Dynamic script loaders ────────────────────────────────────────────

function loadOnce(id, injector) {
    if (document.getElementById(id)) return;
    injector(id);
}

function loadGA4() {
    loadOnce('ga4-loader', (id) => {
        // gtag.js loader
        const s = document.createElement('script');
        s.id = id;
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
        document.head.appendChild(s);

        // Inline init
        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', GA4_ID, { anonymize_ip: true });
    });
}

function loadClarity() {
    loadOnce('clarity-loader', () => {
        // Original Clarity snippet, just dropped into body programmatically.
        (function (c, l, a, r, i, t, y) {
            c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
            t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
            t.id = 'clarity-loader';
            y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
        })(window, document, 'clarity', 'script', CLARITY_ID);
    });
}

/**
 * Wywołaj raz przy bootstrapie aplikacji — jeśli user już zaakceptował
 * w poprzedniej wizycie, załaduj skrypty od razu (bez wyświetlania bannera).
 */
export function bootstrapConsent() {
    const c = getConsent();
    if (!c) return;
    if (c.analytics) loadGA4();
    if (c.recordings) loadClarity();
}
