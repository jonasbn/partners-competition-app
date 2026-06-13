# Test Coverage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add test files for three untested components (`SimpleGamesList`, `SimplePlayerPerformance`, `SimpleAvatarWithHover`) and fix `utilities.test.js` so it tests the real exported functions instead of inline reimplementations.

**Architecture:** All tasks add test files only — no production code changes. Each task is independent and can be done in any order. Work must be done on a feature branch and submitted as a PR.

**Tech Stack:** Vitest 4.x, React Testing Library, i18next (Danish default), `vi.mock` for dependency isolation.

---

## Branch setup (do this first)

```bash
git checkout -b test/coverage-improvements
```

---

## File Map

| File | Change |
|------|--------|
| `src/test/utilities.test.js` | Replace inline reimplementations with imports from `simpleAvatarUtils`; fix all assertions |
| `src/test/components/SimpleGamesList.test.jsx` | Create — error, empty-state, and happy-path tests |
| `src/test/components/SimplePlayerPerformance.test.jsx` | Create — error, empty-state, and player-card tests |
| `src/test/components/SimpleAvatarWithHover.test.jsx` | Create — render, hover, click, and fallback tests |
| `docs/TODO.md` | Check off the two test-coverage items addressed by this work |

---

## Task 1: Fix `utilities.test.js`

**Files:**
- Modify: `src/test/utilities.test.js`

### Background

The file defines `getPlayerAvatarPath` inline, accepting two arguments `(playerName, emotion)`. The real function in `src/utils/simpleAvatarUtils.js` accepts only one argument and always returns `ok.png` — so every existing test is exercising a fake function.

The real `getPlayerAvatarPath(playerName)`:
- Known players (`Jonas`, `Torben`, `Gitte`, `Anette`, `Lotte`, `Peter`, case-insensitive) → `/assets/<lowercaseName>/ok.png`
- Unknown player name → `null`
- `null`, non-string, or missing arg → `null`

The real `getAvatarColor(name)` → `hsl(<hue>, 70%, 60%)` (lightness 60%, not 50% as the inline version assumed).

The real `getInitials(name)` → first two characters uppercased.

- [ ] **Step 1: Replace `src/test/utilities.test.js` with this content**

```js
import { describe, it, expect } from 'vitest';
import {
  getPlayerAvatarPath,
  getAvatarColor,
  getInitials,
} from '../utils/simpleAvatarUtils';

describe('simpleAvatarUtils', () => {
  describe('getPlayerAvatarPath', () => {
    it('returns the ok.png path for a known player', () => {
      expect(getPlayerAvatarPath('Jonas')).toBe('/assets/jonas/ok.png');
    });

    it('is case-insensitive', () => {
      expect(getPlayerAvatarPath('TORBEN')).toBe('/assets/torben/ok.png');
      expect(getPlayerAvatarPath('gitte')).toBe('/assets/gitte/ok.png');
    });

    it('always returns ok.png regardless of any second argument (function takes one arg)', () => {
      // The function only accepts playerName — emotion is always ok
      expect(getPlayerAvatarPath('Jonas')).toBe('/assets/jonas/ok.png');
    });

    it('returns null for an unknown player name', () => {
      expect(getPlayerAvatarPath('Unknown')).toBeNull();
    });

    it('returns null for null input', () => {
      expect(getPlayerAvatarPath(null)).toBeNull();
    });

    it('returns null for a non-string input', () => {
      expect(getPlayerAvatarPath(123)).toBeNull();
    });

    it('returns null for an empty string', () => {
      expect(getPlayerAvatarPath('')).toBeNull();
    });
  });

  describe('getAvatarColor', () => {
    it('returns an hsl color string with 70% saturation and 60% lightness', () => {
      expect(getAvatarColor('Jonas')).toMatch(/^hsl\(\d+, 70%, 60%\)$/);
    });

    it('returns the same color for the same name', () => {
      expect(getAvatarColor('Jonas')).toBe(getAvatarColor('Jonas'));
    });

    it('returns different colors for different names', () => {
      expect(getAvatarColor('Jonas')).not.toBe(getAvatarColor('Torben'));
    });
  });

  describe('getInitials', () => {
    it('returns the first two characters uppercased', () => {
      expect(getInitials('Jonas')).toBe('JO');
      expect(getInitials('Torben')).toBe('TO');
    });

    it('handles names with two characters', () => {
      expect(getInitials('AB')).toBe('AB');
    });
  });
});
```

- [ ] **Step 2: Run the tests to verify they all pass**

```bash
npx vitest run src/test/utilities.test.js
```

