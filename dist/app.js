// Application Configuration
let config = {
    baseScore: 10,
    timeBonusMultiplier: 0.5,
    challengeModeTimeLimit: 60,
    sessionModeDuration: 600
};

// Load config from config.json if available
fetch('config.json')
    .then(response => response.json())
    .then(data => {
        if (data.game) {
            config = { ...config, ...data.game };
        }
    })
    .catch(() => {
        console.log('Using default config');
    });

// Game State
let gameState = {
    score: 0,
    streakCurrent: 0,
    streakBest: 0,
    totalQuestions: 0,
    correctQuestions: 0,
    achievementsUnlocked: [],
    mode: 'practice',
    questionStartTime: null,
    questionTimer: null,
    sessionStartTime: null,
    sessionTimer: null,
    challengeCountdown: null,
    questionAnswered: false, // Track if current question has been answered
    stats: {
        slope: { correct: 0, total: 0, times: [] },
        relationship: { correct: 0, total: 0, times: [] },
        parallel: { correct: 0, total: 0, times: [] },
        perpendicular: { correct: 0, total: 0, times: [] }
    }
};

// Hint Content Definitions
const hints = {
    slope: {
        steps: [
            "1. Identify the two points from your input: (x₁, y₁) and (x₂, y₂)",
            "2. Use the slope formula: m = (y₂ - y₁) / (x₂ - x₁)",
            "3. Calculate the difference in y-coordinates (rise)",
            "4. Calculate the difference in x-coordinates (run)",
            "5. Divide rise by run to get the slope",
            "6. Classify the line based on the slope value"
        ],
        formula: "Slope Formula: m = (y₂ - y₁) / (x₂ - x₁)\n\nWhere:\n• m = slope\n• (x₁, y₁) = first point\n• (x₂, y₂) = second point",
        concepts: [
            "Rising line: Slope is positive (m > 0). The line goes up from left to right.",
            "Falling line: Slope is negative (m < 0). The line goes down from left to right.",
            "Horizontal line: Slope is zero (m = 0). The line is flat, parallel to x-axis.",
            "Vertical line: Slope is undefined (x₁ = x₂). The line is parallel to y-axis."
        ]
    },
    relationship: {
        steps: [
            "1. Convert both equations to slope-intercept form (y = mx + b) if possible",
            "2. Identify the slope (m) of each line",
            "3. Compare the slopes to determine the relationship",
            "4. Check if lines are identical (same slope AND same y-intercept)",
            "5. For vertical/horizontal lines, use special rules"
        ],
        formula: "Parallel Lines: m₁ = m₂ (same slope)\n\nPerpendicular Lines: m₁ × m₂ = -1\n(Product of slopes equals -1)\n\nSpecial Cases:\n• Vertical ⟂ Horizontal\n• Two vertical lines are parallel",
        concepts: [
            "Parallel lines: Have the same slope but different y-intercepts. They never intersect.",
            "Perpendicular lines: Have slopes that are negative reciprocals. They intersect at a 90° angle.",
            "Neither: Lines that are not parallel or perpendicular. They intersect at some angle other than 90°.",
            "Same line: Identical equations represent the same line (infinite intersections)."
        ]
    },
    parallel: {
        steps: [
            "1. Identify the slope (m) of the base line",
            "2. Remember: parallel lines have the SAME slope",
            "3. Use the given point (x₀, y₀) to find the y-intercept (b)",
            "4. Substitute into y = mx + b: y₀ = m × x₀ + b",
            "5. Solve for b: b = y₀ - m × x₀",
            "6. Write the final equation: y = mx + b",
            "7. Special case: If base is vertical (x = c), result is x = x₀"
        ],
        formula: "Parallel Line Formula:\n\nGiven: y = mx + b (base line)\nPoint: (x₀, y₀)\n\nStep 1: Use same slope m\nStep 2: Find b: b = y₀ - m × x₀\nStep 3: Result: y = mx + b",
        concepts: [
            "Parallel lines always have the same slope. They never meet, no matter how far extended.",
            "To find a parallel line through a point, keep the slope the same and find the new y-intercept.",
            "If the base line is vertical (x = constant), the parallel line is also vertical at the x-coordinate of the given point.",
            "The y-intercept changes, but the slope stays identical to the base line."
        ]
    },
    perpendicular: {
        steps: [
            "1. Identify the slope (m) of the base line",
            "2. Calculate the negative reciprocal: m_perp = -1/m",
            "3. Use the given point (x₀, y₀) to find the y-intercept (b)",
            "4. Substitute into y = m_perp × x + b: y₀ = m_perp × x₀ + b",
            "5. Solve for b: b = y₀ - m_perp × x₀",
            "6. Write the final equation: y = m_perp × x + b",
            "7. Special cases: Vertical ⟷ Horizontal"
        ],
        formula: "Perpendicular Line Formula:\n\nGiven: y = mx + b (base line)\nPoint: (x₀, y₀)\n\nStep 1: Find negative reciprocal: m_perp = -1/m\nStep 2: Find b: b = y₀ - m_perp × x₀\nStep 3: Result: y = m_perp × x + b\n\nSpecial Cases:\n• Vertical line (x = c) ⟷ Horizontal line (y = y₀)\n• Horizontal line (y = c) ⟷ Vertical line (x = x₀)",
        concepts: [
            "Perpendicular lines intersect at a 90-degree angle. Their slopes are negative reciprocals.",
            "Negative reciprocal: Flip the fraction and change the sign. Example: 2/3 becomes -3/2.",
            "If the base line is vertical, the perpendicular line is horizontal (and vice versa).",
            "The product of slopes of perpendicular lines always equals -1: m₁ × m₂ = -1."
        ]
    }
};

