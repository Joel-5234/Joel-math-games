// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Challenge Mode Hints', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:8080');
        // Wait for page to load
        await page.waitForSelector('#modeSelector');
    });

    test('hint button should be visible in challenge mode', async ({ page }) => {
        // Select challenge mode
        await page.selectOption('#modeSelector', 'challenge');
        await page.waitForSelector('#challengeSetupModal');
        
        // Start a 5-question challenge
        await page.click('button[data-size="5"]');
        await page.waitForSelector('#challengeInterface', { state: 'visible' });
        
        // Check that hint button exists
        const hintButton = page.locator('#challengeHintButton');
        await expect(hintButton).toBeVisible();
        await expect(hintButton).toHaveText('💡 Get Hint');
    });

    test('hint count should display correctly', async ({ page }) => {
        // Select challenge mode
        await page.selectOption('#modeSelector', 'challenge');
        await page.waitForSelector('#challengeSetupModal');
        
        // Start a 5-question challenge
        await page.click('button[data-size="5"]');
        await page.waitForSelector('#challengeInterface', { state: 'visible' });
        
        // Check initial hint count
        const hintCount = page.locator('#challengeHintCount');
        await expect(hintCount).toBeVisible();
        await expect(hintCount).toHaveText('Hints: 0/5');
    });

    test('hint panel should appear when hint button is clicked', async ({ page }) => {
        // Select challenge mode
        await page.selectOption('#modeSelector', 'challenge');
        await page.waitForSelector('#challengeSetupModal');
        
        // Start a 5-question challenge
        await page.click('button[data-size="5"]');
        await page.waitForSelector('#challengeInterface', { state: 'visible' });
        
        // Click hint button
        await page.click('#challengeHintButton');
        
        // Check that hint panel is visible
        const hintPanel = page.locator('#challenge-hint-panel');
        await expect(hintPanel).toBeVisible();
        await expect(hintPanel).toHaveClass(/active/);
        
        // Check that hint content is displayed
        const hintContent = page.locator('#challenge-hint-content');
        await expect(hintContent).toBeVisible();
    });

    test('hint count should update when hint is used', async ({ page }) => {
        // Select challenge mode
        await page.selectOption('#modeSelector', 'challenge');
        await page.waitForSelector('#challengeSetupModal');
        
        // Start a 5-question challenge
        await page.click('button[data-size="5"]');
        await page.waitForSelector('#challengeInterface', { state: 'visible' });
        
        // Click hint button
        await page.click('#challengeHintButton');
        
        // Check that hint count updated
        const hintCount = page.locator('#challengeHintCount');
        await expect(hintCount).toHaveText('Hints: 1/5');
    });

    test('hint button should be disabled after 5 hints', async ({ page }) => {
        // Select challenge mode
        await page.selectOption('#modeSelector', 'challenge');
        await page.waitForSelector('#challengeSetupModal');
        
        // Start a 5-question challenge
        await page.click('button[data-size="5"]');
        await page.waitForSelector('#challengeInterface', { state: 'visible' });
        
        // Use 5 hints
        for (let i = 0; i < 5; i++) {
            await page.click('#challengeHintButton');
            // Close hint panel if open
            const closeButton = page.locator('[data-hint-panel="challenge-hint-panel"]');
            if (await closeButton.isVisible()) {
                await closeButton.click();
            }
            // Navigate to next question if not last
            if (i < 4) {
                await page.click('#challengeSkipBtn');
            }
        }
        
        // Check that hint button is disabled
        const hintButton = page.locator('#challengeHintButton');
        await expect(hintButton).toBeDisabled();
        
        // Check hint count shows limit reached
        const hintCount = page.locator('#challengeHintCount');
        await expect(hintCount).toHaveText('Hints: 5/5');
    });

    test('hint panel should close when close button is clicked', async ({ page }) => {
        // Select challenge mode
        await page.selectOption('#modeSelector', 'challenge');
        await page.waitForSelector('#challengeSetupModal');
        
        // Start a 5-question challenge
        await page.click('button[data-size="5"]');
        await page.waitForSelector('#challengeInterface', { state: 'visible' });
        
        // Click hint button
        await page.click('#challengeHintButton');
        
        // Verify panel is open
        const hintPanel = page.locator('#challenge-hint-panel');
        await expect(hintPanel).toHaveClass(/active/);
        
        // Click close button
        await page.click('[data-hint-panel="challenge-hint-panel"]');
        
        // Verify panel is closed
        await expect(hintPanel).not.toHaveClass(/active/);
    });

    test('hint should show warning about point penalty', async ({ page }) => {
        // Select challenge mode
        await page.selectOption('#modeSelector', 'challenge');
        await page.waitForSelector('#challengeSetupModal');
        
        // Start a 5-question challenge
        await page.click('button[data-size="5"]');
        await page.waitForSelector('#challengeInterface', { state: 'visible' });
        
        // Click hint button
        await page.click('#challengeHintButton');
        
        // Check for warning message
        const warning = page.locator('.hint-warning');
        await expect(warning).toBeVisible();
        await expect(warning).toContainText('reduce your points for this question by half');
    });
});

