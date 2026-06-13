# Z-Index Documentation - Portal-Based Implementation

## Overview

This document outlines the current z-index approach used in the Partners Competition App after implementing a portal-based solution for avatar popups. The app now uses React Portals to render avatar popups directly to `document.body`, eliminating stacking context issues and the need for complex z-index hierarchies.

## Current Implementation

### Avatar Hover Popups - **999999** (Portal-Based)

**Location**: `SimpleAvatarWithHover.jsx` component
**Purpose**: Avatar hover popups rendered via React Portal to `document.body`
**Scope**: Fixed positioning based on avatar's screen coordinates
**Usage**: Applied to all avatar hover interactions across the application

**Key Benefits:**

- Popups render outside normal document flow via `createPortal(popup, document.body)`
- Fixed positioning ensures popups appear at correct screen coordinates
- Automatic layering above all other content regardless of parent stacking contexts
- No need for complex CSS z-index rules or SimpleGamesList-specific overrides

```javascript
// SimpleAvatarWithHover.jsx portal implementation
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

The following SimpleGamesList-specific CSS rules are no longer needed due to the portal implementation:

- `.card .card-body .card .card-body .list-group-item .avatar-container:hover`
- Complex overflow and stacking context management rules
- SimpleGamesList row z-index overrides

## Technical Notes

- Popup position is calculated using `getBoundingClientRect()` for accurate screen coordinates
- Position updates automatically on scroll/resize events
- Portal approach eliminates all stacking context conflicts
- Simplified CSS maintenance with fewer z-index rules

## Z-Index Hierarchy

### 1. Avatar Hover Popups - **999999**

Portal-rendered popup — described above.

### 2. Avatar Popup Fallback - **10004**

**Location**: `App.css` - Backup popup styling
**Purpose**: Alternative popup styling with high z-index
**Scope**: General avatar popup containers

```css
.avatar-popup,
.avatar-container .avatar-popup {
  z-index: 10004 !important;
}
```

### 3. Nested Card Avatar Hover - **10003**

**Location**: `App.css` - Avatar containers in nested card structures
**Purpose**: Ensures visibility in complex nested layouts (games list)
**Scope**: Avatar containers within list group items in cards

```css
.card .card-body .list-group-item .avatar-container:hover {
  z-index: 10003;
}
```

### 4. List Group Avatar Hover - **10002**

**Location**: `App.css` - List group item avatar hover state
**Purpose**: Higher z-index for avatar interactions in list contexts
**Scope**: Avatar containers in list group items during hover

```css
.list-group-item .avatar-container:hover {
  z-index: 10002;
}
```

### 5. Avatar Container Hover - **10001**

**Location**: `App.css` - General avatar hover state
**Purpose**: Standard hover z-index for avatar containers
**Scope**: General avatar hover interactions

```css
.avatar-container:hover {
  z-index: 10001;
}
```

### 6. Avatar Popup Base - **10000**

**Location**: `App.css` - Base avatar popup styling
**Purpose**: Base z-index for avatar popup elements
**Scope**: General avatar popup positioning

```css
.avatar-popup {
  z-index: 10000;
}
```

### 7. Bootstrap Modal Backdrop - **1055** (Bootstrap default)

**Location**: Bootstrap framework
**Purpose**: Modal overlay backgrounds
**Scope**: Framework-managed z-index for modal dialogs

### 8. Bootstrap Modal - **1050** (Bootstrap default)

**Location**: Bootstrap framework
**Purpose**: Modal dialog content
**Scope**: Framework-managed z-index for modal content

### 9. Bootstrap Dropdown - **1000** (Bootstrap default)

**Location**: Bootstrap framework
**Purpose**: Dropdown menu overlays
**Scope**: Framework-managed z-index for dropdown components

### 10. Card Elements - **2**

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

### 11. List Group Items & Badge Elements - **1**

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

### 12. Standard Content - **Auto/Default**

**Location**: All other components
**Purpose**: Normal document flow stacking
**Scope**: Charts, navigation, most UI elements

## Component-Specific Z-Index Usage

### SimpleAvatarWithHover Component

- **Popup z-index**: 999999 (portal-rendered, always above everything)
- **Container z-index**: Auto (natural stacking)
- **Purpose**: Ensures hover popups always visible above content

### Games History (SimpleGamesList.jsx)

- **Avatar hover z-index**: Uses layered approach (10001, 10002, 10003)
- **Container stacking**: z-index 1-2 for proper list item organization
- **Purpose**: Handles complex nested card structures

### Summary Cards (SimpleSummaryCards.jsx)

- **Most Winning Team**: Side-by-side layout, portal-based popup
- **Layout**: Clean flexbox layout without z-index conflicts

## Best Practices Implemented

### 1. Portal-First Approach

Avatar popups use React Portals, rendering directly to `document.body`. This eliminates the need for escalating z-index values to escape nested stacking contexts.

### 2. Layered CSS Fallback System

- **Critical popups**: 10000+ range for any non-portal avatar interactions
- **UI components**: 1-2 range for standard stacking
- **Framework defaults**: Bootstrap z-index values preserved (1000+)

### 3. Maintainable Architecture

- **Component-level management**: Z-index defined per component context
- **CSS specificity**: Using `!important` where needed for Bootstrap overrides
- **Clear separation**: Different z-index levels for different interaction types

### 4. Responsive Design

- **Mobile optimizations**: Adjusted gap spacing for smaller screens
- **Overflow handling**: `overflow: visible` to prevent popup clipping
- **Viewport awareness**: Popup positioning within viewport bounds

## Troubleshooting Z-Index Issues

1. **Check component context**: Verify which z-index layer is appropriate
2. **Inspect hover states**: Ensure hover z-index is applied correctly
3. **Test nested structures**: Verify popups work in complex layouts
4. **Browser tools**: Use dev tools to inspect stacking context

---

**Last Updated**: June 2026
**Components Affected**: SimpleAvatarWithHover, SimpleSummaryCards, SimpleGamesList, SimpleLeaderboard, SimpleTeamStatistics