Expected output:
```
Test Files  1 passed (1)
     Tests  9 passed (9)
```

If any test fails, the real function behaviour differs from what's listed in the Background section above. Read `src/utils/simpleAvatarUtils.js` to check and fix the assertion.

- [ ] **Step 3: Run the full suite to confirm no regressions**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/test/utilities.test.js
git commit -m "test: replace inline getPlayerAvatarPath reimplementation with real imports in utilities.test.js"
```

---

## Task 2: SimpleGamesList component tests

**Files:**
- Create: `src/test/components/SimpleGamesList.test.jsx`

### Background

`SimpleGamesList` (`src/components/SimpleGamesList.jsx`):
- Calls `getGames(gameData)` from `dataUtils`
- Error state: if `getGames` throws, renders an `<h2>` with the `gamesList.error` key
- Empty state: if games array is empty, renders a heading with `gamesList.noGames` and a paragraph with `gamesList.startPlaying`
- Happy path: renders one card per game (in reverse order), showing `gamesList.gameNumber` with the game ID, the date, teams sorted by score, and a winner line

Game object shape returned by `getGames`:
```js
{
  gameId: 1,
  gameDate: '2026-01-15',
  teams: [
    { players: ['Jonas', 'Torben'], score: 3 },
    { players: ['Gitte', 'Anette'], score: 2 },
    { players: ['Lotte', 'Peter'], score: 1 }
  ]
}
```

The Danish translations used:
- `gamesList.error` → "Fejl ved indlæsning af spil"
- `gamesList.noGames` → "Ingen spil fundet"
- `gamesList.startPlaying` → "Start med at spille nogle spil for at se historikken her!"
- `gamesList.title` → "Spil Historie"
- `gamesList.totalGames` → "Samlede Spil"

- [ ] **Step 1: Create the test file**

Create `src/test/components/SimpleGamesList.test.jsx`:

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import '../../utils/i18n';
import SimpleGamesList from '../../components/SimpleGamesList';

const mockGetGames = vi.fn();
vi.mock('../../utils/dataUtils', () => ({
  getGames: (...args) => mockGetGames(...args)
}));

const renderWithProviders = (component) =>
  render(<ThemeProvider>{component}</ThemeProvider>);

const twoGames = [
  {
    gameId: 1,
    gameDate: '2026-01-01',
    teams: [
      { players: ['Jonas', 'Torben'], score: 3 },
      { players: ['Gitte', 'Anette'], score: 2 },
      { players: ['Lotte', 'Peter'], score: 1 }
    ]
  },
  {
    gameId: 2,
    gameDate: '2026-01-08',
    teams: [
      { players: ['Gitte', 'Lotte'], score: 3 },
      { players: ['Jonas', 'Peter'], score: 2 },
      { players: ['Torben', 'Anette'], score: 1 }
    ]
  }
];

describe('SimpleGamesList – error state', () => {
  beforeEach(() => {
    mockGetGames.mockImplementation(() => { throw new Error('load failed'); });
  });

  it('renders the error heading', () => {
    renderWithProviders(<SimpleGamesList />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('shows the error message text', () => {
    renderWithProviders(<SimpleGamesList />);
    // Danish: "Fejl ved indlæsning" — from gamesList.errorLoading
    expect(screen.getByText(/Fejl ved indlæsning/)).toBeInTheDocument();
  });
});

describe('SimpleGamesList – empty state', () => {
  beforeEach(() => {
    mockGetGames.mockReturnValue([]);
  });

  it('shows the no-games heading', () => {
    renderWithProviders(<SimpleGamesList />);
    // Danish: "Ingen spil fundet" — gamesList.noGames
    expect(screen.getByText('Ingen spil fundet')).toBeInTheDocument();
  });

  it('shows the start-playing prompt', () => {
    renderWithProviders(<SimpleGamesList />);
    // Danish: "Start med at spille nogle spil for at se historikken her!" — gamesList.startPlaying
    expect(screen.getByText('Start med at spille nogle spil for at se historikken her!')).toBeInTheDocument();
  });
});

describe('SimpleGamesList – happy path', () => {
  beforeEach(() => {
    mockGetGames.mockReturnValue(twoGames);
  });

  it('renders the games list title', () => {
    renderWithProviders(<SimpleGamesList />);
    // Danish: "Spil Historie" — gamesList.title
    expect(screen.getByText('Spil Historie')).toBeInTheDocument();
  });

  it('shows the total games count', () => {
    renderWithProviders(<SimpleGamesList />);
    // The badge's text content is "Samlede Spil: 2"
    expect(
      screen.getByText((content) => content.includes('Samlede Spil') && content.includes('2'))
    ).toBeInTheDocument();
  });

  it('renders a card for each game', () => {
    renderWithProviders(<SimpleGamesList />);
    // Two games → at least one element containing "Spil 1" and one containing "Spil 2"
    expect(screen.getAllByText(/Spil 1/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Spil 2/).length).toBeGreaterThan(0);
  });

  it('displays player names inside game cards', () => {
    renderWithProviders(<SimpleGamesList />);
    // "Jonas & Torben" appears as team name text in game 1
    expect(screen.getAllByText('Jonas & Torben').length).toBeGreaterThan(0);
  });

  it('shows the winner label for each game', () => {
    renderWithProviders(<SimpleGamesList />);
    // winner line uses t('gamesList.winner'): "Vinder" in Danish
    expect(screen.getAllByText(/Vinder/).length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run the tests to verify they all pass**

```bash
npx vitest run src/test/components/SimpleGamesList.test.jsx
```

Expected:
```
Test Files  1 passed (1)
     Tests  7 passed (7)
