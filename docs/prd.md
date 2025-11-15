Product Requirements Document
St. Benedict's Prep - 8th Grade Math
	1.	Product overview
Parallel & Perpendicular Lines Web Trainer is a browser-based app built with HTML, CSS, and JavaScript.
It helps students practice ten types of line problems and turns practice into a timed, achievement-based game.
The app runs fully client-side and stores progress locally in the browser.
	2.	Objectives
a) Help students answer ten core homework question types on lines:
	1.	Slope and line description through two points
	2.	Relationship between two equations
	3.	Parallel line through a point
	4.	Perpendicular line through a point
	5.	Finding intercepts (from graphs and equations)
	6.	Rate of change (from tables)
	7.	Identifying linear functions (from tables)
	8.	Converting to standard form
	9.	Point-slope form drills
	10.	Absolute value line graphs

b) Improve speed and accuracy with a timer, streaks, and achievements.

c) Provide clean visual feedback so students understand both the answer and why it is correct.
	3.	Target users and scenarios
a) Middle school or early high school students practicing homework or test prep.
b) Parents checking their child's work quickly.
c) Teachers projecting the app in class to walk through examples live.
	4.	Core problem types and flows

4.1 Slope and line description
Input
• Text field for two points in the format (x1,y1),(x2,y2)
• Two separate multiple choice questions:
  - Question 1: "What is the slope?" (4 options: A, B, C, D)
  - Question 2: "What is the classification?" (4 options: A, B, C, D)
Behavior
• Parse both points
• Validate numeric inputs and non-identical points
• Compute slope, then classify as rising, falling, horizontal, or vertical
• Generate 3 plausible wrong answers (distractors) for each question
• Display as radio button multiple choice
Output
• Show slope as "fraction (decimal)" format in multiple choice (e.g., "2/3 (0.667)")
• Fractions are simplified (e.g., 4/8 → 1/2)
• Show classification text in multiple choice format
• Mark answer status for gamification (correct vs error due to bad input)

4.2 Relationship between two lines
Input
• Two text fields for Equation 1 and Equation 2
• Supported formats:
	•	y = mx + b
	•	Ax + By = C
	•	x = c
	•	y = c
• Multiple choice answer: 4 radio button options (A, B, C, D)
  - Options: parallel, perpendicular, neither, same
Behavior
• Parse each equation into normalized form
	•	Vertical: kind = vertical, x0 = c
	•	Non vertical: kind = slope, m, b
• Determine relationship: parallel, perpendicular, or neither
• Generate 3 plausible wrong answers (distractors)
Output
• Display normalized form for each line
• Display relationship result as multiple choice

4.3 Parallel line through a point
Input
• One text field for base equation
• One text field for point in format (x,y)
• Multiple choice answer: 4 radio button options (A, B, C, D)
  - Options show full equations with slopes in fraction (decimal) format (e.g., "y = 2/3x + 1 (slope: 0.667)", "y = 2x - 5", etc.)
Behavior
• Parse equation to get slope or vertical type
• Compute line parallel to base that passes through the point
	•	If base is vertical, result is x = x0 for the given x
	•	If base is non vertical, reuse slope and compute b from the point
• Generate 3 plausible wrong equations (distractors)
Output
• Display final equation in slope intercept form when possible
• Slopes shown as "fraction (decimal)" format
• For vertical, display x = c
• Show as multiple choice with full equation options

4.4 Perpendicular line through a point
Input
• One text field for base equation
• One text field for point in format (x,y)
• Multiple choice answer: 4 radio button options (A, B, C, D)
  - Options show full equations with slopes in fraction (decimal) format (e.g., "y = -1/2x + 5 (slope: -0.5)", "y = -0.5x - 3", etc.)
Behavior
• Parse equation
• Compute perpendicular line
	•	If base is vertical, result is horizontal y = y0
	•	If base is horizontal, result is vertical x = x0
	•	Otherwise slope is negative reciprocal and b computed from the point
• Generate 3 plausible wrong equations (distractors)
Output
• Display final equation in slope intercept form when possible
• Slopes shown as "fraction (decimal)" format
• For vertical, display x = c
• Show as multiple choice with full equation options

