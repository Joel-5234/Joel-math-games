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
    challengeTimer: null, // Milestone 17: Separate challenge timer
    sessionStartTime: null,
    sessionTimer: null,
    challengeCountdown: null,
    questionAnswered: false, // Track if current question has been answered
    quickAnswersCount: 0, // Issue #020: Track answers under 10 seconds for Speed Runner
    challengesCompleted: 0, // Issue #020: Track total challenges completed
    stats: {
        slope: { correct: 0, total: 0, times: [] },
        relationship: { correct: 0, total: 0, times: [] },
        parallel: { correct: 0, total: 0, times: [] },
        perpendicular: { correct: 0, total: 0, times: [] },
        intercept: { correct: 0, total: 0, times: [] },
        rateOfChange: { correct: 0, total: 0, times: [] },
        linearFunction: { correct: 0, total: 0, times: [] },
        standardForm: { correct: 0, total: 0, times: [] },
        pointSlope: { correct: 0, total: 0, times: [] },
        absoluteValue: { correct: 0, total: 0, times: [] },
        // MILESTONE 19: Interactive Graphing Stats (Issue #032: Use hyphenated keys to match question types)
        'graph-slopeintercept': { correct: 0, total: 0, times: [] },
        'graph-pointslope': { correct: 0, total: 0, times: [] },
        'graph-parallel': { correct: 0, total: 0, times: [] },
        'graph-perpendicular': { correct: 0, total: 0, times: [] },
        'graph-absolutevalue': { correct: 0, total: 0, times: [] }
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
    },
    intercepts: {
        steps: [
            "1. For x-intercept: Set y = 0 in the equation and solve for x",
            "2. For y-intercept: Set x = 0 in the equation and solve for y",
            "3. Write intercepts as coordinate points: (x, 0) for x-intercept, (0, y) for y-intercept",
            "4. Vertical lines (x = c) have x-intercept at (c, 0) but no y-intercept",
            "5. Horizontal lines (y = c) have y-intercept at (0, c) but no x-intercept (unless c = 0)"
        ],
        formula: "X-Intercept: Set y = 0, solve for x → (x, 0)\n\nY-Intercept: Set x = 0, solve for y → (0, y)\n\nFor y = mx + b:\n• X-intercept: x = -b/m (when m ≠ 0)\n• Y-intercept: y = b\n\nFor Ax + By = C:\n• X-intercept: x = C/A (when A ≠ 0)\n• Y-intercept: y = C/B (when B ≠ 0)",
        concepts: [
            "The x-intercept is where the line crosses the x-axis (y = 0).",
            "The y-intercept is where the line crosses the y-axis (x = 0).",
            "A line can have at most one x-intercept and one y-intercept.",
            "Vertical lines have no y-intercept. Horizontal lines have no x-intercept (unless they pass through origin)."
        ]
    },
    rateofchange: {
        steps: [
            "1. Identify two consecutive points in the table: (x₁, y₁) and (x₂, y₂)",
            "2. Calculate the change in y: Δy = y₂ - y₁",
            "3. Calculate the change in x: Δx = x₂ - x₁",
            "4. Calculate rate of change: rate = Δy / Δx",
            "5. Repeat for each interval to find the greatest rate or decrease",
            "6. Compare all rates to find the maximum (or minimum for greatest decrease)"
        ],
        formula: "Rate of Change Formula:\n\nrate = (y₂ - y₁) / (x₂ - x₁)\n\nWhere:\n• Δy = change in y (vertical change)\n• Δx = change in x (horizontal change)\n• Rate represents how much y changes per unit change in x",
        concepts: [
            "Rate of change measures how one quantity changes relative to another.",
            "A positive rate means the quantity is increasing.",
            "A negative rate means the quantity is decreasing.",
            "The rate of change is similar to slope: it's the ratio of vertical change to horizontal change."
        ]
    },
    linearfunction: {
        steps: [
            "1. Check if the change in X is constant between consecutive points",
            "2. Check if the change in Y is constant between consecutive points",
            "3. Check if the ratio (change Y / change X) is constant",
            "4. If all changes are constant, the table represents a linear function",
            "5. If changes vary, it's not a linear function"
        ],
        formula: "Linear Function Test:\n\nFor a table to represent a linear function:\n• Change in X must be constant: x₂ - x₁ = x₃ - x₂ = ...\n• Change in Y must be constant: y₂ - y₁ = y₃ - y₂ = ...\n• OR ratio (Δy/Δx) must be constant\n\nIf these conditions are met, the relationship is linear.",
        concepts: [
            "A linear function has a constant rate of change (slope).",
            "In a linear function table, the change in X and change in Y are both constant.",
            "If the changes vary, the function is not linear (could be quadratic, exponential, etc.).",
            "The constant ratio Δy/Δx represents the slope of the linear function."
        ]
    },
    standardform: {
        steps: [
            "1. Start with the equation in any form (y = mx + b, point-slope, etc.)",
            "2. Move all terms to one side so the equation equals 0",
            "3. Rearrange to get Ax + By = C format",
            "4. Ensure A, B, and C are integers (multiply by common denominator if needed)",
            "5. Prefer A to be positive (multiply by -1 if A is negative)",
            "6. Simplify by dividing by the greatest common factor if possible"
        ],
        formula: "Standard Form: Ax + By = C\n\nConversion from y = mx + b:\n• y = mx + b\n• -mx + y = b\n• Multiply by -1 if needed: mx - y = -b\n• Result: Ax + By = C\n\nWhere A, B, C are integers and A ≥ 0",
        concepts: [
            "Standard form is Ax + By = C, where A, B, and C are integers.",
            "A should be positive (or zero). If A is negative, multiply the entire equation by -1.",
            "All coefficients should be integers. Multiply by denominators to eliminate fractions.",
            "Standard form makes it easy to find intercepts: x-intercept = C/A, y-intercept = C/B."
        ]
    },
    pointslope: {
        steps: [
            "1. Identify the slope (m) and a point (x₁, y₁)",
            "2. Use the point-slope form: y - y₁ = m(x - x₁)",
            "3. Pay attention to signs: if point is (3, 5), use y - 5, not y + 5",
            "4. If point is negative, use addition: for (-2, -3), use y + 3 = m(x + 2)",
            "5. To convert to slope-intercept: distribute m, then solve for y"
        ],
        formula: "Point-Slope Form: y - y₁ = m(x - x₁)\n\nWhere:\n• m = slope\n• (x₁, y₁) = point on the line\n\nConversion to Slope-Intercept:\n• y - y₁ = m(x - x₁)\n• y - y₁ = mx - mx₁\n• y = mx - mx₁ + y₁\n• y = mx + b (where b = y₁ - mx₁)",
        concepts: [
            "Point-slope form is useful when you know a point and the slope.",
            "The signs are important: y - y₁ means subtract the y-coordinate of the point.",
            "If the point has negative coordinates, the equation uses addition: y + |y₁| = m(x + |x₁|).",
            "You can convert point-slope to slope-intercept form by distributing and solving for y."
        ]
    },
    absolutevalue: {
        steps: [
            "1. Identify the form: y = a|bx + c| + d",
            "2. Find the vertex: solve bx + c = 0 for x",
            "3. Calculate vertex x: x = -c/b",
            "4. Calculate vertex y: substitute x into equation",
            "5. Determine direction: if a > 0, opens up; if a < 0, opens down",
            "6. The graph is V-shaped with the vertex as the turning point"
        ],
        formula: "Absolute Value Graph: y = a|bx + c| + d\n\nVertex:\n• x-coordinate: Solve bx + c = 0 → x = -c/b\n• y-coordinate: y = a|b(-c/b) + c| + d = d\n• Vertex: (-c/b, d)\n\nDirection:\n• If a > 0: Opens UP (V shape)\n• If a < 0: Opens DOWN (inverted V)",
        concepts: [
            "Absolute value graphs are V-shaped with a vertex (turning point).",
            "The vertex occurs where the expression inside the absolute value equals zero.",
            "The sign of 'a' determines if the V opens up (positive) or down (negative).",
            "The graph is symmetric about a vertical line through the vertex."
        ]
    },
    // MILESTONE 19: Interactive Graphing Hints
    'graph-slopeintercept': {
        steps: [
            "1. Find the y-intercept: Where does the line cross the y-axis? (x = 0)",
            "2. Use the slope to find another point: Rise over run from the y-intercept",
            "3. If slope is 2, go up 2 and right 1 from y-intercept",
            "4. If slope is -1/2, go down 1 and right 2 from y-intercept",
            "5. Select 2 points that you've calculated"
        ],
        formula: "Slope-Intercept Form: y = mx + b\n\nWhere:\n• m = slope\n• b = y-intercept\n\nTo graph:\n1. Plot (0, b) on y-axis\n2. Use slope m to find another point\n3. Connect the points",
        concepts: [
            "The y-intercept (b) is where the line crosses the y-axis at x = 0.",
            "The slope (m) tells you how to move from one point to another: rise/run.",
            "Positive slope: line goes up from left to right.",
            "Negative slope: line goes down from left to right."
        ]
    },
    'graph-pointslope': {
        steps: [
            "1. Identify the given point (x₁, y₁) from the equation",
            "2. This point MUST be one of your selected points",
            "3. Use the slope to find a second point from the given point",
            "4. Apply rise/run from the given point",
            "5. Select both the given point and the calculated point"
        ],
        formula: "Point-Slope Form: y - y₁ = m(x - x₁)\n\nWhere:\n• m = slope\n• (x₁, y₁) = given point\n\nTo graph:\n1. Plot the given point (x₁, y₁)\n2. Use slope m to find another point\n3. Connect the points",
        concepts: [
            "The given point (x₁, y₁) from the equation must be on your line.",
            "Use the slope to move from the given point: rise over run.",
            "Watch the signs: y - y₁ means the point is (x₁, y₁), not (x₁, -y₁)."
        ]
    },
    'graph-parallel': {
        steps: [
            "1. STEP 1: Graph the base line using its equation",
            "2. STEP 2: Graph a parallel line through the given point",
            "3. Parallel lines have the SAME slope",
            "4. Use the same slope from the base line",
            "5. Apply that slope starting from the given point"
        ],
        formula: "Parallel Lines:\n• Same slope: m₁ = m₂\n• Different y-intercepts: b₁ ≠ b₂\n\nBase line: y = mx + b₁\nParallel line through (x₀, y₀):\ny = mx + b₂ where b₂ = y₀ - mx₀",
        concepts: [
            "Parallel lines never intersect and have the same slope.",
            "To draw a parallel line, use the same slope as the base line.",
            "The new line must pass through the given point."
        ]
    },
    'graph-perpendicular': {
        steps: [
            "1. STEP 1: Graph the base line using its equation",
            "2. STEP 2: Graph a perpendicular line through the given point",
            "3. Perpendicular lines have NEGATIVE RECIPROCAL slopes",
            "4. If base slope is 2, perpendicular slope is -1/2",
            "5. If base slope is -3/4, perpendicular slope is 4/3"
        ],
        formula: "Perpendicular Lines:\n• Negative reciprocal slopes: m₁ × m₂ = -1\n• m₂ = -1/m₁\n\nBase line: y = m₁x + b₁\nPerpendicular line through (x₀, y₀):\ny = m₂x + b₂ where:\n• m₂ = -1/m₁\n• b₂ = y₀ - m₂x₀",
        concepts: [
            "Perpendicular lines intersect at 90° and have negative reciprocal slopes.",
            "To find the perpendicular slope: flip and negate the original slope.",
            "Example: slope 3/4 → perpendicular slope -4/3.",
            "The new line must pass through the given point."
        ]
    },
    'graph-absolutevalue': {
        steps: [
            "1. Find the vertex: Where the expression inside |...| equals zero",
            "2. The vertex is the tip of the V shape",
            "3. Select the vertex as one of your 3 points",
            "4. Choose one point on the LEFT side of the V",
            "5. Choose one point on the RIGHT side of the V"
        ],
        formula: "Absolute Value Graph: y = a|bx + c| + d\n\nVertex: (-c/b, d)\n\nTo graph:\n1. Plot the vertex\n2. If a > 0, V opens UP\n3. If a < 0, V opens DOWN\n4. Use slope |a| for both sides",
        concepts: [
            "Absolute value graphs are V-shaped with a vertex at the turning point.",
            "You need 3 points: vertex + one on each side of the V.",
            "The graph is symmetric about a vertical line through the vertex.",
            "If 'a' is negative, the V is upside down."
        ]
    }
};

