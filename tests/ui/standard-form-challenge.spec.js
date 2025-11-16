const { test, expect } = require('@playwright/test');

test.describe('Standard Form Challenge Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should open challenge modal when Standard Form challenge mode is selected', async ({ page }) => {
    // Select Standard Form tab
    await page.click('button[data-tab="standardform"]');
    await page.waitForTimeout(500);
    
    // Select Challenge mode
    await page.selectOption('#modeSelector', 'challenge');
    
    // Verify modal appears
    await page.waitForSelector('#challengeSetupModal', { timeout: 5000 });
    const modal = page.locator('#challengeSetupModal');
    await expect(modal).toBeVisible();
    
    console.log('✓ Challenge modal opened');
  });

  test('should start Standard Form challenge when set size button is clicked', async ({ page }) => {
    // Add console logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Browser Console Error:', msg.text());
      }
    });
    
    // Select Standard Form tab
    await page.click('button[data-tab="standardform"]');
    await page.waitForTimeout(500);
    
    console.log('✓ Standard Form tab selected');
    
    // Select Challenge mode
    await page.selectOption('#modeSelector', 'challenge');
    await page.waitForTimeout(300);
    
    console.log('✓ Challenge mode selected');
    
    // Verify modal appears
    await page.waitForSelector('#challengeSetupModal', { timeout: 5000 });
    console.log('✓ Challenge modal visible');
    
    // Click the 5 questions button
    const button = page.locator('.set-size-btn[data-size="5"]');
    await expect(button).toBeVisible();
    console.log('✓ Set size button visible');
    
    await button.click();
    console.log('✓ Set size button clicked');
    
    // Wait for modal to close and challenge interface to appear
    await page.waitForTimeout(1000);
    
    // Verify modal closed
    const modal = page.locator('#challengeSetupModal');
    const isModalHidden = await modal.evaluate(el => {
      return !el.classList.contains('active');
    });
    expect(isModalHidden).toBeTruthy();
    console.log('✓ Modal closed');
    
    // Verify challenge interface appears
    await page.waitForSelector('#challengeInterface', { timeout: 5000 });
    const challengeInterface = page.locator('#challengeInterface');
    await expect(challengeInterface).toBeVisible();
    console.log('✓ Challenge interface visible');
    
    // Verify question is displayed
    const questionDisplay = page.locator('#challengeQuestionDisplay');
    await expect(questionDisplay).toBeVisible({ timeout: 5000 });
    
    const questionContent = await questionDisplay.textContent();
    expect(questionContent).toBeTruthy();
    expect(questionContent.trim().length).toBeGreaterThan(0);
    console.log('✓ Question displayed:', questionContent.substring(0, 50) + '...');
    
    // Verify options are displayed
    const options = page.locator('#challengeInputContainer input[type="radio"]');
    const optionCount = await options.count();
    expect(optionCount).toBeGreaterThanOrEqual(2);
    console.log('✓ Options count:', optionCount);
  });

  test('should display Standard Form conversion question correctly', async ({ page }) => {
    // Select Standard Form tab and start challenge
    await page.click('button[data-tab="standardform"]');
    await page.waitForTimeout(500);
    
    await page.selectOption('#modeSelector', 'challenge');
    await page.waitForSelector('#challengeSetupModal', { timeout: 5000 });
    
    await page.click('.set-size-btn[data-size="5"]');
    await page.waitForTimeout(1000);
    
    // Verify question text contains "Convert" and "standard form"
    const questionDisplay = page.locator('#challengeQuestionDisplay');
    await expect(questionDisplay).toBeVisible({ timeout: 5000 });
    
    const questionText = await questionDisplay.textContent();
    expect(questionText.toLowerCase()).toContain('convert');
    expect(questionText.toLowerCase()).toContain('standard form');
    
    console.log('✓ Standard Form question format verified');
  });
});

