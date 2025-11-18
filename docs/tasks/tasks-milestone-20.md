# Milestone 20: Mid-Challenge Restart Button

**Status:** Pending  
**Priority:** Medium  
**Estimated Effort:** 3-4 hours  
**Target Completion:** TBD

---

## Overview

Add a "Restart Challenge" button to the challenge navigation bar that allows users to restart the current challenge mid-way with fresh questions, without having to complete or exit the challenge first.

---

## Business Value

### User Benefits
- **Faster iteration:** Restart immediately without completing all questions
- **Better practice flow:** Get new questions quickly if current set is too easy/hard
- **Reduced frustration:** Don't have to finish a bad run to try again
- **Learning optimization:** Restart when you realize you need to review concepts

### Use Cases
1. Student starts challenge, realizes questions are too difficult → restart for new set
2. Student makes mistakes on first 2 questions, wants fresh start → restart
3. Student accidentally skips/gives up on questions → restart to try again
4. Student wants to improve time/accuracy → restart for another attempt

---

## Requirements

### Functional Requirements

#### FR1: Restart Button Placement
- **Location:** Challenge navigation bar (alongside Skip, Give Up, Submit buttons)
- **Visibility:** Visible during active challenge (all question states)
- **Positioning:** Between "Give Up" and "Submit Answer" buttons
- **Label:** "Restart Challenge" or "🔄 Restart"

#### FR2: Restart Behavior
- **Generate new questions:** Same problem type, same count as current challenge
- **Reset to question 1:** Start from beginning of new question set
- **Clear all progress:**
  - Reset correct/incorrect counts to 0
  - Clear question times array
  - Reset hints used to 0
  - Clear all question states (answered/skipped/gave-up)
  - Reset challenge timer to 0
  - Reset question timer to 0
- **Keep challenge active:** Don't exit to practice mode
- **Keep problem type:** Same type as current challenge (e.g., Slope → Slope)
- **Keep question count:** Same number as current challenge (e.g., 5 → 5)

#### FR3: Confirmation Dialog
- **Trigger:** Clicking "Restart Challenge" button
- **Message:** "Are you sure you want to restart? All current progress will be lost."
- **Actions:**
  - "Yes, Restart" button (primary action, destructive style)
  - "Cancel" button (secondary action, returns to challenge)
- **Behavior:**
  - Yes: Execute restart (new questions, reset stats)
  - Cancel: Close modal, return to current question
  - X (close): Same as Cancel

#### FR4: Button States
- **Enabled:** Always enabled during challenge (any question state)
- **Disabled:** Never disabled (always allow restart)
- **Visual feedback:** Hover effect, click effect

#### FR5: Scope
- **Challenge Mode:** All problem types, all set sizes (5, 10, 15)
- **Not in Practice Mode:** Button doesn't appear in practice/session modes
- **All Problem Types:**
  - Slope & Description
  - Line Relationship
  - Parallel Line
  - Perpendicular Line
  - Intercepts
  - Rate of Change
  - Linear Functions
  - Standard Form
  - Point-Slope Form
  - Absolute Value
  - Graph: Slope-Intercept
  - Graph: Point-Slope
  - Graph: Parallel Lines
  - Graph: Perpendicular Lines
  - Graph: Absolute Value

### Non-Functional Requirements

