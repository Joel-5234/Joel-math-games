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
        await page.fill('#slopeInput', '(4,4), (4,4)');
        await page.click('#slopeSubmit');
        
        // Should show error about identical points, not parsing error
        const result = await page.textContent('#slopeResult');
        expect(result).toContain('Error');
        // Should NOT contain "Please enter two points"
        expect(result).not.toContain('Please enter two points in the format');
    });

    test('should parse two points without space: (2,3),(5,9)', async ({ page }) => {
        await page.fill('#slopeInput', '(2,3),(5,9)');
        await page.click('#slopeSubmit');
        
        const result = await page.textContent('#slopeResult');
        expect(result).toContain('Slope');
        expect(result).toContain('Classification');
        expect(result).not.toContain('Error: Please enter two points');
    });

    test('should parse two points with decimals: (2.5,3.5), (7.2,9.1)', async ({ page }) => {
        await page.fill('#slopeInput', '(2.5,3.5), (7.2,9.1)');
        await page.click('#slopeSubmit');
        
        const result = await page.textContent('#slopeResult');
        expect(result).toContain('Slope');
        expect(result).not.toContain('Error: Please enter two points');
    });

    test('should handle vertical line: (4,4), (4,8)', async ({ page }) => {
        await page.fill('#slopeInput', '(4,4), (4,8)');
        await page.click('#slopeSubmit');
        
        const result = await page.textContent('#slopeResult');
        expect(result).toContain('Vertical');
        expect(result).not.toContain('Error: Please enter two points');
    });

    test('should show error for invalid format', async ({ page }) => {
        await page.fill('#slopeInput', 'invalid input');
        await page.click('#slopeSubmit');
        
        const result = await page.textContent('#slopeResult');
        expect(result).toContain('Error');
    });
});

