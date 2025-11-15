# Milestone 16: Study Guide Aligned Slope-Intercept and Point-Slope Drills

## Goal
Enhance existing problem types and add new study-guide aligned features to provide comprehensive practice for slope-intercept form, point-slope form, two-point form, graph interpretation, absolute value graphs, and signed-number operations.

## Overview
This milestone adds study-guide aligned drills that enhance existing problem types and introduce new practice modes:
- **4.9**: Enhanced slope-intercept drills (from m and b, from m and point, graphing)
- **4.10**: Point-slope form drills (building and graphing)
- **4.11**: Two-point form to slope-intercept conversion
- **4.12**: Parallel/Perpendicular with graph labeling
- **4.13**: Absolute value line graphs
- **4.14**: Point-slope to slope-intercept conversion with signed-number practice

All features use:
- Multiple choice format (A, B, C, D)
- Fraction-only format for numeric answers
- Canvas-based graph rendering
- Integration with existing hint system
- Support for Practice, Challenge, and Session modes

## Tasks

### 16.1 Enhanced Graph Component (Canvas-Based)
- [ ] Create separate graph component module for enhanced graphing capabilities
- [ ] Extend `drawGraph()` function to support:
  - Multiple lines on same graph
  - Graph thumbnails (small graphs for multiple choice)
  - Line labeling ("Base line", "New line", etc.)
  - Point plotting with labels
  - V-shaped absolute value graphs
  - Interactive point clicking (for graphing variant)
- [ ] Create `drawGraphThumbnail(canvasId, line, options)` for small graph options
- [ ] Create `drawAbsoluteValueGraph(canvasId, a, b, c, d)` for V-shaped graphs
- [ ] Create `drawMultipleLines(canvasId, lines, labels)` for parallel/perpendicular graphs
- [ ] Add point click detection for interactive graphing
- [ ] Style graphs consistently with app design

### 16.2 Section 4.9: Slope-Intercept Drills Enhancement
**Enhancement to "Slope & Description" tab**

#### 4.9.1 From slope and y-intercept
- [ ] Add input mode selector or sub-tab: "From m and b"
- [ ] Create input fields for:
  - Slope m (fraction or integer input)
  - y-intercept b (fraction or integer input)
- [ ] Create `buildSlopeInterceptFromMB(m, b)` function
- [ ] Generate 4 multiple choice options in slope-intercept form:
  - Correct: y = mx + b (using fraction format)
  - Distractor: Wrong sign on m (y = -mx + b)
  - Distractor: Wrong sign on b (y = mx - b)
  - Distractor: Swapped m and b (y = bx + m)
- [ ] Create handler: `handleSlopeInterceptMBCalculate()` and `handleSlopeInterceptMBSubmit()`
- [ ] Add hint content for this variant
- [ ] Update PracticeMode utilities

#### 4.9.2 From slope and one point
- [ ] Add input mode selector or sub-tab: "From m and point"
- [ ] Create input fields for:
  - Slope m (fraction or integer)
  - Point (x1, y1) in format (x,y)
- [ ] Create `buildSlopeInterceptFromMPoint(m, point)` function:
  - Use point-slope: y - y1 = m(x - x1)
  - Convert to slope-intercept: y = mx + b
- [ ] Generate 4 multiple choice options in slope-intercept form:
  - Correct: y = mx + b
  - Distractor: Same slope, wrong intercept
  - Distractor: Wrong slope from sign mistakes
  - Distractor: Arithmetic error in computing b
- [ ] Add "Show steps" hint button that reveals:
  - Step 1: Substitute the point
  - Step 2: Distribute m
  - Step 3: Solve for y
- [ ] Create handler: `handleSlopeInterceptMPointCalculate()` and `handleSlopeInterceptMPointSubmit()`
- [ ] Add hint content with step-by-step breakdown
- [ ] Update PracticeMode utilities

#### 4.9.3 Graph from slope-intercept form
- [ ] Add input mode selector or sub-tab: "Graph from equation"
- [ ] Create input field for equation in slope-intercept form
- [ ] Create `parseSlopeInterceptEquation(eqStr)` function
- [ ] Implement graph rendering:
  - Plot intercept (0, b)
  - Plot another point using slope (move 1 in x, m in y)
  - Draw line through both points
