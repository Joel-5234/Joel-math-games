// Playwright tests for Vertical Navigation Sidebar (Milestone 14)
// Tests vertical sidebar navigation, mobile menu, and all tabs functionality

import { test, expect } from '@playwright/test';

test.describe('Vertical Navigation Sidebar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for page to load
    await page.waitForSelector('.nav-sidebar', { timeout: 5000 });
  });

  test('should display vertical sidebar on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    
    const sidebar = page.locator('.nav-sidebar');
    await expect(sidebar).toBeVisible();
    await expect(sidebar).toHaveCSS('display', 'block');
  });

  test('should display all 10 tabs in sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    const tabs = page.locator('.tab-button');
    await expect(tabs).toHaveCount(10);
    
    // Verify all expected tabs are present
    const tabTexts = await tabs.allTextContents();
    expect(tabTexts).toContain('Slope & Description');
    expect(tabTexts).toContain('Line Relationship');
    expect(tabTexts).toContain('Parallel Line');
    expect(tabTexts).toContain('Perpendicular Line');
    expect(tabTexts).toContain('Intercepts');
    expect(tabTexts).toContain('Rate of Change');
    expect(tabTexts).toContain('Linear Functions');
    expect(tabTexts).toContain('Standard Form');
    expect(tabTexts).toContain('Point-Slope Form');
    expect(tabTexts).toContain('Absolute Value');
  });

  test('should have vertical flex layout for tabs', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    const tabsContainer = page.locator('.tabs');
    await expect(tabsContainer).toHaveCSS('flex-direction', 'column');
  });

  test('should show left border for active tab', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    const activeTab = page.locator('.tab-button.active');
    await expect(activeTab).toBeVisible();
    
    // Check for left border (should have border-left-color)
    const borderLeft = await activeTab.evaluate((el) => {
      return window.getComputedStyle(el).borderLeftWidth;
    });
    expect(parseInt(borderLeft)).toBeGreaterThan(0);
  });

  test('should switch tabs when clicking different tabs', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Click on "Intercepts" tab
    await page.click('button[data-tab="intercepts"]');
    
    // Verify Intercepts panel is active
    const interceptsPanel = page.locator('#intercepts-panel');
    await expect(interceptsPanel).toHaveClass(/active/);
    
    // Verify tab button is active
    const interceptsTab = page.locator('button[data-tab="intercepts"]');
    await expect(interceptsTab).toHaveClass(/active/);
  });

  test('should hide sidebar on mobile and show hamburger menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Sidebar should be hidden
    const sidebar = page.locator('.nav-sidebar:not(.active)');
    await expect(sidebar).not.toBeVisible();
    
    // Hamburger menu button should be visible
    const hamburgerButton = page.locator('.mobile-menu-toggle');
    await expect(hamburgerButton).toBeVisible();
  });

  test('should open mobile menu when hamburger button is clicked', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const hamburgerButton = page.locator('.mobile-menu-toggle');
    const sidebar = page.locator('.nav-sidebar');
    
    // Click hamburger button
    await hamburgerButton.click();
    
    // Sidebar should become visible with active class
    await expect(sidebar).toHaveClass(/active/);
    await expect(sidebar).toBeVisible();
  });

  test('should close mobile menu when overlay is clicked', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const hamburgerButton = page.locator('.mobile-menu-toggle');
    const overlay = page.locator('.mobile-menu-overlay');
    const sidebar = page.locator('.nav-sidebar');
    
    // Open menu
    await hamburgerButton.click();
    await expect(sidebar).toHaveClass(/active/);
    
    // Click overlay
    await overlay.click();
    
    // Menu should close
    await expect(sidebar).not.toHaveClass(/active/);
  });

  test('should close mobile menu when tab is clicked', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const hamburgerButton = page.locator('.mobile-menu-toggle');
    const sidebar = page.locator('.nav-sidebar');
    const interceptsTab = page.locator('button[data-tab="intercepts"]');
    
    // Open menu
    await hamburgerButton.click();
    await expect(sidebar).toHaveClass(/active/);
    
    // Click a tab
    await interceptsTab.click();
    
    // Menu should close
    await expect(sidebar).not.toHaveClass(/active/);
    
    // Tab should still be active
    await expect(interceptsTab).toHaveClass(/active/);
  });

  test('should maintain grid layout with sidebar, main content, and stats sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    const container = page.locator('.container');
    const gridTemplateColumns = await container.evaluate((el) => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });
    
    // Should have 3 columns: sidebar (240px), main content (1fr), stats sidebar (300px)
    expect(gridTemplateColumns).toContain('240px');
    expect(gridTemplateColumns).toContain('300px');
  });
});

