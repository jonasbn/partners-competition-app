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

- [ ] **Five components have no dedicated test files**: `SimpleGamesCalendar`, `SimpleGamesList`, `SimplePlayerPerformance`, `SimpleTeamStatistics`, `SimpleAvatarWithHover`.

- [ ] **`src/test/utilities.test.js` reimplements `getPlayerAvatarPath` inline** instead of importing from `simpleAvatarUtils`. It calls the reimplemented version with two arguments, which the real function does not accept, so the tests are not exercising the actual code.

## Accessibility

- [ ] **Progress bars lack ARIA attributes** — `SimpleSummaryCards` and `SimplePlayerPerformance` render `<div class="progress-bar">` without `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, or `aria-valuemax`. Bootstrap requires these for screen reader support.

- [ ] **Data tables have no `<caption>`** — `SimpleLeaderboard` and `SimpleTeamStatistics` render `<table>` elements without a caption, which screen readers need to identify the table's purpose.

## Architecture / Maintainability

- [ ] **Date formatting is locale-independent** — `formatDate` in `SimpleGamesCalendar` and `SimpleGamesList` hardcodes `dd/mm/yyyy`. It should use `toLocaleDateString` with the active i18n locale or a locale-aware format string.

- [ ] **`TournamentChampion2025` is year-specific** — when a future tournament concludes, a new component would need to be created by hand. A single generic `TournamentChampion` component parameterised by year would avoid this.

## Documentation

Findings from a documentation review on 2026-06-12.

### Security

- [ ] **`docs/LOGGING.md` contains the Logtail ingestion token in plain text** (line 7) — `gDcpojWzsEzzJVpXTyjAFsPF` is committed verbatim. Remove it from the file and rotate the token.

### Accuracy

- [ ] **Root `README.md` is entirely CRA boilerplate** — describes none of the actual project, references `npm run eject` (Vite project), and describes `npm test` as interactive watch mode. Replace with a project-specific README covering what the app does, commands, and how to deploy.

- [ ] **`docs/README.md` lists wrong versions** — states React 19.2.0 and Vite 6.4.1; actual versions per `package.json` are React 18.3.1 and Vite 8.x. Also lists `@nivo` as a dependency, which was removed.

- [ ] **`docs/README.md` index is incomplete** — `TODO.md` and `security-review-baseline-2026-06-12.md` are not listed.

- [ ] **`docs/LOGGING.md` references outdated filenames** — lists `App.js`, `ThemeToggle.js`, `AvatarWithHover.js`, `GamesList.js`; actual names are `App.jsx`, `SimpleThemeToggle.jsx`, `SimpleAvatarWithHover.jsx`, `SimpleGamesList.jsx`.

- [ ] **`docs/Z_INDEX_DOCUMENTATION.md` references outdated filenames throughout** — `AvatarWithHover.js`, `GamesList.js`, `SummaryCards.js` should be `SimpleAvatarWithHover.jsx`, `SimpleGamesList.jsx`, `SimpleSummaryCards.jsx`. Also contains a dangling code block and references z-index `10015` without defining it in the hierarchy.

- [ ] **`docs/TESTING.md` has minor inaccuracies** — describes `npm test` as watch mode; advises skipping @nivo tests (library was removed); example code calls `getPlayerAvatarPath` with two arguments but the function only accepts one.

### Obsolete documents

- [ ] **`docs/DEPLOYMENT.md`** — documents the @nivo white-page incident, which is resolved. References components that no longer exist (`ChartErrorBoundary.jsx`, `RobustCalendarChart.jsx`, `LazyCharts.jsx`). Archive or convert to an ADR.

- [ ] **`docs/DEPLOYMENT_FINAL.md`** — documents the resolution of the same @nivo incident. References non-existent components. Archive or convert to an ADR.

- [ ] **`docs/EMERGENCY_FIX.md`** — run-book for a resolved incident. Misleads readers into thinking the app is unstable and that committing `build/` is normal practice. Remove or archive.

- [ ] **`docs/TESTING_EVALUATION.md`** — recommends migrating test files that are already migrated. Content is superseded by current state. Review and either update to reflect current state or remove.

### Missing SDLC documentation

- [ ] **No project README** — replace the CRA boilerplate with a README covering: what "partners" is, who the players are, the scoring rules, how to run locally, how to deploy, and how to add a new year of data.

- [ ] **No deployment guide** — no document describes how to deploy to Digital Ocean App Platform (build command, env vars to set, how to trigger a deploy).

- [ ] **No data update guide** — adding a new game result or a new tournament year requires code changes; this process is not documented anywhere.

- [ ] **No contributing guide** — no PR conventions, branch strategy, commit style, or review process documented.