// Achievement Definitions
const achievements = [
    { id: 'firstSteps', name: 'First Steps', description: 'Get your first correct answer', condition: (state) => state.correctQuestions >= 1 },
    { id: 'slopeStarter', name: 'Slope Starter', description: 'Answer 5 slope questions correctly', condition: (state) => state.stats.slope.correct >= 5 },
    { id: 'slopeMaster', name: 'Slope Master', description: 'Answer 20 slope questions correctly with no mistakes', condition: (state) => state.stats.slope.correct >= 20 && state.stats.slope.total === state.stats.slope.correct },
    { id: 'parallelPro', name: 'Parallel Pro', description: 'Answer 10 relationship questions correctly', condition: (state) => state.stats.relationship.correct >= 10 },
    { id: 'perpendicularPro', name: 'Perpendicular Pro', description: 'Answer 10 perpendicular questions correctly', condition: (state) => state.stats.perpendicular.correct >= 10 },
    { id: 'speedRunner', name: 'Speed Runner', description: 'Answer any question correctly in under 10 seconds', condition: () => false }, // Checked per question
    { id: 'focus10', name: 'Focus 10', description: 'Answer 10 questions correctly in a row in one session', condition: (state) => state.streakCurrent >= 10 },
    { id: 'homeworkHero', name: 'Homework Hero', description: 'Score 100 points in one session', condition: (state) => state.score >= 100 }
];

// Utility Functions
function parsePoint(pointStr) {
    const match = pointStr.trim().match(/\((-?\d+\.?\d*),\s*(-?\d+\.?\d*)\)/);
    if (!match) throw new Error('Invalid point format. Use (x,y)');
    return { x: parseFloat(match[1]), y: parseFloat(match[2]) };
}

