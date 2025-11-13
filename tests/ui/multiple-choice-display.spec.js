// Playwright tests for multiple choice display in Practice and Session modes
// Tests Issue #006: Multiple choice containers not appearing

import { test, expect } from '@playwright/test';

test.describe('Multiple Choice Display - Practice and Session Modes', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('should display multiple choice for slope question in Practice mode', async ({ page }) => {
    // Set mode to Practice
    await page.selectOption('#modeSelector', 'practice');
    
    // Enter slope input
    await page.fill('#slopeInput', '(2,3),(5,9)');
    
    // Click Calculate button
    await page.click('#slopeCalculateBtn');
    
    // Wait for multiple choice container to appear
    const container = page.locator('#slopeQuestionsContainer');
    await expect(container).toBeVisible({ timeout: 5000 });
    
    // Verify slope value question is visible
    const slopeValueQuestion = page.locator('#slopeValueQuestion');
    await expect(slopeValueQuestion).toBeVisible();
    
    // Verify classification question is visible
    const classificationQuestion = page.locator('#slopeClassificationQuestion');
    await expect(classificationQuestion).toBeVisible();
    
    // Verify radio options are present
    const slopeOptions = page.locator('#slopeValueOptions .radio-option');
    await expect(slopeOptions).toHaveCount(4);
    
    const classificationOptions = page.locator('#slopeClassificationOptions .radio-option');
    await expect(classificationOptions).toHaveCount(4);
    
    // Verify submit button is visible
    const submitBtn = page.locator('#slopeSubmit');
    await expect(submitBtn).toBeVisible();
  });

  test('should display multiple choice for relationship question in Practice mode', async ({ page }) => {
    // Set mode to Practice
    await page.selectOption('#modeSelector', 'practice');
    
    // Switch to relationship tab
    await page.click('button[data-tab="relationship"]');
    
    // Enter equations
    await page.fill('#equation1Input', 'y = 2x + 3');
    await page.fill('#equation2Input', 'y = 2x - 5');
    
    // Click Calculate button
    await page.click('#relationshipCalculateBtn');
    
    // Wait for multiple choice container to appear
    const container = page.locator('#relationshipQuestionContainer');
    await expect(container).toBeVisible({ timeout: 5000 });
    
    // Verify radio options are present
    const options = page.locator('#relationshipOptions .radio-option');
    await expect(options).toHaveCount(4);
    
    // Verify submit button is visible
    const submitBtn = page.locator('#relationshipSubmit');
    await expect(submitBtn).toBeVisible();
  });

  test('should display multiple choice for parallel question in Practice mode', async ({ page }) => {
    // Set mode to Practice
    await page.selectOption('#modeSelector', 'practice');
    
    // Switch to parallel tab
    await page.click('button[data-tab="parallel"]');
    
    // Enter equation and point
    await page.fill('#parallelEquationInput', 'y = 2x + 3');
    await page.fill('#parallelPointInput', '(4,5)');
    
    // Click Calculate button
    await page.click('#parallelCalculateBtn');
    
    // Wait for multiple choice container to appear
    const container = page.locator('#parallelQuestionContainer');
    await expect(container).toBeVisible({ timeout: 5000 });
    
    // Verify radio options are present
    const options = page.locator('#parallelOptions .radio-option');
    await expect(options).toHaveCount(4);
    
    // Verify submit button is visible
    const submitBtn = page.locator('#parallelSubmit');
    await expect(submitBtn).toBeVisible();
  });

  test('should display multiple choice for perpendicular question in Practice mode', async ({ page }) => {
    // Set mode to Practice
    await page.selectOption('#modeSelector', 'practice');
    
    // Switch to perpendicular tab
    await page.click('button[data-tab="perpendicular"]');
    
    // Enter equation and point
    await page.fill('#perpendicularEquationInput', 'y = 2x + 3');
    await page.fill('#perpendicularPointInput', '(4,5)');
    
    // Click Calculate button
    await page.click('#perpendicularCalculateBtn');
    
    // Wait for multiple choice container to appear
    const container = page.locator('#perpendicularQuestionContainer');
    await expect(container).toBeVisible({ timeout: 5000 });
    
    // Verify radio options are present
    const options = page.locator('#perpendicularOptions .radio-option');
    await expect(options).toHaveCount(4);
    
    // Verify submit button is visible
    const submitBtn = page.locator('#perpendicularSubmit');
    await expect(submitBtn).toBeVisible();
  });

  test('should display multiple choice for slope question in Session mode', async ({ page }) => {
    // Set mode to Session
    await page.selectOption('#modeSelector', 'session');
    
    // Enter slope input
    await page.fill('#slopeInput', '(2,3),(5,9)');
    
    // Click Calculate button
    await page.click('#slopeCalculateBtn');
    
    // Wait for multiple choice container to appear
    const container = page.locator('#slopeQuestionsContainer');
    await expect(container).toBeVisible({ timeout: 5000 });
    
    // Verify slope value question is visible
    const slopeValueQuestion = page.locator('#slopeValueQuestion');
    await expect(slopeValueQuestion).toBeVisible();
    
    // Verify classification question is visible
    const classificationQuestion = page.locator('#slopeClassificationQuestion');
    await expect(classificationQuestion).toBeVisible();
    
    // Verify radio options are present
    const slopeOptions = page.locator('#slopeValueOptions .radio-option');
    await expect(slopeOptions).toHaveCount(4);
    
    const classificationOptions = page.locator('#slopeClassificationOptions .radio-option');
    await expect(classificationOptions).toHaveCount(4);
    
    // Verify submit button is visible
    const submitBtn = page.locator('#slopeSubmit');
    await expect(submitBtn).toBeVisible();
  });

  test('should hide multiple choice when input changes', async ({ page }) => {
    // Set mode to Practice
    await page.selectOption('#modeSelector', 'practice');
    
    // Enter slope input and calculate
    await page.fill('#slopeInput', '(2,3),(5,9)');
    await page.click('#slopeCalculateBtn');
    
    // Verify container is visible
    const container = page.locator('#slopeQuestionsContainer');
    await expect(container).toBeVisible({ timeout: 5000 });
    
    // Change input
    await page.fill('#slopeInput', '(1,1),(2,2)');
    
    // Container should be hidden (resetQuestionState is called on input change)
    // Note: This might be immediate or might require focus/blur
    await page.locator('#slopeInput').blur();
    
    // Give it a moment for the reset
    await page.waitForTimeout(100);
    
    // Container should be hidden
    await expect(container).not.toBeVisible();
  });

  test('should be able to select and submit multiple choice answers', async ({ page }) => {
    // Set mode to Practice
    await page.selectOption('#modeSelector', 'practice');
    
    // Enter slope input
    await page.fill('#slopeInput', '(2,3),(5,9)');
    
    // Click Calculate button
    await page.click('#slopeCalculateBtn');
    
    // Wait for multiple choice to appear
    const container = page.locator('#slopeQuestionsContainer');
    await expect(container).toBeVisible({ timeout: 5000 });
    
    // Select first option for slope value
    const firstSlopeOption = page.locator('#slopeValueOptions .radio-option').first();
    await firstSlopeOption.click();
    
    // Select first option for classification
    const firstClassificationOption = page.locator('#slopeClassificationOptions .radio-option').first();
    await firstClassificationOption.click();
    
    // Click submit button
    await page.click('#slopeSubmit');
    
    // Verify result area shows feedback
    const resultArea = page.locator('#slopeResult');
    await expect(resultArea).toBeVisible();
    
    // Radio buttons should be disabled after submission
    const slopeRadios = page.locator('#slopeValueOptions input[type="radio"]');
    const firstRadio = slopeRadios.first();
    await expect(firstRadio).toBeDisabled();
  });

  test('should show error if submitting without selecting answers', async ({ page }) => {
    // Set mode to Practice
    await page.selectOption('#modeSelector', 'practice');
    
    // Enter slope input
    await page.fill('#slopeInput', '(2,3),(5,9)');
    
    // Click Calculate button
    await page.click('#slopeCalculateBtn');
    
    // Wait for multiple choice to appear
    const container = page.locator('#slopeQuestionsContainer');
    await expect(container).toBeVisible({ timeout: 5000 });
    
    // Try to submit without selecting
    await page.click('#slopeSubmit');
    
    // Verify error message appears
    const resultArea = page.locator('#slopeResult');
    await expect(resultArea).toContainText(/select|answer/i);
  });
});

