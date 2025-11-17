# Milestone 19: Interactive Graphing Practice

**Status**: Planned  
**Priority**: High  
**Estimated Duration**: 7-10 days  
**Start Date**: TBD  
**Target Completion**: TBD

## Overview

Add interactive graphing practice for students to plot lines on a coordinate plane by selecting 2 points from 8 options. Covers Slope-Intercept, Point-Slope, Parallel, Perpendicular, and Absolute Value equations.

## User Requirements (Confirmed)

1. **Interactive Method**: Click 2 points to define/plot a line
2. **Validation System**: 
   - Display graph with 8 points (no line shown initially)
   - 2 of the 8 points are the correct answer
   - User clicks to select 2 points
   - Once 2 points selected, line is automatically drawn
   - Double-click to deselect a point
   - Validation checks if selected points match correct answer
3. **Problem Types**:
   - Slope-Intercept: Both directions (equation→graph, graph→equation)
   - Point-Slope: Both directions (equation→graph, graph→equation)
   - Parallel/Perpendicular: Given equation, draw base line first, then draw parallel/perp line
   - Absolute Value: Both directions (equation→graph, graph→equation)
4. **Graph Specs**: -9 to 9 on both x and y axes
5. **Integration**: New tabs in left sidebar
6. **Feedback**: All features (show correct graph overlay, highlight key points, hints, animation)
7. **Challenge Mode**: Yes, accuracy-based scoring only (no time limits)

## Features Breakdown

### 1. Graph Component Enhancement

**Existing**: We have a canvas-based graph component for displaying lines.

**New Requirements**:
- Interactive point selection (click to select, double-click to deselect)
- Display 8 selectable points on grid
- Track which 2 points are selected
- Auto-draw line when 2 points selected
- Visual feedback for selected vs unselected points
- Highlight correct answer after submission

**Technical Implementation**:
- Add click event listeners to canvas
- Calculate if click is near any of the 8 points (hit detection)
- Track selected points state: `selectedPoints = []` (max 2)
- Draw line through 2 selected points using existing line drawing logic
- Visual states: unselected (gray), selected (blue), correct (green), incorrect (red)

### 2. New Problem Types

#### 2.1 Graph from Slope-Intercept (y = mx + b)
**Mode**: Equation → Graph
- **Given**: Equation like `y = 2x + 3`
- **Task**: Select 2 points that lie on this line
- **Generation**: 
  - Generate random m and b (simple fractions/integers)
  - Calculate 8 points: 2 correct (on the line), 6 incorrect (near but off)
  - Display equation, show 8 points, user selects 2
- **Validation**: Check if both selected points satisfy the equation

#### 2.2 Identify Slope-Intercept from Graph
**Mode**: Graph → Equation
- **Given**: Graph showing a line (2 points highlighted)
- **Task**: Write the equation in slope-intercept form
- **Generation**:
  - Pick 2 points on grid
  - Calculate slope m = (y₂-y₁)/(x₂-x₁)
  - Calculate y-intercept b
  - Display line on graph
- **Validation**: Parse user input, check if equation matches
- **Input**: Text field for equation (e.g., "y = 2x + 3")

#### 2.3 Graph from Point-Slope (y - y₁ = m(x - x₁))
**Mode**: Equation → Graph
- **Given**: Equation like `y - 1 = -2(x + 3)`
- **Task**: Select 2 points on this line
- **Generation**: Similar to slope-intercept
- **Validation**: Check if points satisfy equation

#### 2.4 Identify Point-Slope from Graph
**Mode**: Graph → Equation
- **Given**: Graph showing a line
- **Task**: Write equation in point-slope form
- **Validation**: Parse and verify equation

#### 2.5 Graph Parallel Line
**Mode**: Given base equation, graph parallel line through point
- **Given**: Equation `y = 3x + 1` and point `(2, 5)`
- **Task**: 
  1. First, user selects 2 points to graph the BASE line (`y = 3x + 1`)
  2. Then, user selects 2 points to graph PARALLEL line through `(2, 5)`
- **Validation**: 
  - Check base line is correct
  - Check parallel line has same slope and passes through given point

#### 2.6 Graph Perpendicular Line
**Mode**: Given base equation, graph perpendicular line through point
- **Given**: Equation `y = 2x - 1` and point `(1, 3)`
- **Task**:
  1. First, graph base line
  2. Then, graph perpendicular line through given point
- **Validation**:
  - Check base line is correct
  - Check perp line has negative reciprocal slope and passes through point