4.5 Finding intercepts
Input
• One text field for equation (or interactive graph display)
• Supported formats: y = mx + b, Ax + By = C, x = c, y = c
• Multiple choice answer: 4 radio button options (A, B, C, D)
  - Options show intercepts as coordinate points: (x, 0) for x-intercept, (0, y) for y-intercept
  - May ask for both intercepts or one at a time
Behavior
• Parse equation or display interactive graph
• Calculate x-intercept: Set y = 0, solve for x → (x, 0)
• Calculate y-intercept: Set x = 0, solve for y → (0, y)
• Generate 3 plausible wrong answers (distractors) for each intercept
  - Wrong sign errors
  - Calculation errors
  - Confusing x and y intercepts
• Display interactive graph with line and intercepts highlighted
Output
• Show intercepts as coordinate points in multiple choice format
• Graph displays line with intercepts visually highlighted
• Mark answer status for gamification

4.6 Rate of change
Input
• Table input interface with X and Y columns (or generated table)
• Multiple choice answer: 4 radio button options (A, B, C, D)
  - Options show rate of change values for different intervals
  - May ask for rate of change for specific interval or greatest rate
Behavior
• Parse table data (X and Y values)
• Calculate rate of change for each interval: (y2 - y1) / (x2 - x1)
• Identify greatest rate of change (or greatest decrease)
• Generate 3 plausible wrong answers (distractors)
  - Wrong interval calculations
  - Sign errors
  - Calculation mistakes
Output
• Display table visually
• Show rate of change values in multiple choice format
• Rate of change shown as "fraction (decimal)" format when applicable
• Mark answer status for gamification

4.7 Identifying linear functions
Input
• Table input interface with X and Y columns (or generated table)
• Multiple choice answer: 4 radio button options (A, B, C, D)
  - Options: Yes/No with explanations
Behavior
• Parse table data (X and Y values)
• Check if change in X is constant
• Check if change in Y is constant
• Check if ratio (change Y / change X) is constant
• Determine if table represents a linear function
• Generate 3 plausible wrong answers (distractors)
  - Wrong explanations
  - Confusing with other function types
Output
• Display table visually
• Show Yes/No answer with explanation in multiple choice format
• Mark answer status for gamification

4.8 Converting to standard form
Input
• One text field for equation in any format
• Supported input formats: y = mx + b, point-slope form, etc.
• Multiple choice answer: 4 radio button options (A, B, C, D)
  - Options show standard form equations: Ax + By = C
  - May also ask for A, B, C values separately
Behavior
• Parse equation in any format
• Convert to standard form: Ax + By = C
• Ensure A, B, C are integers (if possible)
• Handle negative values correctly
• Generate 3 plausible wrong answers (distractors)
  - Wrong signs
  - Wrong coefficients
  - Wrong form (not standard form)
Output
• Display converted equation in standard form: Ax + By = C
• Show A, B, C values if asked separately
• Display as multiple choice with full equation options
• Mark answer status for gamification

	5.	Gamification features

5.1 Game modes
a) Practice mode
• No strict time limit
• Timer works as a stopwatch to track time per question
b) Set Challenge mode
• User selects set size: 5, 10, 25, 50, or 100 questions
• Questions are pre-generated randomly for the current problem type section
• All questions generated at start of challenge
• Navigation: Back, Skip, Give Up buttons
• One answer per question - cannot change after submission
• Give Up: Shows answer, marks as incorrect, generates new question
• Skip: Allows returning later to answer
• Completion: Shows summary with grade, confetti for 85%+, fireworks for 100%
c) Session mode
• Set a session length, for example 10 minutes
• Student tries to solve as many questions as possible

5.2 Timer requirements
a) Per question timer
• Start when the user clicks "Start" or when they first type
• Stop on answer submission
• Show elapsed time in seconds
b) Set Challenge mode timer
• Tracks time per question (stopwatch style)
• Shows total elapsed time for the challenge
• No countdown - user works at their own pace
c) Session timer
• Track total active time in the current session
• Reset when the user clicks "New session"

