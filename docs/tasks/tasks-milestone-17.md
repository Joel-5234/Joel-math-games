# Milestone 17: Separate Challenge Timer and Question Timer

**Status**: Pending  
**Priority**: Medium  
**Estimated Effort**: Medium (8-12 hours)

## Overview
Implement separate timers for Challenge Mode to track both the total challenge duration and individual question time. Display both timers side by side in the header with distinct visual styles.

## User Requirements
1. **Display**: Side by side at top: `Challenge Time: 2m 34s | Question Time: 11s`
2. **Challenge Timer**: Starts when challenge begins, runs continuously, shows on completion screen
3. **Question Timer**: Resets for each question, tracks time per question
4. **Historical Data**: Save and display time-per-question in summary
5. **Visual Design**: Challenge timer darker than question timer
6. **Stats & Achievements**: Track fastest times, add speed-based achievements

## Tasks

### Phase 1: Core Timer Implementation (ID: m17-1)
- [ ] Add `challengeStartTime` to `challengeState` object
- [ ] Add `challengeTimer` interval to `gameState` object
- [ ] Add `questionTimes` array to `challengeState` to track time per question
- [ ] Create `startChallengeTimer()` function
- [ ] Create `stopChallengeTimer()` function
- [ ] Create `updateChallengeTimer()` function (separate from `updateTimer()`)
- [ ] Update `startChallenge()` to initialize and start challenge timer
- [ ] Update `resetChallenge()` to stop and reset challenge timer
- [ ] Store question start/end times in `questionTimes` array

### Phase 2: UI Updates (ID: m17-2)
- [ ] Update `index.html` header to show two timers side by side
  - Add `<span id="challengeTimerDisplay">Total: 0m 0s</span>`
  - Add separator: `<span class="timer-separator">|</span>`
  - Keep existing `<span id="timerDisplay">Question: 0s</span>`
- [ ] Add CSS styles for timer differentiation
  - `.challenge-timer` - darker color (opacity or color)
  - `.question-timer` - lighter/standard color
  - `.timer-separator` - subtle divider styling
- [ ] Update timer display formatting
  - Challenge timer: "Total: Xm Ys" format (minutes and seconds)
  - Question timer: "Question: Xs" format (seconds only)
- [ ] Ensure responsive design for mobile devices

### Phase 3: Question Time Tracking (ID: m17-3)
- [ ] Record question start time when `displayChallengeQuestion()` is called
- [ ] Record question end time when:
  - Answer is submitted
  - Question is skipped
  - Question is given up
