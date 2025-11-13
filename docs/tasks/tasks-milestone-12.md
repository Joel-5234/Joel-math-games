# Milestone 12: Complete Practice Mode Rewrite

## Goal
Completely rewrite Practice mode code from scratch to fix multiple choice display issues and improve code structure while maintaining all existing functionality.

## Overview
Rewrite all Practice mode handlers and related functions with:
- Clean, modular code structure
- Guaranteed multiple choice display functionality
- Better error handling and validation
- Improved code organization and maintainability
- Consistent patterns across all problem types
- Enhanced debugging and logging

## Tasks

### 12.1 Code Structure Planning
- [ ] Analyze current Practice mode code structure
- [ ] Identify all Practice mode handlers and dependencies
- [ ] Design new modular structure
- [ ] Create code organization plan
- [ ] Define consistent patterns for all problem types

### 12.2 Core Practice Mode Utilities
- [ ] Create `PracticeMode` namespace/object to encapsulate all Practice mode logic
- [ ] Create `showMultipleChoiceContainer(containerId, submitBtnId)` utility function
  - Uses `setProperty('display', 'block', 'important')` consistently
  - Validates elements exist before manipulation
  - Adds comprehensive error handling
  - Returns success/failure status
- [ ] Create `hideMultipleChoiceContainer(containerId, submitBtnId)` utility function
- [ ] Create `validateInputElements(elements)` utility function
- [ ] Create `resetPracticeQuestionState()` function
  - Hides all multiple choice containers
  - Clears result areas
  - Resets question state

### 12.3 Slope Problem Handler Rewrite
- [ ] Rewrite `handleSlopeCalculate()` from scratch
  - Clean input parsing with better error messages
  - Modular question generation
  - Use new `showMultipleChoiceContainer()` utility
  - Comprehensive error handling
  - Clear logging for debugging
- [ ] Rewrite `handleSlopeSubmit()` from scratch
  - Clean answer validation
  - Modular feedback generation
  - Consistent UI updates
  - Better error handling

### 12.4 Relationship Problem Handler Rewrite
- [ ] Rewrite `handleRelationshipCalculate()` from scratch
  - Clean equation parsing
  - Modular question generation
  - Use new `showMultipleChoiceContainer()` utility
  - Consistent with slope handler pattern
- [ ] Rewrite `handleRelationshipSubmit()` from scratch
  - Clean answer validation
  - Consistent feedback pattern
  - Better error handling

### 12.5 Parallel Problem Handler Rewrite
- [ ] Rewrite `handleParallelCalculate()` from scratch
  - Clean input parsing
  - Modular question generation
  - Use new `showMultipleChoiceContainer()` utility
  - Consistent with other handlers
- [ ] Rewrite `handleParallelSubmit()` from scratch
  - Clean answer validation
  - Consistent feedback pattern
  - Better error handling

### 12.6 Perpendicular Problem Handler Rewrite
- [ ] Rewrite `handlePerpendicularCalculate()` from scratch
  - Clean input parsing
  - Modular question generation
  - Use new `showMultipleChoiceContainer()` utility
  - Consistent with other handlers
- [ ] Rewrite `handlePerpendicularSubmit()` from scratch
  - Clean answer validation
  - Consistent feedback pattern
  - Better error handling

### 12.7 Multiple Choice Display Utilities
- [ ] Create `displayMultipleChoice(containerId, options, name, questionText)` function
  - Centralized multiple choice display logic
  - Ensures containers are visible with `setProperty('display', 'block', 'important')`
  - Validates all elements exist
  - Handles errors gracefully
  - Returns success/failure status
- [ ] Create `renderMultipleChoiceOptions(containerId, options, name)` wrapper
  - Uses existing `renderRadioOptions()` but adds validation
  - Ensures container exists before rendering
  - Better error handling
- [ ] Create `validateMultipleChoiceSubmission(questionType, requiredSelections)` function
  - Validates all required selections are made
  - Returns validation result with error messages
  - Consistent across all problem types

