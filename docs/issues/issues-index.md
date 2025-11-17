# Issues Index

This file tracks all issues reported and resolved for the St. Benedict's Prep - 8th Grade Math application.

## Open Issues

None currently.

## Resolved Issues

### Issue #032: Auto-Advance Not Working in Graphing Challenge Mode
- **Date**: 2025-11-17 00:00:00
- **Status**: ✅ RESOLVED
- **Priority**: CRITICAL
- **Severity**: High
- **Reporter**: User
- **Resolution Time**: 15 minutes
- **Description**: After submitting an answer in Interactive Graphing Challenge mode, the question did not auto-advance to the next question. User had to manually navigate.
- **Root Cause**: The `gameState.stats` object used camelCase keys (`graphPerpendicular`) but question types were hyphenated (`graph-perpendicular`), causing `updateStats()` to fail with TypeError and preventing setTimeout from executing.
- **Fix**: Changed all graphing stats keys from camelCase to hyphenated format to match question types: `graphSlopeIntercept` → `'graph-slopeintercept'`, etc.
- **Files Modified**: `app.js`
- **Commits**: 1 commit (dec4776)
- **Details**: [issue-032-20251117-000000.md](./issue-032-20251117-000000.md)

### Issue #031: ReferenceError - nextChallengeQuestion Not Defined
- **Date**: 2025-11-16 23:30:00
- **Status**: ✅ RESOLVED
- **Priority**: HIGH
- **Severity**: Medium
- **Reporter**: User
- **Resolution Time**: 5 minutes
- **Description**: After submitting an answer in graphing Challenge mode, a JavaScript error occurred: `ReferenceError: Can't find variable: nextChallengeQuestion`.
- **Root Cause**: Code was calling non-existent function `nextChallengeQuestion()` instead of the correct `navigateChallenge('next')`.
- **Fix**: Changed function call from `nextChallengeQuestion()` to `navigateChallenge('next')` at line 1714.
- **Files Modified**: `app.js`
- **Commits**: 1 commit (2a398d8)
- **Details**: [issue-031-20251116-233000.md](./issue-031-20251116-233000.md)

### Issue #030: No Points Displaying in Interactive Graphing Challenge Mode
- **Date**: 2025-11-16 22:30:00
- **Status**: ✅ RESOLVED
- **Priority**: CRITICAL
- **Severity**: High
- **Reporter**: User
- **Resolution Time**: 15 minutes
- **Description**: After fixing Issue #029, graphing Challenge mode displayed the correct canvas but no clickable points were visible, making questions impossible to answer.
- **Root Cause**: The `displayChallengeQuestion()` function was checking for camelCase question types (`'graphParallel'`) but questions now have hyphenated types (`'graph-parallel'`), so the condition never matched and InteractiveGraph was never initialized.
- **Fix**: Updated condition in `displayChallengeQuestion()` to check for hyphenated types: `question.type === 'graph-slopeintercept'` instead of `question.type === 'graphSlopeIntercept'`.
- **Files Modified**: `app.js`
- **Commits**: 1 commit
- **Details**: [issue-030-20251116-223000.md](./issue-030-20251116-223000.md)

### Issue #029: Challenge Mode from Graphing Tabs Shows Wrong Questions
- **Date**: 2025-11-16 22:00:00
- **Status**: ✅ RESOLVED
- **Priority**: CRITICAL
- **Severity**: High
- **Reporter**: User
- **Resolution Time**: 25 minutes
- **Description**: Starting Challenge mode from any graphing tab (Slope-Intercept, Point-Slope, Parallel, Perpendicular, Absolute Value) would show "Slope & Description" questions instead of the expected graphing questions.
- **Root Cause**: The `mapTabToProblemType()` function was missing mappings for the 5 new graphing tabs added in Milestone 19, causing it to default to 'slope' problem type.
- **Fix**: Added 5 new mappings to `mapTabToProblemType()` function: `graph-slopeintercept` → `graphSlopeIntercept`, `graph-pointslope` → `graphPointSlope`, `graph-parallel` → `graphParallel`, `graph-perpendicular` → `graphPerpendicular`, `graph-absolutevalue` → `graphAbsoluteValue`.
- **Files Modified**: `app.js`
- **Commits**: 1 commit
- **Details**: [issue-029-20251116-220000.md](./issue-029-20251116-220000.md)

