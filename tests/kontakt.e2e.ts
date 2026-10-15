import { describe, test } from '@e2e-dev/web';
import { expect } from 'e2e';

describe('formularz kontaktowy', { tags: ['kontakt'] }, () => {
  test('wysyla imie, email i wiadomosc na /api/send-email', async ({ app, browser, screen }) => {
    let payload: Record<string, string> | null = null;

    // Stub zamiast prawdziwego Resend: lapiemy zadanie i zwracamy sukces.
    await browser.route('**/api/send-email', async (route) => {
      payload = JSON.parse(route.request.postData ?? '{}');
      await route.fulfill({ status: 200, json: { success: true } });
    });

    await app.open('/');
    await browser.locator('#kontakt').scrollIntoView();

    await screen.getByLabel('Imię', { exact: false }).fill('Jan Testowy');
    await screen.getByLabel('E-mail', { exact: false }).fill('jan@firma.pl');
    await screen.getByLabel('Firma', { exact: false }).fill('Firma Testowa');
    await screen.getByLabel('Wiadomość', { exact: false }).fill('Test e2e: ktore procesy zautomatyzowac.');
    await browser.locator('#privacy-checkbox').check();

    await screen.getByRole('button', 'Wyślij wiadomość').tap();

    await expect(screen.getByText('Dziękujemy!')).toBeVisible();

    // To jest wlasciwy test. Komponent pokazuje sukces na localhost nawet gdy
    // fetch padnie (bypass `hostname === "localhost"` w ContactSection.jsx),
    // wiec samo "Dziekujemy!" niczego nie dowodzi. Payload dowodzi.
    expect(payload).toMatchObject({
      name: 'Jan Testowy',
      email: 'jan@firma.pl',
      company: 'Firma Testowa',
      message: 'Test e2e: ktore procesy zautomatyzowac.',
    });
  });

  test('przycisk jest zablokowany do zgody RODO', async ({ app, browser, screen }) => {
    await app.open('/');
    await browser.locator('#kontakt').scrollIntoView();

    await expect(screen.getByRole('button', 'Wyślij wiadomość')).toBeDisabled();
    await browser.locator('#privacy-checkbox').check();
    await expect(screen.getByRole('button', 'Wyślij wiadomość')).toBeEnabled();
  });
});