// Achievement Definitions
const achievements = [
    // === GETTING STARTED ===
    { id: 'firstSteps', name: '👣 First Steps', description: 'Get your first correct answer', condition: (state) => state.correctQuestions >= 1 },
    { id: 'earlyBird', name: '🌅 Early Bird', description: 'Complete your first practice session', condition: (state) => state.correctQuestions >= 3 },
    
    // === PROBLEM TYPE MASTERY ===
    { id: 'slopeStarter', name: '📐 Slope Starter', description: 'Answer 5 slope questions correctly', condition: (state) => state.stats.slope.correct >= 5 },
    { id: 'slopeMaster', name: '🎯 Slope Master', description: 'Answer 20 slope questions correctly with no mistakes', condition: (state) => state.stats.slope.correct >= 20 && state.stats.slope.total === state.stats.slope.correct },
    { id: 'parallelPro', name: '⚖️ Parallel Pro', description: 'Answer 10 relationship questions correctly', condition: (state) => state.stats.relationship.correct >= 10 },
    { id: 'perpendicularPro', name: '⊥ Perpendicular Pro', description: 'Answer 10 perpendicular questions correctly', condition: (state) => state.stats.perpendicular.correct >= 10 },
    { id: 'interceptExplorer', name: '🎯 Intercept Explorer', description: 'Answer 10 intercept questions correctly', condition: (state) => state.stats.intercepts && state.stats.intercepts.correct >= 10 },
    { id: 'linearGenius', name: '📊 Linear Genius', description: 'Answer 10 linear function questions correctly', condition: (state) => state.stats.linearFunctions && state.stats.linearFunctions.correct >= 10 },
    { id: 'standardFormStar', name: '⭐ Standard Form Star', description: 'Answer 10 standard form questions correctly', condition: (state) => state.stats.standardForm && state.stats.standardForm.correct >= 10 },
    
    // === SPEED & TIMING ===
    { id: 'lightningFast', name: '⚡ Lightning Fast', description: 'Answer a question correctly in under 10 seconds', condition: () => false }, // Checked per question
    { id: 'speedRunner', name: '🏃 Speed Runner', description: 'Answer 5 questions correctly under 10 seconds each', condition: () => false }, // Issue #020 FIX: Changed from single to 5 quick answers
    { id: 'speedDemon', name: '🔥 Speed Demon', description: 'Complete a 10-question challenge in under 5 minutes', condition: () => false }, // Checked at challenge completion
    { id: 'sprintMaster', name: '💨 Sprint Master', description: 'Complete a challenge with average under 15 seconds per question', condition: () => false }, // Checked at challenge completion
    { id: 'marathonMaster', name: '🏃 Marathon Master', description: 'Complete a 50-question challenge', condition: () => false }, // Checked at challenge completion
    { id: 'efficiencyExpert', name: '💎 Efficiency Expert', description: 'Average under 20 seconds per question in a challenge', condition: () => false }, // Checked at challenge completion
    
    // === ACCURACY & STREAKS ===
    { id: 'focus10', name: '🎯 Focus 10', description: 'Answer 10 questions correctly in a row in one session', condition: (state) => state.streakCurrent >= 10 },
    { id: 'hotStreak', name: '🔥 Hot Streak', description: 'Answer 5 questions correctly in a row', condition: (state) => state.streakCurrent >= 5 },
    { id: 'unstoppable', name: '💪 Unstoppable', description: 'Answer 20 questions correctly in a row', condition: (state) => state.streakCurrent >= 20 },
    { id: 'perfect10', name: '✨ Perfect 10', description: 'Get 10 correct answers with 100% accuracy in a session', condition: (state) => state.correctQuestions >= 10 && state.correctQuestions === state.totalQuestions && state.totalQuestions >= 10 },
    { id: 'flawless', name: '💯 Flawless', description: 'Complete a challenge with no mistakes', condition: () => false }, // Checked at challenge completion
    
    // === POINTS & SCORING ===
    { id: 'homeworkHero', name: '📚 Homework Hero', description: 'Score 100 points in one session', condition: (state) => state.score >= 100 },
    { id: 'centurion', name: '💯 Centurion', description: 'Score 200 points in one session', condition: (state) => state.score >= 200 },
    { id: 'pointCollector', name: '💰 Point Collector', description: 'Score 500 points in one session', condition: (state) => state.score >= 500 },
    
    // === CHALLENGE MODE ===
    { id: 'challengeSeeker', name: '🎮 Challenge Seeker', description: 'Complete your first challenge', condition: () => false }, // Checked at challenge completion
    { id: 'challengeChampion', name: '🏆 Challenge Champion', description: 'Complete 5 challenges', condition: () => false }, // Tracked separately
    { id: 'challengeLegend', name: '👑 Challenge Legend', description: 'Complete 10 challenges', condition: () => false }, // Tracked separately
    
    // === DEDICATION & PRACTICE ===
    { id: 'dedicated', name: '📖 Dedicated Student', description: 'Answer 50 questions correctly (all time)', condition: (state) => state.correctQuestions >= 50 },
    { id: 'mathematician', name: '🧮 Mathematician', description: 'Answer 100 questions correctly (all time)', condition: (state) => state.correctQuestions >= 100 },
    { id: 'mathWizard', name: '🧙 Math Wizard', description: 'Answer 250 questions correctly (all time)', condition: (state) => state.correctQuestions >= 250 },
    { id: 'mathLegend', name: '🌟 Math Legend', description: 'Answer 500 questions correctly (all time)', condition: (state) => state.correctQuestions >= 500 }
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

// Fraction Conversion Utilities (Milestone 15)
function gcd(a, b) {
    // Greatest Common Divisor using Euclidean algorithm
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function simplifyFraction(numerator, denominator) {
    // Simplify fraction using GCD
    if (denominator === 0) return { numerator: 0, denominator: 1 };
    if (numerator === 0) return { numerator: 0, denominator: 1 };
    
    const sign = (numerator < 0) !== (denominator < 0) ? -1 : 1;
    const absNum = Math.abs(numerator);
    const absDen = Math.abs(denominator);
    const divisor = gcd(absNum, absDen);
    
    return {
        numerator: sign * (absNum / divisor),
        denominator: absDen / divisor
    };
}

function decimalToFraction(decimal, tolerance = 0.0001, maxDenominator = 100) {
    // Convert decimal to fraction using continued fractions
    if (decimal === 0) return { numerator: 0, denominator: 1 };
    if (Math.abs(decimal) >= 1) {
        // Handle integers and numbers >= 1
        const wholePart = Math.floor(Math.abs(decimal));
        const fractionalPart = Math.abs(decimal) - wholePart;
        if (fractionalPart < tolerance) {
            return { numerator: decimal < 0 ? -wholePart : wholePart, denominator: 1 };
        }
    }
    
    // Common fraction lookup table
    const commonFractions = [
        { decimal: 0.5, num: 1, den: 2 },
        { decimal: 0.25, num: 1, den: 4 },
        { decimal: 0.75, num: 3, den: 4 },
        { decimal: 0.333, num: 1, den: 3 },
        { decimal: 0.667, num: 2, den: 3 },
        { decimal: 0.2, num: 1, den: 5 },
        { decimal: 0.4, num: 2, den: 5 },
        { decimal: 0.6, num: 3, den: 5 },
        { decimal: 0.8, num: 4, den: 5 },
        { decimal: 0.125, num: 1, den: 8 },
        { decimal: 0.375, num: 3, den: 8 },
        { decimal: 0.625, num: 5, den: 8 },
        { decimal: 0.875, num: 7, den: 8 }
    ];
    
    // Check common fractions first
    for (const frac of commonFractions) {
        if (Math.abs(Math.abs(decimal) - frac.decimal) < tolerance) {
            return { numerator: decimal < 0 ? -frac.num : frac.num, denominator: frac.den };
        }
    }
    
    // Use continued fractions algorithm
    let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
    let b = Math.abs(decimal);
    const sign = decimal < 0 ? -1 : 1;
    
    for (let i = 0; i < 20; i++) {
        const a = Math.floor(b);
        const aux = h1;
        h1 = a * h1 + h2;
        h2 = aux;
        const aux2 = k1;
        k1 = a * k1 + k2;
        k2 = aux2;
        
        if (k1 > maxDenominator) break;
        
        const approx = h1 / k1;
        if (Math.abs(Math.abs(decimal) - approx) < tolerance) {
            return simplifyFraction(sign * h1, k1);
        }
        
        b = 1 / (b - a);
        if (b === Infinity) break;
    }
    
    // If we get here, try simple denominator approach
    for (let den = 2; den <= maxDenominator; den++) {
        const num = Math.round(Math.abs(decimal) * den);
        const approx = num / den;
        if (Math.abs(Math.abs(decimal) - approx) < tolerance) {
            return simplifyFraction(sign * num, den);
        }
    }
    
    // Fallback: return null if conversion fails
    return null;
}

function formatSlopeValue(slope) {
    // Issue #018: ONLY return simple fractions for 8th grade
    // Format slope as fraction only (no decimal)
    if (slope === Infinity || slope === -Infinity) {
        return 'undefined';
    }
    
    if (slope === 0) {
        return '0';
    }
    
    // Check if it's already an integer
    if (Math.abs(slope - Math.round(slope)) < 0.0001) {
        return Math.round(slope).toString();
    }
    
    // Issue #018 FIX: STRICT whitelist matching - find closest simple fraction
    // Define ONLY acceptable 8th grade fractions
    const simpleFractions = [
        { value: 1/2, display: '1/2' },
        { value: -1/2, display: '-1/2' },
        { value: 1/3, display: '1/3' },
        { value: -1/3, display: '-1/3' },
        { value: 2/3, display: '2/3' },
        { value: -2/3, display: '-2/3' },
        { value: 3/2, display: '3/2' },
        { value: -3/2, display: '-3/2' },
        { value: 1, display: '1' },
        { value: -1, display: '-1' },
        { value: 2, display: '2' },
        { value: -2, display: '-2' },
        { value: 3, display: '3' },
        { value: -3, display: '-3' }
    ];
    
    // Find the CLOSEST simple fraction
    let closest = simpleFractions[0];
    let minDiff = Math.abs(slope - closest.value);
    
    for (const frac of simpleFractions) {
        const diff = Math.abs(slope - frac.value);
        if (diff < minDiff) {
            minDiff = diff;
            closest = frac;
        }
    }
    
    // If very close to a simple fraction (within 0.01), use it
    if (minDiff < 0.01) {
        return closest.display;
    }
    
    // Otherwise, fallback to rounded integer
    return Math.round(slope).toString();
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
    
    // Format slope as fraction
    const slopeStr = formatSlopeValue(line.m);
    
    if (line.m === 0) {
        equation += line.b;
    } else if (line.m === 1) {
        equation += `x`;
    } else if (line.m === -1) {
        equation += `-x`;
    } else {
        // Use fraction format for slope
        if (slopeStr.includes('/')) {
            equation += `(${slopeStr})x`;
        } else {
            equation += `${slopeStr}x`;
        }
    }
    
    if (line.b !== 0) {
        equation += line.b > 0 ? ` + ${line.b}` : ` ${line.b}`;
    }
    
    return equation;
}

// Random number generation utility
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 1) {
    const num = Math.random() * (max - min) + min;
    return roundToDecimal(num, decimals);
}

// Distractor Generation Functions for Multiple Choice
// Issue #017: Helper function to deduplicate options and ensure exactly 4 unique values
function deduplicateOptions(correctValue, distractors, fallbackValues) {
    // Start with correct answer and distractors
    let options = [
        { value: correctValue, correct: true },
        ...distractors.map(d => ({ value: d, correct: false }))
    ];
    
    // Deduplicate by value
    const seen = new Set();
    options = options.filter(opt => {
        if (seen.has(opt.value)) {
            console.warn(`[Issue #017] Duplicate option detected and removed: ${opt.value}`);
            return false;
        }
        seen.add(opt.value);
        return true;
    });
    
    // Backfill if we have less than 4 options due to duplicates
    for (const val of fallbackValues) {
        if (options.length >= 4) break;
        if (!seen.has(val)) {
            options.push({ value: val, correct: false });
            seen.add(val);
        }
    }
    
    // Shuffle
    options.sort(() => Math.random() - 0.5);
    
    return options;
}

function generateSlopeDistractors(correctSlope) {
    const distractors = new Set();
    const correct = correctSlope === Infinity ? 'undefined' : formatSlopeValue(correctSlope);
    
    // Issue #019 FIX: ALL values must be STRINGS to match formatSlopeValue() output!
    // Common simple values for 8th grade level - ONLY use these!
    const simpleValues = ['0', '1', '-1', '2', '-2', '3', '-3', '1/2', '-1/2', '1/3', '-1/3', '2/3', '-2/3', '3/2', '-3/2', 'undefined'];
    
    // Generate wrong answers: focus on common student mistakes
    const possibleDistractors = [];
    
        if (correctSlope === Infinity) {
        // For vertical lines (undefined), use simple numeric slopes (already strings)
        possibleDistractors.push('0', '1', '-1', '2');
        } else if (correctSlope === 0) {
        // For horizontal lines (0), use simple non-zero slopes (already strings)
        possibleDistractors.push('1', '-1', '2', '-2', 'undefined');
        } else {
        // For regular slopes, ONLY use simple wrong answers
        // Don't do arithmetic on correctSlope as it can create complex fractions!
        
        // 1. Wrong sign - but only if the result is simple
        const negativeSlope = formatSlopeValue(-correctSlope);
        if (simpleValues.includes(negativeSlope)) {
            possibleDistractors.push(negativeSlope);
        }
        
        // 2. Flipped fraction - but only if both original and reciprocal are simple
        if (Math.abs(correctSlope) > 0.01 && Math.abs(correctSlope) < 10) {
            const reciprocal = 1 / correctSlope;
            const reciprocalStr = formatSlopeValue(reciprocal);
            if (simpleValues.includes(reciprocalStr)) {
                possibleDistractors.push(reciprocalStr);
            }
        }
        
        // 3. Add ALL other simple values that aren't the correct answer
        for (const val of simpleValues) {
            if (val !== correct && val !== 'undefined') {
                possibleDistractors.push(val);
            }
        }
    }
    
    // Shuffle and pick 3 different distractors that are not the correct answer
    const shuffled = possibleDistractors.filter(d => d !== correct && d !== undefined);
    
    // Use a more thorough shuffle and deduplication
    const uniqueDistractors = [...new Set(shuffled)];
    
    // Randomly select 3 distractors
    while (distractors.size < 3 && uniqueDistractors.length > 0) {
        const randomIndex = randomInt(0, uniqueDistractors.length - 1);
        const distractor = uniqueDistractors[randomIndex];
        uniqueDistractors.splice(randomIndex, 1);
            distractors.add(distractor);
    }
    
    // If we still don't have 3, fill with simple values (fallback)
    for (const val of simpleValues) {
        if (distractors.size >= 3) break;
        if (val !== correct && val !== 'undefined' && !distractors.has(val)) {
            distractors.add(val);
        }
    }
    
    return Array.from(distractors).slice(0, 3);
}

function generateClassificationDistractors(correctClassification) {
    const allClassifications = ['rising', 'falling', 'horizontal', 'vertical'];
    const distractors = allClassifications.filter(c => c !== correctClassification);
    // Shuffle and take 3
    return distractors.sort(() => Math.random() - 0.5).slice(0, 3);
}

function generateRelationshipDistractors(correctRelationship) {
    const allRelationships = ['parallel', 'perpendicular', 'neither', 'same'];
    const distractors = allRelationships.filter(r => r !== correctRelationship);
    // Shuffle and take 3
    return distractors.sort(() => Math.random() - 0.5).slice(0, 3);
}

function generateEquationDistractors(correctLine, baseLine, point, isParallel) {
    const distractors = [];
    const correctEq = formatEquation(correctLine);
    
    while (distractors.length < 3) {
        let wrongLine;
        
        if (correctLine.kind === 'vertical') {
            // Wrong vertical line (different x by simple amounts)
            const offset = [1, -1, 2, -2, 3][distractors.length];
            wrongLine = { kind: 'vertical', x0: correctLine.x0 + offset };
        } else if (correctLine.kind === 'slope') {
            const mistakeType = distractors.length; // Use different mistake for each distractor
            if (mistakeType === 0 && !isParallel) {
                // Wrong slope (use parallel slope instead of perpendicular)
                wrongLine = { kind: 'slope', m: baseLine.m, b: point.y - baseLine.m * point.x };
            } else if (mistakeType === 1) {
                // Wrong intercept (simple integer offset)
                const offset = correctLine.b > 0 ? -2 : 2;
                wrongLine = { kind: 'slope', m: correctLine.m, b: correctLine.b + offset };
            } else {
                // Wrong sign on slope
                wrongLine = { kind: 'slope', m: -correctLine.m, b: point.y - (-correctLine.m) * point.x };
            }
        }
        
        const wrongEq = formatEquation(wrongLine);
        if (wrongEq !== correctEq && !distractors.includes(wrongEq)) {
            distractors.push(wrongEq);
        }
    }
    
    return distractors;
}

// Question Generation Functions for Set Challenge Mode
function generateSlopeQuestion() {
    // Issue #015: Only generate slopes from simple whitelist to avoid complex fractions
    const simpleSlopes = [
        { m: 0, name: 'horizontal' },
        { m: 1, name: 'rising' },
        { m: -1, name: 'falling' },
        { m: 2, name: 'rising' },
        { m: -2, name: 'falling' },
        { m: 3, name: 'rising' },
        { m: -3, name: 'falling' },
        { m: 0.5, name: 'rising' },      // 1/2
        { m: -0.5, name: 'falling' },    // -1/2
        { m: 1/3, name: 'rising' },
        { m: -1/3, name: 'falling' },
        { m: 2/3, name: 'rising' },
        { m: -2/3, name: 'falling' },
        { m: 1.5, name: 'rising' },      // 3/2
        { m: -1.5, name: 'falling' },    // -3/2
        { m: Infinity, name: 'vertical' }
    ];
    
    // Pick a random simple slope
    const targetSlope = simpleSlopes[randomInt(0, simpleSlopes.length - 1)];
    
    // Generate two points that produce this exact slope
    let p1, p2;
    
    if (targetSlope.m === Infinity) {
        // Vertical line: same x, different y
        const x = randomInt(-10, 10);
        p1 = { x: x, y: randomInt(-10, 10) };
        p2 = { x: x, y: randomInt(-10, 10) };
        // Ensure different y values
        while (p1.y === p2.y) {
            p2.y = randomInt(-10, 10);
        }
    } else {
        // Non-vertical line: y = mx + b
        // Start with p1
        p1 = { x: randomInt(-10, 10), y: randomInt(-10, 10) };
        
        // Calculate p2 such that slope = (p2.y - p1.y) / (p2.x - p1.x) = targetSlope.m
        // Choose a random dx (change in x)
        let dx;
        if (targetSlope.m === 0) {
            // Horizontal line: any dx works, dy = 0
            dx = randomInt(1, 5) * (Math.random() < 0.5 ? 1 : -1);
            p2 = { x: p1.x + dx, y: p1.y };
        } else {
            // For fractional slopes, choose dx that gives integer dy
            // If m = a/b, then dy = m * dx = (a/b) * dx
            // Choose dx as a multiple of denominator to ensure integer dy
            const fractionMap = {
                0.5: 2,      // 1/2: dx multiple of 2
                '-0.5': 2,   // -1/2: dx multiple of 2
                [1/3]: 3,    // 1/3: dx multiple of 3
                [-1/3]: 3,   // -1/3: dx multiple of 3
                [2/3]: 3,    // 2/3: dx multiple of 3
                [-2/3]: 3,   // -2/3: dx multiple of 3
                1.5: 2,      // 3/2: dx multiple of 2
                '-1.5': 2    // -3/2: dx multiple of 2
            };
            
            const multiplier = fractionMap[targetSlope.m] || 1;
            dx = randomInt(1, 3) * multiplier * (Math.random() < 0.5 ? 1 : -1);
            const dy = Math.round(targetSlope.m * dx);
            
            p2 = { x: p1.x + dx, y: p1.y + dy };
            
            // Ensure p2 is within bounds
            if (Math.abs(p2.x) > 10) {
                p2.x = p1.x - dx; // Try opposite direction
            }
            if (Math.abs(p2.y) > 10) {
                // Adjust p1 instead
                p1.y = p2.y - dy;
                if (Math.abs(p1.y) > 10) {
                    p1.y = randomInt(-5, 5);
                    p2.y = p1.y + dy;
                }
            }
        }
    }
    
    const result = calculateSlope(p1, p2);
    
    // Generate two separate questions: slope value and classification
    const slopeValue = result.slope === Infinity ? 'undefined' : formatSlopeValue(result.slope);
    const slopeDistractors = generateSlopeDistractors(result.slope);
    const classificationDistractors = generateClassificationDistractors(result.classification);
    
    // Issue #017: Create slope options with deduplication using helper function
    const fallbackSlopes = ['0', '1', '-1', '2', '-2', '3', '-3', '1/2', '-1/2', '1/3', '-1/3', '2/3', '-2/3', '3/2', '-3/2'];
    const slopeOptions = deduplicateOptions(slopeValue, slopeDistractors, fallbackSlopes);
    
    // Issue #017: Create classification options with deduplication using helper function
    const fallbackClassifications = ['rising', 'falling', 'horizontal', 'vertical'];
    const classificationOptions = deduplicateOptions(result.classification, classificationDistractors, fallbackClassifications);
    
    return {
        type: 'slope',
        question: `Find the slope and classification for the line through points (${p1.x},${p1.y}) and (${p2.x},${p2.y})`,
        display: `(${p1.x},${p1.y}), (${p2.x},${p2.y})`,
        correctAnswer: `Slope: ${slopeValue}\nClassification: ${result.classification}`,
        data: { p1, p2, result },
        slopeQuestion: {
            question: `What is the slope?`,
            options: slopeOptions,
            correctAnswer: slopeValue
        },
        classificationQuestion: {
            question: `What is the classification?`,
            options: classificationOptions,
            correctAnswer: result.classification
        }
    };
}

function generateRelationshipQuestion() {
    // Generate two random lines
    const types = ['slope-intercept', 'standard', 'vertical', 'horizontal'];
    const type1 = types[randomInt(0, types.length - 1)];
    const type2 = types[randomInt(0, types.length - 1)];
    
    let line1, line2, eq1Str, eq2Str;
    
    // Generate first equation
    if (type1 === 'vertical') {
        const x0 = randomInt(-10, 10);
        line1 = { kind: 'vertical', x0 };
        eq1Str = `x = ${x0}`;
    } else if (type1 === 'horizontal') {
        const y0 = randomInt(-10, 10);
        line1 = { kind: 'slope', m: 0, b: y0 };
        eq1Str = `y = ${y0}`;
    } else if (type1 === 'slope-intercept') {
        const m = randomInt(-5, 5) || 1; // Avoid zero
        const b = randomInt(-10, 10);
        line1 = { kind: 'slope', m, b };
        eq1Str = formatEquation(line1);
    } else { // standard
        const A = randomInt(-5, 5) || 1;
        const B = randomInt(-5, 5) || 1;
        const C = randomInt(-20, 20);
        line1 = { kind: B === 0 ? 'vertical' : 'slope', m: -A/B, b: C/B };
        if (B === 0) {
            line1 = { kind: 'vertical', x0: C/A };
            eq1Str = `${A}x = ${C}`;
        } else {
            eq1Str = `${A}x + ${B}y = ${C}`;
        }
    }
    
    // Generate second equation
    if (type2 === 'vertical') {
        const x0 = randomInt(-10, 10);
        line2 = { kind: 'vertical', x0 };
        eq2Str = `x = ${x0}`;
    } else if (type2 === 'horizontal') {
        const y0 = randomInt(-10, 10);
        line2 = { kind: 'slope', m: 0, b: y0 };
        eq2Str = `y = ${y0}`;
    } else if (type2 === 'slope-intercept') {
        const m = randomInt(-5, 5) || 1;
        const b = randomInt(-10, 10);
        line2 = { kind: 'slope', m, b };
        eq2Str = formatEquation(line2);
    } else { // standard
        const A = randomInt(-5, 5) || 1;
        const B = randomInt(-5, 5) || 1;
        const C = randomInt(-20, 20);
        if (B === 0) {
            line2 = { kind: 'vertical', x0: C/A };
            eq2Str = `${A}x = ${C}`;
        } else {
            line2 = { kind: 'slope', m: -A/B, b: C/B };
            eq2Str = `${A}x + ${B}y = ${C}`;
        }
    }
    
    const relationship = determineRelationship(line1, line2);
    const relationshipDistractors = generateRelationshipDistractors(relationship);
    
    // Issue #017: Create options with deduplication using helper function
    const fallbackRelationships = ['parallel', 'perpendicular', 'neither', 'same'];
    const options = deduplicateOptions(relationship, relationshipDistractors, fallbackRelationships);
    
    const correctAnswer = `Equation 1: ${formatEquation(line1)}\nEquation 2: ${formatEquation(line2)}\nRelationship: ${relationship.charAt(0).toUpperCase() + relationship.slice(1)}`;
    
    return {
        type: 'relationship',
        question: `Determine the relationship between the two lines`,
        display: { eq1: eq1Str, eq2: eq2Str },
        correctAnswer: correctAnswer,
        data: { line1, line2, relationship },
        options: options,
        correctAnswerValue: relationship
    };
}

function generateParallelQuestion() {
    // Generate base line
    const lineTypes = ['slope-intercept', 'vertical', 'horizontal'];
    const lineType = lineTypes[randomInt(0, lineTypes.length - 1)];
    
    let baseLine, baseEqStr;
    
    if (lineType === 'vertical') {
        const x0 = randomInt(-10, 10);
        baseLine = { kind: 'vertical', x0 };
        baseEqStr = `x = ${x0}`;
    } else if (lineType === 'horizontal') {
        const y0 = randomInt(-10, 10);
        baseLine = { kind: 'slope', m: 0, b: y0 };
        baseEqStr = `y = ${y0}`;
    } else {
        const m = randomInt(-5, 5) || 1;
        const b = randomInt(-10, 10);
        baseLine = { kind: 'slope', m, b };
        baseEqStr = formatEquation(baseLine);
    }
    
    // Generate point
    const point = { x: randomInt(-10, 10), y: randomInt(-10, 10) };
    
    const resultLine = findParallelLine(baseLine, point);
    const equationDistractors = generateEquationDistractors(resultLine, baseLine, point, true);
    const correctEq = formatEquation(resultLine);
    
    // Issue #017: Create options with deduplication using helper function
    // For equation-based questions, use simple slope-intercept forms as fallbacks
    const fallbackEquations = ['y = x', 'y = -x', 'y = 2x', 'y = -2x', 'y = x + 1', 'y = x - 1', 'y = 0', 'x = 0'];
    const options = deduplicateOptions(correctEq, equationDistractors, fallbackEquations);
    
    const correctAnswer = `Parallel line: ${correctEq}`;
    
    return {
        type: 'parallel',
        question: `Find the equation of a line parallel to ${baseEqStr} that passes through point (${point.x},${point.y})`,
        display: { equation: baseEqStr, point: `(${point.x},${point.y})` },
        correctAnswer: correctAnswer,
        data: { baseLine, point, resultLine },
        options: options,
        correctAnswerValue: correctEq
    };
}

function generatePerpendicularQuestion() {
    // Generate base line
    const lineTypes = ['slope-intercept', 'vertical', 'horizontal'];
    const lineType = lineTypes[randomInt(0, lineTypes.length - 1)];
    
    let baseLine, baseEqStr;
    
    if (lineType === 'vertical') {
        const x0 = randomInt(-10, 10);
        baseLine = { kind: 'vertical', x0 };
        baseEqStr = `x = ${x0}`;
    } else if (lineType === 'horizontal') {
        const y0 = randomInt(-10, 10);
        baseLine = { kind: 'slope', m: 0, b: y0 };
        baseEqStr = `y = ${y0}`;
    } else {
        const m = randomInt(-5, 5) || 1;
        const b = randomInt(-10, 10);
        baseLine = { kind: 'slope', m, b };
        baseEqStr = formatEquation(baseLine);
    }
    
    // Generate point
    const point = { x: randomInt(-10, 10), y: randomInt(-10, 10) };
    
    const resultLine = findPerpendicularLine(baseLine, point);
    const equationDistractors = generateEquationDistractors(resultLine, baseLine, point, false);
    const correctEq = formatEquation(resultLine);
    
    // Issue #017: Create options with deduplication using helper function
    const fallbackEquations = ['y = x', 'y = -x', 'y = 2x', 'y = -2x', 'y = x + 1', 'y = x - 1', 'y = 0', 'x = 0'];
    const options = deduplicateOptions(correctEq, equationDistractors, fallbackEquations);
    
    const correctAnswer = `Perpendicular line: ${correctEq}`;
    
    return {
        type: 'perpendicular',
        question: `Find the equation of a line perpendicular to ${baseEqStr} that passes through point (${point.x},${point.y})`,
        display: { equation: baseEqStr, point: `(${point.x},${point.y})` },
        correctAnswer: correctAnswer,
        data: { baseLine, point, resultLine },
        options: options,
        correctAnswerValue: correctEq
    };
}

// Challenge State Management
let challengeState = {
    active: false,
    setSize: null,
    currentProblemType: null,
    questions: [],
    currentQuestionIndex: 0,
    answers: {}, // Map of question index to user answer
    questionStates: {}, // 'unanswered', 'answered', 'skipped', 'gave-up'
    correctAnswers: {}, // Map of question index to boolean (was answer correct)
    hintsUsed: 0, // Total hints used in challenge
    hintsUsedPerQuestion: {}, // Map of question index to boolean (used hint)
    hintLimit: 5, // Maximum hints allowed per challenge
    startTime: null,
    endTime: null,
    // Milestone 17: Dual timer system
    challengeStartTime: null, // Timestamp when challenge started (for total time)
    questionTimes: [], // Array of {questionIndex, startTime, endTime, duration} for each question
    totalChallengeTime: 0, // Total time in seconds (calculated at completion)
    // Milestone 18: Progress milestone tracking
    progressMilestones: {
        fifty: false, // Triggered at 50% progress
        eightyFive: false, // Triggered at 85% progress
        hundred: false // Triggered at 100% completion
    }
};

function generateChallengeQuestions(problemType, count) {
    const questions = [];
    const generators = {
        slope: generateSlopeQuestion,
        relationship: generateRelationshipQuestion,
        pointSlope: generatePointSlopeQuestion,
        absoluteValue: generateAbsoluteValueQuestion,
        parallel: generateParallelQuestion,
        perpendicular: generatePerpendicularQuestion,
        intercept: generateInterceptQuestion,
        rateOfChange: generateRateOfChangeQuestion,
        linearFunction: generateLinearFunctionQuestion,
        standardForm: generateStandardFormQuestion,
        // MILESTONE 19: Interactive Graphing Challenge Types
        'graph-slopeintercept': generateGraphSlopeInterceptQuestion,
        'graph-pointslope': generateGraphPointSlopeQuestion,
        'graph-parallel': generateGraphParallelQuestion,
        'graph-perpendicular': generateGraphPerpendicularQuestion,
        'graph-absolutevalue': generateGraphAbsoluteValueQuestion
    };
    
    const generator = generators[problemType];
    if (!generator) return [];
    
    for (let i = 0; i < count; i++) {
        questions.push(generator());
    }
    
    return questions;
}

function initializeChallenge(problemType, setSize) {
    challengeState = {
        active: true,
        setSize: setSize,
        currentProblemType: problemType,
        questions: generateChallengeQuestions(problemType, setSize),
        currentQuestionIndex: 0,
        answers: {},
        questionStates: {},
        correctAnswers: {},
        hintsUsed: 0,
        hintsUsedPerQuestion: {},
        hintLimit: 5,
        startTime: Date.now(),
        endTime: null,
        // Issue #016 FIX: Milestone 17 dual timer fields were missing!
        challengeStartTime: null, // Will be set by startChallengeTimer()
        questionTimes: [], // Array of {questionIndex, startTime, endTime, duration}
        totalChallengeTime: 0, // Calculated at completion
        // Milestone 18: Progress milestone tracking
        progressMilestones: {
            fifty: false,
            eightyFive: false,
            hundred: false
        }
    };
    
    // Initialize all question states
    for (let i = 0; i < challengeState.questions.length; i++) {
        challengeState.questionStates[i] = 'unanswered';
    }
}

function resetChallenge() {
    // Stop timers when resetting challenge
    stopQuestionTimer();
    gameState.questionStartTime = null;
    
    // Milestone 17: Stop challenge timer
    stopChallengeTimer();
    
    challengeState = {
        active: false,
        setSize: null,
        currentProblemType: null,
        questions: [],
        currentQuestionIndex: 0,
        answers: {},
        questionStates: {},
        correctAnswers: {},
        hintsUsed: 0,
        hintsUsedPerQuestion: {},
        hintLimit: 5,
        startTime: null,
        endTime: null,
        // Milestone 17: Reset dual timer fields
        challengeStartTime: null,
        questionTimes: [],
        totalChallengeTime: 0
    };
}

// Challenge UI Functions
function showChallengeSetupModal() {
    const modal = document.getElementById('challengeSetupModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function hideChallengeSetupModal() {
    const modal = document.getElementById('challengeSetupModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Map tab data-tab values to generator keys
function mapTabToProblemType(tabName) {
    const mapping = {
        'slope': 'slope',
        'relationship': 'relationship',
        'parallel': 'parallel',
        'perpendicular': 'perpendicular',
        'pointslope': 'pointSlope',
        'absolutevalue': 'absoluteValue',
        'intercepts': 'intercept',
        'rateofchange': 'rateOfChange',
        'linearfunction': 'linearFunction',
        'standardform': 'standardForm',
        // MILESTONE 19: Interactive Graphing Practice - MUST MATCH KEYS IN generateChallengeQuestions
        'graph-slopeintercept': 'graph-slopeintercept',
        'graph-pointslope': 'graph-pointslope',
        'graph-parallel': 'graph-parallel',
        'graph-perpendicular': 'graph-perpendicular',
        'graph-absolutevalue': 'graph-absolutevalue'
    };
    return mapping[tabName] || 'slope';
}

function startChallenge(setSize) {
    const activeTab = document.querySelector('.tab-button.active');
    const tabName = activeTab ? activeTab.dataset.tab : 'slope';
    const problemType = mapTabToProblemType(tabName);
    
    // Stop any existing timers and reset for challenge mode
    stopQuestionTimer();
    gameState.questionStartTime = null;
    
    initializeChallenge(problemType, setSize);
    
    // Milestone 17: Start challenge timer
    startChallengeTimer();
    
    hideChallengeSetupModal();
    displayChallengeQuestion();
    showChallengeInterface();
}

function showChallengeInterface() {
    // Hide normal problem panels
    document.querySelectorAll('.problem-panel').forEach(p => p.classList.remove('active'));
    
    // Show challenge interface in main content
    const challengeInterface = document.getElementById('challengeInterface');
    if (challengeInterface) {
        challengeInterface.style.display = 'block';
        challengeInterface.classList.add('active');
    }
}

function hideChallengeInterface() {
    const challengeInterface = document.getElementById('challengeInterface');
    if (challengeInterface) {
        challengeInterface.style.display = 'none';
        challengeInterface.classList.remove('active');
    }
}

function displayChallengeQuestion() {
    if (!challengeState.active || challengeState.questions.length === 0) return;
    
    const question = challengeState.questions[challengeState.currentQuestionIndex];
    const questionState = challengeState.questionStates[challengeState.currentQuestionIndex];
    const userAnswer = challengeState.answers[challengeState.currentQuestionIndex] || '';
    
    // Reset and start timer for this question (only if not already answered)
    if (questionState !== 'answered' && questionState !== 'gave-up') {
        stopQuestionTimer();
        gameState.questionStartTime = Date.now();
        gameState.questionTimer = setInterval(updateTimer, 100);
    } else {
        // Stop timer if question is already answered
        stopQuestionTimer();
    }
    
    // Update question counter
    const questionCounter = document.getElementById('challengeQuestionCounter');
    if (questionCounter) {
        questionCounter.textContent = `Question ${challengeState.currentQuestionIndex + 1} of ${challengeState.questions.length}`;
    }
    
    // Update hint count
    const hintCount = document.getElementById('challengeHintCount');
    if (hintCount) {
        const remaining = challengeState.hintLimit - challengeState.hintsUsed;
        hintCount.textContent = `Hints: ${challengeState.hintsUsed}/${challengeState.hintLimit}`;
        if (remaining === 0) {
            hintCount.classList.add('hint-limit-reached');
        } else {
            hintCount.classList.remove('hint-limit-reached');
        }
    }
    
    // Update hint button
    const hintButton = document.getElementById('challengeHintButton');
    if (hintButton) {
        hintButton.dataset.hint = challengeState.currentProblemType;
        const canUseHint = challengeState.hintsUsed < challengeState.hintLimit;
        hintButton.disabled = !canUseHint;
        if (!canUseHint) {
            hintButton.title = 'Hint limit reached (5/5)';
        } else {
            hintButton.title = `Get hints (reduces points by half) - ${challengeState.hintLimit - challengeState.hintsUsed} remaining`;
        }
    }
    
    // Update progress bar
    const progressBar = document.getElementById('challengeProgressBar');
    if (progressBar) {
        const progress = ((challengeState.currentQuestionIndex + 1) / challengeState.questions.length) * 100;
        progressBar.style.width = progress + '%';
    }
    
    // Display question based on type
    const questionDisplay = document.getElementById('challengeQuestionDisplay');
    const inputContainer = document.getElementById('challengeInputContainer');
    
    if (questionDisplay && inputContainer) {
        questionDisplay.innerHTML = '';
        inputContainer.innerHTML = '';
        
        // Clear result area
        const resultArea = document.getElementById('challengeResult');
        if (resultArea) {
            resultArea.textContent = '';
            resultArea.className = 'result-area';
        }
        
        if (question.type === 'slope') {
            questionDisplay.innerHTML = `<p class="challenge-question-text">Find the slope and classification for the line through points: <strong>${question.display}</strong></p>`;
            
            // Display two separate multiple choice questions
            let slopeHtml = '<div class="multiple-choice-question"><p class="question-text">What is the slope?</p><div class="radio-group" id="challengeSlopeValueOptions"></div></div>';
            let classificationHtml = '<div class="multiple-choice-question"><p class="question-text">What is the classification?</p><div class="radio-group" id="challengeSlopeClassificationOptions"></div></div>';
            
            inputContainer.innerHTML = slopeHtml + classificationHtml;
            
            // Render options - ensure question has the new structure
            if (!question.slopeQuestion || !question.classificationQuestion) {
                // Regenerate question with multiple choice structure if missing
                const result = question.data.result;
                const slopeValue = result.slope === Infinity ? 'undefined' : formatSlopeValue(result.slope);
                const slopeDistractors = generateSlopeDistractors(result.slope);
                const classificationDistractors = generateClassificationDistractors(result.classification);
                
                // Create options WITHOUT labels (will be assigned in renderRadioOptions)
                const slopeOptions = [
                    { value: slopeValue, correct: true },
                    { value: slopeDistractors[0], correct: false },
                    { value: slopeDistractors[1], correct: false },
                    { value: slopeDistractors[2], correct: false }
                ].sort(() => Math.random() - 0.5);
                
                const classificationOptions = [
                    { value: result.classification, correct: true },
                    { value: classificationDistractors[0], correct: false },
                    { value: classificationDistractors[1], correct: false },
                    { value: classificationDistractors[2], correct: false }
                ].sort(() => Math.random() - 0.5);
                
                question.slopeQuestion = {
                    question: 'What is the slope?',
                    options: slopeOptions,
                    correctAnswer: slopeValue
                };
                
                question.classificationQuestion = {
                    question: 'What is the classification?',
                    options: classificationOptions,
                    correctAnswer: result.classification
                };
            }
            
            // Render options
            renderRadioOptions('challengeSlopeValueOptions', question.slopeQuestion.options, 'challengeSlopeValue', null);
            renderRadioOptions('challengeSlopeClassificationOptions', question.classificationQuestion.options, 'challengeSlopeClassification', null);
            
            // Restore selected answers if answered
            if (userAnswer && questionState === 'answered') {
                const answers = userAnswer.split(',');
                if (answers[0]) {
                    const slopeRadio = document.querySelector(`input[name="challengeSlopeValue"][value="${answers[0].trim()}"]`);
                    if (slopeRadio) slopeRadio.checked = true;
                }
                if (answers[1]) {
                    const classificationRadio = document.querySelector(`input[name="challengeSlopeClassification"][value="${answers[1].trim()}"]`);
                    if (classificationRadio) classificationRadio.checked = true;
                }
                // Disable all if answered
                document.querySelectorAll('#challengeSlopeValueOptions input, #challengeSlopeClassificationOptions input').forEach(radio => {
                    radio.disabled = true;
                });
            }
        } else if (question.type === 'relationship') {
            questionDisplay.innerHTML = `
                <p class="challenge-question-text">Determine the relationship between:</p>
                <p><strong>Equation 1:</strong> ${question.display.eq1}</p>
                <p><strong>Equation 2:</strong> ${question.display.eq2}</p>
            `;
            inputContainer.innerHTML = `
                <div class="multiple-choice-question">
                    <p class="question-text">What is the relationship between these two lines?</p>
                    <div class="radio-group" id="challengeRelationshipOptions"></div>
                </div>
            `;
            
            // Ensure question has options structure
            if (!question.options) {
                const relationship = question.data.relationship;
                const relationshipDistractors = generateRelationshipDistractors(relationship);
                question.options = [
                    { value: relationship, correct: true },
                    { value: relationshipDistractors[0], correct: false },
                    { value: relationshipDistractors[1], correct: false },
                    { value: relationshipDistractors[2], correct: false }
                ].sort(() => Math.random() - 0.5);
            }
            
            renderRadioOptions('challengeRelationshipOptions', question.options, 'challengeRelationship', null);
            
            // Restore selected answer if answered
            if (userAnswer && questionState === 'answered') {
                const radio = document.querySelector(`input[name="challengeRelationship"][value="${userAnswer}"]`);
                if (radio) radio.checked = true;
                document.querySelectorAll('#challengeRelationshipOptions input').forEach(r => r.disabled = true);
            }
        } else if (question.type === 'parallel') {
            questionDisplay.innerHTML = `
                <p class="challenge-question-text">Find the equation of a line parallel to <strong>${question.display.equation}</strong> that passes through point <strong>${question.display.point}</strong></p>
            `;
            inputContainer.innerHTML = `
                <div class="multiple-choice-question">
                    <p class="question-text">Which equation represents a line parallel to the base line that passes through the given point?</p>
                    <div class="radio-group" id="challengeParallelOptions"></div>
                </div>
            `;
            
            // Ensure question has options structure
            if (!question.options) {
                const resultLine = question.data.resultLine;
                const equationDistractors = generateEquationDistractors(resultLine, question.data.baseLine, question.data.point, true);
                const correctEq = formatEquation(resultLine);
                question.options = [
                    { value: correctEq, correct: true },
                    { value: equationDistractors[0], correct: false },
                    { value: equationDistractors[1], correct: false },
                    { value: equationDistractors[2], correct: false }
                ].sort(() => Math.random() - 0.5);
            }
            
            renderRadioOptions('challengeParallelOptions', question.options, 'challengeParallel', null);
            
            // Restore selected answer if answered
            if (userAnswer && questionState === 'answered') {
                const radio = document.querySelector(`input[name="challengeParallel"][value="${userAnswer}"]`);
                if (radio) radio.checked = true;
                document.querySelectorAll('#challengeParallelOptions input').forEach(r => r.disabled = true);
            }
        } else if (question.type === 'perpendicular') {
            questionDisplay.innerHTML = `
                <p class="challenge-question-text">Find the equation of a line perpendicular to <strong>${question.display.equation}</strong> that passes through point <strong>${question.display.point}</strong></p>
            `;
            inputContainer.innerHTML = `
                <div class="multiple-choice-question">
                    <p class="question-text">Which equation represents a line perpendicular to the base line that passes through the given point?</p>
                    <div class="radio-group" id="challengePerpendicularOptions"></div>
                </div>
            `;
            
            // Ensure question has options structure
            if (!question.options) {
                const resultLine = question.data.resultLine;
                const equationDistractors = generateEquationDistractors(resultLine, question.data.baseLine, question.data.point, false);
                const correctEq = formatEquation(resultLine);
                question.options = [
                    { value: correctEq, correct: true },
                    { value: equationDistractors[0], correct: false },
                    { value: equationDistractors[1], correct: false },
                    { value: equationDistractors[2], correct: false }
                ].sort(() => Math.random() - 0.5);
            }
            
            renderRadioOptions('challengePerpendicularOptions', question.options, 'challengePerpendicular', null);
            
            // Restore selected answer if answered
            if (userAnswer && questionState === 'answered') {
                const radio = document.querySelector(`input[name="challengePerpendicular"][value="${userAnswer}"]`);
                if (radio) radio.checked = true;
                document.querySelectorAll('#challengePerpendicularOptions input').forEach(r => r.disabled = true);
            }
        } else if (question.type === 'intercept') {
            questionDisplay.innerHTML = `<p class="challenge-question-text">${question.question}</p>`;
            inputContainer.innerHTML = `
                <div class="multiple-choice-question">
                    <p class="question-text">${question.question}</p>
                    <div class="radio-group" id="challengeInterceptOptions"></div>
                </div>
            `;
            renderRadioOptions('challengeInterceptOptions', question.options, 'challengeIntercept', null);
            if (userAnswer && questionState === 'answered') {
                const radio = document.querySelector(`input[name="challengeIntercept"][value="${userAnswer}"]`);
                if (radio) radio.checked = true;
                document.querySelectorAll('#challengeInterceptOptions input').forEach(r => r.disabled = true);
            }
        } else if (question.type === 'rateOfChange') {
            // Display table
            let tableHtml = '<table class="data-table"><thead><tr><th>X</th><th>Y</th></tr></thead><tbody>';
            for (const row of question.display) {
                tableHtml += `<tr><td>${row.x}</td><td>${row.y}</td></tr>`;
            }
            tableHtml += '</tbody></table>';
            questionDisplay.innerHTML = `<p class="challenge-question-text">${question.question}</p>${tableHtml}`;
            inputContainer.innerHTML = `
                <div class="multiple-choice-question">
                    <p class="question-text">${question.question}</p>
                    <div class="radio-group" id="challengeRateOfChangeOptions"></div>
                </div>
            `;
            renderRadioOptions('challengeRateOfChangeOptions', question.options, 'challengeRateOfChange', null);
            if (userAnswer && questionState === 'answered') {
                const radio = document.querySelector(`input[name="challengeRateOfChange"][value="${userAnswer}"]`);
                if (radio) radio.checked = true;
                document.querySelectorAll('#challengeRateOfChangeOptions input').forEach(r => r.disabled = true);
            }
        } else if (question.type === 'linearFunction') {
            // Display table
            let tableHtml = '<table class="data-table"><thead><tr><th>X</th><th>Y</th></tr></thead><tbody>';
            for (const row of question.display) {
                tableHtml += `<tr><td>${row.x}</td><td>${row.y}</td></tr>`;
            }
            tableHtml += '</tbody></table>';
            questionDisplay.innerHTML = `<p class="challenge-question-text">${question.question}</p>${tableHtml}`;
            inputContainer.innerHTML = `
                <div class="multiple-choice-question">
                    <p class="question-text">${question.question}</p>
                    <div class="radio-group" id="challengeLinearFunctionOptions"></div>
                </div>
            `;
            renderRadioOptions('challengeLinearFunctionOptions', question.options, 'challengeLinearFunction', null);
            if (userAnswer && questionState === 'answered') {
                const radio = document.querySelector(`input[name="challengeLinearFunction"][value="${userAnswer}"]`);
                if (radio) radio.checked = true;
                document.querySelectorAll('#challengeLinearFunctionOptions input').forEach(r => r.disabled = true);
            }
        } else if (question.type === 'standardForm') {
            questionDisplay.innerHTML = `<p class="challenge-question-text">${question.question}</p>`;
            inputContainer.innerHTML = `
                <div class="multiple-choice-question">
                    <p class="question-text">${question.question}</p>
                    <div class="radio-group" id="challengeStandardFormOptions"></div>
                </div>
            `;
            renderRadioOptions('challengeStandardFormOptions', question.options, 'challengeStandardForm', null);
            if (userAnswer && questionState === 'answered') {
                const radio = document.querySelector(`input[name="challengeStandardForm"][value="${userAnswer}"]`);
                if (radio) radio.checked = true;
                document.querySelectorAll('#challengeStandardFormOptions input').forEach(r => r.disabled = true);
            }
        } else if (question.type === 'pointSlope') {
            questionDisplay.innerHTML = `<p class="challenge-question-text">${question.question}</p>`;
            inputContainer.innerHTML = `
                <div class="multiple-choice-question">
                    <p class="question-text">${question.question}</p>
                    <div class="radio-group" id="challengePointSlopeOptions"></div>
                </div>
            `;
            renderRadioOptions('challengePointSlopeOptions', question.options, 'challengePointSlope', null);
            if (userAnswer && questionState === 'answered') {
                const radio = document.querySelector(`input[name="challengePointSlope"][value="${userAnswer}"]`);
                if (radio) radio.checked = true;
                document.querySelectorAll('#challengePointSlopeOptions input').forEach(r => r.disabled = true);
            }
        } else if (question.type === 'absoluteValue') {
            questionDisplay.innerHTML = `<p class="challenge-question-text">${question.question}</p>`;
            inputContainer.innerHTML = `
                <div class="multiple-choice-question">
                    <p class="question-text">${question.question}</p>
                    <div class="radio-group" id="challengeAbsoluteValueOptions"></div>
                </div>
            `;
            renderRadioOptions('challengeAbsoluteValueOptions', question.options, 'challengeAbsoluteValue', null);
            if (userAnswer && questionState === 'answered') {
                const radio = document.querySelector(`input[name="challengeAbsoluteValue"][value="${userAnswer}"]`);
                if (radio) radio.checked = true;
                document.querySelectorAll('#challengeAbsoluteValueOptions input').forEach(r => r.disabled = true);
            }
        } else if (question.type === 'graph-slopeintercept' || question.type === 'graph-pointslope' || 
                   question.type === 'graph-parallel' || question.type === 'graph-perpendicular' || 
                   question.type === 'graph-absolutevalue') {
            // MILESTONE 19: Interactive Graphing in Challenge Mode
            questionDisplay.innerHTML = `<p class="challenge-question-text">${question.question}</p>`;
            
            // Create canvas for interactive graphing
            inputContainer.innerHTML = `
                <div class="challenge-graph-container">
                    <canvas id="challengeGraphCanvas" width="500" height="500"></canvas>
                    <button id="challengeGraphSubmit" class="primary-button" style="margin-top: 10px;">Submit Answer</button>
                </div>
            `;
            
            // Initialize interactive graph
            const graph = initializeInteractiveGraph('challengeGraphCanvas', question);
            if (question.requirePoints === 3) {
                graph.maxPoints = 3;
            }
            
            // Wire up submit button
            document.getElementById('challengeGraphSubmit')?.addEventListener('click', () => {
                const isCorrect = graph.validateSelection();
                graph.showFeedback(isCorrect);
                
                // Update challenge state
                challengeState.questionStates[challengeState.currentQuestionIndex] = 'answered';
                challengeState.answers[challengeState.currentQuestionIndex] = isCorrect ? 'correct' : 'incorrect';
                
                // Update stats
                updateStats(question.type, isCorrect);
                
                // Show result
                const resultArea = document.getElementById('challengeResult');
                if (resultArea) {
                    if (isCorrect) {
                        resultArea.textContent = '✓ Correct!';
                        resultArea.className = 'result-area success';
                    } else {
                        resultArea.textContent = '✗ Incorrect. Correct points shown in green.';
                        resultArea.className = 'result-area error';
                    }
                }
                
                // Disable submit button
                document.getElementById('challengeGraphSubmit').disabled = true;
                
                // Auto-advance after 1 second
                console.log('[Graph Challenge] Setting timeout for auto-advance...');
                setTimeout(() => {
                    console.log('[Graph Challenge] Timeout fired, calling navigateChallengeQuestion...');
                    navigateChallengeQuestion('next');
                }, 1000);
            });
            
            // If already answered, show feedback
            if (questionState === 'answered') {
                graph.showFeedback(userAnswer === 'correct');
                document.getElementById('challengeGraphSubmit').disabled = true;
            }
        }
        
        // Show answer if gave up - highlight correct options
        if (questionState === 'gave-up') {
            // Disable all radio buttons
            const allRadioSelectors = '#challengeSlopeValueOptions input, #challengeSlopeClassificationOptions input, #challengeRelationshipOptions input, #challengeParallelOptions input, #challengePerpendicularOptions input, #challengeInterceptOptions input, #challengeRateOfChangeOptions input, #challengeLinearFunctionOptions input, #challengeStandardFormOptions input, #challengePointSlopeOptions input, #challengeAbsoluteValueOptions input';
            document.querySelectorAll(allRadioSelectors).forEach(radio => {
                if (radio) radio.disabled = true;
            });
            
            // Highlight correct answers
            if (question.type === 'slope') {
                document.querySelectorAll('#challengeSlopeValueOptions .radio-option, #challengeSlopeClassificationOptions .radio-option').forEach(opt => {
                    const radio = opt.querySelector('input');
                    if (radio && radio.dataset.correct === 'true') {
                        opt.classList.add('correct');
                    }
                });
            } else {
                const optionId = `challenge${question.type.charAt(0).toUpperCase() + question.type.slice(1)}Options`;
                document.querySelectorAll(`#${optionId} .radio-option`).forEach(opt => {
                    const radio = opt.querySelector('input');
                    if (radio && radio.dataset.correct === 'true') {
                        opt.classList.add('correct');
                    }
                });
            }
            
            const resultArea = document.getElementById('challengeResult');
            if (resultArea) {
                resultArea.textContent = `Correct Answer: ${question.correctAnswer}`;
                resultArea.className = 'result-area error';
            }
        }
        
        // Update navigation buttons
        updateChallengeNavigation();
    }
}

function updateChallengeNavigation() {
    const backBtn = document.getElementById('challengeBackBtn');
    const skipBtn = document.getElementById('challengeSkipBtn');
    const giveUpBtn = document.getElementById('challengeGiveUpBtn');
    const submitBtn = document.getElementById('challengeSubmitBtn');
    
    if (backBtn) {
        backBtn.disabled = challengeState.currentQuestionIndex === 0;
    }
    
    const questionState = challengeState.questionStates[challengeState.currentQuestionIndex];
    const isAnswered = questionState === 'answered' || questionState === 'gave-up';
    
    if (skipBtn) {
        skipBtn.disabled = isAnswered;
    }
    
    if (giveUpBtn) {
        giveUpBtn.disabled = isAnswered;
    }
    
    if (submitBtn) {
        submitBtn.disabled = isAnswered;
    }
}

function navigateChallengeQuestion(direction) {
    // Issue #016: Add defensive console logging to debug navigation issues
    console.log(`[Navigation] Direction: ${direction}, Current Index: ${challengeState.currentQuestionIndex}, Total Questions: ${challengeState.questions.length}`);
    
    // Hide hints when navigating
    try {
    hideHints();
    } catch (error) {
        console.error('[Navigation] Error hiding hints:', error);
    }
    
    if (direction === 'next') {
        if (challengeState.currentQuestionIndex < challengeState.questions.length - 1) {
            challengeState.currentQuestionIndex++;
            console.log(`[Navigation] Moved to next question: ${challengeState.currentQuestionIndex}`);
        } else {
            // Check if all questions answered
            console.log('[Navigation] Last question reached, checking completion');
            checkChallengeCompletion();
            return;
        }
    } else if (direction === 'prev') {
        if (challengeState.currentQuestionIndex > 0) {
            challengeState.currentQuestionIndex--;
            console.log(`[Navigation] Moved to previous question: ${challengeState.currentQuestionIndex}`);
        }
    }
    
    console.log('[Navigation] Calling displayChallengeQuestion()');
    displayChallengeQuestion();
}

function skipChallengeQuestion() {
    // Stop timer when skipping
    stopQuestionTimer();
    challengeState.questionStates[challengeState.currentQuestionIndex] = 'skipped';
    navigateChallengeQuestion('next');
}

function giveUpChallengeQuestion() {
    // Milestone 17: Record question end time before stopping timer
    const questionEndTime = Date.now();
    
    // Stop timer when giving up
    stopQuestionTimer();
    const question = challengeState.questions[challengeState.currentQuestionIndex];
    challengeState.questionStates[challengeState.currentQuestionIndex] = 'gave-up';
    challengeState.correctAnswers[challengeState.currentQuestionIndex] = false;
    
    // Milestone 17: Track question time
    if (gameState.questionStartTime) {
        const duration = Math.floor((questionEndTime - gameState.questionStartTime) / 1000);
        challengeState.questionTimes.push({
            questionIndex: challengeState.currentQuestionIndex,
            startTime: gameState.questionStartTime,
            endTime: questionEndTime,
            duration: duration
        });
    }
    
    // Show answer
    const resultArea = document.getElementById('challengeResult');
    if (resultArea) {
        resultArea.textContent = `Correct Answer: ${question.correctAnswer}`;
        resultArea.className = 'result-area error';
    }
    
    // Mark as incorrect for scoring
    updateChallengeStats(false);
    
    // Generate new question to replace this one
    const newQuestion = generateChallengeQuestions(challengeState.currentProblemType, 1)[0];
    challengeState.questions[challengeState.currentQuestionIndex] = newQuestion;
    challengeState.questionStates[challengeState.currentQuestionIndex] = 'unanswered';
    challengeState.answers[challengeState.currentQuestionIndex] = '';
    delete challengeState.correctAnswers[challengeState.currentQuestionIndex];
    
    // Move to next question
    setTimeout(() => {
        navigateChallengeQuestion('next');
    }, 2000);
}

function submitChallengeAnswer() {
    const question = challengeState.questions[challengeState.currentQuestionIndex];
    const questionState = challengeState.questionStates[challengeState.currentQuestionIndex];
    
    if (questionState === 'answered' || questionState === 'gave-up') {
        return; // Already answered
    }
    
    // Milestone 17: Record question end time before stopping timer
    const questionEndTime = Date.now();
    
    // Stop timer when answer is submitted
    stopQuestionTimer();
    
    let userInput = '';
    let isCorrect = false;
    
    // Get user input based on question type (multiple choice)
    if (question.type === 'slope') {
        const slopeSelected = document.querySelector('input[name="challengeSlopeValue"]:checked');
        const classificationSelected = document.querySelector('input[name="challengeSlopeClassification"]:checked');
        
        if (!slopeSelected || !classificationSelected) {
            const resultArea = document.getElementById('challengeResult');
            if (resultArea) {
                resultArea.textContent = 'Please select answers for both questions.';
                resultArea.className = 'result-area error';
            }
            return;
        }
        
        userInput = `${slopeSelected.dataset.value}, ${classificationSelected.dataset.value}`;
        // Use dataset.correct for reliable comparison - ensure it's explicitly checked as string
        const slopeCorrect = String(slopeSelected.dataset.correct) === 'true';
        const classificationCorrect = String(classificationSelected.dataset.correct) === 'true';
        isCorrect = slopeCorrect && classificationCorrect;
        
        // Disable and highlight
        document.querySelectorAll('#challengeSlopeValueOptions input, #challengeSlopeClassificationOptions input').forEach(radio => {
            radio.disabled = true;
        });
        
        document.querySelectorAll('#challengeSlopeValueOptions .radio-option, #challengeSlopeClassificationOptions .radio-option').forEach(opt => {
            const radio = opt.querySelector('input');
            if (radio.dataset.correct === 'true') {
                opt.classList.add('correct');
            } else if (radio.checked && radio.dataset.correct === 'false') {
                opt.classList.add('incorrect');
            }
        });
        
    } else if (question.type === 'relationship') {
        const selected = document.querySelector('input[name="challengeRelationship"]:checked');
        if (!selected) {
            const resultArea = document.getElementById('challengeResult');
            if (resultArea) {
                resultArea.textContent = 'Please select an answer.';
                resultArea.className = 'result-area error';
            }
            return;
        }
        
        userInput = selected.value;
        // Use dataset.correct for reliable comparison - ensure it's explicitly checked as string
        isCorrect = String(selected.dataset.correct) === 'true';
        
        // Disable and highlight
        document.querySelectorAll('#challengeRelationshipOptions input').forEach(radio => {
            radio.disabled = true;
        });
        
        document.querySelectorAll('#challengeRelationshipOptions .radio-option').forEach(opt => {
            const radio = opt.querySelector('input');
            if (radio.dataset.correct === 'true') {
                opt.classList.add('correct');
            } else if (radio.checked && radio.dataset.correct === 'false') {
                opt.classList.add('incorrect');
            }
        });
        
    } else if (question.type === 'parallel') {
        const selected = document.querySelector('input[name="challengeParallel"]:checked');
        if (!selected) {
            const resultArea = document.getElementById('challengeResult');
            if (resultArea) {
                resultArea.textContent = 'Please select an answer.';
                resultArea.className = 'result-area error';
            }
            return;
        }
        
        userInput = selected.value;
        // Use dataset.correct for reliable comparison - ensure it's explicitly checked as string
        isCorrect = String(selected.dataset.correct) === 'true';
        
        // Disable and highlight
        document.querySelectorAll('#challengeParallelOptions input').forEach(radio => {
            radio.disabled = true;
        });
        
        document.querySelectorAll('#challengeParallelOptions .radio-option').forEach(opt => {
            const radio = opt.querySelector('input');
            if (radio.dataset.correct === 'true') {
                opt.classList.add('correct');
            } else if (radio.checked && radio.dataset.correct === 'false') {
                opt.classList.add('incorrect');
            }
        });
        
    } else if (question.type === 'perpendicular') {
        const selected = document.querySelector('input[name="challengePerpendicular"]:checked');
        if (!selected) {
            const resultArea = document.getElementById('challengeResult');
            if (resultArea) {
                resultArea.textContent = 'Please select an answer.';
                resultArea.className = 'result-area error';
            }
            return;
        }
        
        userInput = selected.value;
        // Use dataset.correct for reliable comparison - ensure it's explicitly checked as string
        isCorrect = String(selected.dataset.correct) === 'true';
        
        // Disable and highlight
        document.querySelectorAll('#challengePerpendicularOptions input').forEach(radio => {
            radio.disabled = true;
        });
        
        document.querySelectorAll('#challengePerpendicularOptions .radio-option').forEach(opt => {
            const radio = opt.querySelector('input');
            if (radio.dataset.correct === 'true') {
                opt.classList.add('correct');
            } else if (radio.checked && radio.dataset.correct === 'false') {
                opt.classList.add('incorrect');
            }
        });
    } else if (question.type === 'intercept' || question.type === 'rateOfChange' || question.type === 'linearFunction' || question.type === 'standardForm') {
        const nameMap = {
            intercept: 'challengeIntercept',
            rateOfChange: 'challengeRateOfChange',
            linearFunction: 'challengeLinearFunction',
            standardForm: 'challengeStandardForm'
        };
        const optionIdMap = {
            intercept: 'challengeInterceptOptions',
            rateOfChange: 'challengeRateOfChangeOptions',
            linearFunction: 'challengeLinearFunctionOptions',
            standardForm: 'challengeStandardFormOptions'
        };
        
        const name = nameMap[question.type];
        const optionId = optionIdMap[question.type];
        const selected = document.querySelector(`input[name="${name}"]:checked`);
        
        if (!selected) {
            const resultArea = document.getElementById('challengeResult');
            if (resultArea) {
                resultArea.textContent = 'Please select an answer.';
                resultArea.className = 'result-area error';
            }
            return;
        }
        
        userInput = selected.value;
        // Use dataset.correct for reliable comparison - ensure it's explicitly checked as string
        isCorrect = String(selected.dataset.correct) === 'true';
        
        // Disable and highlight
        document.querySelectorAll(`#${optionId} input`).forEach(radio => {
            radio.disabled = true;
        });
        
        document.querySelectorAll(`#${optionId} .radio-option`).forEach(opt => {
            const radio = opt.querySelector('input');
            if (radio.dataset.correct === 'true') {
                opt.classList.add('correct');
            } else if (radio.checked && radio.dataset.correct === 'false') {
                opt.classList.add('incorrect');
            }
        });
    } else if (question.type === 'pointSlope') {
        const selected = document.querySelector('input[name="challengePointSlope"]:checked');
        if (!selected) {
            const resultArea = document.getElementById('challengeResult');
            if (resultArea) {
                resultArea.textContent = 'Please select an answer.';
                resultArea.className = 'result-area error';
            }
            return;
        }
        
        userInput = selected.value;
        isCorrect = String(selected.dataset.correct) === 'true';
        
        // Disable and highlight
        document.querySelectorAll('#challengePointSlopeOptions input').forEach(radio => {
            radio.disabled = true;
        });
        
        document.querySelectorAll('#challengePointSlopeOptions .radio-option').forEach(opt => {
            const radio = opt.querySelector('input');
            if (radio.dataset.correct === 'true') {
                opt.classList.add('correct');
            } else if (radio.checked && radio.dataset.correct === 'false') {
                opt.classList.add('incorrect');
            }
        });
    } else if (question.type === 'absoluteValue') {
        const selected = document.querySelector('input[name="challengeAbsoluteValue"]:checked');
        if (!selected) {
            const resultArea = document.getElementById('challengeResult');
            if (resultArea) {
                resultArea.textContent = 'Please select an answer.';
                resultArea.className = 'result-area error';
            }
            return;
        }
        
        userInput = selected.value;
        isCorrect = String(selected.dataset.correct) === 'true';
        
        // Disable and highlight
        document.querySelectorAll('#challengeAbsoluteValueOptions input').forEach(radio => {
            radio.disabled = true;
        });
        
        document.querySelectorAll('#challengeAbsoluteValueOptions .radio-option').forEach(opt => {
            const radio = opt.querySelector('input');
            if (radio.dataset.correct === 'true') {
                opt.classList.add('correct');
            } else if (radio.checked && radio.dataset.correct === 'false') {
                opt.classList.add('incorrect');
            }
        });
    }
    
    // Store answer and correctness
    challengeState.answers[challengeState.currentQuestionIndex] = userInput;
    challengeState.questionStates[challengeState.currentQuestionIndex] = 'answered';
    challengeState.correctAnswers[challengeState.currentQuestionIndex] = isCorrect;
    
    // Milestone 17: Track question time
    if (gameState.questionStartTime) {
        const duration = Math.floor((questionEndTime - gameState.questionStartTime) / 1000);
        challengeState.questionTimes.push({
            questionIndex: challengeState.currentQuestionIndex,
            startTime: gameState.questionStartTime,
            endTime: questionEndTime,
            duration: duration
        });
        
        // Milestone 17 & Issue #020: Check for speed achievements
        if (isCorrect && duration < 10) {
            // Lightning Fast: Single quick answer
            unlockAchievement('lightningFast');
            
            // Issue #020: Speed Runner - Track quick answers
            gameState.quickAnswersCount++;
            if (gameState.quickAnswersCount >= 5) {
                unlockAchievement('speedRunner');
            }
        }
    }
    
    // Show result
    const resultArea = document.getElementById('challengeResult');
    if (resultArea) {
        if (isCorrect) {
            resultArea.textContent = 'Correct! ✓';
            resultArea.className = 'result-area success';
        } else {
            resultArea.textContent = `Incorrect. Correct answer: ${question.correctAnswer}`;
            resultArea.className = 'result-area error';
        }
    }
    
    // Update stats
    updateChallengeStats(isCorrect);
    
    // Update navigation
    updateChallengeNavigation();
    
    // Milestone 18: Check progress milestones and trigger effects
    checkProgressMilestones();
    
    // Issue #016: Add logging to debug auto-advance
    console.log('[Submit] Setting up auto-advance timeout (2000ms)');
    
    // Auto-advance after a delay
    setTimeout(() => {
        console.log('[Submit] Auto-advance timeout fired, navigating to next question');
        navigateChallengeQuestion('next');
    }, 2000);
}

function updateChallengeStats(isCorrect) {
    const problemType = challengeState.currentProblemType;
    const questionIndex = challengeState.currentQuestionIndex;
    const usedHint = challengeState.hintsUsedPerQuestion[questionIndex] === true;
    
    if (problemType) {
        gameState.stats[problemType].total++;
        if (isCorrect) {
            gameState.stats[problemType].correct++;
            gameState.correctQuestions++;
            gameState.streakCurrent++;
            if (gameState.streakCurrent > gameState.streakBest) {
                gameState.streakBest = gameState.streakCurrent;
            }
            // Calculate points: halve if hint was used
            let points = config.baseScore;
            if (usedHint) {
                points = Math.floor(config.baseScore / 2);
            }
            gameState.score += points;
        } else {
            gameState.streakCurrent = 0;
        }
    }
    
    gameState.totalQuestions++;
    updateUI();
    checkAchievements();
    saveGameState();
}

function checkChallengeCompletion() {
    // Check if all questions are answered or gave up
    const allAnswered = Object.values(challengeState.questionStates).every(
        state => state === 'answered' || state === 'gave-up'
    );
    
    if (allAnswered || challengeState.currentQuestionIndex >= challengeState.questions.length - 1) {
        challengeState.endTime = Date.now();
        
        // Milestone 17: Calculate total challenge time
        if (challengeState.challengeStartTime) {
            challengeState.totalChallengeTime = Math.floor((challengeState.endTime - challengeState.challengeStartTime) / 1000);
        }
        
        // Stop challenge timer
        stopChallengeTimer();
        
        showChallengeCompletion();
    }
}

function calculateChallengeGrade() {
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;
    let gaveUp = 0;
    
    Object.entries(challengeState.questionStates).forEach(([index, state]) => {
        const idx = parseInt(index);
        if (state === 'answered') {
            if (challengeState.correctAnswers[idx] === true) {
                correct++;
            } else {
                incorrect++;
            }
        } else if (state === 'gave-up') {
            gaveUp++;
            incorrect++;
        } else if (state === 'skipped') {
            skipped++;
        }
    });
    
    const total = challengeState.questions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    
    let letterGrade = 'F';
    if (percentage >= 90) letterGrade = 'A';
    else if (percentage >= 80) letterGrade = 'B';
    else if (percentage >= 70) letterGrade = 'C';
    else if (percentage >= 60) letterGrade = 'D';
    
    return {
        total,
        correct,
        incorrect,
        skipped,
        gaveUp,
        hintsUsed: challengeState.hintsUsed,
        hintLimit: challengeState.hintLimit,
        percentage,
        letterGrade
    };
}

function showChallengeCompletion() {
    const grade = calculateChallengeGrade();
    
    // Milestone 17: Format total challenge time
    const formatTime = (seconds) => {
        if (seconds >= 60) {
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${minutes}m ${secs}s`;
        }
        return `${seconds}s`;
    };
    
    // Milestone 17: Calculate question time statistics
    const questionTimesDisplay = challengeState.questionTimes.length > 0 
        ? challengeState.questionTimes
            .map(qt => `Q${qt.questionIndex + 1}: ${formatTime(qt.duration)}`)
            .join(', ')
        : 'No time data available';
    
    const avgTime = challengeState.questionTimes.length > 0
        ? Math.round(challengeState.questionTimes.reduce((sum, qt) => sum + qt.duration, 0) / challengeState.questionTimes.length)
        : 0;
    
    const fastestTime = challengeState.questionTimes.length > 0
        ? Math.min(...challengeState.questionTimes.map(qt => qt.duration))
        : 0;
    
    const slowestTime = challengeState.questionTimes.length > 0
        ? Math.max(...challengeState.questionTimes.map(qt => qt.duration))
        : 0;
    
    // Milestone 17: Check for speed-based achievements
    checkSpeedAchievements(grade);
    
    // Show completion modal
    const completionModal = document.getElementById('challengeCompletionModal');
    if (completionModal) {
        const statsHtml = `
            <div class="completion-stats">
                <h3>Challenge Complete!</h3>
                <div class="stat-row">
                    <span>Total Questions:</span>
                    <span>${grade.total}</span>
                </div>
                <div class="stat-row">
                    <span>Correct:</span>
                    <span class="stat-correct">${grade.correct}</span>
                </div>
                <div class="stat-row">
                    <span>Incorrect:</span>
                    <span class="stat-incorrect">${grade.incorrect}</span>
                </div>
                <div class="stat-row">
                    <span>Skipped:</span>
                    <span class="stat-skipped">${grade.skipped}</span>
                </div>
                <div class="stat-row">
                    <span>Gave Up:</span>
                    <span class="stat-gave-up">${grade.gaveUp}</span>
                </div>
                <div class="stat-row">
                    <span>Hints Used:</span>
                    <span class="stat-hints">${grade.hintsUsed}/${grade.hintLimit}</span>
                </div>
                <div class="stat-row grade-row">
                    <span>Final Grade:</span>
                    <span class="grade-value grade-${grade.letterGrade.toLowerCase()}">${grade.percentage}% (${grade.letterGrade})</span>
                </div>
                <div class="stat-section time-stats">
                    <h4>Time Statistics</h4>
                    <div class="stat-row">
                        <span>Total Time:</span>
                        <span>${formatTime(challengeState.totalChallengeTime)}</span>
                    </div>
                    <div class="stat-row">
                        <span>Average per Question:</span>
                        <span>${formatTime(avgTime)}</span>
                    </div>
                    <div class="stat-row">
                        <span>Fastest Question:</span>
                        <span>${formatTime(fastestTime)}</span>
                    </div>
                    <div class="stat-row">
                        <span>Slowest Question:</span>
                        <span>${formatTime(slowestTime)}</span>
                    </div>
                    <div class="stat-row time-breakdown">
                        <span>Time per Question:</span>
                        <span class="time-list">${questionTimesDisplay}</span>
                    </div>
                </div>
            </div>
        `;
        
        const content = completionModal.querySelector('.completion-content');
        if (content) {
            content.innerHTML = statsHtml;
        }
        
        completionModal.classList.add('active');
        
        // Trigger celebrations
        if (grade.percentage >= 85) {
            triggerConfetti();
        }
        if (grade.percentage === 100) {
            triggerFireworks();
        }
    }
}

function triggerConfetti() {
    // Simple confetti effect using canvas or CSS
    const confettiContainer = document.getElementById('confettiContainer');
    if (confettiContainer) {
        confettiContainer.innerHTML = '';
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '0';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'][Math.floor(Math.random() * 7)];
            confettiContainer.appendChild(confetti);
        }
        setTimeout(() => {
            confettiContainer.innerHTML = '';
        }, 5000);
    } else {
        console.error('confettiContainer not found');
    }
}

function triggerFireworks() {
    // Simple fireworks effect
    const fireworksContainer = document.getElementById('fireworksContainer');
    if (fireworksContainer) {
        fireworksContainer.innerHTML = '';
        for (let i = 0; i < 50; i++) {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = Math.random() * 100 + '%';
            firework.style.top = Math.random() * 50 + '%';
            firework.style.animationDelay = Math.random() * 1 + 's';
            firework.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'][Math.floor(Math.random() * 7)];
            fireworksContainer.appendChild(firework);
        }
        setTimeout(() => {
            fireworksContainer.innerHTML = '';
        }, 3000);
    } else {
        console.error('fireworksContainer not found');
    }
}

// ============================================================================
// MILESTONE 18: Enhanced Feedback Effects System
// ============================================================================
// 10 new visual effects triggered at progress milestones (50%, 85%, 100%)
// Effects are categorized by intensity: mild, medium, high

// ----------------------------------------------------------------------------
// MILD EFFECTS (50% Progress)
// ----------------------------------------------------------------------------

/**
 * Effect 1: Floating Score Points
 * Display "+10", "+5", etc. floating upward from answer area
 * Duration: 2 seconds, green color, fades out
 */
function showFloatingPoints(value = 10, x = null, y = null) {
    const floatingText = document.createElement('div');
    floatingText.className = 'floating-points';
    floatingText.textContent = `+${value}`;
    
    // Position at center of screen if no coordinates provided
    if (x === null || y === null) {
        const rect = document.querySelector('.question-area')?.getBoundingClientRect();
        x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
        y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    }
    
    floatingText.style.left = `${x}px`;
    floatingText.style.top = `${y}px`;
    floatingText.style.position = 'fixed';
    
    document.body.appendChild(floatingText);
    
    // Remove after animation completes
    setTimeout(() => {
        floatingText.remove();
    }, 2000);
}

/**
 * Effect 2: Success Badge Pop-up
 * Temporary badge in top-right corner with message
 * Duration: 3 seconds with scale animation
 */
function showSuccessBadge(message = 'Halfway There! 🏅') {
    const badge = document.createElement('div');
    badge.className = 'success-badge';
    badge.innerHTML = `<div class="badge-content">${message}</div>`;
    
    document.body.appendChild(badge);
    
    // Trigger animation
    setTimeout(() => badge.classList.add('show'), 10);
    
    // Remove after display duration
    setTimeout(() => {
        badge.classList.remove('show');
        setTimeout(() => badge.remove(), 500);
    }, 3000);
}

/**
 * Effect 3: Progress Bar Pulse
 * Make progress bar glow with green box-shadow animation
 * Duration: 1 second pulse
 */
function pulseProgressBar() {
    const progressBar = document.querySelector('.progress-fill') || 
                       document.querySelector('.progress-bar');
    
    if (progressBar) {
        progressBar.classList.add('pulse-glow');
        
        setTimeout(() => {
            progressBar.classList.remove('pulse-glow');
        }, 1000);
    }
}

/**
 * Effect 4: Subtle Particle Burst
 * Small burst of 5-10 pastel particles from center
 * Duration: 1.5 seconds
 */
function showSubtleParticleBurst() {
    const container = document.createElement('div');
    container.className = 'particle-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    
    document.body.appendChild(container);
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const colors = ['#B3E5FC', '#F8BBD0', '#FFF9C4', '#C8E6C9']; // Pastel colors
    const particleCount = 5 + Math.floor(Math.random() * 6); // 5-10 particles
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'subtle-particle';
        
        const size = 5 + Math.random() * 5; // 5-10px
        const angle = (Math.random() * 360) * (Math.PI / 180);
        const distance = 50 + Math.random() * 50; // 50-100px
        const duration = 1 + Math.random() * 0.5; // 1-1.5s
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.position = 'absolute';
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        particle.style.setProperty('--angle-x', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--angle-y', `${Math.sin(angle) * distance}px`);
        particle.style.animation = `subtleParticleBurst ${duration}s ease-out forwards`;
        
        container.appendChild(particle);
    }
    
    // Remove container after animation
    setTimeout(() => {
        container.remove();
    }, 1500);
}

// ----------------------------------------------------------------------------
// MEDIUM EFFECTS (85% Progress)
// ----------------------------------------------------------------------------

/**
 * Effect 5: Emoji Rain
 * Drop 10-15 emojis from top of screen with rotation
 * Duration: 3 seconds
 */
function showEmojiRain() {
    const emojis = ['🎉', '🎊', '⭐', '🌟', '🎈', '✨', '💫'];
    const count = 10 + Math.floor(Math.random() * 6); // 10-15 emojis
    
    for (let i = 0; i < count; i++) {
        const emoji = document.createElement('div');
        emoji.className = 'emoji-rain';
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = `${Math.random() * 100}%`;
        emoji.style.animationDelay = `${Math.random() * 0.5}s`;
        emoji.style.animationDuration = `${2 + Math.random()}s`;
        
        document.body.appendChild(emoji);
        
        // Remove after animation
        setTimeout(() => {
            emoji.remove();
        }, 3500);
    }
}

/**
 * Effect 6: Streak Meter Fire
 * Add flickering flame effect to streak display
 * Duration: 4 seconds
 */
function showStreakFire() {
    const streakDisplay = document.getElementById('streakDisplay') || 
                         document.querySelector('.streak-display') ||
                         document.querySelector('[class*="streak"]');
    
    if (streakDisplay) {
        streakDisplay.classList.add('fire-effect');
        
        setTimeout(() => {
            streakDisplay.classList.remove('fire-effect');
        }, 4000);
    }
}

/**
 * Effect 7: Confetti Trails
 * Colored dots follow cursor for 5 seconds
 * Duration: 5 seconds active
 */
let confettiTrailActive = false;
let confettiTrailTimeout = null;

function showConfettiTrails() {
    if (confettiTrailActive) return; // Already active
    
    confettiTrailActive = true;
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    let colorIndex = 0;
    
    const mouseMoveHandler = (e) => {
        if (!confettiTrailActive) return;
        
        const trail = document.createElement('div');
        trail.className = 'confetti-trail-dot';
        trail.style.left = `${e.clientX}px`;
        trail.style.top = `${e.clientY}px`;
        trail.style.background = colors[colorIndex % colors.length];
        colorIndex++;
        
        document.body.appendChild(trail);
        
        setTimeout(() => trail.remove(), 1000);
    };
    
    document.addEventListener('mousemove', mouseMoveHandler);
    
    // Stop after 5 seconds
    confettiTrailTimeout = setTimeout(() => {
        confettiTrailActive = false;
        document.removeEventListener('mousemove', mouseMoveHandler);
    }, 5000);
}

/**
 * Effect 8: Screen Bounce
 * Quick upward bounce of main container (positive, not jarring)
 * Duration: 500ms
 */
function showScreenBounce() {
    const container = document.querySelector('.container') || 
                     document.querySelector('main') ||
                     document.body;
    
    container.classList.add('screen-bounce');
    
    setTimeout(() => {
        container.classList.remove('screen-bounce');
    }, 500);
}

// ----------------------------------------------------------------------------
// HIGH INTENSITY EFFECTS (100% Completion)
// ----------------------------------------------------------------------------

/**
 * Effect 9: Celebration Modal
 * Full-screen overlay with stars, checkmark, and message
 * Duration: 5 seconds or until dismissed
 */
function showCelebrationModal(message = 'Challenge Complete!', callback = null) {
    const modal = document.createElement('div');
    modal.className = 'celebration-modal';
    modal.innerHTML = `
        <div class="celebration-overlay"></div>
        <div class="celebration-content">
            <div class="celebration-stars">
                ${Array(15).fill('<div class="star">⭐</div>').join('')}
            </div>
            <div class="celebration-checkmark">✓</div>
            <div class="celebration-message">${message}</div>
            <button class="celebration-continue">Continue</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Trigger animation
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Continue button handler
    const continueBtn = modal.querySelector('.celebration-continue');
    const dismiss = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            if (callback) callback();
        }, 300);
    };
    
    continueBtn.addEventListener('click', dismiss);
    
    // Auto-dismiss after 5 seconds
    setTimeout(dismiss, 5000);
}

/**
 * Effect 10: Particle Explosion
 * Burst of 50-80 bright particles with gravity effect
 * Duration: 4 seconds
 */
function showParticleExplosion() {
    const container = document.createElement('div');
    container.className = 'explosion-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    
    document.body.appendChild(container);
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const colors = ['#FF3E3E', '#FF8C42', '#FFD93D', '#6BCF7F', '#4D96FF', '#A855F7'];
    const particleCount = 50 + Math.floor(Math.random() * 31); // 50-80 particles
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'explosion-particle';
        
        const size = 3 + Math.random() * 12; // 3-15px
        const angle = (Math.random() * 360) * (Math.PI / 180);
        const velocity = 150 + Math.random() * 200; // Initial velocity
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 100; // Bias upward
        const shape = Math.random() > 0.5 ? '50%' : '0'; // Circle or square
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = shape;
        particle.style.position = 'absolute';
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        particle.style.setProperty('--vx', `${vx}px`);
        particle.style.setProperty('--vy', `${vy}px`);
        particle.style.animation = `explosionParticle 4s ease-out forwards`;
        
        container.appendChild(particle);
    }
    
    // Remove container after animation
    setTimeout(() => {
        container.remove();
    }, 4000);
}

// ----------------------------------------------------------------------------
// RANDOM SELECTION LOGIC & EFFECT POOLS
// ----------------------------------------------------------------------------

/**
 * Effect pools organized by intensity level
 * Each milestone triggers a random effect from the appropriate pool
 */
const effectPools = {
    mild: [
        { name: 'floatingPoints', fn: showFloatingPoints, args: [10] },
        { name: 'successBadge', fn: showSuccessBadge, args: ['Halfway There! 🏅'] },
        { name: 'progressPulse', fn: pulseProgressBar, args: [] },
        { name: 'subtleParticles', fn: showSubtleParticleBurst, args: [] }
    ],
    medium: [
        { name: 'emojiRain', fn: showEmojiRain, args: [] },
        { name: 'streakFire', fn: showStreakFire, args: [] },
        { name: 'confettiTrails', fn: showConfettiTrails, args: [] },
        { name: 'screenBounce', fn: showScreenBounce, args: [] }
    ],
    high: [
        { name: 'celebrationModal', fn: showCelebrationModal, args: ['Challenge Complete! 🎉'] },
        { name: 'particleExplosion', fn: showParticleExplosion, args: [] },
        { name: 'confetti', fn: triggerConfetti, args: [] },
        { name: 'fireworks', fn: triggerFireworks, args: [] }
    ]
};

/**
 * Get a random effect from the specified intensity pool
 * @param {string} intensityLevel - 'mild', 'medium', or 'high'
 * @returns {Object|null} - Effect object with name, fn, and args, or null if invalid
 */
function getRandomEffect(intensityLevel) {
    const pool = effectPools[intensityLevel];
    
    if (!pool || pool.length === 0) {
        console.error(`[Milestone 18] Invalid intensity level: ${intensityLevel}`);
        return null;
    }
    
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
}

/**
 * Trigger a random effect at the specified intensity level
 * @param {string} intensityLevel - 'mild', 'medium', or 'high'
 */
function triggerRandomEffect(intensityLevel) {
    const effect = getRandomEffect(intensityLevel);
    
    if (effect) {
        console.log(`[Milestone 18] Triggering ${intensityLevel} effect: ${effect.name}`);
        effect.fn(...effect.args);
    }
}

/**
 * Show visual effects warning modal on first load
 * Uses localStorage to remember if user has dismissed it
 */
function showVisualEffectsWarning() {
    const hasSeenWarning = localStorage.getItem('visualEffectsWarningSeen');
    
    if (!hasSeenWarning) {
        const modal = document.getElementById('visualEffectsWarningModal');
        if (modal) {
            modal.style.display = 'flex';
            
            // OK button handler
            const okBtn = document.getElementById('visualEffectsOkBtn');
            if (okBtn) {
                okBtn.addEventListener('click', () => {
                    const dontShowAgain = document.getElementById('dontShowAgainCheckbox')?.checked;
                    
                    if (dontShowAgain) {
                        localStorage.setItem('visualEffectsWarningSeen', 'true');
                    }
                    
                    modal.style.display = 'none';
                });
            }
        }
    }
}

/**
 * Check progress milestones and trigger appropriate effects
 * Called after each answer in Challenge mode
 * Triggers effects at 50%, 85%, and 100% progress
 */
function checkProgressMilestones() {
    if (!challengeState.active) return;
    
    const totalQuestions = challengeState.questions.length;
    const answeredCount = Object.keys(challengeState.questionStates).filter(
        key => challengeState.questionStates[key] === 'answered' || 
               challengeState.questionStates[key] === 'gave-up'
    ).length;
    
    const progress = (answeredCount / totalQuestions) * 100;
    
    console.log(`[Milestone 18] Progress check: ${answeredCount}/${totalQuestions} = ${progress.toFixed(1)}%`);
    
    // Check 50% milestone
    if (progress >= 50 && !challengeState.progressMilestones.fifty) {
        console.log('[Milestone 18] 50% milestone reached! Triggering mild effect.');
        challengeState.progressMilestones.fifty = true;
        triggerRandomEffect('mild');
    }
    
    // Check 85% milestone
    if (progress >= 85 && !challengeState.progressMilestones.eightyFive) {
        console.log('[Milestone 18] 85% milestone reached! Triggering medium effect.');
        challengeState.progressMilestones.eightyFive = true;
        triggerRandomEffect('medium');
    }
    
    // Check 100% milestone (all questions answered or gave up)
    if (progress >= 100 && !challengeState.progressMilestones.hundred) {
        console.log('[Milestone 18] 100% milestone reached! Triggering high intensity effect.');
        challengeState.progressMilestones.hundred = true;
        // Delay slightly so it triggers after completion screen is shown
        setTimeout(() => {
            triggerRandomEffect('high');
        }, 500);
    }
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
    
    // Challenge mode now uses stopwatch (no countdown)
    timerDisplay.textContent = elapsed + 's';
    timerDisplay.classList.remove('timer-warning');
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
    
    gameState.questionTimer = setInterval(updateTimer, 100);
}

function stopQuestionTimer() {
    if (gameState.questionTimer) {
        clearInterval(gameState.questionTimer);
        gameState.questionTimer = null;
    }
}

// Milestone 17: Challenge Timer Functions
function startChallengeTimer() {
    // Stop any existing challenge timer
    stopChallengeTimer();
    
    // Start new challenge timer
    challengeState.challengeStartTime = Date.now();
    gameState.challengeTimer = setInterval(updateChallengeTimer, 100);
}

function stopChallengeTimer() {
    if (gameState.challengeTimer) {
        clearInterval(gameState.challengeTimer);
        gameState.challengeTimer = null;
    }
}

function updateChallengeTimer() {
    if (!challengeState.challengeStartTime) return;
    
    const elapsed = Math.floor((Date.now() - challengeState.challengeStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    const challengeTimerDisplay = document.getElementById('challengeTimerDisplay');
    if (challengeTimerDisplay) {
        challengeTimerDisplay.textContent = `Total: ${minutes}m ${seconds}s`;
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
        // Challenge mode uses base score only (no time bonus)
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

// Milestone 17 & Issue #020: Check speed-based and challenge achievements at completion
function checkSpeedAchievements(grade) {
    if (!challengeState.active) return;
    
    // Issue #020: Increment challenges completed
    gameState.challengesCompleted++;
    
    // Challenge Seeker: First challenge
    if (gameState.challengesCompleted >= 1) {
        unlockAchievement('challengeSeeker');
    }
    
    // Challenge Champion: 5 challenges
    if (gameState.challengesCompleted >= 5) {
        unlockAchievement('challengeChampion');
    }
    
    // Challenge Legend: 10 challenges
    if (gameState.challengesCompleted >= 10) {
        unlockAchievement('challengeLegend');
    }
    
    // Flawless: No mistakes in challenge
    if (grade === 'A' && challengeState.totalCorrect === challengeState.setSize) {
        unlockAchievement('flawless');
    }
    
    // Speed Demon: Complete a 10-question challenge in under 5 minutes
    if (challengeState.setSize >= 10 && challengeState.totalChallengeTime < 300) {
        unlockAchievement('speedDemon');
    }
    
    // Sprint Master: Average under 15 seconds per question
    const avgTimeTotal = challengeState.totalChallengeTime / challengeState.setSize;
    if (avgTimeTotal < 15) {
        unlockAchievement('sprintMaster');
    }
    
    // Marathon Master: Complete a 50-question challenge
    if (challengeState.setSize >= 50) {
        unlockAchievement('marathonMaster');
    }
    
    // Efficiency Expert: Average under 20 seconds per question
    const avgTimePerQ = challengeState.questionTimes.length > 0
        ? challengeState.questionTimes.reduce((sum, qt) => sum + qt.duration, 0) / challengeState.questionTimes.length
        : 0;
    
    if (avgTimePerQ > 0 && avgTimePerQ < 20) {
        unlockAchievement('efficiencyExpert');
    }
    
    // Update personal bests
    updatePersonalBests();
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
    console.log('[Issue #021] showAllAchievements called, achievements count:', achievements.length);
    
    const container = document.getElementById('allAchievements');
    if (!container) {
        console.error('[Issue #021] allAchievements container not found!');
        return;
    }
    
    container.innerHTML = '';
    
    // Issue #020: Now showing all 33 achievements
    achievements.forEach((achievement, index) => {
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
    
    console.log('[Issue #021] Added', achievements.length, 'achievements to modal');
    
    const modal = document.getElementById('achievementModal');
    if (modal) {
        modal.classList.add('active');
        console.log('[Issue #021] Achievement modal opened successfully');
    } else {
        console.error('[Issue #021] achievementModal element not found!');
    }
}

// Hint Functions
const hintTypeToPanelId = {
    slope: 'slope-hint-panel',
    relationship: 'relationship-hint-panel',
    parallel: 'parallel-hint-panel',
    perpendicular: 'perpendicular-hint-panel',
    intercepts: 'intercepts-hint-panel',
    pointslope: 'pointslope-hint-panel',
    absolutevalue: 'absolutevalue-hint-panel',
    rateofchange: 'rateofchange-hint-panel',
    linearfunction: 'linearfunction-hint-panel',
    standardform: 'standardform-hint-panel'
};

const hintTypeToContentId = {
    slope: 'slope-hint-content',
    relationship: 'relationship-hint-content',
    parallel: 'parallel-hint-content',
    perpendicular: 'perpendicular-hint-content',
    intercepts: 'intercepts-hint-content',
    rateofchange: 'rateofchange-hint-content',
    linearfunction: 'linearfunction-hint-content',
    standardform: 'standardform-hint-content',
    pointslope: 'pointslope-hint-content',
    absolutevalue: 'absolutevalue-hint-content'
};

function showHints(hintType) {
    const hintData = hints[hintType];
    if (!hintData) return;
    
    // Check if we're in challenge mode
    if (challengeState.active) {
        showChallengeHints(hintType);
        return;
    }
    
    const panelId = hintTypeToPanelId[hintType];
    const contentId = hintTypeToContentId[hintType];
    
    if (!panelId || !contentId) return;
    
    const content = document.getElementById(contentId);
    if (!content) return;
    
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
    
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.classList.add('active');
    }
}

function showChallengeHints(hintType) {
    // Check hint limit
    if (challengeState.hintsUsed >= challengeState.hintLimit) {
        alert(`Hint limit reached! You've used all ${challengeState.hintLimit} hints.`);
        return;
    }
    
    const hintData = hints[hintType];
    if (!hintData) return;
    
    const questionIndex = challengeState.currentQuestionIndex;
    
    // Track hint usage (only count once per question)
    if (!challengeState.hintsUsedPerQuestion[questionIndex]) {
        challengeState.hintsUsed++;
        challengeState.hintsUsedPerQuestion[questionIndex] = true;
    }
    
    // Update hint count display
    const hintCount = document.getElementById('challengeHintCount');
    if (hintCount) {
        hintCount.textContent = `Hints: ${challengeState.hintsUsed}/${challengeState.hintLimit}`;
        if (challengeState.hintsUsed >= challengeState.hintLimit) {
            hintCount.classList.add('hint-limit-reached');
        }
    }
    
    // Update hint button
    const hintButton = document.getElementById('challengeHintButton');
    if (hintButton) {
        if (challengeState.hintsUsed >= challengeState.hintLimit) {
            hintButton.disabled = true;
            hintButton.title = 'Hint limit reached (5/5)';
        } else {
            hintButton.title = `Get hints (reduces points by half) - ${challengeState.hintLimit - challengeState.hintsUsed} remaining`;
        }
    }
    
    // Display hints in challenge hint panel
    const content = document.getElementById('challenge-hint-content');
    if (!content) return;
    
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
    
    // Add warning about point penalty
    html += '<div class="hint-warning">';
    html += '<p><strong>⚠️ Note:</strong> Using a hint will reduce your points for this question by half.</p>';
    html += '</div>';
    
    content.innerHTML = html;
    
    const panel = document.getElementById('challenge-hint-panel');
    if (panel) {
        panel.classList.add('active');
    }
}

function hideHints(hintType) {
    // Check if we're in challenge mode
    if (challengeState.active) {
        const panel = document.getElementById('challenge-hint-panel');
        if (panel) {
            panel.classList.remove('active');
        }
        return;
    }
    
    if (hintType) {
        const panelId = hintTypeToPanelId[hintType];
        if (panelId) {
            const panel = document.getElementById(panelId);
            if (panel) {
                panel.classList.remove('active');
            }
        }
    } else {
        // Hide all hint panels
        Object.values(hintTypeToPanelId).forEach(panelId => {
            const panel = document.getElementById(panelId);
            if (panel) {
                panel.classList.remove('active');
            }
        });
    }
}

// Helper function to render radio options
function renderRadioOptions(containerId, options, name, onSelect) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Reassign labels A, B, C, D to options in their current order
    // Options are already shuffled in generators, this ensures labels are always alphabetical
    // while keeping the correct answer at a random position
    const labels = ['A', 'B', 'C', 'D'];
    options.forEach((option, index) => {
        if (index < labels.length) {
            option.label = labels[index];
        }
    });
    
    container.innerHTML = '';
    options.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'radio-option';
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = name;
        radio.id = `${name}_${option.label}`;
        radio.value = option.label;
        // Ensure correct is set as string 'true' or 'false' for reliable comparison
        radio.dataset.correct = option.correct === true ? 'true' : 'false';
        radio.dataset.value = option.value;
        
        const label = document.createElement('label');
        label.htmlFor = `${name}_${option.label}`;
        label.textContent = `${option.label}. ${option.value}`;
        
        radio.addEventListener('change', () => {
            // Update visual state
            container.querySelectorAll('.radio-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            optionDiv.classList.add('selected');
            if (onSelect) onSelect(option.label);
        });
        
        optionDiv.appendChild(radio);
        optionDiv.appendChild(label);
        container.appendChild(optionDiv);
    });
}

// Store current question data for validation
let currentQuestionData = null;

// Practice Mode Utilities - Complete rewrite for guaranteed functionality
const PracticeMode = {
    /**
     * Show multiple choice container with guaranteed display
     * @param {string} containerId - ID of container element
     * @param {string} submitBtnId - ID of submit button element
     * @returns {boolean} - Success status
     */
    showContainer: function(containerId, submitBtnId) {
        const container = document.getElementById(containerId);
        const submitBtn = document.getElementById(submitBtnId);
        
        if (!container) {
            console.error(`Container not found: ${containerId}`);
            return false;
        }
        
        if (!submitBtn) {
            console.error(`Submit button not found: ${submitBtnId}`);
            return false;
        }
        
        // Use setProperty with 'important' to guarantee display
        container.style.setProperty('display', 'block', 'important');
        submitBtn.style.setProperty('display', 'block', 'important');
        
        // Verify it's actually visible
        const computedStyle = window.getComputedStyle(container);
        if (computedStyle.display === 'none') {
            console.error(`Container ${containerId} still hidden after setting display`);
            return false;
        }
        
        console.log(`PracticeMode: Showing container ${containerId} in mode ${gameState.mode}`);
        return true;
    },
    
    /**
     * Hide multiple choice container
     * @param {string} containerId - ID of container element
     * @param {string} submitBtnId - ID of submit button element
     */
    hideContainer: function(containerId, submitBtnId) {
        document.getElementById(containerId)?.style.setProperty('display', 'none');
        document.getElementById(submitBtnId)?.style.setProperty('display', 'none');
    },
    
    /**
     * Display multiple choice options
     * @param {string} containerId - ID of container for options
     * @param {Array} options - Array of option objects {label, value, correct}
     * @param {string} name - Radio button name attribute
     * @param {string} questionText - Question text to display (optional)
     * @returns {boolean} - Success status
     */
    displayMultipleChoice: function(containerId, options, name, questionText) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Options container not found: ${containerId}`);
            return false;
        }
        
        // Set question text if provided
        if (questionText) {
            // Try to find question text element - could be parent or sibling
            const questionElement = container.closest('.multiple-choice-question')?.querySelector('.question-text') ||
                                   container.parentElement?.querySelector('.question-text') ||
                                   document.querySelector(`#${containerId.replace('Options', 'Question')} .question-text`);
            if (questionElement) {
                questionElement.textContent = questionText;
            }
        }
        
        // Render options
        renderRadioOptions(containerId, options, name, null);
        return true;
    },
    
    /**
     * Validate that required elements exist
     * @param {Array<string>} elementIds - Array of element IDs to check
     * @returns {boolean} - All elements exist
     */
    validateElements: function(elementIds) {
        for (const id of elementIds) {
            const element = document.getElementById(id);
            if (!element) {
                console.error(`Required element not found: ${id}`);
                return false;
            }
        }
        return true;
    },
    
    /**
     * Process answer submission and update UI
     * @param {string} questionType - Type of question (slope, relationship, parallel, perpendicular)
     * @param {Object} selectedAnswers - Object with selected answer labels
     * @param {Object} correctAnswers - Object with correct answer labels
     * @param {Array<string>} optionContainerIds - Array of option container IDs
     * @returns {Object} - Result object with isCorrect and details
     */
    processAnswer: function(questionType, selectedAnswers, correctAnswers, optionContainerIds) {
        let allCorrect = true;
        const results = {};
        
        // Check each answer
        for (const key in correctAnswers) {
            const selected = selectedAnswers[key];
            const correct = correctAnswers[key];
            const isCorrect = selected === correct;
            results[key] = { selected, correct, isCorrect };
            if (!isCorrect) allCorrect = false;
        }
        
        // Disable all radio buttons
        optionContainerIds.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.querySelectorAll('input[type="radio"]').forEach(radio => {
                    radio.disabled = true;
                });
            }
        });
        
        // Highlight correct/incorrect options
        optionContainerIds.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.querySelectorAll('.radio-option').forEach(opt => {
                    const radio = opt.querySelector('input');
                    if (radio && radio.dataset.correct === 'true') {
                        opt.classList.add('correct');
                    } else if (radio && radio.checked && radio.dataset.correct === 'false') {
                        opt.classList.add('incorrect');
                    }
                });
            }
        });
        
        return { isCorrect: allCorrect, results };
    },
    
    /**
     * Generate feedback message
     * @param {Object} answerResult - Result from processAnswer
     * @param {Object} questionData - Question data with options
     * @returns {string} - Feedback message
     */
    generateFeedback: function(answerResult, questionData) {
        if (answerResult.isCorrect) {
            return 'Correct! ✓';
        }
        
        let message = 'Incorrect.\n';
        for (const key in answerResult.results) {
            const result = answerResult.results[key];
            if (!result.isCorrect) {
                const options = questionData[key + 'Options'] || questionData.options;
                const correctOption = options.find(opt => opt.correct);
                if (correctOption) {
                    message += `Correct ${key}: ${correctOption.value} (${correctOption.label})\n`;
                }
            }
        }
        return message.trim();
    },
    
    /**
     * Reset all Practice mode question state
     */
    resetState: function() {
    gameState.questionAnswered = false;
    currentQuestionData = null;
        currentInterceptData = null;
        currentRateOfChangeData = null;
        currentLinearFunctionData = null;
        currentStandardFormData = null;
        currentSlopeInterceptMBData = null;
        currentSlopeInterceptMPointData = null;
        currentTwoPointData = null;
        currentPointSlopeData = null;
        currentAbsoluteValueData = null;
        
        // Hide all containers
        this.hideContainer('slopeQuestionsContainer', 'slopeSubmit');
        this.hideContainer('relationshipQuestionContainer', 'relationshipSubmit');
        this.hideContainer('parallelQuestionContainer', 'parallelSubmit');
        this.hideContainer('perpendicularQuestionContainer', 'perpendicularSubmit');
        this.hideContainer('interceptQuestionContainer', 'interceptSubmit');
        this.hideContainer('interceptGraphContainer', null);
        this.hideContainer('rateOfChangeQuestionContainer', 'rateOfChangeSubmit');
        this.hideContainer('linearFunctionQuestionContainer', 'linearFunctionSubmit');
        this.hideContainer('standardFormQuestionContainer', 'standardFormSubmit');
        this.hideContainer('slopeInterceptMBQuestionContainer', 'slopeInterceptMBSubmit');
        this.hideContainer('slopeInterceptMPointQuestionContainer', 'slopeInterceptMPointSubmit');
        this.hideContainer('twoPointQuestionContainer', 'twoPointSubmit');
        this.hideContainer('pointSlopeQuestionContainer', 'pointSlopeSubmit');
        this.hideContainer('absoluteValueQuestionContainer', 'absoluteValueSubmit');
        this.hideContainer('absoluteValueGraphContainer', null);
    
    // Clear result areas
    document.querySelectorAll('.result-area').forEach(area => {
        area.textContent = '';
        area.className = 'result-area';
    });
}
};

