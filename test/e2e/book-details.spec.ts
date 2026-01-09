import { test, expect } from '@playwright/test';

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? 'https://localhost:3001';
const EXISTING_TITLE = process.env.E2E_BOOK_TITLE ?? 'Alice';

async function openDetailsFromSearch(page: any, title: string) {
  await page.goto(`${baseUrl}/books`);

  await page.getByLabel('Titel').fill(title);
  await page.getByRole('button', { name: /anwenden/i }).click();

  await expect(page.getByText(title, { exact: false })).toBeVisible();

  const card = page
    .locator('.MuiPaper-root, .MuiCard-root')
    .filter({ has: page.getByText(title, { exact: false }) })
    .first();

  await expect(card).toBeVisible();

  const details = card.locator('a:has-text("DETAILS ANZEIGEN")');

  await expect(details.first()).toBeVisible();

  await details.first().click();

  await expect(page).toHaveURL(/\/books\/\d+(\?.*)?$/);
}

test.describe('Detailanzeige', () => {
  test('Von der Suche zur Detailseite', async ({ page }) => {
    await openDetailsFromSearch(page, EXISTING_TITLE);

    await expect(
      page.getByRole('heading', { name: /detailansicht|neues buch erfolgreich angelegt/i }),
    ).toBeVisible();

    await expect(page.getByText(EXISTING_TITLE, { exact: false })).toBeVisible();

    await expect(page.getByText(/ISBN:/i)).toBeVisible();
    await expect(page.getByText(/ART:/i)).toBeVisible();
    await expect(page.getByText(/PREIS:/i)).toBeVisible();
    await expect(page.getByText(/RABATT:/i)).toBeVisible();
    await expect(page.getByText(/LIEFERBAR:/i)).toBeVisible();
    await expect(page.getByText(/DATUM:/i)).toBeVisible();
    await expect(page.getByText(/HOMEPAGE:/i)).toBeVisible();
  });

  test('Zurück-Button bringt zurück zur Suche', async ({ page }) => {
    await openDetailsFromSearch(page, EXISTING_TITLE);

    const backBtn = page.getByRole('button', { name: /zurück/i });
    await expect(backBtn).toBeVisible();
    await backBtn.click();

    await expect(page).toHaveURL(/\/books(\?.*)?$/);
    await expect(page.getByRole('heading', { name: /suchfilter festlegen/i })).toBeVisible();
  });
});
