Product Requirements Document
Parallel & Perpendicular Lines Web Trainer
	1.	Product overview
Parallel & Perpendicular Lines Web Trainer is a browser-based app built with HTML, CSS, and JavaScript.
It helps students practice four types of line problems and turns practice into a timed, achievement-based game.
The app runs fully client-side and stores progress locally in the browser.
	2.	Objectives
a) Help students answer four core homework question types on lines:
	1.	Slope and line description through two points
	2.	Relationship between two equations
	3.	Parallel line through a point
	4.	Perpendicular line through a point

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
Behavior
• Parse both points
• Validate numeric inputs and non-identical points
• Compute slope, then classify as rising, falling, horizontal, or vertical
Output
• Show slope as a rounded number
• Show classification text
• Mark answer status for gamification (correct vs error due to bad input)

4.2 Relationship between two lines
Input
• Two text fields for Equation 1 and Equation 2
• Supported formats:
	•	y = mx + b
	•	Ax + By = C
	•	x = c
	•	y = c
Behavior
• Parse each equation into normalized form
	•	Vertical: kind = vertical, x0 = c
	•	Non vertical: kind = slope, m, b
• Determine relationship: parallel, perpendicular, or neither
Output
• Display normalized form for each line
• Display relationship result

4.3 Parallel line through a point
Input
• One text field for base equation
• One text field for point in format (x,y)
Behavior
• Parse equation to get slope or vertical type
• Compute line parallel to base that passes through the point
	•	If base is vertical, result is x = x0 for the given x
	•	If base is non vertical, reuse slope and compute b from the point
Output
• Display final equation in slope intercept form when possible
• For vertical, display x = c

4.4 Perpendicular line through a point
Input
• One text field for base equation
• One text field for point in format (x,y)
Behavior
• Parse equation
• Compute perpendicular line
	•	If base is vertical, result is horizontal y = y0
	•	If base is horizontal, result is vertical x = x0
	•	Otherwise slope is negative reciprocal and b computed from the point
Output
• Display final equation in slope intercept form when possible
• For vertical, display x = c

	5.	Gamification features

5.1 Game modes
a) Practice mode
• No strict time limit
• Timer works as a stopwatch to track time per question
b) Timed challenge mode
• Fixed countdown per question, for example 60 seconds
• Bonus points for finishing early
c) Session mode
• Set a session length, for example 10 minutes
• Student tries to solve as many questions as possible

5.2 Timer requirements
a) Per question timer
• Start when the user clicks "Start" or when they first type
• Stop on answer submission
• Show elapsed time in seconds
b) Countdown timer for challenge mode
• Start at configured duration
• Visually warn at last 10 seconds
• If timer reaches zero, mark question as timed out and show the correct solution
c) Session timer
• Track total active time in the current session
• Reset when the user clicks "New session"

5.3 Scoring system
a) Each correct answer grants points
• Base score per correct answer
• Time bonus for faster completion in challenge mode
b) Incorrect answer reduces score slightly or breaks streak
c) Show total score, current streak, and best streak in a header or sidebar panel

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
b) Main content
• Tabbed or segmented controls for the four question types
• Input fields and action buttons per tab
• Result panel with text feedback
c) Right or bottom panel
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