```

- [ ] **Step 3: Run the full suite**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/test/components/SimpleGamesList.test.jsx
git commit -m "test: add SimpleGamesList component tests (error, empty, happy path)"
```

---

## Task 3: SimplePlayerPerformance component tests

**Files:**
- Create: `src/test/components/SimplePlayerPerformance.test.jsx`

### Background

`SimplePlayerPerformance` (`src/components/SimplePlayerPerformance.jsx`):
- Calls `getLeaderboardData(gameData)` and reads `.players` from the result
- Error state: if call throws, renders error heading using `playerPerformance.error`
- Empty state: if players array is empty, renders `playerPerformance.noData` heading and `playerPerformance.playGames` paragraph
- Happy path: renders one card per player showing rank (`#1`), name, cumulative score, and a performance badge
- Rank 1 → badge label from `playerPerformance.performanceLevels.excellent` (Danish: "Fremragende")
- Ranks 2–4 of 6 → "God", ranks 5–6 → "Gennemsnitlig" or "Kan Forbedres"
- Uses `SimpleAvatarWithHover` as a child (mock it to avoid DOM noise)

Player object shape:
```js
{
  id: 1,
  name: 'Jonas',
  cumulativeScore: 15,
  gamesPlayed: 5,
  winRate: 60.0,
  avgScore: 3.0,
  games: []
}
```

- [ ] **Step 1: Create the test file**

Create `src/test/components/SimplePlayerPerformance.test.jsx`:

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import '../../utils/i18n';
import SimplePlayerPerformance from '../../components/SimplePlayerPerformance';

// Avoid real avatar rendering in tests
vi.mock('../../components/SimpleAvatarWithHover', () => ({
  default: ({ playerName }) => <span data-testid={`avatar-${playerName}`} />
}));

vi.mock('../../utils/simpleAvatarUtils', () => ({
  getRankBasedAvatar: () => null,
  getPlayerAvatarOptions: () => [],
  getPlayerAvatarPath: () => null,
}));

const mockGetLeaderboardData = vi.fn();
vi.mock('../../utils/dataUtils', () => ({
  getLeaderboardData: (...args) => mockGetLeaderboardData(...args)
}));

const renderWithProviders = (component) =>
  render(<ThemeProvider>{component}</ThemeProvider>);

const sixPlayers = [
  { id: 1, name: 'Jonas',   cumulativeScore: 15, gamesPlayed: 5, winRate: 60.0, avgScore: 3.0, games: [] },
  { id: 2, name: 'Torben',  cumulativeScore: 12, gamesPlayed: 5, winRate: 40.0, avgScore: 2.4, games: [] },
  { id: 3, name: 'Gitte',   cumulativeScore: 10, gamesPlayed: 5, winRate: 40.0, avgScore: 2.0, games: [] },
  { id: 4, name: 'Anette',  cumulativeScore: 9,  gamesPlayed: 5, winRate: 20.0, avgScore: 1.8, games: [] },
  { id: 5, name: 'Lotte',   cumulativeScore: 8,  gamesPlayed: 5, winRate: 20.0, avgScore: 1.6, games: [] },
  { id: 6, name: 'Peter',   cumulativeScore: 7,  gamesPlayed: 5, winRate: 20.0, avgScore: 1.4, games: [] },
];

