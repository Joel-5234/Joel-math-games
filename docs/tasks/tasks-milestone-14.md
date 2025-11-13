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
- [ ] Move tabs container from main content area to sidebar position
- [ ] Create sidebar container structure
- [ ] Ensure tabs are properly nested in sidebar
- [ ] Add mobile menu toggle button (hamburger icon)
- [ ] Create dropdown menu container for mobile

### 14.2 CSS Layout Updates
- [ ] Update grid layout to accommodate left sidebar
- [ ] Set specific width for sidebar (recommend 220-250px)
- [ ] Change tabs container from horizontal flex to vertical flex
- [ ] Update tab button styling for vertical orientation:
  - Remove bottom border
  - Add left border for active state
  - Adjust padding for vertical layout
  - Update hover states
- [ ] Ensure main content area adjusts properly

### 14.3 Vertical Tab Styling
- [ ] Style active tab with left border instead of bottom border
- [ ] Adjust tab button width to fill sidebar
- [ ] Update text alignment for vertical tabs
- [ ] Ensure proper spacing between tabs
- [ ] Maintain color scheme and transitions

### 14.4 Responsive Design - Mobile Dropdown
- [ ] Hide sidebar on mobile/tablet screens
- [ ] Show hamburger menu button on mobile
- [ ] Create dropdown menu that appears on button click
- [ ] Style dropdown menu to match design
- [ ] Add close/overlay functionality for dropdown
- [ ] Ensure dropdown works with tab switching

### 14.5 JavaScript Updates
- [ ] Add event listener for mobile menu toggle
- [ ] Implement dropdown open/close functionality
- [ ] Ensure tab switching closes mobile menu
- [ ] Handle window resize events
- [ ] Update any tab-related JavaScript if needed

### 14.6 Testing
- [ ] Test vertical navigation on desktop
- [ ] Test all 9 tabs work correctly
- [ ] Test active state styling
- [ ] Test responsive breakpoints
- [ ] Test mobile dropdown functionality
- [ ] Test tab switching closes mobile menu
- [ ] Test on various screen sizes
- [ ] Verify no layout issues

### 14.7 Documentation
- [ ] Update PRD with vertical navigation description
- [ ] Update activity log
- [ ] Document responsive breakpoints

## Acceptance Criteria
- [ ] Tabs display vertically in left sidebar
- [ ] Active tab shows left border instead of bottom border
- [ ] Sidebar has specific width (220-250px recommended)
- [ ] Current grid layout maintained
- [ ] Mobile/tablet shows dropdown menu instead of sidebar
- [ ] Dropdown menu works correctly
- [ ] All 9 tabs accessible and functional
- [ ] Responsive design works on all screen sizes
- [ ] No layout breaking or visual issues

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