// Reset question state when switching tabs or starting new question
function resetQuestionState() {
    PracticeMode.resetState();
}

// Problem Type Handlers - Complete Rewrite
function handleSlopeCalculate() {
    // Validate input element exists
    const input = document.getElementById('slopeInput');
    if (!input) {
        console.error('PracticeMode: slopeInput element not found');
        showResult('Error: Input field not found. Please refresh the page.', 'error');
        return;
    }
    
    const inputValue = input.value.trim();
    if (!inputValue) {
        showResult('Please enter two points in the format: (x1,y1), (x2,y2)', 'error');
        return;
    }
    
    try {
        // Parse input
        const pointSeparator = /\)\s*,\s*\(/;
        const parts = inputValue.split(pointSeparator);
        
        if (parts.length !== 2) {
            throw new Error('Please enter two points in the format: (x1,y1), (x2,y2)');
        }
        
        const p1Str = parts[0] + ')';
        const p2Str = '(' + parts[1];
        const p1 = parsePoint(p1Str);
        const p2 = parsePoint(p2Str);
        
        // Calculate slope
        const result = calculateSlope(p1, p2);
        
        // Generate multiple choice options WITHOUT labels (will be assigned in renderRadioOptions)
        const slopeValue = result.slope === Infinity ? 'undefined' : formatSlopeValue(result.slope);
        const slopeDistractors = generateSlopeDistractors(result.slope);
        const classificationDistractors = generateClassificationDistractors(result.classification);
        
        const slopeOptions = [
            { value: slopeValue, correct: true },
            { value: slopeDistractors[0], correct: false },
            { value: slopeDistractors[1], correct: false },
            { value: slopeDistractors[2], correct: false }
        ].sort(() => Math.random() - 0.5);
        
        const classificationOptions = [
            { value: result.classification, correct: true },
            { value: classificationDistractors[0], correct: false },
            { value: classificationDistractors[1], correct: false },
            { value: classificationDistractors[2], correct: false }
        ].sort(() => Math.random() - 0.5);
        
        // Store question data
        currentQuestionData = {
            type: 'slope',
            slopeOptions: slopeOptions,
            classificationOptions: classificationOptions,
            correctSlopeValue: slopeValue,
            correctClassificationValue: result.classification
        };
        
        // Validate required elements exist
        const requiredElements = [
            'slopeQuestionsContainer',
            'slopeValueQuestion',
            'slopeClassificationQuestion',
            'slopeValueOptions',
            'slopeClassificationOptions',
            'slopeSubmit',
            'slopeResult'
        ];
        
        if (!PracticeMode.validateElements(requiredElements)) {
            showResult('Error: UI elements not found. Please refresh the page.', 'error');
            return;
        }
        
        // Show container using PracticeMode utility
        if (!PracticeMode.showContainer('slopeQuestionsContainer', 'slopeSubmit')) {
            showResult('Error: Could not display multiple choice. Please refresh the page.', 'error');
            return;
        }
        
        // Set question texts directly (slope has separate question containers)
        const valueQuestion = document.getElementById('slopeValueQuestion');
        const classificationQuestion = document.getElementById('slopeClassificationQuestion');
        if (valueQuestion) {
            const valueText = valueQuestion.querySelector('.question-text');
        if (valueText) valueText.textContent = 'What is the slope?';
        }
        if (classificationQuestion) {
            const classificationText = classificationQuestion.querySelector('.question-text');
        if (classificationText) classificationText.textContent = 'What is the classification?';
        }
        
        // Display multiple choice options
        PracticeMode.displayMultipleChoice('slopeValueOptions', slopeOptions, 'slopeValue');
        PracticeMode.displayMultipleChoice('slopeClassificationOptions', classificationOptions, 'slopeClassification');
        
        // Clear result area
        const resultArea = document.getElementById('slopeResult');
        resultArea.textContent = '';
        resultArea.className = 'result-area';
        
        gameState.questionAnswered = false;
        console.log(`PracticeMode: Slope question displayed successfully in ${gameState.mode} mode`);
    } catch (error) {
        console.error('PracticeMode: Error in handleSlopeCalculate:', error);
        showResult('Error: ' + error.message, 'error');
    }
}

