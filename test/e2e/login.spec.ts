import { test, expect } from '@playwright/test';

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? 'https://localhost:3001';
const adminUser = process.env.E2E_ADMIN_USER ?? 'admin';
const adminPass = process.env.E2E_ADMIN_PASS ?? 'p';

test.describe('Login', () => {
  test('Erfolgreicher Login', async ({ page }) => {
    if (!adminUser || !adminPass) {
      throw new Error('E2E_ADMIN_USER und/oder E2E_ADMIN_PASS fehlen in den Env-Variablen.');
    }

    await page.goto(`${baseUrl}/login`);

    await page.getByLabel('Benutzername').fill(adminUser);
    await page.getByLabel('Passwort').fill(adminPass);

    await page.getByRole('button', { name: /anmelden/i }).click();

    await expect(page).toHaveURL(/\/$/);

    await expect(page.getByText(new RegExp(`Hallo,\\s*${adminUser}`, 'i'))).toBeVisible();
  });

  test('Login mit falschen Eingaben', async ({ page }) => {
    await page.goto(`${baseUrl}/login`);

    await page.getByLabel('Benutzername').fill('admin');
    await page.getByLabel('Passwort').fill('falsch-falsch-falsch');

    await page.getByRole('button', { name: /anmelden/i }).click();

    await expect(page.getByText(/benutzername oder passwort sind falsch./i)).toBeVisible();

    await expect(page.getByText(/Hallo,/i)).toHaveCount(0);
  });
});
