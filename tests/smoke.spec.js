// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('TestLab 29119 smoke', () => {
  test('welcome screen loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'TestLab 29119', level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: /Start Mission/i })).toBeVisible();
  });

  test('skip tutorial reaches phase 1', async ({ page }) => {
    await page.goto('/');
    await page.fill('#player-name', 'Playwright Tester');
    await page.getByRole('button', { name: /Start Mission/i }).click();
    await page.getByRole('button', { name: /Skip/i }).click();
    await expect(page.locator('#phase1')).toBeVisible();
    await expect(page.locator('#phase1-counter')).toContainText('/ 15');
  });

  test('tutorial last slide mentions four phases', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Start Mission/i }).click();
    for (let i = 0; i < 5; i++) {
      await page.getByRole('button', { name: /Next/i }).click();
    }
    await expect(page.locator('#tutorial-content')).toContainText('4 phases');
    await expect(page.locator('#tutorial-content')).toContainText('Phase 4');
  });

  test('reference glossary opens', async ({ page }) => {
    await page.goto('/');
    await page.locator('#ref-panel-btn').click();
    await expect(page.locator('#reference-panel')).toBeVisible();
    await expect(page.locator('#ref-list')).toBeVisible();
  });
});
