import { test, expect, type Page } from '@playwright/test';

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? 'https://localhost:3001';

async function gotoBooks(page: Page) {
  await page.goto(`${baseUrl}/books`);
  await expect(page.getByRole('button', { name: /anwenden/i })).toBeVisible();
}

async function clickAnwenden(page: Page) {
  await page.getByRole('button', { name: /anwenden/i }).click();
}

async function setArt(page: Page, value: 'EPUB' | 'HARDCOVER' | 'PAPERBACK') {
  await page.getByLabel('Art').click();
  await page.getByRole('option', { name: value }).click();
}

async function setLieferbar(page: Page, checked: boolean) {
  const cb = page.getByRole('checkbox', { name: /buch ist lieferbar/i });
  if (checked) {
    await cb.check();
  } else {
    await cb.uncheck();
  }
}

async function setRating(page: Page, value: 1 | 2 | 3 | 4 | 5) {
  const container = page.locator('.MuiPaper-root', { hasText: /Rating/ }).first();

  await expect(container).toBeVisible();

  const labels = container.locator('label');
  const labelCount = await labels.count();

  if (labelCount >= value) {
    await labels.nth(value - 1).click();
    return;
  }
}

test.describe('Bücher – Suche: Tests pro Suchparameter', () => {
  test('Filter: Titel', async ({ page }) => {
    await gotoBooks(page);

    await page.getByLabel('Titel').fill('Alice');
    await clickAnwenden(page);

    await expect(page.getByText(/Alice/i)).toBeVisible();
    await expect(page.getByText(/Keine Treffer/i)).toHaveCount(0);
  });

  test('Filter: ISBN', async ({ page }) => {
    await gotoBooks(page);

    await page.getByLabel('ISBN').fill('978-3-897-22583-1');
    await clickAnwenden(page);

    await expect(page.getByText(/Alice/i)).toBeVisible();
    await expect(page.getByText(/Keine Treffer/i)).toHaveCount(0);
  });

  test('Filter: Art', async ({ page }) => {
    await gotoBooks(page);

    await setArt(page, 'EPUB');
    await clickAnwenden(page);

    await expect(page.getByText(/Alice/i)).toBeVisible();
    await expect(page.getByText(/Diana/i)).toBeVisible();
    await expect(page.getByText(/Keine Treffer/i)).toHaveCount(0);
  });

  test('Filter: Lieferbar', async ({ page }) => {
    await gotoBooks(page);

    await setLieferbar(page, true);
    await clickAnwenden(page);

    await expect(page.getByText(/Frank/i)).toHaveCount(0);

    await expect(page.getByText(/Alice/i)).toBeVisible();
  });

  test('Filter: Rating', async ({ page }) => {
    await gotoBooks(page);

    await setRating(page, 5);
    await clickAnwenden(page);

    await expect(page.getByText(/Kate/i)).toBeVisible();

    await expect(page.getByText(/Alice/i)).toHaveCount(0);
  });
});
