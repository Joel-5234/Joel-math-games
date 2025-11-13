# Playwright Test Suite

This directory contains end-to-end UI tests for the Parallel & Perpendicular Lines Trainer application.

## Test Files

- **vertical-navigation.spec.js** - Tests for Milestone 14: Vertical Navigation Sidebar
  - Desktop sidebar visibility
  - All 9 tabs functionality
  - Mobile menu and responsive design
  - Tab switching behavior

- **challenge-mode-new-types.spec.js** - Tests for Issue #009: Challenge Mode for New Problem Types
  - Challenge mode for all 8 problem types
  - Question generation verification
  - Answer submission functionality
  - Problem type mapping verification

- **multiple-choice-display.spec.js** - Tests for Issue #006: Multiple Choice Display
  - Multiple choice containers in Practice and Session modes
  - Answer selection and submission
  - All problem types coverage

- **challenge-hints.spec.js** - Tests for Challenge Mode hints functionality
- **slope-parsing.spec.js** - Tests for slope input parsing
- **spam-click-prevention.spec.js** - Tests for preventing multiple submissions

## Setup

### Prerequisites

1. **Install Node.js** (if not already installed):
   - Download from https://nodejs.org/
   - Or use a package manager:
     - macOS: `brew install node`
     - Linux: `sudo apt install nodejs npm`
     - Windows: Download installer from nodejs.org

2. **Install Playwright**:
   ```bash
   npm install
   npx playwright install
   ```

### Running Tests

1. **Run all tests**:
   ```bash
   npm test
   ```

2. **Run tests with UI mode** (interactive):
   ```bash
   npm run test:ui
   ```

3. **Run tests in headed mode** (see browser):
   ```bash
   npm run test:headed
   ```

4. **Run specific test file**:
   ```bash
   npx playwright test vertical-navigation.spec.js
   ```

5. **Run tests for specific browser**:
   ```bash
   npx playwright test --project=chromium
   ```

## Test Coverage

### Vertical Navigation Sidebar (Milestone 14)
- ✅ Desktop sidebar visibility and layout
- ✅ All 9 tabs displayed correctly
- ✅ Vertical flex layout
- ✅ Active tab left border styling
- ✅ Tab switching functionality
- ✅ Mobile menu visibility
- ✅ Mobile menu open/close
- ✅ Overlay click to close
- ✅ Tab click closes mobile menu
- ✅ Grid layout structure

### Challenge Mode - New Problem Types (Issue #009)
- ✅ Challenge mode for all 8 problem types:
  - Slope & Description
  - Line Relationship
  - Parallel Line
  - Perpendicular Line
  - Intercepts
  - Rate of Change
  - Linear Functions
  - Standard Form
- ✅ Question generation verification
- ✅ Multiple choice options display
- ✅ Answer submission functionality
- ✅ Problem type mapping verification

## Configuration

Tests are configured in `playwright.config.js`:
- Base URL: `http://localhost:8000`
- Web server: Python HTTP server on port 8000
- Browsers: Chromium, Firefox, WebKit
- Retries: 2 in CI, 0 locally

## Troubleshooting

### Tests fail to start
- Ensure Node.js is installed: `node --version`
- Ensure Playwright is installed: `npm install`
- Ensure browsers are installed: `npx playwright install`

### Port 8000 already in use
- Change port in `playwright.config.js` webServer.url
- Or stop the process using port 8000

### Tests timeout
- Increase timeout in test file: `test.setTimeout(60000)`
- Check that the app is loading correctly
- Verify baseURL is correct

### Browser not found
- Run `npx playwright install` to install browsers
- Or install specific browser: `npx playwright install chromium`

## CI/CD Integration

Tests can be run in CI/CD pipelines:
```bash
# Install dependencies
npm install
npx playwright install --with-deps

# Run tests
npm test
```

## Writing New Tests

1. Create a new `.spec.js` file in this directory
2. Import test utilities: `import { test, expect } from '@playwright/test';`
3. Use descriptive test names
4. Follow existing test patterns
5. Add to this README

Example:
```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    // Test code here
  });
});
```

