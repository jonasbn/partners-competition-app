# TODO

Improvements identified from a codebase review on 2026-06-12.

## Bugs

- [x] **Wrong total-games calculation in `SimpleLeaderboard`** (`src/components/SimpleLeaderboard.jsx:164`) — footer divides the sum of all player `gamesPlayed` by 2, but there are 6 players per game, so it inflates the count by 3×. Should divide by 6 or use `leaderboardData.games.length` directly (already available from `getLeaderboardData`).

- [x] **`SimpleGamesCalendar` uses wrong i18n namespace** (`src/components/SimpleGamesCalendar.jsx:28,43,44`) — error and empty-state messages call `t('gamesList.errorLoading')`, `t('gamesList.noGames')`, and `t('gamesList.startPlaying')`, which belong to the `gamesList` component. These should use `gamesCalendar.*` keys.

- [x] **Team avatar logic doesn't match spec** (`src/components/SimpleTeamStatistics.jsx:108`) — the component maps rank ≤ 3 → happy, rank ≥ 4 → sad. The spec requires: happy (1st–3rd), neutral (4th–9th), sad (10th+). `getRankBasedAvatar` also treats rank 4+ as sad regardless, so it cannot express the neutral range for team standings.

## Code Quality

- [ ] **36 debug `console.log` calls in production code** — scattered across `SimpleLeaderboard`, `SimpleTeamStatistics`, `SimpleSummaryCards`, `SimplePlayerPerformance`, `SimpleAvatarWithHover`, `SimpleGamesCalendar`, `SimpleThemeToggle`, and `simpleAvatarUtils.js`. Remove or route through the `Logger` utility.

- [ ] **`processGamesData` called 3× per render in `SimpleSummaryCards`** — `getLeaderboardData`, `getGames`, and `getTeamStatistics` each independently call `processGamesData`, resulting in three full passes through the game data per render. The component should call `processGamesData` once and derive all three results, or the utilities should accept pre-processed data.

- [ ] **`TournamentChampion2025` has a redundant `getGames` call** (`src/components/TournamentChampion2025.jsx:14`) — `getLeaderboardData` already returns `{ players, games }`, so the separate `getGames` call triggers a second `processGamesData` pass unnecessarily.

- [ ] **Player roster hardcoded in two places** in `dataUtils.js` — the 6-player array appears once in `processGamesData` (lines 13–21) and again as `allPlayers` in `getTeamCombinationStatistics` (line 162). Extract to a single exported constant.

- [ ] **`getPerformanceBasedAvatar` is a deprecated no-op** (`src/utils/simpleAvatarUtils.js:128`) — only fires a `console.warn` then delegates to `getRankBasedAvatar`. Remove it along with any test references.

- [ ] **`leaderboard.json` is dead code** (`src/data/leaderboard.json`) — contains zeroed-out player data and is never imported anywhere.

- [ ] **`summary.*` i18n namespace is orphaned** — both locale files define a `summary` top-level namespace (`leadingPlayer`, `mostWinningTeam`, `teamCoverage`, etc.) that no component uses; components use `summaryCards.*` instead. These keys are only referenced in two test files. Rename to match component usage or remove.

- [ ] **No ESLint configuration** — the quality CI workflow already acknowledges the gap. Adding `eslint` with `eslint-plugin-react` and `eslint-plugin-react-hooks` would catch most of the issues above automatically.

## Test Coverage

