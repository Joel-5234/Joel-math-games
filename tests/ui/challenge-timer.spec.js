// Playwright tests for Challenge Mode Timer Reset (Issue #010)
// Tests that timer resets and starts correctly in challenge mode

import { test, expect } from '@playwright/test';

test.describe('Challenge Mode Timer Reset', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.nav-sidebar', { timeout: 5000 });
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('should reset and start timer when challenge starts', async ({ page }) => {
    // Select a problem type tab
    await page.click('button[data-tab="slope"]');
    await page.waitForTimeout(500);
    
    // Switch to Challenge mode
    await page.selectOption('#modeSelector', 'challenge');
    
    // Wait for challenge setup modal
    await page.waitForSelector('#challengeSetupModal', { timeout: 5000 });
    
    // Start a 5-question challenge
    await page.click('.set-size-btn[data-size="5"]');
    
    // Wait for challenge to start
    await page.waitForSelector('#challengeInterface', { timeout: 5000 });
    await page.waitForTimeout(1000); // Wait for question to render
    
    // Check timer display
    const timerDisplay = page.locator('#timerDisplay');
    await expect(timerDisplay).toBeVisible();
    
    // Timer should start at 0s or very low value (within 2 seconds)
    const timerText = await timerDisplay.textContent();
    const timerValue = parseInt(timerText.replace('s', ''));
    expect(timerValue).toBeLessThan(3); // Should be 0-2 seconds
  });

  test('should reset timer when navigating to next question', async ({ page }) => {
    // Start challenge
    await page.click('button[data-tab="slope"]');
    await page.waitForTimeout(500);
    await page.selectOption('#modeSelector', 'challenge');
    await page.waitForSelector('#challengeSetupModal', { timeout: 5000 });
    await page.click('.set-size-btn[data-size="5"]');
    await page.waitForSelector('#challengeInterface', { timeout: 5000 });
    await page.waitForTimeout(1000);
    
    // Wait a bit to let timer run
    await page.waitForTimeout(2000);
    
    // Get initial timer value
    const timerDisplay = page.locator('#timerDisplay');
    const initialTimerText = await timerDisplay.textContent();
    const initialTimerValue = parseInt(initialTimerText.replace('s', ''));
    expect(initialTimerValue).toBeGreaterThan(1); // Should have counted up
    
    // Navigate to next question
    await page.click('#challengeSkipBtn');
    await page.waitForTimeout(1000); // Wait for navigation
    
    // Timer should reset to 0s or very low value
    const newTimerText = await timerDisplay.textContent();
    const newTimerValue = parseInt(newTimerText.replace('s', ''));
    expect(newTimerValue).toBeLessThan(3); // Should reset to 0-2 seconds
  });

  test('should stop timer when answer is submitted', async ({ page }) => {
    // Start challenge
    await page.click('button[data-tab="slope"]');
    await page.waitForTimeout(500);
    await page.selectOption('#modeSelector', 'challenge');
    await page.waitForSelector('#challengeSetupModal', { timeout: 5000 });
    await page.click('.set-size-btn[data-size="5"]');
    await page.waitForSelector('#challengeInterface', { timeout: 5000 });
    await page.waitForTimeout(1000);
    
    // Wait for input container and options
    await page.waitForSelector('#challengeInputContainer', { timeout: 5000 });
    await page.waitForTimeout(500);
    
    // Select an answer
    const firstOption = page.locator('#challengeInputContainer input[type="radio"]').first();
    await expect(firstOption).toBeVisible({ timeout: 5000 });
    await firstOption.click();
    
    // Get timer value before submission
    const timerDisplay = page.locator('#timerDisplay');
    const timerBeforeText = await timerDisplay.textContent();
    const timerBeforeValue = parseInt(timerBeforeText.replace('s', ''));
    
    // Submit answer
    await page.click('#challengeSubmitBtn');
    await page.waitForTimeout(1000);
    
    // Timer should stop (value should not increase significantly)
    await page.waitForTimeout(1000);
    const timerAfterText = await timerDisplay.textContent();
    const timerAfterValue = parseInt(timerAfterText.replace('s', ''));
    
    // Timer should be close to the value before submission (stopped)
    expect(Math.abs(timerAfterValue - timerBeforeValue)).toBeLessThan(2);
  });

  test('should reset timer when challenge is reset', async ({ page }) => {
    // Start challenge
    await page.click('button[data-tab="slope"]');
    await page.waitForTimeout(500);
    await page.selectOption('#modeSelector', 'challenge');
    await page.waitForSelector('#challengeSetupModal', { timeout: 5000 });
    await page.click('.set-size-btn[data-size="5"]');
    await page.waitForSelector('#challengeInterface', { timeout: 5000 });
    await page.waitForTimeout(2000); // Let timer run
    
    // Exit challenge
    await page.click('#exitChallenge');
    await page.waitForTimeout(500);
    
    // Start new challenge
    await page.selectOption('#modeSelector', 'challenge');
    await page.waitForSelector('#challengeSetupModal', { timeout: 5000 });
    await page.click('.set-size-btn[data-size="5"]');
    await page.waitForSelector('#challengeInterface', { timeout: 5000 });
    await page.waitForTimeout(1000);
    
    // Timer should reset to 0s
    const timerDisplay = page.locator('#timerDisplay');
    const timerText = await timerDisplay.textContent();
    const timerValue = parseInt(timerText.replace('s', ''));
    expect(timerValue).toBeLessThan(3); // Should reset to 0-2 seconds
  });
});