function handleSlopeSubmit() {
    if (gameState.questionAnswered || !currentQuestionData) {
        return;
    }
    
    // Get selected answers
    const slopeSelected = document.querySelector('input[name="slopeValue"]:checked');
    const classificationSelected = document.querySelector('input[name="slopeClassification"]:checked');
    
    if (!slopeSelected || !classificationSelected) {
        showResult('Please select answers for both questions.', 'error');
        return;
    }
    
    // Process answer using PracticeMode utility
    const selectedAnswers = {
        slope: slopeSelected.value,
        classification: classificationSelected.value
    };
    
    const correctAnswers = {
        slope: currentQuestionData.correctSlopeLabel,
        classification: currentQuestionData.correctClassificationLabel
    };
    
    const optionContainerIds = ['slopeValueOptions', 'slopeClassificationOptions'];
    const answerResult = PracticeMode.processAnswer('slope', selectedAnswers, correctAnswers, optionContainerIds);
    
    // Generate feedback
    let message = '';
    if (answerResult.isCorrect) {
        message = 'Correct! ✓\nBoth answers are correct.';
        showResult(message, 'success');
        updateStats('slope', true);
    } else {
        message = 'Incorrect.\n';
        if (!answerResult.results.slope.isCorrect) {
            const correctOption = currentQuestionData.slopeOptions.find(opt => opt.correct);
            message += `Correct slope: ${correctOption.value} (${correctOption.label})\n`;
        }
        if (!answerResult.results.classification.isCorrect) {
            const correctOption = currentQuestionData.classificationOptions.find(opt => opt.correct);
            message += `Correct classification: ${correctOption.value} (${correctOption.label})`;
        }
        showResult(message, 'error');
        updateStats('slope', false);
    }
    
    gameState.questionAnswered = true;
}

function handleRelationshipCalculate() {
    // Validate input elements exist
    const eq1Input = document.getElementById('equation1Input');
    const eq2Input = document.getElementById('equation2Input');
    
    if (!eq1Input || !eq2Input) {
        console.error('PracticeMode: Equation input elements not found');
        showResult('Error: Input fields not found. Please refresh the page.', 'error');
        return;
    }
    
    const eq1 = eq1Input.value.trim();
    const eq2 = eq2Input.value.trim();
    
    if (!eq1 || !eq2) {
        showResult('Please enter both equations.', 'error');
        return;
    }
    
    try {
        // Parse equations
        const line1 = parseEquation(eq1);
        const line2 = parseEquation(eq2);
        const relationship = determineRelationship(line1, line2);
        
        // Generate multiple choice options
        const relationshipDistractors = generateRelationshipDistractors(relationship);
        const options = [
            { value: relationship, correct: true },
            { value: relationshipDistractors[0], correct: false },
            { value: relationshipDistractors[1], correct: false },
            { value: relationshipDistractors[2], correct: false }
        ].sort(() => Math.random() - 0.5);
        
        // Store question data
        currentQuestionData = {
            type: 'relationship',
            options: options
        };
        
        // Validate required elements exist
        const requiredElements = [
            'relationshipQuestionContainer',
            'relationshipOptions',
            'relationshipSubmit',
            'relationshipResult'
        ];
        
        if (!PracticeMode.validateElements(requiredElements)) {
            showResult('Error: UI elements not found. Please refresh the page.', 'error');
            return;
        }
        
        // Show container using PracticeMode utility
        if (!PracticeMode.showContainer('relationshipQuestionContainer', 'relationshipSubmit')) {
            showResult('Error: Could not display multiple choice. Please refresh the page.', 'error');
            return;
        }
        
        // Display multiple choice options
        PracticeMode.displayMultipleChoice('relationshipOptions', options, 'relationship', 'What is the relationship between these two lines?');
        
        // Clear result area
        const resultArea = document.getElementById('relationshipResult');
        resultArea.textContent = '';
        resultArea.className = 'result-area';
        
        gameState.questionAnswered = false;
        console.log(`PracticeMode: Relationship question displayed successfully in ${gameState.mode} mode`);
    } catch (error) {
        console.error('PracticeMode: Error in handleRelationshipCalculate:', error);
        showResult('Error: ' + error.message, 'error');
    }
}

function handleRelationshipSubmit() {
    if (gameState.questionAnswered || !currentQuestionData) {
        return;
    }
    
    // Get selected answer
    const selected = document.querySelector('input[name="relationship"]:checked');
    if (!selected) {
        showResult('Please select an answer.', 'error');
        return;
    }
    
    // Check if answer is correct using dataset.correct
    const isCorrect = String(selected.dataset.correct) === 'true';
    
    // Disable all radio buttons
    document.querySelectorAll('input[name="relationship"]').forEach(radio => {
        radio.disabled = true;
    });
    
    // Highlight correct/incorrect options
    document.querySelectorAll('#relationshipOptions .radio-option').forEach(opt => {
        const radio = opt.querySelector('input');
        if (radio && radio.dataset.correct === 'true') {
            opt.classList.add('correct');
        } else if (radio && radio.checked && radio.dataset.correct === 'false') {
            opt.classList.add('incorrect');
        }
    });
    
    // Generate feedback
    if (isCorrect) {
        showResult('Correct! ✓', 'success');
        updateStats('relationship', true);
    } else {
        const correctOption = currentQuestionData.options.find(opt => opt.correct);
        showResult(`Incorrect. Correct answer: ${correctOption.value}`, 'error');
        updateStats('relationship', false);
    }
    
    gameState.questionAnswered = true;
}

function handleParallelCalculate() {
    // Validate input elements exist
    const equationInput = document.getElementById('parallelEquationInput');
    const pointInput = document.getElementById('parallelPointInput');
    
    if (!equationInput || !pointInput) {
        console.error('PracticeMode: Parallel input elements not found');
        showResult('Error: Input fields not found. Please refresh the page.', 'error');
        return;
    }
    
    const equation = equationInput.value.trim();
    const pointStr = pointInput.value.trim();
    
    if (!equation || !pointStr) {
        showResult('Please enter both the base equation and a point.', 'error');
        return;
    }
    
    try {
        // Parse inputs
        const baseLine = parseEquation(equation);
        const point = parsePoint(pointStr);
        const resultLine = findParallelLine(baseLine, point);
        
        // Generate multiple choice options
        const equationDistractors = generateEquationDistractors(resultLine, baseLine, point, true);
        const correctEq = formatEquation(resultLine);
        
        const options = [
            { value: correctEq, correct: true },
            { value: equationDistractors[0], correct: false },
            { value: equationDistractors[1], correct: false },
            { value: equationDistractors[2], correct: false }
        ].sort(() => Math.random() - 0.5);
        
        // Store question data
        currentQuestionData = {
            type: 'parallel',
            options: options
        };
        
        // Validate required elements exist
        const requiredElements = [
            'parallelQuestionContainer',
            'parallelOptions',
            'parallelSubmit',
            'parallelResult'
        ];
        
        if (!PracticeMode.validateElements(requiredElements)) {
            showResult('Error: UI elements not found. Please refresh the page.', 'error');
            return;
        }
        
        // Show container using PracticeMode utility
        if (!PracticeMode.showContainer('parallelQuestionContainer', 'parallelSubmit')) {
            showResult('Error: Could not display multiple choice. Please refresh the page.', 'error');
            return;
        }
        
        // Display multiple choice options
        PracticeMode.displayMultipleChoice('parallelOptions', options, 'parallel', 'Which equation represents a line parallel to the base line that passes through the given point?');
        
        // Clear result area
        const resultArea = document.getElementById('parallelResult');
        resultArea.textContent = '';
        resultArea.className = 'result-area';
        
        gameState.questionAnswered = false;
        console.log(`PracticeMode: Parallel question displayed successfully in ${gameState.mode} mode`);
    } catch (error) {
        console.error('PracticeMode: Error in handleParallelCalculate:', error);
        showResult('Error: ' + error.message, 'error');
    }
}

function handleParallelSubmit() {
    if (gameState.questionAnswered || !currentQuestionData) {
        return;
    }
    
    // Get selected answer
    const selected = document.querySelector('input[name="parallel"]:checked');
    if (!selected) {
        showResult('Please select an answer.', 'error');
        return;
    }
    
    // Check if answer is correct using dataset.correct
    const isCorrect = String(selected.dataset.correct) === 'true';
    
    // Disable all radio buttons
    document.querySelectorAll('input[name="parallel"]').forEach(radio => {
        radio.disabled = true;
    });
    
    // Highlight correct/incorrect options
    document.querySelectorAll('#parallelOptions .radio-option').forEach(opt => {
        const radio = opt.querySelector('input');
        if (radio && radio.dataset.correct === 'true') {
            opt.classList.add('correct');
        } else if (radio && radio.checked && radio.dataset.correct === 'false') {
            opt.classList.add('incorrect');
        }
    });
    
    // Generate feedback
    if (isCorrect) {
        showResult('Correct! ✓', 'success');
        updateStats('parallel', true);
    } else {
        const correctOption = currentQuestionData.options.find(opt => opt.correct);
        showResult(`Incorrect. Correct answer: ${correctOption.value}`, 'error');
        updateStats('parallel', false);
    }
    
    gameState.questionAnswered = true;
}

function handlePerpendicularCalculate() {
    // Validate input elements exist
    const equationInput = document.getElementById('perpendicularEquationInput');
    const pointInput = document.getElementById('perpendicularPointInput');
    
    if (!equationInput || !pointInput) {
        console.error('PracticeMode: Perpendicular input elements not found');
        showResult('Error: Input fields not found. Please refresh the page.', 'error');
        return;
    }
    
    const equation = equationInput.value.trim();
    const pointStr = pointInput.value.trim();
    
    if (!equation || !pointStr) {
        showResult('Please enter both the base equation and a point.', 'error');
        return;
    }
    
    try {
        // Parse inputs
        const baseLine = parseEquation(equation);
        const point = parsePoint(pointStr);
        const resultLine = findPerpendicularLine(baseLine, point);
        
        // Generate multiple choice options
        const equationDistractors = generateEquationDistractors(resultLine, baseLine, point, false);
        const correctEq = formatEquation(resultLine);
        
        const options = [
            { value: correctEq, correct: true },
            { value: equationDistractors[0], correct: false },
            { value: equationDistractors[1], correct: false },
            { value: equationDistractors[2], correct: false }
        ].sort(() => Math.random() - 0.5);
        
        // Store question data
        currentQuestionData = {
            type: 'perpendicular',
            options: options
        };
        
        // Validate required elements exist
        const requiredElements = [
            'perpendicularQuestionContainer',
            'perpendicularOptions',
            'perpendicularSubmit',
            'perpendicularResult'
        ];
        
        if (!PracticeMode.validateElements(requiredElements)) {
            showResult('Error: UI elements not found. Please refresh the page.', 'error');
            return;
        }
        
        // Show container using PracticeMode utility
        if (!PracticeMode.showContainer('perpendicularQuestionContainer', 'perpendicularSubmit')) {
            showResult('Error: Could not display multiple choice. Please refresh the page.', 'error');
            return;
        }
        
        // Display multiple choice options
        PracticeMode.displayMultipleChoice('perpendicularOptions', options, 'perpendicular', 'Which equation represents a line perpendicular to the base line that passes through the given point?');
        
        // Clear result area
        const resultArea = document.getElementById('perpendicularResult');
        resultArea.textContent = '';
        resultArea.className = 'result-area';
        
        gameState.questionAnswered = false;
        console.log(`PracticeMode: Perpendicular question displayed successfully in ${gameState.mode} mode`);
    } catch (error) {
        console.error('PracticeMode: Error in handlePerpendicularCalculate:', error);
        showResult('Error: ' + error.message, 'error');
    }
}

function handlePerpendicularSubmit() {
    if (gameState.questionAnswered || !currentQuestionData) {
        return;
    }
    
    // Get selected answer
    const selected = document.querySelector('input[name="perpendicular"]:checked');
    if (!selected) {
        showResult('Please select an answer.', 'error');
        return;
    }
    
    // Check if answer is correct using dataset.correct
    const isCorrect = String(selected.dataset.correct) === 'true';
    
    // Disable all radio buttons
    document.querySelectorAll('input[name="perpendicular"]').forEach(radio => {
        radio.disabled = true;
    });
    
    // Highlight correct/incorrect options
    document.querySelectorAll('#perpendicularOptions .radio-option').forEach(opt => {
        const radio = opt.querySelector('input');
        if (radio && radio.dataset.correct === 'true') {
            opt.classList.add('correct');
        } else if (radio && radio.checked && radio.dataset.correct === 'false') {
            opt.classList.add('incorrect');
        }
    });
    
    // Generate feedback
    if (isCorrect) {
        showResult('Correct! ✓', 'success');
        updateStats('perpendicular', true);
    } else {
        const correctOption = currentQuestionData.options.find(opt => opt.correct);
        showResult(`Incorrect. Correct answer: ${correctOption.value}`, 'error');
        updateStats('perpendicular', false);
    }
    
    gameState.questionAnswered = true;
}

// ============================================================================
// NEW PROBLEM TYPES: Intercepts, Rate of Change, Linear Functions, Standard Form
// ============================================================================

