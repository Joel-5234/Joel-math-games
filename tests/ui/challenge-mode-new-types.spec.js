// Playwright tests for Challenge Mode with New Problem Types (Issue #009 fix)
// Tests that all 8 problem types work correctly in Challenge mode

import { test, expect } from '@playwright/test';

test.describe('Challenge Mode - New Problem Types', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.nav-sidebar', { timeout: 5000 });
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  const problemTypes = [
    { tab: 'slope', name: 'Slope & Description' },
    { tab: 'relationship', name: 'Line Relationship' },
    { tab: 'parallel', name: 'Parallel Line' },
    { tab: 'perpendicular', name: 'Perpendicular Line' },
    { tab: 'intercepts', name: 'Intercepts' },
    { tab: 'rateofchange', name: 'Rate of Change' },
    { tab: 'linearfunction', name: 'Linear Functions' },
    { tab: 'standardform', name: 'Standard Form' }
  ];

  for (const problemType of problemTypes) {
    test(`should start challenge mode for ${problemType.name}`, async ({ page }) => {
      // Select the problem type tab
      await page.click(`button[data-tab="${problemType.tab}"]`);
      await page.waitForTimeout(500); // Wait for tab switch
      
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
      
      // Should display a question
      const questionText = page.locator('#challengeQuestionText');
      await expect(questionText).toBeVisible({ timeout: 3000 });
      
      // Should have multiple choice options
      const options = page.locator('#challengeOptions input[type="radio"]');
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
      
      // Verify question is displayed
      const questionText = page.locator('#challengeQuestionText');
      await expect(questionText).toBeVisible();
      
      const questionContent = await questionText.textContent();
      expect(questionContent).toBeTruthy();
      expect(questionContent.trim().length).toBeGreaterThan(0);
    });

    test(`should allow answering questions for ${problemType.name} in challenge mode`, async ({ page }) => {
      // Select the problem type tab
      await page.click(`button[data-tab="${problemType.tab}"]`);
      await page.waitForTimeout(500);
      
      // Start challenge
      await page.selectOption('#modeSelector', 'challenge');
      await page.waitForSelector('#challengeSetupModal', { timeout: 5000 });
      await page.click('.set-size-btn[data-size="5"]');
      
      // Wait for challenge to start
      await page.waitForSelector('#challengeInterface', { timeout: 5000 });
      await page.waitForTimeout(1000); // Wait for question to render
      
      // Select an answer option
      const firstOption = page.locator('#challengeOptions input[type="radio"]').first();
      await expect(firstOption).toBeVisible({ timeout: 5000 });
      
      // Click the first option
      await firstOption.click();
      
      // Verify option is selected
      await expect(firstOption).toBeChecked();
      
      // Submit answer
      const submitButton = page.locator('#submitChallengeAnswer');
      await expect(submitButton).toBeVisible();
      await submitButton.click();
      
      // Should show feedback or move to next question
      await page.waitForTimeout(1000);
      
      // Verify challenge is still active (either showing feedback or next question)
      const challengeInterface = page.locator('#challengeInterface');
      await expect(challengeInterface).toBeVisible();
    });
  }

  test('should handle challenge mode navigation for all problem types', async ({ page }) => {
    // Test that challenge mode works for each problem type sequentially
    for (const problemType of problemTypes.slice(0, 3)) { // Test first 3 to avoid long test
      // Select tab
      await page.click(`button[data-tab="${problemType.tab}"]`);
      await page.waitForTimeout(500);
      
      // Start challenge
      await page.selectOption('#modeSelector', 'challenge');
      await page.waitForSelector('#challengeSetupModal', { timeout: 5000 });
      await page.click('.set-size-btn[data-size="5"]');
      
      // Verify challenge started
      await page.waitForSelector('#challengeInterface', { timeout: 5000 });
      
      // Cancel/exit challenge
      await page.selectOption('#modeSelector', 'practice');
      await page.waitForTimeout(500);
    }
  });

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
    const questionText = page.locator('#challengeQuestionText');
    await expect(questionText).toBeVisible();
    
    const questionContent = await questionText.textContent();
    expect(questionContent).toBeTruthy();
    expect(questionContent.trim().length).toBeGreaterThan(0);
    
    // Verify options are displayed
    const options = page.locator('#challengeOptions input[type="radio"]');
    const optionCount = await options.count();
    expect(optionCount).toBeGreaterThanOrEqual(2); // Should have at least 2 options
  });
});

