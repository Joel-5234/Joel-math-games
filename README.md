# St. Benedict's Prep - 8th Grade Math

A browser-based educational game built with HTML, CSS, and JavaScript to help students practice line equations and relationships.

## 🎯 Overview

This application helps students practice four types of line problems:
1. **Slope and line description** through two points
2. **Relationship between two equations** (parallel, perpendicular, or neither)
3. **Parallel line** through a point
4. **Perpendicular line** through a point

The app features gamification with timers, streaks, achievements, and local progress tracking.

## 🚀 Quick Start

### No Installation Required!

1. Open `index.html` in a web browser
2. Start practicing immediately
3. All progress is saved locally in your browser

### Development

```bash
# Check project status
./scripts/check-status

# Start development (opens in browser)
./scripts/start-dev

# Build for production
./scripts/build
```

## 📁 Project Structure

```
.
├── docs/              # Documentation
│   ├── prd.md        # Product requirements document
│   ├── ideas.md      # Project idea
│   ├── readme.md     # Detailed documentation
│   ├── tasks/         # Task tracking by milestone
│   └── issues/        # Issue tracking
├── dist/             # Production build files
├── logs/              # Application logs
├── scripts/           # Utility scripts
├── tests/             # Test files
│   ├── ui/           # UI tests (Playwright)
│   └── api/          # API tests
├── data/              # Data files
├── ref/               # Reference materials
├── config.json        # Application configuration
└── index.html         # Main application file
```

## 🎮 Features

- **Ten Problem Types**: Comprehensive practice for line equations
  - Slope and line description (with variants: two points, m and b, m and point)
  - Relationship between two equations
  - Parallel line through a point
  - Perpendicular line through a point
  - Finding intercepts
  - Rate of change
  - Identifying linear functions
  - Converting to standard form
  - Point-slope form drills
  - Absolute value line graphs
- **Practice Mode**: Timed practice with scoring
- **Challenge Mode**: Set-length challenges with dual timer system
  - **Total Timer**: Tracks overall challenge duration
  - **Question Timer**: Tracks time per individual question
  - **Time Statistics**: View detailed time breakdown on completion
  - **Speed Achievements**: Earn achievements for fast performance
- **Session Mode**: Extended practice sessions
- **Achievements**: Unlock achievements as you progress
  - Traditional achievements (correct answers, streaks, etc.)
  - Speed-based achievements (Lightning Fast, Speed Demon, Marathon Master, Efficiency Expert)
- **Hint System**: Helpful hints with step-by-step guidance, formulas, and concepts
- **Enhanced Feedback Effects (Milestone 18)**: Progressive celebration system
  - 50% progress: Mild effects (floating points, success badge, progress pulse, subtle particles)
  - 85% progress: Medium effects (emoji rain, streak fire, confetti trails, screen bounce)
  - 100% complete: High intensity (celebration modal, particle explosion, confetti, fireworks)
  - Random selection keeps gameplay fresh and exciting
- **Local Storage**: All progress saved in your browser
  - Game state (score, streak, achievements, stats)
  - Personal bests (fastest times, best averages)

## 📚 Documentation

- See `docs/prd.md` for full product requirements
- See `docs/tasks/` for development milestones
- See `docs/readme.md` for detailed usage

## 🛠️ Tech Stack

- **HTML5**: Structure
- **CSS3**: Styling
- **Vanilla JavaScript (ES6+)**: Logic and interactivity
- **localStorage**: Data persistence

## 🧪 Testing

UI tests are written with Playwright. Run tests from the `tests/ui/` directory.

## 🚀 Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions.

### Live Site
The application is available at: `https://joel-5234.github.io/Joel-math-games/`

(Update this URL once deployment is complete and verified)

### Deployment Process
- **Automatic**: Pushes to `main` branch trigger automatic deployment
- **Manual**: Can be triggered from the Actions tab
- **Build**: Uses `./scripts/build` to prepare production files
- **Deploy**: Files from `dist/` are deployed to GitHub Pages

See `docs/deployment.md` for detailed deployment instructions.

## 🔗 Repository

GitHub: [https://github.com/Joel-5234/Joel-math-games.git](https://github.com/Joel-5234/Joel-math-games.git)

## 📝 License

This project is for educational purposes.