#### 2.7 Graph from Absolute Value (y = a|bx + c| + d)
**Mode**: Equation → Graph
- **Given**: Equation like `y = 2|x - 1| + 3`
- **Task**: Select 2 points on the V-shaped graph
- **Special**: Need more than 2 points to define a V-shape
- **Approach**: 
  - Require user to select 3 points: vertex + 1 point on each side
  - OR: Provide vertex, user selects 2 points (1 on each side)
- **Validation**: Check if points lie on the absolute value function

#### 2.8 Identify Absolute Value from Graph
**Mode**: Graph → Equation
- **Given**: V-shaped graph
- **Task**: Write equation in vertex form
- **Validation**: Parse and verify

## Implementation Plan

### Phase 1: Enhanced Graph Component (2 days)

**Tasks**:
1. Create `InteractiveGraph` class extending existing graph component
2. Add point selection logic:
   - Click detection (check if click is within radius of any point)
   - Track selected points (max 2 for lines, 3 for absolute value)
   - Double-click to deselect
3. Add visual states for points:
   - Unselected: gray circle (radius 8px)
   - Selected: blue circle (radius 10px)
   - Correct: green circle (radius 10px)
   - Incorrect: red circle (radius 10px)
4. Auto-draw line when 2 points selected
5. Add animation for line drawing
6. Test on all browsers

**Files**:
- `app.js`: Add `InteractiveGraph` class
- `styles.css`: Add styles for interactive points

### Phase 2: Problem Generators (3 days)

**Tasks**:
1. `generateGraphSlopeInterceptQuestion()`:
   - Generate random m, b
   - Calculate 2 correct points on line
   - Generate 6 distractor points (nearby but not on line)
   - Return question object with equation, 8 points, correct indices
   
2. `generateIdentifySlopeInterceptQuestion()`:
   - Pick 2 grid points
   - Calculate slope and y-intercept
   - Draw line on graph
   - Return question object with graph, correct equation
   
3. `generateGraphPointSlopeQuestion()`:
   - Generate point-slope equation
   - Calculate 2 correct points
   - Generate 6 distractors
   
4. `generateIdentifyPointSlopeQuestion()`:
   - Similar to slope-intercept identification
   
5. `generateGraphParallelQuestion()`:
   - Generate base equation
   - Calculate 2 points for base line
   - Calculate 2 points for parallel line through given point
   - Generate distractors for both (16 points total)
   
6. `generateGraphPerpendicularQuestion()`:
   - Similar to parallel but with negative reciprocal slope
   
7. `generateGraphAbsoluteValueQuestion()`:
   - Generate absolute value equation
   - Calculate vertex and 2 side points (or require user to select 3)
   - Generate distractors
   
8. `generateIdentifyAbsoluteValueQuestion()`:
   - Draw V-shaped graph
   - Calculate vertex form equation

**Helper Functions**:
- `generateDistractorPoints(correctPoints, count)`: Generate points near but not on line
- `isPointOnLine(point, equation, tolerance)`: Check if point satisfies equation
- `parseEquationInput(input)`: Parse user's text input for equations
- `validateEquation(userEq, correctEq)`: Check if equations are equivalent

**Files**:
- `app.js`: Add all generator functions

### Phase 3: New Tabs & UI (2 days)

**Tasks**:
1. Add new tabs to sidebar:
   - "Graph Slope-Intercept"
   - "Graph Point-Slope"
   - "Graph Parallel Lines"
   - "Graph Perpendicular Lines"
   - "Graph Absolute Value"
   
2. Create tab containers in HTML:
   - Each tab has Practice, Challenge, Session modes
   - Graph canvas area
   - Equation display area
   - Instructions area
   - Submit button
   - Hint button
   
3. Add instructions for each problem type:
   - "Click 2 points to graph the line"
   - "Double-click to deselect a point"
   - "A line will appear when 2 points are selected"
   
4. Add equation input fields (for identification problems):
   - Text input for equation
   - Example format shown
   - Validation on submit

**Files**:
- `index.html`: Add new tab buttons and containers
- `styles.css`: Style new tabs and containers

### Phase 4: Validation & Feedback (1 day)

**Tasks**:
1. Implement validation for each problem type
2. Show correct answer overlay when wrong:
   - Highlight correct 2 points in green
   - Draw correct line with dashed style
   - Show user's incorrect selection in red
3. Add step-by-step hints:
   - "Find the y-intercept first (where x=0)"
   - "Use the slope to find another point"
   - "Remember: parallel lines have the same slope"
4. Add animation showing correct solution:
   - Animate highlighting of correct points
   - Animate line drawing
   - Pause at key steps

