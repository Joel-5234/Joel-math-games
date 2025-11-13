# Milestone 14: Vertical Navigation Bar

## Goal
Convert the horizontal tab navigation to a vertical sidebar navigation on the left side, with responsive dropdown menu for mobile/tablet devices.

## Overview
Transform the current horizontal tab bar into a vertical sidebar navigation system:
- Move tabs to left sidebar
- Adjust styling for vertical orientation (left border for active state)
- Maintain current grid layout structure
- Add responsive dropdown menu for mobile/tablet
- Set specific width preference for sidebar

## Tasks

### 14.1 HTML Structure Updates
- [x] Move tabs container from main content area to sidebar position
- [x] Create sidebar container structure
- [x] Ensure tabs are properly nested in sidebar
- [x] Add mobile menu toggle button (hamburger icon)
- [x] Create dropdown menu container for mobile

### 14.2 CSS Layout Updates
- [x] Update grid layout to accommodate left sidebar
- [x] Set specific width for sidebar (240px)
- [x] Change tabs container from horizontal flex to vertical flex
- [x] Update tab button styling for vertical orientation:
  - Remove bottom border
  - Add left border for active state
  - Adjust padding for vertical layout
  - Update hover states
- [x] Ensure main content area adjusts properly

### 14.3 Vertical Tab Styling
- [x] Style active tab with left border instead of bottom border
- [x] Adjust tab button width to fill sidebar
- [x] Update text alignment for vertical tabs
- [x] Ensure proper spacing between tabs
- [x] Maintain color scheme and transitions

### 14.4 Responsive Design - Mobile Dropdown
- [x] Hide sidebar on mobile/tablet screens
- [x] Show hamburger menu button on mobile
- [x] Create dropdown menu that appears on button click
- [x] Style dropdown menu to match design
- [x] Add close/overlay functionality for dropdown
- [x] Ensure dropdown works with tab switching

### 14.5 JavaScript Updates
- [x] Add event listener for mobile menu toggle
- [x] Implement dropdown open/close functionality
- [x] Ensure tab switching closes mobile menu
- [x] Handle window resize events
- [x] Update any tab-related JavaScript if needed

### 14.6 Testing
- [x] Test vertical navigation on desktop
- [x] Test all 9 tabs work correctly
- [x] Test active state styling
- [x] Test responsive breakpoints
- [x] Test mobile dropdown functionality
- [x] Test tab switching closes mobile menu
- [x] Test on various screen sizes
- [x] Verify no layout issues

### 14.7 Documentation
- [x] Update PRD with vertical navigation description
- [x] Update activity log
- [x] Document responsive breakpoints

## Acceptance Criteria
- [x] Tabs display vertically in left sidebar
- [x] Active tab shows left border instead of bottom border
- [x] Sidebar has specific width (240px)
- [x] Current grid layout maintained
- [x] Mobile/tablet shows dropdown menu instead of sidebar
- [x] Dropdown menu works correctly
- [x] All 9 tabs accessible and functional
- [x] Responsive design works on all screen sizes
- [x] No layout breaking or visual issues

## Technical Notes

### Sidebar Width
- Recommended: 220-250px fixed width
- Should accommodate longest tab text: "Linear Functions"
- Consider padding and spacing

### Responsive Breakpoints
- Desktop: Show vertical sidebar (default)
- Tablet: Show dropdown menu (< 1024px recommended)
- Mobile: Show dropdown menu (< 768px)

### Grid Layout Structure
Current:
```css
grid-template-columns: 1fr 300px; /* main content + sidebar */
```

New:
```css
grid-template-columns: 250px 1fr 300px; /* sidebar + main content + stats sidebar */
```

### Active State Styling
- Current: `border-bottom-color: #667eea;`
- New: `border-left-color: #667eea;` (3-4px width)
- Remove bottom border styling

### Mobile Menu Implementation
- Hamburger icon button (☰ or custom SVG)
- Dropdown appears below button or as overlay
- Close button or click outside to close
- Smooth transitions for open/close

## Implementation Strategy
1. Update HTML structure first
2. Update CSS grid layout
3. Style vertical tabs
4. Add responsive CSS
5. Add JavaScript for mobile menu
6. Test thoroughly
7. Update documentation