5.3 Scoring system
a) Each correct answer grants points
• Base score per correct answer
• Same scoring as other modes
b) Set Challenge mode scoring
• Correct answer: Awards points (same as other modes)
• Give Up: No points awarded, marks as incorrect
• Skip: No points initially, but can earn points if answered correctly later
• Final grade calculated as percentage: (correct / total) * 100
c) Incorrect answer reduces score slightly or breaks streak
d) Show total score, current streak, and best streak in a header or sidebar panel
e) Set Challenge completion
• Display summary screen with:
  - Total questions answered
  - Correct answers
  - Incorrect answers
  - Skipped questions
  - Final grade percentage
  - Letter grade (A: 90-100%, B: 80-89%, C: 70-79%, D: 60-69%, F: <60%)
• Confetti animation for 85% or better
• Fireworks animation for 100% (all correct)

5.4 Achievements
All achievements stored in browser localStorage.

Examples
a) "First Steps"
• Condition: first correct answer
b) "Slope Starter"
• Condition: 5 correct slope questions
c) "Slope Master"
• Condition: 20 correct slope questions with no wrong slope in between
d) "Parallel Pro"
• Condition: 10 correct "parallel vs perpendicular vs neither" classifications
e) "Perpendicular Pro"
• Condition: 10 perpendicular-through-point questions answered correctly
f) "Speed Runner"
• Condition: answer any question correctly in under 10 seconds
g) "Focus 10"
• Condition: 10 correct answers in a row in one session
h) "Homework Hero"
• Condition: score threshold across all modes in one session

Behavior
• When a new achievement is unlocked, show a small modal or toast with the title and condition
• Persist unlocked achievements in localStorage
• Show a simple Achievements screen with:
	•	Name
	•	Short description
	•	Status (locked / unlocked)
	•	Date unlocked

	6.	User interface and layout

6.1 Global layout
a) Header
• App title
• Current mode (Practice, Challenge, Session)
• Score, streak, timer display
b) Navigation
• Vertical sidebar navigation on the left (desktop)
• Fixed width sidebar (220-250px) with all ten problem type tabs
• Active tab indicated by left border highlight
• Mobile/tablet: Collapsible dropdown menu with hamburger icon
c) Main content
• Problem type panels displayed based on selected tab
• Input fields and action buttons per tab
• Result panel with text feedback
• Interactive graph display for intercept problems
• Table display for rate of change and linear function problems
d) Right sidebar
• Timer details
• Achievements and status summary
• Basic help text

6.2 Visual style
a) Clean card-based layout with clear separation between problem types
b) Color-coded statuses
• Green for correct
• Red for invalid input or timeouts
• Neutral for pending
c) Responsive design for desktop and tablet
• Single-column layout on narrow screens

6.3 Interaction guidelines
a) Each card contains
• Short instructions
• Inputs
• Primary action button
• Result area
b) For each submission
• Validate inputs
• Show either result or precise error message
• Update timer and scoring state
• Trigger achievement check
	7.	Functional requirements

7.1 Input parsing and validation
a) Coordinates
• Accept formats like (2,3),(5,9) and (4,1)
• Reject malformed input with clear message
b) Equations
• Accept y = mx + b, Ax + By = C, x = c, y = c
• Ignore whitespace
• Support integer and decimal numbers
c) Validation
• Detect identical points in slope tasks
• Detect non numeric values
• Provide detailed error messaging

7.2 Core math logic
a) Slope computation using (y2 − y1) / (x2 − x1)
b) Classification
• Rising if slope > 0
• Falling if slope < 0
• Horizontal if slope = 0
• Vertical if x1 = x2
c) Relationship logic
• Parallel if slopes equal and not the same line by default
• Perpendicular if product of slopes is −1
• Vertical and horizontal are perpendicular
d) Equation building
• Parallel and perpendicular lines through a specific point
• Slope intercept form where possible

7.3 Gamification logic
a) Maintain a game state object in JavaScript
• score
• streakCurrent
• streakBest
• totalQuestions
• correctQuestions
• achievementsUnlocked
b) After each submission
• Update stats
• Evaluate all achievement conditions
• Persist to localStorage
c) Timer logic
• Use window.setInterval at 1000 ms
• Maintain states for questionTimer and sessionTimer

