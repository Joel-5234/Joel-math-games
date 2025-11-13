# Playwright Test Setup Instructions

## Issue
Node.js/npm is not currently available in the PATH, so Playwright tests cannot be run directly.

## To Run Playwright Tests

### Option 1: Install Node.js and npm
1. Install Node.js from https://nodejs.org/ (includes npm)
2. Verify installation: `node --version` and `npm --version`
3. Install dependencies: `npm install`
4. Install Playwright browsers: `npx playwright install`
5. Run tests: `npm test` or `npx playwright test tests/ui/multiple-choice-display.spec.js`

### Option 2: Use npm scripts (if Node.js is installed)
- Run all tests: `npm test`
- Run with UI: `npm run test:ui`
- Run headed (see browser): `npm run test:headed`

### Option 3: Manual Browser Testing
Since automated tests require Node.js setup, you can manually test:
1. Open `index.html` in a browser
2. Set mode to Practice or Session
3. Enter problem data and click "Calculate"
4. Verify multiple choice containers appear
5. Select answers and submit
6. Check browser console for debug logs

## Test File Created
- `tests/ui/multiple-choice-display.spec.js` - Comprehensive tests ready to run once Node.js is available

## What the Tests Cover
- Multiple choice display in Practice mode (all 4 problem types)
- Multiple choice display in Session mode
- Answer selection and submission
- Error handling
- Container visibility and hiding
