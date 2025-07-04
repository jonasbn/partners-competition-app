# Z-Index Documentation - Portal-Based Implementation

## Overview
This document outlines the current z-index approach used in the Partners Competition App after implementing a portal-based solution for avatar popups. The app now uses React Portals to render avatar popups directly to `document.body`, eliminating stacking context issues and the need for complex z-index hierarchies.

## Current Implementation

### Avatar Hover Popups - **999999** (Portal-Based)
**Location**: `AvatarWithHover.js` component  
**Purpose**: Avatar hover popups rendered via React Portal to `document.body`  
**Scope**: Fixed positioning based on avatar's screen coordinates  
**Usage**: Applied to all avatar hover interactions across the application

**Key Benefits:**
- Popups render outside normal document flow via `createPortal(popup, document.body)`
- Fixed positioning ensures popups appear at correct screen coordinates
- Automatic layering above all other content regardless of parent stacking contexts
- No need for complex CSS z-index rules or GamesList-specific overrides

```javascript
// AvatarWithHover.js portal implementation
{showPopup && createPortal(
  <div style={{
    position: 'fixed',
    left: `${popupPosition.x}px`,
    top: `${popupPosition.y}px`,
    transform: 'translate(-50%, -50%)',
    zIndex: 999999,
    // ... other styles
  }}>
    {/* Popup content */}
  </div>,
  document.body // Render to document.body instead of local DOM
)}
```

## Removed CSS Rules
The following GamesList-specific CSS rules are no longer needed due to the portal implementation:
- `.card .card-body .card .card-body .list-group-item .avatar-container:hover`
- Complex overflow and stacking context management rules
- GamesList row z-index overrides

## Technical Notes
- Popup position is calculated using `getBoundingClientRect()` for accurate screen coordinates
- Position updates automatically on scroll/resize events
- Portal approach eliminates all stacking context conflicts
- Simplified CSS maintenance with fewer z-index rules
// AvatarWithHover.js popup style
position: 'absolute',
left: '50%',
top: '50%', 
transform: 'translate(-50%, -50%)', // Center popup on avatar
zIndex: 10007
```

### 3. Table Cell Avatar Hover - **10006**
**Location**: `App.css` - Table cell avatar containers on hover  
**Purpose**: Ensures avatar popups in table cells (Leaderboard, TeamStatistics) appear centered on avatars  
**Scope**: Applied to avatar containers within table cell flex layouts during hover state

```css
.table td .d-flex.align-items-center .avatar-container:hover {
  z-index: 10006 !important;
}
```

### 4. Summary Card Avatar Hover - **10005**
**Location**: `App.css` - Summary card avatar containers on hover  
**Purpose**: Ensures summary card avatars appear above card content when hovered  
**Scope**: Applied to avatar containers in summary cards during hover state

```css
.card .card-body .d-flex.justify-content-center .position-relative .avatar-container:hover {
  z-index: 10005 !important;
}
```

### 5. Avatar Popup Fallback - **10004**
**Location**: `App.css` - Backup popup styling  
**Purpose**: Alternative popup styling with high z-index  
**Scope**: General avatar popup containers

```css
.avatar-popup,
.avatar-container .avatar-popup {
  z-index: 10004 !important;
}
```

### 6. Nested Card Avatar Hover - **10003**
**Location**: `App.css` - Avatar containers in nested card structures  
**Purpose**: Ensures visibility in complex nested layouts (games list)  
**Scope**: Avatar containers within list group items in cards

```css
.card .card-body .list-group-item .avatar-container:hover {
  z-index: 10003;
}
```

### 6. List Group Avatar Hover - **10002**
**Location**: `App.css` - List group item avatar hover state  
**Purpose**: Higher z-index for avatar interactions in list contexts  
**Scope**: Avatar containers in list group items during hover

```css
.list-group-item .avatar-container:hover {
  z-index: 10002;
}
```

### 7. Avatar Container Hover - **10001**
**Location**: `App.css` - General avatar hover state  
**Purpose**: Standard hover z-index for avatar containers  
**Scope**: General avatar hover interactions

```css
.avatar-container:hover {
  z-index: 10001;
}
```

### 8. Avatar Popup Base - **10000**
**Location**: `App.css` - Base avatar popup styling  
**Purpose**: Base z-index for avatar popup elements  
**Scope**: General avatar popup positioning

```css
.avatar-popup {
  z-index: 10000;
}
```

### 9. Bootstrap Modal Backdrop - **1055** (Bootstrap default)
**Location**: Bootstrap framework  
**Purpose**: Modal overlay backgrounds  
**Scope**: Framework-managed z-index for modal dialogs

### 10. Bootstrap Modal - **1050** (Bootstrap default)
**Location**: Bootstrap framework  
**Purpose**: Modal dialog content  
**Scope**: Framework-managed z-index for modal content

### 11. Bootstrap Dropdown - **1000** (Bootstrap default)
**Location**: Bootstrap framework  
**Purpose**: Dropdown menu overlays  
**Scope**: Framework-managed z-index for dropdown components

### 12. Card Elements - **2**
**Location**: `App.css` - Card components and list group avatar containers  
**Purpose**: Standard stacking for main content cards  
**Scope**: Card components and structured list elements

```css
.card {
  z-index: 2;
}

