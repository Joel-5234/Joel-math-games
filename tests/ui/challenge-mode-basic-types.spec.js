// Playwright tests for Challenge Mode - Basic Problem Types (Slope, Relationship, Parallel, Perpendicular)
// This is a subset of challenge-mode tests split for faster execution

import { test, expect } from '@playwright/test';

test.describe('Challenge Mode - Basic Problem Types', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.nav-sidebar', { timeout: 5000 });
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  const basicProblemTypes = [
    { tab: 'slope', name: 'Slope & Description' },
    { tab: 'relationship', name: 'Line Relationship' },
    { tab: 'parallel', name: 'Parallel Line' },
    { tab: 'perpendicular', name: 'Perpendicular Line' }
  ];

  for (const problemType of basicProblemTypes) {
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
  }
});

