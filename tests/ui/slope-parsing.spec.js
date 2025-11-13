// Test for slope input parsing fix
// This tests the fix for issue #001 where input like (4,4), (4,4) was incorrectly parsed

import { test, expect } from '@playwright/test';

test.describe('Slope Input Parsing', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Wait for page to load
        await page.waitForSelector('#slopeInput');
    });

    test('should parse two points with space: (4,4), (4,4)', async ({ page }) => {
        // Set mode to Practice
        await page.selectOption('#modeSelector', 'practice');
        
        await page.fill('#slopeInput', '(4,4), (4,4)');
        await page.click('#slopeCalculateBtn');
        
        // Wait for result or error
        await page.waitForTimeout(500);
        
        // Should show error about identical points, not parsing error
        const result = await page.textContent('#slopeResult');
        expect(result).toBeTruthy();
        // Should NOT contain "Please enter two points" (parsing error)
        if (result) {
            expect(result).not.toContain('Please enter two points in the format');
        }
    });

    test('should parse two points without space: (2,3),(5,9)', async ({ page }) => {
        // Set mode to Practice
        await page.selectOption('#modeSelector', 'practice');
        
        await page.fill('#slopeInput', '(2,3),(5,9)');
        await page.click('#slopeCalculateBtn');
        
        // Wait for multiple choice to appear
        await page.waitForSelector('#slopeQuestionsContainer', { timeout: 5000 });
        
        // Verify questions are displayed
        const slopeValueQuestion = page.locator('#slopeValueQuestion');
        await expect(slopeValueQuestion).toBeVisible();
        
        const result = await page.textContent('#slopeResult');
        // Result might be empty initially, or contain feedback after submission
        // Just verify the questions container is visible
        expect(await slopeValueQuestion.isVisible()).toBe(true);
        expect(result).not.toContain('Error: Please enter two points');
    });

    test('should parse two points with decimals: (2.5,3.5), (7.2,9.1)', async ({ page }) => {
        // Set mode to Practice
        await page.selectOption('#modeSelector', 'practice');
        
        await page.fill('#slopeInput', '(2.5,3.5), (7.2,9.1)');
        await page.click('#slopeCalculateBtn');
        
        // Wait for multiple choice to appear
        await page.waitForSelector('#slopeQuestionsContainer', { timeout: 5000 });
        
        // Verify questions are displayed
        const slopeValueQuestion = page.locator('#slopeValueQuestion');
        await expect(slopeValueQuestion).toBeVisible();
    });

    test('should handle vertical line: (4,4), (4,8)', async ({ page }) => {
        // Set mode to Practice
        await page.selectOption('#modeSelector', 'practice');
        
        await page.fill('#slopeInput', '(4,4), (4,8)');
        await page.click('#slopeCalculateBtn');
        
        // Wait for multiple choice to appear
        await page.waitForSelector('#slopeQuestionsContainer', { timeout: 5000 });
        
        // Verify questions are displayed
        const slopeValueQuestion = page.locator('#slopeValueQuestion');
        await expect(slopeValueQuestion).toBeVisible();
    });

    test('should show error for invalid format', async ({ page }) => {
        // Set mode to Practice
        await page.selectOption('#modeSelector', 'practice');
        
        await page.fill('#slopeInput', 'invalid input');
        await page.click('#slopeCalculateBtn');
        
        // Wait for error message
        await page.waitForTimeout(500);
        
        const result = await page.textContent('#slopeResult');
        expect(result).toBeTruthy();
        if (result) {
            expect(result.toLowerCase()).toContain('error');
        }
    });
});