### Issue #028: Button Styling Inconsistent in Interactive Graphing Tabs
- **Date**: 2025-11-16 21:47:00
- **Status**: ✅ RESOLVED
- **Priority**: LOW
- **Severity**: Minor (Visual)
- **Reporter**: User
- **Resolution Time**: 8 minutes
- **Description**: Submit and Next buttons in interactive graphing tabs had different styling than other buttons in the app.
- **Root Cause**: Used non-existent CSS classes (`primary-button`, `secondary-button`) instead of standard `submit-button` class.
- **Fix**: Updated all 10 buttons across 5 graphing sections to use `submit-button` class.
- **Files Modified**: `index.html`
- **Commits**: 1 commit
- **Details**: [issue-028-20251116-214700.md](./issue-028-20251116-214700.md)

### Issue #027: Interactive Graphing Tabs Not Displaying Content
- **Date**: 2025-11-16 21:15:00
- **Status**: ✅ RESOLVED
- **Priority**: CRITICAL
- **Severity**: High
- **Reporter**: User
- **Resolution Time**: 30 minutes
- **Description**: All 5 new interactive graphing tabs (Slope-Intercept, Point-Slope, Parallel Lines, Perpendicular Lines, Absolute Value) were completely blank when clicked.
- **Root Cause**: Multiple structural issues:
  1. Section IDs missing `-panel` suffix (expected by JavaScript)
  2. Wrong class name (`tab-content` instead of `problem-panel`)
  3. Wrong HTML tags (`<section>` instead of `<div>`)
  4. Missing proper DOM structure (problem-layout, problem-card wrappers)
  5. Missing hint panels for each tab
  6. Improper nesting and indentation
- **Fix**: 
  - Part 1: Renamed all section IDs to include `-panel` suffix
  - Part 2: Restructured all 5 graphing sections with proper DOM hierarchy
  - Part 3: Removed unnecessary mode-selectors and fixed indentation
- **Files Modified**: `index.html`
- **Commits**: 3 commits (4304076, 636d711, aeb2c3b)
- **Details**: [issue-027-20251116-211500.md](./issue-027-20251116-211500.md)

### Issue #026: Point-Slope & Absolute Value Auto-Advance Broken
- **Date**: 2025-11-16
- **Status**: ✅ RESOLVED
- **Priority**: HIGH
- **Description**: Questions in Challenge mode for Point-Slope and Absolute Value types did not automatically advance after answering.
- **Root Cause**: Missing stats entries in gameState initialization
- **Fix**: Added `pointSlope: { attempted: 0, correct: 0 }` and `absoluteValue: { attempted: 0, correct: 0 }` to gameState.stats
- **Files Modified**: `app.js`
- **Details**: [issue-026-*.md](./issue-026-*.md)

