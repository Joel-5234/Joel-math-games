# Milestone 15: Fraction-Only Answer Format

## Goal
Display all numeric answers (slopes and slopes in equations) in fraction format only, without decimal equivalents: "fraction" (e.g., "2/3" instead of "2/3 (0.667)")

## Overview
Change multiple choice answers to show only fraction representations:
- All slope values shown as fractions only (no decimal)
- All slopes in equations shown as fractions only
- Fractions are simplified (e.g., 4/8 → 1/2)
- Distractors also use fraction-only format
- Applies to all problem types: slope values, parallel/perpendicular equations, intercepts, rate of change

## Tasks

### 15.1 Fraction Conversion Utilities
- [ ] Create `gcd(a, b)` function to find greatest common divisor
  - Use Euclidean algorithm
  - Handle negative numbers correctly
  - Handle zero cases
- [ ] Create `simplifyFraction(numerator, denominator)` function
  - Use GCD to reduce fraction
  - Handle negative fractions (sign in numerator)
  - Return simplified numerator and denominator
- [ ] Create `decimalToFraction(decimal, tolerance, maxDenominator)` function
  - Convert decimal to fraction representation
  - Use continued fractions or tolerance-based approach
  - Handle repeating decimals appropriately
  - Limit denominator size (e.g., max 100) for readability
  - Return { numerator, denominator } or null if conversion fails
- [ ] Create `formatSlopeValue(slope)` function
  - Convert slope to fraction if possible
  - Simplify fraction
  - Format as "fraction" only (no decimal)
  - Handle special cases: undefined, 0, integers
  - For values that don't convert cleanly, use fraction approximation or fallback to decimal

### 15.2 Update Slope Value Display
- [ ] Update `generateSlopeQuestion()` function
  - Use `formatSlopeValue()` for correct answer
  - Store fraction format only
- [ ] Update `handleSlopeCalculate()` function
  - Use `formatSlopeValue()` when generating slope options
  - Display format: "fraction" (e.g., "2/3", "-1/2", "5")
- [ ] Update `generateSlopeDistractors()` function
  - Convert each distractor to fraction format using `formatSlopeValue()`
  - Ensure distractors remain distinct after formatting
- [ ] Update challenge mode slope question display
  - Use `formatSlopeValue()` in `displayChallengeQuestion()`
  - Ensure consistent formatting across all modes

### 15.3 Update Equation Formatting
- [ ] Update `formatEquation()` function
  - Convert slope (m) to fraction format only
  - Display as fraction in equation: `y = 2/3x + 1` or `y = (2/3)x + 1`
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

### 15.4 Update Other Problem Types
- [ ] Update intercept problem formatting
  - Display intercepts as fractions when applicable
  - Handle coordinate points appropriately
- [ ] Update rate of change formatting
  - Display rates as fractions when applicable
- [ ] Update standard form conversion
  - Ensure coefficients are integers (already handled)
  - Display slopes in fraction format if shown

### 15.5 Answer Validation Updates
- [ ] Update slope answer validation
  - Handle fraction format in comparison
  - Compare numeric values, not string representations
  - Parse fraction strings to numeric values for comparison
  - Ensure correct answer matching works with fraction format
- [ ] Update equation answer validation
  - Parse fraction format in equations
  - Compare slopes numerically regardless of format
  - Handle edge cases (integers, zero, undefined)

### 15.6 UI and Display Updates
- [ ] Update radio option rendering
  - Ensure fraction format displays correctly
  - Handle long fractions gracefully (e.g., "123/456")
  - Maintain readability and spacing
- [ ] Update result messages
  - Show correct answer in fraction format
  - Ensure error messages are clear
- [ ] Test with various slope values
  - Simple fractions: 1/2, 2/3, -3/4
  - Integers: 2, -5, 0
  - Complex fractions: 7/11, -13/17
  - Decimals that convert to fractions: 0.333... → 1/3, 0.666... → 2/3

### 15.7 Testing
- [ ] Test fraction conversion with various inputs
  - Simple decimals (0.5 → 1/2, 0.75 → 3/4, -0.25 → -1/4)
  - Repeating decimals (0.333... → 1/3, 0.666... → 2/3)
  - Integers (2 → 2, -5 → -5, 0 → 0)
  - Edge cases (very small, very large, zero, undefined)
- [ ] Test slope value display in Practice mode
  - Verify fraction format appears (no decimal)
  - Verify all 4 options show correct format
  - Verify distractors are distinct
- [ ] Test slope value display in Challenge mode
  - Verify consistent formatting
  - Verify answer validation works
- [ ] Test slope value display in Session mode
  - Verify consistent formatting
- [ ] Test equation formatting
  - Verify slopes in equations show fraction format only
  - Verify parallel line equations
  - Verify perpendicular line equations
  - Verify distractors use fraction format
- [ ] Test answer validation
  - Verify correct answers are recognized
  - Verify wrong answers are rejected
  - Test with various fraction formats

### 15.8 Documentation
- [ ] Update PRD with fraction-only format requirement
- [ ] Document fraction conversion algorithm
- [ ] Update README if needed
- [ ] Update activity log
- [ ] Mark Milestone 11 as cancelled/replaced (if applicable)

## Acceptance Criteria
- [ ] All slope values displayed as fractions only (no decimal)
- [ ] Fractions are simplified (e.g., 4/8 → 1/2)
- [ ] Slopes in equations show fraction format only
- [ ] Distractors also use fraction-only format
- [ ] Answer validation works correctly with fraction format
- [ ] Formatting is consistent across all modes (Practice, Challenge, Session)
- [ ] Special cases handled correctly (integers, zero, undefined, very small/large numbers)
- [ ] UI displays fractions clearly and readably
- [ ] Values that don't convert cleanly are handled appropriately (fraction approximation or decimal fallback)

## Technical Notes

### Fraction Conversion Algorithm
- Use tolerance-based approach for decimal to fraction conversion
- For common decimals, use lookup table (0.5 → 1/2, 0.25 → 1/4, etc.)
- For other decimals, use continued fractions or approximation
- Limit denominator size to keep fractions readable (e.g., max denominator 100)
- If conversion fails or denominator too large, consider fallback options

### Format Examples
- Simple fraction: "1/2" (not "1/2 (0.5)")
- Negative fraction: "-2/3" (not "-2/3 (-0.667)")
- Integer: "2" (not "2/1" or "2 (2.0)")
- Complex fraction: "7/11" (not "7/11 (0.636)")
- Equation: "y = 2/3x + 1" or "y = (2/3)x + 1" (not "y = 2/3x + 1 (slope: 0.667)")

### Edge Cases
- Zero: "0" (not "0/1" or "0 (0.0)")
- Undefined: "undefined" (no fraction, no decimal)
- Very small numbers: May show as fraction if denominator reasonable, otherwise decimal fallback
- Very large numbers: May show as fraction if denominator reasonable, otherwise decimal fallback
- Repeating decimals: Convert to fraction (e.g., 0.333... → 1/3)
- Non-terminating decimals: Use fraction approximation with reasonable denominator limit

### Implementation Strategy
1. Create utility functions first (gcd, simplifyFraction, decimalToFraction, formatSlopeValue)
2. Test utilities independently
3. Update slope value display functions
4. Update equation formatting function
5. Update distractor generation
6. Update answer validation
7. Update other problem types (intercepts, rate of change)
8. Test thoroughly across all modes

### Relationship to Milestone 11
- Milestone 11 planned "fraction (decimal)" format
- Milestone 15 changes to "fraction only" format
- Consider Milestone 11 cancelled/replaced by Milestone 15
- Or keep both if different use cases needed

