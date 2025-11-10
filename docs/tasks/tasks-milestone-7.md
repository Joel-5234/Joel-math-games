# Milestone 7: Set Challenge Mode

## Goal
Replace the existing Challenge Mode with a new Set Challenge Mode that allows users to test their skills with a pre-generated set of questions. Users can navigate through questions, skip to return later, or give up to see the answer.

## Overview
Set Challenge Mode is a quiz-style mode where:
- User selects a set size (5, 10, 25, 50, or 100 questions)
- Questions are pre-generated randomly for the current problem type
- Users can navigate: Back, Skip, Give Up
- One answer per question (cannot change after submission)
- Completion shows summary with grade and celebrations

## Tasks

### 7.1 Question Generation System
- [ ] Create question generator functions for each problem type
  - [ ] `generateSlopeQuestion()` - Generate random two points
  - [ ] `generateRelationshipQuestion()` - Generate random two equations
  - [ ] `generateParallelQuestion()` - Generate random base equation and point
  - [ ] `generatePerpendicularQuestion()` - Generate random base equation and point
- [ ] Ensure generated questions have valid, solvable answers
- [ ] Store correct answers with each generated question
- [ ] Support random number generation (integers and decimals)
- [ ] Avoid edge cases (identical points, etc.)

### 7.2 Challenge State Management
- [ ] Create challenge state object:
  ```javascript
  {
    active: false,
    setSize: null,
    currentProblemType: null,
    questions: [], // Array of question objects
    currentQuestionIndex: 0,
    answers: {}, // Map of question index to user answer
    questionStates: {}, // 'unanswered', 'answered', 'skipped', 'gave-up'
    startTime: null,
    endTime: null
  }
  ```
- [ ] Initialize challenge when user selects set size
- [ ] Pre-generate all questions at challenge start
- [ ] Track question states (unanswered, answered, skipped, gave-up)
- [ ] Remember user answers when navigating
- [ ] Prevent changing answers after submission

### 7.3 UI Components - Challenge Setup
- [ ] Replace Challenge mode option in mode selector
- [ ] Add challenge setup screen/modal when Challenge mode selected
- [ ] Display set size options: 5, 10, 25, 50, 100
- [ ] Show current problem type context
- [ ] Add "Start Challenge" button
- [ ] Add "Cancel" button to return to mode selection

### 7.4 UI Components - Challenge Interface
- [ ] Create challenge-specific layout
- [ ] Display question counter: "Question X of Y"
- [ ] Show progress indicator (e.g., progress bar)
- [ ] Display current question with generated values
- [ ] Show input fields (same as current problem type)
- [ ] Add navigation buttons:
  - [ ] "Back" button (disabled on first question)
  - [ ] "Skip" button (allows returning later)
  - [ ] "Give Up" button (shows answer, marks incorrect)
- [ ] Disable input fields for answered questions
- [ ] Show visual indicators for question states:
  - [ ] Unanswered: Normal styling
  - [ ] Answered: Green border/checkmark
  - [ ] Skipped: Yellow/orange indicator
  - [ ] Gave Up: Red indicator with answer shown

### 7.5 Navigation Logic
- [ ] Implement "Back" button:
  - [ ] Navigate to previous question
  - [ ] Restore user's answer if previously answered
  - [ ] Disable on first question
- [ ] Implement "Skip" button:
  - [ ] Mark current question as skipped
  - [ ] Move to next question
  - [ ] Allow returning to skipped questions later
- [ ] Implement "Give Up" button:
  - [ ] Show correct answer
  - [ ] Mark question as "gave-up" (incorrect)
  - [ ] Generate new question to replace current
  - [ ] Update question counter if new question added
- [ ] Implement "Next" or auto-advance:
  - [ ] After submitting answer, move to next question
  - [ ] If last question, show completion screen

### 7.6 Answer Validation and Scoring
- [ ] Validate user input (same as current handlers)
- [ ] Check answer against stored correct answer
- [ ] Mark question as answered (correct or incorrect)
- [ ] Update scoring:
  - [ ] Correct: Award points (same as other modes)
  - [ ] Give Up: No points, mark incorrect
  - [ ] Skip: No points initially, can earn later if answered correctly
