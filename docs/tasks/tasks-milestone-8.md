# Milestone 8: Hints in Challenge Mode

## Goal
Add hint functionality to Set Challenge Mode, allowing users to access hints with a limit and point penalty system.

## Overview
Hints in Challenge Mode will:
- Display in the same right column layout as practice mode
- Be available for all questions (answered, unanswered, skipped)
- Reduce points by half when used (halve the base score)
- Have a limit of 5 hints per challenge
- Track hint usage per question and overall
- Display hint usage statistics in completion summary

## Tasks

### 8.1 Challenge State Updates
- [x] Add hint tracking to challengeState:
  ```javascript
  {
    hintsUsed: 0, // Total hints used in challenge
    hintsUsedPerQuestion: {}, // Map of question index to boolean (used hint)
    hintLimit: 5 // Maximum hints allowed per challenge
  }
  ```
- [x] Initialize hint tracking when challenge starts
- [x] Reset hint tracking when challenge resets

### 8.2 Challenge Interface Layout
- [x] Update challenge interface to use two-column layout (like practice mode)
- [x] Create challenge-layout container with flex display
- [x] Move challenge content to left column
- [x] Add hint panel to right column (similar to practice mode)
- [x] Ensure responsive design (stack columns on smaller screens)

### 8.3 Hint Button in Challenge Interface
- [x] Add hint button to challenge interface header or question area
- [x] Position hint button appropriately (visible but not intrusive)
- [x] Show hint count: "Hints: X/5" or "Hints Remaining: X"
- [x] Disable hint button when limit reached
- [x] Style hint button consistently with practice mode

### 8.4 Hint Display Logic
- [x] Reuse existing showHints() function for challenge mode
- [x] Create challenge-specific hint panel (or reuse existing)
- [x] Display hints in right column when button clicked
- [x] Ensure hints show correct content for current problem type
- [x] Allow closing hints (same as practice mode)

### 8.5 Hint Usage Tracking
- [x] Track when hint is used for current question
- [x] Increment hintsUsed counter
- [x] Mark question as having used hint in hintsUsedPerQuestion
- [x] Prevent using multiple hints on same question (optional - or allow)
- [x] Update hint count display after each use

### 8.6 Scoring Modifications
- [x] Modify updateChallengeStats() to check if hint was used
- [x] If hint used, award half points (Math.floor(points / 2))
- [x] Store original points and adjusted points separately
- [x] Ensure hint penalty only applies to questions that used hints
- [x] Update score display to reflect adjusted points

### 8.7 Hint Limit Enforcement
- [x] Check hint limit before showing hint
- [x] Disable hint button when limit reached
- [x] Show message when hint limit reached
- [x] Prevent hint usage after limit reached
- [x] Update UI to show hint limit status

### 8.8 Completion Summary Updates
- [x] Add hint usage statistics to completion summary
- [x] Display total hints used: "Hints Used: X/5"
- [x] Show which questions used hints (optional)
- [x] Calculate points lost due to hints
- [x] Display adjusted score information

### 8.9 UI/UX Enhancements
- [x] Add visual indicator when hint is used on a question
- [x] Show hint count in challenge header
- [x] Add tooltip or help text explaining hint penalty
- [x] Ensure hint panel doesn't interfere with navigation
- [x] Make hint button accessible and clear

### 8.10 Integration Testing
- [x] Test hint display in challenge mode
- [x] Test hint limit enforcement
- [x] Test scoring with hints (verify half points
- [x] Test hint tracking across navigation
- [x] Test completion summary with hint statistics
- [x] Test responsive layout with hints
- [x] Verify hints work for all problem types

## Acceptance Criteria
- [x] Hints display in right column in challenge mode (same as practice mode)
- [x] Hint button available in challenge interface
- [x] Hints available for all questions (answered, unanswered, skipped)
- [x] Using a hint halves the points for that question
- [x] Maximum of 5 hints per challenge
- [x] Hint usage tracked and displayed in completion summary
- [x] Hint button disabled when limit reached
- [x] Two-column layout works responsively
- [x] All existing challenge features still work

## Technical Notes

### Scoring Logic
- Base score: config.baseScore (default 10)
- With hint: Math.floor(config.baseScore / 2) = 5 points
- Track both original and adjusted scores for statistics

### Hint Limit
- Default: 5 hints per challenge
- Can be made configurable in config.json if needed
- Enforced at UI level (disable button) and logic level (check before showing)

### State Management
- Add hint tracking to challengeState object
- Persist hint usage per question for accurate scoring
- Reset hint tracking when challenge resets

### UI Layout
- Use flexbox layout similar to practice mode
- Left column: challenge content (question, input, navigation)
- Right column: hint panel (same as practice mode)
- Responsive: stack columns on smaller screens

### Hint Panel
- Reuse existing hint panel structure
- Use same hint content as practice mode
- Ensure panel shows/hides correctly in challenge mode
- Maintain consistency with practice mode design

