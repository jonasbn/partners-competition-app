# Summer Tournament Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Summer Tournament" tab to the app — an 8-player, 2-teams-of-2, 2/1-point tournament — fully isolated from the existing 6-player season data model.

**Architecture:** A new `tournamentUtils.js` module (parallel to `dataUtils.js`) processes a new `tournament_summer_2026.json` data file. Six new `Tournament*` components (parallel to the existing `Simple*` components) render it. A new `ViewContext` + `ViewSelector` tab switcher in the navbar toggles `App.jsx` between the existing Season view (unchanged) and the new Tournament view. Malene and Kurt are added to the shared avatar-path map; their avatar images don't exist yet, so `SimpleAvatarWithHover`'s existing `onError` fallback (colored circle + initials) covers them automatically — no new avatar component needed.

**Tech Stack:** React 18, react-i18next, Bootstrap classes, Vitest + @testing-library/react, PropTypes.

## Global Constraints

- 8 tournament players: Jonas, Torben, Gitte, Anette, Lotte, Peter, Malene, Kurt.
- Each tournament game has exactly 4 players forming 2 teams of 2 (not all 8 play every game).
- Tournament scoring: 2 points for the winning team, 1 point for the losing team (no 3rd place).
- Season code (`dataUtils.js`, `games.json`, `games_2026.json`, all `Simple*` components) must not change behaviorally.
- Danish (`da`) remains the fallback/default language; every new user-facing string needs both `da.js` and `en.js` entries.
- Follow existing test conventions: mock the data-utils module a component imports from, wrap renders in `ThemeProvider` (and relevant context providers), assert on Danish strings via the real `i18n` instance.
- Spec reference: `docs/superpowers/specs/2026-07-11-summer-tournament-design.md`.

---

### Task 1: Tournament data layer

**Files:**
- Create: `src/data/tournament_summer_2026.json`
- Create: `src/utils/tournamentUtils.js`
- Modify: `src/utils/simpleAvatarUtils.js`
- Test: `src/test/tournamentUtils.test.js`
- Test: `src/test/utils/tournamentAvatars.test.js`

