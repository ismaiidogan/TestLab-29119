// @ts-check
const { test } = require('@playwright/test');
const path = require('path');

const OUT = path.join(__dirname, '..', 'docs', 'screenshots');

/** Light theme, no animations, fonts loaded — crisp documentation captures. */
async function prepareDocScreenshot(page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
      }
    `,
  });
  await page.evaluate(() => {
    localStorage.setItem('testlab_theme', 'light');
    document.documentElement.setAttribute('data-theme', 'light');
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.innerText = '🌙';
  });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
}

/**
 * Viewport capture (navbar + screen). Avoids fullPage shrinking in PDF.
 * @param {import('@playwright/test').Page} page
 * @param {string} filename
 */
async function captureViewport(page, filename) {
  await prepareDocScreenshot(page);
  await page.screenshot({
    path: path.join(OUT, filename),
    type: 'png',
    fullPage: false,
    animations: 'disabled',
  });
}

/**
 * Element capture at 2x — use when screen content is taller than the viewport.
 * @param {import('@playwright/test').Page} page
 * @param {string} selector
 * @param {string} filename
 */
async function captureElement(page, selector, filename) {
  await prepareDocScreenshot(page);
  const el = page.locator(selector);
  await el.waitFor({ state: 'visible' });
  await el.screenshot({
    path: path.join(OUT, filename),
    type: 'png',
    animations: 'disabled',
  });
}

test.describe('Capture manual screenshots', () => {
  test.use({
    viewport: { width: 1440, height: 960 },
    deviceScaleFactor: 2,
  });

  test('capture all screens for USER_MANUAL appendix', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#welcome:not(.hidden)');

    await captureViewport(page, '01-welcome.png');

    await page.fill('#player-name', 'Alex Tester');
    await page.fill('#player-school', 'Cankaya University');
    await page.getByRole('button', { name: /Start Mission/i }).click();
    await page.waitForSelector('#tutorial:not(.hidden)');

    await page.evaluate(() => {
      GameState.tutorialSlide = 2;
      renderTutorial();
    });
    await captureViewport(page, '02-tutorial-categories.png');

    await page.evaluate(() => {
      GameState.tutorialSlide = 3;
      renderTutorial();
    });
    await captureViewport(page, '03-tutorial-clause4.png');

    await page.getByRole('button', { name: /Skip/i }).click();
    await page.waitForSelector('#phase1:not(.hidden)');
    await captureElement(page, '#phase1', '04-phase1-classify.png');

    await page.evaluate(() => showScreen('phase2'));
    await page.evaluate(() => renderPhase2Scenario());
    await page.waitForSelector('#phase2-content .scenario-card');
    await captureViewport(page, '05-phase2-scenario.png');

    await page.evaluate(() => showScreen('phase3'));
    await page.evaluate(() => renderPhase3Scenario());
    await page.waitForSelector('#phase3-content .project-card, #phase3-content .glass-card');
    await captureElement(page, '#phase3', '07-phase3-strategy.png');

    await page.evaluate(() => goToPhase4());
    await page.waitForSelector('#phase4-content .coverage-item, #phase4-content .glass-card');
    await captureViewport(page, '08-phase4-testcases.png');

    await page.evaluate(() => {
      GameState.phase1Score = 95;
      GameState.phase2Score = 165;
      GameState.phase3Score = 88;
      GameState.phase4Score = 40;
      GameState.misconceptionsEncountered = [
        'EP and BVA are NOT mutually exclusive — they are complementary techniques designed to be used together.',
      ];
      GameState.phase3Insights = [
        'Safety-critical systems demand the most rigorous techniques. MC/DC is often REQUIRED by safety standards, not optional.',
      ];
      showResults();
    });
    await page.waitForSelector('#results:not(.hidden)');
    await captureElement(page, '#results', '09-results.png');

    await page.locator('#ref-panel-btn').click();
    await page.waitForSelector('#reference-panel:not(.hidden)');
    await captureViewport(page, '10-glossary.png');
  });
});