7.4 Persistence
a) Use localStorage keys for
• scoreHistory
• achievements
• bestTimes per problem type
b) On load
• Read existing data
• Initialize UI with unlocked achievements and best streak
	8.	Non functional requirements

8.1 Technology
a) Pure HTML, CSS, and vanilla JavaScript
b) No external dependencies required

8.2 Performance
a) Load in under two seconds on a standard broadband connection
b) Timer and animations must remain smooth on common laptops and tablets

8.3 Compatibility
a) Support current versions of Chrome, Edge, Safari, and Firefox
b) Graceful degradation when localStorage is unavailable

8.4 Accessibility
a) All interactive elements reachable with keyboard
b) Clear focus states
c) Text contrast sufficient for readability
	9.	Analytics and metrics (local only)
a) Number of questions attempted per session
b) Accuracy per problem type
c) Average time per problem type
d) Best time per problem type
	10.	Release scope

10.1 MVP
a) Four functioning problem types
b) Single Practice mode with per question timer and score
c) Basic achievements
• First Steps
• Slope Starter
• Speed Runner
d) LocalStorage for achievements and best streak

10.2 Phase 2
a) Timed Challenge mode and Session mode
b) Extended achievement set
c) Achievements screen with filtering by unlocked status

10.3 Phase 3
a) Optional visual hints like mini graphs or number lines
b) Export or print summary of a session for teachers or parents

10.4 Deployment
a) Automated deployment to GitHub Pages using GitHub Actions
b) Deploy on push to main branch
c) Build process prepares production files in dist/ directory
d) Publicly accessible via GitHub Pages URL
e) No server-side dependencies required

10.5 Hint System
a) Hint button available for each of the four problem types
b) Tooltip displays comprehensive hints including:
	• Step-by-step guidance
	• Formula reminders
	• Key concepts and explanations
c) Hints provide helpful guidance without revealing the answer
d) Tooltip is dismissible (click outside or close button)
e) All hints displayed at once when hint button is clicked

10.6 Hints in Challenge Mode
a) Hints available in Set Challenge Mode
b) Display in same right column layout as practice mode
c) Available for all questions (answered, unanswered, skipped)
d) Point penalty: Using a hint halves the points for that question
e) Hint limit: Maximum of 5 hints per challenge
f) Hint tracking: Track hints used per question and total
g) Completion summary: Display hint usage statistics
h) Hint button disabled when limit reached

10.7 Test Celebration Buttons
a) Developer/test buttons available in sidebar
b) "Test Confetti" button triggers confetti animation
c) "Test Fireworks" button triggers fireworks animation
d) Buttons clearly labeled as test buttons
e) Available in all modes for testing and demonstration

10.8 Multiple Choice Answer Format
a) All problem types use multiple choice format (4 options: A, B, C, D)
b) Radio buttons replace text input fields
c) Slope questions split into two separate questions:
   - Question 1: "What is the slope?" (4 options)
   - Question 2: "What is the classification?" (4 options)
d) Wrong answers (distractors) are common mistakes, mathematically plausible but incorrect
e) Full equations shown as options for parallel/perpendicular questions
f) Available in all modes (Practice, Challenge, Session)
g) Answer validation simplified to direct option comparison
h) Visual feedback: correct option highlighted in green, wrong selection in red

10.9 Fraction-Only Answer Format
a) All numeric answers (slopes and slopes in equations) displayed as fraction format only (no decimal)
   - Example: "2/3" or "1/2" (not "2/3 (0.667)")
b) Fractions are automatically simplified (e.g., 4/8 → 1/2)
c) Applies to:
   - Slope values in multiple choice options
   - Slopes in equation options (parallel/perpendicular questions)
   - Intercepts and rate of change values when applicable
   - Distractors also use fraction-only format
d) Special cases handled:
   - Integers: Display as whole number (e.g., "2", not "2/1")
   - Zero: Display as "0"
   - Undefined: Display as "undefined" (no fraction, no decimal)
   - Very complex fractions: May use fraction approximation or decimal fallback if denominator too large
