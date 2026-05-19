// @ts-check
const { test } = require('@playwright/test');
const path = require('path');

const OUT = path.join(__dirname, '..', 'docs', 'screenshots');

test.describe('Capture manual screenshots', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('capture all screens for USER_MANUAL appendix', async ({ page }) => {
    await page.goto('/');

    await page.screenshot({ path: path.join(OUT, '01-welcome.png'), fullPage: true });

    await page.fill('#player-name', 'Alex Tester');
    await page.fill('#player-school', 'Cankaya University');
    await page.getByRole('button', { name: /Start Mission/i }).click();

    await page.evaluate(() => {
      GameState.tutorialSlide = 2;
      renderTutorial();
    });
    await page.screenshot({ path: path.join(OUT, '02-tutorial-categories.png'), fullPage: true });

    await page.evaluate(() => {
      GameState.tutorialSlide = 3;
      renderTutorial();
    });
    await page.screenshot({ path: path.join(OUT, '03-tutorial-clause4.png'), fullPage: true });

    await page.getByRole('button', { name: /Skip/i }).click();
    await page.waitForSelector('#phase1:not(.hidden)');
    await page.screenshot({ path: path.join(OUT, '04-phase1-classify.png'), fullPage: true });

    await page.evaluate(() => showScreen('phase2'));
    await page.evaluate(() => renderPhase2Scenario());
    await page.waitForSelector('#phase2-content .scenario-card');
    await page.screenshot({ path: path.join(OUT, '06-phase2-scenario.png'), fullPage: true });

    await page.evaluate(() => showScreen('phase3'));
    await page.evaluate(() => renderPhase3Scenario());
    await page.waitForSelector('#phase3-content .project-card, #phase3-content .glass-card');
    await page.screenshot({ path: path.join(OUT, '07-phase3-strategy.png'), fullPage: true });

    await page.evaluate(() => goToPhase4());
    await page.waitForSelector('#phase4-content .coverage-item, #phase4-content .glass-card');
    await page.screenshot({ path: path.join(OUT, '08-phase4-testcases.png'), fullPage: true });

    await page.evaluate(() => {
      GameState.phase1Score = 95;
      GameState.phase2Score = 165;
      GameState.phase3Score = 88;
      GameState.phase4Score = 40;
      GameState.misconceptionsEncountered = [
        'EP and BVA are NOT mutually exclusive — they are complementary techniques designed to be used together.'
      ];
      GameState.phase3Insights = [
        'Safety-critical systems demand the most rigorous techniques. MC/DC is often REQUIRED by safety standards, not optional.'
      ];
      showResults();
    });
    await page.waitForSelector('#results:not(.hidden)');
    await page.screenshot({ path: path.join(OUT, '09-results.png'), fullPage: true });

    await page.locator('#ref-panel-btn').click();
    await page.waitForSelector('#reference-panel:not(.hidden)');
    await page.screenshot({ path: path.join(OUT, '10-glossary.png'), fullPage: true });
  });
});