function parseEquation(eqStr) {
    const eq = eqStr.trim().replace(/\s+/g, '');
    
    // Vertical line: x = c
    const verticalMatch = eq.match(/^x\s*=\s*(-?\d+\.?\d*)$/);
    if (verticalMatch) {
        return { kind: 'vertical', x0: parseFloat(verticalMatch[1]) };
    }
    
    // Horizontal line: y = c
    const horizontalMatch = eq.match(/^y\s*=\s*(-?\d+\.?\d*)$/);
    if (horizontalMatch) {
        return { kind: 'slope', m: 0, b: parseFloat(horizontalMatch[1]) };
    }
    
    // Slope-intercept: y = mx + b
    const slopeInterceptMatch = eq.match(/^y\s*=\s*(-?\d+\.?\d*)x\s*([+-]?\d+\.?\d*)$/);
    if (slopeInterceptMatch) {
        return {
            kind: 'slope',
            m: parseFloat(slopeInterceptMatch[1]),
            b: parseFloat(slopeInterceptMatch[2] || 0)
        };
    }
    
    // Standard form: Ax + By = C
    const standardMatch = eq.match(/^(-?\d+\.?\d*)x\s*([+-]\d+\.?\d*)y\s*=\s*(-?\d+\.?\d*)$/);
    if (standardMatch) {
        const A = parseFloat(standardMatch[1]);
        const B = parseFloat(standardMatch[2]);
        const C = parseFloat(standardMatch[3]);
        
        if (B === 0) {
            return { kind: 'vertical', x0: C / A };
        }
        
        return {
            kind: 'slope',
            m: -A / B,
            b: C / B
        };
    }
    
    throw new Error('Invalid equation format. Supported: y=mx+b, Ax+By=C, x=c, y=c');
}