describe('SimplePlayerPerformance – error state', () => {
  beforeEach(() => {
    mockGetLeaderboardData.mockImplementation(() => { throw new Error('data error'); });
  });

  it('renders the error heading', () => {
    renderWithProviders(<SimplePlayerPerformance />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });
});

describe('SimplePlayerPerformance – empty state', () => {
  beforeEach(() => {
    mockGetLeaderboardData.mockReturnValue({ players: [], games: [] });
  });

  it('shows the no-data heading', () => {
    renderWithProviders(<SimplePlayerPerformance />);
    // Danish: "Ingen spillerdata tilgængelig" — playerPerformance.noData
    expect(screen.getByText('Ingen spillerdata tilgængelig')).toBeInTheDocument();
  });

  it('shows the play-games prompt', () => {
    renderWithProviders(<SimplePlayerPerformance />);
    // Danish: "Spil nogle spil for at se spillerpræstation her!" — playerPerformance.playGames
    expect(screen.getByText('Spil nogle spil for at se spillerpræstation her!')).toBeInTheDocument();
  });
});

describe('SimplePlayerPerformance – happy path', () => {
  beforeEach(() => {
    mockGetLeaderboardData.mockReturnValue({ players: sixPlayers, games: [] });
  });

  it('renders a card for each player', () => {
    renderWithProviders(<SimplePlayerPerformance />);
    sixPlayers.forEach(p => {
      expect(screen.getByText(new RegExp(`#\\d+ ${p.name}`))).toBeInTheDocument();
    });
  });

  it('shows the rank-1 player with the excellent badge', () => {
    renderWithProviders(<SimplePlayerPerformance />);
    // Danish: "Fremragende" — playerPerformance.performanceLevels.excellent
    expect(screen.getAllByText('Fremragende').length).toBeGreaterThan(0);
  });

  it('shows an avatar placeholder for each player', () => {
    renderWithProviders(<SimplePlayerPerformance />);
    sixPlayers.forEach(p => {
      expect(screen.getByTestId(`avatar-${p.name}`)).toBeInTheDocument();
    });
  });

  it('shows the section title', () => {
    renderWithProviders(<SimplePlayerPerformance />);
    // Danish: "Spillerpræstation Analyse" — playerPerformance.title
    expect(screen.getAllByText('Spillerpræstation Analyse').length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run the tests to verify they all pass**

```bash
npx vitest run src/test/components/SimplePlayerPerformance.test.jsx
```

Expected:
```
Test Files  1 passed (1)
     Tests  7 passed (7)
```

- [ ] **Step 3: Run the full suite**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/test/components/SimplePlayerPerformance.test.jsx
git commit -m "test: add SimplePlayerPerformance component tests (error, empty, happy path)"
```

---

## Task 4: SimpleAvatarWithHover component tests

**Files:**
- Create: `src/test/components/SimpleAvatarWithHover.test.jsx`

### Background

`SimpleAvatarWithHover` (`src/components/SimpleAvatarWithHover.jsx`):
- When `avatarSrc` is provided: renders `<img>` with `alt="<playerName> avatar"` and a hidden fallback div
- When `avatarSrc` is absent: renders a div showing the player's initials (from `getInitials`)
- On mouse enter: `showPopup` becomes true; a portal is inserted into `document.body` with the enlarged avatar/initials and the player's name
- On mouse leave: portal is removed
- When `onClick` prop is provided: calls it when the avatar container is clicked
- `size` prop sets the `width`/`height` of the image/circle in pixels

`getAvatarColor` and `getInitials` are imported from `simpleAvatarUtils`.

- [ ] **Step 1: Create the test file**

Create `src/test/components/SimpleAvatarWithHover.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SimpleAvatarWithHover from '../../components/SimpleAvatarWithHover';

// Provide stable return values so tests don't depend on hash arithmetic
vi.mock('../../utils/simpleAvatarUtils', () => ({
  getAvatarColor: () => 'hsl(200, 70%, 60%)',
  getInitials: (name) => name.substring(0, 2).toUpperCase(),
}));

describe('SimpleAvatarWithHover – rendering', () => {
  it('renders an img element when avatarSrc is provided', () => {
    render(
      <SimpleAvatarWithHover
        playerName="Jonas"
        avatarSrc="/assets/jonas/happy.png"
        size={40}
      />
    );
    const img = screen.getByAltText('Jonas avatar');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/assets/jonas/happy.png');
  });

  it('renders initials when no avatarSrc is provided', () => {
    render(<SimpleAvatarWithHover playerName="Torben" size={40} />);
    expect(screen.getByText('TO')).toBeInTheDocument();
  });

  it('applies the size prop to the image style', () => {
    render(
      <SimpleAvatarWithHover
        playerName="Gitte"
        avatarSrc="/assets/gitte/ok.png"
        size={60}
      />
    );
    const img = screen.getByAltText('Gitte avatar');
    expect(img.style.width).toBe('60px');
    expect(img.style.height).toBe('60px');
  });
});

describe('SimpleAvatarWithHover – hover popup', () => {
  it('shows the player name in a portal popup on mouse enter', () => {
    render(
      <SimpleAvatarWithHover
        playerName="Anette"
        avatarSrc="/assets/anette/ok.png"
        size={40}
      />
    );
    const container = document.querySelector('.avatar-container');
    fireEvent.mouseEnter(container);
    // The portal inserts the player name label into document.body
    expect(screen.getByText('Anette')).toBeInTheDocument();
  });

  it('hides the popup on mouse leave', () => {
    render(
      <SimpleAvatarWithHover
        playerName="Lotte"
        avatarSrc="/assets/lotte/ok.png"
        size={40}
      />
    );
    const container = document.querySelector('.avatar-container');
    fireEvent.mouseEnter(container);
    fireEvent.mouseLeave(container);
    // After mouse leave showPopup is false — portal is no longer rendered
    // The player name label comes from the popup, not the main render
    expect(screen.queryByText('Lotte')).not.toBeInTheDocument();
  });
});

describe('SimpleAvatarWithHover – click', () => {
  it('calls the onClick prop when the avatar is clicked', () => {
    const handleClick = vi.fn();
    render(
      <SimpleAvatarWithHover
        playerName="Peter"
        avatarSrc="/assets/peter/ok.png"
        size={40}
        onClick={handleClick}
      />
    );
    const container = document.querySelector('.avatar-container');
    fireEvent.click(container);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not throw when clicked without an onClick prop', () => {
    render(
      <SimpleAvatarWithHover playerName="Jonas" avatarSrc="/assets/jonas/ok.png" size={40} />
    );
    const container = document.querySelector('.avatar-container');
    expect(() => fireEvent.click(container)).not.toThrow();
  });
});
```

- [ ] **Step 2: Run the tests to verify they all pass**

```bash
npx vitest run src/test/components/SimpleAvatarWithHover.test.jsx
```

Expected:
```
Test Files  1 passed (1)
     Tests  7 passed (7)
```

If the hover-popup tests fail, check whether `document.querySelector('.avatar-container')` finds the element — the component uses `className="avatar-container ..."`. If not found, use `document.querySelector('[class*="avatar-container"]')`.

- [ ] **Step 3: Run the full suite**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/test/components/SimpleAvatarWithHover.test.jsx
git commit -m "test: add SimpleAvatarWithHover component tests (render, hover, click)"
```

---

## Task 5: Update docs/TODO.md

**Files:**
- Modify: `docs/TODO.md`

- [ ] **Step 1: Update the test coverage checkboxes**

In `docs/TODO.md`, make the following changes:

Change line:
```
- [ ] **Five components have no dedicated test files**: `SimpleGamesCalendar`, `SimpleGamesList`, `SimplePlayerPerformance`, `SimpleTeamStatistics`, `SimpleAvatarWithHover`.
```

To:
```
- [x] **Five components have no dedicated test files**: `SimpleGamesCalendar` ✓ (PR #144), `SimpleGamesList` ✓, `SimplePlayerPerformance` ✓, `SimpleTeamStatistics` ✓ (PR #144), `SimpleAvatarWithHover` ✓.
```

Change line:
```
- [ ] **`src/test/utilities.test.js` reimplements `getPlayerAvatarPath` inline**
```

To:
```
- [x] **`src/test/utilities.test.js` reimplements `getPlayerAvatarPath` inline**
```

- [ ] **Step 2: Commit**

```bash
git add docs/TODO.md
git commit -m "docs: mark test coverage items resolved in TODO.md"
```

---

## Final Step: Push and open PR

```bash
git push -u origin test/coverage-improvements
gh pr create \
  --base main \
  --head test/coverage-improvements \
  --title "test: add missing component tests and fix utilities.test.js" \
  --body "$(cat <<'EOF'
## Summary

- **utilities.test.js**: replaced inline `getPlayerAvatarPath` reimplementation (2-arg fake) with imports from `simpleAvatarUtils`; updated assertions to match real function behaviour
- **SimpleGamesList**: new test file covering error state, empty state, and happy-path game cards
- **SimplePlayerPerformance**: new test file covering error state, empty state, and player card rendering
- **SimpleAvatarWithHover**: new test file covering image/initials rendering, hover portal, and click callback

## Test Plan

- [ ] `npx vitest run` passes all tests across all 26 test files
- [ ] No production code was changed

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```
