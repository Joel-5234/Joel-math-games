// Example Playwright test file
// This is a template - implement actual tests based on your app functionality

import { test, expect } from '@playwright/test';

test.describe('Parallel & Perpendicular Lines Web Trainer', () => {
  test('should load the app', async ({ page }) => {
    await page.goto('/');
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    // Check for key elements instead of title (more reliable)
    await expect(page.locator('#modeSelector')).toBeVisible();
    await expect(page.locator('.nav-sidebar')).toBeVisible();
  });

  // Add more tests here as you develop the app
  // Example tests:
  // - Test slope calculation
  // - Test line relationship detection
  // - Test achievement unlocking
  // - Test localStorage persistence
});