function roundToDecimal(num, decimals = 2) {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// Math Logic Functions
function calculateSlope(p1, p2) {
    if (p1.x === p2.x && p1.y === p2.y) {
        throw new Error('Points cannot be identical');
    }
    
    if (p1.x === p2.x) {
        return { slope: Infinity, classification: 'vertical' };
    }
    
    const slope = (p2.y - p1.y) / (p2.x - p1.x);
    let classification;
    
    if (slope > 0) classification = 'rising';
    else if (slope < 0) classification = 'falling';
    else classification = 'horizontal';
    
    return { slope: roundToDecimal(slope), classification };
}

function determineRelationship(line1, line2) {
    // Both vertical
    if (line1.kind === 'vertical' && line2.kind === 'vertical') {
        return line1.x0 === line2.x0 ? 'same' : 'parallel';
    }
    
    // One vertical, one horizontal
    if ((line1.kind === 'vertical' && line2.kind === 'slope' && line2.m === 0) ||
        (line2.kind === 'vertical' && line1.kind === 'slope' && line1.m === 0)) {
        return 'perpendicular';
    }
    
    // Both have slopes
    if (line1.kind === 'slope' && line2.kind === 'slope') {
        // Same line check (same slope and intercept)
        if (line1.m === line2.m && line1.b === line2.b) {
            return 'same';
        }
        
        // Parallel
        if (line1.m === line2.m) {
            return 'parallel';
        }
        
        // Perpendicular
        if (Math.abs(line1.m * line2.m + 1) < 0.001) {
            return 'perpendicular';
        }
    }
    
    return 'neither';
}

function findParallelLine(baseLine, point) {
    if (baseLine.kind === 'vertical') {
        return { kind: 'vertical', x0: point.x };
    }
    
    // Use same slope, find b from point
    const b = point.y - baseLine.m * point.x;
    return { kind: 'slope', m: baseLine.m, b: roundToDecimal(b) };
}

function findPerpendicularLine(baseLine, point) {
    if (baseLine.kind === 'vertical') {
        return { kind: 'slope', m: 0, b: point.y };
    }
    
    if (baseLine.kind === 'slope' && baseLine.m === 0) {
        return { kind: 'vertical', x0: point.x };
    }
    
    // Negative reciprocal slope
    const m = -1 / baseLine.m;
    const b = point.y - m * point.x;
    return { kind: 'slope', m: roundToDecimal(m), b: roundToDecimal(b) };
}

function formatEquation(line) {
    if (line.kind === 'vertical') {
        return `x = ${line.x0}`;
    }
    
    let equation = 'y = ';
    if (line.m === 0) {
        equation += line.b;
    } else if (line.m === 1) {
        equation += `x`;
    } else if (line.m === -1) {
        equation += `-x`;
    } else {
        equation += `${line.m}x`;
    }
    
    if (line.b !== 0) {
        equation += line.b > 0 ? ` + ${line.b}` : ` ${line.b}`;
    }
    
    return equation;
}

// UI Update Functions
function updateUI() {
    document.getElementById('scoreDisplay').textContent = gameState.score;
    document.getElementById('streakDisplay').textContent = gameState.streakCurrent;
    document.getElementById('bestStreakDisplay').textContent = gameState.streakBest;
    document.getElementById('totalQuestions').textContent = gameState.totalQuestions;
    document.getElementById('correctQuestions').textContent = gameState.correctQuestions;
    
    const accuracy = gameState.totalQuestions > 0 
        ? Math.round((gameState.correctQuestions / gameState.totalQuestions) * 100) 
        : 0;
    document.getElementById('accuracy').textContent = accuracy + '%';
    
    updateAchievementsDisplay();
}

function updateTimer() {
    if (!gameState.questionStartTime) return;
    
    const elapsed = Math.floor((Date.now() - gameState.questionStartTime) / 1000);
    const timerDisplay = document.getElementById('timerDisplay');
    
    if (gameState.mode === 'challenge' && gameState.challengeCountdown !== null) {
        const remaining = gameState.challengeCountdown - elapsed;
        if (remaining <= 0) {
            timerDisplay.textContent = '0s';
            timerDisplay.classList.add('timer-warning');
            handleTimeout();
            return;
        }
        if (remaining <= 10) {
            timerDisplay.classList.add('timer-warning');
        } else {
            timerDisplay.classList.remove('timer-warning');
        }
        timerDisplay.textContent = remaining + 's';
    } else {
        timerDisplay.textContent = elapsed + 's';
        timerDisplay.classList.remove('timer-warning');
    }
}

function handleTimeout() {
    stopQuestionTimer();
    showResult('Time\'s up! The question timed out.', 'error');
    updateStats('', false);
}

function startQuestionTimer() {
    if (gameState.questionTimer) return;
    
    // Reset question answered flag when starting new question
    gameState.questionAnswered = false;
    gameState.questionStartTime = Date.now();
    if (gameState.mode === 'challenge') {
        gameState.challengeCountdown = config.challengeModeTimeLimit;
    }
    
    gameState.questionTimer = setInterval(updateTimer, 100);
}

function stopQuestionTimer() {
    if (gameState.questionTimer) {
        clearInterval(gameState.questionTimer);
        gameState.questionTimer = null;
    }
}

function startSessionTimer() {
    if (gameState.mode === 'session' && !gameState.sessionTimer) {
        gameState.sessionStartTime = Date.now();
        gameState.sessionTimer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - gameState.sessionStartTime) / 1000);
            if (elapsed >= config.sessionModeDuration) {
                stopSessionTimer();
                alert('Session complete! Great work!');
            }
        }, 1000);
    }
}

function stopSessionTimer() {
    if (gameState.sessionTimer) {
        clearInterval(gameState.sessionTimer);
        gameState.sessionTimer = null;
    }
}

function showResult(message, type = 'neutral') {
    const activePanel = document.querySelector('.problem-panel.active');
    const resultArea = activePanel.querySelector('.result-area');
    resultArea.textContent = message;
    resultArea.className = `result-area ${type}`;
}

