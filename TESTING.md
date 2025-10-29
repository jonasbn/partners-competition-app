# Testing Strategy for Partners Competition App

## Overview

This document outlines the recommended testing strategy for your data visualization React application. Since your app is primarily focused on displaying and visualizing data with minimal user interaction, the testing approach prioritizes data processing validation and component stability.

## 🚀 Quick Start

Run tests with:
```bash
npm test                    # Run all tests in watch mode
npm run test:run           # Run all tests once
npm run test:coverage      # Run tests with coverage report
npm test basic.test.js     # Run specific test file
```

## 📊 Test Categories & Priorities

### 1. **Data Processing Tests** (🔴 Critical Priority)
**File**: `src/test/dataLogic.test.js`
**Purpose**: Test the core business logic that powers your charts and statistics.

**What it tests**:
- Player score calculations
- Leaderboard sorting
- Team combination logic
- Win rate calculations
- Data validation and edge cases

**Why it's critical**: These tests ensure your visualizations display correct data. Bugs here directly impact user trust.

**Examples**:
```javascript
// Testing score calculation
it('should calculate player scores correctly', () => {
  const gameData = [
    { name: "Jonas", score: 3 },
    { name: "Torben", score: 2 }
  ];
  const totalScore = gameData.reduce((sum, player) => sum + player.score, 0);
  expect(totalScore).toBe(5);
});

// Testing data sorting
it('should sort players by score correctly', () => {
  const players = [
    { name: "Jonas", score: 10 },
    { name: "Torben", score: 15 }
  ];
  const sorted = [...players].sort((a, b) => b.score - a.score);
  expect(sorted[0].name).toBe("Torben");
});
```

### 2. **Utility Function Tests** (🟡 Medium Priority)
**File**: `src/test/utilities.test.js`
**Purpose**: Test helper functions and utilities used throughout the app.

**What it tests**:
- Avatar path generation
- Color generation for players
- Date formatting
- Number formatting
- Edge case handling

**Examples**:
```javascript
// Testing avatar path generation
it('should generate correct avatar paths', () => {
  expect(getPlayerAvatarPath('Jonas', 'happy')).toBe('/assets/jonas/happy.png');
  expect(getPlayerAvatarPath('TORBEN', 'sad')).toBe('/assets/torben/sad.png');
});

// Testing consistent color generation
it('should generate consistent colors for same player', () => {
  const color1 = generatePlayerColor('Jonas');
  const color2 = generatePlayerColor('Jonas');
  expect(color1).toBe(color2);
});
```

### 3. **Component Smoke Tests** (🟡 Medium Priority)
**File**: `src/test/componentSmoke.test.jsx`
**Purpose**: Ensure components render without crashing.

**What it tests**:
- Basic component rendering
- Bootstrap structure
- Table structures
- Card layouts

**Examples**:
```javascript
// Testing basic rendering
it('should render a simple div without crashing', () => {
  const TestComponent = () => <div>Test</div>;
  const { container } = render(<TestComponent />);
  expect(container.firstChild).toBeInTheDocument();
});

// Testing Bootstrap structure
it('should render Bootstrap card structure', () => {
  const CardComponent = () => (
    <div className="card">
      <div className="card-header">Header</div>
      <div className="card-body">Body</div>
    </div>
  );
  const { container } = render(<CardComponent />);
  expect(container.querySelector('.card')).toBeInTheDocument();
});
```

### 4. **Integration Tests** (🟢 Lower Priority)
**File**: `src/test/integration.test.js`
**Purpose**: Test that different parts of the application work together.

**What it tests**:
- Data flow through the processing pipeline
- Multiple games handling
- Bootstrap integration
- Theme integration

**Examples**:
```javascript
// Testing complete data pipeline
it('should process game data through the complete pipeline', () => {
  const rawGameData = [/* game data */];
  // Process data through multiple steps
  const leaderboard = processDataPipeline(rawGameData);
  expect(leaderboard[0].name).toBe('ExpectedWinner');
});
```