// Graph Rendering System
function drawGraph(canvasId, line, xIntercept, yIntercept) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set bounds (adjust as needed)
    const xMin = -10, xMax = 10;
    const yMin = -10, yMax = 10;
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;
    
    // Helper to convert graph coordinates to canvas coordinates
    const toCanvasX = (x) => padding + ((x - xMin) / xRange) * graphWidth;
    const toCanvasY = (y) => padding + graphHeight - ((y - yMin) / yRange) * graphHeight;
    
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, toCanvasY(0));
    ctx.lineTo(width - padding, toCanvasY(0));
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(toCanvasX(0), padding);
    ctx.lineTo(toCanvasX(0), height - padding);
    ctx.stroke();
    
    // Draw grid lines
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    for (let x = xMin; x <= xMax; x++) {
        if (x !== 0) {
            ctx.beginPath();
            ctx.moveTo(toCanvasX(x), padding);
            ctx.lineTo(toCanvasX(x), height - padding);
            ctx.stroke();
        }
    }
    for (let y = yMin; y <= yMax; y++) {
        if (y !== 0) {
            ctx.beginPath();
            ctx.moveTo(padding, toCanvasY(y));
            ctx.lineTo(width - padding, toCanvasY(y));
            ctx.stroke();
        }
    }
    
    // Draw line
    if (line.kind === 'vertical') {
        ctx.strokeStyle = '#0066cc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(toCanvasX(line.x0), padding);
        ctx.lineTo(toCanvasX(line.x0), height - padding);
        ctx.stroke();
    } else {
        ctx.strokeStyle = '#0066cc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        let firstPoint = true;
        for (let x = xMin; x <= xMax; x += 0.1) {
            const y = line.m * x + line.b;
            if (y >= yMin && y <= yMax) {
                if (firstPoint) {
                    ctx.moveTo(toCanvasX(x), toCanvasY(y));
                    firstPoint = false;
                } else {
                    ctx.lineTo(toCanvasX(x), toCanvasY(y));
                }
            }
        }
        ctx.stroke();
    }
    
    // Highlight intercepts
    if (xIntercept !== null && xIntercept !== undefined) {
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(toCanvasX(xIntercept), toCanvasY(0), 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.fillText(`(${xIntercept}, 0)`, toCanvasX(xIntercept) + 8, toCanvasY(0) - 8);
    }
    
    if (yIntercept !== null && yIntercept !== undefined) {
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(toCanvasX(0), toCanvasY(yIntercept), 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.fillText(`(0, ${yIntercept})`, toCanvasX(0) + 8, toCanvasY(yIntercept) - 8);
    }
    
    // Draw axis labels
    ctx.fillStyle = '#000';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('x', width - padding + 10, toCanvasY(0) + 5);
    ctx.textAlign = 'left';
    ctx.fillText('y', toCanvasX(0) + 5, padding - 10);
}

// ============================================================================
// MILESTONE 19: Interactive Graphing Practice
// ============================================================================

/**
 * InteractiveGraph - Canvas-based interactive graphing component
 * Features: Click to select points, auto-draw lines, visual feedback
 */
class InteractiveGraph {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`InteractiveGraph: Canvas not found: ${canvasId}`);
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.canvasId = canvasId;
        
        // Graph configuration
        this.width = this.canvas.width || 500;
        this.height = this.canvas.height || 500;
        this.padding = 40;
        this.graphWidth = this.width - 2 * this.padding;
        this.graphHeight = this.height - 2 * this.padding;
        
        // Coordinate system bounds
        this.xMin = options.xMin || -9;
        this.xMax = options.xMax || 9;
        this.yMin = options.yMin || -9;
        this.yMax = options.yMax || 9;
        this.xRange = this.xMax - this.xMin;
        this.yRange = this.yMax - this.yMin;
        
        // State
        this.availablePoints = options.availablePoints || [];  // Array of {x, y} points
        this.correctPoints = options.correctPoints || [];      // Array of correct point objects
        this.selectedPoints = [];                               // User's selected points (max 2)
        this.lines = [];                                        // Lines to draw
        this.isAnswered = false;
        this.hitThreshold = 15;  // Pixels for hit detection
        
        // Callbacks
        this.onPointSelected = options.onPointSelected || null;
        this.onPointDeselected = options.onPointDeselected || null;
        this.onLineDrawn = options.onLineDrawn || null;
        
        // Visual styles
        this.styles = {
            unselected: { fill: '#666', radius: 6 },
            selected: { fill: '#0066cc', radius: 8 },
            correct: { fill: '#00cc00', radius: 8 },
            incorrect: { fill: '#cc0000', radius: 8 }
        };
        
        // Bind event listeners
        this.canvas.addEventListener('click', this.handleClick.bind(this));
        this.canvas.addEventListener('dblclick', this.handleDoubleClick.bind(this));
        
        // Initial draw
        this.draw();
    }
    
    /**
     * Convert graph coordinates to canvas coordinates
     */
    toCanvasX(x) {
        return this.padding + ((x - this.xMin) / this.xRange) * this.graphWidth;
    }
    
    toCanvasY(y) {
        return this.padding + this.graphHeight - ((y - this.yMin) / this.yRange) * this.graphHeight;
    }
    
    /**
     * Convert canvas coordinates to graph coordinates
     */
    toGraphX(canvasX) {
        return this.xMin + ((canvasX - this.padding) / this.graphWidth) * this.xRange;
    }
    
    toGraphY(canvasY) {
        return this.yMin + ((this.padding + this.graphHeight - canvasY) / this.graphHeight) * this.yRange;
    }
    
    /**
     * Handle canvas click - select point
     */
    handleClick(event) {
        if (this.isAnswered) return;  // Don't allow selection after answer submitted
        if (this.selectedPoints.length >= 2) return;  // Max 2 points
        
        const rect = this.canvas.getBoundingClientRect();
        const canvasX = event.clientX - rect.left;
        const canvasY = event.clientY - rect.top;
        
        // Find nearest available point
        const clickedPoint = this.findNearestPoint(canvasX, canvasY);
        
        if (clickedPoint && !this.isPointSelected(clickedPoint)) {
            this.selectedPoints.push(clickedPoint);
            this.draw();
            
            // Callback
            if (this.onPointSelected) {
                this.onPointSelected(clickedPoint, this.selectedPoints.length);
            }
            
            // Auto-draw line when 2 points selected
            if (this.selectedPoints.length === 2) {
                this.drawUserLine();
                if (this.onLineDrawn) {
                    this.onLineDrawn(this.selectedPoints);
                }
            }
        }
    }
    
    /**
     * Handle double-click - deselect point
     */
    handleDoubleClick(event) {
        if (this.isAnswered) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const canvasX = event.clientX - rect.left;
        const canvasY = event.clientY - rect.top;
        
        // Find if double-clicked on a selected point
        const clickedPoint = this.findNearestPoint(canvasX, canvasY);
        
        if (clickedPoint && this.isPointSelected(clickedPoint)) {
            // Remove from selected
            this.selectedPoints = this.selectedPoints.filter(p => 
                !(p.x === clickedPoint.x && p.y === clickedPoint.y)
            );
            this.draw();
            
            // Callback
            if (this.onPointDeselected) {
                this.onPointDeselected(clickedPoint, this.selectedPoints.length);
            }
        }
    }
    
    /**
     * Find nearest available point to canvas coordinates
     */
    findNearestPoint(canvasX, canvasY) {
        let nearest = null;
        let minDistance = this.hitThreshold;
        
        for (const point of this.availablePoints) {
            const px = this.toCanvasX(point.x);
            const py = this.toCanvasY(point.y);
            const distance = Math.sqrt((canvasX - px) ** 2 + (canvasY - py) ** 2);
            
            if (distance < minDistance) {
                minDistance = distance;
                nearest = point;
            }
        }
        
        return nearest;
    }
    
    /**
     * Check if point is already selected
     */
    isPointSelected(point) {
        return this.selectedPoints.some(p => p.x === point.x && p.y === point.y);
    }
    
    /**
     * Draw user's line through 2 selected points
     */
    drawUserLine() {
        if (this.selectedPoints.length !== 2) return;
        
        const [p1, p2] = this.selectedPoints;
        
        this.ctx.strokeStyle = '#0066cc';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([]);
        this.ctx.beginPath();
        
        // Calculate line parameters
        if (p1.x === p2.x) {
            // Vertical line
            const x = this.toCanvasX(p1.x);
            this.ctx.moveTo(x, this.padding);
            this.ctx.lineTo(x, this.height - this.padding);
        } else {
            // Slope-intercept form
            const m = (p2.y - p1.y) / (p2.x - p1.x);
            const b = p1.y - m * p1.x;
            
            // Draw across graph bounds
            for (let x = this.xMin; x <= this.xMax; x += 0.1) {
                const y = m * x + b;
                if (y >= this.yMin && y <= this.yMax) {
                    const cx = this.toCanvasX(x);
                    const cy = this.toCanvasY(y);
                    if (x === this.xMin || (Math.abs(x - this.xMin) < 0.15)) {
                        this.ctx.moveTo(cx, cy);
                    } else {
                        this.ctx.lineTo(cx, cy);
                    }
                }
            }
        }
        
        this.ctx.stroke();
    }
    
    /**
     * Main draw function
     */
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw grid and axes
        this.drawGrid();
        this.drawAxes();
        
        // Draw any additional lines
        for (const line of this.lines) {
            this.drawLine(line);
        }
        
        // Draw user line if 2 points selected
        if (this.selectedPoints.length === 2) {
            this.drawUserLine();
        }
        
        // Draw available points
        for (const point of this.availablePoints) {
            const isSelected = this.isPointSelected(point);
            const style = isSelected ? this.styles.selected : this.styles.unselected;
            this.drawPoint(point, style);
        }
    }
    
    /**
     * Draw grid lines
     */
    drawGrid() {
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([]);
        
        // Vertical grid lines
        for (let x = this.xMin; x <= this.xMax; x++) {
            if (x !== 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.toCanvasX(x), this.padding);
                this.ctx.lineTo(this.toCanvasX(x), this.height - this.padding);
                this.ctx.stroke();
            }
        }
        
        // Horizontal grid lines
        for (let y = this.yMin; y <= this.yMax; y++) {
            if (y !== 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.padding, this.toCanvasY(y));
                this.ctx.lineTo(this.width - this.padding, this.toCanvasY(y));
                this.ctx.stroke();
            }
        }
    }
    
    /**
     * Draw coordinate axes
     */
    drawAxes() {
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([]);
        
        // X-axis
        this.ctx.beginPath();
        this.ctx.moveTo(this.padding, this.toCanvasY(0));
        this.ctx.lineTo(this.width - this.padding, this.toCanvasY(0));
        this.ctx.stroke();
        
        // Y-axis
        this.ctx.beginPath();
        this.ctx.moveTo(this.toCanvasX(0), this.padding);
        this.ctx.lineTo(this.toCanvasX(0), this.height - this.padding);
        this.ctx.stroke();
        
        // Axis labels
        this.ctx.fillStyle = '#000';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('x', this.width - this.padding + 15, this.toCanvasY(0) + 5);
        this.ctx.textAlign = 'left';
        this.ctx.fillText('y', this.toCanvasX(0) + 5, this.padding - 10);
    }
    
    /**
     * Draw a single point
     */
    drawPoint(point, style) {
        this.ctx.fillStyle = style.fill;
        this.ctx.beginPath();
        this.ctx.arc(this.toCanvasX(point.x), this.toCanvasY(point.y), style.radius, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Draw point label
        this.ctx.fillStyle = '#000';
        this.ctx.font = '11px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`(${point.x},${point.y})`, this.toCanvasX(point.x), this.toCanvasY(point.y) - 12);
    }
    
    /**
     * Draw a line (equation or two points)
     */
    drawLine(line) {
        this.ctx.strokeStyle = line.color || '#0066cc';
        this.ctx.lineWidth = line.width || 2;
        this.ctx.setLineDash(line.dashed ? [5, 5] : []);
        this.ctx.beginPath();
        
        if (line.kind === 'vertical') {
            const x = this.toCanvasX(line.x0);
            this.ctx.moveTo(x, this.padding);
            this.ctx.lineTo(x, this.height - this.padding);
        } else {
            // Slope-intercept: y = mx + b
            const m = line.m;
            const b = line.b;
            
            let firstPoint = true;
            for (let x = this.xMin; x <= this.xMax; x += 0.1) {
                const y = m * x + b;
                if (y >= this.yMin && y <= this.yMax) {
                    const cx = this.toCanvasX(x);
                    const cy = this.toCanvasY(y);
                    if (firstPoint) {
                        this.ctx.moveTo(cx, cy);
                        firstPoint = false;
                    } else {
                        this.ctx.lineTo(cx, cy);
                    }
                }
            }
        }
        
        this.ctx.stroke();
    }
    
    /**
     * Set available points for selection
     */
    setAvailablePoints(points) {
        this.availablePoints = points;
        this.draw();
    }
    
    /**
     * Set correct points (for validation)
     */
    setCorrectPoints(points) {
        this.correctPoints = points;
    }
    
    /**
     * Add a line to display
     */
    addLine(line) {
        this.lines.push(line);
        this.draw();
    }
    
    /**
     * Clear all lines
     */
    clearLines() {
        this.lines = [];
        this.draw();
    }
    
    /**
     * Reset selection
     */
    resetSelection() {
        this.selectedPoints = [];
        this.isAnswered = false;
        this.draw();
    }
    
    /**
     * Mark as answered and show feedback
     */
    showFeedback(isCorrect) {
        this.isAnswered = true;
        
        // Update point styles based on correctness
        for (const point of this.selectedPoints) {
            const isCorrectPoint = this.correctPoints.some(cp => cp.x === point.x && cp.y === point.y);
            point.feedbackStyle = isCorrectPoint ? this.styles.correct : this.styles.incorrect;
        }
        
        // Redraw with feedback styles
        this.drawWithFeedback();
        
        // If incorrect, show correct answer overlay
        if (!isCorrect && this.correctPoints.length === 2) {
            this.drawCorrectAnswerOverlay();
        }
    }
    
    /**
     * Draw with feedback styles
     */
    drawWithFeedback() {
        // Clear and redraw base
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawGrid();
        this.drawAxes();
        
        // Draw lines
        for (const line of this.lines) {
            this.drawLine(line);
        }
        
        // Draw user line
        if (this.selectedPoints.length === 2) {
            this.drawUserLine();
        }
        
        // Draw points with feedback styles
        for (const point of this.availablePoints) {
            const selected = this.selectedPoints.find(p => p.x === point.x && p.y === point.y);
            let style = this.styles.unselected;
            
            if (selected && selected.feedbackStyle) {
                style = selected.feedbackStyle;
            } else if (selected) {
                style = this.styles.selected;
            }
            
            this.drawPoint(point, style);
        }
    }
    
    /**
     * Draw correct answer overlay (dashed green line)
     */
    drawCorrectAnswerOverlay() {
        const [p1, p2] = this.correctPoints;
        
        this.ctx.strokeStyle = '#00cc00';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([8, 4]);
        this.ctx.beginPath();
        
        if (p1.x === p2.x) {
            // Vertical line
            const x = this.toCanvasX(p1.x);
            this.ctx.moveTo(x, this.padding);
            this.ctx.lineTo(x, this.height - this.padding);
        } else {
            // Slope-intercept
            const m = (p2.y - p1.y) / (p2.x - p1.x);
            const b = p1.y - m * p1.x;
            
            let firstPoint = true;
            for (let x = this.xMin; x <= this.xMax; x += 0.1) {
                const y = m * x + b;
                if (y >= this.yMin && y <= this.yMax) {
                    const cx = this.toCanvasX(x);
                    const cy = this.toCanvasY(y);
                    if (firstPoint) {
                        this.ctx.moveTo(cx, cy);
                        firstPoint = false;
                    } else {
                        this.ctx.lineTo(cx, cy);
                    }
                }
            }
        }
        
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
    
    /**
     * Get selected points
     */
    getSelectedPoints() {
        return this.selectedPoints;
    }
    
    /**
     * Check if selection is correct
     */
    validateSelection() {
        if (this.selectedPoints.length !== 2 || this.correctPoints.length !== 2) {
            return false;
        }
        
        // Check if both selected points match correct points (in any order)
        const selected1Correct = this.correctPoints.some(cp => 
            cp.x === this.selectedPoints[0].x && cp.y === this.selectedPoints[0].y
        );
        const selected2Correct = this.correctPoints.some(cp => 
            cp.x === this.selectedPoints[1].x && cp.y === this.selectedPoints[1].y
        );
        
        return selected1Correct && selected2Correct;
    }
}

// ============================================================================
// MILESTONE 19: Interactive Graphing - Problem Generators
// ============================================================================

/**
 * Helper: Generate distractor points near but not on the line
 */
function generateDistractorPoints(correctPoints, lineEquation, count = 6) {
    const distractors = [];
    const usedPoints = new Set(correctPoints.map(p => `${p.x},${p.y}`));
    const attempts = 0;
    const maxAttempts = 100;
    
    while (distractors.length < count && attempts < maxAttempts) {
        // Pick random grid point in range -9 to 9
        const x = randomInt(-9, 9);
        const y = randomInt(-9, 9);
        const pointKey = `${x},${y}`;
        
        // Skip if already used
        if (usedPoints.has(pointKey)) continue;
        
        // Check if point is NOT on the line (with small tolerance)
        const isOnLine = isPointOnLineEquation({ x, y }, lineEquation, 0.01);
        
        if (!isOnLine) {
            distractors.push({ x, y });
            usedPoints.add(pointKey);
        }
    }
    
    // If we don't have enough distractors, fill with random points
    while (distractors.length < count) {
        const x = randomInt(-9, 9);
        const y = randomInt(-9, 9);
        const pointKey = `${x},${y}`;
        if (!usedPoints.has(pointKey)) {
            distractors.push({ x, y });
            usedPoints.add(pointKey);
        }
    }
    
    return distractors;
}

/**
 * Helper: Check if point is on line equation (with tolerance)
 */
function isPointOnLineEquation(point, equation, tolerance = 0.01) {
    if (equation.kind === 'vertical') {
        return Math.abs(point.x - equation.x0) < tolerance;
    }
    
    // y = mx + b
    const expectedY = equation.m * point.x + equation.b;
    return Math.abs(point.y - expectedY) < tolerance;
}

/**
 * 1. Graph from Slope-Intercept Equation
 * Given: y = mx + b
 * Task: Select 2 points that lie on this line
 */
function generateGraphSlopeInterceptQuestion() {
    // Use simple slopes from whitelist
    const simpleSlopes = [-2, -1, -0.5, 0, 0.5, 1, 2];
    const m = simpleSlopes[randomInt(0, simpleSlopes.length - 1)];
    const b = randomInt(-5, 5);
    
    // Generate equation string
    const equation = buildSlopeInterceptFromMB(m, b);
    
    // Calculate 2 correct points on the line
    const correctPoints = [];
    const x1 = randomInt(-5, 0);
    const y1 = m * x1 + b;
    if (y1 >= -9 && y1 <= 9 && Number.isInteger(y1)) {
        correctPoints.push({ x: x1, y: y1 });
    }
    
    const x2 = randomInt(1, 5);
    const y2 = m * x2 + b;
    if (y2 >= -9 && y2 <= 9 && Number.isInteger(y2) && correctPoints.length < 2) {
        correctPoints.push({ x: x2, y: y2 });
    }
    
    // If we don't have 2 valid points, try y-intercept and another
    if (correctPoints.length < 2) {
        correctPoints.length = 0;
        // Y-intercept
        if (b >= -9 && b <= 9) {
            correctPoints.push({ x: 0, y: b });
        }
        // Find another point
        for (let x = -9; x <= 9 && correctPoints.length < 2; x++) {
            if (x === 0) continue;
            const y = m * x + b;
            if (y >= -9 && y <= 9 && Number.isInteger(y)) {
                correctPoints.push({ x, y });
            }
        }
    }
    
    // Generate 6 distractor points
    const lineEquation = { kind: 'slope', m, b };
    const distractors = generateDistractorPoints(correctPoints, lineEquation, 6);
    
    // Combine and shuffle
    const allPoints = [...correctPoints, ...distractors].sort(() => Math.random() - 0.5);
    
    return {
        type: 'graph-slopeintercept',
        direction: 'equationToGraph',
        question: `Graph the line: ${equation}`,
        equation: equation,
        equationData: { m, b },
        availablePoints: allPoints,
        correctPoints: correctPoints,
        mode: 'interactive-graph'
    };
}

/**
 * 2. Identify Slope-Intercept from Graph
 * Given: Graph showing a line
 * Task: Write equation in y = mx + b form
 */
function generateIdentifySlopeInterceptQuestion() {
    // Pick 2 random grid points
    const x1 = randomInt(-6, -1);
    const y1 = randomInt(-6, 6);
    const x2 = randomInt(1, 6);
    
    // Calculate slope
    const m = (x2 - x1 !== 0) ? (y1 + randomInt(-3, 3) - y1) / (x2 - x1) : randomInt(-2, 2);
    const simpleM = Math.round(m * 2) / 2;  // Round to nearest 0.5
    
    // Calculate y-intercept
    const b = y1 - simpleM * x1;
    
    // Ensure y2 is valid
    const y2 = simpleM * x2 + b;
    
    // Points for display
    const point1 = { x: x1, y: y1 };
    const point2 = { x: x2, y: Math.round(y2) };
    
    // Correct equation
    const correctEq = buildSlopeInterceptFromMB(simpleM, Math.round(b));
    
    return {
        type: 'identifySlopeIntercept',
        direction: 'graphToEquation',
        question: 'What is the equation of the line shown?',
        displayPoints: [point1, point2],
        lineData: { kind: 'slope', m: simpleM, b: Math.round(b) },
        correctEquation: correctEq,
        mode: 'text-input'
    };
}

/**
 * 3. Graph from Point-Slope Equation
 * Given: y - y1 = m(x - x1)
 * Task: Select 2 points on this line
 */
function generateGraphPointSlopeQuestion() {
    // Generate slope and point
    const simpleSlopes = [-2, -1, -0.5, 0, 0.5, 1, 2];
    const m = simpleSlopes[randomInt(0, simpleSlopes.length - 1)];
    const x1 = randomInt(-5, 5);
    const y1 = randomInt(-5, 5);
    
    // Build point-slope equation
    const equation = buildPointSlopeForm(m, { x: x1, y: y1 });
    
    // Calculate b for line equation (y = mx + b)
    const b = y1 - m * x1;
    
    // Find 2 correct points on the line
    const correctPoints = [];
    // Include the given point
    correctPoints.push({ x: x1, y: y1 });
    
    // Find another point
    for (let x = -9; x <= 9 && correctPoints.length < 2; x++) {
        if (x === x1) continue;
        const y = m * x + b;
        if (y >= -9 && y <= 9 && Number.isInteger(y)) {
            correctPoints.push({ x, y });
            break;
        }
    }
    
    // Generate distractors
    const lineEquation = { kind: 'slope', m, b };
    const distractors = generateDistractorPoints(correctPoints, lineEquation, 6);
    
    // Combine and shuffle
    const allPoints = [...correctPoints, ...distractors].sort(() => Math.random() - 0.5);
    
    return {
        type: 'graph-pointslope',
        direction: 'equationToGraph',
        question: `Graph the line: ${equation}`,
        equation: equation,
        equationData: { m, x1, y1, b },
        availablePoints: allPoints,
        correctPoints: correctPoints,
        mode: 'interactive-graph'
    };
}

/**
 * 4. Identify Point-Slope from Graph
 * Given: Graph showing a line
 * Task: Write equation in point-slope form
 */
function generateIdentifyPointSlopeQuestion() {
    // Pick 2 grid points
    const x1 = randomInt(-6, 6);
    const y1 = randomInt(-6, 6);
    const x2 = randomInt(-6, 6);
    const y2 = randomInt(-6, 6);
    
    if (x1 === x2) return generateIdentifyPointSlopeQuestion();  // Retry if vertical
    
    // Calculate slope
    const m = (y2 - y1) / (x2 - x1);
    const simpleM = Math.round(m * 2) / 2;  // Round to nearest 0.5
    
    // Use first point for equation
    const correctEq = buildPointSlopeForm(simpleM, { x: x1, y: y1 });
    
    return {
        type: 'identifyPointSlope',
        direction: 'graphToEquation',
        question: 'What is the equation of the line shown in point-slope form?',
        displayPoints: [{ x: x1, y: y1 }, { x: x2, y: y2 }],
        lineData: { kind: 'slope', m: simpleM, b: y1 - simpleM * x1 },
        correctEquation: correctEq,
        mode: 'text-input'
    };
}

/**
 * 5. Graph Parallel Line
 * Given: Base equation and a point
 * Task: First graph base line, then graph parallel line through point
 */
function generateGraphParallelQuestion() {
    // Generate base equation
    const simpleSlopes = [-2, -1, -0.5, 0.5, 1, 2];
    const m = simpleSlopes[randomInt(0, simpleSlopes.length - 1)];
    const b = randomInt(-5, 5);
    const baseEq = buildSlopeInterceptFromMB(m, b);
    
    // Generate point for parallel line
    const pointX = randomInt(-5, 5);
    const pointY = randomInt(-5, 5);
    
    // Calculate parallel line (same slope, through point)
    const parallelB = pointY - m * pointX;
    
    // Find 2 points on base line
    const basePoints = [];
    for (let x = -9; x <= 9 && basePoints.length < 2; x++) {
        const y = m * x + b;
        if (y >= -9 && y <= 9 && Number.isInteger(y)) {
            basePoints.push({ x, y });
        }
    }
    
    // Find 2 points on parallel line
    const parallelPoints = [];
    parallelPoints.push({ x: pointX, y: pointY });
    for (let x = -9; x <= 9 && parallelPoints.length < 2; x++) {
        if (x === pointX) continue;
        const y = m * x + parallelB;
        if (y >= -9 && y <= 9 && Number.isInteger(y)) {
            parallelPoints.push({ x, y });
            break;
        }
    }
    
    // Generate distractors for each line
    const baseLineEq = { kind: 'slope', m, b };
    const parallelLineEq = { kind: 'slope', m, b: parallelB };
    const baseDistractors = generateDistractorPoints(basePoints, baseLineEq, 3);
    const parallelDistractors = generateDistractorPoints(parallelPoints, parallelLineEq, 3);
    
    return {
        type: 'graph-parallel',
        direction: 'equationToGraph',
        question: `Graph the line ${baseEq}, then graph a line parallel to it through point (${pointX}, ${pointY})`,
        baseEquation: baseEq,
        throughPoint: { x: pointX, y: pointY },
        steps: [
            {
                instruction: `Step 1: Graph the base line ${baseEq}`,
                availablePoints: [...basePoints, ...baseDistractors].sort(() => Math.random() - 0.5),
                correctPoints: basePoints
            },
            {
                instruction: `Step 2: Graph a parallel line through (${pointX}, ${pointY})`,
                availablePoints: [...parallelPoints, ...parallelDistractors].sort(() => Math.random() - 0.5),
                correctPoints: parallelPoints
            }
        ],
        mode: 'two-step-graph'
    };
}

/**
 * 6. Graph Perpendicular Line
 * Given: Base equation and a point
 * Task: First graph base line, then graph perpendicular line through point
 */
function generateGraphPerpendicularQuestion() {
    // Generate base equation (avoid m=0 for perpendicular)
    const simpleSlopes = [-2, -1, -0.5, 0.5, 1, 2];
    const m = simpleSlopes[randomInt(0, simpleSlopes.length - 1)];
    const b = randomInt(-5, 5);
    const baseEq = buildSlopeInterceptFromMB(m, b);
    
    // Calculate perpendicular slope
    const perpM = -1 / m;
    
    // Generate point for perpendicular line
    const pointX = randomInt(-5, 5);
    const pointY = randomInt(-5, 5);
    
    // Calculate perpendicular line
    const perpB = pointY - perpM * pointX;
    
    // Find 2 points on base line
    const basePoints = [];
    for (let x = -9; x <= 9 && basePoints.length < 2; x++) {
        const y = m * x + b;
        if (y >= -9 && y <= 9 && Number.isInteger(y)) {
            basePoints.push({ x, y });
        }
    }
    
    // Find 2 points on perpendicular line
    const perpPoints = [];
    perpPoints.push({ x: pointX, y: pointY });
    for (let x = -9; x <= 9 && perpPoints.length < 2; x++) {
        if (x === pointX) continue;
        const y = perpM * x + perpB;
        if (y >= -9 && y <= 9 && Number.isInteger(y)) {
            perpPoints.push({ x, y: Math.round(y) });
            break;
        }
    }
    
    // Generate distractors
    const baseLineEq = { kind: 'slope', m, b };
    const perpLineEq = { kind: 'slope', m: perpM, b: perpB };
    const baseDistractors = generateDistractorPoints(basePoints, baseLineEq, 3);
    const perpDistractors = generateDistractorPoints(perpPoints, perpLineEq, 3);
    
    return {
        type: 'graph-perpendicular',
        direction: 'equationToGraph',
        question: `Graph the line ${baseEq}, then graph a line perpendicular to it through point (${pointX}, ${pointY})`,
        baseEquation: baseEq,
        throughPoint: { x: pointX, y: pointY },
        steps: [
            {
                instruction: `Step 1: Graph the base line ${baseEq}`,
                availablePoints: [...basePoints, ...baseDistractors].sort(() => Math.random() - 0.5),
                correctPoints: basePoints
            },
            {
                instruction: `Step 2: Graph a perpendicular line through (${pointX}, ${pointY})`,
                availablePoints: [...perpPoints, ...perpDistractors].sort(() => Math.random() - 0.5),
                correctPoints: perpPoints
            }
        ],
        mode: 'two-step-graph'
    };
}

/**
 * 7. Graph from Absolute Value Equation
 * Given: y = a|bx + c| + d
 * Task: Select vertex and 2 side points (3 total)
 */
function generateGraphAbsoluteValueQuestion() {
    // Generate simple absolute value equation
    const a = randomInt(1, 2) * (Math.random() > 0.5 ? 1 : -1);  // 1 or -1
    const b = 1;  // Keep simple
    const c = randomInt(-3, 3);
    const d = randomInt(-3, 3);
    
    // Build equation string
    const equation = `y = ${a === 1 ? '' : a}|x${c >= 0 ? ' + ' : ' - '}${Math.abs(c)}|${d >= 0 ? ' + ' : ' - '}${Math.abs(d)}`;
    
    // Calculate vertex
    const vertexX = -c / b;
    const vertexY = d;
    
    // Find 2 additional points on the V
    const correctPoints = [];
    correctPoints.push({ x: Math.round(vertexX), y: Math.round(vertexY) });
    
    // Left side point
    const x1 = Math.round(vertexX) - 2;
    const y1 = a * Math.abs(b * x1 + c) + d;
    if (y1 >= -9 && y1 <= 9) {
        correctPoints.push({ x: x1, y: Math.round(y1) });
    }
    
    // Right side point
    const x2 = Math.round(vertexX) + 2;
    const y2 = a * Math.abs(b * x2 + c) + d;
    if (y2 >= -9 && y2 <= 9) {
        correctPoints.push({ x: x2, y: Math.round(y2) });
    }
    
    // Generate distractors (points not on the V)
    const distractors = [];
    for (let i = 0; i < 6 && distractors.length < 5; i++) {
        const x = randomInt(-9, 9);
        const expectedY = a * Math.abs(b * x + c) + d;
        const y = randomInt(-9, 9);
        
        // Only add if NOT on the curve
        if (Math.abs(y - expectedY) > 1) {
            const pointKey = `${x},${y}`;
            if (!correctPoints.some(p => p.x === x && p.y === y)) {
                distractors.push({ x, y });
            }
        }
    }
    
    // Fill remaining distractors
    while (distractors.length < 5) {
        distractors.push({ x: randomInt(-9, 9), y: randomInt(-9, 9) });
    }
    
    // Combine and shuffle
    const allPoints = [...correctPoints, ...distractors].sort(() => Math.random() - 0.5);
    
    return {
        type: 'graph-absolutevalue',
        direction: 'equationToGraph',
        question: `Graph the absolute value function: ${equation}`,
        equation: equation,
        equationData: { a, b, c, d, vertex: { x: Math.round(vertexX), y: Math.round(vertexY) } },
        availablePoints: allPoints,
        correctPoints: correctPoints,
        mode: 'interactive-graph',
        requirePoints: 3  // Need 3 points instead of 2
    };
}

/**
 * 8. Identify Absolute Value from Graph
 * Given: V-shaped graph
 * Task: Write equation in vertex form
 */
function generateIdentifyAbsoluteValueQuestion() {
    // Generate vertex
    const h = randomInt(-5, 5);
    const k = randomInt(-5, 5);
    const a = Math.random() > 0.5 ? 1 : -1;
    
    // Build equation
    const equation = `y = ${a === 1 ? '' : a}|x${h >= 0 ? ' - ' : ' + '}${Math.abs(h)}|${k >= 0 ? ' + ' : ' - '}${Math.abs(k)}`;
    
    // Calculate 3 points for display
    const vertex = { x: h, y: k };
    const leftPoint = { x: h - 2, y: k + a * 2 };
    const rightPoint = { x: h + 2, y: k + a * 2 };
    
    return {
        type: 'identifyAbsoluteValue',
        direction: 'graphToEquation',
        question: 'What is the equation of the absolute value function shown?',
        displayPoints: [vertex, leftPoint, rightPoint],
        vertex: vertex,
        correctEquation: equation,
        mode: 'text-input'
    };
}

// ============================================================================
// MILESTONE 19: Interactive Graphing - Practice Mode Handlers
// ============================================================================

// Storage for current interactive graph instances
let interactiveGraphs = {};
let currentGraphQuestion = null;

/**
 * Initialize an interactive graph for a given canvas
 */
function initializeInteractiveGraph(canvasId, questionData) {
    const graph = new InteractiveGraph(canvasId, {
        availablePoints: questionData.availablePoints || [],
        correctPoints: questionData.correctPoints || [],
        xMin: -9,
        xMax: 9,
        yMin: -9,
        yMax: 9
    });
    
    interactiveGraphs[canvasId] = graph;
    return graph;
}

/**
 * Handle Graph Slope-Intercept - Generate Question
 */
function handleGraphSlopeInterceptGenerate() {
    // Generate question
    const question = generateGraphSlopeInterceptQuestion();
    currentGraphQuestion = question;
    
    // Display question
    const questionEl = document.getElementById('graphSlopeInterceptQuestion');
    if (questionEl) {
        questionEl.textContent = question.question;
    }
    
    // Initialize interactive graph
    const graph = initializeInteractiveGraph('graphSlopeInterceptCanvas', question);
    
    // Clear result
    const resultEl = document.getElementById('graphSlopeInterceptResult');
    if (resultEl) {
        resultEl.textContent = '';
        resultEl.className = 'result-area';
    }
    
    console.log('Graph Slope-Intercept question generated:', question);
}

/**
 * Handle Graph Slope-Intercept - Submit Answer
 */
function handleGraphSlopeInterceptSubmit() {
    if (!currentGraphQuestion) return;
    
    const graph = interactiveGraphs['graphSlopeInterceptCanvas'];
    if (!graph) return;
    
    // Validate selection
    const isCorrect = graph.validateSelection();
    
    // Show feedback
    graph.showFeedback(isCorrect);
    
    // Display result
    const resultEl = document.getElementById('graphSlopeInterceptResult');
    if (resultEl) {
        if (isCorrect) {
            resultEl.textContent = '✓ Correct! You selected the right points on the line.';
            resultEl.className = 'result-area success';
            updateStats('graphSlopeIntercept', true);
        } else {
            resultEl.textContent = `✗ Incorrect. The correct points are shown in green with a dashed line.`;
            resultEl.className = 'result-area error';
            updateStats('graphSlopeIntercept', false);
        }
    }
    
    // Show Next button
    const nextBtn = document.getElementById('graphSlopeInterceptNext');
    if (nextBtn) nextBtn.style.display = 'inline-block';
}

/**
 * Handle Graph Point-Slope - Generate Question
 */
function handleGraphPointSlopeGenerate() {
    const question = generateGraphPointSlopeQuestion();
    currentGraphQuestion = question;
    
    const questionEl = document.getElementById('graphPointSlopeQuestion');
    if (questionEl) {
        questionEl.textContent = question.question;
    }
    
    initializeInteractiveGraph('graphPointSlopeCanvas', question);
    
    const resultEl = document.getElementById('graphPointSlopeResult');
    if (resultEl) {
        resultEl.textContent = '';
        resultEl.className = 'result-area';
    }
}

/**
 * Handle Graph Point-Slope - Submit Answer
 */
function handleGraphPointSlopeSubmit() {
    if (!currentGraphQuestion) return;
    
    const graph = interactiveGraphs['graphPointSlopeCanvas'];
    if (!graph) return;
    
    const isCorrect = graph.validateSelection();
    graph.showFeedback(isCorrect);
    
    const resultEl = document.getElementById('graphPointSlopeResult');
    if (resultEl) {
        if (isCorrect) {
            resultEl.textContent = '✓ Correct! You selected the right points on the line.';
            resultEl.className = 'result-area success';
            updateStats('graphPointSlope', true);
        } else {
            resultEl.textContent = `✗ Incorrect. The correct points are shown in green with a dashed line.`;
            resultEl.className = 'result-area error';
            updateStats('graphPointSlope', false);
        }
    }
    
    const nextBtn = document.getElementById('graphPointSlopeNext');
    if (nextBtn) nextBtn.style.display = 'inline-block';
}

/**
 * Handle Graph Parallel - Generate Question
 */
function handleGraphParallelGenerate() {
    const question = generateGraphParallelQuestion();
    currentGraphQuestion = question;
    currentGraphQuestion.currentStep = 0;  // Track which step we're on
    
    const questionEl = document.getElementById('graphParallelQuestion');
    if (questionEl) {
        questionEl.textContent = question.question;
    }
    
    // Show step 1
    const stepEl = document.getElementById('graphParallelStep');
    if (stepEl) {
        stepEl.textContent = question.steps[0].instruction;
    }
    
    // Initialize with step 1 points
    initializeInteractiveGraph('graphParallelCanvas', question.steps[0]);
    
    const resultEl = document.getElementById('graphParallelResult');
    if (resultEl) {
        resultEl.textContent = '';
        resultEl.className = 'result-area';
    }
}

/**
 * Handle Graph Parallel - Submit Answer
 */
function handleGraphParallelSubmit() {
    if (!currentGraphQuestion) return;
    
    const graph = interactiveGraphs['graphParallelCanvas'];
    if (!graph) return;
    
    const currentStep = currentGraphQuestion.currentStep || 0;
    const isCorrect = graph.validateSelection();
    
    if (isCorrect && currentStep === 0) {
        // Step 1 correct, move to step 2
        currentGraphQuestion.currentStep = 1;
        
        const resultEl = document.getElementById('graphParallelResult');
        if (resultEl) {
            resultEl.textContent = '✓ Step 1 complete! Now draw the parallel line.';
            resultEl.className = 'result-area success';
        }
        
        // Show step 2 instruction
        const stepEl = document.getElementById('graphParallelStep');
        if (stepEl) {
            stepEl.textContent = currentGraphQuestion.steps[1].instruction;
        }
        
        // Keep step 1 line, add step 2 points
        const step1Line = { kind: 'slope', m: currentGraphQuestion.steps[0].correctPoints[0].x !== currentGraphQuestion.steps[0].correctPoints[1].x ? 
            (currentGraphQuestion.steps[0].correctPoints[1].y - currentGraphQuestion.steps[0].correctPoints[0].y) / 
            (currentGraphQuestion.steps[0].correctPoints[1].x - currentGraphQuestion.steps[0].correctPoints[0].x) : Infinity,
            b: currentGraphQuestion.steps[0].correctPoints[0].y
        };
        graph.addLine(step1Line);
        
        // Reset for step 2
        graph.setAvailablePoints(currentGraphQuestion.steps[1].availablePoints);
        graph.setCorrectPoints(currentGraphQuestion.steps[1].correctPoints);
        graph.resetSelection();
        
    } else if (currentStep === 1) {
        // Final validation
        graph.showFeedback(isCorrect);
        
        const resultEl = document.getElementById('graphParallelResult');
        if (resultEl) {
            if (isCorrect) {
                resultEl.textContent = '✓ Excellent! Both lines are correct and parallel.';
                resultEl.className = 'result-area success';
                updateStats('graphParallel', true);
            } else {
                resultEl.textContent = '✗ Incorrect. The correct parallel line is shown in green.';
                resultEl.className = 'result-area error';
                updateStats('graphParallel', false);
            }
        }
        
        const nextBtn = document.getElementById('graphParallelNext');
        if (nextBtn) nextBtn.style.display = 'inline-block';
    } else {
        // Step 1 incorrect
        graph.showFeedback(false);
        const resultEl = document.getElementById('graphParallelResult');
        if (resultEl) {
            resultEl.textContent = '✗ Incorrect. Try again or click Next for a new question.';
            resultEl.className = 'result-area error';
        }
    }
}

/**
 * Handle Graph Perpendicular - Generate Question
 */
function handleGraphPerpendicularGenerate() {
    const question = generateGraphPerpendicularQuestion();
    currentGraphQuestion = question;
    currentGraphQuestion.currentStep = 0;
    
    const questionEl = document.getElementById('graphPerpendicularQuestion');
    if (questionEl) {
        questionEl.textContent = question.question;
    }
    
    const stepEl = document.getElementById('graphPerpendicularStep');
    if (stepEl) {
        stepEl.textContent = question.steps[0].instruction;
    }
    
    initializeInteractiveGraph('graphPerpendicularCanvas', question.steps[0]);
    
    const resultEl = document.getElementById('graphPerpendicularResult');
    if (resultEl) {
        resultEl.textContent = '';
        resultEl.className = 'result-area';
    }
}

/**
 * Handle Graph Perpendicular - Submit Answer
 */
function handleGraphPerpendicularSubmit() {
    if (!currentGraphQuestion) return;
    
    const graph = interactiveGraphs['graphPerpendicularCanvas'];
    if (!graph) return;
    
    const currentStep = currentGraphQuestion.currentStep || 0;
    const isCorrect = graph.validateSelection();
    
    if (isCorrect && currentStep === 0) {
        // Step 1 correct, move to step 2
        currentGraphQuestion.currentStep = 1;
        
        const resultEl = document.getElementById('graphPerpendicularResult');
        if (resultEl) {
            resultEl.textContent = '✓ Step 1 complete! Now draw the perpendicular line.';
            resultEl.className = 'result-area success';
        }
        
        const stepEl = document.getElementById('graphPerpendicularStep');
        if (stepEl) {
            stepEl.textContent = currentGraphQuestion.steps[1].instruction;
        }
        
        // Add step 1 line
        const step1Line = { kind: 'slope', m: currentGraphQuestion.steps[0].correctPoints[0].x !== currentGraphQuestion.steps[0].correctPoints[1].x ? 
            (currentGraphQuestion.steps[0].correctPoints[1].y - currentGraphQuestion.steps[0].correctPoints[0].y) / 
            (currentGraphQuestion.steps[0].correctPoints[1].x - currentGraphQuestion.steps[0].correctPoints[0].x) : Infinity,
            b: currentGraphQuestion.steps[0].correctPoints[0].y
        };
        graph.addLine(step1Line);
        
        // Reset for step 2
        graph.setAvailablePoints(currentGraphQuestion.steps[1].availablePoints);
        graph.setCorrectPoints(currentGraphQuestion.steps[1].correctPoints);
        graph.resetSelection();
        
    } else if (currentStep === 1) {
        graph.showFeedback(isCorrect);
        
        const resultEl = document.getElementById('graphPerpendicularResult');
        if (resultEl) {
            if (isCorrect) {
                resultEl.textContent = '✓ Excellent! Both lines are correct and perpendicular.';
                resultEl.className = 'result-area success';
                updateStats('graphPerpendicular', true);
            } else {
                resultEl.textContent = '✗ Incorrect. The correct perpendicular line is shown in green.';
                resultEl.className = 'result-area error';
                updateStats('graphPerpendicular', false);
            }
        }
        
        const nextBtn = document.getElementById('graphPerpendicularNext');
        if (nextBtn) nextBtn.style.display = 'inline-block';
    } else {
        graph.showFeedback(false);
        const resultEl = document.getElementById('graphPerpendicularResult');
        if (resultEl) {
            resultEl.textContent = '✗ Incorrect. Try again or click Next for a new question.';
            resultEl.className = 'result-area error';
        }
    }
}

/**
 * Handle Graph Absolute Value - Generate Question
 */
function handleGraphAbsoluteValueGenerate() {
    const question = generateGraphAbsoluteValueQuestion();
    currentGraphQuestion = question;
    
    const questionEl = document.getElementById('graphAbsoluteValueQuestion');
    if (questionEl) {
        questionEl.textContent = question.question;
    }
    
    // Initialize graph - note: absolute value needs 3 points, not 2
    const graph = initializeInteractiveGraph('graphAbsoluteValueCanvas', question);
    // Modify the graph to allow 3 points instead of 2
    graph.maxPoints = 3;
    
    const resultEl = document.getElementById('graphAbsoluteValueResult');
    if (resultEl) {
        resultEl.textContent = '';
        resultEl.className = 'result-area';
    }
}

/**
 * Handle Graph Absolute Value - Submit Answer
 */
function handleGraphAbsoluteValueSubmit() {
    if (!currentGraphQuestion) return;
    
    const graph = interactiveGraphs['graphAbsoluteValueCanvas'];
    if (!graph) return;
    
    // Check if 3 points selected
    const selectedPoints = graph.getSelectedPoints();
    if (selectedPoints.length !== 3) {
        const resultEl = document.getElementById('graphAbsoluteValueResult');
        if (resultEl) {
            resultEl.textContent = '⚠️ Please select exactly 3 points (vertex and 2 side points).';
            resultEl.className = 'result-area';
        }
        return;
    }
    
    // Validate: all 3 selected points must be in the correct points
    const isCorrect = selectedPoints.every(sp => 
        currentGraphQuestion.correctPoints.some(cp => cp.x === sp.x && cp.y === sp.y)
    );
    
    graph.showFeedback(isCorrect);
    
    const resultEl = document.getElementById('graphAbsoluteValueResult');
    if (resultEl) {
        if (isCorrect) {
            resultEl.textContent = '✓ Correct! You selected the vertex and correct side points.';
            resultEl.className = 'result-area success';
            updateStats('graphAbsoluteValue', true);
        } else {
            resultEl.textContent = `✗ Incorrect. The correct points are shown in green.`;
            resultEl.className = 'result-area error';
            updateStats('graphAbsoluteValue', false);
        }
    }
    
    const nextBtn = document.getElementById('graphAbsoluteValueNext');
    if (nextBtn) nextBtn.style.display = 'inline-block';
}

// ============================================================================
// MILESTONE 16: Enhanced Graph Component (Canvas-Based)
// ============================================================================

// Enhanced graph component for multiple lines, thumbnails, and advanced features
function drawGraphThumbnail(canvasId, line, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width || 200;
    const height = canvas.height || 200;
    const padding = 20;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set bounds
    const xMin = options.xMin !== undefined ? options.xMin : -10;
    const xMax = options.xMax !== undefined ? options.xMax : 10;
    const yMin = options.yMin !== undefined ? options.yMin : -10;
    const yMax = options.yMax !== undefined ? options.yMax : 10;
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;
    
    // Helper to convert graph coordinates to canvas coordinates
    const toCanvasX = (x) => padding + ((x - xMin) / xRange) * graphWidth;
    const toCanvasY = (y) => padding + graphHeight - ((y - yMin) / yRange) * graphHeight;
    
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, toCanvasY(0));
    ctx.lineTo(width - padding, toCanvasY(0));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(toCanvasX(0), padding);
    ctx.lineTo(toCanvasX(0), height - padding);
    ctx.stroke();
    
    // Draw line
    if (line.kind === 'vertical') {
        ctx.strokeStyle = options.color || '#0066cc';
        ctx.lineWidth = options.lineWidth || 2;
        ctx.beginPath();
        ctx.moveTo(toCanvasX(line.x0), padding);
        ctx.lineTo(toCanvasX(line.x0), height - padding);
        ctx.stroke();
    } else {
        ctx.strokeStyle = options.color || '#0066cc';
        ctx.lineWidth = options.lineWidth || 2;
        ctx.beginPath();
        let firstPoint = true;
        for (let x = xMin; x <= xMax; x += 0.2) {
            const y = line.m * x + line.b;
            if (y >= yMin && y <= yMax) {
                if (firstPoint) {
                    ctx.moveTo(toCanvasX(x), toCanvasY(y));
                    firstPoint = false;
                } else {
                    ctx.lineTo(toCanvasX(x), toCanvasY(y));
                }
            }
        }
        ctx.stroke();
    }
    
    // Draw label if provided
    if (options.label) {
        ctx.fillStyle = options.labelColor || '#000';
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(options.label, padding + 5, padding + 12);
    }
}