function updateStats(problemType, isCorrect) {
    if (problemType) {
        gameState.stats[problemType].total++;
        if (isCorrect) {
            gameState.stats[problemType].correct++;
            const elapsed = gameState.questionStartTime 
                ? Math.floor((Date.now() - gameState.questionStartTime) / 1000) 
                : 0;
            gameState.stats[problemType].times.push(elapsed);
            
            // Check for Speed Runner achievement
            if (elapsed < 10 && !gameState.achievementsUnlocked.includes('speedRunner')) {
                unlockAchievement('speedRunner');
            }
        }
    }
    
    gameState.totalQuestions++;
    if (isCorrect) {
        gameState.correctQuestions++;
        gameState.streakCurrent++;
        if (gameState.streakCurrent > gameState.streakBest) {
            gameState.streakBest = gameState.streakCurrent;
        }
        
        // Calculate score
        let points = config.baseScore;
        if (gameState.mode === 'challenge' && gameState.challengeCountdown !== null) {
            const timeBonus = Math.max(0, gameState.challengeCountdown - Math.floor((Date.now() - gameState.questionStartTime) / 1000));
            points += Math.floor(timeBonus * config.timeBonusMultiplier);
        }
        gameState.score += points;
    } else {
        gameState.streakCurrent = 0;
    }
    
    stopQuestionTimer();
    updateUI();
    checkAchievements();
    saveGameState();
}

// Achievement Functions
function checkAchievements() {
    achievements.forEach(achievement => {
        if (!gameState.achievementsUnlocked.includes(achievement.id)) {
            if (achievement.condition(gameState)) {
                unlockAchievement(achievement.id);
            }
        }
    });
}

function unlockAchievement(achievementId) {
    if (gameState.achievementsUnlocked.includes(achievementId)) return;
    
    gameState.achievementsUnlocked.push(achievementId);
    const achievement = achievements.find(a => a.id === achievementId);
    
    if (achievement) {
        showAchievementToast(achievement.name, achievement.description);
        updateUI();
        saveGameState();
    }
}

