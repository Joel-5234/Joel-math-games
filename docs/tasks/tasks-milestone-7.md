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
- [x] Create question generator functions for each problem type
  - [x] `generateSlopeQuestion()` - Generate random two points
  - [x] `generateRelationshipQuestion()` - Generate random two equations
  - [x] `generateParallelQuestion()` - Generate random base equation and point
  - [x] `generatePerpendicularQuestion()` - Generate random base equation and point
- [x] Ensure generated questions have valid, solvable answers
- [x] Store correct answers with each generated question
- [x] Support random number generation (integers and decimals)
- [x] Avoid edge cases (identical points, etc.)

### 7.2 Challenge State Management
- [x] Create challenge state object:
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
- [x] Initialize challenge when user selects set size
- [x] Pre-generate all questions at challenge start
- [x] Track question states (unanswered, answered, skipped, gave-up)
- [x] Remember user answers when navigating
- [x] Prevent changing answers after submission

### 7.3 UI Components - Challenge Setup
- [x] Replace Challenge mode option in mode selector
- [x] Add challenge setup screen/modal when Challenge mode selected
- [x] Display set size options: 5, 10, 25, 50, 100
- [x] Show current problem type context
- [x] Add "Start Challenge" button
- [x] Add "Cancel" button to return to mode selection

### 7.4 UI Components - Challenge Interface
- [x] Create challenge-specific layout
- [x] Display question counter: "Question X of Y"
- [x] Show progress indicator (e.g., progress bar)
- [x] Display current question with generated values
- [x] Show input fields (same as current problem type)
- [x] Add navigation buttons:
  - [x] "Back" button (disabled on first question)
  - [x] "Skip" button (allows returning later)
  - [x] "Give Up" button (shows answer, marks incorrect)
- [x] Disable input fields for answered questions
- [x] Show visual indicators for question states:
  - [x] Unanswered: Normal styling
  - [x] Answered: Green border/checkmark
  - [x] Skipped: Yellow/orange indicator
  - [x] Gave Up: Red indicator with answer shown

### 7.5 Navigation Logic
- [x] Implement "Back" button:
  - [x] Navigate to previous question
  - [x] Restore user's answer if previously answered
  - [x] Disable on first question
- [x] Implement "Skip" button:
  - [x] Mark current question as skipped
  - [x] Move to next question
  - [x] Allow returning to skipped questions later
- [x] Implement "Give Up" button:
  - [x] Show correct answer
  - [x] Mark question as "gave-up" (incorrect)
  - [x] Generate new question to replace current
  - [x] Update question counter if new question added
- [x] Implement "Next" or auto-advance:
  - [x] After submitting answer, move to next question
  - [x] If last question, show completion screen

### 7.6 Answer Validation and Scoring
- [x] Validate user input (same as current handlers)
- [x] Check answer against stored correct answer
- [x] Mark question as answered (correct or incorrect)
- [x] Update scoring:
  - [x] Correct: Award points (same as other modes)
  - [x] Give Up: No points, mark incorrect
  - [x] Skip: No points initially, can earn later if answered correctly
- [x] Prevent re-answering after submission
- [x] Show feedback (correct/incorrect) after submission

### 7.7 Challenge Completion
- [x] Detect when all questions are answered (or user completes)
- [x] Calculate final statistics:
  - [x] Total questions
  - [x] Correct answers
  - [x] Incorrect answers
  - [x] Skipped questions
  - [x] Give-up questions
  - [x] Final grade percentage
  - [x] Letter grade
- [x] Create summary screen/modal
- [x] Display statistics in summary
- [x] Add "Restart Challenge" button
- [x] Add "Return to Practice" button

### 7.8 Celebration Animations
- [x] Integrate confetti library (or create custom)
- [x] Trigger confetti for 85% or better grade
- [x] Integrate fireworks library (or create custom)
- [x] Trigger fireworks for 100% (all correct)
- [x] Ensure animations don't block UI interaction
- [x] Make animations optional/lightweight for performance

### 7.9 Integration with Existing System
- [x] Update mode selector to use new Challenge mode
- [x] Remove old challenge mode countdown logic
- [x] Update gameState to support challenge state
- [x] Ensure achievements still work in challenge mode
- [x] Update stats tracking for challenge mode
- [x] Save challenge progress to localStorage (optional)
- [x] Handle mode switching during active challenge

### 7.10 Question Display and Formatting
- [x] Format generated questions for display:
  - [x] Slope: Show two points clearly
  - [x] Relationship: Show two equations clearly
  - [x] Parallel: Show base equation and point
  - [x] Perpendicular: Show base equation and point
- [x] Show correct answer format when "Give Up" is clicked
- [x] Format answers consistently with current system
- [x] Ensure readability of generated values

### 7.11 Edge Cases and Error Handling
- [x] Handle challenge cancellation mid-way
- [x] Handle browser refresh during challenge
- [x] Validate set size selection
- [x] Handle empty or invalid question generation
- [x] Ensure all questions are unique (avoid duplicates)
- [x] Handle navigation edge cases (first/last question)
- [x] Prevent double-submission of answers

### 7.12 Testing
- [x] Test question generation for all problem types
- [x] Test navigation (Back, Skip, Give Up)
- [x] Test answer submission and validation
- [x] Test scoring for all scenarios
- [x] Test completion screen and grade calculation
- [x] Test confetti and fireworks animations
- [x] Test mode switching during challenge
- [x] Test with different set sizes
- [x] Test on different screen sizes
- [x] Verify localStorage persistence (if implemented)

## Acceptance Criteria
- [x] User can select Challenge mode and choose set size (5, 10, 25, 50, 100)
- [x] Questions are pre-generated randomly for current problem type
- [x] User can navigate with Back, Skip, and Give Up buttons
- [x] Answers cannot be changed after submission
- [x] Give Up shows answer and marks as incorrect
- [x] Skip allows returning to question later
- [x] Completion shows summary with grade
- [x] Confetti appears for 85%+ grade
- [x] Fireworks appear for 100% grade
- [x] All existing features still work (achievements, stats, etc.)

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