function drawMultipleLines(canvasId, lines, labels = []) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set bounds
    const xMin = -10, xMax = 10;
    const yMin = -10, yMax = 10;
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;
    
    // Helper to convert graph coordinates to canvas coordinates
    const toCanvasX = (x) => padding + ((x - xMin) / xRange) * graphWidth;
    const toCanvasY = (y) => padding + graphHeight - ((y - yMin) / yRange) * graphHeight;
    
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, toCanvasY(0));
    ctx.lineTo(width - padding, toCanvasY(0));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(toCanvasX(0), padding);
    ctx.lineTo(toCanvasX(0), height - padding);
    ctx.stroke();
    
    // Draw grid lines
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    for (let x = xMin; x <= xMax; x++) {
        if (x !== 0) {
            ctx.beginPath();
            ctx.moveTo(toCanvasX(x), padding);
            ctx.lineTo(toCanvasX(x), height - padding);
            ctx.stroke();
        }
    }
    for (let y = yMin; y <= yMax; y++) {
        if (y !== 0) {
            ctx.beginPath();
            ctx.moveTo(padding, toCanvasY(y));
            ctx.lineTo(width - padding, toCanvasY(y));
            ctx.stroke();
        }
    }
    
    // Draw each line with different colors
    const colors = ['#0066cc', '#cc6600', '#00cc66', '#cc0066'];
    lines.forEach((line, index) => {
        const color = colors[index % colors.length];
        const label = labels[index] || '';
        
        if (line.kind === 'vertical') {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(toCanvasX(line.x0), padding);
            ctx.lineTo(toCanvasX(line.x0), height - padding);
            ctx.stroke();
        } else {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            let firstPoint = true;
            for (let x = xMin; x <= xMax; x += 0.1) {
                const y = line.m * x + line.b;
                if (y >= yMin && y <= yMax) {
                    if (firstPoint) {
                        ctx.moveTo(toCanvasX(x), toCanvasY(y));
                        firstPoint = false;
                    } else {
                        ctx.lineTo(toCanvasX(x), toCanvasY(y));
                    }
                }
            }
            ctx.stroke();
        }
        
        // Draw label
        if (label) {
            ctx.fillStyle = color;
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            // Position label near a point on the line
            const labelX = xMin + (xMax - xMin) * 0.7;
            const labelY = line.kind === 'vertical' ? yMax - 1 : line.m * labelX + line.b;
            if (labelY >= yMin && labelY <= yMax) {
                ctx.fillText(label, toCanvasX(labelX) + 5, toCanvasY(labelY) - 5);
            }
        }
    });
    
    // Draw axis labels
    ctx.fillStyle = '#000';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('x', width - padding + 10, toCanvasY(0) + 5);
    ctx.textAlign = 'left';
    ctx.fillText('y', toCanvasX(0) + 5, padding - 10);
}

function drawAbsoluteValueGraph(canvasId, a, b, c, d) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Calculate vertex: solve bx + c = 0 for x
    const vertexX = -c / b;
    const vertexY = a * Math.abs(b * vertexX + c) + d;
    
    // Set bounds to include vertex
    const xMin = Math.min(-10, vertexX - 5);
    const xMax = Math.max(10, vertexX + 5);
    const yMin = Math.min(-10, vertexY - 5);
    const yMax = Math.max(10, vertexY + 5);
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;
    
    // Helper to convert graph coordinates to canvas coordinates
    const toCanvasX = (x) => padding + ((x - xMin) / xRange) * graphWidth;
    const toCanvasY = (y) => padding + graphHeight - ((y - yMin) / yRange) * graphHeight;
    
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, toCanvasY(0));
    ctx.lineTo(width - padding, toCanvasY(0));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(toCanvasX(0), padding);
    ctx.lineTo(toCanvasX(0), height - padding);
    ctx.stroke();
    
    // Draw grid lines
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    for (let x = Math.floor(xMin); x <= Math.ceil(xMax); x++) {
        if (x !== 0) {
            ctx.beginPath();
            ctx.moveTo(toCanvasX(x), padding);
            ctx.lineTo(toCanvasX(x), height - padding);
            ctx.stroke();
        }
    }
    for (let y = Math.floor(yMin); y <= Math.ceil(yMax); y++) {
        if (y !== 0) {
            ctx.beginPath();
            ctx.moveTo(padding, toCanvasY(y));
            ctx.lineTo(width - padding, toCanvasY(y));
            ctx.stroke();
        }
    }
    
    // Draw V-shaped absolute value graph
    ctx.strokeStyle = '#0066cc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Left side of vertex (bx + c < 0, so |bx + c| = -(bx + c))
    for (let x = xMin; x <= vertexX; x += 0.1) {
        const absValue = -(b * x + c);
        const y = a * absValue + d;
        if (y >= yMin && y <= yMax) {
            if (x === xMin) {
                ctx.moveTo(toCanvasX(x), toCanvasY(y));
            } else {
                ctx.lineTo(toCanvasX(x), toCanvasY(y));
            }
        }
    }
    
    // Right side of vertex (bx + c >= 0, so |bx + c| = bx + c)
    for (let x = vertexX; x <= xMax; x += 0.1) {
        const absValue = b * x + c;
        const y = a * absValue + d;
        if (y >= yMin && y <= yMax) {
            ctx.lineTo(toCanvasX(x), toCanvasY(y));
        }
    }
    
    ctx.stroke();
    
    // Highlight vertex
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(toCanvasX(vertexX), toCanvasY(vertexY), 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.fillText(`(${roundToDecimal(vertexX, 1)}, ${roundToDecimal(vertexY, 1)})`, toCanvasX(vertexX) + 8, toCanvasY(vertexY) - 8);
    
    // Draw axis labels
    ctx.fillStyle = '#000';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('x', width - padding + 10, toCanvasY(0) + 5);
    ctx.textAlign = 'left';
    ctx.fillText('y', toCanvasX(0) + 5, padding - 10);
    
    return { vertexX, vertexY };
}

// Helper function to get canvas coordinates from click
function getCanvasCoordinates(canvasId, clickX, clickY, bounds = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 }) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    const padding = 40;
    const graphWidth = canvas.width - 2 * padding;
    const graphHeight = canvas.height - 2 * padding;
    
    const xRange = bounds.xMax - bounds.xMin;
    const yRange = bounds.yMax - bounds.yMin;
    
    const canvasX = clickX - rect.left;
    const canvasY = clickY - rect.top;
    
    const graphX = bounds.xMin + ((canvasX - padding) / graphWidth) * xRange;
    const graphY = bounds.yMax - ((canvasY - padding) / graphHeight) * yRange;
    
    return { x: graphX, y: graphY };
}

// Intercept Calculation Functions
function findXIntercept(line) {
    if (line.kind === 'vertical') {
        return line.x0; // x-intercept is the x-value itself
    } else if (line.kind === 'slope') {
        if (line.m === 0) {
            return null; // Horizontal line has no x-intercept (unless y=0)
        }
        return -line.b / line.m;
    }
    return null;
}

function findYIntercept(line) {
    if (line.kind === 'vertical') {
        return null; // Vertical line has no y-intercept
    } else if (line.kind === 'slope') {
        return line.b;
    }
    return null;
}

// Rate of Change Calculation
function calculateRateOfChange(table) {
    const rates = [];
    for (let i = 0; i < table.length - 1; i++) {
        const deltaY = table[i + 1].y - table[i].y;
        const deltaX = table[i + 1].x - table[i].x;
        if (deltaX === 0) {
            rates.push({ interval: `${table[i].x}-${table[i + 1].x}`, rate: null, undefined: true });
        } else {
            rates.push({ interval: `${table[i].x}-${table[i + 1].x}`, rate: deltaY / deltaX, undefined: false });
        }
    }
    return rates;
}

function findGreatestRate(rates) {
    let greatest = null;
    let greatestValue = -Infinity;
    for (const r of rates) {
        if (!r.undefined && r.rate > greatestValue) {
            greatestValue = r.rate;
            greatest = r;
        }
    }
    return greatest;
}

function findGreatestDecrease(rates) {
    let greatest = null;
    let greatestValue = Infinity;
    for (const r of rates) {
        if (!r.undefined && r.rate < greatestValue) {
            greatestValue = r.rate;
            greatest = r;
        }
    }
    return greatest;
}

// Linear Function Detection
function isLinearFunction(table) {
    if (table.length < 2) return { isLinear: false, explanation: 'Need at least 2 points' };
    
    // Check if change in X is constant
    const deltaX = table[1].x - table[0].x;
    let constantDeltaX = true;
    for (let i = 1; i < table.length - 1; i++) {
        if (Math.abs((table[i + 1].x - table[i].x) - deltaX) > 0.001) {
            constantDeltaX = false;
            break;
        }
    }
    
    // Check if change in Y is constant
    const deltaY = table[1].y - table[0].y;
    let constantDeltaY = true;
    for (let i = 1; i < table.length - 1; i++) {
        if (Math.abs((table[i + 1].y - table[i].y) - deltaY) > 0.001) {
            constantDeltaY = false;
            break;
        }
    }
    
    // Check if ratio (change Y / change X) is constant
    let constantRatio = true;
    if (deltaX !== 0) {
        const ratio = deltaY / deltaX;
        for (let i = 1; i < table.length - 1; i++) {
            const dx = table[i + 1].x - table[i].x;
            const dy = table[i + 1].y - table[i].y;
            if (dx === 0 || Math.abs((dy / dx) - ratio) > 0.001) {
                constantRatio = false;
                break;
            }
        }
    } else {
        constantRatio = false; // Can't have constant ratio if deltaX is 0
    }
    
    const isLinear = constantDeltaX && (constantDeltaY || constantRatio);
    let explanation = '';
    if (isLinear) {
        explanation = `A constant change of ${deltaX} in X corresponds with a constant change of ${deltaY} in Y`;
    } else {
        explanation = `The change in X or Y is not constant, so this is not a linear function`;
    }
    
    return { isLinear, explanation };
}

// Standard Form Conversion
function convertToStandardForm(eqStr) {
    try {
        const line = parseEquation(eqStr);
        
        // If already in a form we can work with
        if (line.kind === 'vertical') {
            return { equation: `x = ${line.x0}`, A: 1, B: 0, C: line.x0 };
        } else if (line.kind === 'slope') {
            // Convert y = mx + b to Ax + By = C
            // y = mx + b => -mx + y = b => multiply by -1 if needed to make A positive
            let A = -line.m;
            let B = 1;
            let C = line.b;
            
            // Multiply by -1 if A is negative (prefer positive A)
            if (A < 0) {
                A = -A;
                B = -B;
                C = -C;
            }
            
            // Simplify to integers if possible
            const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
            const absA = Math.abs(A);
            const absB = Math.abs(B);
            const absC = Math.abs(C);
            const commonFactor = gcd(gcd(absA, absB), absC);
            
            if (commonFactor > 1 && Number.isInteger(A / commonFactor) && 
                Number.isInteger(B / commonFactor) && Number.isInteger(C / commonFactor)) {
                A = A / commonFactor;
                B = B / commonFactor;
                C = C / commonFactor;
            }
            
            // Format equation
            let eqStr = '';
            if (A === 1) eqStr += 'x';
            else if (A === -1) eqStr += '-x';
            else eqStr += `${A}x`;
            
            if (B === 1) eqStr += ' + y';
            else if (B === -1) eqStr += ' - y';
            else if (B > 0) eqStr += ` + ${B}y`;
            else eqStr += ` - ${Math.abs(B)}y`;
            
            eqStr += ` = ${C}`;
            
            return { equation: eqStr, A, B, C };
        }
    } catch (error) {
        throw new Error('Could not convert equation to standard form');
    }
}

// Distractor Generation for New Types
function generateInterceptDistractors(correctX, correctY, line) {
    const distractors = [];
    
    // Wrong sign errors
    if (correctX !== null) distractors.push(`(${-correctX}, 0)`);
    if (correctY !== null) distractors.push(`(0, ${-correctY})`);
    
    // Calculation errors (small variations)
    if (correctX !== null) distractors.push(`(${correctX + 1}, 0)`);
    if (correctY !== null) distractors.push(`(0, ${correctY + 1})`);
    
    // Confusing x and y intercepts
    if (correctX !== null && correctY !== null) {
        distractors.push(`(${correctY}, 0)`);
        distractors.push(`(0, ${correctX})`);
    }
    
    return distractors.slice(0, 3);
}

function generateRateOfChangeDistractors(correctRate, rates) {
    const distractors = [];
    
    // Wrong interval calculations
    for (const r of rates) {
        if (r.rate !== correctRate && r.rate !== null) {
            distractors.push(formatSlopeValue(r.rate));
        }
    }
    
    // Sign errors
    if (correctRate !== null) {
        distractors.push(formatSlopeValue(-correctRate));
    }
    
    // Calculation mistakes
    if (correctRate !== null) {
        distractors.push(formatSlopeValue(correctRate + 1));
        distractors.push(formatSlopeValue(correctRate - 1));
    }
    
    return distractors.slice(0, 3);
}

function generateLinearFunctionDistractors(isLinear) {
    const distractors = [];
    
    if (isLinear) {
        distractors.push('No - The change in X is not constant');
        distractors.push('No - The change in Y is not constant');
        distractors.push('No - This represents an exponential function');
    } else {
        distractors.push('Yes - A constant change in X corresponds with a constant change in Y');
        distractors.push('Yes - The ratio of change Y to change X is constant');
        distractors.push('Yes - This represents a linear relationship');
    }
    
    return distractors.slice(0, 3);
}

function generateStandardFormDistractors(correctEq, correctA, correctB, correctC) {
    const distractors = [];
    
    // Wrong signs
    distractors.push(correctEq.replace(/\+/g, 'temp').replace(/-/g, '+').replace(/temp/g, '-'));
    
    // Wrong coefficients
    distractors.push(correctEq.replace(correctA.toString(), (correctA + 1).toString()));
    distractors.push(correctEq.replace(correctC.toString(), (correctC + 1).toString()));
    
    // Wrong form
    distractors.push(`y = ${-correctA / correctB}x + ${correctC / correctB}`);
    
    return distractors.slice(0, 3);
}

// ============================================================================
// MILESTONE 16: Distractor Generators for New Features
// ============================================================================

function generateSlopeInterceptDistractors(correctEq, m, b) {
    const distractors = [];
    
    // Wrong sign on m
    const wrongM = -m;
    distractors.push(buildSlopeInterceptFromMB(wrongM, b));
    
    // Wrong sign on b
    const wrongB = -b;
    distractors.push(buildSlopeInterceptFromMB(m, wrongB));
    
    // Swapped m and b
    distractors.push(buildSlopeInterceptFromMB(b, m));
    
    return distractors.filter(d => d !== correctEq).slice(0, 3);
}

function generatePointSlopeDistractors(correctEq, m, point) {
    const distractors = [];
    
    // Wrong sign on (x - x1)
    const wrongXPoint = { x: -point.x, y: point.y };
    distractors.push(buildPointSlopeForm(m, wrongXPoint));
    
    // Wrong sign on (y - y1)
    const wrongYPoint = { x: point.x, y: -point.y };
    distractors.push(buildPointSlopeForm(m, wrongYPoint));
    
    // Wrong coordinates
    const wrongPoint = { x: point.x + 1, y: point.y + 1 };
    distractors.push(buildPointSlopeForm(m, wrongPoint));
    
    return distractors.filter(d => d !== correctEq).slice(0, 3);
}

function generateAbsoluteValueDistractors(correctVertex, correctDirection) {
    const distractors = [];
    
    // Wrong vertex coordinates
    distractors.push(`(${correctVertex.x + 1}, ${correctVertex.y})`);
    distractors.push(`(${correctVertex.x}, ${correctVertex.y + 1})`);
    distractors.push(`(${correctVertex.x - 1}, ${correctVertex.y - 1})`);
    
    return distractors.filter(d => d !== `(${correctVertex.x}, ${correctVertex.y})`).slice(0, 3);
}

function generateAbsoluteValueDirectionDistractors(correctDirection) {
    const allDirections = ['up', 'down'];
    return allDirections.filter(d => d !== correctDirection).concat(['neither', 'both']).slice(0, 3);
}

// Handler Functions for New Problem Types
let currentInterceptData = null;
let currentRateOfChangeData = null;
let currentLinearFunctionData = null;
let currentStandardFormData = null;

function handleInterceptCalculate() {
    try {
        const eqInput = document.getElementById('interceptEquationInput');
        if (!eqInput) {
            console.error('interceptEquationInput not found');
            return;
        }
        
        const eqStr = eqInput.value.trim();
        if (!eqStr) {
            showResult('Please enter an equation.', 'error');
            return;
        }
        
        const line = parseEquation(eqStr);
        const xIntercept = findXIntercept(line);
        const yIntercept = findYIntercept(line);
        
        // Store data for submission
        currentInterceptData = { line, xIntercept, yIntercept, eqStr };
        
        // Draw graph
        const graphContainer = document.getElementById('interceptGraphContainer');
        if (graphContainer) {
            graphContainer.style.setProperty('display', 'block', 'important');
            drawGraph('interceptGraph', line, xIntercept, yIntercept);
        }
        
        // Generate question (ask for both intercepts or one at a time)
        const askForX = Math.random() > 0.5;
        const interceptValue = askForX ? xIntercept : yIntercept;
        const interceptType = askForX ? 'x' : 'y';
        
        if (interceptValue === null || interceptValue === undefined) {
            // Ask for the other intercept
            const otherValue = askForX ? yIntercept : xIntercept;
            const otherType = askForX ? 'y' : 'x';
            if (otherValue === null || otherValue === undefined) {
                showResult('This line has no intercepts.', 'error');
                return;
            }
            currentInterceptData.askFor = otherType;
            currentInterceptData.correctValue = otherValue;
            currentInterceptData.correctAnswer = `(0, ${otherValue})`;
        } else {
            currentInterceptData.askFor = interceptType;
            currentInterceptData.correctValue = interceptValue;
            currentInterceptData.correctAnswer = askForX ? `(${interceptValue}, 0)` : `(0, ${interceptValue})`;
        }
        
        // Generate distractors
        const distractors = generateInterceptDistractors(xIntercept, yIntercept, line);
        
        // Create options
        const options = [
            { value: currentInterceptData.correctAnswer, correct: true },
            { value: distractors[0] || '(0, 0)', correct: false },
            { value: distractors[1] || '(1, 0)', correct: false },
            { value: distractors[2] || '(0, 1)', correct: false }
        ].sort(() => Math.random() - 0.5);
        
        currentInterceptData.options = options;
        
        // Display question
        PracticeMode.showContainer('interceptQuestionContainer', 'interceptSubmit');
        const questionText = document.querySelector('#interceptQuestionContainer .question-text');
        if (questionText) {
            questionText.textContent = `What is the ${currentInterceptData.askFor}-intercept of the line ${eqStr}?`;
        }
        PracticeMode.displayMultipleChoice('interceptOptions', options, 'intercept', questionText.textContent);
        
        gameState.questionAnswered = false;
    } catch (error) {
        showResult('Error: ' + error.message, 'error');
    }
}

function handleInterceptSubmit() {
    if (gameState.questionAnswered || !currentInterceptData) return;
    
    const selected = document.querySelector('input[name="intercept"]:checked');
    if (!selected) {
        showResult('Please select an answer.', 'error');
        return;
    }
    
    const selectedAnswers = { intercept: selected.value };
    const correctAnswers = { intercept: currentInterceptData.correctLabel };
    const answerResult = PracticeMode.processAnswer('intercept', selectedAnswers, correctAnswers, ['interceptOptions']);
    
    if (answerResult.isCorrect) {
        showResult('Correct! ✓', 'success');
        updateStats('intercept', true);
    } else {
        showResult(`Incorrect. Correct answer: ${currentInterceptData.correctAnswer} (${currentInterceptData.correctLabel})`, 'error');
        updateStats('intercept', false);
    }
    
    gameState.questionAnswered = true;
}