function showAchievementToast(name, description) {
    const toast = document.getElementById('achievementToast');
    document.getElementById('toastAchievementName').textContent = name;
    document.getElementById('toastAchievementDesc').textContent = description;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

function updateAchievementsDisplay() {
    const list = document.getElementById('achievementsList');
    list.innerHTML = '';
    
    const recentAchievements = gameState.achievementsUnlocked
        .slice(-3)
        .reverse()
        .map(id => achievements.find(a => a.id === id))
        .filter(a => a);
    
    recentAchievements.forEach(achievement => {
        const item = document.createElement('div');
        item.className = 'achievement-item';
        item.innerHTML = `
            <h4>${achievement.name}</h4>
            <p>${achievement.description}</p>
        `;
        list.appendChild(item);
    });
}

function showAllAchievements() {
    const container = document.getElementById('allAchievements');
    container.innerHTML = '';
    
    achievements.forEach(achievement => {
        const isUnlocked = gameState.achievementsUnlocked.includes(achievement.id);
        const item = document.createElement('div');
        item.className = `achievement-item ${isUnlocked ? '' : 'locked'}`;
        item.innerHTML = `
            <h4>${isUnlocked ? '✓' : '🔒'} ${achievement.name}</h4>
            <p>${achievement.description}</p>
            ${isUnlocked ? '<p style="font-size: 0.7rem; color: #999;">Unlocked</p>' : ''}
        `;
        container.appendChild(item);
    });
    
    document.getElementById('achievementModal').classList.add('active');
}

// Hint Functions
function showHints(hintType) {
    const hintData = hints[hintType];
    if (!hintData) return;
    
    const content = document.getElementById('hintContent');
    let html = '';
    
    // Step-by-step guidance
    html += '<h4>📝 Step-by-Step Guide</h4>';
    html += '<ul>';
    hintData.steps.forEach(step => {
        html += `<li>${step}</li>`;
    });
    html += '</ul>';
    
    // Formula
    html += '<h4>📐 Formula</h4>';
    html += `<div class="formula">${hintData.formula.replace(/\n/g, '<br>')}</div>`;
    
    // Concepts
    html += '<h4>💡 Key Concepts</h4>';
    html += '<div class="concept">';
    hintData.concepts.forEach(concept => {
        html += `<p>${concept}</p>`;
    });
    html += '</div>';
    
    content.innerHTML = html;
    document.getElementById('hintTooltip').classList.add('active');
}

function hideHints() {
    document.getElementById('hintTooltip').classList.remove('active');
}

// Problem Type Handlers
function handleSlopeProblem() {
    // Prevent spam clicking - check if question already answered
    if (gameState.questionAnswered) {
        return;
    }
    
    const input = document.getElementById('slopeInput').value.trim();
    
    try {
        // Match two points in the format (x,y), (x,y) or (x,y),(x,y)
        // Split on '),' pattern which separates the two points
        const pointSeparator = /\)\s*,\s*\(/;
        const parts = input.split(pointSeparator);
        
        if (parts.length !== 2) {
            throw new Error('Please enter two points in the format: (x1,y1), (x2,y2)');
        }
        
        // Add back the closing parenthesis to first part and opening to second part
        const p1Str = parts[0] + ')';
        const p2Str = '(' + parts[1];
        
        const p1 = parsePoint(p1Str);
        const p2 = parsePoint(p2Str);
        const result = calculateSlope(p1, p2);
        
        let message;
        if (result.slope === Infinity) {
            message = `Slope: Undefined (Vertical Line)\nClassification: ${result.classification}`;
        } else {
            message = `Slope: ${result.slope}\nClassification: ${result.classification}`;
        }
        
        showResult(message, 'success');
        gameState.questionAnswered = true; // Mark question as answered
        updateStats('slope', true);
    } catch (error) {
        showResult('Error: ' + error.message, 'error');
        gameState.questionAnswered = true; // Mark question as answered even on error
        updateStats('slope', false);
    }
}

function handleRelationshipProblem() {
    // Prevent spam clicking - check if question already answered
    if (gameState.questionAnswered) {
        return;
    }
    
    const eq1 = document.getElementById('equation1Input').value.trim();
    const eq2 = document.getElementById('equation2Input').value.trim();
    
    try {
        const line1 = parseEquation(eq1);
        const line2 = parseEquation(eq2);
        const relationship = determineRelationship(line1, line2);
        
        const line1Formatted = formatEquation(line1);
        const line2Formatted = formatEquation(line2);
        
        let message = `Equation 1: ${line1Formatted}\n`;
        message += `Equation 2: ${line2Formatted}\n`;
        message += `Relationship: ${relationship.charAt(0).toUpperCase() + relationship.slice(1)}`;
        
        showResult(message, 'success');
        gameState.questionAnswered = true; // Mark question as answered
        updateStats('relationship', true);
    } catch (error) {
        showResult('Error: ' + error.message, 'error');
        gameState.questionAnswered = true; // Mark question as answered even on error
        updateStats('relationship', false);
    }
}

function handleParallelProblem() {
    // Prevent spam clicking - check if question already answered
    if (gameState.questionAnswered) {
        return;
    }
    
    const equation = document.getElementById('parallelEquationInput').value.trim();
    const pointStr = document.getElementById('parallelPointInput').value.trim();
    
    try {
        const baseLine = parseEquation(equation);
        const point = parsePoint(pointStr);
        const resultLine = findParallelLine(baseLine, point);
        const equationFormatted = formatEquation(resultLine);
        
        showResult(`Parallel line: ${equationFormatted}`, 'success');
        gameState.questionAnswered = true; // Mark question as answered
        updateStats('parallel', true);
    } catch (error) {
        showResult('Error: ' + error.message, 'error');
        gameState.questionAnswered = true; // Mark question as answered even on error
        updateStats('parallel', false);
    }
}

function handlePerpendicularProblem() {
    // Prevent spam clicking - check if question already answered
    if (gameState.questionAnswered) {
        return;
    }
    
    const equation = document.getElementById('perpendicularEquationInput').value.trim();
    const pointStr = document.getElementById('perpendicularPointInput').value.trim();
    
    try {
        const baseLine = parseEquation(equation);
        const point = parsePoint(pointStr);
        const resultLine = findPerpendicularLine(baseLine, point);
        const equationFormatted = formatEquation(resultLine);
        
        showResult(`Perpendicular line: ${equationFormatted}`, 'success');
        gameState.questionAnswered = true; // Mark question as answered
        updateStats('perpendicular', true);
    } catch (error) {
        showResult('Error: ' + error.message, 'error');
        gameState.questionAnswered = true; // Mark question as answered even on error
        updateStats('perpendicular', false);
    }
}

// LocalStorage Functions
function saveGameState() {
    const stateToSave = {
        score: gameState.score,
        streakBest: gameState.streakBest,
        achievementsUnlocked: gameState.achievementsUnlocked,
        stats: gameState.stats
    };
    localStorage.setItem('lineTrainerGameState', JSON.stringify(stateToSave));
}

function loadGameState() {
    const saved = localStorage.getItem('lineTrainerGameState');
    if (saved) {
        try {
            const state = JSON.parse(saved);
            gameState.score = state.score || 0;
            gameState.streakBest = state.streakBest || 0;
            gameState.achievementsUnlocked = state.achievementsUnlocked || [];
            if (state.stats) {
                gameState.stats = { ...gameState.stats, ...state.stats };
            }
        } catch (error) {
            console.error('Error loading game state:', error);
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadGameState();
    updateUI();
    
    // Tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;
            
            // Update active tab
            document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            
            // Update active panel
            document.querySelectorAll('.problem-panel').forEach(p => p.classList.remove('active'));
            document.getElementById(tab + '-panel').classList.add('active');
            
            // Clear results
            document.querySelectorAll('.result-area').forEach(r => {
                r.textContent = '';
                r.className = 'result-area';
            });
            
            // Reset question answered flag for new question
            gameState.questionAnswered = false;
            
            // Reset timer for new question
            stopQuestionTimer();
        });
    });
    
    // Mode selector
    document.getElementById('modeSelector').addEventListener('change', (e) => {
        gameState.mode = e.target.value;
        stopQuestionTimer();
        stopSessionTimer();
        
        if (gameState.mode === 'session') {
            startSessionTimer();
        }
        
        // Reset session score for new mode
        if (gameState.mode !== 'session') {
            gameState.score = 0;
            gameState.streakCurrent = 0;
            gameState.totalQuestions = 0;
            gameState.correctQuestions = 0;
        }
        
        updateUI();
    });
    
    // Problem type submit buttons
    document.getElementById('slopeSubmit').addEventListener('click', () => {
        startQuestionTimer();
        handleSlopeProblem();
    });
    
    document.getElementById('relationshipSubmit').addEventListener('click', () => {
        startQuestionTimer();
        handleRelationshipProblem();
    });
    
    document.getElementById('parallelSubmit').addEventListener('click', () => {
        startQuestionTimer();
        handleParallelProblem();
    });
    
    document.getElementById('perpendicularSubmit').addEventListener('click', () => {
        startQuestionTimer();
        handlePerpendicularProblem();
    });
    
    // Start timer on input and reset question answered flag when input changes
    document.querySelectorAll('.input-field').forEach(input => {
        input.addEventListener('focus', startQuestionTimer);
        input.addEventListener('input', () => {
            // Reset question answered flag when user changes input (new question)
            gameState.questionAnswered = false;
        });
    });
    
    // Achievement modal
    document.getElementById('viewAchievements').addEventListener('click', showAllAchievements);
    document.querySelector('.close-modal').addEventListener('click', () => {
        document.getElementById('achievementModal').classList.remove('active');
    });
    
    document.getElementById('achievementModal').addEventListener('click', (e) => {
        if (e.target.id === 'achievementModal') {
            document.getElementById('achievementModal').classList.remove('active');
        }
    });
    
    // Hint buttons
    document.querySelectorAll('.hint-button').forEach(button => {
        button.addEventListener('click', () => {
            const hintType = button.dataset.hint;
            showHints(hintType);
        });
    });
    
    // Close hint tooltip
    document.querySelector('.close-tooltip').addEventListener('click', hideHints);
    
    document.getElementById('hintTooltip').addEventListener('click', (e) => {
        if (e.target.id === 'hintTooltip') {
            hideHints();
        }
    });
    
    // Start session timer if in session mode
    if (gameState.mode === 'session') {
        startSessionTimer();
    }
});

