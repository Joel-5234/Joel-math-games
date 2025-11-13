const { test, expect } = require('@playwright/test');

test.describe('Challenge Mode Answer Validation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Select challenge mode
        await page.selectOption('#modeSelector', 'challenge');
    });

    test('should validate answers correctly for relationship questions', async ({ page }) => {
        // Start challenge with relationship type
        await page.selectOption('#challengeProblemType', 'relationship');
        await page.selectOption('#challengeSetSize', '5');
        await page.click('#startChallengeBtn');
        
        // Wait for question to appear
        await page.waitForSelector('#challengeQuestionDisplay', { timeout: 5000 });
        
        // Get all radio options
        const options = await page.locator('input[name="challengeRelationship"]').all();
        expect(options.length).toBeGreaterThan(0);
        
        // Try selecting each option and check if validation works correctly
        for (let i = 0; i < options.length; i++) {
            await options[i].check();
            await page.click('#challengeSubmitBtn');
            
            // Wait for result
            await page.waitForTimeout(500);
            
            const resultText = await page.textContent('#challengeResult');
            
            // Check if result is shown (either correct or incorrect)
            expect(resultText).toBeTruthy();
            
            // If this is the correct answer, it should say "Correct!"
            // If incorrect, it should say "Incorrect"
            const isCorrect = resultText.includes('Correct');
            const isIncorrect = resultText.includes('Incorrect');
            
            expect(isCorrect || isIncorrect).toBe(true);
            
            // Wait for auto-advance or manually advance
            await page.waitForTimeout(2500);
        }
    });

    test('should validate answers correctly for parallel questions', async ({ page }) => {
        await page.selectOption('#challengeProblemType', 'parallel');
        await page.selectOption('#challengeSetSize', '5');
        await page.click('#startChallengeBtn');
        
        await page.waitForSelector('#challengeQuestionDisplay', { timeout: 5000 });
        
        const options = await page.locator('input[name="challengeParallel"]').all();
        expect(options.length).toBeGreaterThan(0);
        
        // Select first option
        await options[0].check();
        await page.click('#challengeSubmitBtn');
        
        await page.waitForTimeout(500);
        
        const resultText = await page.textContent('#challengeResult');
        expect(resultText).toBeTruthy();
        
        // Should show either correct or incorrect, not always correct
        const isCorrect = resultText.includes('Correct');
        const isIncorrect = resultText.includes('Incorrect');
        expect(isCorrect || isIncorrect).toBe(true);
    });

    test('should validate answers correctly for intercept questions', async ({ page }) => {
        await page.selectOption('#challengeProblemType', 'intercept');
        await page.selectOption('#challengeSetSize', '5');
        await page.click('#startChallengeBtn');
        
        await page.waitForSelector('#challengeQuestionDisplay', { timeout: 5000 });
        
        const options = await page.locator('input[name="challengeIntercept"]').all();
        expect(options.length).toBeGreaterThan(0);
        
        // Select first option
        await options[0].check();
        await page.click('#challengeSubmitBtn');
        
        await page.waitForTimeout(500);
        
        const resultText = await page.textContent('#challengeResult');
        expect(resultText).toBeTruthy();
        
        // Should show either correct or incorrect
        const isCorrect = resultText.includes('Correct');
        const isIncorrect = resultText.includes('Incorrect');
        expect(isCorrect || isIncorrect).toBe(true);
    });

    test('should not always mark option A as correct', async ({ page }) => {
        // This test verifies that option A is not always correct
        await page.selectOption('#challengeProblemType', 'relationship');
        await page.selectOption('#challengeSetSize', '10');
        await page.click('#startChallengeBtn');
        
        let correctCount = 0;
        let incorrectCount = 0;
        
        // Test multiple questions
        for (let q = 0; q < 5; q++) {
            await page.waitForSelector('#challengeQuestionDisplay', { timeout: 5000 });
            
            // Always select option A
            const optionA = page.locator('input[name="challengeRelationship"][value="A"]');
            if (await optionA.count() > 0) {
                await optionA.check();
                await page.click('#challengeSubmitBtn');
                
                await page.waitForTimeout(500);
                
                const resultText = await page.textContent('#challengeResult');
                
                if (resultText && resultText.includes('Correct')) {
                    correctCount++;
                } else if (resultText && resultText.includes('Incorrect')) {
                    incorrectCount++;
                }
                
                // Wait for auto-advance
                await page.waitForTimeout(2500);
            }
        }
        
        // Option A should not be correct 100% of the time
        // If it is, that indicates the bug still exists
        expect(incorrectCount).toBeGreaterThan(0);
    });
});

