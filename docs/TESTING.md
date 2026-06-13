# Testing

## Running Tests

```bash
npm test                   # Run all tests once
npm run test:watch         # Watch mode (interactive)
npm run test:ui            # Vitest UI dashboard
npm run test:coverage      # Coverage report
```

Run a single test file:

```bash
npx vitest run src/test/components/Leaderboard.test.jsx
```

## Test Structure

```text
src/test/
├── setup.js                          # Global mocks (matchMedia, logger, IntersectionObserver, ResizeObserver)
├── basic.test.js                     # Sanity checks
├── dataLogic.test.js                 # Core data processing logic
├── utilities.test.js                 # Helper functions (simpleAvatarUtils)
├── componentSmoke.test.jsx           # Basic render smoke tests
└── components/                       # Component-specific tests
    ├── Leaderboard.test.jsx
    ├── SimpleGamesCalendar.test.jsx
    ├── SimpleGamesList.test.jsx
    ├── SimplePlayerPerformance.test.jsx
    ├── SimpleTeamStatistics.test.jsx
    └── SimpleAvatarWithHover.test.jsx
```

## Key Conventions

### Mocking data utilities

Components receive a `gameData` prop and never import data directly.
In tests, mock `src/utils/dataUtils` rather than providing real JSON:

```javascript
vi.mock('../../utils/dataUtils', () => ({
  getLeaderboardData: vi.fn(() => ({
    players: [{ name: 'Jonas', score: 10, gamesPlayed: 4, wins: 2, winRate: 50, avgScore: 2.5 }],
    games: [{ gameId: 1 }],
  })),
}));
```

### Avatar utilities

`getPlayerAvatarPath(playerName)` accepts **one argument** and always returns the `ok.png` path
(e.g. `/assets/jonas/ok.png`) for known players, or `null` for unknown/invalid input:

```javascript
import { getPlayerAvatarPath } from '../utils/simpleAvatarUtils';

expect(getPlayerAvatarPath('Jonas')).toBe('/assets/jonas/ok.png');
expect(getPlayerAvatarPath('Unknown')).toBeNull();
```

### i18n

Tests run with the real i18next setup (not mocked). The default language is Danish (`da`).
Assert against Danish strings unless you explicitly switch language in the test.

### Portal rendering

`SimpleAvatarWithHover` renders its hover popup via `ReactDOM.createPortal` into `document.body`.
Use `document.body` queries for the popup content and `document.querySelector('.avatar-container')`
to locate the trigger element:

```javascript
fireEvent.mouseEnter(document.querySelector('.avatar-container'));
expect(document.body).toHaveTextContent('Jonas');
```

## Coverage Goals

| Area | Target |
|------|--------|
| Data processing functions | 90–100% |
| Utility functions | 80–90% |
| Component rendering | 60–80% |