e) Formatting consistent across all modes (Practice, Challenge, Session)
f) Answer validation compares numeric values, parsing fraction strings to numbers
g) Fraction conversion uses tolerance-based approach with maximum denominator limit (e.g., 100) for readability

10.10 Practice Mode Code Rewrite
a) Complete rewrite of Practice mode handlers from scratch
b) Improved code structure and organization
c) Modular utility functions for common operations
d) Guaranteed multiple choice display functionality
   - Uses `setProperty('display', 'block', 'important')` consistently
   - Centralized display logic in utility functions
   - Comprehensive element validation
e) Better error handling and user feedback
f) Consistent patterns across all problem types
g) Enhanced debugging and logging
h) All existing functionality preserved
i) Improved maintainability and code quality

10.11 Additional Problem Types
a) Five new problem types added (expanding from 4 to 9 total):
   - Finding intercepts (from graphs and equations)
   - Rate of change (from tables)
   - Identifying linear functions (from tables)
   - Converting to standard form
b) Interactive graph rendering system for intercept problems
   - Canvas or SVG-based graph display
   - Visual highlighting of intercepts
   - Interactive zoom/pan capabilities
c) Table display system for rate of change and linear function problems
   - Visual table rendering
   - Clear X and Y column display
d) All new problem types use multiple choice format
e) Consistent with existing problem type patterns and UI
f) Integrated into all game modes (Practice, Challenge, Session)
g) Hint system support for all new types

10.12 Vertical Navigation Bar
a) Convert horizontal tab navigation to vertical sidebar
b) Left sidebar navigation with fixed width (220-250px)
c) Vertical tab buttons with left border active indicator
d) Maintains current grid layout structure
e) Responsive design:
   - Desktop: Vertical sidebar visible
   - Tablet/Mobile: Collapsible dropdown menu
   - Hamburger menu icon for mobile
   - Dropdown closes when tab is selected
f) All 10 problem type tabs accessible in sidebar
g) Smooth transitions and hover effects maintained

10.13 Study Guide Aligned Slope-Intercept and Point-Slope Drills
a) Enhanced slope-intercept drills (Section 4.9):
   - From slope and y-intercept: Build y = mx + b from given m and b
   - From slope and one point: Convert point-slope to slope-intercept form
   - Graph from slope-intercept form: Match equation to graph or graph by clicking points
b) Point-slope form drills (Section 4.10):
   - Build point-slope form from slope and point: y - y1 = m(x - x1)
   - Graph from point-slope form: Convert and graph, with multiple choice graph options
c) Two-point form to slope-intercept (Section 4.11):
   - Convert two points to slope-intercept form
   - Calculate slope and intercept from two points
d) Parallel/Perpendicular with graph labeling (Section 4.12):
   - Enhanced parallel and perpendicular problems with graph display
   - Multiple choice includes both equation and graph thumbnail
   - Line labeling ("Base line", "New line") on graphs
e) Absolute value line graphs (Section 4.13):
   - New problem type: y = a|bx + c| + d
   - Three question variants:
     - Which graph matches equation (4 graph options)
     - What is the vertex (4 coordinate options)
     - Is graph opening up or down (4 textual options)
   - V-shaped graph rendering
f) Point-slope to slope-intercept conversion with signed-number practice (Section 4.14):
   - Advanced conversion handling extra constant terms
   - Step-by-step hints showing conversion process
   - Signed-number micro-practice integrated into hints
   - "Practice this step" button in hint panels for relevant problems
   - Micro-drill mode for signed-number operations (integers and fractions)
g) All features use:
   - Multiple choice format (A, B, C, D)
   - Fraction-only format for numeric answers
   - Canvas-based graph rendering (separate from intercept graph component)
   - Integration with existing hint system
   - Support for Practice, Challenge, and Session modes
h) Graph component enhancements:
   - Multiple lines on same graph
   - Graph thumbnails for multiple choice options
   - Line labeling and point highlighting
   - V-shaped absolute value graphs
   - Interactive point clicking for graphing variant
i) Hint system enhancements:
   - Step-by-step breakdown hints
   - "Show steps" mode for conversions
   - "Practice this step" overlay for signed-number practice
   - Integration with existing hint penalties and limits

