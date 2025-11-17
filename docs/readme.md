# Parallel & Perpendicular Lines Web Trainer

A browser-based educational game for practicing line equations and relationships.

## Quick Start

1. Open `index.html` in a web browser
2. No installation or dependencies required
3. All data is stored locally in the browser

## Features

- Four problem types: slope calculation, line relationships, parallel lines, perpendicular lines
- Practice mode with timer tracking
- Achievement system with localStorage persistence
- Clean, responsive UI

## Development

See `docs/prd.md` for full product requirements.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- localStorage for persistence


## Upcoming Features (Milestone 19 - Planned)

### Interactive Graphing Practice

Practice graphing lines by clicking points on a coordinate plane!

**New Tabs**:
- Graph Slope-Intercept Form
- Graph Point-Slope Form
- Graph Parallel Lines
- Graph Perpendicular Lines
- Graph Absolute Value Functions

**How It Works**:
1. System shows you an equation (e.g., y = 2x + 3)
2. Graph displays 8 points to choose from
3. Click 2 points that lie on the line
4. Line automatically draws when 2 points selected
5. Double-click a point to deselect it
6. Submit to check your answer

**Features**:
- Interactive point selection (click to select, double-click to deselect)
- Auto-draw line when 2 points selected
- Visual feedback (blue=selected, green=correct, red=incorrect)
- Correct answer overlay with dashed line
- Step-by-step hints with animations
- Works in all modes (Practice, Challenge, Session)
- Accuracy-based scoring in Challenge mode

**Graph Specifications**:
- Coordinate range: -9 to 9 on both axes
- 1-unit grid squares
- Clear axis labels
- Interactive canvas-based rendering

**Problem Types**:
- **Equation → Graph**: Given equation, select correct points
- **Graph → Equation**: Given graph, write the equation
- **Both directions** for Slope-Intercept and Point-Slope
- **Base + Parallel/Perpendicular**: Graph both lines in sequence

**Estimated Release**: 7-10 days from approval