## 🎯 What NOT to Test (For Your App Type)

Since your app is primarily data visualization with minimal interaction:

### ❌ Skip These Tests:
- **Heavy User Interaction Tests**: Your app doesn't have complex forms or workflows
- **Chart Library Internals**: @nivo charts are already tested by their maintainers
- **Complex State Management**: Your app uses mostly derived state from data
- **API Integration**: You're using static JSON data
- **Authentication/Authorization**: Not applicable to your app
- **Performance Tests**: Premature for current complexity level

### ❌ Avoid Over-Testing:
- Don't test implementation details
- Don't test third-party library functionality
- Don't test CSS styling unless it affects functionality
- Don't test every possible data permutation

## 📁 File Structure

```
src/test/
├── setup.js                 # Test configuration and mocks
├── basic.test.js            # Sanity checks and simple tests
├── dataLogic.test.js        # 🔴 CRITICAL: Data processing tests
├── utilities.test.js        # 🟡 Helper function tests
├── componentSmoke.test.jsx  # 🟡 Basic rendering tests
├── integration.test.js      # 🟢 Integration tests
└── components/              # Component-specific tests (optional)
```

## 🔧 Configuration Files

### `vite.config.js` - Test Configuration
```javascript
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: ['./src/test/setup.js'],
  css: true,
}
```

### `src/test/setup.js` - Mocks and Setup
```javascript
import '@testing-library/jest-dom';

// Mock logger
vi.mock('../utils/logger', () => ({
  default: {
    info: vi.fn(),
    event: vi.fn(),
    error: vi.fn(),
    userAction: vi.fn(),
  },
}));
```

## 🎨 Testing Best Practices for Your App

### 1. **Focus on Data Correctness**
Since your app is about displaying data, prioritize tests that ensure data accuracy.

### 2. **Use Real Data Structures**
Test with data that mirrors your actual JSON structure.

### 3. **Test Edge Cases**
- Empty data sets
- Single player games
- Invalid data formats
- Missing properties

### 4. **Keep Tests Fast**
- Mock heavy dependencies (charts, external services)
- Use minimal test data
- Avoid complex DOM manipulations

### 5. **Write Descriptive Test Names**
```javascript
// ✅ Good
it('should calculate team win rate as percentage of wins over total games')

// ❌ Bad
it('should calculate win rate')
```

## 📈 Coverage Goals

For your app type, aim for:
- **Data Processing Functions**: 90-100% coverage
- **Utility Functions**: 80-90% coverage
- **Component Rendering**: 60-80% coverage
- **Integration Tests**: 40-60% coverage

## 🚀 Getting Started Checklist

1. **✅ Install Dependencies** - Already done
2. **✅ Configure Vitest** - Already configured
3. **✅ Set up basic tests** - Working tests created
4. **🔄 Gradually add tests** - Start with data processing
5. **📊 Monitor coverage** - Use `npm run test:coverage`

## 🔍 Running Specific Test Categories

```bash
# Run only data processing tests (most important)
npm test dataLogic.test.js

# Run only utility tests
npm test utilities.test.js

# Run all tests except integration
npm test basic.test.js dataLogic.test.js utilities.test.js

# Run with coverage
npm run test:coverage
```

## 🎯 Next Steps

1. **Start with `dataLogic.test.js`** - Add tests for your actual data processing functions
2. **Customize `utilities.test.js`** - Add tests for your specific helper functions
3. **Gradually expand** - Add more specific tests as needed
4. **Monitor CI/CD** - Set up tests to run on every commit

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

## 💡 Remember

For a data visualization app like yours:
- **Quality over Quantity**: Focus on critical data processing logic
- **Practical Testing**: Test what actually breaks or matters to users
- **Maintain Simplicity**: Don't over-engineer your test suite
- **Iterate Gradually**: Start small and expand as needed

This testing strategy provides a solid foundation without being overwhelming, focusing on what matters most for your specific application type.