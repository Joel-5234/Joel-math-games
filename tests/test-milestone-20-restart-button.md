# Test Plan: Milestone 20 - Mid-Challenge Restart Button

**Date:** November 17, 2024  
**Feature:** Mid-Challenge Restart Button  
**Test Type:** Manual Browser Testing

---

## Test Environment

- **Browser:** Chrome, Safari, Firefox
- **Devices:** Desktop, Tablet, Mobile
- **URL:** https://joel-5234.github.io/Joel-math-games/

---

## Test Cases

### TC1: Restart Button Visibility
**Steps:**
1. Navigate to any problem type tab
2. Switch to Challenge mode
3. Start a challenge (any size: 5, 10, or 15)
4. Observe challenge navigation bar

**Expected Result:**
- ✅ Restart button visible between "Give Up" and "Submit Answer"
- ✅ Button has grey background (#6c757d)
- ✅ Button shows "🔄 Restart" text
- ✅ Button has hover effect (darker grey)

**Status:** ⬜ Not Tested

---

### TC2: Confirmation Modal Display
**Steps:**
1. Start any challenge
2. Click the "🔄 Restart" button

**Expected Result:**
- ✅ Confirmation modal appears
- ✅ Modal title: "🔄 Restart Challenge?"
- ✅ Modal message: "Are you sure you want to restart? All current progress will be lost."
- ✅ Two buttons visible: "Yes, Restart" (red) and "Cancel" (grey)
- ✅ X button in top right corner

**Status:** ⬜ Not Tested

---

### TC3: Cancel Restart (Button)
**Steps:**
1. Start any challenge
2. Answer question 1
3. Click "🔄 Restart"
4. Click "Cancel" button

**Expected Result:**
- ✅ Modal closes
- ✅ Returns to current question
- ✅ Progress unchanged (still on question 1, answered)
- ✅ No new questions generated

**Status:** ⬜ Not Tested

---

### TC4: Cancel Restart (X Button)
**Steps:**
1. Start any challenge
2. Answer question 1
3. Click "🔄 Restart"
4. Click X button

**Expected Result:**
- ✅ Modal closes
- ✅ Same behavior as Cancel button
- ✅ Progress unchanged

**Status:** ⬜ Not Tested

---

### TC5: Confirm Restart (Basic)
**Steps:**
1. Start challenge (Slope, 5 questions)
2. Answer question 1 correctly
3. Click "🔄 Restart"
4. Click "Yes, Restart"

**Expected Result:**
- ✅ Modal closes immediately
- ✅ New questions generated (different from before)
- ✅ Displays "Question 1 of 5"
- ✅ Stats reset: Correct: 0, Incorrect: 0
- ✅ Timer resets to 0:00
- ✅ Hints reset to "Hints: 0/5"
- ✅ Same problem type (Slope)
- ✅ Same question count (5)

**Status:** ⬜ Not Tested

---

### TC6: Restart Mid-Challenge
**Steps:**
1. Start challenge (5 questions)
2. Answer questions 1, 2, 3
3. On question 4, click "🔄 Restart"
4. Confirm restart

**Expected Result:**
- ✅ New questions generated
- ✅ Back to question 1
- ✅ All previous answers cleared
- ✅ Stats reset to 0

**Status:** ⬜ Not Tested

---

### TC7: Restart with Hints Used
**Steps:**
1. Start challenge
2. Use 2 hints on question 1
3. Click "🔄 Restart"
4. Confirm restart

**Expected Result:**
- ✅ Hints counter resets to "Hints: 0/5"
- ✅ Can use full 5 hints again

**Status:** ⬜ Not Tested

---

### TC8: Restart Different Problem Types
**Test each problem type:**
- ⬜ Slope & Description
- ⬜ Line Relationship
- ⬜ Parallel Line
- ⬜ Perpendicular Line
- ⬜ Intercepts
- ⬜ Rate of Change
- ⬜ Linear Functions
- ⬜ Standard Form
- ⬜ Point-Slope Form
- ⬜ Absolute Value
- ⬜ Graph: Slope-Intercept
- ⬜ Graph: Point-Slope
- ⬜ Graph: Parallel Lines
- ⬜ Graph: Perpendicular Lines
- ⬜ Graph: Absolute Value

**Expected Result:**
- ✅ Restart works for all 15 problem types
- ✅ New questions match original type

**Status:** ⬜ Not Tested

---

### TC9: Restart Different Set Sizes
**Test each set size:**
- ⬜ 5 questions → restart → 5 new questions
- ⬜ 10 questions → restart → 10 new questions
- ⬜ 15 questions → restart → 15 new questions

**Expected Result:**
- ✅ Question count preserved on restart

**Status:** ⬜ Not Tested

---

### TC10: Multiple Restarts in a Row
**Steps:**
1. Start challenge
2. Restart (confirm)
3. Restart again (confirm)
4. Restart again (confirm)

**Expected Result:**
- ✅ Each restart generates new questions
- ✅ No errors or glitches
- ✅ Stats reset each time
- ✅ Timers reset each time

**Status:** ⬜ Not Tested

---

### TC11: Restart After Last Question
**Steps:**
1. Start challenge (5 questions)
2. Answer questions 1-4
3. On question 5 (last), click "🔄 Restart"
4. Confirm restart

**Expected Result:**
- ✅ New set of 5 questions generated
- ✅ Back to question 1
- ✅ Challenge doesn't complete accidentally

**Status:** ⬜ Not Tested

---

### TC12: Console Logs Verification
**Steps:**
1. Open browser console (F12)
2. Start challenge
3. Click "🔄 Restart"
4. Observe console logs

**Expected Console Output:**
```
[Restart] Restart button clicked
[Restart] Showing confirmation modal...
```

Then after confirming:
```
[Restart] Restart confirmed by user
[Restart] Hiding confirmation modal...
[Restart] Starting challenge restart...
[Restart] Problem Type: slope, Set Size: 5
[Restart] Generated 5 new questions
[Restart] Challenge state reset
[Restart] Timers reset and restarted
[Restart] Challenge restarted successfully! Displaying question 1
```

**Status:** ⬜ Not Tested

---

### TC13: Responsive Design
**Test on different screen sizes:**

**Desktop (1920x1080):**
- ⬜ Button fits in navigation bar
- ⬜ No overlap with other buttons
- ⬜ Modal displays centered

**Tablet (768x1024):**
- ⬜ Button visible and clickable
- ⬜ Modal responsive
- ⬜ Text readable

**Mobile (375x667):**
- ⬜ Button doesn't wrap or overlap
- ⬜ Modal fits on screen
- ⬜ Touch targets adequate

**Status:** ⬜ Not Tested

---

### TC14: Keyboard Accessibility
**Steps:**
1. Start challenge
2. Press Tab until "🔄 Restart" button is focused
3. Press Enter
4. Tab to "Yes, Restart"
5. Press Enter

**Expected Result:**
- ✅ Can navigate to restart button via Tab
- ✅ Focus indicator visible
- ✅ Enter key activates button
- ✅ Can navigate modal buttons
- ✅ Enter confirms/cancels

**Status:** ⬜ Not Tested

---

### TC15: Edge Case - Restart on Question 1 (Unanswered)
**Steps:**
1. Start challenge
2. Immediately click "🔄 Restart" (before answering Q1)
3. Confirm restart

**Expected Result:**
- ✅ New questions generated
- ✅ Still on question 1
- ✅ No errors

**Status:** ⬜ Not Tested

---

### TC16: Graphing Challenge Restart
**Steps:**
1. Start "Graph: Slope-Intercept" challenge
2. Click 2 points to graph a line
3. Submit answer
4. Click "🔄 Restart" on question 2
5. Confirm restart

**Expected Result:**
- ✅ New graphing questions generated
- ✅ Canvas clears and shows new points
- ✅ Interactive graphing works on new questions
- ✅ Question times tracked correctly

**Status:** ⬜ Not Tested

---

## Browser Compatibility

### Chrome
- ⬜ All tests passing
- ⬜ No console errors
- ⬜ Modal displays correctly

### Safari
- ⬜ All tests passing
- ⬜ No console errors
- ⬜ Modal displays correctly

### Firefox
- ⬜ All tests passing
- ⬜ No console errors
- ⬜ Modal displays correctly

---

## Known Issues

_(Document any issues found during testing)_

1. 

---

## Test Results Summary

**Total Test Cases:** 16  
**Passed:** 0  
**Failed:** 0  
**Not Tested:** 16  

**Overall Status:** ⬜ PENDING USER TESTING

---

## Sign-Off

**Tested By:** _________________  
**Date:** _________________  
**Result:** ⬜ PASS / ⬜ FAIL  
**Notes:**