- [ ] Calculate and store time spent per question in `questionTimes` array
- [ ] Handle edge cases:
  - Returning to skipped questions (don't reset accumulated time)
  - Reviewing answered questions (don't accumulate more time)

### Phase 4: Completion Screen Enhancements (ID: m17-4)
- [ ] Add total challenge time to completion summary
- [ ] Add individual question times section
  - Display time per question: "Question 1: 23s, Question 2: 45s..."
  - Highlight fastest and slowest questions
- [ ] Add statistics:
  - Average time per question
  - Fastest question time
  - Slowest question time
- [ ] Format times consistently (Xm Ys for > 60s, Xs for < 60s)

### Phase 5: Achievements & Gamification (ID: m17-5)
- [ ] Add new achievements:
  - **"Lightning Fast"** - Answer any question correctly in under 10 seconds
  - **"Speed Demon"** - Complete a 10-question challenge in under 5 minutes
  - **"Marathon Master"** - Complete a 50-question challenge
  - **"Efficiency Expert"** - Average under 20 seconds per question in a challenge
- [ ] Track personal bests in localStorage:
  - Fastest challenge completion (by question count: 5, 10, 25, 50, 100)
  - Fastest single question time
  - Best average time per question
- [ ] Display personal bests on completion screen

### Phase 6: Testing (ID: m17-6)
- [ ] Test challenge timer starts/stops correctly
- [ ] Test question timer resets for each question
- [ ] Test time tracking for all question states (answered, skipped, given up)
- [ ] Test completion screen displays both timers correctly
- [ ] Test timer display formatting (seconds vs minutes)
- [ ] Test responsive design on mobile/tablet
- [ ] Test localStorage persistence of time data
- [ ] Create Playwright tests:
  - `challenge-dual-timers.spec.js` - Test both timers run independently
  - `challenge-time-tracking.spec.js` - Test question time recording
  - `challenge-completion-times.spec.js` - Test time display on completion

### Phase 7: Documentation & Deployment (ID: m17-7)
- [ ] Update `prd.md` with dual timer specifications
- [ ] Update `README.md` with timer feature description
- [ ] Add comments to timer-related code
- [ ] Run build script
- [ ] Fix any linter errors
- [ ] Push to GitHub and deploy

## Technical Details

### Data Structures

```javascript
// gameState additions
gameState = {
    // ... existing properties
    challengeTimer: null,  // setInterval reference for challenge timer
}

// challengeState additions
challengeState = {
    // ... existing properties
    challengeStartTime: null,      // Timestamp when challenge started
    questionTimes: [],              // Array of {questionIndex, startTime, endTime, duration}
    totalChallengeTime: 0,          // Total time in seconds (calculated at end)
}
```

### Timer Update Functions

```javascript
function updateChallengeTimer() {
    if (!challengeState.challengeStartTime) return;
    const elapsed = Math.floor((Date.now() - challengeState.challengeStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    document.getElementById('challengeTimerDisplay').textContent = `Total: ${minutes}m ${seconds}s`;
}

function updateQuestionTimer() {
    if (!gameState.questionStartTime) return;
    const elapsed = Math.floor((Date.now() - gameState.questionStartTime) / 1000);
    document.getElementById('timerDisplay').textContent = `Question: ${elapsed}s`;
}
```

### HTML Structure

```html
<div class="timer-display">
    <span id="challengeTimerDisplay" class="challenge-timer">Total: 0m 0s</span>
    <span class="timer-separator">|</span>
    <span id="timerDisplay" class="question-timer">Question: 0s</span>
</div>
```

### CSS Styling

```css
.timer-display {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.challenge-timer {
    font-weight: 600;
    color: rgba(0, 0, 0, 0.8);  /* Darker */
}

.question-timer {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.6);  /* Lighter */
}

.timer-separator {
    color: rgba(0, 0, 0, 0.3);
    font-weight: 300;
}
```

## Acceptance Criteria

- [x] Challenge timer starts when challenge begins
- [x] Challenge timer runs continuously throughout challenge
- [x] Challenge timer stops when challenge completes
- [x] Question timer resets for each new question
- [x] Question timer stops when answer submitted/skipped/given up
- [x] Both timers display side by side in header
- [x] Challenge timer is visually darker than question timer
- [x] Time per question is tracked and stored
- [x] Completion screen shows total challenge time
- [x] Completion screen shows individual question times
- [x] New speed-based achievements work correctly
- [x] Personal best times are tracked in localStorage
- [x] All timer displays format correctly (Xm Ys or Xs)
- [x] Responsive design works on mobile/tablet
- [x] Playwright tests pass

## Dependencies
- None (builds on existing Challenge Mode implementation)

## Risks & Mitigations

**Risk**: Timer drift due to setInterval inaccuracy  
**Mitigation**: Calculate elapsed time from timestamps, not by counting intervals

**Risk**: Performance impact of running two timers simultaneously  
**Mitigation**: Both timers use efficient Date.now() calculations, minimal overhead

**Risk**: localStorage size with storing all question times  
**Mitigation**: Only store essential data (duration), limit history to last 100 challenges

## Future Enhancements (Not in This Milestone)
- Timer analytics dashboard
- Compare time across different problem types
- Global leaderboard for fastest times
- Timer pause/resume functionality
- Time limit warnings/alerts