**Files**:
- `app.js`: Add validation and feedback functions

### Phase 5: Challenge Mode Integration (1 day)

**Tasks**:
1. Add graphing problem types to Challenge mode
2. Update `generateChallengeQuestions()` to include graphing
3. Update `displayChallengeQuestion()` to handle graphing display
4. Update `submitChallengeAnswer()` to validate graphing answers
5. Scoring: Accuracy only (no time penalty)
6. Track stats for graphing problem types

**Files**:
- `app.js`: Update challenge mode functions

### Phase 6: Hints & Help System (1 day)

**Tasks**:
1. Create hint content for each graphing problem type
2. Add to `hints` object in app.js
3. Step-by-step hints:
   - Slope-Intercept: "Start with y-intercept, use slope to find 2nd point"
   - Point-Slope: "Use the given point, apply slope to find 2nd point"
   - Parallel: "Same slope, different y-intercept"
   - Perpendicular: "Negative reciprocal of slope"
   - Absolute Value: "Find the vertex, then points on each side"
4. Add visual hints (highlight key features on graph)

**Files**:
- `app.js`: Add hint content

### Phase 7: Testing & Polish (1 day)

**Tasks**:
1. Write Playwright tests for each problem type
2. Test point selection on different screen sizes
3. Test double-click deselection
4. Test validation logic
5. Test challenge mode integration
6. Fix any bugs found
7. Polish animations and transitions
8. Ensure responsive design works

**Test Cases**:
- Select correct 2 points → should show success
- Select incorrect 2 points → should show error with correct answer
- Double-click to deselect → should work
- Graph parallel line → base line + parallel line both correct
- Challenge mode → graphing problems appear and validate correctly

**Files**:
- `tests/ui/graphing-practice.spec.js`: New test file

## Technical Specifications

### Graph Component

```javascript
class InteractiveGraph {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.xMin = options.xMin || -9;
        this.xMax = options.xMax || 9;
        this.yMin = options.yMin || -9;
        this.yMax = options.yMax || 9;
        this.points = options.points || []; // Array of {x, y, isCorrect}
        this.selectedPoints = [];
        this.maxSelections = options.maxSelections || 2;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('dblclick', (e) => this.handleDoubleClick(e));
    }
    
    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const clickedPoint = this.findNearestPoint(x, y);
        
        if (clickedPoint && this.selectedPoints.length < this.maxSelections) {
            if (!this.isSelected(clickedPoint)) {
                this.selectedPoints.push(clickedPoint);
                this.draw();
                
                if (this.selectedPoints.length === this.maxSelections) {
                    this.drawLine();
                }
            }
        }
    }
    
    handleDoubleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const clickedPoint = this.findNearestPoint(x, y);
        
        if (clickedPoint && this.isSelected(clickedPoint)) {
            this.selectedPoints = this.selectedPoints.filter(p => p !== clickedPoint);
            this.draw();
        }
    }
    
    findNearestPoint(canvasX, canvasY) {
        const threshold = 15; // pixels
        for (const point of this.points) {
            const px = this.xToCanvas(point.x);
            const py = this.yToCanvas(point.y);
            const distance = Math.sqrt((canvasX - px) ** 2 + (canvasY - py) ** 2);
            if (distance < threshold) {
                return point;
            }
        }
        return null;
    }
    
    isSelected(point) {
        return this.selectedPoints.includes(point);
    }
    
    drawLine() {
        if (this.selectedPoints.length !== 2) return;
        const [p1, p2] = this.selectedPoints;
        // Draw line from p1 to p2
        this.ctx.beginPath();
        this.ctx.moveTo(this.xToCanvas(p1.x), this.yToCanvas(p1.y));
        this.ctx.lineTo(this.xToCanvas(p2.x), this.yToCanvas(p2.y));
        this.ctx.strokeStyle = '#4f46e5';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
    }
    
    validateAnswer() {
        if (this.selectedPoints.length !== this.maxSelections) {
            return { correct: false, message: `Please select ${this.maxSelections} points.` };
        }
        
        const allCorrect = this.selectedPoints.every(p => p.isCorrect);
        return { 
            correct: allCorrect, 
            message: allCorrect ? 'Correct!' : 'Incorrect. Try again!'
        };
    }
    
    showCorrectAnswer() {
        const correctPoints = this.points.filter(p => p.isCorrect);
        // Highlight correct points in green
        // Draw correct line
    }
    
    // ... more methods for drawing grid, axes, points, etc.
}
```

### Point Generation Logic

