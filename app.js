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

// Random number generation utility
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 1) {
    const num = Math.random() * (max - min) + min;
    return roundToDecimal(num, decimals);
}

// Distractor Generation Functions for Multiple Choice
function generateSlopeDistractors(correctSlope) {
    const distractors = new Set();
    const correct = correctSlope === Infinity ? 'undefined' : roundToDecimal(correctSlope, 1).toString();
    
    // Generate wrong answers: wrong sign, calculation errors, common mistakes
    while (distractors.size < 3) {
        let distractor;
        if (correctSlope === Infinity) {
            // For vertical lines, wrong answers are numeric slopes
            distractor = roundToDecimal(randomFloat(-5, 5), 1).toString();
        } else if (correctSlope === 0) {
            // For horizontal lines, wrong answers are non-zero slopes
            const val = randomInt(-5, 5) || 1;
            distractor = val.toString();
        } else {
            // Common mistakes: wrong sign, off by small amount, reciprocal
            const mistakeType = randomInt(0, 2);
            if (mistakeType === 0) {
                // Wrong sign
                distractor = roundToDecimal(-correctSlope, 1).toString();
            } else if (mistakeType === 1) {
                // Off by small amount
                distractor = roundToDecimal(correctSlope + randomFloat(-1, 1), 1).toString();
            } else {
                // Reciprocal or other calculation error
                distractor = correctSlope !== 0 ? roundToDecimal(1 / correctSlope, 1).toString() : '1';
            }
        }
        
        if (distractor !== correct && !distractors.has(distractor)) {
            distractors.add(distractor);
        }
    }
    
    return Array.from(distractors);
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
            // Wrong vertical line (different x)
            wrongLine = { kind: 'vertical', x0: correctLine.x0 + randomInt(-3, 3) || 1 };
        } else if (correctLine.kind === 'slope') {
            const mistakeType = randomInt(0, 2);
            if (mistakeType === 0 && !isParallel) {
                // Wrong slope (use parallel slope instead of perpendicular)
                wrongLine = { kind: 'slope', m: baseLine.m, b: point.y - baseLine.m * point.x };
            } else if (mistakeType === 1) {
                // Wrong intercept
                wrongLine = { kind: 'slope', m: correctLine.m, b: correctLine.b + randomInt(-3, 3) || 1 };
            } else {
                // Wrong slope (close but incorrect)
                wrongLine = { kind: 'slope', m: correctLine.m + randomFloat(-0.5, 0.5), b: point.y - (correctLine.m + randomFloat(-0.5, 0.5)) * point.x };
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
    let p1, p2;
    let attempts = 0;
    
    // Ensure points are not identical
    do {
        p1 = { x: randomInt(-10, 10), y: randomInt(-10, 10) };
        p2 = { x: randomInt(-10, 10), y: randomInt(-10, 10) };
        attempts++;
    } while (p1.x === p2.x && p1.y === p2.y && attempts < 100);
    
    const result = calculateSlope(p1, p2);
    
    // Generate two separate questions: slope value and classification
    const slopeValue = result.slope === Infinity ? 'undefined' : roundToDecimal(result.slope, 1).toString();
    const slopeDistractors = generateSlopeDistractors(result.slope);
    const classificationDistractors = generateClassificationDistractors(result.classification);
    
    // Create options for slope question
    const slopeOptions = [
        { label: 'A', value: slopeValue, correct: true },
        { label: 'B', value: slopeDistractors[0], correct: false },
        { label: 'C', value: slopeDistractors[1], correct: false },
        { label: 'D', value: slopeDistractors[2], correct: false }
    ].sort(() => Math.random() - 0.5); // Shuffle options
    
    const correctSlopeIndex = slopeOptions.findIndex(opt => opt.correct);
    const correctSlopeLabel = slopeOptions[correctSlopeIndex].label;
    
    // Create options for classification question
    const classificationOptions = [
        { label: 'A', value: result.classification, correct: true },
        { label: 'B', value: classificationDistractors[0], correct: false },
        { label: 'C', value: classificationDistractors[1], correct: false },
        { label: 'D', value: classificationDistractors[2], correct: false }
    ].sort(() => Math.random() - 0.5); // Shuffle options
    
    const correctClassificationIndex = classificationOptions.findIndex(opt => opt.correct);
    const correctClassificationLabel = classificationOptions[correctClassificationIndex].label;
    
    return {
        type: 'slope',
        question: `Find the slope and classification for the line through points (${p1.x},${p1.y}) and (${p2.x},${p2.y})`,
        display: `(${p1.x},${p1.y}), (${p2.x},${p2.y})`,
        correctAnswer: `Slope: ${slopeValue} (${correctSlopeLabel})\nClassification: ${result.classification} (${correctClassificationLabel})`,
        data: { p1, p2, result },
        slopeQuestion: {
            question: `What is the slope?`,
            options: slopeOptions,
            correctAnswer: correctSlopeLabel
        },
        classificationQuestion: {
            question: `What is the classification?`,
            options: classificationOptions,
            correctAnswer: correctClassificationLabel
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
    
    // Create options for relationship question
    const options = [
        { label: 'A', value: relationship, correct: true },
        { label: 'B', value: relationshipDistractors[0], correct: false },
        { label: 'C', value: relationshipDistractors[1], correct: false },
        { label: 'D', value: relationshipDistractors[2], correct: false }
    ].sort(() => Math.random() - 0.5); // Shuffle options
    
    const correctIndex = options.findIndex(opt => opt.correct);
    const correctLabel = options[correctIndex].label;
    
    const correctAnswer = `Equation 1: ${formatEquation(line1)}\nEquation 2: ${formatEquation(line2)}\nRelationship: ${relationship.charAt(0).toUpperCase() + relationship.slice(1)} (${correctLabel})`;
    
    return {
        type: 'relationship',
        question: `Determine the relationship between the two lines`,
        display: { eq1: eq1Str, eq2: eq2Str },
        correctAnswer: correctAnswer,
        data: { line1, line2, relationship },
        options: options,
        correctAnswerLabel: correctLabel
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
    
    // Create options for parallel question
    const options = [
        { label: 'A', value: correctEq, correct: true },
        { label: 'B', value: equationDistractors[0], correct: false },
        { label: 'C', value: equationDistractors[1], correct: false },
        { label: 'D', value: equationDistractors[2], correct: false }
    ].sort(() => Math.random() - 0.5); // Shuffle options
    
    const correctIndex = options.findIndex(opt => opt.correct);
    const correctLabel = options[correctIndex].label;
    
    const correctAnswer = `Parallel line: ${correctEq} (${correctLabel})`;
    
    return {
        type: 'parallel',
        question: `Find the equation of a line parallel to ${baseEqStr} that passes through point (${point.x},${point.y})`,
        display: { equation: baseEqStr, point: `(${point.x},${point.y})` },
        correctAnswer: correctAnswer,
        data: { baseLine, point, resultLine },
        options: options,
        correctAnswerLabel: correctLabel
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
    
    // Create options for perpendicular question
    const options = [
        { label: 'A', value: correctEq, correct: true },
        { label: 'B', value: equationDistractors[0], correct: false },
        { label: 'C', value: equationDistractors[1], correct: false },
        { label: 'D', value: equationDistractors[2], correct: false }
    ].sort(() => Math.random() - 0.5); // Shuffle options
    
    const correctIndex = options.findIndex(opt => opt.correct);
    const correctLabel = options[correctIndex].label;
    
    const correctAnswer = `Perpendicular line: ${correctEq} (${correctLabel})`;
    
    return {
        type: 'perpendicular',
        question: `Find the equation of a line perpendicular to ${baseEqStr} that passes through point (${point.x},${point.y})`,
        display: { equation: baseEqStr, point: `(${point.x},${point.y})` },
        correctAnswer: correctAnswer,
        data: { baseLine, point, resultLine },
        options: options,
        correctAnswerLabel: correctLabel
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
    endTime: null
};

function generateChallengeQuestions(problemType, count) {
    const questions = [];
    const generators = {
        slope: generateSlopeQuestion,
        relationship: generateRelationshipQuestion,
        parallel: generateParallelQuestion,
        perpendicular: generatePerpendicularQuestion
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
        endTime: null
    };
    
    // Initialize all question states
    for (let i = 0; i < challengeState.questions.length; i++) {
        challengeState.questionStates[i] = 'unanswered';
    }
}

function resetChallenge() {
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
        endTime: null
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

function startChallenge(setSize) {
    const activeTab = document.querySelector('.tab-button.active');
    const problemType = activeTab ? activeTab.dataset.tab : 'slope';
    
    initializeChallenge(problemType, setSize);
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
            
            // Render options
            if (question.slopeQuestion && question.classificationQuestion) {
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
            
            if (question.options) {
                renderRadioOptions('challengeRelationshipOptions', question.options, 'challengeRelationship', null);
                
                // Restore selected answer if answered
                if (userAnswer && questionState === 'answered') {
                    const radio = document.querySelector(`input[name="challengeRelationship"][value="${userAnswer}"]`);
                    if (radio) radio.checked = true;
                    document.querySelectorAll('#challengeRelationshipOptions input').forEach(r => r.disabled = true);
                }
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
            
            if (question.options) {
                renderRadioOptions('challengeParallelOptions', question.options, 'challengeParallel', null);
                
                // Restore selected answer if answered
                if (userAnswer && questionState === 'answered') {
                    const radio = document.querySelector(`input[name="challengeParallel"][value="${userAnswer}"]`);
                    if (radio) radio.checked = true;
                    document.querySelectorAll('#challengeParallelOptions input').forEach(r => r.disabled = true);
                }
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
            
            if (question.options) {
                renderRadioOptions('challengePerpendicularOptions', question.options, 'challengePerpendicular', null);
                
                // Restore selected answer if answered
                if (userAnswer && questionState === 'answered') {
                    const radio = document.querySelector(`input[name="challengePerpendicular"][value="${userAnswer}"]`);
                    if (radio) radio.checked = true;
                    document.querySelectorAll('#challengePerpendicularOptions input').forEach(r => r.disabled = true);
                }
            }
        }
        
        // Show answer if gave up - highlight correct options
        if (questionState === 'gave-up') {
            // Disable all radio buttons
            document.querySelectorAll('#challengeSlopeValueOptions input, #challengeSlopeClassificationOptions input, #challengeRelationshipOptions input, #challengeParallelOptions input, #challengePerpendicularOptions input').forEach(radio => {
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
                document.querySelectorAll(`#challenge${question.type.charAt(0).toUpperCase() + question.type.slice(1)}Options .radio-option`).forEach(opt => {
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
    // Hide hints when navigating
    hideHints();
    
    if (direction === 'next') {
        if (challengeState.currentQuestionIndex < challengeState.questions.length - 1) {
            challengeState.currentQuestionIndex++;
        } else {
            // Check if all questions answered
            checkChallengeCompletion();
            return;
        }
    } else if (direction === 'prev') {
        if (challengeState.currentQuestionIndex > 0) {
            challengeState.currentQuestionIndex--;
        }
    }
    
    displayChallengeQuestion();
}

function skipChallengeQuestion() {
    challengeState.questionStates[challengeState.currentQuestionIndex] = 'skipped';
    navigateChallengeQuestion('next');
}

function giveUpChallengeQuestion() {
    const question = challengeState.questions[challengeState.currentQuestionIndex];
    challengeState.questionStates[challengeState.currentQuestionIndex] = 'gave-up';
    challengeState.correctAnswers[challengeState.currentQuestionIndex] = false;
    
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
        
        userInput = `${slopeSelected.value}, ${classificationSelected.value}`;
        const slopeCorrect = slopeSelected.value === question.slopeQuestion.correctAnswer;
        const classificationCorrect = classificationSelected.value === question.classificationQuestion.correctAnswer;
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
        isCorrect = selected.value === question.correctAnswerLabel;
        
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
        isCorrect = selected.value === question.correctAnswerLabel;
        
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
        isCorrect = selected.value === question.correctAnswerLabel;
        
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
    }
    
    // Store answer and correctness
    challengeState.answers[challengeState.currentQuestionIndex] = userInput;
    challengeState.questionStates[challengeState.currentQuestionIndex] = 'answered';
    challengeState.correctAnswers[challengeState.currentQuestionIndex] = isCorrect;
    
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
    
    // Auto-advance after a delay
    setTimeout(() => {
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
const hintTypeToPanelId = {
    slope: 'slope-hint-panel',
    relationship: 'relationship-hint-panel',
    parallel: 'parallel-hint-panel',
    perpendicular: 'perpendicular-hint-panel'
};

const hintTypeToContentId = {
    slope: 'slope-hint-content',
    relationship: 'relationship-hint-content',
    parallel: 'parallel-hint-content',
    perpendicular: 'perpendicular-hint-content'
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
    
    container.innerHTML = '';
    options.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'radio-option';
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = name;
        radio.id = `${name}_${option.label}`;
        radio.value = option.label;
        radio.dataset.correct = option.correct;
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

// Reset question state when switching tabs or starting new question
function resetQuestionState() {
    gameState.questionAnswered = false;
    currentQuestionData = null;
    
    // Hide multiple choice containers
    document.getElementById('slopeQuestionsContainer')?.style.setProperty('display', 'none');
    document.getElementById('relationshipQuestionContainer')?.style.setProperty('display', 'none');
    document.getElementById('parallelQuestionContainer')?.style.setProperty('display', 'none');
    document.getElementById('perpendicularQuestionContainer')?.style.setProperty('display', 'none');
    
    // Hide submit buttons
    document.getElementById('slopeSubmit')?.style.setProperty('display', 'none');
    document.getElementById('relationshipSubmit')?.style.setProperty('display', 'none');
    document.getElementById('parallelSubmit')?.style.setProperty('display', 'none');
    document.getElementById('perpendicularSubmit')?.style.setProperty('display', 'none');
    
    // Clear result areas
    document.querySelectorAll('.result-area').forEach(area => {
        area.textContent = '';
        area.className = 'result-area';
    });
}

// Problem Type Handlers
function handleSlopeCalculate() {
    const input = document.getElementById('slopeInput').value.trim();
    
    try {
        const pointSeparator = /\)\s*,\s*\(/;
        const parts = input.split(pointSeparator);
        
        if (parts.length !== 2) {
            throw new Error('Please enter two points in the format: (x1,y1), (x2,y2)');
        }
        
        const p1Str = parts[0] + ')';
        const p2Str = '(' + parts[1];
        
        const p1 = parsePoint(p1Str);
        const p2 = parsePoint(p2Str);
        
        // Generate question with multiple choice
        const question = generateSlopeQuestion();
        question.data.p1 = p1;
        question.data.p2 = p2;
        question.data.result = calculateSlope(p1, p2);
        
        // Update question data
        const result = question.data.result;
        const slopeValue = result.slope === Infinity ? 'undefined' : roundToDecimal(result.slope, 1).toString();
        const slopeDistractors = generateSlopeDistractors(result.slope);
        const classificationDistractors = generateClassificationDistractors(result.classification);
        
        const slopeOptions = [
            { label: 'A', value: slopeValue, correct: true },
            { label: 'B', value: slopeDistractors[0], correct: false },
            { label: 'C', value: slopeDistractors[1], correct: false },
            { label: 'D', value: slopeDistractors[2], correct: false }
        ].sort(() => Math.random() - 0.5);
        
        const classificationOptions = [
            { label: 'A', value: result.classification, correct: true },
            { label: 'B', value: classificationDistractors[0], correct: false },
            { label: 'C', value: classificationDistractors[1], correct: false },
            { label: 'D', value: classificationDistractors[2], correct: false }
        ].sort(() => Math.random() - 0.5);
        
        currentQuestionData = {
            type: 'slope',
            slopeOptions: slopeOptions,
            classificationOptions: classificationOptions,
            correctSlopeLabel: slopeOptions.find(opt => opt.correct).label,
            correctClassificationLabel: classificationOptions.find(opt => opt.correct).label
        };
        
        // Display questions
        document.getElementById('slopeQuestionsContainer').style.display = 'block';
        document.getElementById('slopeValueQuestion').querySelector('.question-text').textContent = 'What is the slope?';
        document.getElementById('slopeClassificationQuestion').querySelector('.question-text').textContent = 'What is the classification?';
        
        renderRadioOptions('slopeValueOptions', slopeOptions, 'slopeValue', null);
        renderRadioOptions('slopeClassificationOptions', classificationOptions, 'slopeClassification', null);
        
        document.getElementById('slopeSubmit').style.display = 'block';
        document.getElementById('slopeResult').textContent = '';
        document.getElementById('slopeResult').className = 'result-area';
        
        gameState.questionAnswered = false;
    } catch (error) {
        showResult('Error: ' + error.message, 'error');
    }
}

function handleSlopeSubmit() {
    if (gameState.questionAnswered || !currentQuestionData) {
        return;
    }
    
    const slopeSelected = document.querySelector('input[name="slopeValue"]:checked');
    const classificationSelected = document.querySelector('input[name="slopeClassification"]:checked');
    
    if (!slopeSelected || !classificationSelected) {
        showResult('Please select answers for both questions.', 'error');
        return;
    }
    
    const slopeCorrect = slopeSelected.value === currentQuestionData.correctSlopeLabel;
    const classificationCorrect = classificationSelected.value === currentQuestionData.correctClassificationLabel;
    const bothCorrect = slopeCorrect && classificationCorrect;
    
    // Disable all radio buttons
    document.querySelectorAll('#slopeValueOptions input, #slopeClassificationOptions input').forEach(radio => {
        radio.disabled = true;
    });
    
    // Highlight correct/incorrect
    document.querySelectorAll('#slopeValueOptions .radio-option').forEach(opt => {
        const radio = opt.querySelector('input');
        if (radio.dataset.correct === 'true') {
            opt.classList.add('correct');
        } else if (radio.checked && radio.dataset.correct === 'false') {
            opt.classList.add('incorrect');
        }
    });
    
    document.querySelectorAll('#slopeClassificationOptions .radio-option').forEach(opt => {
        const radio = opt.querySelector('input');
        if (radio.dataset.correct === 'true') {
            opt.classList.add('correct');
        } else if (radio.checked && radio.dataset.correct === 'false') {
            opt.classList.add('incorrect');
        }
    });
    
    let message = '';
    if (bothCorrect) {
        message = 'Correct! ✓\nBoth answers are correct.';
        showResult(message, 'success');
        updateStats('slope', true);
    } else {
        message = 'Incorrect.\n';
        if (!slopeCorrect) {
            message += `Correct slope: ${currentQuestionData.slopeOptions.find(opt => opt.correct).value} (${currentQuestionData.correctSlopeLabel})\n`;
        }
        if (!classificationCorrect) {
            message += `Correct classification: ${currentQuestionData.classificationOptions.find(opt => opt.correct).value} (${currentQuestionData.correctClassificationLabel})`;
        }
        showResult(message, 'error');
        updateStats('slope', false);
    }
    
    gameState.questionAnswered = true;
}

function handleRelationshipCalculate() {
    const eq1 = document.getElementById('equation1Input').value.trim();
    const eq2 = document.getElementById('equation2Input').value.trim();
    
    try {
        const line1 = parseEquation(eq1);
        const line2 = parseEquation(eq2);
        const relationship = determineRelationship(line1, line2);
        const relationshipDistractors = generateRelationshipDistractors(relationship);
        
        const options = [
            { label: 'A', value: relationship, correct: true },
            { label: 'B', value: relationshipDistractors[0], correct: false },
            { label: 'C', value: relationshipDistractors[1], correct: false },
            { label: 'D', value: relationshipDistractors[2], correct: false }
        ].sort(() => Math.random() - 0.5);
        
        const correctLabel = options.find(opt => opt.correct).label;
        
        currentQuestionData = {
            type: 'relationship',
            options: options,
            correctLabel: correctLabel
        };
        
        document.getElementById('relationshipQuestionContainer').style.display = 'block';
        document.querySelector('#relationshipQuestionContainer .question-text').textContent = 'What is the relationship between these two lines?';
        renderRadioOptions('relationshipOptions', options, 'relationship', null);
        document.getElementById('relationshipSubmit').style.display = 'block';
        document.getElementById('relationshipResult').textContent = '';
        document.getElementById('relationshipResult').className = 'result-area';
        
        gameState.questionAnswered = false;
    } catch (error) {
        showResult('Error: ' + error.message, 'error');
    }
}

function handleRelationshipSubmit() {
    if (gameState.questionAnswered || !currentQuestionData) {
        return;
    }
    
    const selected = document.querySelector('input[name="relationship"]:checked');
    if (!selected) {
        showResult('Please select an answer.', 'error');
        return;
    }
    
    const isCorrect = selected.value === currentQuestionData.correctLabel;
    
    document.querySelectorAll('#relationshipOptions input').forEach(radio => {
        radio.disabled = true;
    });
    
    document.querySelectorAll('#relationshipOptions .radio-option').forEach(opt => {
        const radio = opt.querySelector('input');
        if (radio.dataset.correct === 'true') {
            opt.classList.add('correct');
        } else if (radio.checked && radio.dataset.correct === 'false') {
            opt.classList.add('incorrect');
        }
    });
    
    if (isCorrect) {
        showResult('Correct! ✓', 'success');
        updateStats('relationship', true);
    } else {
        const correctOption = currentQuestionData.options.find(opt => opt.correct);
        showResult(`Incorrect. Correct answer: ${correctOption.value} (${correctOption.label})`, 'error');
        updateStats('relationship', false);
    }
    
    gameState.questionAnswered = true;
}

function handleParallelCalculate() {
    const equation = document.getElementById('parallelEquationInput').value.trim();
    const pointStr = document.getElementById('parallelPointInput').value.trim();
    
    try {
        const baseLine = parseEquation(equation);
        const point = parsePoint(pointStr);
        const resultLine = findParallelLine(baseLine, point);
        const equationDistractors = generateEquationDistractors(resultLine, baseLine, point, true);
        const correctEq = formatEquation(resultLine);
        
        const options = [
            { label: 'A', value: correctEq, correct: true },
            { label: 'B', value: equationDistractors[0], correct: false },
            { label: 'C', value: equationDistractors[1], correct: false },
            { label: 'D', value: equationDistractors[2], correct: false }
        ].sort(() => Math.random() - 0.5);
        
        const correctLabel = options.find(opt => opt.correct).label;
        
        currentQuestionData = {
            type: 'parallel',
            options: options,
            correctLabel: correctLabel
        };
        
        document.getElementById('parallelQuestionContainer').style.display = 'block';
        document.querySelector('#parallelQuestionContainer .question-text').textContent = 'Which equation represents a line parallel to the base line that passes through the given point?';
        renderRadioOptions('parallelOptions', options, 'parallel', null);
        document.getElementById('parallelSubmit').style.display = 'block';
        document.getElementById('parallelResult').textContent = '';
        document.getElementById('parallelResult').className = 'result-area';
        
        gameState.questionAnswered = false;
    } catch (error) {
        showResult('Error: ' + error.message, 'error');
    }
}

function handleParallelSubmit() {
    if (gameState.questionAnswered || !currentQuestionData) {
        return;
    }
    
    const selected = document.querySelector('input[name="parallel"]:checked');
    if (!selected) {
        showResult('Please select an answer.', 'error');
        return;
    }
    
    const isCorrect = selected.value === currentQuestionData.correctLabel;
    
    document.querySelectorAll('#parallelOptions input').forEach(radio => {
        radio.disabled = true;
    });
    
    document.querySelectorAll('#parallelOptions .radio-option').forEach(opt => {
        const radio = opt.querySelector('input');
        if (radio.dataset.correct === 'true') {
            opt.classList.add('correct');
        } else if (radio.checked && radio.dataset.correct === 'false') {
            opt.classList.add('incorrect');
        }
    });
    
    if (isCorrect) {
        showResult('Correct! ✓', 'success');
        updateStats('parallel', true);
    } else {
        const correctOption = currentQuestionData.options.find(opt => opt.correct);
        showResult(`Incorrect. Correct answer: ${correctOption.value} (${correctOption.label})`, 'error');
        updateStats('parallel', false);
    }
    
    gameState.questionAnswered = true;
}

function handlePerpendicularCalculate() {
    const equation = document.getElementById('perpendicularEquationInput').value.trim();
    const pointStr = document.getElementById('perpendicularPointInput').value.trim();
    
    try {
        const baseLine = parseEquation(equation);
        const point = parsePoint(pointStr);
        const resultLine = findPerpendicularLine(baseLine, point);
        const equationDistractors = generateEquationDistractors(resultLine, baseLine, point, false);
        const correctEq = formatEquation(resultLine);
        
        const options = [
            { label: 'A', value: correctEq, correct: true },
            { label: 'B', value: equationDistractors[0], correct: false },
            { label: 'C', value: equationDistractors[1], correct: false },
            { label: 'D', value: equationDistractors[2], correct: false }
        ].sort(() => Math.random() - 0.5);
        
        const correctLabel = options.find(opt => opt.correct).label;
        
        currentQuestionData = {
            type: 'perpendicular',
            options: options,
            correctLabel: correctLabel
        };
        
        document.getElementById('perpendicularQuestionContainer').style.display = 'block';
        document.querySelector('#perpendicularQuestionContainer .question-text').textContent = 'Which equation represents a line perpendicular to the base line that passes through the given point?';
        renderRadioOptions('perpendicularOptions', options, 'perpendicular', null);
        document.getElementById('perpendicularSubmit').style.display = 'block';
        document.getElementById('perpendicularResult').textContent = '';
        document.getElementById('perpendicularResult').className = 'result-area';
        
        gameState.questionAnswered = false;
    } catch (error) {
        showResult('Error: ' + error.message, 'error');
    }
}

function handlePerpendicularSubmit() {
    if (gameState.questionAnswered || !currentQuestionData) {
        return;
    }
    
    const selected = document.querySelector('input[name="perpendicular"]:checked');
    if (!selected) {
        showResult('Please select an answer.', 'error');
        return;
    }
    
    const isCorrect = selected.value === currentQuestionData.correctLabel;
    
    document.querySelectorAll('#perpendicularOptions input').forEach(radio => {
        radio.disabled = true;
    });
    
    document.querySelectorAll('#perpendicularOptions .radio-option').forEach(opt => {
        const radio = opt.querySelector('input');
        if (radio.dataset.correct === 'true') {
            opt.classList.add('correct');
        } else if (radio.checked && radio.dataset.correct === 'false') {
            opt.classList.add('incorrect');
        }
    });
    
    if (isCorrect) {
        showResult('Correct! ✓', 'success');
        updateStats('perpendicular', true);
    } else {
        const correctOption = currentQuestionData.options.find(opt => opt.correct);
        showResult(`Incorrect. Correct answer: ${correctOption.value} (${correctOption.label})`, 'error');
        updateStats('perpendicular', false);
    }
    
    gameState.questionAnswered = true;
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
    
    // Start timer on input and reset question answered flag when input changes
    document.querySelectorAll('.input-field').forEach(input => {
        input.addEventListener('focus', startQuestionTimer);
        input.addEventListener('input', () => {
            // Reset question state when user changes input (new question)
            resetQuestionState();
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