function handleRateOfChangeCalculate() {
    try {
        // Generate a random table
        const tableSize = randomInt(4, 6);
        const table = [];
        const startX = randomInt(0, 5);
        const startY = randomInt(0, 20);
        const deltaX = randomInt(1, 3);
        const deltaY = randomInt(-5, 5);
        
        for (let i = 0; i < tableSize; i++) {
            table.push({ x: startX + i * deltaX, y: startY + i * deltaY });
        }
        
        currentRateOfChangeData = { table };
        
        // Display table
        displayTable('rateOfChangeTableContainer', table);
        
        // Calculate rates
        const rates = calculateRateOfChange(table);
        const askForGreatest = Math.random() > 0.5;
        const targetRate = askForGreatest ? findGreatestRate(rates) : findGreatestDecrease(rates);
        
        if (!targetRate) {
            handleRateOfChangeCalculate(); // Retry
            return;
        }
        
        currentRateOfChangeData.targetRate = targetRate;
        currentRateOfChangeData.askForGreatest = askForGreatest;
        currentRateOfChangeData.correctAnswer = targetRate.rate;
        
        // Generate distractors
        const distractors = generateRateOfChangeDistractors(targetRate.rate, rates);
        
        // Create options
        const options = [
            { value: formatSlopeValue(targetRate.rate), correct: true },
            { value: distractors[0] || formatSlopeValue(0), correct: false },
            { value: distractors[1] || formatSlopeValue(1), correct: false },
            { value: distractors[2] || formatSlopeValue(-1), correct: false }
        ].sort(() => Math.random() - 0.5);
        
        currentRateOfChangeData.options = options;
        
        // Display question
        PracticeMode.showContainer('rateOfChangeQuestionContainer', 'rateOfChangeSubmit');
        const questionText = document.querySelector('#rateOfChangeQuestionContainer .question-text');
        if (questionText) {
            questionText.textContent = `What is the rate of change for the interval with the ${askForGreatest ? 'greatest increase' : 'greatest decrease'}?`;
        }
        PracticeMode.displayMultipleChoice('rateOfChangeOptions', options, 'rateOfChange', questionText.textContent);
        
        gameState.questionAnswered = false;
    } catch (error) {
        showResult('Error: ' + error.message, 'error');
    }
}

function handleRateOfChangeSubmit() {
    if (gameState.questionAnswered || !currentRateOfChangeData) return;
    
    const selected = document.querySelector('input[name="rateOfChange"]:checked');
    if (!selected) {
        showResult('Please select an answer.', 'error');
        return;
    }
    
    const selectedAnswers = { rateOfChange: selected.value };
    const correctAnswers = { rateOfChange: currentRateOfChangeData.correctLabel };
    const answerResult = PracticeMode.processAnswer('rateOfChange', selectedAnswers, correctAnswers, ['rateOfChangeOptions']);
    
    if (answerResult.isCorrect) {
        showResult('Correct! ✓', 'success');
        updateStats('rateOfChange', true);
    } else {
        showResult(`Incorrect. Correct answer: ${currentRateOfChangeData.correctAnswer} (${currentRateOfChangeData.correctLabel})`, 'error');
        updateStats('rateOfChange', false);
    }
    
    gameState.questionAnswered = true;
}

function handleLinearFunctionCalculate() {
    try {
        // Generate a random table (linear or non-linear)
        const isLinear = Math.random() > 0.5;
        const tableSize = randomInt(4, 6);
        const table = [];
        
        if (isLinear) {
            const startX = randomInt(0, 5);
            const startY = randomInt(0, 10);
            const deltaX = randomInt(1, 3);
            const deltaY = randomInt(-5, 5);
            for (let i = 0; i < tableSize; i++) {
                table.push({ x: startX + i * deltaX, y: startY + i * deltaY });
            }
        } else {
            // Non-linear
            const startX = randomInt(0, 5);
            const startY = randomInt(0, 10);
            for (let i = 0; i < tableSize; i++) {
                table.push({ x: startX + i, y: startY + i * i }); // Quadratic
            }
        }
        
        const result = isLinearFunction(table);
        currentLinearFunctionData = { table, result };
        
        // Display table
        displayTable('linearFunctionTableContainer', table);
        
        // Generate distractors
        const distractors = generateLinearFunctionDistractors(result.isLinear);
        
        // Create options
        const correctAnswer = result.isLinear ? `Yes - ${result.explanation}` : `No - ${result.explanation}`;
        const options = [
            { value: correctAnswer, correct: true },
            { value: distractors[0] || 'No', correct: false },
            { value: distractors[1] || 'Yes', correct: false },
            { value: distractors[2] || 'Maybe', correct: false }
        ].sort(() => Math.random() - 0.5);
        
        currentLinearFunctionData.options = options;
        currentLinearFunctionData.correctAnswer = correctAnswer;
        
        // Display question
        PracticeMode.showContainer('linearFunctionQuestionContainer', 'linearFunctionSubmit');
        const questionText = document.querySelector('#linearFunctionQuestionContainer .question-text');
        if (questionText) {
            questionText.textContent = 'Does the table represent a linear function? EXPLAIN.';
        }
        PracticeMode.displayMultipleChoice('linearFunctionOptions', options, 'linearFunction', questionText.textContent);
        
        gameState.questionAnswered = false;
    } catch (error) {
        showResult('Error: ' + error.message, 'error');
    }
}

function handleLinearFunctionSubmit() {
    if (gameState.questionAnswered || !currentLinearFunctionData) return;
    
    const selected = document.querySelector('input[name="linearFunction"]:checked');
    if (!selected) {
        showResult('Please select an answer.', 'error');
        return;
    }
    
    const selectedAnswers = { linearFunction: selected.value };
    const correctAnswers = { linearFunction: currentLinearFunctionData.correctLabel };
    const answerResult = PracticeMode.processAnswer('linearFunction', selectedAnswers, correctAnswers, ['linearFunctionOptions']);
    
    if (answerResult.isCorrect) {
        showResult('Correct! ✓', 'success');
        updateStats('linearFunction', true);
    } else {
        showResult(`Incorrect. Correct answer: ${currentLinearFunctionData.correctAnswer} (${currentLinearFunctionData.correctLabel})`, 'error');
        updateStats('linearFunction', false);
    }
    
    gameState.questionAnswered = true;
}

// ============================================================================
// MILESTONE 16: Handler Functions for New Features
// ============================================================================

// Section 4.9.1: From slope and y-intercept
let currentSlopeInterceptMBData = null;

function handleSlopeInterceptMBCalculate() {
    try {
        const mInput = document.getElementById('slopeInterceptMInput');
        const bInput = document.getElementById('slopeInterceptBInput');
        
        if (!mInput || !bInput) {
            showResult('Error: Input fields not found.', 'error');
            return;
        }
        
        const mStr = mInput.value.trim();
        const bStr = bInput.value.trim();
        
        if (!mStr || !bStr) {
            showResult('Please enter both slope (m) and y-intercept (b).', 'error');
            return;
        }
        
        // Parse m and b (handle fractions)
        let m = parseFraction(mStr);
        let b = parseFraction(bStr);
        
        if (isNaN(m) || isNaN(b)) {
            showResult('Invalid input. Please enter numbers or fractions (e.g., 2/3).', 'error');
            return;
        }
        
        // Build equation
        const correctEq = buildSlopeInterceptFromMB(m, b);
        
        // Generate distractors
        const distractors = generateSlopeInterceptDistractors(correctEq, m, b);
        
        // Create options
        const options = [
            { value: correctEq, correct: true },
            { value: distractors[0] || 'y = x', correct: false },
            { value: distractors[1] || 'y = -x', correct: false },
            { value: distractors[2] || 'y = 2x + 1', correct: false }
        ].sort(() => Math.random() - 0.5);
        
        currentSlopeInterceptMBData = { m, b, correctEq, options };
        
        // Display question
        PracticeMode.showContainer('slopeInterceptMBQuestionContainer', 'slopeInterceptMBSubmit');
        const questionText = document.querySelector('#slopeInterceptMBQuestionContainer .question-text');
        if (questionText) {
            questionText.textContent = `What is the equation of the line with slope ${formatSlopeValue(m)} and y-intercept ${formatSlopeValue(b)}?`;
        }
        PracticeMode.displayMultipleChoice('slopeInterceptMBOptions', options, 'slopeInterceptMB', questionText.textContent);
        
        gameState.questionAnswered = false;
    } catch (error) {
        showResult('Error: ' + error.message, 'error');
    }
}

function handleSlopeInterceptMBSubmit() {
    if (gameState.questionAnswered || !currentSlopeInterceptMBData) return;
    
    const selected = document.querySelector('input[name="slopeInterceptMB"]:checked');
    if (!selected) {
        showResult('Please select an answer.', 'error');
        return;
    }
    
    const selectedAnswers = { slopeInterceptMB: selected.value };
    const correctAnswers = { slopeInterceptMB: currentSlopeInterceptMBData.correctLabel };
    const answerResult = PracticeMode.processAnswer('slopeInterceptMB', selectedAnswers, correctAnswers, ['slopeInterceptMBOptions']);
    
    if (answerResult.isCorrect) {
        showResult(`Correct! The equation is ${currentSlopeInterceptMBData.correctEq} (${currentSlopeInterceptMBData.correctLabel})`, 'success');
        updateStats('slope', true);
    } else {
        showResult(`Incorrect. Correct answer: ${currentSlopeInterceptMBData.correctEq} (${currentSlopeInterceptMBData.correctLabel})`, 'error');
        updateStats('slope', false);
    }
    
    gameState.questionAnswered = true;
}

// Helper function to parse fraction strings
function parseFraction(str) {
    str = str.trim();
    if (str.includes('/')) {
        const parts = str.split('/');
        if (parts.length === 2) {
            const num = parseFloat(parts[0]);
            const den = parseFloat(parts[1]);
            if (den !== 0) return num / den;
        }
    }
    return parseFloat(str);
}

// Section 4.9.2: From slope and one point
let currentSlopeInterceptMPointData = null;

function handleSlopeInterceptMPointCalculate() {
    try {
        const mInput = document.getElementById('slopeInterceptMPointMInput');
        const pointInput = document.getElementById('slopeInterceptMPointInput');
        
        if (!mInput || !pointInput) {
            showResult('Error: Input fields not found.', 'error');
            return;
        }
        
        const mStr = mInput.value.trim();
        const pointStr = pointInput.value.trim();
        
        if (!mStr || !pointStr) {
            showResult('Please enter both slope (m) and a point (x,y).', 'error');
            return;
        }
        
        // Parse m and point
        let m = parseFraction(mStr);
        const point = parsePoint(pointStr);
        
        if (isNaN(m)) {
            showResult('Invalid slope. Please enter a number or fraction.', 'error');
            return;
        }
        
        // Build equation
        const correctEq = buildSlopeInterceptFromMPoint(m, point);
        const line = twoPointToSlopeIntercept(point, { x: point.x + 1, y: point.y + m });
        
        // Generate distractors
        const distractors = [];
        // Same slope, wrong intercept
        const wrongB1 = point.y - m * point.x + randomInt(-3, 3) || 1;
        distractors.push(buildSlopeInterceptFromMB(m, wrongB1));
        // Wrong slope from sign mistake
        distractors.push(buildSlopeInterceptFromMB(-m, point.y - (-m) * point.x));
        // Arithmetic error
        const wrongB2 = point.y - m * point.x + randomInt(-2, 2) || 1;
        distractors.push(buildSlopeInterceptFromMB(m, wrongB2));
        
        // Create options
        const options = [
            { value: correctEq, correct: true },
            { value: distractors[0] || 'y = x', correct: false },
            { value: distractors[1] || 'y = -x', correct: false },
            { value: distractors[2] || 'y = 2x + 1', correct: false }
        ].sort(() => Math.random() - 0.5);
        
        currentSlopeInterceptMPointData = { m, point, correctEq, options, line };
        
        // Display question
        PracticeMode.showContainer('slopeInterceptMPointQuestionContainer', 'slopeInterceptMPointSubmit');
        const questionText = document.querySelector('#slopeInterceptMPointQuestionContainer .question-text');
        if (questionText) {
            questionText.textContent = `What is the equation of the line with slope ${formatSlopeValue(m)} that passes through point (${point.x}, ${point.y})?`;
        }
        PracticeMode.displayMultipleChoice('slopeInterceptMPointOptions', options, 'slopeInterceptMPoint', questionText.textContent);
        
        gameState.questionAnswered = false;
    } catch (error) {
        showResult('Error: ' + error.message, 'error');
    }
}

function handleSlopeInterceptMPointSubmit() {
    if (gameState.questionAnswered || !currentSlopeInterceptMPointData) return;
    
    const selected = document.querySelector('input[name="slopeInterceptMPoint"]:checked');
    if (!selected) {
        showResult('Please select an answer.', 'error');
        return;
    }
    
    const selectedAnswers = { slopeInterceptMPoint: selected.value };
    const correctAnswers = { slopeInterceptMPoint: currentSlopeInterceptMPointData.correctLabel };
    const answerResult = PracticeMode.processAnswer('slopeInterceptMPoint', selectedAnswers, correctAnswers, ['slopeInterceptMPointOptions']);
    
    if (answerResult.isCorrect) {
        showResult(`Correct! The equation is ${currentSlopeInterceptMPointData.correctEq} (${currentSlopeInterceptMPointData.correctLabel})`, 'success');
        updateStats('slope', true);
    } else {
        showResult(`Incorrect. Correct answer: ${currentSlopeInterceptMPointData.correctEq} (${currentSlopeInterceptMPointData.correctLabel})`, 'error');
        updateStats('slope', false);
    }
    
    gameState.questionAnswered = true;
}

// Section 4.11: Two-Point Form to Slope-Intercept
let currentTwoPointData = null;

function handleTwoPointCalculate() {
    try {
        const p1Input = document.getElementById('twoPointP1Input');
        const p2Input = document.getElementById('twoPointP2Input');
        
        if (!p1Input || !p2Input) {
            showResult('Error: Input fields not found.', 'error');
            return;
        }
        
        const p1Str = p1Input.value.trim();
        const p2Str = p2Input.value.trim();
        
        if (!p1Str || !p2Str) {
            showResult('Please enter both points in the format (x,y).', 'error');
            return;
        }
        
        const p1 = parsePoint(p1Str);
        const p2 = parsePoint(p2Str);
        
        // Convert to slope-intercept
        const line = twoPointToSlopeIntercept(p1, p2);
        const correctEq = formatEquation(line);
        
        // Generate distractors
        const distractors = [];
        // Slope with sign error
        if (line.kind === 'slope') {
            const wrongM = -line.m;
            const wrongB = p1.y - wrongM * p1.x;
            distractors.push(formatEquation({ kind: 'slope', m: wrongM, b: wrongB }));
            // Correct slope but wrong intercept
            const wrongB2 = line.b + randomInt(-3, 3) || 1;
            distractors.push(formatEquation({ kind: 'slope', m: line.m, b: wrongB2 }));
            // Equation that passes through only one point
            const wrongM2 = line.m + randomFloat(-0.5, 0.5);
            distractors.push(formatEquation({ kind: 'slope', m: wrongM2, b: p1.y - wrongM2 * p1.x }));
        }
        
        // Create options
        const options = [
            { value: correctEq, correct: true },
            { value: distractors[0] || 'y = x', correct: false },
            { value: distractors[1] || 'y = -x', correct: false },
            { value: distractors[2] || 'y = 2x + 1', correct: false }
        ].sort(() => Math.random() - 0.5);
        
        currentTwoPointData = { p1, p2, line, correctEq, options };
        
        // Display question
        PracticeMode.showContainer('twoPointQuestionContainer', 'twoPointSubmit');
        const questionText = document.querySelector('#twoPointQuestionContainer .question-text');
        if (questionText) {
            questionText.textContent = `What is the equation of the line passing through points (${p1.x}, ${p1.y}) and (${p2.x}, ${p2.y})?`;
        }
        PracticeMode.displayMultipleChoice('twoPointOptions', options, 'twoPoint', questionText.textContent);
        
        gameState.questionAnswered = false;
    } catch (error) {
        showResult('Error: ' + error.message, 'error');
    }
}

function handleTwoPointSubmit() {
    if (gameState.questionAnswered || !currentTwoPointData) return;
    
    const selected = document.querySelector('input[name="twoPoint"]:checked');
    if (!selected) {
        showResult('Please select an answer.', 'error');
        return;
    }
    
    const selectedAnswers = { twoPoint: selected.value };
    const correctAnswers = { twoPoint: currentTwoPointData.correctLabel };
    const answerResult = PracticeMode.processAnswer('twoPoint', selectedAnswers, correctAnswers, ['twoPointOptions']);
    
    if (answerResult.isCorrect) {
        showResult(`Correct! The equation is ${currentTwoPointData.correctEq} (${currentTwoPointData.correctLabel})`, 'success');
        updateStats('slope', true);
    } else {
        showResult(`Incorrect. Correct answer: ${currentTwoPointData.correctEq} (${currentTwoPointData.correctLabel})`, 'error');
        updateStats('slope', false);
    }
    
    gameState.questionAnswered = true;
}

// Section 4.10: Point-Slope Form Drills
let currentPointSlopeData = null;

function handlePointSlopeBuildCalculate() {
    try {
        const mInput = document.getElementById('pointSlopeMInput');
        const pointInput = document.getElementById('pointSlopePointInput');
        
        if (!mInput || !pointInput) {
            showResult('Error: Input fields not found.', 'error');
            return;
        }
        
        const mStr = mInput.value.trim();
        const pointStr = pointInput.value.trim();
        
        if (!mStr || !pointStr) {
            showResult('Please enter both slope (m) and a point (x,y).', 'error');
            return;
        }
        
        let m = parseFraction(mStr);
        const point = parsePoint(pointStr);
        
        if (isNaN(m)) {
            showResult('Invalid slope. Please enter a number or fraction.', 'error');
            return;
        }
        
        // Build point-slope form
        const correctEq = buildPointSlopeForm(m, point);
        
        // Generate distractors
        const distractors = generatePointSlopeDistractors(correctEq, m, point);
        
        // Create options
        const options = [
            { value: correctEq, correct: true },
            { value: distractors[0] || 'y - 1 = 2(x - 1)', correct: false },
            { value: distractors[1] || 'y + 1 = 2(x + 1)', correct: false },
            { value: distractors[2] || 'y - 2 = 2(x - 2)', correct: false }
        ].sort(() => Math.random() - 0.5);
        
        currentPointSlopeData = { m, point, correctEq, options };
        
        // Display question
        PracticeMode.showContainer('pointSlopeQuestionContainer', 'pointSlopeSubmit');
        const questionText = document.querySelector('#pointSlopeQuestionContainer .question-text');
        if (questionText) {
            questionText.textContent = `What is the point-slope form of the line with slope ${formatSlopeValue(m)} that passes through point (${point.x}, ${point.y})?`;
        }
        PracticeMode.displayMultipleChoice('pointSlopeOptions', options, 'pointSlope', questionText.textContent);
        
        gameState.questionAnswered = false;
    } catch (error) {
        showResult('Error: ' + error.message, 'error');
    }
}

function handlePointSlopeBuildSubmit() {
    if (gameState.questionAnswered || !currentPointSlopeData) return;
    
    const selected = document.querySelector('input[name="pointSlope"]:checked');
    if (!selected) {
        showResult('Please select an answer.', 'error');
        return;
    }
    
    const selectedAnswers = { pointSlope: selected.value };
    const correctAnswers = { pointSlope: currentPointSlopeData.correctLabel };
    const answerResult = PracticeMode.processAnswer('pointSlope', selectedAnswers, correctAnswers, ['pointSlopeOptions']);
    
    if (answerResult.isCorrect) {
        const slopeInterceptEq = buildSlopeInterceptFromMPoint(currentPointSlopeData.m, currentPointSlopeData.point);
        showResult(`Correct! The equation is ${currentPointSlopeData.correctEq} (${currentPointSlopeData.correctLabel}). In slope-intercept form: ${slopeInterceptEq}`, 'success');
        updateStats('slope', true);
    } else {
        showResult(`Incorrect. Correct answer: ${currentPointSlopeData.correctEq} (${currentPointSlopeData.correctLabel})`, 'error');
        updateStats('slope', false);
    }
    
    gameState.questionAnswered = true;
}

// Section 4.13: Absolute Value Graphs
let currentAbsoluteValueData = null;

function handleAbsoluteValueCalculate() {
    try {
        const eqInput = document.getElementById('absoluteValueInput');
        
        if (!eqInput) {
            showResult('Error: Input field not found.', 'error');
            return;
        }
        
        const eqStr = eqInput.value.trim();
        if (!eqStr) {
            showResult('Please enter an absolute value equation in the format: y = a|bx + c| + d', 'error');
            return;
        }
        
        // Parse equation
        const { a, b, c, d } = parseAbsoluteValueEquation(eqStr);
        
        // Calculate vertex
        const vertex = calculateAbsoluteValueVertex(a, b, c, d);
        const direction = a > 0 ? 'up' : 'down';
        
        // Determine question type randomly
        let questionType = randomInt(2, 3); // Skip type 1 (graph matching) for now
        
        if (questionType === 2) {
            // What is the vertex
            const distractors = generateAbsoluteValueDistractors(vertex, direction);
            const options = [
                { value: `(${vertex.x}, ${vertex.y})`, correct: true },
                { value: distractors[0] || '(0, 0)', correct: false },
                { value: distractors[1] || '(1, 1)', correct: false },
                { value: distractors[2] || '(-1, -1)', correct: false }
            ].sort(() => Math.random() - 0.5);
            
            currentAbsoluteValueData = { a, b, c, d, vertex, direction, questionType: 2, options };
            
            // Draw graph
            const canvas = document.getElementById('absoluteValueGraph');
            if (canvas) {
                drawAbsoluteValueGraph('absoluteValueGraph', a, b, c, d);
            }
            
            // Display question
            PracticeMode.showContainer('absoluteValueQuestionContainer', 'absoluteValueSubmit');
            const questionText = document.querySelector('#absoluteValueQuestionContainer .question-text');
            if (questionText) {
                questionText.textContent = `What is the vertex of the graph of ${eqStr}?`;
            }
            PracticeMode.displayMultipleChoice('absoluteValueOptions', options, 'absoluteValue', questionText.textContent);
        } else if (questionType === 3) {
            // Is graph opening up or down
            const distractors = generateAbsoluteValueDirectionDistractors(direction);
            const options = [
                { value: direction, correct: true },
                { value: distractors[0] || 'up', correct: false },
                { value: distractors[1] || 'down', correct: false },
                { value: distractors[2] || 'neither', correct: false }
            ].sort(() => Math.random() - 0.5);
            
            currentAbsoluteValueData = { a, b, c, d, vertex, direction, questionType: 3, options };
            
            // Draw graph
            const canvas = document.getElementById('absoluteValueGraph');
            if (canvas) {
                drawAbsoluteValueGraph('absoluteValueGraph', a, b, c, d);
            }
            
            // Display question
            PracticeMode.showContainer('absoluteValueQuestionContainer', 'absoluteValueSubmit');
            const questionText = document.querySelector('#absoluteValueQuestionContainer .question-text');
            if (questionText) {
                questionText.textContent = `Is the graph of ${eqStr} opening up or down?`;
            }
            PracticeMode.displayMultipleChoice('absoluteValueOptions', options, 'absoluteValue', questionText.textContent);
        }
        
        gameState.questionAnswered = false;
    } catch (error) {
        showResult('Error: ' + error.message, 'error');
    }
}

function handleAbsoluteValueSubmit() {
    if (gameState.questionAnswered || !currentAbsoluteValueData) return;
    
    const selected = document.querySelector('input[name="absoluteValue"]:checked');
    if (!selected) {
        showResult('Please select an answer.', 'error');
        return;
    }
    
    const selectedAnswers = { absoluteValue: selected.value };
    const correctAnswers = { absoluteValue: currentAbsoluteValueData.correctLabel };
    const answerResult = PracticeMode.processAnswer('absoluteValue', selectedAnswers, correctAnswers, ['absoluteValueOptions']);
    
    if (answerResult.isCorrect) {
        if (currentAbsoluteValueData.questionType === 2) {
            showResult(`Correct! The vertex is (${currentAbsoluteValueData.vertex.x}, ${currentAbsoluteValueData.vertex.y}) (${currentAbsoluteValueData.correctLabel})`, 'success');
        } else {
            showResult(`Correct! The graph opens ${currentAbsoluteValueData.direction} (${currentAbsoluteValueData.correctLabel})`, 'success');
        }
        updateStats('slope', true);
    } else {
        if (currentAbsoluteValueData.questionType === 2) {
            showResult(`Incorrect. Correct answer: (${currentAbsoluteValueData.vertex.x}, ${currentAbsoluteValueData.vertex.y}) (${currentAbsoluteValueData.correctLabel})`, 'error');
        } else {
            showResult(`Incorrect. Correct answer: ${currentAbsoluteValueData.direction} (${currentAbsoluteValueData.correctLabel})`, 'error');
        }
        updateStats('slope', false);
    }
    
    gameState.questionAnswered = true;
}

function handleStandardFormCalculate() {
    try {
        const eqInput = document.getElementById('standardFormInput');
        if (!eqInput) {
            console.error('standardFormInput not found');
            return;
        }
        
        const eqStr = eqInput.value.trim();
        if (!eqStr) {
            showResult('Please enter an equation.', 'error');
            return;
        }
        
        const result = convertToStandardForm(eqStr);
        currentStandardFormData = { originalEq: eqStr, result };
        
        // Generate distractors
        const distractors = generateStandardFormDistractors(result.equation, result.A, result.B, result.C);
        
        // Create options for equation
        const options = [
            { value: result.equation, correct: true },
            { value: distractors[0] || 'x + y = 0', correct: false },
            { value: distractors[1] || 'x - y = 0', correct: false },
            { value: distractors[2] || 'y = x', correct: false }
        ].sort(() => Math.random() - 0.5);
        
        currentStandardFormData.options = options;
        
        // Display question
        PracticeMode.showContainer('standardFormQuestionContainer', 'standardFormSubmit');
        const questionText = document.querySelector('#standardFormQuestionContainer .question-text');
        if (questionText) {
            questionText.textContent = `Convert ${eqStr} to standard form (Ax + By = C):`;
        }
        PracticeMode.displayMultipleChoice('standardFormOptions', options, 'standardForm', questionText.textContent);
        
        gameState.questionAnswered = false;
    } catch (error) {
        showResult('Error: ' + error.message, 'error');
    }
}

function handleStandardFormSubmit() {
    if (gameState.questionAnswered || !currentStandardFormData) return;
    
    const selected = document.querySelector('input[name="standardForm"]:checked');
    if (!selected) {
        showResult('Please select an answer.', 'error');
        return;
    }
    
    const selectedAnswers = { standardForm: selected.value };
    const correctAnswers = { standardForm: currentStandardFormData.correctLabel };
    const answerResult = PracticeMode.processAnswer('standardForm', selectedAnswers, correctAnswers, ['standardFormOptions']);
    
    if (answerResult.isCorrect) {
        showResult(`Correct! ✓ Standard form: ${currentStandardFormData.result.equation}`, 'success');
        updateStats('standardForm', true);
    } else {
        showResult(`Incorrect. Correct answer: ${currentStandardFormData.result.equation} (${currentStandardFormData.correctLabel})`, 'error');
        updateStats('standardForm', false);
    }
    
    gameState.questionAnswered = true;
}

// Table Display Function
function displayTable(containerId, table) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let html = '<table class="data-table"><thead><tr><th>X</th><th>Y</th></tr></thead><tbody>';
    for (const row of table) {
        html += `<tr><td>${row.x}</td><td>${row.y}</td></tr>`;
    }
    html += '</tbody></table>';
    container.innerHTML = html;
}

// ============================================================================
// MILESTONE 16: Math Utility Functions for New Features
// ============================================================================

// Build slope-intercept form from m and b
function buildSlopeInterceptFromMB(m, b) {
    const mFormatted = formatSlopeValue(m);
    const bFormatted = formatSlopeValue(b);
    
    if (m === 0) {
        return `y = ${bFormatted}`;
    } else if (m === 1) {
        return b === 0 ? 'y = x' : `y = x + ${bFormatted}`;
    } else if (m === -1) {
        return b === 0 ? 'y = -x' : `y = -x + ${bFormatted}`;
    } else {
        const slopePart = mFormatted.includes('/') ? `(${mFormatted})x` : `${mFormatted}x`;
        return b === 0 ? `y = ${slopePart}` : (b > 0 ? `y = ${slopePart} + ${bFormatted}` : `y = ${slopePart} ${bFormatted}`);
    }
}

// Build slope-intercept form from slope and point
function buildSlopeInterceptFromMPoint(m, point) {
    // Use point-slope: y - y1 = m(x - x1)
    // Convert to slope-intercept: y = mx + b
    // b = y1 - m*x1
    const b = point.y - m * point.x;
    return buildSlopeInterceptFromMB(m, b);
}

// Build point-slope form from slope and point
function buildPointSlopeForm(m, point) {
    const mFormatted = formatSlopeValue(m);
    const x1 = formatSlopeValue(point.x);
    const y1 = formatSlopeValue(point.y);
    
    // Handle signs correctly
    const xPart = point.x === 0 ? 'x' : (point.x > 0 ? `x - ${x1}` : `x + ${Math.abs(point.x)}`);
    const yPart = point.y === 0 ? 'y' : (point.y > 0 ? `y - ${y1}` : `y + ${Math.abs(point.y)}`);
    
    if (m === 1) {
        return `${yPart} = ${xPart}`;
    } else if (m === -1) {
        return `${yPart} = -${xPart}`;
    } else {
        const slopePart = mFormatted.includes('/') ? `(${mFormatted})` : mFormatted;
        return `${yPart} = ${slopePart}(${xPart})`;
    }
}

// Convert two points to slope-intercept form
function twoPointToSlopeIntercept(p1, p2) {
    if (p1.x === p2.x && p1.y === p2.y) {
        throw new Error('Points cannot be identical');
    }
    
    if (p1.x === p2.x) {
        // Vertical line
        return { kind: 'vertical', x0: p1.x };
    }
    
    const m = (p2.y - p1.y) / (p2.x - p1.x);
    const b = p1.y - m * p1.x;
    
    return { kind: 'slope', m: roundToDecimal(m), b: roundToDecimal(b) };
}

// Parse point-slope equation
function parsePointSlopeEquation(eqStr) {
    const eq = eqStr.trim().replace(/\s+/g, '');
    
    // Pattern: y - y1 = m(x - x1) or y + y1 = m(x + x1)
    const match = eq.match(/y\s*([+-])\s*(\d+(?:\.\d+)?)\s*=\s*([+-]?\d+(?:\/\d+)?(?:\.\d+)?)\s*\(\s*x\s*([+-])\s*(\d+(?:\.\d+)?)\s*\)/);
    if (!match) {
        // Try simpler pattern
        const simpleMatch = eq.match(/y\s*([+-])\s*(\d+(?:\.\d+)?)\s*=\s*([+-]?\d+(?:\/\d+)?(?:\.\d+)?)\s*\(\s*x\s*([+-])\s*(\d+(?:\.\d+)?)\s*\)/);
        if (simpleMatch) {
            const ySign = simpleMatch[1] === '+' ? -1 : 1;
            const y1 = parseFloat(simpleMatch[2]) * ySign;
            let m = parseFloat(simpleMatch[3]);
            if (simpleMatch[3].includes('/')) {
                const parts = simpleMatch[3].split('/');
                m = parseFloat(parts[0]) / parseFloat(parts[1]);
            }
            const xSign = simpleMatch[4] === '+' ? -1 : 1;
            const x1 = parseFloat(simpleMatch[5]) * xSign;
            
            return { m, point: { x: x1, y: y1 } };
        }
        throw new Error('Invalid point-slope format. Use: y - y1 = m(x - x1)');
    }
    
    const ySign = match[1] === '+' ? -1 : 1;
    const y1 = parseFloat(match[2]) * ySign;
    let m = parseFloat(match[3]);
    if (match[3].includes('/')) {
        const parts = match[3].split('/');
        m = parseFloat(parts[0]) / parseFloat(parts[1]);
    }
    const xSign = match[4] === '+' ? -1 : 1;
    const x1 = parseFloat(match[5]) * xSign;
    
    return { m, point: { x: x1, y: y1 } };
}

// Convert point-slope to slope-intercept (advanced, handles extra constants)
function convertPointSlopeToSlopeInterceptAdvanced(pointSlopeEq) {
    // Parse the equation
    const parsed = parsePointSlopeEquation(pointSlopeEq);
    const { m, point } = parsed;
    
    // Convert: y - y1 = m(x - x1) → y = mx + b
    // b = y1 - m*x1
    const b = point.y - m * point.x;
    
    return { kind: 'slope', m: roundToDecimal(m), b: roundToDecimal(b) };
}