**Interfaces:**
- Produces: `TOURNAMENT_PLAYERS` (array of `{id, name}`, 8 entries), `processTournamentData(gameData)`, `getTournamentLeaderboardData(gameData)`, `getTournamentGames(gameData)`, `getTournamentTeamStatistics(gameData)`, `getTournamentTeamCombinationStatistics(gameData)` — all exported from `src/utils/tournamentUtils.js`. Return shapes mirror `dataUtils.js`'s equivalents, except team-stat objects have `{wins, losses}` instead of `{wins, seconds, thirds}`.
- Produces: `getPlayerAvatarPath('Malene' | 'Kurt')` and `getPlayerAvatarOptions('Malene' | 'Kurt')` resolve paths under `/assets/malene/` and `/assets/kurt/` (files don't exist yet — that's expected and handled by `SimpleAvatarWithHover`'s existing image `onError` fallback).

- [ ] **Step 1: Create the empty tournament data file**

```json
[]
```

Write this to `src/data/tournament_summer_2026.json`.

- [ ] **Step 2: Write the failing test for `tournamentUtils.js`**

Create `src/test/tournamentUtils.test.js`:

```js
import { describe, it, expect } from 'vitest';
import {
  TOURNAMENT_PLAYERS,
  processTournamentData,
  getTournamentLeaderboardData,
  getTournamentTeamStatistics,
  getTournamentTeamCombinationStatistics
} from '../utils/tournamentUtils';

const twoGames = [
  {
    gameId: 1,
    gameDate: '2026-07-15',
    players: [
      { name: 'Jonas', score: 2 },
      { name: 'Torben', score: 2 },
      { name: 'Malene', score: 1 },
      { name: 'Kurt', score: 1 }
    ]
  },
  {
    gameId: 2,
    gameDate: '2026-07-15',
    players: [
      { name: 'Gitte', score: 2 },
      { name: 'Anette', score: 2 },
      { name: 'Lotte', score: 1 },
      { name: 'Peter', score: 1 }
    ]
  }
];

describe('tournamentUtils', () => {
  describe('TOURNAMENT_PLAYERS', () => {
    it('has 8 players including Malene and Kurt', () => {
      expect(TOURNAMENT_PLAYERS).toHaveLength(8);
      const names = TOURNAMENT_PLAYERS.map(p => p.name);
      expect(names).toContain('Malene');
      expect(names).toContain('Kurt');
    });
  });

  describe('processTournamentData', () => {
    it('forms 2 teams of 2 players per game', () => {
      const result = processTournamentData(twoGames);
      expect(result.games).toHaveLength(2);
      expect(result.games[0].teams).toHaveLength(2);
      result.games[0].teams.forEach(team => {
        expect(team.players).toHaveLength(2);
      });
    });

    it('only credits a game to players who actually played it', () => {
      const result = processTournamentData(twoGames);
      const gitte = result.players.find(p => p.name === 'Gitte');
      const jonas = result.players.find(p => p.name === 'Jonas');
      expect(gitte.gamesPlayed).toBe(1);
      expect(jonas.gamesPlayed).toBe(1);
    });

    it('counts a win at score 2, not score 3', () => {
      const result = processTournamentData(twoGames);
      const jonas = result.players.find(p => p.name === 'Jonas');
      const malene = result.players.find(p => p.name === 'Malene');
      expect(jonas.wins).toBe(1);
      expect(malene.wins).toBe(0);
    });

    it('handles an empty game list', () => {
      const result = processTournamentData([]);
      expect(result.games).toHaveLength(0);
      expect(result.players).toHaveLength(8);
      result.players.forEach(player => {
        expect(player.gamesPlayed).toBe(0);
        expect(player.cumulativeScore).toBe(0);
      });
    });
  });

  describe('getTournamentLeaderboardData', () => {
    it('returns players sorted by cumulative score descending', () => {
      const result = getTournamentLeaderboardData(twoGames);
      for (let i = 0; i < result.players.length - 1; i++) {
        expect(result.players[i].cumulativeScore).toBeGreaterThanOrEqual(
          result.players[i + 1].cumulativeScore
        );
      }
    });
  });

  describe('getTournamentTeamStatistics', () => {
    it('tracks wins and losses per team, with no thirds field', () => {
      const stats = getTournamentTeamStatistics(twoGames);
      const winningTeam = stats.find(t => t.players.includes('Jonas'));
      expect(winningTeam.wins).toBe(1);
      expect(winningTeam.losses).toBe(0);
      expect(winningTeam).not.toHaveProperty('thirds');
    });
  });

  describe('getTournamentTeamCombinationStatistics', () => {
    it('generates all 28 possible pairings among 8 players', () => {
      const combos = getTournamentTeamCombinationStatistics(twoGames);
      expect(combos).toHaveLength(28);
    });
  });
});
```

- [ ] **Step 2b: Run the test to verify it fails**

Run: `npx vitest run src/test/tournamentUtils.test.js`
Expected: FAIL — `Cannot find module '../utils/tournamentUtils'`

- [ ] **Step 3: Create `src/utils/tournamentUtils.js`**

```js
import tournamentData2026 from '../data/tournament_summer_2026.json';

export const TOURNAMENT_PLAYERS = [
  { id: 1, name: 'Jonas' },
  { id: 2, name: 'Torben' },
  { id: 3, name: 'Gitte' },
  { id: 4, name: 'Anette' },
  { id: 5, name: 'Lotte' },
  { id: 6, name: 'Peter' },
  { id: 7, name: 'Malene' },
  { id: 8, name: 'Kurt' },
];

const WINNING_SCORE = 2;

// Process the tournament games data and calculate leaderboard.
// Unlike the season's processGamesData, not every player appears in every
// game — players.findIndex below simply skips anyone who sat a game out.
export const processTournamentData = (gameData = tournamentData2026) => {
  const players = TOURNAMENT_PLAYERS.map(p => ({ ...p, cumulativeScore: 0, games: [] }));

  const processedGames = gameData.map(game => {
    const processedGame = {
      gameId: game.gameId,
      gameDate: game.gameDate,
      teams: []
    };

    const scoreGroups = {};
    game.players.forEach(player => {
      if (!scoreGroups[player.score]) {
        scoreGroups[player.score] = [];
      }
      scoreGroups[player.score].push(player.name);

      const playerIndex = players.findIndex(p => p.name === player.name);
      if (playerIndex !== -1) {
        players[playerIndex].cumulativeScore += player.score;
        players[playerIndex].games.push({
          gameId: game.gameId,
          score: player.score
        });
      }
    });

    // Teams have the same score and consist of 2 players (2 teams per game).
    Object.entries(scoreGroups).forEach(([score, playerNames]) => {
      for (let i = 0; i < playerNames.length; i += 2) {
        if (i + 1 < playerNames.length) {
          processedGame.teams.push({
            players: [playerNames[i], playerNames[i + 1]],
            score: parseInt(score, 10)
          });
        }
      }
    });

    return processedGame;
  });

  players.forEach(player => {
    player.gamesPlayed = player.games.length;
    player.wins = player.games.filter(game => game.score === WINNING_SCORE).length;
    player.winRate = player.gamesPlayed > 0 ? (player.wins / player.gamesPlayed) * 100 : 0;
    player.avgScore = player.gamesPlayed > 0 ? (player.cumulativeScore / player.gamesPlayed) : 0;
  });

  players.sort((a, b) => b.cumulativeScore - a.cumulativeScore);

  return {
    players,
    games: processedGames
  };
};

export const getTournamentLeaderboardData = (gameData) => processTournamentData(gameData);

export const getTournamentGames = (gameData) => processTournamentData(gameData).games;

// Calculate team statistics — wins (score 2) vs losses (score 1). There is
// no 3rd place in the tournament format, so unlike getTeamStatistics in
// dataUtils.js this tracks only wins/losses, not wins/seconds/thirds.
export const getTournamentTeamStatistics = (gameData) => {
  const processedGames = processTournamentData(gameData).games;
  const teamStats = {};

  processedGames.forEach(game => {
    game.teams.forEach(team => {
      const teamKey = [...team.players].sort().join('-');

      if (!teamStats[teamKey]) {
        teamStats[teamKey] = {
          players: team.players,
          gamesPlayed: 0,
          wins: 0,
          losses: 0,
          totalPoints: 0,
          winRate: 0
        };
      }

      teamStats[teamKey].gamesPlayed += 1;
      teamStats[teamKey].totalPoints += team.score;

      if (team.score === WINNING_SCORE) {
        teamStats[teamKey].wins += 1;
      } else {
        teamStats[teamKey].losses += 1;
      }
    });
  });

  Object.values(teamStats).forEach(team => {
    team.winRate = team.gamesPlayed > 0 ? (team.wins / team.gamesPlayed) * 100 : 0;
  });

  return Object.values(teamStats).sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return b.winRate - a.winRate;
  });
};

// Calculate team combination statistics across all 28 possible pairings
// among the 8 tournament players (C(8,2) = 28).
export const getTournamentTeamCombinationStatistics = (gameData) => {
  const allPlayers = TOURNAMENT_PLAYERS.map(p => p.name);
  const processedGames = processTournamentData(gameData).games;

  const allPossibleTeams = [];
  for (let i = 0; i < allPlayers.length; i++) {
    for (let j = i + 1; j < allPlayers.length; j++) {
      const teamKey = [allPlayers[i], allPlayers[j]].sort().join(' & ');
      allPossibleTeams.push({
        teamKey,
        players: [allPlayers[i], allPlayers[j]],
        count: 0,
        lastPlayed: null
      });
    }
  }

  const teamCounts = {};
  processedGames.forEach(game => {
    game.teams.forEach(team => {
      const teamKey = [...team.players].sort().join(' & ');
      if (!teamCounts[teamKey]) {
        teamCounts[teamKey] = { count: 0, lastPlayed: null };
      }
      teamCounts[teamKey].count += 1;
      teamCounts[teamKey].lastPlayed = game.gameDate;
    });
  });

  allPossibleTeams.forEach(team => {
    if (teamCounts[team.teamKey]) {
      team.count = teamCounts[team.teamKey].count;
      team.lastPlayed = teamCounts[team.teamKey].lastPlayed;
    }
  });

  allPossibleTeams.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.teamKey.localeCompare(b.teamKey);
  });

  return allPossibleTeams;
};

const tournamentUtils = {
  TOURNAMENT_PLAYERS,
  getTournamentLeaderboardData,
  getTournamentGames,
  getTournamentTeamStatistics,
  getTournamentTeamCombinationStatistics
};

export default tournamentUtils;
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/test/tournamentUtils.test.js`
Expected: PASS (all 8 tests)

- [ ] **Step 5: Write the failing test for the Malene/Kurt avatar paths**

Create `src/test/utils/tournamentAvatars.test.js` (this imports the *real* `simpleAvatarUtils`, unlike `src/test/utils/avatarUtils.test.js` which mocks it):

```js
import { describe, it, expect } from 'vitest';
import { getPlayerAvatarPath, getPlayerAvatarOptions } from '../../utils/simpleAvatarUtils';

describe('simpleAvatarUtils — tournament players', () => {
  it('resolves an avatar path for Malene', () => {
    expect(getPlayerAvatarPath('Malene')).toBe('/assets/malene/ok.png');
  });

  it('resolves an avatar path for Kurt', () => {
    expect(getPlayerAvatarPath('Kurt')).toBe('/assets/kurt/ok.png');
  });

  it('resolves avatar options (happy/ok/sad) for Malene', () => {
    const options = getPlayerAvatarOptions('Malene');
    expect(options.map(o => o.name)).toEqual(['happy', 'ok', 'sad']);
    expect(options[0].path).toBe('/assets/malene/happy.png');
  });

  it('resolves avatar options (happy/ok/sad) for Kurt', () => {
    const options = getPlayerAvatarOptions('Kurt');
    expect(options.map(o => o.name)).toEqual(['happy', 'ok', 'sad']);
    expect(options[2].path).toBe('/assets/kurt/sad.png');
  });

  it('still resolves an existing season player unaffected by the change', () => {
    expect(getPlayerAvatarPath('Jonas')).toBe('/assets/jonas/ok.png');
  });
});
```

- [ ] **Step 5b: Run the test to verify it fails**

Run: `npx vitest run src/test/utils/tournamentAvatars.test.js`
Expected: FAIL — `getPlayerAvatarPath('Malene')` returns `null` (Malene isn't in the map yet)

- [ ] **Step 6: Add Malene and Kurt to the avatar map in `src/utils/simpleAvatarUtils.js`**

In `getPlayerAvatarPath` (around line 28), change:

```js
    const playerAvatarMap = {
      'jonas': 'jonas',
      'torben': 'torben', 
      'gitte': 'gitte',
      'anette': 'anette',
      'lotte': 'lotte',
      'peter': 'peter'
    };
```

to:

```js
    const playerAvatarMap = {
      'jonas': 'jonas',
      'torben': 'torben', 
      'gitte': 'gitte',
      'anette': 'anette',
      'lotte': 'lotte',
      'peter': 'peter',
      'malene': 'malene',
      'kurt': 'kurt'
    };
```

In `getPlayerAvatarOptions` (around line 62), make the identical change to its `playerAvatarMap` literal.

- [ ] **Step 7: Run the test to verify it passes**

Run: `npx vitest run src/test/utils/tournamentAvatars.test.js src/test/utils/avatarUtils.test.js`
Expected: PASS — both files (the new real-implementation test and the existing mocked test) pass.

- [ ] **Step 8: Run the full suite and commit**

Run: `npm run test:run`
Expected: all tests pass (no regressions in season code).

```bash
git add src/data/tournament_summer_2026.json src/utils/tournamentUtils.js src/utils/simpleAvatarUtils.js src/test/tournamentUtils.test.js src/test/utils/tournamentAvatars.test.js
git commit -m "feat: add tournament data layer and Malene/Kurt avatar paths"
```

---

### Task 2: View tab switcher (Season / Summer Tournament)

**Files:**
- Create: `src/utils/ViewContext.jsx`
- Create: `src/components/ViewSelector.jsx`
- Test: `src/test/components/ViewSelector.test.jsx`
- Modify: `src/index.jsx`
- Modify: `src/App.jsx`
- Modify: `src/utils/locales/da.js`
- Modify: `src/utils/locales/en.js`
- Modify: `src/test/App.test.jsx`
- Modify: `src/test/integration/App.integration.test.jsx`

**Interfaces:**
- Consumes: nothing from Task 1.
- Produces: `VIEWS = { SEASON: 'season', TOURNAMENT: 'tournament' }`, `ViewContext` (React context yielding `{activeView, setActiveView}`), `ViewProvider` (default export of `ViewContext.jsx`) — all from `src/utils/ViewContext.jsx`. `ViewSelector` default-exported from `src/components/ViewSelector.jsx`, reads/writes `ViewContext`. Task 9 consumes `VIEWS` and `ViewContext` to swap in the real tournament components in place of the placeholder this task adds.

- [ ] **Step 1: Write the failing test for `ViewSelector`**

Create `src/test/components/ViewSelector.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import { ViewContext, VIEWS } from '../../utils/ViewContext';
import '../../utils/i18n';
import ViewSelector from '../../components/ViewSelector';

const renderWithProviders = (component, contextValue) => {
  return render(
    <ThemeProvider>
      <ViewContext.Provider value={contextValue}>
        {component}
      </ViewContext.Provider>
    </ThemeProvider>
  );
};

const defaultContext = {
  activeView: VIEWS.SEASON,
  setActiveView: vi.fn()
};

describe('ViewSelector Component', () => {
  it('renders without crashing', () => {
    renderWithProviders(<ViewSelector />, defaultContext);
    const group = document.querySelector('.btn-group');
    expect(group).toBeInTheDocument();
  });

  it('renders a button for each view', () => {
    renderWithProviders(<ViewSelector />, defaultContext);
    expect(screen.getByText('Sæson')).toBeInTheDocument();
    expect(screen.getByText('Sommerturnering')).toBeInTheDocument();
  });

  it('highlights the active view button', () => {
    renderWithProviders(<ViewSelector />, defaultContext);
    const activeButton = screen.getByText('Sæson');
    expect(activeButton.className).toContain('btn-light');
    const inactiveButton = screen.getByText('Sommerturnering');
    expect(inactiveButton.className).toContain('btn-outline-light');
  });

  it('calls setActiveView with "tournament" when the tournament button is clicked', () => {
    const setActiveView = vi.fn();
    renderWithProviders(<ViewSelector />, { ...defaultContext, setActiveView });
    fireEvent.click(screen.getByText('Sommerturnering'));
    expect(setActiveView).toHaveBeenCalledWith(VIEWS.TOURNAMENT);
  });
});
```

- [ ] **Step 1b: Run the test to verify it fails**

Run: `npx vitest run src/test/components/ViewSelector.test.jsx`
Expected: FAIL — `Cannot find module '../../utils/ViewContext'`

- [ ] **Step 2: Create `src/utils/ViewContext.jsx`**

```jsx
import React from 'react';
import PropTypes from 'prop-types';

export const VIEWS = { SEASON: 'season', TOURNAMENT: 'tournament' };

export const ViewContext = React.createContext();

export const ViewProvider = ({ children }) => {
  const [activeView, setActiveView] = React.useState(VIEWS.SEASON);

  return (
    <ViewContext.Provider value={{ activeView, setActiveView }}>
      {children}
    </ViewContext.Provider>
  );
};

ViewProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ViewProvider;
```

- [ ] **Step 3: Create `src/components/ViewSelector.jsx`**

```jsx
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ViewContext, VIEWS } from '../utils/ViewContext';

const ViewSelector = () => {
  const { t } = useTranslation();
  const { activeView, setActiveView } = useContext(ViewContext);

  return (
    <div className="view-selector me-2">
      <div className="btn-group btn-group-sm" role="group" aria-label={t('nav.label')}>
        <button
          type="button"
          className={`btn ${activeView === VIEWS.SEASON ? 'btn-light' : 'btn-outline-light'}`}
          onClick={() => setActiveView(VIEWS.SEASON)}
        >
          {t('nav.season')}
        </button>
        <button
          type="button"
          className={`btn ${activeView === VIEWS.TOURNAMENT ? 'btn-light' : 'btn-outline-light'}`}
          onClick={() => setActiveView(VIEWS.TOURNAMENT)}
        >
          {t('nav.tournament')}
        </button>
      </div>
    </div>
  );
};

export default ViewSelector;
```

- [ ] **Step 4: Add `nav` and `tournament.comingSoon` keys to the locale files**

In `src/utils/locales/da.js`, right after the `"yearSelector"` block (after line 17's closing `},`), add:

```js
  "nav": {
    "label": "Vælg Visning",
    "season": "Sæson",
    "tournament": "Sommerturnering"
  },
```

At the end of the same file, just before the final closing `};` (after the `"charts"` block's closing `},`), add:

```js
  "tournament": {
    "comingSoon": {
      "title": "Sommerturnering kommer snart",
      "message": "Turneringsvisningen er under opbygning."
    }
  }
```

Note: the `"charts"` block currently ends with `}` (no trailing comma, since it's the last key). Add a comma after that `}` before inserting the new `"tournament"` block, so it becomes the new last key.

In `src/utils/locales/en.js`, make the equivalent addition:

```js
  "nav": {
    "label": "Select View",
    "season": "Season",
    "tournament": "Summer Tournament"
  },
```

and:

```js
  "tournament": {
    "comingSoon": {
      "title": "Summer Tournament coming soon",
      "message": "The tournament view is under construction."
    }
  }
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/test/components/ViewSelector.test.jsx`
Expected: PASS (all 4 tests)

- [ ] **Step 6: Wrap the app with `ViewProvider` in `src/index.jsx`**

Change:

```jsx
import { ThemeProvider } from './utils/ThemeContext';
import { YearProvider } from './utils/YearContext';
```

to:

```jsx
import { ThemeProvider } from './utils/ThemeContext';
import { ViewProvider } from './utils/ViewContext';
import { YearProvider } from './utils/YearContext';
```

Change:

```jsx
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <YearProvider>
        <App />
      </YearProvider>
    </ThemeProvider>
  </React.StrictMode>
);
```

to:

```jsx
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <ViewProvider>
        <YearProvider>
          <App />
        </YearProvider>
      </ViewProvider>
    </ThemeProvider>
  </React.StrictMode>
);
```

- [ ] **Step 7: Wire the tab switcher and view branching into `src/App.jsx`**

Change the imports at the top of `src/App.jsx`:

```jsx
import LanguageSelector from './components/LanguageSelector';
import YearSelector from './components/YearSelector';
import ErrorBoundary from './components/ErrorBoundary';
import { useTranslation } from 'react-i18next';
import Logger from './utils/logger';
import { YearContext } from './utils/YearContext';
import { getGamesDataForYear } from './utils/dataUtils';
```

to:

```jsx
import LanguageSelector from './components/LanguageSelector';
import YearSelector from './components/YearSelector';
import ViewSelector from './components/ViewSelector';
import ErrorBoundary from './components/ErrorBoundary';
import { useTranslation } from 'react-i18next';
import Logger from './utils/logger';
import { YearContext } from './utils/YearContext';
import { ViewContext, VIEWS } from './utils/ViewContext';
import { getGamesDataForYear } from './utils/dataUtils';
```

Change the top of the `App` function body:

```jsx
function App() {
  const { t } = useTranslation();
  const { selectedYear } = useContext(YearContext);
  const currentYearData = getGamesDataForYear(selectedYear);
```

to:

```jsx
function App() {
  const { t } = useTranslation();
  const { selectedYear } = useContext(YearContext);
  const { activeView } = useContext(ViewContext);
  const currentYearData = getGamesDataForYear(selectedYear);
```

Change the navbar controls:

```jsx
          <div className="d-flex">
            <ErrorBoundary name="YearSelector">
              <YearSelector />
            </ErrorBoundary>
            <ErrorBoundary name="LanguageSelector">
              <LanguageSelector />
            </ErrorBoundary>
            <ErrorBoundary name="ThemeToggle">
              <SimpleThemeToggle />
            </ErrorBoundary>
          </div>
```

to:

```jsx
          <div className="d-flex">
            <ErrorBoundary name="ViewSelector">
              <ViewSelector />
            </ErrorBoundary>
            {activeView === VIEWS.SEASON && (
              <ErrorBoundary name="YearSelector">
                <YearSelector />
              </ErrorBoundary>
            )}
            <ErrorBoundary name="LanguageSelector">
              <LanguageSelector />
            </ErrorBoundary>
            <ErrorBoundary name="ThemeToggle">
              <SimpleThemeToggle />
            </ErrorBoundary>
          </div>
```

Change the `<div className="container">` body — wrap the existing season content (everything from the `TournamentChampion2025` comment through the `GamesList` row) in a `VIEWS.SEASON` branch, with a placeholder for the tournament view:

```jsx
      <div className="container">
        {/* Tournament 2025 Final Results — only shown when 2025 is selected */}
        {selectedYear === 2025 && (
```

to:

```jsx
      <div className="container">
        {activeView === VIEWS.TOURNAMENT ? (
          <div className="alert alert-info">
            <h4>{t('tournament.comingSoon.title')}</h4>
            <p>{t('tournament.comingSoon.message')}</p>
          </div>
        ) : (
        <>
        {/* Tournament 2025 Final Results — only shown when 2025 is selected */}
        {selectedYear === 2025 && (
```

And at the very end of the same `<div className="container">`, change:

```jsx
        {/* Sixth component: Recent Game Outcomes */}
        <div className="row">
          <div className="col-md-12">
            <ErrorBoundary name="GamesList">
              <SimpleGamesList gameData={currentYearData} />
            </ErrorBoundary>
          </div>
        </div>
      </div>
```

to:

```jsx
        {/* Sixth component: Recent Game Outcomes */}
        <div className="row">
          <div className="col-md-12">
            <ErrorBoundary name="GamesList">
              <SimpleGamesList gameData={currentYearData} />
            </ErrorBoundary>
          </div>
        </div>
        </>
        )}
      </div>
```

- [ ] **Step 8: Update `src/test/App.test.jsx` and `src/test/integration/App.integration.test.jsx` to wrap with `ViewProvider`**

`App.jsx` now calls `useContext(ViewContext)`, so both existing App tests must wrap with the real `ViewProvider` or they'll throw on render. In `src/test/App.test.jsx`, change:

```jsx
import { ThemeProvider } from '../utils/ThemeContext';
import { YearProvider } from '../utils/YearContext';
```

to:

```jsx
import { ThemeProvider } from '../utils/ThemeContext';
import { ViewProvider } from '../utils/ViewContext';
import { YearProvider } from '../utils/YearContext';
```

and change:

```jsx
const renderWithProviders = (component) => {
  return render(
    <ThemeProvider>
      <YearProvider>
        {component}
      </YearProvider>
    </ThemeProvider>
  );
};
```

to:

```jsx
const renderWithProviders = (component) => {
  return render(
    <ThemeProvider>
      <ViewProvider>
        <YearProvider>
          {component}
        </YearProvider>
      </ViewProvider>
    </ThemeProvider>
  );
};
```

Also add a mock for `ViewSelector` alongside the existing `YearSelector` mock (so this file's navigation-controls assertions aren't affected by the real tab markup):

```jsx
vi.mock('../components/YearSelector', () => ({
  default: () => <div data-testid="year-selector">Year Selector</div>
}));
```

becomes:

```jsx
vi.mock('../components/YearSelector', () => ({
  default: () => <div data-testid="year-selector">Year Selector</div>
}));

vi.mock('../components/ViewSelector', () => ({
  default: () => <div data-testid="view-selector">View Selector</div>
}));
```

Apply the identical `ViewProvider` import + wrap change to `src/test/integration/App.integration.test.jsx` (its imports and `renderApp` helper follow the same shape as `App.test.jsx`'s `renderWithProviders`).

- [ ] **Step 9: Run the full suite and verify no regressions**

Run: `npm run test:run`
Expected: all tests pass, including the updated `App.test.jsx` and `App.integration.test.jsx`.

- [ ] **Step 10: Commit**

```bash
git add src/utils/ViewContext.jsx src/components/ViewSelector.jsx src/test/components/ViewSelector.test.jsx src/index.jsx src/App.jsx src/utils/locales/da.js src/utils/locales/en.js src/test/App.test.jsx src/test/integration/App.integration.test.jsx
git commit -m "feat: add Season/Summer Tournament tab switcher with placeholder tournament view"
```

---

### Task 3: TournamentSummaryCards

**Files:**
- Create: `src/components/TournamentSummaryCards.jsx`
- Test: `src/test/components/TournamentSummaryCards.test.jsx`
- Modify: `src/utils/locales/da.js`
- Modify: `src/utils/locales/en.js`

**Interfaces:**
- Consumes: `processTournamentData`, `getTournamentTeamStatistics` from `src/utils/tournamentUtils.js` (Task 1); `SimpleAvatarWithHover` (unchanged); `getRankBasedAvatar` from `src/utils/simpleAvatarUtils.js` (unchanged).
- Produces: `TournamentSummaryCards` default export, prop `gameData: PropTypes.arrayOf(PropTypes.object).isRequired`. Consumed by Task 9's `App.jsx` wiring.

- [ ] **Step 1: Write the failing test**

Create `src/test/components/TournamentSummaryCards.test.jsx`:

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import i18n from '../../utils/i18n';
import TournamentSummaryCards from '../../components/TournamentSummaryCards';

const mockProcessTournamentData = vi.fn();
const mockGetTournamentTeamStatistics = vi.fn();
vi.mock('../../utils/tournamentUtils', () => ({
  processTournamentData: (...args) => mockProcessTournamentData(...args),
  getTournamentTeamStatistics: (...args) => mockGetTournamentTeamStatistics(...args)
}));

const renderWithProviders = (component) =>
  render(<ThemeProvider>{component}</ThemeProvider>);

describe('TournamentSummaryCards', () => {
  beforeEach(() => {
    i18n.changeLanguage('da');
  });

  describe('error state', () => {
    beforeEach(() => {
      mockProcessTournamentData.mockImplementation(() => { throw new Error('load failed'); });
    });

    it('shows the error alert', () => {
      renderWithProviders(<TournamentSummaryCards gameData={[]} />);
      expect(screen.getByText(/load failed/)).toBeInTheDocument();
    });
  });

  describe('happy path', () => {
    beforeEach(() => {
      mockProcessTournamentData.mockReturnValue({
        players: [
          { id: 1, name: 'Jonas', cumulativeScore: 4, gamesPlayed: 2, winRate: 100 },
          { id: 7, name: 'Malene', cumulativeScore: 1, gamesPlayed: 1, winRate: 0 }
        ],
        games: [
          { gameId: 1, gameDate: '2026-07-15', teams: [{ players: ['Jonas', 'Torben'], score: 2 }, { players: ['Malene', 'Kurt'], score: 1 }] }
        ]
      });
      mockGetTournamentTeamStatistics.mockReturnValue([
        { players: ['Jonas', 'Torben'], gamesPlayed: 2, wins: 2, losses: 0, winRate: 100, totalPoints: 4 }
      ]);
    });

    it('shows the leading player name', () => {
      renderWithProviders(<TournamentSummaryCards gameData={[]} />);
      expect(screen.getByText('Jonas')).toBeInTheDocument();
    });

    it('shows the best team players', () => {
      renderWithProviders(<TournamentSummaryCards gameData={[]} />);
      expect(screen.getByText('Jonas & Torben')).toBeInTheDocument();
    });

    it('shows the total games played', () => {
      renderWithProviders(<TournamentSummaryCards gameData={[]} />);
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 1b: Run the test to verify it fails**

Run: `npx vitest run src/test/components/TournamentSummaryCards.test.jsx`
Expected: FAIL — `Cannot find module '../../components/TournamentSummaryCards'`

- [ ] **Step 2: Add `tournament.summaryCards` keys to the locale files**

In `src/utils/locales/da.js`, inside the `"tournament"` object added in Task 2 (currently just `{"comingSoon": {...}}`), add a sibling key so it reads:

```js
  "tournament": {
    "comingSoon": {
      "title": "Sommerturnering kommer snart",
      "message": "Turneringsvisningen er under opbygning."
    },
    "summaryCards": {
      "error": "Fejl ved indlæsning af statistikker",
      "currentLeader": {
        "title": "Nuværende Leder",
        "totalPoints": "Samlede Point",
        "ofMaxScore": "af max score",
        "gamesPlayed": "spil spillet",
        "winRate": "sejrs rate",
        "noGames": "Ingen spil spillet endnu"
      },
      "gameStats": {
        "title": "Spil Statistikker",
        "totalGames": "Samlede Spil Spillet",
        "players": "Spillere",
        "totalTeams": "Samlede Hold",
        "avgGamesPerPlayer": "{{avg}} gns spil pr. spiller"
      },
      "bestTeam": {
        "title": "Bedste Hold",
        "wins": "Samlede Sejre",
        "gamesPlayed": "spil spillet",
        "winRate": "sejrs rate",
        "noTeamData": "Ingen hold data tilgængelig"
      },
      "combinations": {
        "title": "Hold Kombinationer",
        "ofCombinations": "af {{total}} kombinationer",
        "complete": "komplet",
        "remaining": "{{count}} tilbage"
      }
    }
  }
```

In `src/utils/locales/en.js`, make the equivalent addition:

```js
  "tournament": {
    "comingSoon": {
      "title": "Summer Tournament coming soon",
      "message": "The tournament view is under construction."
    },
    "summaryCards": {
      "error": "Error loading statistics",
      "currentLeader": {
        "title": "Current Leader",
        "totalPoints": "Total Points",
        "ofMaxScore": "of max score",
        "gamesPlayed": "games played",
        "winRate": "win rate",
        "noGames": "No games played yet"
      },
      "gameStats": {
        "title": "Game Statistics",
        "totalGames": "Total Games Played",
        "players": "Players",
        "totalTeams": "Total Teams",
        "avgGamesPerPlayer": "{{avg}} avg games per player"
      },
      "bestTeam": {
        "title": "Best Team",
        "wins": "Total Wins",
        "gamesPlayed": "games played",
        "winRate": "win rate",
        "noTeamData": "No team data available"
      },
      "combinations": {
        "title": "Team Combinations",
        "ofCombinations": "of {{total}} combinations",
        "complete": "complete",
        "remaining": "{{count}} remaining"
      }
    }
  }
```

- [ ] **Step 3: Create `src/components/TournamentSummaryCards.jsx`**

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { processTournamentData, getTournamentTeamStatistics } from '../utils/tournamentUtils';
import SimpleAvatarWithHover from './SimpleAvatarWithHover';
import { getRankBasedAvatar } from '../utils/simpleAvatarUtils';

const TournamentSummaryCards = ({ gameData }) => {
  const { t } = useTranslation();

  let players = [];
  let games = [];
  let teamStats = [];
  let dataError = null;

  try {
    const processed = processTournamentData(gameData);
    players = processed.players || [];
    games = processed.games || [];
    teamStats = getTournamentTeamStatistics(gameData) || [];
  } catch (error) {
    console.error('Error loading data for tournament summary cards:', error);
    dataError = error.message;
  }

  if (dataError) {
    return (
      <div className="alert alert-danger">
        <strong>{t('tournament.summaryCards.error')}:</strong> {dataError}
      </div>
    );
  }

  const leadingPlayer = players.length > 0 ? players[0] : null;
  const totalGames = games.length;
  const totalPlayers = players.length;

  // Max possible score is based on the leading player's own games played
  // (not totalGames), since tournament players don't all play every game.
  const maxPossibleScore = leadingPlayer ? leadingPlayer.gamesPlayed * 2 : 0;
  const scorePercentage = leadingPlayer && maxPossibleScore > 0
    ? Math.round((leadingPlayer.cumulativeScore / maxPossibleScore) * 100)
    : 0;

  const mostWinningTeam = teamStats.length > 0 ? teamStats[0] : null;

  const possibleTeamCombinations = totalPlayers * (totalPlayers - 1) / 2;

  const formedTeams = new Set();
  games.forEach(game => {
    if (game.teams) {
      game.teams.forEach(team => {
        if (team.players) {
          const teamKey = [...team.players].sort().join('-');
          formedTeams.add(teamKey);
        }
      });
    }
  });

  const completedCombinations = formedTeams.size;
  const completionPercentage = possibleTeamCombinations > 0 ?
    Math.round((completedCombinations / possibleTeamCombinations) * 100) : 0;

  return (
    <div className="row mb-4">
      {/* Leading Player Card */}
      <div className="col-md-6 col-lg-3 mb-3">
        <div className="card h-100 border-success">
          <div className="card-header bg-success text-white text-center">
            <h5 className="mb-0">🏆 {t('tournament.summaryCards.currentLeader.title')}</h5>
          </div>
          <div className="card-body text-center">
            {leadingPlayer ? (
              <>
                <div className="mb-3">
                  <SimpleAvatarWithHover
                    playerName={leadingPlayer.name}
                    avatarSrc={getRankBasedAvatar(leadingPlayer.name, 1)}
                    size={60}
                  />
                </div>
                <h4 className="text-success">{leadingPlayer.name}</h4>
                <div className="display-6 text-success mb-2">
                  {leadingPlayer.cumulativeScore}
                </div>
                <p className="text-muted mb-1">{t('tournament.summaryCards.currentLeader.totalPoints')}</p>
                <div className="progress mb-2">
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${scorePercentage}%` }}
                    aria-valuenow={scorePercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
                <small className="text-muted">
                  {scorePercentage}% {t('tournament.summaryCards.currentLeader.ofMaxScore')}<br/>
                  {leadingPlayer.gamesPlayed} {t('tournament.summaryCards.currentLeader.gamesPlayed')}<br/>
                  <strong className="text-success">{(leadingPlayer.winRate || 0).toFixed(1)}% {t('tournament.summaryCards.currentLeader.winRate')}</strong>
                </small>
              </>
            ) : (
              <p className="text-muted">{t('tournament.summaryCards.currentLeader.noGames')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Game Statistics Card */}
      <div className="col-md-6 col-lg-3 mb-3">
        <div className="card h-100 border-primary">
          <div className="card-header bg-primary text-white text-center">
            <h5 className="mb-0">🎮 {t('tournament.summaryCards.gameStats.title')}</h5>
          </div>
          <div className="card-body text-center">
            <div className="display-6 text-primary mb-2">{totalGames}</div>
            <p className="text-muted mb-3">{t('tournament.summaryCards.gameStats.totalGames')}</p>

            <div className="row text-center">
              <div className="col-6">
                <div className="h5 text-info">{totalPlayers}</div>
                <small className="text-muted">{t('tournament.summaryCards.gameStats.players')}</small>
              </div>
              <div className="col-6">
                <div className="h5 text-warning">{totalGames * 2}</div>
                <small className="text-muted">{t('tournament.summaryCards.gameStats.totalTeams')}</small>
              </div>
            </div>

            <div className="mt-3">
              <small className="text-muted">
                {t('tournament.summaryCards.gameStats.avgGamesPerPlayer', {
                  avg: totalGames > 0 && totalPlayers > 0 ? (totalGames * 4 / totalPlayers).toFixed(1) : '0'
                })}
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Best Team Card */}
      <div className="col-md-6 col-lg-3 mb-3">
        <div className="card h-100 border-warning">
          <div className="card-header bg-warning text-dark text-center">
            <h5 className="mb-0">👯 {t('tournament.summaryCards.bestTeam.title')}</h5>
          </div>
          <div className="card-body text-center">
            {mostWinningTeam ? (
              <>
                <div className="mb-3 d-flex justify-content-center">
                  {mostWinningTeam.players?.map((player, idx) => (
                    <SimpleAvatarWithHover
                      key={idx}
                      playerName={player}
                      avatarSrc={getRankBasedAvatar(player, 1)}
                      size={30}
                      className={idx > 0 ? 'ms-1' : ''}
                    />
                  ))}
                </div>
                <h6 className="text-warning">
                  {mostWinningTeam.players?.join(' & ')}
                </h6>
                <div className="h4 text-warning mb-2">
                  {mostWinningTeam.wins}
                </div>
                <p className="text-muted mb-1">{t('tournament.summaryCards.bestTeam.wins')}</p>
                <small className="text-muted">
                  {mostWinningTeam.gamesPlayed} {t('tournament.summaryCards.bestTeam.gamesPlayed')}<br/>
                  {(mostWinningTeam.winRate || 0).toFixed(1)}% {t('tournament.summaryCards.bestTeam.winRate')}
                </small>
              </>
            ) : (
              <p className="text-muted">{t('tournament.summaryCards.bestTeam.noTeamData')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Team Combinations Card */}
      <div className="col-md-6 col-lg-3 mb-3">
        <div className="card h-100 border-info">
          <div className="card-header bg-info text-white text-center">
            <h5 className="mb-0">🔄 {t('tournament.summaryCards.combinations.title')}</h5>
          </div>
          <div className="card-body text-center">
            <div className="display-6 text-info mb-2">
              {completedCombinations}
            </div>
            <p className="text-muted mb-2">
              {t('tournament.summaryCards.combinations.ofCombinations', { total: possibleTeamCombinations })}
            </p>

            <div className="progress mb-3">
              <div
                className="progress-bar bg-info"
                role="progressbar"
                style={{ width: `${completionPercentage}%` }}
                aria-valuenow={completionPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>

            <div className="h5 text-info">{completionPercentage}%</div>
            <small className="text-muted">{t('tournament.summaryCards.combinations.complete')}</small>

            <div className="mt-3">
              <small className="text-muted">
                {t('tournament.summaryCards.combinations.remaining', { count: possibleTeamCombinations - completedCombinations })}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TournamentSummaryCards.propTypes = {
  gameData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TournamentSummaryCards;
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/test/components/TournamentSummaryCards.test.jsx`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/TournamentSummaryCards.jsx src/test/components/TournamentSummaryCards.test.jsx src/utils/locales/da.js src/utils/locales/en.js
git commit -m "feat: add TournamentSummaryCards component"
```

---

### Task 4: TournamentLeaderboard

**Files:**
- Create: `src/components/TournamentLeaderboard.jsx`
- Test: `src/test/components/TournamentLeaderboard.test.jsx`
- Modify: `src/utils/locales/da.js`
- Modify: `src/utils/locales/en.js`

**Interfaces:**
- Consumes: `getTournamentLeaderboardData` from `src/utils/tournamentUtils.js` (Task 1).
- Produces: `TournamentLeaderboard` default export, prop `gameData: PropTypes.arrayOf(PropTypes.object).isRequired`. Consumed by Task 9.

- [ ] **Step 1: Write the failing test**

Create `src/test/components/TournamentLeaderboard.test.jsx`:

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import i18n from '../../utils/i18n';
import TournamentLeaderboard from '../../components/TournamentLeaderboard';

const mockGetTournamentLeaderboardData = vi.fn();
vi.mock('../../utils/tournamentUtils', () => ({
  getTournamentLeaderboardData: (...args) => mockGetTournamentLeaderboardData(...args)
}));

const renderWithProviders = (component) =>
  render(<ThemeProvider>{component}</ThemeProvider>);

describe('TournamentLeaderboard', () => {
  beforeEach(() => {
    i18n.changeLanguage('da');
  });

  describe('empty state', () => {
    beforeEach(() => {
      mockGetTournamentLeaderboardData.mockReturnValue({ players: [], games: [] });
    });

    it('shows the no-data message', () => {
      renderWithProviders(<TournamentLeaderboard gameData={[]} />);
      expect(screen.getByText('Ingen spillerdata tilgængelig.')).toBeInTheDocument();
    });
  });

  describe('happy path', () => {
    beforeEach(() => {
      mockGetTournamentLeaderboardData.mockReturnValue({
        players: [
          { id: 1, name: 'Jonas', cumulativeScore: 4, gamesPlayed: 2, winRate: 100 },
          { id: 7, name: 'Malene', cumulativeScore: 1, gamesPlayed: 1, winRate: 0 }
        ],
        games: [{ gameId: 1 }]
      });
    });

    it('renders every player row', () => {
      renderWithProviders(<TournamentLeaderboard gameData={[]} />);
      expect(screen.getByText('Jonas')).toBeInTheDocument();
      expect(screen.getByText('Malene')).toBeInTheDocument();
    });

    it('shows the total games count from leaderboardData.games.length', () => {
      renderWithProviders(<TournamentLeaderboard gameData={[]} />);
      expect(
        screen.getByText((content) => content.includes('Samlede spil registreret') && content.includes('1'))
      ).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 1b: Run the test to verify it fails**

Run: `npx vitest run src/test/components/TournamentLeaderboard.test.jsx`
Expected: FAIL — `Cannot find module '../../components/TournamentLeaderboard'`

- [ ] **Step 2: Add `tournament.leaderboard` keys to the locale files**

In `src/utils/locales/da.js`, inside the `"tournament"` object, `summaryCards` is currently the last key (its closing `}` has no trailing comma — added that way in Task 3). Add a comma after that `}`, then add a sibling key:

```js
    "leaderboard": {
      "title": "Turnering Resultattavle",
      "error": "Resultattavle Fejl",
      "rank": "Placering",
      "player": "Spiller",
      "score": "Score",
      "games": "Spil",
      "avg": "Gns",
      "winRate": "Sejrs Rate",
      "noData": "Ingen Resultattavle Data",
      "noPlayerData": "Ingen spillerdata tilgængelig.",
      "totalPlayers": "Antal spillere",
      "totalGames": "Samlede spil registreret",
      "avatarLegend": "Avatar Forklaring"
    },
```

In `src/utils/locales/en.js`, make the same fix (add a trailing comma after `summaryCards`'s closing `}`), then add the equivalent:

```js
    "leaderboard": {
      "title": "Tournament Leaderboard",
      "error": "Leaderboard Error",
      "rank": "Rank",
      "player": "Player",
      "score": "Score",
      "games": "Games",
      "avg": "Avg",
      "winRate": "Win Rate",
      "noData": "No Leaderboard Data",
      "noPlayerData": "No player data available.",
      "totalPlayers": "Total players",
      "totalGames": "Total games tracked",
      "avatarLegend": "Avatar Legend"
    },
```

- [ ] **Step 3: Create `src/components/TournamentLeaderboard.jsx`**

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { getTournamentLeaderboardData } from '../utils/tournamentUtils';
import SimpleAvatarWithHover from './SimpleAvatarWithHover';
import { getRankBasedAvatar } from '../utils/simpleAvatarUtils';

const TournamentLeaderboard = ({ gameData }) => {
  const { t } = useTranslation();

  let players = [];
  let leaderboardData = null;
  let dataError = null;

  try {
    leaderboardData = getTournamentLeaderboardData(gameData);

    if (leaderboardData && leaderboardData.players && Array.isArray(leaderboardData.players)) {
      players = leaderboardData.players;
    } else {
      throw new Error('Invalid leaderboard data structure');
    }
  } catch (error) {
    console.error('Error in TournamentLeaderboard:', error);
    dataError = error.message;
  }

  const getPlayerInitials = (name) => {
    try {
      if (!name || typeof name !== 'string') return '??';
      return name.split(' ').map(n => n[0] || '').join('').toUpperCase() || '??';
    } catch (error) {
      console.error('Error getting initials for:', name, error);
      return '??';
    }
  };

  const getRankEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}.`;
  };

  if (dataError) {
    return (
      <div className="card">
        <div className="card-header bg-danger text-white">
          <h2>❌ {t('tournament.leaderboard.error')}</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-danger">
            <strong>Error:</strong> {dataError}
          </div>
        </div>
      </div>
    );
  }

  if (!players || players.length === 0) {
    return (
      <div className="card">
        <div className="card-header bg-warning text-dark">
          <h2>⚠️ {t('tournament.leaderboard.noData')}</h2>
        </div>
        <div className="card-body">
          <p>{t('tournament.leaderboard.noPlayerData')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h2>🏆 {t('tournament.leaderboard.title')}</h2>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <caption className="visually-hidden">{t('tournament.leaderboard.title')}</caption>
            <thead className="table-dark">
              <tr>
                <th>{t('tournament.leaderboard.rank')}</th>
                <th>{t('tournament.leaderboard.player')}</th>
                <th>{t('tournament.leaderboard.score')}</th>
                <th>{t('tournament.leaderboard.games')}</th>
                <th>{t('tournament.leaderboard.avg')}</th>
                <th>{t('tournament.leaderboard.winRate')}</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => {
                const name = player.name || 'Unknown Player';
                const score = player.cumulativeScore || 0;
                const gamesPlayed = player.gamesPlayed || 0;
                const winRate = player.winRate || 0;

                const avgScore = gamesPlayed > 0 ? (score / gamesPlayed).toFixed(1) : '0.0';

                return (
                  <tr key={`player-${index}-${name}`}>
                    <td>
                      <strong>{getRankEmoji(index + 1)}</strong>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        {(() => {
                          try {
                            const currentRank = index + 1;
                            const avatarSrc = getRankBasedAvatar(name, currentRank);
                            return (
                              <SimpleAvatarWithHover
                                playerName={name}
                                avatarSrc={avatarSrc}
                                size={32}
                                className="me-2"
                              />
                            );
                          } catch (error) {
                            console.error('Error rendering avatar for', name, ':', error);
                            return (
                              <div
                                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                                style={{ width: '32px', height: '32px', fontSize: '12px' }}
                              >
                                {getPlayerInitials(name)}
                              </div>
                            );
                          }
                        })()}
                        <strong>{name}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-success fs-6">
                        {score}
                      </span>
                    </td>
                    <td>{gamesPlayed}</td>
                    <td>{avgScore}</td>
                    <td>
                      <span className={`badge ${winRate >= 50 ? 'bg-success' : 'bg-warning'}`}>
                        {winRate.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-3">
          <div className="row">
            <div className="col-md-6">
              <small className="text-muted">
                {t('tournament.leaderboard.totalPlayers')}: {players.length} |
                {t('tournament.leaderboard.totalGames')}: {leaderboardData?.games?.length ?? 0}
              </small>
            </div>
            <div className="col-md-6 text-end">
              <small className="text-muted">
                <strong>{t('tournament.leaderboard.avatarLegend')}:</strong>
                <span className="ms-2">🥇😊</span>
                <span className="ms-2">🥈🥉😐</span>
                <span className="ms-2">4-8😢</span>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TournamentLeaderboard.propTypes = {
  gameData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TournamentLeaderboard;
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/test/components/TournamentLeaderboard.test.jsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/TournamentLeaderboard.jsx src/test/components/TournamentLeaderboard.test.jsx src/utils/locales/da.js src/utils/locales/en.js
git commit -m "feat: add TournamentLeaderboard component"
```

---

### Task 5: TournamentPlayerPerformance

**Files:**
- Create: `src/components/TournamentPlayerPerformance.jsx`
- Test: `src/test/components/TournamentPlayerPerformance.test.jsx`
- Modify: `src/utils/locales/da.js`
- Modify: `src/utils/locales/en.js`

**Interfaces:**
- Consumes: `getTournamentLeaderboardData` from `src/utils/tournamentUtils.js` (Task 1).
- Produces: `TournamentPlayerPerformance` default export, prop `gameData: PropTypes.arrayOf(PropTypes.object).isRequired`. Consumed by Task 9.

- [ ] **Step 1: Write the failing test**

Create `src/test/components/TournamentPlayerPerformance.test.jsx`:

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import i18n from '../../utils/i18n';
import TournamentPlayerPerformance from '../../components/TournamentPlayerPerformance';

const mockGetTournamentLeaderboardData = vi.fn();
vi.mock('../../utils/tournamentUtils', () => ({
  getTournamentLeaderboardData: (...args) => mockGetTournamentLeaderboardData(...args)
}));

const renderWithProviders = (component) =>
  render(<ThemeProvider>{component}</ThemeProvider>);

describe('TournamentPlayerPerformance', () => {
  beforeEach(() => {
    i18n.changeLanguage('da');
  });

  describe('empty state', () => {
    beforeEach(() => {
      mockGetTournamentLeaderboardData.mockReturnValue({ players: [] });
    });

    it('shows the no-data message', () => {
      renderWithProviders(<TournamentPlayerPerformance gameData={[]} />);
      expect(screen.getByText('Ingen spillerdata tilgængelig')).toBeInTheDocument();
    });
  });

  describe('happy path', () => {
    beforeEach(() => {
      mockGetTournamentLeaderboardData.mockReturnValue({
        players: [
          { id: 1, name: 'Jonas', cumulativeScore: 4, gamesPlayed: 2, winRate: 100, avgScore: 2 },
          { id: 7, name: 'Malene', cumulativeScore: 1, gamesPlayed: 1, winRate: 0, avgScore: 1 }
        ]
      });
    });

    it('renders a card for each player', () => {
      renderWithProviders(<TournamentPlayerPerformance gameData={[]} />);
      expect(screen.getByText(/Jonas/)).toBeInTheDocument();
      expect(screen.getByText(/Malene/)).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 1b: Run the test to verify it fails**

Run: `npx vitest run src/test/components/TournamentPlayerPerformance.test.jsx`
Expected: FAIL — `Cannot find module '../../components/TournamentPlayerPerformance'`

- [ ] **Step 2: Add `tournament.playerPerformance` keys to the locale files**

In `src/utils/locales/da.js`, inside the `"tournament"` object, `leaderboard` is currently the last key — its closing `}` already has a trailing comma (added in Task 4), so just add this new sibling after it:

```js
    "playerPerformance": {
      "title": "Turnering Spillerpræstation",
      "error": "Spillerpræstation Fejl",
      "noData": "Ingen spillerdata tilgængelig",
      "playGames": "Spil nogle spil for at se spillerpræstation her!",
      "totalPoints": "Samlede Point",
      "games": "Spil",
      "avgPerGame": "Gns/Spil",
      "winRate": "Sejrsprocent",
      "performanceLevels": {
        "excellent": "Fremragende",
        "good": "God",
        "average": "Gennemsnitlig",
        "needsWork": "Kan Forbedres"
      },
      "winRateMessages": {
        "excellent": "🏆 Fremragende sejrsprocent!",
        "good": "👍 God præstation",
        "improvement": "💪 Plads til forbedring",
        "practice": "📈 Bliv ved med at øve!"
      },
      "insights": {
        "title": "📊 Præstationsindsigt",
        "excellentDesc": "Toppræsterer",
        "goodDesc": "Over gennemsnittet",
        "averageDesc": "Midterste felt",
        "needsWorkDesc": "Plads til forbedring",
        "winAnalysisTitle": "🏆 Sejrsprocent Analyse",
        "championLevel": "🏆 Mester niveau",
        "solidPerformer": "👍 Solid præsterer",
        "developing": "💪 Under udvikling",
        "learningPhase": "📈 Læringsfase",
        "averageWinRate": "Gennemsnitlig Sejrsprocent",
        "bestWinRate": "Bedste Sejrsprocent",
        "highPerformers": "Højtpræsterende (≥60%)"
      }
    },
```

In `src/utils/locales/en.js`, add the equivalent:

```js
    "playerPerformance": {
      "title": "Tournament Player Performance",
      "error": "Player Performance Error",
      "noData": "No player data available",
      "playGames": "Play some games to see player performance here!",
      "totalPoints": "Total Points",
      "games": "Games",
      "avgPerGame": "Avg/Game",
      "winRate": "Win Rate",
      "performanceLevels": {
        "excellent": "Excellent",
        "good": "Good",
        "average": "Average",
        "needsWork": "Needs Work"
      },
      "winRateMessages": {
        "excellent": "🏆 Excellent win rate!",
        "good": "👍 Good performance",
        "improvement": "💪 Room for improvement",
        "practice": "📈 Keep practicing!"
      },
      "insights": {
        "title": "📊 Performance Insights",
        "excellentDesc": "Top performer",
        "goodDesc": "Above average",
        "averageDesc": "Middle pack",
        "needsWorkDesc": "Room to improve",
        "winAnalysisTitle": "🏆 Win Rate Analysis",
        "championLevel": "🏆 Champion level",
        "solidPerformer": "👍 Solid performer",
        "developing": "💪 Developing",
        "learningPhase": "📈 Learning phase",
        "averageWinRate": "Average Win Rate",
        "bestWinRate": "Best Win Rate",
        "highPerformers": "High Performers (≥60%)"
      }
    },
```

- [ ] **Step 3: Create `src/components/TournamentPlayerPerformance.jsx`**

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { getTournamentLeaderboardData } from '../utils/tournamentUtils';
import SimpleAvatarWithHover from './SimpleAvatarWithHover';
import { getRankBasedAvatar } from '../utils/simpleAvatarUtils';

const TournamentPlayerPerformance = ({ gameData }) => {
  const { t } = useTranslation();

  let players = [];
  let dataError = null;

  try {
    const leaderboardData = getTournamentLeaderboardData(gameData);
    players = leaderboardData?.players || [];
  } catch (error) {
    console.error('Error loading tournament player performance data:', error);
    dataError = error.message;
  }

  if (dataError) {
    return (
      <div className="card">
        <div className="card-header bg-danger text-white">
          <h2>❌ {t('tournament.playerPerformance.error')}</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-danger">
            <strong>Error:</strong> {dataError}
          </div>
        </div>
      </div>
    );
  }

  if (!players || players.length === 0) {
    return (
      <div className="card">
        <div className="card-header bg-info text-white">
          <h2>📈 {t('tournament.playerPerformance.title')}</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-info">
            <h4>{t('tournament.playerPerformance.noData')}</h4>
            <p>{t('tournament.playerPerformance.playGames')}</p>
          </div>
        </div>
      </div>
    );
  }

  const sortedPlayers = [...players].sort((a, b) => b.cumulativeScore - a.cumulativeScore);

  const getPerformanceLevel = (rank, totalPlayers) => {
    if (rank === 1) return { level: t('tournament.playerPerformance.performanceLevels.excellent'), class: 'success', icon: '🔥' };
    if (rank <= Math.ceil(totalPlayers * 0.33)) return { level: t('tournament.playerPerformance.performanceLevels.good'), class: 'warning', icon: '👍' };
    if (rank <= Math.ceil(totalPlayers * 0.67)) return { level: t('tournament.playerPerformance.performanceLevels.average'), class: 'info', icon: '👌' };
    return { level: t('tournament.playerPerformance.performanceLevels.needsWork'), class: 'secondary', icon: '💪' };
  };

  const getProgressBarWidth = (score, maxScore) => {
    return maxScore > 0 ? Math.min((score / maxScore) * 100, 100) : 0;
  };

  const maxScore = sortedPlayers.length > 0 ? sortedPlayers[0].cumulativeScore : 1;

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h2>📈 {t('tournament.playerPerformance.title')}</h2>
      </div>
      <div className="card-body">
        <div className="row">
          {sortedPlayers.map((player, index) => {
            const rank = index + 1;
            const name = player.name || t('common.unknownPlayer');
            const score = player.cumulativeScore || 0;
            const gamesPlayed = player.gamesPlayed || 0;
            const winRate = player.winRate || 0;
            const avgScore = player.avgScore ? player.avgScore.toFixed(1) : '0.0';

            const performance = getPerformanceLevel(rank, sortedPlayers.length);
            const progressWidth = getProgressBarWidth(score, maxScore);

            return (
              <div key={`${name}-${index}`} className="col-md-6 col-lg-4 mb-4">
                <div className={`card border-${performance.class} h-100`}>
                  <div className={`card-header bg-${performance.class} text-white`}>
                    <div className="d-flex align-items-center justify-content-between">
                      <h6 className="mb-0">#{rank} {name}</h6>
                      <span>{performance.icon}</span>
                    </div>
                  </div>
                  <div className="card-body text-center">
                    <div className="mb-3">
                      <SimpleAvatarWithHover
                        playerName={name}
                        avatarSrc={getRankBasedAvatar(name, rank)}
                        size={50}
                      />
                    </div>

                    <div className="mb-3">
                      <div className="display-6 text-primary">{score}</div>
                      <small className="text-muted">{t('tournament.playerPerformance.totalPoints')}</small>
                    </div>

                    <div className="progress mb-3">
                      <div
                        className={`progress-bar bg-${performance.class}`}
                        role="progressbar"
                        style={{ width: `${progressWidth}%` }}
                        aria-valuenow={progressWidth}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>

                    <div className="row text-center mb-3">
                      <div className="col-4">
                        <div className="h6 text-info">{gamesPlayed}</div>
                        <small className="text-muted">{t('tournament.playerPerformance.games')}</small>
                      </div>
                      <div className="col-4">
                        <div className="h6 text-success">{avgScore}</div>
                        <small className="text-muted">{t('tournament.playerPerformance.avgPerGame')}</small>
                      </div>
                      <div className="col-4">
                        <div className={`h6 ${winRate >= 60 ? 'text-success' : winRate >= 40 ? 'text-warning' : 'text-danger'}`}>
                          {winRate.toFixed(1)}%
                        </div>
                        <small className="text-muted">{t('tournament.playerPerformance.winRate')}</small>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="progress" style={{height: '6px'}}>
                        <div
                          className={`progress-bar ${winRate >= 60 ? 'bg-success' : winRate >= 40 ? 'bg-warning' : 'bg-danger'}`}
                          role="progressbar"
                          style={{ width: `${winRate}%` }}
                          aria-valuenow={winRate}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <small className="text-muted">
                        {winRate >= 60 ? t('tournament.playerPerformance.winRateMessages.excellent') :
                         winRate >= 40 ? t('tournament.playerPerformance.winRateMessages.good') :
                         winRate >= 20 ? t('tournament.playerPerformance.winRateMessages.improvement') :
                         t('tournament.playerPerformance.winRateMessages.practice')}
                      </small>
                    </div>

                    <div className={`badge bg-${performance.class} fs-6`}>
                      {performance.level}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4">
          <div className="alert alert-light">
            <h5>{t('tournament.playerPerformance.insights.title')}</h5>
            <div className="row mb-3">
              <div className="col-md-3">
                <strong>🔥 {t('tournament.playerPerformance.performanceLevels.excellent')}:</strong> {t('tournament.playerPerformance.insights.excellentDesc')}
              </div>
              <div className="col-md-3">
                <strong>👍 {t('tournament.playerPerformance.performanceLevels.good')}:</strong> {t('tournament.playerPerformance.insights.goodDesc')}
              </div>
              <div className="col-md-3">
                <strong>👌 {t('tournament.playerPerformance.performanceLevels.average')}:</strong> {t('tournament.playerPerformance.insights.averageDesc')}
              </div>
              <div className="col-md-3">
                <strong>💪 {t('tournament.playerPerformance.performanceLevels.needsWork')}:</strong> {t('tournament.playerPerformance.insights.needsWorkDesc')}
              </div>
            </div>

            <h6>{t('tournament.playerPerformance.insights.winAnalysisTitle')}</h6>
            <div className="row">
              <div className="col-md-3">
                <div className="text-success">
                  <strong>≥60%:</strong> {t('tournament.playerPerformance.insights.championLevel')}
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-warning">
                  <strong>40-59%:</strong> {t('tournament.playerPerformance.insights.solidPerformer')}
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-info">
                  <strong>20-39%:</strong> {t('tournament.playerPerformance.insights.developing')}
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-danger">
                  <strong>&lt;20%:</strong> {t('tournament.playerPerformance.insights.learningPhase')}
                </div>
              </div>
            </div>

            {(() => {
              const avgWinRate = sortedPlayers.length > 0 ?
                (sortedPlayers.reduce((sum, p) => sum + (p.winRate || 0), 0) / sortedPlayers.length).toFixed(1) : 0;
              const highPerformers = sortedPlayers.filter(p => (p.winRate || 0) >= 60).length;
              const bestWinRate = sortedPlayers.length > 0 ?
                Math.max(...sortedPlayers.map(p => p.winRate || 0)).toFixed(1) : 0;

              return (
                <div className="mt-3 pt-3 border-top">
                  <div className="row text-center">
                    <div className="col-md-4">
                      <div className="h5 text-primary">{avgWinRate}%</div>
                      <small className="text-muted">{t('tournament.playerPerformance.insights.averageWinRate')}</small>
                    </div>
                    <div className="col-md-4">
                      <div className="h5 text-success">{bestWinRate}%</div>
                      <small className="text-muted">{t('tournament.playerPerformance.insights.bestWinRate')}</small>
                    </div>
                    <div className="col-md-4">
                      <div className="h5 text-warning">{highPerformers}</div>
                      <small className="text-muted">{t('tournament.playerPerformance.insights.highPerformers')}</small>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

TournamentPlayerPerformance.propTypes = {
  gameData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TournamentPlayerPerformance;
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/test/components/TournamentPlayerPerformance.test.jsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/TournamentPlayerPerformance.jsx src/test/components/TournamentPlayerPerformance.test.jsx src/utils/locales/da.js src/utils/locales/en.js
git commit -m "feat: add TournamentPlayerPerformance component"
```

---

### Task 6: TournamentGamesCalendar

**Files:**
- Create: `src/components/TournamentGamesCalendar.jsx`
- Test: `src/test/components/TournamentGamesCalendar.test.jsx`
- Modify: `src/utils/locales/da.js`
- Modify: `src/utils/locales/en.js`

**Interfaces:**
- Consumes: `getTournamentGames` from `src/utils/tournamentUtils.js` (Task 1).
- Produces: `TournamentGamesCalendar` default export, prop `gameData: PropTypes.arrayOf(PropTypes.object).isRequired`. Consumed by Task 9.

- [ ] **Step 1: Write the failing test**

Create `src/test/components/TournamentGamesCalendar.test.jsx`:

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import '../../utils/i18n';
import TournamentGamesCalendar from '../../components/TournamentGamesCalendar';

const mockGetTournamentGames = vi.fn();
vi.mock('../../utils/tournamentUtils', () => ({
  getTournamentGames: (...args) => mockGetTournamentGames(...args)
}));

const renderWithProviders = (component) =>
  render(<ThemeProvider>{component}</ThemeProvider>);

describe('TournamentGamesCalendar – error state', () => {
  beforeEach(() => {
    mockGetTournamentGames.mockImplementation(() => { throw new Error('network error'); });
  });

  it('renders the error card without crashing', () => {
    renderWithProviders(<TournamentGamesCalendar gameData={[]} />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });
});

describe('TournamentGamesCalendar – empty state', () => {
  beforeEach(() => {
    mockGetTournamentGames.mockReturnValue([]);
  });

  it('shows the no-games heading', () => {
    renderWithProviders(<TournamentGamesCalendar gameData={[]} />);
    expect(screen.getByText('Ingen spil fundet')).toBeInTheDocument();
  });
});

describe('TournamentGamesCalendar – happy path', () => {
  beforeEach(() => {
    mockGetTournamentGames.mockReturnValue([
      { gameId: 1, gameDate: '2026-07-15', teams: [{ players: ['Jonas', 'Torben'], score: 2 }, { players: ['Malene', 'Kurt'], score: 1 }] }
    ]);
  });

  it('shows the total games stat', () => {
    renderWithProviders(<TournamentGamesCalendar gameData={[]} />);
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 1b: Run the test to verify it fails**

Run: `npx vitest run src/test/components/TournamentGamesCalendar.test.jsx`
Expected: FAIL — `Cannot find module '../../components/TournamentGamesCalendar'`

- [ ] **Step 2: Add `tournament.gamesCalendar` keys to the locale files**

In `src/utils/locales/da.js`, inside the `"tournament"` object, add:

```js
    "gamesCalendar": {
      "title": "Turnering Kalender",
      "timelineTitle": "Aktivitets Tidslinje",
      "errorLoading": "Fejl ved indlæsning",
      "noGames": "Ingen spil fundet",
      "startPlaying": "Start med at spille nogle turneringsspil for at se kalenderen her!",
      "stats": {
        "totalGames": "Samlede Spil",
        "activeDays": "Aktive Dage",
        "avgPerDay": "Gns pr. Dag",
        "maxPerDay": "Max pr. Dag"
      },
      "timeline": {
        "title": "Aktivitets Tidslinje",
        "game": "spil",
        "games": "spil"
      },
      "levels": {
        "title": "Aktivitets Niveauer",
        "low": "Lav",
        "lowDesc": "1-2 spil pr. dag",
        "medium": "Medium",
        "mediumDesc": "3-4 spil pr. dag",
        "high": "Høj",
        "highDesc": "5+ spil pr. dag"
      },
      "recent": {
        "title": "Seneste Aktivitet",
        "date": "Dato",
        "games": "Spil",
        "teams": "Hold",
        "teamsPlayed": "hold spillede"
      }
    },
```

In `src/utils/locales/en.js`, add the equivalent:

```js
    "gamesCalendar": {
      "title": "Tournament Calendar",
      "timelineTitle": "Activity Timeline",
      "errorLoading": "Error loading",
      "noGames": "No games found",
      "startPlaying": "Start playing some tournament games to see the calendar here!",
      "stats": {
        "totalGames": "Total Games",
        "activeDays": "Active Days",
        "avgPerDay": "Avg per Day",
        "maxPerDay": "Max per Day"
      },
      "timeline": {
        "title": "Activity Timeline",
        "game": "game",
        "games": "games"
      },
      "levels": {
        "title": "Activity Levels",
        "low": "Low",
        "lowDesc": "1-2 games per day",
        "medium": "Medium",
        "mediumDesc": "3-4 games per day",
        "high": "High",
        "highDesc": "5+ games per day"
      },
      "recent": {
        "title": "Recent Activity",
        "date": "Date",
        "games": "Games",
        "teams": "Teams",
        "teamsPlayed": "teams played"
      }
    },
```

- [ ] **Step 3: Create `src/components/TournamentGamesCalendar.jsx`**

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { getTournamentGames } from '../utils/tournamentUtils';

const TournamentGamesCalendar = ({ gameData }) => {
  const { t, i18n } = useTranslation();

  let games = [];
  let dataError = null;

  try {
    games = getTournamentGames(gameData) || [];
  } catch (error) {
    console.error('Error loading tournament calendar data:', error);
    dataError = error.message;
  }

  if (dataError) {
    return (
      <div className="card">
        <div className="card-header bg-danger text-white">
          <h2>❌ {t('tournament.gamesCalendar.title')}</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-danger">
            <strong>{t('tournament.gamesCalendar.errorLoading')}:</strong> {dataError}
          </div>
        </div>
      </div>
    );
  }

  if (!games || games.length === 0) {
    return (
      <div className="card">
        <div className="card-header bg-info text-white">
          <h2>📅 {t('tournament.gamesCalendar.title')}</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-info">
            <h4>{t('tournament.gamesCalendar.noGames')}</h4>
            <p>{t('tournament.gamesCalendar.startPlaying')}</p>
          </div>
        </div>
      </div>
    );
  }

  const gamesByDate = games.reduce((acc, game) => {
    const date = game.gameDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(game);
    return acc;
  }, {});

  const sortedDates = Object.keys(gamesByDate).sort((a, b) => new Date(a) - new Date(b));

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(i18n.language, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getGameIntensity = (gameCount) => {
    if (gameCount >= 4) return 'high';
    if (gameCount >= 2) return 'medium';
    return 'low';
  };

  const getIntensityClass = (intensity) => {
    switch (intensity) {
      case 'high': return 'bg-success';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-info';
      default: return 'bg-light';
    }
  };

  const totalGames = games.length;
  const totalDays = sortedDates.length;
  const avgGamesPerDay = totalDays > 0 ? (totalGames / totalDays).toFixed(1) : 0;
  const maxGamesInDay = Math.max(...Object.values(gamesByDate).map(g => g.length));

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h2>📅 {t('tournament.gamesCalendar.timelineTitle')}</h2>
      </div>
      <div className="card-body">
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="text-center">
              <div className="h4 text-primary">{totalGames}</div>
              <small className="text-muted">{t('tournament.gamesCalendar.stats.totalGames')}</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-center">
              <div className="h4 text-info">{totalDays}</div>
              <small className="text-muted">{t('tournament.gamesCalendar.stats.activeDays')}</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-center">
              <div className="h4 text-success">{avgGamesPerDay}</div>
              <small className="text-muted">{t('tournament.gamesCalendar.stats.avgPerDay')}</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-center">
              <div className="h4 text-warning">{maxGamesInDay}</div>
              <small className="text-muted">{t('tournament.gamesCalendar.stats.maxPerDay')}</small>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h5>📊 {t('tournament.gamesCalendar.timeline.title')}</h5>
          <div className="row">
            {sortedDates.map((date) => {
              const dayGames = gamesByDate[date];
              const intensity = getGameIntensity(dayGames.length);
              const intensityClass = getIntensityClass(intensity);

              return (
                <div key={date} className="col-md-2 col-sm-3 col-4 mb-3">
                  <div className={`card ${intensityClass} text-white h-100`}>
                    <div className="card-body text-center p-2">
                      <div className="small font-weight-bold">
                        {formatDate(date)}
                      </div>
                      <div className="h5 mb-1">{dayGames.length}</div>
                      <div className="small">
                        {dayGames.length === 1 ? t('tournament.gamesCalendar.timeline.game') : t('tournament.gamesCalendar.timeline.games')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="alert alert-light">
          <h6>📈 {t('tournament.gamesCalendar.levels.title')}</h6>
          <div className="row">
            <div className="col-md-4">
              <span className="badge bg-info me-2">{t('tournament.gamesCalendar.levels.low')}</span>
              <small>{t('tournament.gamesCalendar.levels.lowDesc')}</small>
            </div>
            <div className="col-md-4">
              <span className="badge bg-warning me-2">{t('tournament.gamesCalendar.levels.medium')}</span>
              <small>{t('tournament.gamesCalendar.levels.mediumDesc')}</small>
            </div>
            <div className="col-md-4">
              <span className="badge bg-success me-2">{t('tournament.gamesCalendar.levels.high')}</span>
              <small>{t('tournament.gamesCalendar.levels.highDesc')}</small>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h6>🕒 {t('tournament.gamesCalendar.recent.title')}</h6>
          <div className="table-responsive">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>{t('tournament.gamesCalendar.recent.date')}</th>
                  <th>{t('tournament.gamesCalendar.recent.games')}</th>
                  <th>{t('tournament.gamesCalendar.recent.teams')}</th>
                </tr>
              </thead>
              <tbody>
                {sortedDates.slice(-5).reverse().map(date => {
                  const dayGames = gamesByDate[date];
                  const totalTeams = dayGames.reduce((sum, game) => sum + (game.teams?.length || 0), 0);
                  return (
                    <tr key={date}>
                      <td>{formatDate(date)}</td>
                      <td>
                        <span className={`badge ${getIntensityClass(getGameIntensity(dayGames.length))}`}>
                          {dayGames.length}
                        </span>
                      </td>
                      <td>{totalTeams} {t('tournament.gamesCalendar.recent.teamsPlayed')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

TournamentGamesCalendar.propTypes = {
  gameData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TournamentGamesCalendar;
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/test/components/TournamentGamesCalendar.test.jsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/TournamentGamesCalendar.jsx src/test/components/TournamentGamesCalendar.test.jsx src/utils/locales/da.js src/utils/locales/en.js
git commit -m "feat: add TournamentGamesCalendar component"
```

---

### Task 7: TournamentTeamStatistics

**Files:**
- Create: `src/components/TournamentTeamStatistics.jsx`
- Test: `src/test/components/TournamentTeamStatistics.test.jsx`
- Modify: `src/utils/locales/da.js`
- Modify: `src/utils/locales/en.js`

**Interfaces:**
- Consumes: `getTournamentTeamStatistics` from `src/utils/tournamentUtils.js` (Task 1) — objects shaped `{players, gamesPlayed, wins, losses, totalPoints, winRate}` (no `seconds`/`thirds`).
- Produces: `TournamentTeamStatistics` default export, prop `gameData: PropTypes.arrayOf(PropTypes.object).isRequired`. Consumed by Task 9.

- [ ] **Step 1: Write the failing test**

Create `src/test/components/TournamentTeamStatistics.test.jsx`:

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import i18n from '../../utils/i18n';
import TournamentTeamStatistics from '../../components/TournamentTeamStatistics';

const mockGetTournamentTeamStatistics = vi.fn();
vi.mock('../../utils/tournamentUtils', () => ({
  getTournamentTeamStatistics: (...args) => mockGetTournamentTeamStatistics(...args)
}));

const renderWithProviders = (component) =>
  render(<ThemeProvider>{component}</ThemeProvider>);

describe('TournamentTeamStatistics', () => {
  beforeEach(() => {
    i18n.changeLanguage('da');
  });

  describe('empty state', () => {
    beforeEach(() => {
      mockGetTournamentTeamStatistics.mockReturnValue([]);
    });

    it('shows the no-data message', () => {
      renderWithProviders(<TournamentTeamStatistics gameData={[]} />);
      expect(screen.getByText('Ingen hold data tilgængelig')).toBeInTheDocument();
    });
  });

  describe('happy path', () => {
    beforeEach(() => {
      mockGetTournamentTeamStatistics.mockReturnValue([
        { players: ['Jonas', 'Torben'], gamesPlayed: 2, wins: 2, losses: 0, winRate: 100, totalPoints: 4 },
        { players: ['Malene', 'Kurt'], gamesPlayed: 2, wins: 0, losses: 2, winRate: 0, totalPoints: 2 }
      ]);
    });

    it('renders a row per team', () => {
      renderWithProviders(<TournamentTeamStatistics gameData={[]} />);
      expect(screen.getByText('Jonas')).toBeInTheDocument();
      expect(screen.getByText('Malene')).toBeInTheDocument();
    });

    it('does not render a 3rd-place column', () => {
      renderWithProviders(<TournamentTeamStatistics gameData={[]} />);
      expect(screen.queryByText('3. Pladser')).not.toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 1b: Run the test to verify it fails**

Run: `npx vitest run src/test/components/TournamentTeamStatistics.test.jsx`
Expected: FAIL — `Cannot find module '../../components/TournamentTeamStatistics'`

- [ ] **Step 2: Add `tournament.teamStats` keys to the locale files**

In `src/utils/locales/da.js`, inside the `"tournament"` object, add:

```js
    "teamStats": {
      "title": "Turnering Hold Statistikker",
      "noData": "Ingen hold data tilgængelig",
      "playGames": "Spil nogle turneringsspil for at se hold statistikker",
      "rank": "Placering",
      "teamName": "Hold Navn",
      "gamesPlayed": "Spil Spillet",
      "wins": "Sejre",
      "losses": "Nederlag",
      "winRate": "Sejrs Rate",
      "totalPoints": "Samlede Point",
      "totalTeams": "Samlede hold",
      "totalGamesTracked": "Samlede spil registreret",
      "ranking": "Rangering",
      "rankingMethod": "Efter samlede sejre, derefter sejrs rate"
    },
```

In `src/utils/locales/en.js`, add the equivalent:

```js
    "teamStats": {
      "title": "Tournament Team Statistics",
      "noData": "No team data available",
      "playGames": "Play some tournament games to see team statistics",
      "rank": "Rank",
      "teamName": "Team Name",
      "gamesPlayed": "Games Played",
      "wins": "Wins",
      "losses": "Losses",
      "winRate": "Win Rate",
      "totalPoints": "Total Points",
      "totalTeams": "Total teams",
      "totalGamesTracked": "Total games tracked",
      "ranking": "Ranking",
      "rankingMethod": "By total wins, then win rate"
    },
```

- [ ] **Step 3: Create `src/components/TournamentTeamStatistics.jsx`**

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { getTournamentTeamStatistics } from '../utils/tournamentUtils';
import SimpleAvatarWithHover from './SimpleAvatarWithHover';
import { getRankBasedAvatar } from '../utils/simpleAvatarUtils';

const TournamentTeamStatistics = ({ gameData }) => {
  const { t } = useTranslation();

  let teamStats = [];
  let dataError = null;

  try {
    teamStats = getTournamentTeamStatistics(gameData) || [];
  } catch (error) {
    console.error('Error loading tournament team statistics:', error);
    dataError = error.message;
  }

  if (dataError) {
    return (
      <div className="card">
        <div className="card-header bg-danger text-white">
          <h2>❌ {t('tournament.teamStats.title')}</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-danger">
            <strong>{t('common.error')}:</strong> {dataError}
          </div>
        </div>
      </div>
    );
  }

  if (!teamStats || teamStats.length === 0) {
    return (
      <div className="card">
        <div className="card-header bg-info text-white">
          <h2>👯 {t('tournament.teamStats.title')}</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-info">
            <h4>{t('tournament.teamStats.noData')}</h4>
            <p>{t('tournament.teamStats.playGames')}</p>
          </div>
        </div>
      </div>
    );
  }

  const getTeamRankingClass = (rank) => {
    if (rank === 1) return 'table-success';
    if (rank <= 3) return 'table-warning';
    return '';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}.`;
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h2>👯 {t('tournament.teamStats.title')}</h2>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <caption className="visually-hidden">{t('tournament.teamStats.title')}</caption>
            <thead className="table-dark">
              <tr>
                <th>{t('tournament.teamStats.rank')}</th>
                <th>{t('tournament.teamStats.teamName')}</th>
                <th>{t('tournament.teamStats.gamesPlayed')}</th>
                <th>{t('tournament.teamStats.wins')}</th>
                <th>{t('tournament.teamStats.losses')}</th>
                <th>{t('tournament.teamStats.winRate')}</th>
                <th>{t('tournament.teamStats.totalPoints')}</th>
              </tr>
            </thead>
            <tbody>
              {teamStats.map((team, index) => {
                const rank = index + 1;
                const players = team.players || [];
                const gamesPlayed = team.gamesPlayed || 0;
                const wins = team.wins || 0;
                const losses = team.losses || 0;
                const winRate = team.winRate || 0;
                const totalPoints = team.totalPoints || 0;

                return (
                  <tr key={`${players.join('-')}-${index}`} className={getTeamRankingClass(rank)}>
                    <td>
                      <strong>{getRankIcon(rank)}</strong>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        {players.map((player, playerIdx) => {
                          try {
                            const avatarRank = rank <= 3 ? 1 : rank <= 9 ? 2 : 4;
                            return (
                              <div key={`${player}-${playerIdx}`} className="d-flex align-items-center me-2">
                                <SimpleAvatarWithHover
                                  playerName={player}
                                  avatarSrc={getRankBasedAvatar(player, avatarRank)}
                                  size={24}
                                  className="me-1"
                                />
                                <span className="small">{player}</span>
                                {playerIdx < players.length - 1 && <span className="mx-1">&</span>}
                              </div>
                            );
                          } catch (error) {
                            console.error('Error rendering team player avatar:', error);
                            return (
                              <span key={`${player}-${playerIdx}`} className="me-2">
                                {player}
                                {playerIdx < players.length - 1 && ' & '}
                              </span>
                            );
                          }
                        })}
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-secondary">{gamesPlayed}</span>
                    </td>
                    <td>
                      <span className="badge bg-success">{wins}</span>
                    </td>
                    <td>
                      <span className="badge bg-danger">{losses}</span>
                    </td>
                    <td>
                      <span className={`badge ${winRate >= 50 ? 'bg-success' : 'bg-secondary'}`}>
                        {winRate.toFixed(1)}%
                      </span>
                    </td>
                    <td>
                      <strong className="text-primary">{totalPoints}</strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-3">
          <div className="row">
            <div className="col-md-6">
              <small className="text-muted">
                <strong>{t('tournament.teamStats.totalTeams')}:</strong> {teamStats.length} |
                <strong>{t('tournament.teamStats.totalGamesTracked')}:</strong> {teamStats.reduce((sum, team) => sum + (team.gamesPlayed || 0), 0)}
              </small>
            </div>
            <div className="col-md-6 text-end">
              <small className="text-muted">
                <strong>{t('tournament.teamStats.ranking')}:</strong> {t('tournament.teamStats.rankingMethod')}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TournamentTeamStatistics.propTypes = {
  gameData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TournamentTeamStatistics;
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/test/components/TournamentTeamStatistics.test.jsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/TournamentTeamStatistics.jsx src/test/components/TournamentTeamStatistics.test.jsx src/utils/locales/da.js src/utils/locales/en.js
git commit -m "feat: add TournamentTeamStatistics component"
```

---

### Task 8: TournamentGamesList

**Files:**
- Create: `src/components/TournamentGamesList.jsx`
- Test: `src/test/components/TournamentGamesList.test.jsx`
- Modify: `src/utils/locales/da.js`
- Modify: `src/utils/locales/en.js`

**Interfaces:**
- Consumes: `getTournamentGames` from `src/utils/tournamentUtils.js` (Task 1).
- Produces: `TournamentGamesList` default export, prop `gameData: PropTypes.arrayOf(PropTypes.object).isRequired`. Consumed by Task 9.

- [ ] **Step 1: Write the failing test**

Create `src/test/components/TournamentGamesList.test.jsx`:

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import i18n from '../../utils/i18n';
import TournamentGamesList from '../../components/TournamentGamesList';

const mockGetTournamentGames = vi.fn();
vi.mock('../../utils/tournamentUtils', () => ({
  getTournamentGames: (...args) => mockGetTournamentGames(...args)
}));

const renderWithProviders = (component) =>
  render(<ThemeProvider>{component}</ThemeProvider>);

const oneGame = [
  {
    gameId: 1,
    gameDate: '2026-07-15',
    teams: [
      { players: ['Jonas', 'Torben'], score: 2 },
      { players: ['Malene', 'Kurt'], score: 1 }
    ]
  }
];

describe('TournamentGamesList', () => {
  beforeEach(() => {
    i18n.changeLanguage('da');
  });

  describe('empty state', () => {
    beforeEach(() => {
      mockGetTournamentGames.mockReturnValue([]);
    });

    it('shows the no-games heading', () => {
      renderWithProviders(<TournamentGamesList gameData={[]} />);
      expect(screen.getByText('Ingen spil fundet')).toBeInTheDocument();
    });
  });

  describe('happy path', () => {
    beforeEach(() => {
      mockGetTournamentGames.mockReturnValue(oneGame);
    });

    it('displays both teams for the game', () => {
      renderWithProviders(<TournamentGamesList gameData={[]} />);
      expect(screen.getAllByText('Jonas & Torben').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Malene & Kurt').length).toBeGreaterThan(0);
    });

    it('does not show a 3rd-place label', () => {
      renderWithProviders(<TournamentGamesList gameData={[]} />);
      expect(screen.queryByText(/3\./)).not.toBeInTheDocument();
    });

    it('shows the winner label', () => {
      renderWithProviders(<TournamentGamesList gameData={[]} />);
      expect(screen.getAllByText(/Vinder/).length).toBeGreaterThan(0);
    });
  });
});
```

- [ ] **Step 1b: Run the test to verify it fails**

Run: `npx vitest run src/test/components/TournamentGamesList.test.jsx`
Expected: FAIL — `Cannot find module '../../components/TournamentGamesList'`

- [ ] **Step 2: Add `tournament.gamesList` keys to the locale files**

In `src/utils/locales/da.js`, inside the `"tournament"` object, add:

```js
    "gamesList": {
      "title": "Turnering Spil Historie",
      "winner": "Vinder",
      "points": {
        "win": "1. Plads",
        "loss": "2. Plads",
        "other": "point"
      },
      "gameNumber": "Spil {{number}}",
      "noGames": "Ingen spil fundet",
      "errorLoading": "Fejl ved indlæsning",
      "startPlaying": "Start med at spille nogle turneringsspil for at se historikken her!",
      "totalGames": "Samlede Spil",
      "latest": "Seneste",
      "place": "Plads",
      "showing": "Viser {{count}} spil",
      "unknownDate": "Ukendt Dato",
      "invalidDate": "Ugyldig Dato"
    }
```

In `src/utils/locales/en.js`, add the equivalent:

```js
    "gamesList": {
      "title": "Tournament Games History",
      "winner": "Winner",
      "points": {
        "win": "1st Place",
        "loss": "2nd Place",
        "other": "points"
      },
      "gameNumber": "Game {{number}}",
      "noGames": "No games found",
      "errorLoading": "Error loading",
      "startPlaying": "Start playing some tournament games to see the history here!",
      "totalGames": "Total Games",
      "latest": "Latest",
      "place": "Place",
      "showing": "Showing {{count}} games",
      "unknownDate": "Unknown Date",
      "invalidDate": "Invalid Date"
    }
```

Note: `gamesList` is the last key inside the `"tournament"` object in both files, so it has no trailing comma (matching whichever key from Task 3–7 currently sits last — reorder if needed so exactly one key has no trailing comma).

- [ ] **Step 3: Create `src/components/TournamentGamesList.jsx`**

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { getTournamentGames } from '../utils/tournamentUtils';

const TournamentGamesList = ({ gameData }) => {
  const { t, i18n } = useTranslation();
  let games = [];
  let dataError = null;

  try {
    const gamesData = getTournamentGames(gameData);
    if (gamesData && Array.isArray(gamesData)) {
      games = gamesData;
    } else {
      throw new Error('Invalid games data structure');
    }
  } catch (error) {
    console.error('Error in TournamentGamesList:', error);
    dataError = error.message;
  }

  const formatDate = (dateString) => {
    if (!dateString) return t('tournament.gamesList.unknownDate');
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(i18n.language, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return t('tournament.gamesList.invalidDate');
    }
  };

  // Only two outcomes per game: score 2 is the win, score 1 is the loss.
  const getPlaceInfo = (score) => {
    if (score === 2) return { place: t('tournament.gamesList.points.win'), emoji: '🥇', class: 'success' };
    if (score === 1) return { place: t('tournament.gamesList.points.loss'), emoji: '🥈', class: 'secondary' };
    return { place: '?', emoji: '❓', class: 'secondary' };
  };

  if (dataError) {
    return (
      <div className="card">
        <div className="card-header bg-danger text-white">
          <h2>❌ {t('tournament.gamesList.title')}</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-danger">
            <strong>{t('tournament.gamesList.errorLoading')}:</strong> {dataError}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header bg-success text-white">
        <h2>🎮 {t('tournament.gamesList.title')}</h2>
      </div>
      <div className="card-body">
        {games.length === 0 ? (
          <div className="alert alert-info">
            <h4>{t('tournament.gamesList.noGames')}</h4>
            <p>{t('tournament.gamesList.startPlaying')}</p>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <span className="badge bg-info me-2">
                {t('tournament.gamesList.totalGames')}: {games.length}
              </span>
              <span className="badge bg-secondary">
                {t('tournament.gamesList.latest')}: {formatDate(games[games.length - 1]?.gameDate)}
              </span>
            </div>

            <div className="row">
              {games.slice().reverse().map((game) => {
                const sortedTeams = [...game.teams].sort((a, b) => b.score - a.score);

                return (
                  <div key={game.gameId} className="col-lg-6 mb-4">
                    <div className="card h-100 border-primary">
                      <div className="card-header bg-primary text-white">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0">🎮 {t('tournament.gamesList.gameNumber', { number: game.gameId })}</h6>
                          <small>{formatDate(game.gameDate)}</small>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          {sortedTeams.map((team, index) => {
                            const placeInfo = getPlaceInfo(team.score);
                            return (
                              <div key={index} className="col-12 mb-3">
                                <div className={`card border-${placeInfo.class}`}>
                                  <div className={`card-header bg-${placeInfo.class} text-white py-2`}>
                                    <div className="d-flex justify-content-between align-items-center">
                                      <small>
                                        <strong>{placeInfo.emoji} {placeInfo.place}</strong>
                                      </small>
                                      <span className="badge bg-light text-dark">
                                        {team.score} {t('tournament.gamesList.points.other')}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="card-body py-2">
                                    <div className="text-center">
                                      <strong>{team.players.join(' & ')}</strong>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-2 pt-2 border-top">
                          <small className="text-muted">
                            <strong>{t('tournament.gamesList.winner')}:</strong> <span>{sortedTeams[0].players.join(' & ')}</span>
                            <span className="badge bg-success ms-2">{sortedTeams[0].score} {t('tournament.gamesList.points.other')}</span>
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {games.length > 10 && (
              <div className="mt-3">
                <small className="text-muted">
                  {t('tournament.gamesList.showing', { count: games.length })}
                </small>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

TournamentGamesList.propTypes = {
  gameData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TournamentGamesList;
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/test/components/TournamentGamesList.test.jsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/TournamentGamesList.jsx src/test/components/TournamentGamesList.test.jsx src/utils/locales/da.js src/utils/locales/en.js
git commit -m "feat: add TournamentGamesList component"
```

---

### Task 9: Wire the Tournament view into `App.jsx` and remove the placeholder

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/utils/locales/da.js`
- Modify: `src/utils/locales/en.js`
- Test: `src/test/integration/App.tournamentTab.test.jsx`

**Interfaces:**
- Consumes: `TournamentSummaryCards`, `TournamentLeaderboard`, `TournamentPlayerPerformance`, `TournamentGamesCalendar`, `TournamentTeamStatistics`, `TournamentGamesList` (Tasks 3–8); `VIEWS`, `ViewContext` (Task 2).

- [ ] **Step 1: Write the failing integration test**

Create `src/test/integration/App.tournamentTab.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import { ViewProvider } from '../../utils/ViewContext';
import { YearProvider } from '../../utils/YearContext';
import '../../utils/i18n';
import App from '../../App';

vi.mock('../../components/TournamentSummaryCards', () => ({
  default: () => <div data-testid="tournament-summary-cards">Tournament Summary Cards</div>
}));
vi.mock('../../components/TournamentLeaderboard', () => ({
  default: () => <div data-testid="tournament-leaderboard">Tournament Leaderboard</div>
}));
vi.mock('../../components/TournamentPlayerPerformance', () => ({
  default: () => <div data-testid="tournament-player-performance">Tournament Player Performance</div>
}));
vi.mock('../../components/TournamentGamesCalendar', () => ({
  default: () => <div data-testid="tournament-games-calendar">Tournament Games Calendar</div>
}));
vi.mock('../../components/TournamentTeamStatistics', () => ({
  default: () => <div data-testid="tournament-team-statistics">Tournament Team Statistics</div>
}));
vi.mock('../../components/TournamentGamesList', () => ({
  default: () => <div data-testid="tournament-games-list">Tournament Games List</div>
}));

const renderApp = () => render(
  <ThemeProvider>
    <ViewProvider>
      <YearProvider>
        <App />
      </YearProvider>
    </ViewProvider>
  </ThemeProvider>
);

describe('App — Summer Tournament tab', () => {
  it('shows the season content by default and hides tournament content', () => {
    renderApp();
    expect(screen.queryByTestId('tournament-leaderboard')).not.toBeInTheDocument();
  });

  it('shows the 6 tournament components after switching tabs, and hides the Year selector', () => {
    renderApp();
    fireEvent.click(screen.getByText('Sommerturnering'));

    expect(screen.getByTestId('tournament-summary-cards')).toBeInTheDocument();
    expect(screen.getByTestId('tournament-leaderboard')).toBeInTheDocument();
    expect(screen.getByTestId('tournament-player-performance')).toBeInTheDocument();
    expect(screen.getByTestId('tournament-games-calendar')).toBeInTheDocument();
    expect(screen.getByTestId('tournament-team-statistics')).toBeInTheDocument();
    expect(screen.getByTestId('tournament-games-list')).toBeInTheDocument();
    expect(screen.queryByText('2025')).not.toBeInTheDocument();
  });

  it('switching back to Season restores the season components', () => {
    renderApp();
    fireEvent.click(screen.getByText('Sommerturnering'));
    fireEvent.click(screen.getByText('Sæson'));

    expect(screen.queryByTestId('tournament-leaderboard')).not.toBeInTheDocument();
    expect(screen.getByText('2025')).toBeInTheDocument();
  });
});
```

- [ ] **Step 1b: Run the test to verify it fails**

Run: `npx vitest run src/test/integration/App.tournamentTab.test.jsx`
Expected: FAIL — clicking "Sommerturnering" only shows the coming-soon placeholder, so `tournament-summary-cards` etc. are never found.

- [ ] **Step 2: Replace the placeholder in `src/App.jsx` with the real Tournament components**

Add these imports alongside the existing `Simple*` imports:

```jsx
import TournamentSummaryCards from './components/TournamentSummaryCards';
import TournamentLeaderboard from './components/TournamentLeaderboard';
import TournamentPlayerPerformance from './components/TournamentPlayerPerformance';
import TournamentGamesCalendar from './components/TournamentGamesCalendar';
import TournamentTeamStatistics from './components/TournamentTeamStatistics';
import TournamentGamesList from './components/TournamentGamesList';
import tournamentData2026 from './data/tournament_summer_2026.json';
```

Change:

```jsx
        {activeView === VIEWS.TOURNAMENT ? (
          <div className="alert alert-info">
            <h4>{t('tournament.comingSoon.title')}</h4>
            <p>{t('tournament.comingSoon.message')}</p>
          </div>
        ) : (
```

to:

```jsx
        {activeView === VIEWS.TOURNAMENT ? (
          <>
            <ErrorBoundary name="TournamentSummaryCards">
              <TournamentSummaryCards gameData={tournamentData2026} />
            </ErrorBoundary>

            <div className="row">
              <div className="col-md-12">
                <ErrorBoundary name="TournamentLeaderboard">
                  <TournamentLeaderboard gameData={tournamentData2026} />
                </ErrorBoundary>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <ErrorBoundary name="TournamentPlayerPerformance">
                  <TournamentPlayerPerformance gameData={tournamentData2026} />
                </ErrorBoundary>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <ErrorBoundary name="TournamentGamesCalendar">
                  <TournamentGamesCalendar gameData={tournamentData2026} />
                </ErrorBoundary>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <ErrorBoundary name="TournamentTeamStatistics">
                  <TournamentTeamStatistics gameData={tournamentData2026} />
                </ErrorBoundary>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <ErrorBoundary name="TournamentGamesList">
                  <TournamentGamesList gameData={tournamentData2026} />
                </ErrorBoundary>
              </div>
            </div>
          </>
        ) : (
```

- [ ] **Step 3: Run the test to verify it passes**

Run: `npx vitest run src/test/integration/App.tournamentTab.test.jsx`
Expected: PASS (3 tests)

- [ ] **Step 4: Remove the now-unused `tournament.comingSoon` keys**

In `src/utils/locales/da.js`, remove the `"comingSoon": {...}` block (and its trailing comma) from inside the `"tournament"` object — it's no longer referenced anywhere. Do the same in `src/utils/locales/en.js`.

- [ ] **Step 5: Run the full test suite**

Run: `npm run test:run`
Expected: all tests pass — no orphaned i18n keys, no regressions in season tests, all 9 new component/integration test files green.

- [ ] **Step 6: Verify the production build succeeds**

Run: `npm run build`
Expected: build completes without errors.

- [ ] **Step 7: Manually verify in the dev server**

Run: `npm start`, open the app, click the "Summer Tournament" tab in the navbar, and confirm:
- The Year selector disappears.
- All 6 tournament sections render with an empty-state message (since `tournament_summer_2026.json` starts as `[]`).
- Clicking back to "Season" restores the original 2025/2026 view unchanged.

- [ ] **Step 8: Commit**

```bash
git add src/App.jsx src/utils/locales/da.js src/utils/locales/en.js src/test/integration/App.tournamentTab.test.jsx
git commit -m "feat: wire the 6 Tournament components into the Summer Tournament tab"
```

---

## Follow-ups (explicitly not part of this plan)

- Generate the actual Malene/Kurt avatar PNGs (`public/assets/malene/{happy,ok,sad}.png`, `public/assets/kurt/{happy,ok,sad}.png`) — existing TODO; the initials/color fallback covers the gap until then.
- Produce the one-off "suggested tournament plan" (round-robin fixture list) as a separate deliverable, used offline to decide match-ups. Not a live app feature.
- Add real games to `tournament_summer_2026.json` as they're played, following the same format documented for `games.json` in `docs/DATA_UPDATE.md` (4 players, scores 2/1 instead of 6 players, scores 3/2/1).
