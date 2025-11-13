# Milestone 11: Fraction and Decimal Answer Format

## Goal
Display all numeric answers (slopes and slopes in equations) in both fraction and decimal formats: "fraction (decimal)" (e.g., "2/3 (0.667)")

## Overview
Enhance multiple choice answers to show both fraction and decimal representations:
- All slope values shown as "fraction (decimal)" format
- All slopes in equations shown as fractions with decimal equivalents
- Fractions are simplified (e.g., 4/8 → 1/2)
- Distractors also include both formats
- Applies to all problem types: slope values, parallel/perpendicular equations

## Tasks

### 11.1 Fraction Conversion Utilities
- [ ] Create `gcd(a, b)` function to find greatest common divisor
  - Use Euclidean algorithm
  - Handle negative numbers correctly
  - Handle zero cases
- [ ] Create `simplifyFraction(numerator, denominator)` function
  - Use GCD to reduce fraction
  - Handle negative fractions (sign in numerator)
  - Return simplified numerator and denominator
- [ ] Create `decimalToFraction(decimal, tolerance)` function
  - Convert decimal to fraction representation
  - Use continued fractions or tolerance-based approach
  - Handle repeating decimals appropriately
  - Return { numerator, denominator } or null if conversion fails
- [ ] Create `formatSlopeValue(slope)` function
  - Convert slope to fraction if possible
  - Simplify fraction
  - Format as "fraction (decimal)" or just "decimal" if fraction conversion fails
  - Handle special cases: undefined, 0, integers, very small/large numbers
  - Round decimal to reasonable precision (1-2 decimal places)

### 11.2 Update Slope Value Display
- [ ] Update `generateSlopeQuestion()` function
  - Use `formatSlopeValue()` for correct answer
  - Store both fraction and decimal formats
- [ ] Update `handleSlopeCalculate()` function
  - Use `formatSlopeValue()` when generating slope options
  - Display format: "fraction (decimal)"
- [ ] Update `generateSlopeDistractors()` function
  - Generate distractors as decimals
  - Convert each distractor to fraction format using `formatSlopeValue()`
  - Ensure distractors remain distinct after formatting
- [ ] Update challenge mode slope question display
  - Use `formatSlopeValue()` in `displayChallengeQuestion()`
  - Ensure consistent formatting across all modes

### 11.3 Update Equation Formatting
- [ ] Update `formatEquation()` function
  - Convert slope (m) to fraction format
  - Display as "fraction (decimal)" in equation
  - Format: `y = (2/3 (0.667))x + 1` or `y = 2/3x + 1 (slope: 0.667)`
  - Handle special cases: m = 0, m = 1, m = -1, integers
  - Keep intercept as integer or decimal as appropriate
- [ ] Update `generateEquationDistractors()` function
  - Ensure wrong equations also show fraction format for slopes
  - Maintain consistency in formatting
- [ ] Update parallel line question generation
  - Use updated `formatEquation()` for correct answer
  - Ensure distractors use fraction format
- [ ] Update perpendicular line question generation
  - Use updated `formatEquation()` for correct answer
  - Ensure distractors use fraction format

### 11.4 Answer Validation Updates
- [ ] Update slope answer validation
  - Handle both fraction and decimal formats in comparison
  - Compare numeric values, not string representations
  - Ensure correct answer matching works with new format
- [ ] Update equation answer validation
  - Parse fraction format in equations
  - Compare slopes numerically regardless of format
  - Handle edge cases (integers, zero, undefined)

### 11.5 UI and Display Updates
- [ ] Update radio option rendering
  - Ensure fraction (decimal) format displays correctly
  - Handle long fractions gracefully (e.g., "123/456 (0.270)")
  - Maintain readability and spacing
- [ ] Update result messages
  - Show correct answer in fraction (decimal) format
  - Ensure error messages are clear
- [ ] Test with various slope values
  - Simple fractions: 1/2, 2/3, -3/4
  - Integers: 2, -5, 0
  - Complex fractions: 7/11, -13/17
  - Decimals that don't convert cleanly: 0.333, 0.666

### 11.6 Testing
- [ ] Test fraction conversion with various inputs
  - Simple decimals (0.5, 0.75, -0.25)
  - Repeating decimals (0.333..., 0.666...)
  - Integers (2, -5, 0)
  - Edge cases (very small, very large, zero, undefined)
- [ ] Test slope value display in Practice mode
  - Verify fraction (decimal) format appears
  - Verify all 4 options show correct format
  - Verify distractors are distinct
- [ ] Test slope value display in Challenge mode
  - Verify consistent formatting
  - Verify answer validation works
- [ ] Test slope value display in Session mode
  - Verify consistent formatting
- [ ] Test equation formatting
  - Verify slopes in equations show fraction format
  - Verify parallel line equations
  - Verify perpendicular line equations
  - Verify distractors use fraction format
- [ ] Test answer validation
  - Verify correct answers are recognized
  - Verify wrong answers are rejected
  - Test with various fraction formats

### 11.7 Documentation
- [ ] Update PRD with fraction (decimal) format requirement
- [ ] Document fraction conversion algorithm
- [ ] Update README if needed
- [ ] Update activity log

## Acceptance Criteria
- [ ] All slope values displayed as "fraction (decimal)" format
- [ ] Fractions are simplified (e.g., 4/8 → 1/2)
- [ ] Slopes in equations show fraction format
- [ ] Distractors also use fraction (decimal) format
- [ ] Answer validation works correctly with new format
- [ ] Formatting is consistent across all modes (Practice, Challenge, Session)
- [ ] Special cases handled correctly (integers, zero, undefined, very small/large numbers)
- [ ] UI displays fractions clearly and readably

## Technical Notes

### Fraction Conversion Algorithm
- Use tolerance-based approach for decimal to fraction conversion
- For common decimals, use lookup table (0.5 → 1/2, 0.25 → 1/4, etc.)
- For other decimals, use continued fractions or approximation
- Limit denominator size to keep fractions readable (e.g., max denominator 100)

### Format Examples
- Simple fraction: "1/2 (0.5)"
- Negative fraction: "-2/3 (-0.667)"
- Integer: "2 (2.0)" or just "2"
- Complex fraction: "7/11 (0.636)"
- Equation: "y = 2/3x + 1" with note "(slope: 0.667)" or "y = (2/3 (0.667))x + 1"

### Edge Cases
- Zero: "0 (0.0)" or just "0"
- Undefined: "undefined" (no decimal)
- Very small numbers: May show as decimal only if fraction is too complex
- Very large numbers: May show as decimal only if fraction is too complex
- Repeating decimals: Convert to fraction (e.g., 0.333... → 1/3)

### Implementation Strategy
1. Create utility functions first (gcd, simplifyFraction, decimalToFraction, formatSlopeValue)
2. Test utilities independently
3. Update slope value display functions
4. Update equation formatting function
5. Update distractor generation
6. Update answer validation
7. Test thoroughly across all modes