.list-group-item .avatar-container {
  z-index: 2;
}
```

### 13. List Group Items & Badge Elements - **1**
**Location**: `App.css` - List items and badge positioning  
**Purpose**: Standard stacking for list content  
**Scope**: List group items, badges, and flex containers

```css
.avatar-container {
  z-index: 1;
}

.list-group-item {
  z-index: 1;
}

.list-group-item .d-flex {
  z-index: 1;
}

.list-group-item .badge {
  z-index: 1;
}
```

### 14. Standard Content - **Auto/Default**
**Location**: All other components  
**Purpose**: Normal document flow stacking  
**Scope**: Charts, navigation, most UI elements
## Implementation Changes

### Removed from Previous Version
- **Complex overlapping avatar CSS rules**: Eliminated z-index 10006 and 10007 for overlapping avatars
- **Component-specific z-index overrides**: Simplified to use component-level z-index management
- **Negative margin overlapping system**: Replaced with clean flexbox gap spacing

### Current Avatar Layout Approach
- **Side-by-side positioning**: Using `gap: 1.5rem` for avatar spacing
- **Enhanced flexbox properties**: `flexWrap: 'nowrap'`, `flex: 'none'` for consistent layout
- **Higher CSS specificity**: Using `!important` flags to override Bootstrap defaults
- **Responsive design**: Mobile-specific gap spacing (0.5rem for screens < 576px)

```css
/* Current implementation - clean side-by-side layout */
.card.border-primary .card-body .d-flex.justify-content-center {
  gap: 1rem !important;
}

.most-winning-team-avatars {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: nowrap;
}
```

## Component-Specific Z-Index Usage

### AvatarWithHover Component
- **Popup z-index**: 10007 (highest priority)
- **Container z-index**: Auto (natural stacking)
- **Purpose**: Ensures hover popups always visible above content

### Games History (GamesList.js)
- **Avatar hover z-index**: Uses layered approach (10001, 10002, 10003)
- **Container stacking**: z-index 1-2 for proper list item organization
- **Purpose**: Handles complex nested card structures

### Summary Cards (SummaryCards.js)
- **Most Winning Team**: Side-by-side layout, avatar hover z-index 10005
- **Leading Player**: Standard avatar implementation with popup z-index 10015
- **Layout**: Clean flexbox layout without z-index conflicts

### Leaderboard Component
- **Avatar interactions**: Uses AvatarWithHover component (z-index 10015)
- **Table structure**: Natural stacking with hover popups

### Team Statistics Component
- **Chart overlays**: Uses AvatarWithHover component (z-index 10015)
- **Standard layout**: Natural chart layout with avatar overlays

## Best Practices Implemented

### 1. Layered Z-Index System
- **Critical popups**: z-index 10000+ range for avatar interactions
- **UI components**: z-index 1-10 range for standard stacking
- **Framework defaults**: Bootstrap z-index values preserved (1000+)

### 2. Consistent Popup Behavior
- **Primary popup z-index**: 10007 for main avatar popups
- **Context-specific adjustments**: 10001-10005 for different interaction contexts
- **Absolute positioning**: Popup centered directly on top of avatar
- **Improved UX**: Popup stays in place, easier to view and interact with

### 3. Maintainable Architecture
- **Component-level management**: Z-index defined per component context
- **CSS specificity**: Using `!important` where needed for Bootstrap overrides
- **Clear separation**: Different z-index levels for different interaction types

### 4. Responsive Design
- **Mobile optimizations**: Adjusted gap spacing for smaller screens
- **Overflow handling**: `overflow: visible` to prevent popup clipping
- **Viewport awareness**: Popup positioning within viewport bounds

## Future Considerations

### Adding New Components
1. **Avatar interactions**: Use AvatarWithHover component (automatic z-index 10015)
2. **New overlays**: Consider z-index > 10007 if needed above avatar popups
3. **Standard content**: Use natural stacking (no z-index) when possible

### Troubleshooting Z-Index Issues
1. **Check component context**: Verify which z-index layer is appropriate
2. **Inspect hover states**: Ensure hover z-index is applied correctly
3. **Test nested structures**: Verify popups work in complex layouts
4. **Browser tools**: Use dev tools to inspect stacking context

### Performance Considerations
- **Minimal z-index usage**: Only applied where necessary for layering
- **Browser optimization**: Natural stacking context preferred
- **CSS specificity**: Balanced approach between specificity and maintainability

## Migration Notes

### Changes from Previous Version
- **Enhanced z-index hierarchy**: Expanded from single popup level to layered system
- **Updated popup positioning**: Changed from mouse-following to avatar-centered popups
- **Added table cell positioning**: Fixed leaderboard and team statistics popup alignment with z-index 10006
- **Improved cross-component consistency**: All avatar popups now center on their respective avatars

### Performance Benefits
- **Optimized stacking**: Appropriate z-index levels for different contexts
- **Better interaction handling**: Reliable popup visibility across all components
- **Maintained performance**: Natural stacking where possible
- **Enhanced reliability**: Robust popup positioning system

---

**Last Updated**: December 2024  
**Version**: Enhanced Implementation v2.1  
**Components Affected**: AvatarWithHover, SummaryCards, GamesList, Leaderboard, TeamStatistics
