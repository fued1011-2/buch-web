import { test, expect } from '@playwright/test';

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? 'https://localhost:3001';
const adminUser = process.env.E2E_ADMIN_USER ?? 'admin';
const adminPass = process.env.E2E_ADMIN_PASS ?? 'p';

const isbnValue = '968-92-95055-02-8';

async function login(page: any) {
  await page.goto(`${baseUrl}/login`);
  await page.getByLabel('Benutzername').fill(adminUser);
  await page.getByLabel('Passwort').fill(adminPass);
  await page.getByRole('button', { name: /anmelden/i }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText(new RegExp(`Hallo,\\s*${adminUser}`, 'i'))).toBeVisible();
}

test.describe('Neu anlegen', () => {
  test('Validierung: Pflichtfelder -> Feldfehler sichtbar, Speichern deaktiviert', async ({ page }) => {
    await login(page);

    await page.goto(`${baseUrl}/books/new`);
    await expect(page.getByRole('heading', { name: /neues buch anlegen/i })).toBeVisible();

    const saveBtn = page.getByRole('button', { name: /^speichern$/i });
    await expect(saveBtn).toBeDisabled();

    const titel = page.getByLabel(/titel/i);
    await titel.click();
    await page.getByLabel(/isbn/i).click();

    await expect(page.getByText(/titel.*pflicht|pflichtfeld.*titel/i)).toBeVisible();

    const preis = page.getByLabel(/preis/i);
    await preis.click();
    await page.getByLabel(/isbn/i).click();
    await expect(page.getByText(/preis.*pflicht|pflichtfeld.*preis/i)).toBeVisible();
  });

  test('Erfolgreich anlegen führt zur Detailseite und zeigt Success-Heading', async ({ page }) => {
    await login(page);

    await page.goto(`${baseUrl}/books/new`);
    await expect(page.getByRole('heading', { name: /neues buch anlegen/i })).toBeVisible();

    const titelValue = `E2E Book ${Date.now()}`;

    await page.getByLabel(/titel/i).fill(titelValue);
    await page.getByLabel(/isbn/i).fill(isbnValue);
    await page.getByLabel(/preis/i).fill('12,34');
    await page.getByLabel(/rabatt/i).fill('10');
    await page.getByLabel(/homepage/i).fill('https://example.com');
    
    await page.locator('input[type="date"]').fill('2025-02-01');

    const artSelect = page.getByLabel(/^art$/i);
    await artSelect.click();
    await page.getByRole('option', { name: /epub/i }).click();

    await Promise.all([
        page.waitForURL(/\/books\/\d+(\?.*)?$/, { timeout: 60_000 }),
        page.getByRole('button', { name: /speichern/i }).click(),
    ]);

    await expect(page.getByRole('heading', { name: /neues buch erfolgreich angelegt!/i })).toBeVisible({ timeout: 60_000 });

    await expect(page.getByText(new RegExp(titelValue, 'i'))).toBeVisible();
    await expect(page.getByText(new RegExp(isbnValue.replace(/[-]/g, '[-\\s]*'), 'i'))).toBeVisible();
  });
});
