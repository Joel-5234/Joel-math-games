# Milestone 10: Multiple Choice Answer Format

## Goal
Replace text input fields with multiple choice (radio buttons) for all problem types across all game modes.

## Overview
Convert all answer inputs from free-form text to multiple choice format with:
- 4 options per question (A, B, C, D)
- Radio button interface
- Common mistake distractors
- Separate questions for slope value and classification
- Full equations shown as options for parallel/perpendicular questions

## Tasks

### 10.1 Distractor Generation Logic
- [x] Create function to generate wrong answers for slope questions
  - Common mistakes: wrong sign, wrong calculation, off-by-one errors
  - Generate 3 plausible wrong answers
- [x] Create function to generate wrong answers for classification
  - Common mistakes: confusing rising/falling, horizontal/vertical
  - Generate 3 plausible wrong classifications
- [x] Create function to generate wrong answers for relationship questions
  - Common mistakes: confusing parallel/perpendicular, neither/same
  - Generate 3 plausible wrong relationships
- [x] Create function to generate wrong equations for parallel/perpendicular
  - Common mistakes: wrong slope, wrong intercept, wrong form
  - Generate 3 plausible wrong equations
- [x] Ensure distractors are mathematically plausible but incorrect

### 10.2 Question Structure Updates
- [x] Update slope question generation to create two separate questions:
  - Question 1: "What is the slope?" (4 options: correct + 3 distractors)
  - Question 2: "What is the classification?" (4 options: correct + 3 distractors)
- [x] Update relationship question structure to include 4 options
- [x] Update parallel question structure to include 4 options
- [x] Update perpendicular question structure to include 4 options
- [x] Store options array in question data structure

### 10.3 UI Components - Practice Mode
- [x] Replace text input with radio button group for slope questions
  - Show 4 radio buttons labeled A, B, C, D
  - Display slope values as options
- [x] Add second question for slope classification
  - Show 4 radio buttons with classification options
- [x] Replace text input with radio buttons for relationship questions
  - Show 4 radio buttons with relationship options (parallel, perpendicular, neither, same)
- [x] Replace text input with radio buttons for parallel questions
  - Show 4 radio buttons with full equation options
- [x] Replace text input with radio buttons for perpendicular questions
  - Show 4 radio buttons with full equation options
- [x] Style radio buttons consistently
- [x] Add visual feedback for selected option

### 10.4 UI Components - Challenge Mode
- [x] Update challenge question display to show multiple choice options
- [x] Replace text inputs with radio buttons in challenge interface
- [x] Handle two-part slope questions in challenge mode
  - Display slope question first, then classification question
  - Track answers separately
- [x] Update challenge navigation for two-part questions
- [x] Update challenge scoring for two-part questions

### 10.5 UI Components - Session Mode
- [x] Update session mode to use multiple choice format
- [x] Ensure radio buttons work in session mode
- [x] Update session scoring logic

### 10.6 Answer Validation Updates
- [x] Update slope answer validation to check selected radio button
- [x] Update relationship answer validation
- [x] Update parallel answer validation
- [x] Update perpendicular answer validation
- [x] Remove text parsing logic (no longer needed)
- [x] Simplify validation to direct option comparison

### 10.7 Scoring and Feedback
- [x] Update scoring to work with multiple choice
- [x] Show correct answer when wrong option selected
- [x] Highlight correct option in green when answered correctly
- [x] Highlight selected wrong option in red
- [x] Update result messages for multiple choice format

### 10.8 State Management
- [x] Update gameState to track selected option instead of text input
- [x] Update challengeState to handle multiple choice answers
- [x] Update localStorage persistence for multiple choice format
- [x] Handle state transitions between question types

### 10.9 Testing
- [x] Test all four problem types with multiple choice
- [x] Test in Practice mode
- [x] Test in Challenge mode (including two-part slope questions)
- [x] Test in Session mode
- [x] Verify distractors are plausible but incorrect
- [x] Test answer validation
- [x] Test scoring and feedback

### 10.10 Documentation
- [x] Update PRD with multiple choice format
- [x] Update README if needed
- [x] Document distractor generation logic
- [x] Update activity log

## Acceptance Criteria
- [x] All problem types use multiple choice (4 options)
- [x] Radio buttons replace text inputs in all modes
- [x] Slope questions split into two separate questions
- [x] Distractors are common mistakes (plausible but wrong)
- [x] Full equations shown for parallel/perpendicular options
- [x] Answer validation works correctly
- [x] Scoring and feedback work with multiple choice
- [x] All modes (Practice, Challenge, Session) support multiple choice
- [x] UI is consistent and user-friendly

## Technical Notes

### Distractor Generation Strategies

#### Slope Value Distractors:
- Wrong sign (positive vs negative)
- Calculation errors (off by small amounts)
- Confusing with other point's coordinates
- Common arithmetic mistakes

#### Classification Distractors:
- Rising vs Falling confusion
- Horizontal vs Vertical confusion
- Missing edge cases

#### Relationship Distractors:
- Parallel vs Perpendicular confusion
- Neither vs Same confusion
- Common misconceptions

#### Equation Distractors:
- Wrong slope (close but incorrect)
- Wrong intercept (close but incorrect)
- Wrong form (slope-intercept vs standard)
- Common calculation errors

### Question Structure
```javascript
{
  type: 'slope',
  question: 'What is the slope?',
  options: [
    { label: 'A', value: '3', correct: true },
    { label: 'B', value: '-3', correct: false },
    { label: 'C', value: '1.5', correct: false },
    { label: 'D', value: '0', correct: false }
  ],
  correctAnswer: 'A'
}
```

### UI Layout
- Radio buttons arranged vertically
- Clear labels (A, B, C, D)
- Option text clearly displayed
- Selected state visually distinct
- Disabled state after submission

