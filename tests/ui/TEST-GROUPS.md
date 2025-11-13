# Test Groups - Quick Reference

Tests have been organized into smaller groups for faster execution. Run specific groups based on what you're testing.

## Quick Test Groups

### `npm run test:quick`
**Fast smoke tests** (~5-10 seconds)
- Basic app loading
- Vertical navigation sidebar

### `npm run test:basic`
**Core functionality** (~15-20 seconds)
- Slope input parsing
- Multiple choice display in Practice/Session modes
- Spam click prevention

### `npm run test:challenge`
**All challenge mode tests** (~30-45 seconds)
- Challenge hints functionality
- Challenge mode for basic types (Slope, Relationship, Parallel, Perpendicular)
- Challenge mode for new types (Intercepts, Rate of Change, Linear Functions, Standard Form)

### `npm run test:ui-components`
**UI component tests** (~10-15 seconds)
- Vertical navigation sidebar
- Multiple choice display

### `npm run test:challenge-basic`
**Challenge mode - basic types only** (~15-20 seconds)
- Slope & Description
- Line Relationship
- Parallel Line
- Perpendicular Line

### `npm run test:challenge-new`
**Challenge mode - new types only** (~15-20 seconds)
- Intercepts
- Rate of Change
- Linear Functions
- Standard Form

## Full Test Suite

### `npm test` or `npm run test:all`
Runs all tests (~60-90 seconds)
- All test files
- Uses 2 workers for parallel execution

## Individual Test Files

Run specific test files:
```bash
npx playwright test tests/ui/vertical-navigation.spec.js
npx playwright test tests/ui/slope-parsing.spec.js
npx playwright test tests/ui/challenge-mode-basic-types.spec.js
```

## Test Organization

Tests are split into these files:

1. **example.spec.js** - Basic app loading
2. **vertical-navigation.spec.js** - Navigation sidebar (Milestone 14)
3. **slope-parsing.spec.js** - Input parsing validation
4. **multiple-choice-display.spec.js** - Multiple choice UI (Issue #006)
5. **spam-click-prevention.spec.js** - Prevent duplicate submissions
6. **challenge-hints.spec.js** - Challenge mode hints
7. **challenge-mode-basic-types.spec.js** - Challenge mode for original 4 problem types
8. **challenge-mode-new-types.spec.js** - Challenge mode for new 4 problem types (Issue #009)

## Recommendations

- **During development**: Use `test:quick` or `test:basic` for fast feedback
- **Before committing**: Run `test:all` to ensure everything works
- **Testing specific features**: Use the specific test group (e.g., `test:challenge-new` for new problem types)

