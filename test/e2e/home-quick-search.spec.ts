import { test, expect } from '@playwright/test';

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? 'https://localhost:3001';

test.describe('Homepage – Quick Search', () => {
  test('Suche nach Titel über Homepage', async ({ page }) => {
    await page.goto(`${baseUrl}/`);

    await page.getByPlaceholder('Suchen').fill('Alice');

    await page.getByRole('radio', { name: /titel/i }).check();

    await page.getByRole('button', { name: /^suchen$/i }).click();

    await expect(page).toHaveURL(/\/books/);

    await expect(page.getByText(/Alice/i)).toBeVisible();
  });

  test('Suche nach ISBN über Homepage', async ({ page }) => {
    await page.goto(`${baseUrl}/`);

    await page.getByPlaceholder('Suchen').fill('978-3-897-22583-1');

    await page.getByRole('radio', { name: /isbn/i }).check();

    await page.getByRole('button', { name: /^suchen$/i }).click();

    await expect(page).toHaveURL(/\/books/);

    await expect(page.getByText(/978-3-897-22583-1/)).toBeVisible();
  });
});