- [ ] **Option A (Multiple Choice)**:
  - Generate 4 small graph thumbnails
  - One correct graph matching equation
  - Three distractors:
    - Wrong slope
    - Wrong intercept
    - Wrong direction
  - Student selects which graph matches
- [ ] **Option B (Graphing Only)**:
  - Student clicks two points on canvas
  - App checks if both points satisfy equation
  - Show "Correct graph" or "Try again" feedback
- [ ] Create handler: `handleSlopeInterceptGraphCalculate()` and `handleSlopeInterceptGraphSubmit()`
- [ ] Add hint content
- [ ] Update PracticeMode utilities

### 16.3 Section 4.10: Point-Slope Form Drills
**New problem type or enhancement to existing tabs**

#### 4.10.1 Build point-slope form from slope and point
- [ ] Determine if this should be:
  - New tab "Point-Slope Form" OR
  - Enhancement to "Slope & Description" tab
- [ ] Create input fields for:
  - Slope m (fraction or integer)
  - Point (x1, y1) in format (x,y)
- [ ] Create `buildPointSlopeForm(m, point)` function
- [ ] Generate 4 multiple choice options in point-slope form:
  - Correct: y - y1 = m(x - x1)
  - Distractor: Wrong sign on (x - x1) → y - y1 = m(x + x1)
  - Distractor: Wrong sign on (y - y1) → y + y1 = m(x - x1)
  - Distractor: Using wrong coordinates
- [ ] Add "Convert to slope-intercept" button that shows equivalent y = mx + b
- [ ] Create handler: `handlePointSlopeBuildCalculate()` and `handlePointSlopeBuildSubmit()`
- [ ] Add hint content
- [ ] Update PracticeMode utilities

#### 4.10.2 Graph from point-slope form
- [ ] Create input field for equation in point-slope form
- [ ] Create `parsePointSlopeEquation(eqStr)` function
- [ ] Create `convertPointSlopeToSlopeIntercept(pointSlopeEq)` function
- [ ] Render graph using converted slope-intercept form
- [ ] **Multiple Choice Version**:
  - Generate 4 graph thumbnails
  - One correct graph
  - Three distractors:
    - Wrong slope
    - Right slope but wrong anchor point
    - Reflection across an axis
- [ ] Add "Show algebra" hint that displays conversion steps:
  - Point-slope form
  - Distribute m
  - Solve for y
  - Final slope-intercept form
- [ ] Create handler: `handlePointSlopeGraphCalculate()` and `handlePointSlopeGraphSubmit()`
- [ ] Add hint content with conversion steps
- [ ] Update PracticeMode utilities

### 16.4 Section 4.11: Two-Point Form to Slope-Intercept
**Enhancement to "Slope & Description" tab**

- [ ] Add input mode selector or sub-tab: "From two points"
- [ ] Create input fields for two points: (x1, y1) and (x2, y2)
- [ ] Create `twoPointToSlopeIntercept(p1, p2)` function:
  - Compute slope: m = (y2 - y1) / (x2 - x1)
  - Compute b using y = mx + b (use first point)
- [ ] Generate 4 multiple choice equations in slope-intercept form:
  - Correct: y = mx + b
  - Distractor: Slope with sign error
  - Distractor: Correct slope but wrong intercept
  - Distractor: Equation that passes through only one point
- [ ] Add "Check both points" hint that verifies both points satisfy correct equation
- [ ] Create handler: `handleTwoPointCalculate()` and `handleTwoPointSubmit()`
- [ ] Add hint content
- [ ] Update PracticeMode utilities

### 16.5 Section 4.12: Parallel/Perpendicular with Graph Labeling
**Enhancement to "Parallel Line" and "Perpendicular Line" tabs**

- [ ] Add graph display option to parallel and perpendicular problems
- [ ] Extend `drawMultipleLines()` to support:
  - Base line and new line on same graph
  - Line labels ("Base line", "New line")
  - Point highlighting
- [ ] Generate 4 options that each include:
  - Equation of the line
  - Small graph thumbnail showing both lines
