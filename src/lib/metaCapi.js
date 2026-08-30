/**
 * InitiateCheckout - pixel + CAPI z deduplikacją, bramkowany zgodą marketingową.
 *
 * Odpala się RAZ na załadowanie strony (flaga modułowa `icFired`), więc można
 * wołać z wielu miejsc (hero „Rozpocznij audyt", pasek mobilny, wybór branży) -
 * policzy się pierwsze realne zdarzenie. `event_id` jest wspólny dla pixela i CAPI,
 * dzięki czemu Meta liczy event tylko raz (dedup po event_id + event_name).
 *
 * Semantyka: IC = INTENCJA startu (klik „Rozpocznij"/wybór branży), łapana o krok
 * wcześniej niż dotąd. „Realny start" (1. odpowiedź) nadal mierzy EVENTS.AUDIT_START.
 */
import { hasConsent, trackPixel } from './consent';

let icFired = false;

function newEventId() {
    try {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    } catch {
        /* starsza przeglądarka - fallback niżej */
    }
    return 'ic-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

function readCookie(name) {
    if (typeof document === 'undefined') return undefined;
    const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : undefined;
}

/** _fbc z cookie, a jeśli brak - zrekonstruuj z fbclid w URL (format Meta). */
function resolveFbc() {
    const cookie = readCookie('_fbc');
    if (cookie) return cookie;
    const fbclid = new URLSearchParams(window.location.search).get('fbclid');
    return fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined;
}

/**
 * Odpal InitiateCheckout (pixel + CAPI). Idempotentne per załadowanie strony.
 * @param {{ source?: string }} [opts] - skąd padł start (hero_cta / sticky_cta / branza)
 */
export function fireInitiateCheckout({ source = 'quiz' } = {}) {
    if (typeof window === 'undefined' || icFired) return;
    // RODO: bez zgody marketingowej nie ruszamy ani pixela, ani CAPI. Nie ustawiamy
    // flagi - gdy user zaakceptuje później i wróci do startu, zdarzenie się policzy.
    if (!hasConsent('marketing')) return;
    icFired = true;

    const eventId = newEventId();
    const params = { content_name: 'mikro-audyt-ai' };

    // 1) Pixel kliencki - z eventID do deduplikacji z CAPI.
    trackPixel('InitiateCheckout', params, { eventId });

    // 2) CAPI server-side - łapie wizyty, gdzie pixel padł (in-app browser, iOS, adblock).
    //    Fire-and-forget; błąd nie może zablokować UI.
    try {
        const payload = JSON.stringify({
            event_name: 'InitiateCheckout',
            event_id: eventId,
            event_source_url: window.location.href,
            content_name: 'mikro-audyt-ai',
            source,
            fbp: readCookie('_fbp'),
            fbc: resolveFbc(),
        });
        if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/meta-capi', new Blob([payload], { type: 'application/json' }));
        } else {
            fetch('/api/meta-capi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payload,
                keepalive: true,
            }).catch(() => {});
        }
    } catch {
        /* no-op - telemetria nie może psuć UX */
    }
}

/** Reset dla „Zrób audyt jeszcze raz" - nowy cykl = nowy start liczony. */
export function resetInitiateCheckout() {
    icFired = false;
}