- [x] **Five components have no dedicated test files**: `SimpleGamesCalendar` ✓ (PR #144), `SimpleGamesList` ✓, `SimplePlayerPerformance` ✓, `SimpleTeamStatistics` ✓ (PR #144), `SimpleAvatarWithHover` ✓.

- [x] **`src/test/utilities.test.js` reimplements `getPlayerAvatarPath` inline** instead of importing from `simpleAvatarUtils`. It calls the reimplemented version with two arguments, which the real function does not accept, so the tests are not exercising the actual code.

- [ ] **i18n language not pinned in component test files** (`src/test/components/SimpleGamesList.test.jsx`, `src/test/components/SimplePlayerPerformance.test.jsx`) — tests assert Danish strings but never explicitly set the language. If another test file changes the shared i18n instance's language first, these tests become order-dependent and may fail. Add `beforeEach(() => i18n.changeLanguage('da'))` to each file.

- [ ] **`console.log` noise in `utilities.test.js`** — `getPlayerAvatarPath` emits `console.log` for both valid and invalid inputs, so the test suite produces noisy output during `vitest run`. Stub `console.log` in a `beforeEach` in that file (similar to how `console.error` is stubbed elsewhere).

## Accessibility

- [ ] **Progress bars lack ARIA attributes** — `SimpleSummaryCards` and `SimplePlayerPerformance` render `<div class="progress-bar">` without `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, or `aria-valuemax`. Bootstrap requires these for screen reader support.

- [ ] **Data tables have no `<caption>`** — `SimpleLeaderboard` and `SimpleTeamStatistics` render `<table>` elements without a caption, which screen readers need to identify the table's purpose.

## Architecture / Maintainability

- [ ] **Date formatting is locale-independent** — `formatDate` in `SimpleGamesCalendar` and `SimpleGamesList` hardcodes `dd/mm/yyyy`. It should use `toLocaleDateString` with the active i18n locale or a locale-aware format string.

- [ ] **`TournamentChampion2025` is year-specific** — when a future tournament concludes, a new component would need to be created by hand. A single generic `TournamentChampion` component parameterised by year would avoid this.

## Documentation

Findings from a documentation review on 2026-06-12.

### Security

- [x] **`docs/LOGGING.md` contains the Logtail ingestion token in plain text** (line 7) — `gDcpojWzsEzzJVpXTyjAFsPF` is committed verbatim. Removed from file. **Token rotation requires manual action on the BetterStack dashboard.**

### Accuracy

- [x] **Root `README.md` is entirely CRA boilerplate** — replaced with a project-specific README covering what the app does, commands, and how to deploy.

- [x] **`docs/README.md` lists wrong versions** — updated to React 18.3.1 and Vite 8.0.14; removed @nivo reference.

- [x] **`docs/README.md` index is incomplete** — added `TODO.md` and `security-review-baseline-2026-06-12.md` to index.

- [x] **`docs/LOGGING.md` references outdated filenames** — updated to `App.jsx`, `SimpleThemeToggle.jsx`, `SimpleAvatarWithHover.jsx`, `SimpleGamesList.jsx`.

- [x] **`docs/Z_INDEX_DOCUMENTATION.md` references outdated filenames throughout** — updated to `SimpleAvatarWithHover.jsx`, `SimpleGamesList.jsx`, `SimpleSummaryCards.jsx`. Removed dangling code block and undefined z-index 10015 references.

- [x] **`docs/TESTING.md` has minor inaccuracies** — rewrote to reflect current test setup: `npm test` runs once, @nivo advice removed, `getPlayerAvatarPath` example uses single argument.

### Obsolete documents

- [x] **`docs/DEPLOYMENT.md`** — archived to `docs/archive/DEPLOYMENT.md`.

- [x] **`docs/DEPLOYMENT_FINAL.md`** — archived to `docs/archive/DEPLOYMENT_FINAL.md`.

- [x] **`docs/EMERGENCY_FIX.md`** — archived to `docs/archive/EMERGENCY_FIX.md`.

- [x] **`docs/TESTING_EVALUATION.md`** — archived to `docs/archive/TESTING_EVALUATION.md`.

### Missing SDLC documentation

- [x] **No project README** — replaced CRA boilerplate with a project-specific `README.md`.

- [x] **No deployment guide** — created `docs/DEPLOYMENT_GUIDE.md`.

- [x] **No data update guide** — created `docs/DATA_UPDATE.md`.

- [x] **No contributing guide** — created `docs/CONTRIBUTING.md`.