```javascript
function generateDistractorPoints(equation, correctPoints, count) {
    const distractors = [];
    const {m, b} = equation; // For slope-intercept
    
    while (distractors.length < count) {
        const x = randomInt(-9, 9);
        const yCorrect = m * x + b;
        // Generate y value slightly off
        const offset = (Math.random() > 0.5 ? 1 : -1) * randomInt(1, 3);
        const y = yCorrect + offset;
        
        // Check not too close to correct points
        const point = {x, y, isCorrect: false};
        if (!isNearCorrectPoints(point, correctPoints) && !distractors.some(p => p.x === x && p.y === y)) {
            distractors.push(point);
        }
    }
    
    return distractors;
}
```

## Data Structures

### Question Object for Graphing

```javascript
{
    type: 'graphSlopeIntercept',
    mode: 'equationToGraph', // or 'graphToEquation'
    question: 'Graph the line: y = 2x + 3',
    equation: { m: 2, b: 3 }, // or point-slope format, etc.
    points: [
        { x: 0, y: 3, isCorrect: true },
        { x: 1, y: 5, isCorrect: true },
        { x: 2, y: 6, isCorrect: false }, // distractor
        { x: -1, y: 2, isCorrect: false }, // distractor
        // ... 4 more distractors
    ],
    correctAnswer: 'Points (0, 3) and (1, 5)',
    correctPoints: [
        { x: 0, y: 3 },
        { x: 1, y: 5 }
    ],
    data: { /* additional data for validation */ }
}
```

## Acceptance Criteria

### Phase 1: Interactive Graph
- [ ] User can click on points to select them
- [ ] Selected points turn blue
- [ ] User can select maximum 2 points
- [ ] Double-clicking a selected point deselects it
- [ ] Line is automatically drawn when 2 points are selected
- [ ] Graph displays correctly on -9 to 9 axes

### Phase 2: Problem Generators
- [ ] All 8 problem types generate correctly
- [ ] 8 points displayed for each question (2 correct, 6 distractors)
- [ ] Distractors are plausible but incorrect
- [ ] Equations are age-appropriate (simple fractions/integers)

### Phase 3: UI & Tabs
- [ ] 5 new tabs added to sidebar
- [ ] Each tab displays correctly with graph and instructions
- [ ] Tabs support all 3 modes (Practice, Challenge, Session)
- [ ] Responsive design works on different screen sizes

### Phase 4: Validation & Feedback
- [ ] Correct selection shows success message
- [ ] Incorrect selection shows error with correct answer overlay
- [ ] Correct points highlighted in green
- [ ] Correct line drawn with dashed style
- [ ] Step-by-step hints available
- [ ] Animation shows correct solution

### Phase 5: Challenge Mode
- [ ] Graphing problems appear in Challenge mode
- [ ] Questions display correctly
- [ ] Validation works in Challenge mode
- [ ] Stats tracked for graphing problem types
- [ ] Scoring based on accuracy only

### Phase 6: Hints
- [ ] Hints available for all graphing problem types
- [ ] Hints are clear and educational
- [ ] Visual hints highlight key features

### Phase 7: Testing
- [ ] All Playwright tests pass
- [ ] No console errors
- [ ] Works on Chrome, Firefox, Safari, Edge
- [ ] Works on desktop and tablet
- [ ] Animations smooth and responsive

## Risks & Mitigation

### Risk 1: Click Detection Accuracy
**Mitigation**: Use appropriate threshold (15px radius), test on different screen sizes

### Risk 2: Absolute Value Complexity (3 points needed)
**Mitigation**: Either require 3 selections OR provide vertex and require 2 selections

### Risk 3: Equation Parsing for Identification Problems
**Mitigation**: Use regex patterns, provide examples, be lenient with formatting

### Risk 4: Performance with Animations
**Mitigation**: Use requestAnimationFrame, optimize canvas drawing

## Dependencies

- Existing graph component in `app.js`
- Existing equation formatting functions
- Existing validation patterns
- Canvas API

## Success Metrics

- Students can complete graphing problems with 70%+ accuracy
- Average time per graphing problem: 30-45 seconds
- Zero console errors during testing
- Positive user feedback on interactivity

## Future Enhancements (Post-Milestone 19)

- Touch screen optimization for tablets/mobile
- Undo/Redo functionality
- Graph zoom/pan for more detailed view
- Export graph as image
- More complex equations (systems of equations, inequalities)
- Graphing calculator mode
- Animations showing transformation of equations

---

**Total Estimated Time**: 7-10 days
**Priority**: High
**Dependencies**: None (builds on existing components)
**Complexity**: Medium-High

