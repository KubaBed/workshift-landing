/**
 * Analytics helper — thin wrapper around Vercel Analytics.
 *
 * Why a wrapper:
 * 1. `track()` import-błąd (ad blocker, network) nie powinien crashować
 *    handler-a klienta. Try/catch izoluje SDK od logiki biznesowej.
 * 2. Centralizuje nazwy eventów — chcemy je trzymać w jednym miejscu jako
 *    enum-podobne stałe, żeby uniknąć typo w stringach po całym codebase.
 * 3. Debug w localhost: `console.log` zamiast wysyłki, bez konfiguracji.
 *
 * Usage:
 *   import { track, EVENTS } from '../lib/analytics';
 *   track(EVENTS.CONTACT_FORM_SUBMIT, { hasCompany: true });
 */

import { track as vercelTrack } from '@vercel/analytics';

export const EVENTS = {
    CONTACT_FORM_SUBMIT: 'contact_form_submit',
    NEWSLETTER_SIGNUP: 'newsletter_signup',
    WHATSAPP_CLICK: 'whatsapp_click',
    CALENDAR_OPEN: 'calendar_open',
    SERVICE_CARD_CLICK: 'service_card_click',
    BLOG_READ_COMPLETE: 'blog_read_complete',
    CALCULATOR_STEP: 'calculator_step',
    CALCULATOR_COMPLETE: 'calculator_complete',
    CALCULATOR_CTA_CLICK: 'calculator_cta_click',
    AUDIT_VIEW: 'audit_view',
    AUDIT_START: 'audit_start',
    AUDIT_QUESTION_ANSWERED: 'audit_question_answered',
    AUDIT_COMPLETE: 'audit_complete',
    AUDIT_CTA_HOT: 'audit_cta_hot',
    AUDIT_CTA_WARM: 'audit_cta_warm',
    AUDIT_CTA_COLD: 'audit_cta_cold',
    LIBRARY_VIEW: 'library_view',
    LIBRARY_SEARCH: 'library_search',
    LIBRARY_TAB: 'library_tab',
    PROMPT_COPY: 'prompt_copy',
    PROMPT_OPEN: 'prompt_open',
    PERSONA_OPEN: 'persona_open',
    PERSONA_COPY: 'persona_copy',
    LIBRARY_ONLY_PL: 'library_only_pl',
};

/**
 * Send custom event to Vercel Analytics.
 *
 * @param {string} name  - Event name (use EVENTS constants).
 * @param {object} [props] - Optional event properties. Vercel akceptuje
 *                           proste typy (string/number/boolean). Filtruje
 *                           złożone wartości żeby SDK nie wyrzucił błędu.
 */
export function track(name, props = {}) {
    if (typeof window === 'undefined') return;

    // Filter complex types — Vercel Analytics przyjmuje tylko proste primitywy.
    const safeProps = {};
    for (const [k, v] of Object.entries(props)) {
        if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
            safeProps[k] = v;
        }
    }

    if (window.location.hostname === 'localhost') {
        // Dev mode: log do konsoli zamiast wysyłki. Łatwiej debug bez wpadania
        // w realne metryki produkcji.
        // eslint-disable-next-line no-console
        console.log('[analytics]', name, safeProps);
        return;
    }

    try {
        vercelTrack(name, safeProps);
    } catch (err) {
        // SDK nie załadowany (ad blocker / network) → nie blokuj user flow.
        // eslint-disable-next-line no-console
        console.warn('[analytics] track failed:', err);
    }
}
