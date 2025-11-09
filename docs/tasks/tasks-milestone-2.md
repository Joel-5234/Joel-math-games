# Milestone 2: Gamification - Practice Mode

## Goal
Add scoring, timer, streaks, and basic achievements to make practice engaging.

## Tasks

### 2.1 Game State Management
- [x] Create game state object (score, streakCurrent, streakBest, totalQuestions, correctQuestions)
- [x] Implement localStorage persistence for game state
- [x] Load game state on app initialization
- [x] Update game state after each submission

### 2.2 Timer System
- [x] Implement per-question timer (stopwatch)
- [x] Start timer on "Start" button click or first input
- [x] Stop timer on answer submission
- [x] Display elapsed time in UI
- [x] Use setInterval for timer updates

### 2.3 Scoring System
- [x] Award base points for correct answers
- [x] Break streak on incorrect answers
- [x] Update total score
- [x] Display score, current streak, and best streak in header

### 2.4 Basic Achievements
- [x] Create achievement data structure
- [x] Implement "First Steps" achievement (first correct answer)
- [x] Implement "Slope Starter" achievement (5 correct slope questions)
- [x] Implement "Speed Runner" achievement (answer in under 10 seconds)
- [x] Create achievement evaluation function
- [x] Show achievement unlock notification (modal/toast)
- [x] Persist achievements to localStorage

### 2.5 Achievement Display
- [x] Create achievements panel/section
- [x] Display unlocked achievements
- [x] Show achievement name and description
- [x] Show unlock date

### 2.6 UI Updates
- [x] Add score display to header
- [x] Add streak display to header
- [x] Add timer display
- [x] Color-code results (green for correct, red for errors)

## Acceptance Criteria
- [x] Timer tracks time per question accurately
- [x] Scoring system works correctly
- [x] Streaks are tracked and displayed
- [x] Three basic achievements unlock correctly
- [x] All data persists in localStorage