- [ ] Ensure one option has correct relationship and passes through given point
- [ ] Create distractors with:
  - Wrong relationship (parallel vs perpendicular)
  - Correct relationship but wrong point
  - Wrong slope
- [ ] Add line labeling requirement in graph area
- [ ] Update `handleParallelCalculate()` and `handlePerpendicularCalculate()` to support graph variant
- [ ] Add hint content explaining graph interpretation
- [ ] Update PracticeMode utilities

### 16.6 Section 4.13: Absolute Value Line Graphs
**New problem type**

- [ ] Create new tab button: "Absolute Value Graphs"
- [ ] Create HTML panel for absolute value problems
- [ ] Create input field for equation: y = a|bx + c| + d
- [ ] Create `parseAbsoluteValueEquation(eqStr)` function:
  - Parse a, b, c, d values
  - Identify vertex: solve bx + c = 0 for x, compute y at that x
- [ ] Create `calculateAbsoluteValuePoints(a, b, c, d, vertex)` function:
  - Compute at least two points on each side of vertex
- [ ] Create `drawAbsoluteValueGraph(canvasId, a, b, c, d)` function:
  - Draw V-shaped graph
  - Highlight vertex
- [ ] **Question Type 1**: "Which graph matches this equation"
  - 4 graph options (thumbnails)
  - One correct V-shaped graph
  - Three distractors with wrong shape/orientation
- [ ] **Question Type 2**: "What is the vertex of this graph"
  - 4 coordinate options
  - One correct vertex coordinate
  - Three distractors with wrong coordinates
- [ ] **Question Type 3**: "Is the graph opening up or down"
  - 4 textual options
  - One correct (up/down based on sign of a)
  - Three distractors
- [ ] Create handlers: `handleAbsoluteValueCalculate()` and `handleAbsoluteValueSubmit()`
- [ ] Add hint content explaining absolute value graphs
- [ ] Create `generateAbsoluteValueQuestion()` for Challenge mode
- [ ] Update PracticeMode utilities
- [ ] Add to Challenge mode generators

### 16.7 Section 4.14: Point-Slope to Slope-Intercept + Signed-Number Practice
**Enhancement to point-slope and hint system**

#### 4.14.1 Point-slope to slope-intercept conversion
- [ ] Create input field for point-slope equation (with optional extra constant terms)
  - Examples: y - 4 = -2/5(x - 5) + 2, y + 1 = 3(x - 2) - 5
- [ ] Create `convertPointSlopeToSlopeInterceptAdvanced(pointSlopeEq)` function:
  - Handle extra constant terms
  - Distribute slope m over parentheses
  - Move ± y1 term across using inverse operations
  - Combine constant terms carefully
- [ ] Generate 4 multiple choice equations in slope-intercept form:
  - Correct: y = mx + b
  - Distractor: Failed to distribute negative sign
  - Distractor: Added instead of subtracted constants
  - Distractor: Dropped the "+ 2" term after distribution
- [ ] Add "Show steps" mode with step-by-step breakdown:
  - Step 1: Distribute the slope m over the parentheses
  - Step 2: Move the ± y1 term across using inverse operations
  - Step 3: Combine constant terms carefully using signed-number rules
- [ ] Create handler: `handlePointSlopeConvertCalculate()` and `handlePointSlopeConvertSubmit()`
- [ ] Add hint content with step-by-step conversion
- [ ] Update PracticeMode utilities

#### 4.14.2 Signed-number micro-practice
- [ ] Create micro-drill mode for signed-number operations
- [ ] Create `generateSignedNumberExpression()` function:
  - Generate expressions from templates:
    - Distributive steps: m(x - x1) or m(x + c)
    - Constant combination: b + adjustment
  - Examples: -2/5 · (-5) + 2, 4 - 7, -3 + 5, -6 - 4
- [ ] Create `evaluateSignedNumberExpression(expr)` function
- [ ] Generate 4 multiple choice answers
- [ ] Create explanation text for each expression:
  - Brief rule reminder (e.g., "Negative times negative is positive")
  - "When subtracting a negative, add the opposite"
