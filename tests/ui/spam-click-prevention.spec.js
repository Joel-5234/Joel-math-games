// Test for spam click prevention fix
// This tests the fix for issue #002 where users could spam click to gain multiple points

import { test, expect } from '@playwright/test';

test.describe('Spam Click Prevention', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('#slopeInput');
    });

    test('should only award points once per question - slope problem', async ({ page }) => {
        // Enter valid input
        await page.fill('#slopeInput', '(2,3), (5,9)');
        
        // Get initial score
        const initialScore = await page.textContent('#scoreDisplay');
        const initialScoreNum = parseInt(initialScore) || 0;
        
        // Submit first time
        await page.click('#slopeSubmit');
        await page.waitForTimeout(500); // Wait for processing
        
        // Get score after first submission
        const scoreAfterFirst = await page.textContent('#scoreDisplay');
        const scoreAfterFirstNum = parseInt(scoreAfterFirst) || 0;
        
        // Verify score increased
        expect(scoreAfterFirstNum).toBeGreaterThan(initialScoreNum);
        
        // Try to spam click multiple times
        await page.click('#slopeSubmit');
        await page.click('#slopeSubmit');
        await page.click('#slopeSubmit');
        await page.waitForTimeout(500);
        
        // Score should not increase further
        const scoreAfterSpam = await page.textContent('#scoreDisplay');
        const scoreAfterSpamNum = parseInt(scoreAfterSpam) || 0;
        
        expect(scoreAfterSpamNum).toBe(scoreAfterFirstNum);
    });

    test('should reset flag when switching tabs', async ({ page }) => {
        // Answer slope question
        await page.fill('#slopeInput', '(2,3), (5,9)');
        await page.click('#slopeSubmit');
        await page.waitForTimeout(500);
        
        const scoreAfterFirst = parseInt(await page.textContent('#scoreDisplay')) || 0;
        
        // Switch to relationship tab
        await page.click('button[data-tab="relationship"]');
        await page.waitForTimeout(200);
        
        // Answer relationship question
        await page.fill('#equation1Input', 'y = 2x + 3');
        await page.fill('#equation2Input', 'y = 2x - 5');
        await page.click('#relationshipSubmit');
        await page.waitForTimeout(500);
        
        // Score should increase (new question allowed)
        const scoreAfterSecond = parseInt(await page.textContent('#scoreDisplay')) || 0;
        expect(scoreAfterSecond).toBeGreaterThan(scoreAfterFirst);
    });

    test('should reset flag when input changes', async ({ page }) => {
        // Answer first question
        await page.fill('#slopeInput', '(2,3), (5,9)');
        await page.click('#slopeSubmit');
        await page.waitForTimeout(500);
        
        const scoreAfterFirst = parseInt(await page.textContent('#scoreDisplay')) || 0;
        
        // Change input (new question)
        await page.fill('#slopeInput', '(1,1), (4,7)');
        
        // Submit again - should work (new question)
        await page.click('#slopeSubmit');
        await page.waitForTimeout(500);
        
        const scoreAfterSecond = parseInt(await page.textContent('#scoreDisplay')) || 0;
        expect(scoreAfterSecond).toBeGreaterThan(scoreAfterFirst);
    });

    test('should prevent spam clicking on all problem types', async ({ page }) => {
        // Test parallel problem
        await page.click('button[data-tab="parallel"]');
        await page.waitForTimeout(200);
        
        await page.fill('#parallelEquationInput', 'y = 2x + 3');
        await page.fill('#parallelPointInput', '(4,5)');
        
        const initialScore = parseInt(await page.textContent('#scoreDisplay')) || 0;
        
        await page.click('#parallelSubmit');
        await page.waitForTimeout(500);
        
        const scoreAfterFirst = parseInt(await page.textContent('#scoreDisplay')) || 0;
        expect(scoreAfterFirst).toBeGreaterThan(initialScore);
        
        // Try spam clicking
        await page.click('#parallelSubmit');
        await page.click('#parallelSubmit');
        await page.waitForTimeout(500);
        
        const scoreAfterSpam = parseInt(await page.textContent('#scoreDisplay')) || 0;
        expect(scoreAfterSpam).toBe(scoreAfterFirst);
    });
});

