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
- [ ] Add hint tracking to challengeState:
  ```javascript
  {
    hintsUsed: 0, // Total hints used in challenge
    hintsUsedPerQuestion: {}, // Map of question index to boolean (used hint)
    hintLimit: 5 // Maximum hints allowed per challenge
  }
  ```
- [ ] Initialize hint tracking when challenge starts
- [ ] Reset hint tracking when challenge resets

### 8.2 Challenge Interface Layout
- [ ] Update challenge interface to use two-column layout (like practice mode)
- [ ] Create challenge-layout container with flex display
- [ ] Move challenge content to left column
- [ ] Add hint panel to right column (similar to practice mode)
- [ ] Ensure responsive design (stack columns on smaller screens)

### 8.3 Hint Button in Challenge Interface
- [ ] Add hint button to challenge interface header or question area
- [ ] Position hint button appropriately (visible but not intrusive)
- [ ] Show hint count: "Hints: X/5" or "Hints Remaining: X"
- [ ] Disable hint button when limit reached
- [ ] Style hint button consistently with practice mode

### 8.4 Hint Display Logic
- [ ] Reuse existing showHints() function for challenge mode
- [ ] Create challenge-specific hint panel (or reuse existing)
- [ ] Display hints in right column when button clicked
- [ ] Ensure hints show correct content for current problem type
- [ ] Allow closing hints (same as practice mode)

### 8.5 Hint Usage Tracking
- [ ] Track when hint is used for current question
- [ ] Increment hintsUsed counter
- [ ] Mark question as having used hint in hintsUsedPerQuestion
- [ ] Prevent using multiple hints on same question (optional - or allow)
- [ ] Update hint count display after each use

### 8.6 Scoring Modifications
- [ ] Modify updateChallengeStats() to check if hint was used
- [ ] If hint used, award half points (Math.floor(points / 2))
- [ ] Store original points and adjusted points separately
- [ ] Ensure hint penalty only applies to questions that used hints
- [ ] Update score display to reflect adjusted points

### 8.7 Hint Limit Enforcement
- [ ] Check hint limit before showing hint
- [ ] Disable hint button when limit reached
- [ ] Show message when hint limit reached
- [ ] Prevent hint usage after limit reached
- [ ] Update UI to show hint limit status

### 8.8 Completion Summary Updates
- [ ] Add hint usage statistics to completion summary
- [ ] Display total hints used: "Hints Used: X/5"
- [ ] Show which questions used hints (optional)
- [ ] Calculate points lost due to hints
- [ ] Display adjusted score information

### 8.9 UI/UX Enhancements
- [ ] Add visual indicator when hint is used on a question
- [ ] Show hint count in challenge header
- [ ] Add tooltip or help text explaining hint penalty
- [ ] Ensure hint panel doesn't interfere with navigation
- [ ] Make hint button accessible and clear

### 8.10 Integration Testing
- [ ] Test hint display in challenge mode
- [ ] Test hint limit enforcement
- [ ] Test scoring with hints (verify half points)
- [ ] Test hint tracking across navigation
- [ ] Test completion summary with hint statistics
- [ ] Test responsive layout with hints
- [ ] Verify hints work for all problem types

## Acceptance Criteria
- [ ] Hints display in right column in challenge mode (same as practice mode)
- [ ] Hint button available in challenge interface
- [ ] Hints available for all questions (answered, unanswered, skipped)
- [ ] Using a hint halves the points for that question
- [ ] Maximum of 5 hints per challenge
- [ ] Hint usage tracked and displayed in completion summary
- [ ] Hint button disabled when limit reached
- [ ] Two-column layout works responsively
- [ ] All existing challenge features still work

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

