# Milestone 13: Additional Problem Types

## Goal
Add five new problem types to expand the application's coverage of linear function concepts:
1. Finding Intercepts (from graphs and equations)
2. Rate of Change (from tables)
3. Identifying Linear Functions (from tables)
4. Converting to Standard Form
5. All using multiple choice format with interactive graphs where applicable

## Overview
Expand the app from 4 to 9 problem types, adding:
- Interactive graph display for intercept problems
- Table-based problems for rate of change and linear function identification
- Equation conversion problems
- All with multiple choice answer format
- Consistent with existing problem type patterns

## Tasks

### 13.1 Graph Rendering System
- [ ] Create canvas/SVG-based graph rendering system
- [ ] Implement coordinate system with customizable bounds
- [ ] Create function to draw axes with labels
- [ ] Create function to plot points
- [ ] Create function to draw lines from equations
- [ ] Create function to highlight intercepts on graph
- [ ] Make graph interactive (zoom, pan if needed)
- [ ] Style graph to match app design

### 13.2 Problem Type 5: Finding Intercepts
- [ ] Create HTML panel for intercept problems
- [ ] Add tab button for "Intercepts"
- [ ] Create input field for equation (or generate graph)
- [ ] Implement intercept calculation functions:
  - `findXIntercept(line)` - Set y=0, solve for x
  - `findYIntercept(line)` - Set x=0, solve for y
- [ ] Generate multiple choice options:
  - Correct intercepts as coordinate points: (x, 0) and (0, y)
  - Generate 3 distractors for each intercept
- [ ] Create graph display showing line with intercepts highlighted
- [ ] Create handlers: `handleInterceptCalculate()` and `handleInterceptSubmit()`
- [ ] Add hint content for intercept problems
- [ ] Update PracticeMode utilities to support intercept problems

### 13.3 Problem Type 6: Rate of Change
- [ ] Create HTML panel for rate of change problems
- [ ] Add tab button for "Rate of Change"
- [ ] Create table input interface (or generate table)
- [ ] Implement rate of change calculation:
  - Calculate change in y / change in x for each interval
  - Handle multiple intervals
  - Find greatest rate of change (or decrease)
- [ ] Generate multiple choice options:
  - Correct rate of change values
  - Generate 3 distractors (wrong calculations, sign errors)
- [ ] Display table visually
- [ ] Create handlers: `handleRateOfChangeCalculate()` and `handleRateOfChangeSubmit()`
- [ ] Add hint content for rate of change
- [ ] Update PracticeMode utilities

### 13.4 Problem Type 7: Identifying Linear Functions
- [ ] Create HTML panel for linear function identification
- [ ] Add tab button for "Linear Functions"
- [ ] Create table input interface (X and Y columns)
- [ ] Implement linear function detection:
  - Check if change in X is constant
  - Check if change in Y is constant
  - Calculate if ratio (change Y / change X) is constant
- [ ] Generate multiple choice options:
  - Yes/No with explanations
  - Distractors: wrong explanations, confusion with other function types
- [ ] Display table visually
- [ ] Create handlers: `handleLinearFunctionCalculate()` and `handleLinearFunctionSubmit()`
- [ ] Add hint content for linear function identification
- [ ] Update PracticeMode utilities

### 13.5 Problem Type 8: Converting to Standard Form
- [ ] Create HTML panel for standard form conversion
- [ ] Add tab button for "Standard Form"
- [ ] Create input field for equation (any format)
- [ ] Implement standard form conversion:
  - Parse equation in any format (y=mx+b, point-slope, etc.)
  - Convert to Ax + By = C format
  - Ensure A, B, C are integers (if possible)
  - Handle negative values correctly
- [ ] Generate multiple choice options:
  - Correct standard form equation
  - Generate 3 distractors (wrong signs, wrong coefficients, wrong form)
- [ ] Also ask for A, B, C values as separate question
- [ ] Create handlers: `handleStandardFormCalculate()` and `handleStandardFormSubmit()`
- [ ] Add hint content for standard form conversion
- [ ] Update PracticeMode utilities

### 13.6 Distractor Generation
- [ ] Create `generateInterceptDistractors(correctX, correctY)` function
  - Wrong sign errors
  - Calculation errors
  - Confusing x and y intercepts
- [ ] Create `generateRateOfChangeDistractors(correctRate)` function
  - Wrong interval calculations
  - Sign errors
  - Calculation mistakes
- [ ] Create `generateLinearFunctionDistractors(isLinear)` function
  - Wrong explanations
  - Confusing with other function types