### Issue #025: Auto-Advance Not Working (Initial Report)
- **Date**: 2025-11-16
- **Status**: ✅ RESOLVED (Duplicate of #026)
- **Description**: Initial report of auto-advance not working in Challenge mode
- **Resolution**: Diagnosed as browser caching initially, but later identified as actual bug (Issue #026)

### Issue #024: Standard Form Challenge Mode Button Not Working
- **Date**: 2025-11-16
- **Status**: ✅ RESOLVED
- **Priority**: MEDIUM
- **Description**: Button to start Challenge mode for Standard Form appeared non-functional
- **Root Cause**: Browser caching issue
- **Fix**: Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
- **Files Modified**: None (user-side fix)

### Issue #023: Linear Functions Challenge Mode
- **Date**: 2025-11-16
- **Status**: ✅ RESOLVED
- **Priority**: MEDIUM
- **Description**: Linear Functions challenge mode not working correctly
- **Root Cause**: Question generation using hardcoded labels instead of value-based pattern
- **Fix**: Updated `generateLinearFunctionQuestion` to use value-based option generation
- **Files Modified**: `app.js`

### Issue #022: All Buttons Broken
- **Date**: 2025-11-16
- **Status**: ✅ RESOLVED
- **Priority**: CRITICAL
- **Description**: All buttons in the application stopped working
- **Root Cause**: Syntax error in previous edit
- **Fix**: Corrected syntax error in `app.js`
- **Files Modified**: `app.js`

### Issue #021: Achievement Button Not Working
- **Date**: 2025-11-16
- **Status**: ✅ RESOLVED
- **Priority**: HIGH
- **Description**: Clicking "View All" achievements button did nothing
- **Root Cause**: Modal display logic error
- **Fix**: Updated modal display code
- **Files Modified**: `app.js`

### Issue #020: Duplicate & More Achievements
- **Date**: 2025-11-16
- **Status**: ✅ RESOLVED
- **Priority**: MEDIUM
- **Description**: Speed Runner and Lightning Fast achievements were identical; needed more achievement variety
- **Fix**: Differentiated achievements and added 10+ new achievement types
- **Files Modified**: `app.js`

### Issue #019: Duplicate Answers Still Remaining
- **Date**: 2025-11-16
- **Status**: ✅ RESOLVED
- **Priority**: HIGH
- **Description**: Same answer option appearing multiple times in multiple choice (e.g., "3" twice)
- **Root Cause**: Distractor generation not checking for uniqueness
- **Fix**: Implemented `deduplicateOptions` function using Set
- **Files Modified**: `app.js`

### Issue #018: Complex Fractions in Answers
- **Date**: 2025-11-16
- **Status**: ✅ RESOLVED
- **Priority**: MEDIUM
- **Description**: Answer options contained complex fractions like "-33/100" that are too difficult for 8th graders
- **Root Cause**: Distractor generation using arbitrary calculations
- **Fix**: Implemented strict whitelist of simple values for distractors
- **Files Modified**: `app.js`

### Issue #017: Duplicate Answers in Challenge Mode
- **Date**: 2025-11-16
- **Status**: ✅ RESOLVED (Duplicate of #019)
- **Description**: Duplicate answer options appearing in Challenge mode

### Issue #014: No Correct Answer Available
- **Date**: 2025-11-15
- **Status**: ✅ RESOLVED
- **Priority**: CRITICAL
- **Description**: A question was displayed where none of the options matched the correct answer
- **Root Cause**: Label-based validation vs. value-based options caused mismatch
- **Fix**: Completely removed label-based system, use only `dataset.correct` attribute
- **Files Modified**: `app.js`

### Issue #013: Complex Distractors
- **Date**: 2025-11-15
- **Status**: ✅ RESOLVED
- **Priority**: MEDIUM
- **Description**: Multiple choice distractors too complex for 8th grade (e.g., "-27/10")
- **Fix**: Simplified distractor generation with age-appropriate values
- **Files Modified**: `app.js`

### Issue #012: Answer Ordering and Highlighting
- **Date**: 2025-11-15
- **Status**: ✅ RESOLVED
- **Priority**: HIGH
- **Description**: Multiple choice answers not in alphabetical order (A, B, C, D) and highlighted based on letter
- **Fix**: Implemented dynamic label assignment and proper randomization
- **Files Modified**: `app.js`

### Issue #009: Challenge Mode Not Working for New Problem Types
- **Date**: 2025-11-12
- **Status**: ✅ RESOLVED
- **Description**: Challenge mode not functional for newly added problem types
- **Fix**: Updated Challenge mode logic to support all problem types
- **Files Modified**: `app.js`

### Issue #008: Vertical Navigation Sidebar Not Showing
- **Date**: 2025-11-12
- **Status**: ✅ RESOLVED
- **Description**: Vertical sidebar navigation was not visible
- **Fix**: Updated CSS and HTML structure for vertical navigation
- **Files Modified**: `index.html`, `styles.css`

### Issue #006: Multiple Choice Not Appearing in Practice/Session Modes
- **Date**: Earlier
- **Status**: ✅ RESOLVED
- **Description**: Multiple choice options not displaying in Practice and Session modes
- **Fix**: Rewrote Practice mode (Milestone 12)
- **Files Modified**: `app.js`

---

**Total Issues**: 32 (32 resolved, 0 open)
**Last Updated**: 2025-11-17 00:00:00