#### NFR1: Styling
- **Button style:** Similar to Submit button but grey
- **Color scheme:** Grey background (#6c757d), white text
- **Size:** Match other navigation buttons (padding: 12px 24px)
- **Font:** 1rem, weight 600
- **Hover effect:** TranslateY(-2px), box-shadow
- **Border radius:** 5px

#### NFR2: Performance
- **Question generation:** Instant (< 100ms)
- **State reset:** Instant (< 50ms)
- **No lag:** Smooth transition from confirmation to new questions

#### NFR3: Accessibility
- **Keyboard navigation:** Tab to button, Enter to click
- **Screen reader:** "Restart Challenge button"
- **Focus visible:** Clear focus indicator

---

## User Stories

### US1: Quick Restart
**As a** student practicing math problems  
**I want** to restart the challenge mid-way  
**So that** I can get new questions without finishing the current set

**Acceptance Criteria:**
- ✅ Restart button visible during challenge
- ✅ Button positioned in navigation bar
- ✅ Clicking shows confirmation dialog
- ✅ Confirming generates new questions
- ✅ New questions use same problem type and count

### US2: Prevent Accidental Restart
**As a** student in the middle of a challenge  
**I want** a confirmation before restarting  
**So that** I don't lose progress accidentally

**Acceptance Criteria:**
- ✅ Confirmation modal appears on click
- ✅ Clear warning message about losing progress
- ✅ Two clear options: Yes/Cancel
- ✅ Cancel returns to challenge without changes
- ✅ X button also cancels

### US3: Fresh Start
**As a** student who wants to improve  
**I want** the restart to clear all my stats  
**So that** I can start completely fresh

**Acceptance Criteria:**
- ✅ Correct/incorrect counts reset to 0
- ✅ Question times cleared
- ✅ Hints used reset to 0
- ✅ Timer reset to 0
- ✅ Question 1 displayed
- ✅ No carryover from previous attempt

---

## Technical Design

### Components to Modify

#### 1. HTML (`index.html`)
**File:** `index.html`  
**Changes:**
- Add restart button to challenge navigation HTML
- Add confirmation modal HTML

**Location:** Challenge interface section

```html
<!-- Challenge Navigation (line ~530) -->
<div class="challenge-navigation">
    <button id="challengePrev" class="nav-button">← Back</button>
    <button id="challengeSkip" class="nav-button skip-btn">Skip</button>
    <button id="challengeGiveUp" class="nav-button give-up-btn">Give Up</button>
    <!-- NEW: Restart button -->
    <button id="challengeRestart" class="nav-button restart-btn">🔄 Restart</button>
    <button id="challengeNext" class="nav-button">Next →</button>
    <button id="challengeSubmit" class="nav-button submit-btn">Submit Answer</button>
</div>

<!-- NEW: Restart Confirmation Modal -->
<div id="restartChallengeModal" class="modal">
    <div class="modal-content">
        <span class="close-modal" id="closeRestartModal">&times;</span>
        <h2>Restart Challenge?</h2>
        <p>Are you sure you want to restart? All current progress will be lost.</p>
        <div class="modal-actions">
            <button id="confirmRestart" class="action-button destructive-button">Yes, Restart</button>
            <button id="cancelRestart" class="action-button secondary-button">Cancel</button>
        </div>
    </div>
</div>
```

#### 2. CSS (`styles.css`)
**File:** `styles.css`  
**Changes:**
- Add styling for restart button
- Add styling for confirmation modal
- Add destructive button style

```css
/* Restart button styling */
.nav-button.restart-btn {
    background: #6c757d;  /* Grey */
    color: white;
    border: none;
}

.nav-button.restart-btn:hover:not(:disabled) {
    background: #5a6268;  /* Darker grey */
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Destructive action button */
.destructive-button {
    background: #dc3545;
    color: white;
}

.destructive-button:hover {
    background: #c82333;
}

.secondary-button {
    background: #6c757d;
    color: white;
}

.secondary-button:hover {
    background: #5a6268;
}
```

#### 3. JavaScript (`app.js`)
**File:** `app.js`  
**Changes:**
- Add `showRestartConfirmationModal()` function
- Add `hideRestartConfirmationModal()` function
- Add `restartChallengeWithNewQuestions()` function
- Add event listeners for restart button and modal buttons
- Add button visibility logic in `updateChallengeNavigation()`

**New Functions:**

```javascript
// Show restart confirmation modal
function showRestartConfirmationModal() {
    const modal = document.getElementById('restartChallengeModal');
    if (modal) {
        modal.classList.add('active');
    }
}

// Hide restart confirmation modal
function hideRestartConfirmationModal() {
    const modal = document.getElementById('restartChallengeModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Restart challenge with new questions
function restartChallengeWithNewQuestions() {
    if (!challengeState.active) return;
    
    console.log('[Restart] Restarting challenge with new questions...');
    
    // Store current challenge settings
    const problemType = challengeState.currentProblemType;
    const setSize = challengeState.setSize;
    
    console.log(`[Restart] Problem Type: ${problemType}, Set Size: ${setSize}`);
    
    // Generate new questions
    const newQuestions = generateChallengeQuestions(problemType, setSize);
    
    // Reset challenge state completely
    challengeState.questions = newQuestions;
    challengeState.currentQuestionIndex = 0;
    challengeState.answers = {};
    challengeState.questionStates = {};
    challengeState.correctAnswers = {};
    challengeState.hintsUsed = 0;
    challengeState.hintsUsedPerQuestion = {};
    challengeState.questionTimes = [];
    challengeState.progressMilestones = {
        fifty: false,
        eightyFive: false,
        hundred: false
    };
    
    // Reset timers
    stopChallengeTimer();
    stopQuestionTimer();
    challengeState.challengeStartTime = Date.now();
    challengeState.totalChallengeTime = 0;
    startChallengeTimer();
    
    console.log('[Restart] State reset, displaying first question...');
    
    // Display first question
    displayChallengeQuestion();
    
    // Start question timer for first question
    startQuestionTimer();
    
    console.log('[Restart] Challenge restarted successfully!');
}
```

**Event Listeners** (in `DOMContentLoaded`):

```javascript
// Restart challenge button
document.getElementById('challengeRestart')?.addEventListener('click', () => {
    console.log('[Restart] Restart button clicked');
    showRestartConfirmationModal();
});

// Confirm restart
document.getElementById('confirmRestart')?.addEventListener('click', () => {
    console.log('[Restart] Restart confirmed');
    hideRestartConfirmationModal();
    restartChallengeWithNewQuestions();
});

// Cancel restart
document.getElementById('cancelRestart')?.addEventListener('click', () => {
    console.log('[Restart] Restart cancelled');
    hideRestartConfirmationModal();
});

// Close restart modal via X
document.getElementById('closeRestartModal')?.addEventListener('click', () => {
    console.log('[Restart] Restart modal closed');
    hideRestartConfirmationModal();
});
```

**Button Visibility** (in `updateChallengeNavigation()`):

```javascript
function updateChallengeNavigation() {
    // ... existing code ...
    
    // Restart button always enabled during challenge
    const restartBtn = document.getElementById('challengeRestart');
    if (restartBtn) {
        restartBtn.style.display = 'inline-block';
        restartBtn.disabled = false;
    }
}
```

---

## Implementation Plan

### Phase 1: HTML & CSS (30 minutes)
**Tasks:**
1. Add restart button to challenge navigation
2. Add restart confirmation modal HTML
3. Add CSS for restart button
4. Add CSS for destructive/secondary buttons
5. Test responsive layout

**Deliverables:**
- Button visible in challenge mode
- Proper styling and positioning
- Responsive on mobile/tablet

### Phase 2: JavaScript Core Functions (1 hour)
**Tasks:**
1. Create `showRestartConfirmationModal()` function
2. Create `hideRestartConfirmationModal()` function
3. Create `restartChallengeWithNewQuestions()` function
4. Add comprehensive console logging
5. Test state reset logic

**Deliverables:**
- Modal show/hide working
- Complete state reset on restart
- New questions generated correctly
- Timers reset properly

### Phase 3: Event Listeners (30 minutes)
**Tasks:**
1. Add restart button click listener
2. Add confirm button listener
3. Add cancel button listener
4. Add close X listener
5. Update button visibility logic

**Deliverables:**
- All buttons trigger correct actions
- Modal closes on cancel/X
- Restart executes on confirm

### Phase 4: Testing (1 hour)
**Tasks:**
1. Test all problem types (15 types)
2. Test all set sizes (5, 10, 15)
3. Test at different question positions (Q1, Q3, Q5)
4. Test with different states (answered, skipped, gave-up)
5. Test cancel/X functionality
6. Test keyboard navigation
7. Test on mobile/tablet
8. Verify no data carryover

**Deliverables:**
- All problem types work
- All scenarios tested
- No bugs found
- Documentation of edge cases

### Phase 5: Documentation & Deployment (30 minutes)
**Tasks:**
1. Update PRD with restart feature
2. Update README with user instructions
3. Create user guide screenshots
4. Update activity log
5. Commit and push to repo
6. Deploy to production

**Deliverables:**
- Documentation complete
- Code deployed
- Feature live

---

## Testing Strategy

### Manual Testing Checklist

#### Basic Functionality
- [ ] Restart button appears in challenge navigation
- [ ] Button has correct styling (grey, proper size)
- [ ] Clicking button shows confirmation modal
- [ ] Modal has correct message
- [ ] "Yes, Restart" button is red (destructive)
- [ ] "Cancel" button is grey
- [ ] X button closes modal

#### Restart Behavior
- [ ] Confirming restart generates new questions
- [ ] Question count matches original (5→5, 10→10, 15→15)
- [ ] Problem type matches original
- [ ] Displays question 1 of new set
- [ ] All stats reset to 0
- [ ] Timer resets to 0
- [ ] Hints used reset to 0
- [ ] Previous answers cleared

#### Cancel Behavior
- [ ] Clicking "Cancel" closes modal
- [ ] Clicking X closes modal
- [ ] Challenge state unchanged after cancel
- [ ] Current question still displayed
- [ ] Stats unchanged after cancel

#### All Problem Types (15 types)
- [ ] Slope & Description
- [ ] Line Relationship
- [ ] Parallel Line
- [ ] Perpendicular Line
- [ ] Intercepts
- [ ] Rate of Change
- [ ] Linear Functions
- [ ] Standard Form
- [ ] Point-Slope Form
- [ ] Absolute Value
- [ ] Graph: Slope-Intercept
- [ ] Graph: Point-Slope
- [ ] Graph: Parallel Lines
- [ ] Graph: Perpendicular Lines
- [ ] Graph: Absolute Value

#### Edge Cases
- [ ] Restart on question 1 (immediately)
- [ ] Restart on last question (before completion)
- [ ] Restart after answering all but not submitting last
- [ ] Restart with hints used
- [ ] Restart with questions skipped
- [ ] Restart with questions gave-up on
- [ ] Multiple restarts in a row

#### Responsive Design
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Button doesn't overlap other buttons
- [ ] Modal displays properly on small screens

#### Accessibility
- [ ] Tab to restart button works
- [ ] Enter key clicks button
- [ ] Focus visible on button
- [ ] Screen reader announces button
- [ ] Modal accessible via keyboard
- [ ] Escape key closes modal (optional)

### Automated Testing (Playwright)

```javascript
// Test restart functionality
test('Challenge restart button works correctly', async ({ page }) => {
  // Start challenge
  await page.goto('http://localhost:5500');
  await page.click('[data-tab="slope"]');
  await page.selectOption('#modeSelector', 'challenge');
  await page.click('#challengeSetupBtn');
  await page.click('[data-set-size="5"]');
  
  // Answer first question
  await page.click('input[name="challengeSlopeValue"]:first-of-type');
  await page.click('input[name="challengeSlopeClassification"]:first-of-type');
  await page.click('#challengeSubmit');
  
  // Wait for auto-advance
  await page.waitForTimeout(2000);
  
  // Click restart
  await page.click('#challengeRestart');
  
  // Verify modal appears
  await expect(page.locator('#restartChallengeModal')).toBeVisible();
  
  // Confirm restart
  await page.click('#confirmRestart');
  
  // Verify back at question 1
  await expect(page.locator('.challenge-question-number')).toHaveText('Question 1 of 5');
  
  // Verify stats reset
  const sessionInfo = await page.textContent('.session-info');
  expect(sessionInfo).toContain('Correct: 0');
});
```

---

## Acceptance Criteria

### Must Have
1. ✅ Restart button appears in challenge navigation bar
2. ✅ Button styled grey (like Back button)
3. ✅ Clicking button shows confirmation modal
4. ✅ Modal asks "Are you sure?" with Yes/Cancel options
5. ✅ Confirming restart generates new questions (same type, same count)
6. ✅ All challenge stats reset to 0
7. ✅ Timer resets to 0
8. ✅ Display returns to question 1
9. ✅ Cancel button closes modal without changes
10. ✅ Works for all 15 problem types
11. ✅ Works for all set sizes (5, 10, 15)
12. ✅ No JavaScript errors
13. ✅ Responsive on mobile/tablet

### Nice to Have
1. Escape key closes modal
2. Animation when modal appears
3. Loading indicator during question generation
4. Haptic feedback on mobile
5. Keyboard shortcut (e.g., Ctrl+R)
6. Restart count tracking for statistics
7. "Quick restart" option (skip confirmation after first restart)

---

## Risks & Mitigation

### Risk 1: State Not Fully Reset
**Impact:** High - User sees old data in new challenge  
**Probability:** Medium  
**Mitigation:**
- Comprehensive state reset checklist
- Thorough testing of all state variables
- Add defensive checks to ensure clean slate

### Risk 2: Question Generation Fails
**Impact:** High - Challenge breaks on restart  
**Probability:** Low  
**Mitigation:**
- Validate problem type and set size before generating
- Add error handling in `restartChallengeWithNewQuestions()`
- Fallback to default set size (5) if error

### Risk 3: Timer Issues
**Impact:** Medium - Incorrect time tracking  
**Probability:** Medium  
**Mitigation:**
- Explicitly stop both timers before restart
- Clear all timer intervals
- Test timer reset in all scenarios

### Risk 4: Accidental Clicks
**Impact:** Medium - User loses progress unintentionally  
**Probability:** High  
**Mitigation:**
- Confirmation modal (already included)
- Clear warning message
- Destructive button styling (red)

### Risk 5: UI Clutter
**Impact:** Low - Too many buttons in navigation  
**Probability:** Medium  
**Mitigation:**
- Use icon + text or icon only: "🔄 Restart"
- Responsive: Hide text on mobile, show icon only
- Position carefully to avoid overlap

---

## Success Metrics

### Quantitative
- **Adoption Rate:** % of users who use restart button per session
- **Restart Frequency:** Average restarts per challenge
- **Completion Rate:** Does restart increase challenge completions?
- **Time to Retry:** Time saved vs exiting and restarting manually

### Qualitative
- **User Feedback:** Survey users about restart feature
- **Bug Reports:** Zero critical bugs related to restart
- **Support Tickets:** No confusion about restart behavior

### Target Metrics
- 30%+ of challenge users try restart at least once
- Average 1-2 restarts per challenge session
- Zero state-related bugs after 1 week in production

---

## Dependencies

### Before This Milestone
- Milestone 19: Interactive Graphing Practice (✅ Complete)
- All 15 problem types functional
- Challenge mode fully working
- Completion screen working

### Blocking Issues
- None currently

### External Dependencies
- None

---

## Open Questions

1. **Icon Choice:** Use 🔄 (circular arrows) or ↻ (CCW arrow) or text only?
2. **Button Order:** Should restart be before or after "Give Up"?
3. **Analytics:** Should we track restart count for leaderboards/achievements?
4. **Achievement:** "Fresh Start" achievement for restarting 10 times?
5. **Confirmation Skip:** After first restart, offer "Don't ask again" checkbox?

---

## Related Milestones

- **Milestone 7:** Challenge Mode Implementation (dependency)
- **Milestone 17:** Dual Timer System (timer reset dependency)
- **Milestone 18:** Visual Effects (could add celebration on restart)
- **Milestone 19:** Interactive Graphing (restart must work for graphing)

---

## Future Enhancements

### V2 Features
1. **"Retry Same Questions" option** - Restart with identical questions
2. **Restart with Fewer Questions** - 10 → 5 mid-challenge
3. **Restart with Different Type** - Switch problem types mid-challenge
4. **Restart History** - Track all restart attempts and performance trends
5. **Smart Restart** - AI suggests restart if struggling (3+ wrong in a row)
6. **Challenge Templates** - Save challenge settings for quick restart

---

## Notes

- Keep restart button simple - don't overcomplicate
- Confirmation is CRITICAL - users will click by accident
- Make sure timers fully reset - common bug point
- Test graphing challenges thoroughly - different code path
- Consider analytics from day 1 for future improvements

---

**Created:** 2024-11-17  
**Last Updated:** 2024-11-17  
**Owner:** Development Team  
**Reviewers:** TBD

