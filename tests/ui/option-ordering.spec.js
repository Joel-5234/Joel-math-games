// Playwright tests for Multiple Choice Option Ordering (Issue #012)
// Tests that:
// 1. Options are displayed in alphabetical order (A, B, C, D)
// 2. Correct answer is randomized (not always at the same position)

import { test, expect } from '@playwright/test';

test.describe('Multiple Choice Option Ordering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.nav-sidebar', { timeout: 5000 });
  });

  test('should display options in alphabetical order in Challenge mode', async ({ page }) => {
    // Switch to Challenge mode
    await page.selectOption('#modeSelector', 'challenge');
    await page.waitForSelector('#challengeSetupModal', { timeout: 3000 });
    
    // Start a challenge with 5 questions
    await page.click('button[data-size="5"]');
    await page.waitForSelector('#challengeQuestionDisplay', { timeout: 3000 });
    
    // Wait for question to load
    await page.waitForTimeout(1000);
    
    // Get all option labels
    const optionLabels = await page.locator('.radio-option label').allTextContents();
    
    // Extract just the letters (A, B, C, D)
    const letters = optionLabels.map(label => {
      const match = label.match(/^([A-D])\./);
      return match ? match[1] : null;
    }).filter(Boolean);
    
    // Verify they are in alphabetical order
    expect(letters).toEqual(['A', 'B', 'C', 'D']);
  });

  test('should display options in alphabetical order for Absolute Value questions', async ({ page }) => {
    // Navigate to Absolute Value tab
    await page.click('button[data-tab="absolutevalue"]');
    await page.waitForSelector('#absoluteValueInput', { timeout: 3000 });
    
    // Enter an absolute value equation
    await page.fill('#absoluteValueInput', 'y = 2|3x + 1| - 5');
    await page.click('#absoluteValueCalculateBtn');
    
    // Wait for options to appear
    await page.waitForSelector('#absoluteValueOptions .radio-option', { timeout: 3000 });
    
    // Get all option labels
    const optionLabels = await page.locator('#absoluteValueOptions .radio-option label').allTextContents();
    
    // Extract just the letters (A, B, C, D)
    const letters = optionLabels.map(label => {
      const match = label.match(/^([A-D])\./);
      return match ? match[1] : null;
    }).filter(Boolean);
    
    // Verify they are in alphabetical order
    expect(letters).toEqual(['A', 'B', 'C', 'D']);
  });

  test('should display options in alphabetical order for Point-Slope questions', async ({ page }) => {
    // Navigate to Point-Slope tab
    await page.click('button[data-tab="pointslope"]');
    await page.waitForSelector('#pointSlopeMInput', { timeout: 3000 });
    
    // Enter slope and point
    await page.fill('#pointSlopeMInput', '2/3');
    await page.fill('#pointSlopePointInput', '(3, 5)');
    await page.click('#pointSlopeCalculateBtn');
    
    // Wait for options to appear
    await page.waitForSelector('#pointSlopeOptions .radio-option', { timeout: 3000 });
    
    // Get all option labels
    const optionLabels = await page.locator('#pointSlopeOptions .radio-option label').allTextContents();
    
    // Extract just the letters (A, B, C, D)
    const letters = optionLabels.map(label => {
      const match = label.match(/^([A-D])\./);
      return match ? match[1] : null;
    }).filter(Boolean);
    
    // Verify they are in alphabetical order
    expect(letters).toEqual(['A', 'B', 'C', 'D']);
  });

  test('should randomize correct answer position in Challenge mode', async ({ page }) => {
    // Switch to Challenge mode
    await page.selectOption('#modeSelector', 'challenge');
    await page.waitForSelector('#challengeSetupModal', { timeout: 3000 });
    
    // Start a challenge with 10 questions to test randomization
    await page.click('button[data-size="10"]');
    await page.waitForSelector('#challengeQuestionDisplay', { timeout: 3000 });
    
    // Track which positions have the correct answer
    const correctPositions = new Set();
    
    // Go through multiple questions
    for (let i = 0; i < 5; i++) {
      await page.waitForTimeout(500);
      
      // Find the correct answer by checking data-correct attribute
      const correctOption = await page.locator('.radio-option input[data-correct="true"]').first();
      
      if (await correctOption.count() > 0) {
        const correctId = await correctOption.getAttribute('id');
        // Extract the label from the ID (e.g., "challengeAnswer_B" -> "B")
        const match = correctId.match(/_([A-D])$/);
        if (match) {
          correctPositions.add(match[1]);
        }
      }
      
      // Skip to next question (if not the last one)
      if (i < 4) {
        const skipButton = page.locator('#skipChallengeBtn');
        if (await skipButton.isVisible()) {
          await skipButton.click();
          await page.waitForTimeout(500);
        }
      }
    }
    
    // Verify that correct answers appeared at multiple positions
    // (With 5 questions, we should see at least 2 different positions with high probability)
    expect(correctPositions.size).toBeGreaterThanOrEqual(2);
  });
});