// Parse absolute value equation: y = a|bx + c| + d
function parseAbsoluteValueEquation(eqStr) {
    const eq = eqStr.trim().replace(/\s+/g, '');
    
    // Pattern: y = a|bx + c| + d or y = a|bx + c| - d
    const match = eq.match(/y\s*=\s*([+-]?\d+(?:\/\d+)?(?:\.\d+)?)\s*\|\s*([+-]?\d+(?:\/\d+)?(?:\.\d+)?)\s*x\s*([+-])\s*(\d+(?:\.\d+)?)\s*\|\s*([+-])\s*(\d+(?:\.\d+)?)/);
    
    if (!match) {
        throw new Error('Invalid absolute value format. Use: y = a|bx + c| + d');
    }
    
    let a = parseFloat(match[1]);
    if (match[1].includes('/')) {
        const parts = match[1].split('/');
        a = parseFloat(parts[0]) / parseFloat(parts[1]);
    }
    
    let b = parseFloat(match[2]);
    if (match[2].includes('/')) {
        const parts = match[2].split('/');
        b = parseFloat(parts[0]) / parseFloat(parts[1]);
    }
    
    const cSign = match[3] === '+' ? 1 : -1;
    const c = parseFloat(match[4]) * cSign;
    
    const dSign = match[5] === '+' ? 1 : -1;
    const d = parseFloat(match[6]) * dSign;
    
    return { a, b, c, d };
}

// Calculate absolute value vertex
function calculateAbsoluteValueVertex(a, b, c, d) {
    // Vertex occurs when bx + c = 0
    const vertexX = -c / b;
    const vertexY = a * Math.abs(b * vertexX + c) + d;
    return { x: roundToDecimal(vertexX, 2), y: roundToDecimal(vertexY, 2) };
}

// Generate signed-number expression for micro-practice
function generateSignedNumberExpression(type = 'random') {
    const types = ['distributive', 'constant-combination', 'subtraction', 'addition'];
    const selectedType = type === 'random' ? types[randomInt(0, types.length - 1)] : type;
    
    switch (selectedType) {
        case 'distributive':
            // m(x - x1) or m(x + c)
            const m = randomInt(-5, 5) || randomInt(-5, -1) || randomInt(1, 5);
            const x1 = randomInt(-5, 5);
            return {
                expression: `${m}(${x1 > 0 ? `x - ${x1}` : `x + ${Math.abs(x1)}`})`,
                answer: m * (x1 > 0 ? -x1 : Math.abs(x1)),
                explanation: `${m} times ${x1 > 0 ? `-${x1}` : Math.abs(x1)} = ${m * (x1 > 0 ? -x1 : Math.abs(x1))}`
            };
        case 'constant-combination':
            const b1 = randomInt(-10, 10);
            const b2 = randomInt(-10, 10);
            return {
                expression: `${b1} + ${b2}`,
                answer: b1 + b2,
                explanation: `${b1} + ${b2} = ${b1 + b2}`
            };
        case 'subtraction':
            const s1 = randomInt(-10, 10);
            const s2 = randomInt(-10, 10);
            return {
                expression: `${s1} - ${s2}`,
                answer: s1 - s2,
                explanation: `${s1} - ${s2} = ${s1 - s2}`
            };
        case 'addition':
            const a1 = randomInt(-10, 10);
            const a2 = randomInt(-10, 10);
            return {
                expression: `${a1} + ${a2}`,
                answer: a1 + a2,
                explanation: `${a1} + ${a2} = ${a1 + a2}`
            };
        default:
            return generateSignedNumberExpression('distributive');
    }
}

// ============================================================================
// MILESTONE 16: Challenge Mode Question Generators
// ============================================================================

function generatePointSlopeQuestion() {
    const m = randomInt(-5, 5) || randomInt(-5, -1) || randomInt(1, 5);
    const point = { x: randomInt(-10, 10), y: randomInt(-10, 10) };
    
    const correctEq = buildPointSlopeForm(m, point);
    const distractors = generatePointSlopeDistractors(correctEq, m, point);
    
    const options = [
        { value: correctEq, correct: true },
        { value: distractors[0] || 'y - 1 = 2(x - 1)', correct: false },
        { value: distractors[1] || 'y + 1 = 2(x + 1)', correct: false },
        { value: distractors[2] || 'y - 2 = 2(x - 2)', correct: false }
    ].sort(() => Math.random() - 0.5);
    
    return {
        type: 'pointSlope',
        question: `What is the point-slope form of the line with slope ${formatSlopeValue(m)} that passes through point (${point.x}, ${point.y})?`,
        options: options,
        correctAnswer: correctEq
    };
}

function generateAbsoluteValueQuestion() {
    const a = randomInt(-3, 3) || randomInt(-3, -1) || randomInt(1, 3);
    const b = randomInt(-3, 3) || randomInt(-3, -1) || randomInt(1, 3);
    const c = randomInt(-5, 5);
    const d = randomInt(-5, 5);
    
    const eqStr = `y = ${a}|${b}x ${c >= 0 ? '+' : ''}${c}| ${d >= 0 ? '+' : ''}${d}`;
    const vertex = calculateAbsoluteValueVertex(a, b, c, d);
    const direction = a > 0 ? 'up' : 'down';
    
    // Randomly choose question type
    const questionType = randomInt(2, 3);
    
    if (questionType === 2) {
        const distractors = generateAbsoluteValueDistractors(vertex, direction);
        const options = [
            { value: `(${vertex.x}, ${vertex.y})`, correct: true },
            { value: distractors[0] || '(0, 0)', correct: false },
            { value: distractors[1] || '(1, 1)', correct: false },
            { value: distractors[2] || '(-1, -1)', correct: false }
        ].sort(() => Math.random() - 0.5);
        
        return {
            type: 'absoluteValue',
            question: `What is the vertex of the graph of ${eqStr}?`,
            options: options,
            correctAnswer: `(${vertex.x}, ${vertex.y})`
        };
    } else {
        const distractors = generateAbsoluteValueDirectionDistractors(direction);
        const options = [
            { value: direction, correct: true },
            { value: distractors[0] || 'up', correct: false },
            { value: distractors[1] || 'down', correct: false },
            { value: distractors[2] || 'neither', correct: false }
        ].sort(() => Math.random() - 0.5);
        
        return {
            type: 'absoluteValue',
            question: `Is the graph of ${eqStr} opening up or down?`,
            options: options,
            correctAnswer: direction
        };
    }
}

// Question Generators for Challenge Mode
function generateInterceptQuestion() {
    const types = ['slope-intercept', 'standard'];
    const type = types[randomInt(0, types.length - 1)];
    
    let line, eqStr;
    if (type === 'slope-intercept') {
        const m = randomInt(-5, 5) || 1;
        const b = randomInt(-10, 10);
        line = { kind: 'slope', m, b };
        eqStr = formatEquation(line);
    } else {
        const A = randomInt(-5, 5) || 1;
        const B = randomInt(-5, 5) || 1;
        const C = randomInt(-20, 20);
        line = { kind: 'slope', m: -A/B, b: C/B };
        eqStr = `${A}x + ${B}y = ${C}`;
    }
    
    const xIntercept = findXIntercept(line);
    const yIntercept = findYIntercept(line);
    const askForX = Math.random() > 0.5;
    const interceptValue = askForX ? xIntercept : yIntercept;
    
    if (interceptValue === null) {
        return generateInterceptQuestion(); // Retry
    }
    
    const correctAnswer = askForX ? `(${interceptValue}, 0)` : `(0, ${interceptValue})`;
    const distractors = generateInterceptDistractors(xIntercept, yIntercept, line);
    
    const options = [
        { value: correctAnswer, correct: true },
        { value: distractors[0] || '(0, 0)', correct: false },
        { value: distractors[1] || '(1, 0)', correct: false },
        { value: distractors[2] || '(0, 1)', correct: false }
    ].sort(() => Math.random() - 0.5);
    
    return {
        type: 'intercept',
        question: `What is the ${askForX ? 'x' : 'y'}-intercept of the line ${eqStr}?`,
        display: eqStr,
        correctAnswer: correctAnswer,
        data: { line, xIntercept, yIntercept },
        options: options
    };
}

function generateRateOfChangeQuestion() {
    const tableSize = randomInt(4, 6);
    const table = [];
    const startX = randomInt(0, 5);
    const startY = randomInt(0, 20);
    const deltaX = randomInt(1, 3);
    const deltaY = randomInt(-5, 5);
    
    for (let i = 0; i < tableSize; i++) {
        table.push({ x: startX + i * deltaX, y: startY + i * deltaY });
    }
    
    const rates = calculateRateOfChange(table);
    const askForGreatest = Math.random() > 0.5;
    const targetRate = askForGreatest ? findGreatestRate(rates) : findGreatestDecrease(rates);
    
    if (!targetRate) {
        return generateRateOfChangeQuestion(); // Retry
    }
    
    const distractors = generateRateOfChangeDistractors(targetRate.rate, rates);
    const options = [
        { value: formatSlopeValue(targetRate.rate), correct: true },
        { value: distractors[0] || formatSlopeValue(0), correct: false },
        { value: distractors[1] || formatSlopeValue(1), correct: false },
        { value: distractors[2] || formatSlopeValue(-1), correct: false }
    ].sort(() => Math.random() - 0.5);
    
    return {
        type: 'rateOfChange',
        question: `During which time interval did the volume ${askForGreatest ? 'increase' : 'decrease'} at the greatest rate?`,
        display: table,
        correctAnswer: formatSlopeValue(targetRate.rate),
        data: { table, rates, targetRate },
        options: options
    };
}

function generateLinearFunctionQuestion() {
    const isLinear = Math.random() > 0.5;
    const tableSize = randomInt(4, 6);
    const table = [];
    
    if (isLinear) {
        const startX = randomInt(0, 5);
        const startY = randomInt(0, 10);
        const deltaX = randomInt(1, 3);
        const deltaY = randomInt(-5, 5);
        for (let i = 0; i < tableSize; i++) {
            table.push({ x: startX + i * deltaX, y: startY + i * deltaY });
        }
    } else {
        const startX = randomInt(0, 5);
        const startY = randomInt(0, 10);
        for (let i = 0; i < tableSize; i++) {
            table.push({ x: startX + i, y: startY + i * i });
        }
    }
    
    const result = isLinearFunction(table);
    const distractors = generateLinearFunctionDistractors(result.isLinear);
    const correctAnswer = result.isLinear ? `Yes - ${result.explanation}` : `No - ${result.explanation}`;
    
    // Issue #023: Fix linear function to use value-based pattern (no hardcoded labels)
    const options = [
        { value: correctAnswer, correct: true },
        { value: distractors[0] || 'No', correct: false },
        { value: distractors[1] || 'Yes', correct: false },
        { value: distractors[2] || 'Maybe', correct: false }
    ].sort(() => Math.random() - 0.5);
    
    return {
        type: 'linearFunction',
        question: 'Does the table represent a linear function? EXPLAIN.',
        display: table,
        correctAnswer: correctAnswer,
        correctAnswerValue: correctAnswer,
        data: { table, result },
        options: options
    };
}

function generateStandardFormQuestion() {
    const types = ['slope-intercept'];
    const type = types[randomInt(0, types.length - 1)];
    
    let eqStr;
    if (type === 'slope-intercept') {
        const m = randomInt(-5, 5) || 1;
        const b = randomInt(-10, 10);
        const line = { kind: 'slope', m, b };
        eqStr = formatEquation(line);
    }
    
    const result = convertToStandardForm(eqStr);
    const distractors = generateStandardFormDistractors(result.equation, result.A, result.B, result.C);
    
    // Issue #023: Fix standard form to use value-based pattern (no hardcoded labels)
    const options = [
        { value: result.equation, correct: true },
        { value: distractors[0] || 'x + y = 0', correct: false },
        { value: distractors[1] || 'x - y = 0', correct: false },
        { value: distractors[2] || 'y = x', correct: false }
    ].sort(() => Math.random() - 0.5);
    
    return {
        type: 'standardForm',
        question: `Convert ${eqStr} to standard form (Ax + By = C):`,
        display: eqStr,
        correctAnswer: result.equation,
        correctAnswerValue: result.equation,
        data: { originalEq: eqStr, result },
        options: options
    };
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

// Milestone 17: Personal Bests Management
function updatePersonalBests() {
    const personalBests = loadPersonalBests();
    let updated = false;
    
    // Update fastest challenge time by set size
    const setSize = challengeState.setSize;
    const totalTime = challengeState.totalChallengeTime;
    
    if (!personalBests.fastestChallenge[setSize] || totalTime < personalBests.fastestChallenge[setSize]) {
        personalBests.fastestChallenge[setSize] = totalTime;
        updated = true;
    }
    
    // Update fastest single question time
    const fastestTime = challengeState.questionTimes.length > 0
        ? Math.min(...challengeState.questionTimes.map(qt => qt.duration))
        : Infinity;
    
    if (fastestTime < Infinity && (!personalBests.fastestQuestion || fastestTime < personalBests.fastestQuestion)) {
        personalBests.fastestQuestion = fastestTime;
        updated = true;
    }
    
    // Update best average time per question
    const avgTime = challengeState.questionTimes.length > 0
        ? challengeState.questionTimes.reduce((sum, qt) => sum + qt.duration, 0) / challengeState.questionTimes.length
        : Infinity;
    
    if (avgTime < Infinity && (!personalBests.bestAverageTime || avgTime < personalBests.bestAverageTime)) {
        personalBests.bestAverageTime = avgTime;
        updated = true;
    }
    
    if (updated) {
        savePersonalBests(personalBests);
    }
}

function loadPersonalBests() {
    const stored = localStorage.getItem('personalBests');
    if (stored) {
        return JSON.parse(stored);
    }
    return {
        fastestChallenge: {}, // { setSize: time }
        fastestQuestion: null,
        bestAverageTime: null
    };
}

function savePersonalBests(personalBests) {
    localStorage.setItem('personalBests', JSON.stringify(personalBests));
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
    
    // Milestone 18: Show visual effects warning on first load
    showVisualEffectsWarning();
    
    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const navSidebar = document.querySelector('.nav-sidebar');
    
    function toggleMobileMenu() {
        if (navSidebar && mobileMenuToggle && mobileMenuOverlay) {
            navSidebar.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');
        }
    }
    
    function closeMobileMenu() {
        if (navSidebar && mobileMenuToggle && mobileMenuOverlay) {
            navSidebar.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
        }
    }
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });
    }
    
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navSidebar && navSidebar.classList.contains('active')) {
            if (!navSidebar.contains(e.target) && e.target !== mobileMenuToggle) {
                closeMobileMenu();
            }
        }
    });
    
    // Tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            // Close mobile menu when tab is selected
            closeMobileMenu();
            
            // Don't allow tab switching during active challenge
            if (challengeState.active) {
                return;
            }
            
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
            
            // MILESTONE 19: Initialize interactive graphing tabs when opened
            if (tab === 'graph-slopeintercept') {
                handleGraphSlopeInterceptGenerate();
            } else if (tab === 'graph-pointslope') {
                handleGraphPointSlopeGenerate();
            } else if (tab === 'graph-parallel') {
                handleGraphParallelGenerate();
            } else if (tab === 'graph-perpendicular') {
                handleGraphPerpendicularGenerate();
            } else if (tab === 'graph-absolutevalue') {
                handleGraphAbsoluteValueGenerate();
            }
            
            // Hide all hint panels when switching tabs
            hideHints();
            
            // Reset question answered flag for new question
            gameState.questionAnswered = false;
            
            // Reset timer for new question
            stopQuestionTimer();
        });
    });
    
    // Mode selector
    document.getElementById('modeSelector').addEventListener('change', (e) => {
        const newMode = e.target.value;
        
        // If switching away from challenge mode, reset challenge
        if (gameState.mode === 'challenge' && challengeState.active) {
            resetChallenge();
            hideChallengeInterface();
            // Show problem panels again
            const activeTab = document.querySelector('.tab-button.active');
            if (activeTab) {
                const tab = activeTab.dataset.tab;
                document.getElementById(tab + '-panel').classList.add('active');
            }
        }
        
        gameState.mode = newMode;
        stopQuestionTimer();
        stopSessionTimer();
        
        if (gameState.mode === 'challenge') {
            // Show challenge setup modal
            showChallengeSetupModal();
        } else if (gameState.mode === 'session') {
            startSessionTimer();
        }
        
        // Reset session score for new mode
        if (gameState.mode !== 'session' && gameState.mode !== 'challenge') {
            gameState.score = 0;
            gameState.streakCurrent = 0;
            gameState.totalQuestions = 0;
            gameState.correctQuestions = 0;
        }
        
        updateUI();
    });
    
    // Challenge setup modal
    document.querySelectorAll('.set-size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const setSize = parseInt(btn.dataset.size);
            startChallenge(setSize);
        });
    });
    
    document.getElementById('cancelChallengeSetup')?.addEventListener('click', () => {
        hideChallengeSetupModal();
        // Reset mode selector to practice
        document.getElementById('modeSelector').value = 'practice';
        gameState.mode = 'practice';
    });
    
    document.getElementById('closeChallengeSetup')?.addEventListener('click', () => {
        hideChallengeSetupModal();
        document.getElementById('modeSelector').value = 'practice';
        gameState.mode = 'practice';
    });
    
    // Challenge hint button
    document.getElementById('challengeHintButton')?.addEventListener('click', () => {
        const hintType = challengeState.currentProblemType;
        if (hintType) {
            showHints(hintType);
        }
    });
    
    // Challenge navigation buttons
    document.getElementById('challengeBackBtn')?.addEventListener('click', () => {
        navigateChallengeQuestion('prev');
    });
    
    document.getElementById('challengeSkipBtn')?.addEventListener('click', () => {
        skipChallengeQuestion();
    });
    
    document.getElementById('challengeGiveUpBtn')?.addEventListener('click', () => {
        giveUpChallengeQuestion();
    });
    
    document.getElementById('challengeSubmitBtn')?.addEventListener('click', () => {
        submitChallengeAnswer();
    });
    
    document.getElementById('exitChallenge')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to exit the challenge? Your progress will be lost.')) {
            resetChallenge();
            hideChallengeInterface();
            document.getElementById('modeSelector').value = 'practice';
            gameState.mode = 'practice';
            // Show problem panels again
            const activeTab = document.querySelector('.tab-button.active');
            if (activeTab) {
                const tab = activeTab.dataset.tab;
                document.getElementById(tab + '-panel').classList.add('active');
            }
            updateUI();
        }
    });
    
    // Challenge completion modal
    document.getElementById('restartChallenge')?.addEventListener('click', () => {
        const completionModal = document.getElementById('challengeCompletionModal');
        if (completionModal) {
            completionModal.classList.remove('active');
        }
        resetChallenge();
        showChallengeSetupModal();
    });
    
    document.getElementById('returnToPractice')?.addEventListener('click', () => {
        const completionModal = document.getElementById('challengeCompletionModal');
        if (completionModal) {
            completionModal.classList.remove('active');
        }
        resetChallenge();
        hideChallengeInterface();
        document.getElementById('modeSelector').value = 'practice';
        gameState.mode = 'practice';
        // Show problem panels again
        const activeTab = document.querySelector('.tab-button.active');
        if (activeTab) {
            const tab = activeTab.dataset.tab;
            document.getElementById(tab + '-panel').classList.add('active');
        }
        updateUI();
    });
    
    document.getElementById('closeChallengeCompletion')?.addEventListener('click', () => {
        const completionModal = document.getElementById('challengeCompletionModal');
        if (completionModal) {
            completionModal.classList.remove('active');
        }
        resetChallenge();
        hideChallengeInterface();
        document.getElementById('modeSelector').value = 'practice';
        gameState.mode = 'practice';
        const activeTab = document.querySelector('.tab-button.active');
        if (activeTab) {
            const tab = activeTab.dataset.tab;
            document.getElementById(tab + '-panel').classList.add('active');
        }
        updateUI();
    });
    
    // Practice mode - Calculate buttons (generate questions)
    document.getElementById('slopeCalculateBtn')?.addEventListener('click', () => {
        startQuestionTimer();
        handleSlopeCalculate();
    });
    
    document.getElementById('relationshipCalculateBtn')?.addEventListener('click', () => {
        startQuestionTimer();
        handleRelationshipCalculate();
    });
    
    document.getElementById('parallelCalculateBtn')?.addEventListener('click', () => {
        startQuestionTimer();
        handleParallelCalculate();
    });
    
    document.getElementById('perpendicularCalculateBtn')?.addEventListener('click', () => {
        startQuestionTimer();
        handlePerpendicularCalculate();
    });
    
    // Practice mode - Submit buttons (submit multiple choice answers)
    document.getElementById('slopeSubmit')?.addEventListener('click', () => {
        handleSlopeSubmit();
    });
    
    document.getElementById('relationshipSubmit')?.addEventListener('click', () => {
        handleRelationshipSubmit();
    });
    
    document.getElementById('parallelSubmit')?.addEventListener('click', () => {
        handleParallelSubmit();
    });
    
    document.getElementById('perpendicularSubmit')?.addEventListener('click', () => {
        handlePerpendicularSubmit();
    });
    
    // New problem types - Calculate buttons
    document.getElementById('interceptCalculateBtn')?.addEventListener('click', () => {
        startQuestionTimer();
        handleInterceptCalculate();
    });
    
    document.getElementById('rateOfChangeCalculateBtn')?.addEventListener('click', () => {
        startQuestionTimer();
        handleRateOfChangeCalculate();
    });
    
    document.getElementById('linearFunctionCalculateBtn')?.addEventListener('click', () => {
        startQuestionTimer();
        handleLinearFunctionCalculate();
    });
    
    document.getElementById('standardFormCalculateBtn')?.addEventListener('click', () => {
        startQuestionTimer();
        handleStandardFormCalculate();
    });
    
    // New problem types - Submit buttons
    document.getElementById('interceptSubmit')?.addEventListener('click', () => {
        handleInterceptSubmit();
    });
    
    document.getElementById('rateOfChangeSubmit')?.addEventListener('click', () => {
        handleRateOfChangeSubmit();
    });
    
    document.getElementById('linearFunctionSubmit')?.addEventListener('click', () => {
        handleLinearFunctionSubmit();
    });
    
    document.getElementById('standardFormSubmit')?.addEventListener('click', () => {
        handleStandardFormSubmit();
    });
    
    // Milestone 16: New feature event listeners
    // Slope mode selector
    document.getElementById('slopeModeSelector')?.addEventListener('change', (e) => {
        const mode = e.target.value;
        // Hide all modes
        document.querySelectorAll('.slope-mode').forEach(m => m.style.display = 'none');
        // Show selected mode
        if (mode === 'twoPoints') {
            document.getElementById('slopeTwoPointsMode').style.display = 'block';
        } else if (mode === 'mAndB') {
            document.getElementById('slopeMAndBMode').style.display = 'block';
        } else if (mode === 'mAndPoint') {
            document.getElementById('slopeMAndPointMode').style.display = 'block';
        }
        resetQuestionState();
    });
    
    // Section 4.9.1: From m and b
    document.getElementById('slopeInterceptMBCalculateBtn')?.addEventListener('click', () => {
        startQuestionTimer();
        handleSlopeInterceptMBCalculate();
    });
    document.getElementById('slopeInterceptMBSubmit')?.addEventListener('click', () => {
        handleSlopeInterceptMBSubmit();
    });
    
    // Section 4.9.2: From m and point
    document.getElementById('slopeInterceptMPointCalculateBtn')?.addEventListener('click', () => {
        startQuestionTimer();
        handleSlopeInterceptMPointCalculate();
    });
    document.getElementById('slopeInterceptMPointSubmit')?.addEventListener('click', () => {
        handleSlopeInterceptMPointSubmit();
    });
    
    // Section 4.11: Two-point form
    document.getElementById('twoPointCalculateBtn')?.addEventListener('click', () => {
        startQuestionTimer();
        handleTwoPointCalculate();
    });
    document.getElementById('twoPointSubmit')?.addEventListener('click', () => {
        handleTwoPointSubmit();
    });
    
    // Section 4.10: Point-slope form
    document.getElementById('pointSlopeCalculateBtn')?.addEventListener('click', () => {
        startQuestionTimer();
        handlePointSlopeBuildCalculate();
    });
    document.getElementById('pointSlopeSubmit')?.addEventListener('click', () => {
        handlePointSlopeBuildSubmit();
    });
    
    // Section 4.13: Absolute value graphs
    document.getElementById('absoluteValueCalculateBtn')?.addEventListener('click', () => {
        startQuestionTimer();
        handleAbsoluteValueCalculate();
    });
    document.getElementById('absoluteValueSubmit')?.addEventListener('click', () => {
        handleAbsoluteValueSubmit();
    });
    
    // MILESTONE 19: Interactive Graphing - Event Listeners
    
    // Graph: Slope-Intercept
    document.getElementById('graphSlopeInterceptSubmit')?.addEventListener('click', () => {
        handleGraphSlopeInterceptSubmit();
    });
    document.getElementById('graphSlopeInterceptNext')?.addEventListener('click', () => {
        handleGraphSlopeInterceptGenerate();
        document.getElementById('graphSlopeInterceptNext').style.display = 'none';
    });
    document.getElementById('graphSlopeInterceptHint')?.addEventListener('click', () => {
        alert('Hint: Find the y-intercept (where x=0), then use the slope to find another point.');
    });
    
    // Graph: Point-Slope
    document.getElementById('graphPointSlopeSubmit')?.addEventListener('click', () => {
        handleGraphPointSlopeSubmit();
    });
    document.getElementById('graphPointSlopeNext')?.addEventListener('click', () => {
        handleGraphPointSlopeGenerate();
        document.getElementById('graphPointSlopeNext').style.display = 'none';
    });
    document.getElementById('graphPointSlopeHint')?.addEventListener('click', () => {
        alert('Hint: The given point from the equation must be one of your selected points.');
    });
    
    // Graph: Parallel
    document.getElementById('graphParallelSubmit')?.addEventListener('click', () => {
        handleGraphParallelSubmit();
    });
    document.getElementById('graphParallelNext')?.addEventListener('click', () => {
        handleGraphParallelGenerate();
        document.getElementById('graphParallelNext').style.display = 'none';
    });
    document.getElementById('graphParallelHint')?.addEventListener('click', () => {
        alert('Hint: Parallel lines have the same slope. First draw the base line, then find points with the same slope through the given point.');
    });
    
    // Graph: Perpendicular
    document.getElementById('graphPerpendicularSubmit')?.addEventListener('click', () => {
        handleGraphPerpendicularSubmit();
    });
    document.getElementById('graphPerpendicularNext')?.addEventListener('click', () => {
        handleGraphPerpendicularGenerate();
        document.getElementById('graphPerpendicularNext').style.display = 'none';
    });
    document.getElementById('graphPerpendicularHint')?.addEventListener('click', () => {
        alert('Hint: Perpendicular lines have negative reciprocal slopes. If m=2, perpendicular slope is -1/2.');
    });
    
    // Graph: Absolute Value
    document.getElementById('graphAbsoluteValueSubmit')?.addEventListener('click', () => {
        handleGraphAbsoluteValueSubmit();
    });
    document.getElementById('graphAbsoluteValueNext')?.addEventListener('click', () => {
        handleGraphAbsoluteValueGenerate();
        document.getElementById('graphAbsoluteValueNext').style.display = 'none';
    });
    document.getElementById('graphAbsoluteValueHint')?.addEventListener('click', () => {
        alert('Hint: Find the vertex first (the V point), then select one point on each side of the V.');
    });
    
    // Start timer on input and reset question answered flag when input changes
    document.querySelectorAll('.input-field').forEach(input => {
        input.addEventListener('focus', startQuestionTimer);
        input.addEventListener('input', () => {
            // Reset question state when user changes input (new question)
            resetQuestionState();
        });
    });
    
    // Issue #021: Achievement modal with defensive checks
    const viewAchievementsBtn = document.getElementById('viewAchievements');
    if (viewAchievementsBtn) {
        viewAchievementsBtn.addEventListener('click', () => {
            console.log('[Issue #021] View Achievements button clicked');
            showAllAchievements();
        });
    } else {
        console.error('[Issue #021] viewAchievements button not found!');
    }
    
    const achievementModal = document.getElementById('achievementModal');
    if (achievementModal) {
        // Close button (the × in the modal)
        const achievementCloseBtn = achievementModal.querySelector('.close-modal');
        if (achievementCloseBtn) {
            achievementCloseBtn.addEventListener('click', () => {
                console.log('[Issue #021] Achievement modal close button clicked');
                achievementModal.classList.remove('active');
            });
        }
        
        // Click outside modal to close
        achievementModal.addEventListener('click', (e) => {
            if (e.target.id === 'achievementModal') {
                console.log('[Issue #021] Clicked outside achievement modal, closing');
                achievementModal.classList.remove('active');
            }
        });
    } else {
        console.error('[Issue #021] achievementModal not found!');
    }
    
    // Hint buttons
    document.querySelectorAll('.hint-button').forEach(button => {
        button.addEventListener('click', () => {
            const hintType = button.dataset.hint;
            // Toggle hint panel - if already shown, hide it; otherwise show it
            const panelId = hintTypeToPanelId[hintType];
            if (panelId) {
                const panel = document.getElementById(panelId);
                if (panel && panel.classList.contains('active')) {
                    hideHints(hintType);
                } else {
                    // Hide all other hint panels first
                    hideHints();
                    showHints(hintType);
                }
            }
        });
    });
    
    // Close hint panels
    document.querySelectorAll('.close-hint').forEach(button => {
        button.addEventListener('click', () => {
            const panelId = button.dataset.hintPanel;
            if (panelId) {
                const panel = document.getElementById(panelId);
                if (panel) {
                    panel.classList.remove('active');
                }
            }
        });
    });
    
    // Close challenge hint panel
    const challengeCloseHint = document.querySelector('[data-hint-panel="challenge-hint-panel"]');
    if (challengeCloseHint) {
        challengeCloseHint.addEventListener('click', () => {
            hideHints();
        });
    }
    
    // Test celebration buttons
    const testConfettiBtn = document.getElementById('testConfettiBtn');
    if (testConfettiBtn) {
        testConfettiBtn.addEventListener('click', () => {
            console.log('Test Confetti button clicked');
            triggerConfetti();
        });
    } else {
        console.error('testConfettiBtn not found');
    }
    
    const testFireworksBtn = document.getElementById('testFireworksBtn');
    if (testFireworksBtn) {
        testFireworksBtn.addEventListener('click', () => {
            console.log('Test Fireworks button clicked');
            triggerFireworks();
        });
    } else {
        console.error('testFireworksBtn not found');
    }
    
    // Milestone 18: Test buttons for new feedback effects
    // Mild effects
    const testFloatingPointsBtn = document.getElementById('testFloatingPointsBtn');
    if (testFloatingPointsBtn) {
        testFloatingPointsBtn.addEventListener('click', () => {
            console.log('[Milestone 18] Test Floating Points button clicked');
            showFloatingPoints(10);
        });
    }
    
    const testSuccessBadgeBtn = document.getElementById('testSuccessBadgeBtn');
    if (testSuccessBadgeBtn) {
        testSuccessBadgeBtn.addEventListener('click', () => {
            console.log('[Milestone 18] Test Success Badge button clicked');
            showSuccessBadge('Test Badge! 🏅');
        });
    }
    
    const testProgressPulseBtn = document.getElementById('testProgressPulseBtn');
    if (testProgressPulseBtn) {
        testProgressPulseBtn.addEventListener('click', () => {
            console.log('[Milestone 18] Test Progress Pulse button clicked');
            pulseProgressBar();
        });
    }
    
    const testSubtleParticlesBtn = document.getElementById('testSubtleParticlesBtn');
    if (testSubtleParticlesBtn) {
        testSubtleParticlesBtn.addEventListener('click', () => {
            console.log('[Milestone 18] Test Subtle Particles button clicked');
            showSubtleParticleBurst();
        });
    }
    
    // Medium effects
    const testEmojiRainBtn = document.getElementById('testEmojiRainBtn');
    if (testEmojiRainBtn) {
        testEmojiRainBtn.addEventListener('click', () => {
            console.log('[Milestone 18] Test Emoji Rain button clicked');
            showEmojiRain();
        });
    }
    
    const testStreakFireBtn = document.getElementById('testStreakFireBtn');
    if (testStreakFireBtn) {
        testStreakFireBtn.addEventListener('click', () => {
            console.log('[Milestone 18] Test Streak Fire button clicked');
            showStreakFire();
        });
    }
    
    const testConfettiTrailsBtn = document.getElementById('testConfettiTrailsBtn');
    if (testConfettiTrailsBtn) {
        testConfettiTrailsBtn.addEventListener('click', () => {
            console.log('[Milestone 18] Test Confetti Trails button clicked');
            showConfettiTrails();
        });
    }
    
    const testScreenBounceBtn = document.getElementById('testScreenBounceBtn');
    if (testScreenBounceBtn) {
        testScreenBounceBtn.addEventListener('click', () => {
            console.log('[Milestone 18] Test Screen Bounce button clicked');
            showScreenBounce();
        });
    }
    
    // High effects
    const testCelebrationModalBtn = document.getElementById('testCelebrationModalBtn');
    if (testCelebrationModalBtn) {
        testCelebrationModalBtn.addEventListener('click', () => {
            console.log('[Milestone 18] Test Celebration Modal button clicked');
            showCelebrationModal('Test Celebration! 🎉');
        });
    }
    
    const testParticleExplosionBtn = document.getElementById('testParticleExplosionBtn');
    if (testParticleExplosionBtn) {
        testParticleExplosionBtn.addEventListener('click', () => {
            console.log('[Milestone 18] Test Particle Explosion button clicked');
            showParticleExplosion();
        });
    }
    
    // Close hint tooltip (legacy - kept for backward compatibility)
    const closeTooltip = document.querySelector('.close-tooltip');
    if (closeTooltip) {
        closeTooltip.addEventListener('click', () => {
            document.getElementById('hintTooltip')?.classList.remove('active');
        });
    }
    
    const hintTooltip = document.getElementById('hintTooltip');
    if (hintTooltip) {
        hintTooltip.addEventListener('click', (e) => {
            if (e.target.id === 'hintTooltip') {
                hintTooltip.classList.remove('active');
            }
        });
    }
    
    // Start session timer if in session mode
    if (gameState.mode === 'session') {
        startSessionTimer();
    }
});



