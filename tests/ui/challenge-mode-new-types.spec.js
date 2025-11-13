// Playwright tests for Challenge Mode - New Problem Types (Intercepts, Rate of Change, Linear Functions, Standard Form)
// This is a subset of challenge-mode tests split for faster execution

import { test, expect } from '@playwright/test';

test.describe('Challenge Mode - New Problem Types', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.nav-sidebar', { timeout: 5000 });
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  const newProblemTypes = [
    { tab: 'intercepts', name: 'Intercepts' },
    { tab: 'rateofchange', name: 'Rate of Change' },
    { tab: 'linearfunction', name: 'Linear Functions' },
    { tab: 'standardform', name: 'Standard Form' }
  ];

  for (const problemType of newProblemTypes) {
    test(`should start challenge mode for ${problemType.name}`, async ({ page }) => {
      // Select the problem type tab
      await page.click(`button[data-tab="${problemType.tab}"]`);
      await page.waitForTimeout(500);
      
      // Switch to Challenge mode
      await page.selectOption('#modeSelector', 'challenge');
      
      // Wait for challenge setup modal
      const modal = page.locator('#challengeSetupModal');
      await expect(modal).toBeVisible({ timeout: 5000 });
      
      // Select a set size (5 questions)
      const setSizeButton = page.locator('.set-size-btn[data-size="5"]');
      await expect(setSizeButton).toBeVisible();
      await setSizeButton.click();
      
      // Modal should close
      await expect(modal).not.toBeVisible({ timeout: 3000 });
      
      // Challenge interface should be visible
      const challengeInterface = page.locator('#challengeInterface');
      await expect(challengeInterface).toBeVisible({ timeout: 3000 });
      
      // Should display a question (wait for question to be rendered)
      await page.waitForTimeout(1000);
      const questionDisplay = page.locator('#challengeQuestionDisplay');
      await expect(questionDisplay).toBeVisible({ timeout: 5000 });
      
      // Should have multiple choice options
      const inputContainer = page.locator('#challengeInputContainer');
      await expect(inputContainer).toBeVisible({ timeout: 5000 });
      const options = page.locator('#challengeInputContainer input[type="radio"]');
      const optionCount = await options.count();
      expect(optionCount).toBeGreaterThan(0);
    });

    test(`should generate questions for ${problemType.name} in challenge mode`, async ({ page }) => {
      // Select the problem type tab
      await page.click(`button[data-tab="${problemType.tab}"]`);
      await page.waitForTimeout(500);
      
      // Start challenge
      await page.selectOption('#modeSelector', 'challenge');
      await page.waitForSelector('#challengeSetupModal', { timeout: 5000 });
      await page.click('.set-size-btn[data-size="5"]');
      
      // Wait for challenge to start
      await page.waitForSelector('#challengeInterface', { timeout: 5000 });
      await page.waitForTimeout(1000);
      
      // Verify question is displayed
      const questionDisplay = page.locator('#challengeQuestionDisplay');
      await expect(questionDisplay).toBeVisible({ timeout: 5000 });
      
      const questionContent = await questionDisplay.textContent();
      expect(questionContent).toBeTruthy();
      expect(questionContent.trim().length).toBeGreaterThan(0);
    });
  }

  test('should display correct problem type in challenge mode', async ({ page }) => {
    // Test Linear Functions specifically (the one that was broken)
    await page.click('button[data-tab="linearfunction"]');
    await page.waitForTimeout(500);
    
    await page.selectOption('#modeSelector', 'challenge');
    await page.waitForSelector('#challengeSetupModal', { timeout: 5000 });
    await page.click('.set-size-btn[data-size="5"]');
    
    await page.waitForSelector('#challengeInterface', { timeout: 5000 });
    await page.waitForTimeout(1000);
    
    // Verify question is displayed (not empty)
    const questionDisplay = page.locator('#challengeQuestionDisplay');
    await expect(questionDisplay).toBeVisible({ timeout: 5000 });
    
    const questionContent = await questionDisplay.textContent();
    expect(questionContent).toBeTruthy();
    expect(questionContent.trim().length).toBeGreaterThan(0);
    
    // Verify options are displayed
    await page.waitForSelector('#challengeInputContainer', { timeout: 5000 });
    await page.waitForTimeout(500);
    const options = page.locator('#challengeInputContainer input[type="radio"]');
    const optionCount = await options.count();
    expect(optionCount).toBeGreaterThanOrEqual(2);
  });
});