- [ ] Prevent re-answering after submission
- [ ] Show feedback (correct/incorrect) after submission

### 7.7 Challenge Completion
- [ ] Detect when all questions are answered (or user completes)
- [ ] Calculate final statistics:
  - [ ] Total questions
  - [ ] Correct answers
  - [ ] Incorrect answers
  - [ ] Skipped questions
  - [ ] Give-up questions
  - [ ] Final grade percentage
  - [ ] Letter grade
- [ ] Create summary screen/modal
- [ ] Display statistics in summary
- [ ] Add "Restart Challenge" button
- [ ] Add "Return to Practice" button

### 7.8 Celebration Animations
- [ ] Integrate confetti library (or create custom)
- [ ] Trigger confetti for 85% or better grade
- [ ] Integrate fireworks library (or create custom)
- [ ] Trigger fireworks for 100% (all correct)
- [ ] Ensure animations don't block UI interaction
- [ ] Make animations optional/lightweight for performance

### 7.9 Integration with Existing System
- [ ] Update mode selector to use new Challenge mode
- [ ] Remove old challenge mode countdown logic
- [ ] Update gameState to support challenge state
- [ ] Ensure achievements still work in challenge mode
- [ ] Update stats tracking for challenge mode
- [ ] Save challenge progress to localStorage (optional)
- [ ] Handle mode switching during active challenge

### 7.10 Question Display and Formatting
- [ ] Format generated questions for display:
  - [ ] Slope: Show two points clearly
  - [ ] Relationship: Show two equations clearly
  - [ ] Parallel: Show base equation and point
  - [ ] Perpendicular: Show base equation and point
- [ ] Show correct answer format when "Give Up" is clicked
- [ ] Format answers consistently with current system
- [ ] Ensure readability of generated values

### 7.11 Edge Cases and Error Handling
- [ ] Handle challenge cancellation mid-way
- [ ] Handle browser refresh during challenge
- [ ] Validate set size selection
- [ ] Handle empty or invalid question generation
- [ ] Ensure all questions are unique (avoid duplicates)
- [ ] Handle navigation edge cases (first/last question)
- [ ] Prevent double-submission of answers

### 7.12 Testing
- [ ] Test question generation for all problem types
- [ ] Test navigation (Back, Skip, Give Up)
- [ ] Test answer submission and validation
- [ ] Test scoring for all scenarios
- [ ] Test completion screen and grade calculation
- [ ] Test confetti and fireworks animations
- [ ] Test mode switching during challenge
- [ ] Test with different set sizes
- [ ] Test on different screen sizes
- [ ] Verify localStorage persistence (if implemented)

## Acceptance Criteria
- [ ] User can select Challenge mode and choose set size (5, 10, 25, 50, 100)
- [ ] Questions are pre-generated randomly for current problem type
- [ ] User can navigate with Back, Skip, and Give Up buttons
- [ ] Answers cannot be changed after submission
- [ ] Give Up shows answer and marks as incorrect
- [ ] Skip allows returning to question later
- [ ] Completion shows summary with grade
- [ ] Confetti appears for 85%+ grade
- [ ] Fireworks appear for 100% grade
- [ ] All existing features still work (achievements, stats, etc.)

## Technical Notes

### Question Generation Requirements
- Generate random integers and decimals within reasonable ranges
- For slope: Ensure points are not identical
- For relationships: Ensure variety (parallel, perpendicular, neither)
- For parallel/perpendicular: Ensure valid equations and points
- Store correct answers in question object for validation

### State Management
- Challenge state should be separate from main gameState
- Consider localStorage for challenge persistence
- Clear challenge state when switching modes

### Performance
- Pre-generate all questions at start (not on-demand)
- Ensure question generation is fast for large sets (100 questions)
- Optimize animations for smooth performance

### UI/UX Considerations
- Clear visual indicators for question states
- Progress indicator shows completion status
- Disable navigation buttons appropriately
- Show clear feedback for all actions
- Make summary screen informative and celebratory

