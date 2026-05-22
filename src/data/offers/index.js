// Klientowy entry point — uwaga: w nowej architekturze (post-2026-05-22)
// dane ofert NIE są już importowane do bundle frontendu.
// Frontend fetchuje je przez `/api/offers/get?slug=...` z httpOnly cookie
// ustawianym przez `/api/offers/verify`.
//
// Ten plik zostaje jako miejsce na klientowe helpery (np. format helpers)
// jeśli kiedyś będą potrzebne. Aktualnie pusty.

export const OFFERS_LOADED_FROM = 'api';