- [ ] Create handler: `handleSignedNumberCalculate()` and `handleSignedNumberSubmit()`
- [ ] Show explanation when student selects answer:
  - Highlight signs of each term
  - Highlight operation used
- [ ] Integrate into gamification:
  - Count toward score and streak
  - Add achievement: "Integer Pro" - 20 correct signed-number questions in a row
- [ ] Update PracticeMode utilities

#### 4.14.3 Integration into hints
- [ ] For problems involving form conversion (4.3, 4.4, 4.8, 4.10, 4.11, 4.14):
  - Add "Practice this step" button to hint panel
- [ ] Create hint overlay system:
  - Small overlay that opens when "Practice this step" clicked
  - Shows 1-3 signed-number micro-questions relevant to current equation
  - Example: If converting y - 4 = -2/5(x - 5) + 2, show:
    - -2/5 · (-5)
    - 4 + 2
    - etc.
- [ ] Integrate with existing hint system:
  - Follow existing hint penalties and limits in Challenge mode
  - Point reduction and hint count tracking
- [ ] Update hint content for all relevant problem types
- [ ] Update PracticeMode utilities

### 16.8 Challenge Mode Integration
- [ ] Create question generators for all new variants:
  - `generateSlopeInterceptMBQuestion()`
  - `generateSlopeInterceptMPointQuestion()`
  - `generateSlopeInterceptGraphQuestion()`
  - `generatePointSlopeBuildQuestion()`
  - `generatePointSlopeGraphQuestion()`
  - `generateTwoPointQuestion()`
  - `generateParallelWithGraphQuestion()`
  - `generatePerpendicularWithGraphQuestion()`
  - `generateAbsoluteValueQuestion()` (already in 16.6)
  - `generatePointSlopeConvertQuestion()`
- [ ] Update `generateChallengeQuestions()` to include new generators
- [ ] Update `displayChallengeQuestion()` to handle new question types
- [ ] Update `submitChallengeAnswer()` to validate new question types
- [ ] Test all new types in Challenge mode

### 16.9 UI Updates
- [ ] Add mode selectors or sub-tabs to existing panels where needed
- [ ] Create HTML elements for new input fields
- [ ] Create graph containers for new graph types
- [ ] Create multiple choice containers for all new variants
- [ ] Add "Show steps" buttons where applicable
- [ ] Add "Practice this step" buttons in hint panels
- [ ] Create hint overlay component for signed-number practice
- [ ] Update CSS for new elements
- [ ] Ensure responsive design

### 16.10 Testing
- [ ] Test all new variants in Practice mode
- [ ] Test all new variants in Challenge mode
- [ ] Test all new variants in Session mode
- [ ] Test graph rendering for all graph types
- [ ] Test multiple choice validation
- [ ] Test hint system integration
- [ ] Test signed-number micro-practice
- [ ] Test step-by-step hints
- [ ] Create Playwright tests for new features

## Acceptance Criteria

1. **4.9 Slope-Intercept Drills**:
   - All three variants (from m and b, from m and point, graph from equation) work correctly
   - Multiple choice options use fraction-only format
   - Graph rendering works for graphing variant
   - Step-by-step hints work for m and point variant

2. **4.10 Point-Slope Drills**:
   - Building point-slope form works correctly
   - Graphing from point-slope form works correctly
   - Conversion hints work correctly

3. **4.11 Two-Point Form**:
   - Correctly converts two points to slope-intercept form
   - Multiple choice options are correct
   - Hint verifies both points

4. **4.12 Parallel/Perpendicular with Graphs**:
   - Graphs show both lines correctly
   - Line labeling works
   - Multiple choice includes graph thumbnails

5. **4.13 Absolute Value Graphs**:
   - All three question types work correctly
   - V-shaped graphs render correctly
   - Vertex calculation is correct

6. **4.14 Point-Slope Conversion and Signed-Number Practice**:
   - Advanced conversion handles extra constant terms
   - Signed-number micro-practice works
   - Hint integration works correctly

7. **All Features**:
   - Work in Practice, Challenge, and Session modes
   - Use fraction-only format for numeric answers
   - Use multiple choice format
   - Integrate with existing hint system
   - Graph rendering uses canvas
   - Code is well-structured and maintainable