### 12.8 Answer Validation and Feedback
- [ ] Create `processAnswerSubmission(questionType, selectedAnswers, correctAnswers)` function
  - Centralized answer processing logic
  - Handles all problem types consistently
  - Updates UI (disable radios, highlight correct/incorrect)
  - Returns result object with correctness info
- [ ] Create `generateFeedbackMessage(result, questionData)` function
  - Generates user-friendly feedback messages
  - Consistent format across all problem types
  - Shows correct answers when wrong
- [ ] Create `updateAnswerUI(questionType, isCorrect, selectedAnswers)` function
  - Disables radio buttons after submission
  - Highlights correct and incorrect options
  - Consistent visual feedback

### 12.9 Event Handler Updates
- [ ] Update event listeners to use new handler functions
- [ ] Ensure all Calculate buttons call new handlers
- [ ] Ensure all Submit buttons call new handlers
- [ ] Add error handling to event listeners
- [ ] Verify mode checking (only work in Practice/Session modes)

### 12.10 Testing and Verification
- [ ] Test slope problem type in Practice mode
  - Verify multiple choice appears
  - Verify answer submission works
  - Verify feedback is correct
- [ ] Test relationship problem type in Practice mode
  - Verify multiple choice appears
  - Verify answer submission works
- [ ] Test parallel problem type in Practice mode
  - Verify multiple choice appears
  - Verify answer submission works
- [ ] Test perpendicular problem type in Practice mode
  - Verify multiple choice appears
  - Verify answer submission works
- [ ] Test in Session mode (should work identically)
- [ ] Test error handling (invalid inputs, missing elements)
- [ ] Test container hiding when input changes
- [ ] Verify console logs for debugging

### 12.11 Code Cleanup
- [ ] Remove old handler code
- [ ] Remove duplicate code
- [ ] Add comprehensive comments
- [ ] Ensure consistent code style
- [ ] Verify no regressions in other modes

### 12.12 Documentation
- [ ] Update code comments
- [ ] Document new utility functions
- [ ] Update PRD if needed
- [ ] Update activity log

## Acceptance Criteria
- [ ] All Practice mode handlers completely rewritten
- [ ] Multiple choice containers ALWAYS appear when Calculate is clicked
- [ ] Code structure is clean and modular
- [ ] Consistent patterns across all problem types
- [ ] All existing functionality preserved
- [ ] Better error handling throughout
- [ ] Comprehensive logging for debugging
- [ ] No regressions in Challenge or Session modes
- [ ] Code is maintainable and well-documented

## Technical Notes

### New Code Structure
```javascript
// Practice Mode Utilities
const PracticeMode = {
    showContainer: (containerId, submitBtnId) => { ... },
    hideContainer: (containerId, submitBtnId) => { ... },
    displayMultipleChoice: (containerId, options, name, questionText) => { ... },
    validateSubmission: (questionType, selections) => { ... },
    processAnswer: (questionType, selected, correct) => { ... },
    generateFeedback: (result, questionData) => { ... },
    updateUI: (questionType, isCorrect, selected) => { ... }
};

// New handler pattern
function handleSlopeCalculate() {
    // 1. Validate inputs
    // 2. Parse inputs
    // 3. Generate question
    // 4. Display multiple choice using PracticeMode.showContainer()
    // 5. Handle errors gracefully
}
```

### Key Improvements
1. **Guaranteed Display**: Use `setProperty('display', 'block', 'important')` in centralized utility
2. **Validation**: Validate all elements before manipulation
3. **Error Handling**: Comprehensive try-catch with user-friendly messages
4. **Consistency**: Same pattern for all problem types
5. **Modularity**: Reusable utility functions
6. **Debugging**: Clear console logging at each step

### Implementation Strategy
1. Create utility functions first
2. Test utilities independently
3. Rewrite handlers one at a time
4. Test each handler thoroughly
5. Remove old code
6. Final testing and cleanup

### Testing Checklist
- [ ] Multiple choice appears for all problem types
- [ ] Answer submission works correctly
- [ ] Feedback messages are clear
- [ ] Error handling works
- [ ] Containers hide when input changes
- [ ] No console errors
- [ ] Works in Practice mode
- [ ] Works in Session mode
- [ ] Challenge mode unaffected