- [ ] Create `generateStandardFormDistractors(correctEq, correctA, correctB, correctC)` function
  - Wrong signs
  - Wrong coefficients
  - Wrong form

### 13.7 Question Generation for Challenge Mode
- [ ] Create `generateInterceptQuestion()` function
- [ ] Create `generateRateOfChangeQuestion()` function
- [ ] Create `generateLinearFunctionQuestion()` function
- [ ] Create `generateStandardFormQuestion()` function
- [ ] Update `generateChallengeQuestions()` to include new types
- [ ] Update challenge mode UI to support new problem types

### 13.8 UI Updates
- [ ] Add new tab buttons to HTML
- [ ] Create HTML panels for all new problem types
- [ ] Add multiple choice containers for each type
- [ ] Add submit buttons for each type
- [ ] Create graph container element
- [ ] Create table display elements
- [ ] Update CSS for new elements
- [ ] Ensure responsive design

### 13.9 Practice Mode Integration
- [ ] Update PracticeMode utilities to handle new problem types
- [ ] Create Calculate handlers for all new types
- [ ] Create Submit handlers for all new types
- [ ] Update `resetQuestionState()` to include new containers
- [ ] Test all new handlers in Practice mode

### 13.10 Session Mode Integration
- [ ] Ensure new problem types work in Session mode
- [ ] Update session statistics tracking for new types
- [ ] Test session mode with all new types

### 13.11 Challenge Mode Integration
- [ ] Update challenge setup to include new problem types
- [ ] Update challenge question display for new types
- [ ] Update challenge answer submission for new types
- [ ] Test challenge mode with all new types

### 13.12 Hint System
- [ ] Create hint content for intercept problems
- [ ] Create hint content for rate of change
- [ ] Create hint content for linear function identification
- [ ] Create hint content for standard form conversion
- [ ] Add hint buttons to all new problem panels
- [ ] Test hint system for all new types

### 13.13 Testing
- [ ] Test intercept problems with various equations
- [ ] Test graph rendering and interactivity
- [ ] Test rate of change with various tables
- [ ] Test linear function identification with various tables
- [ ] Test standard form conversion with various input formats
- [ ] Test all new types in Practice mode
- [ ] Test all new types in Session mode
- [ ] Test all new types in Challenge mode
- [ ] Test multiple choice display for all new types
- [ ] Test answer validation for all new types

### 13.14 Documentation
- [ ] Update PRD with new problem types
- [ ] Update README with new features
- [ ] Document graph rendering system
- [ ] Document new calculation functions
- [ ] Update activity log

## Acceptance Criteria
- [ ] All 5 new problem types implemented
- [ ] Interactive graphs work for intercept problems
- [ ] Tables display correctly for rate of change and linear function problems
- [ ] All new types use multiple choice format
- [ ] All new types work in Practice, Session, and Challenge modes
- [ ] Hint system works for all new types
- [ ] Code follows existing patterns and structure
- [ ] No regressions in existing problem types

## Technical Notes

### Graph Rendering Approach
- Use HTML5 Canvas or SVG for graph rendering
- Create reusable graph component
- Support zoom/pan if needed
- Highlight intercepts visually
- Match app styling

### Intercept Calculation
```javascript
function findXIntercept(line) {
    // For y = mx + b: set y = 0, solve for x
    // x = -b/m
    // For Ax + By = C: set y = 0, solve for x
    // x = C/A
    // Return point (x, 0)
}

function findYIntercept(line) {
    // For y = mx + b: set x = 0, y = b
    // For Ax + By = C: set x = 0, solve for y
    // y = C/B
    // Return point (0, y)
}
```

### Rate of Change Calculation
```javascript
function calculateRateOfChange(table) {
    // For each interval: (y2 - y1) / (x2 - x1)
    // Return array of rates for each interval
    // Find greatest rate (or greatest decrease)
}
```

### Linear Function Detection
```javascript
function isLinearFunction(table) {
    // Check if change in X is constant
    // Check if change in Y is constant
    // Check if ratio (change Y / change X) is constant
    // Return boolean and explanation
}
```

### Standard Form Conversion
```javascript
function convertToStandardForm(equation) {
    // Parse equation in any format
    // Convert to Ax + By = C
    // Ensure A, B, C are integers
    // Return { equation: "Ax + By = C", A, B, C }
}
```

### Implementation Strategy
1. Create graph rendering system first
2. Implement intercept problems (uses graphs)
3. Implement rate of change (uses tables)
4. Implement linear function identification (uses tables)
5. Implement standard form conversion
6. Integrate into all modes
7. Test thoroughly

