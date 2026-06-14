# TODO Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Address all outstanding code quality, test, accessibility, dark mode, and architecture issues listed in `docs/TODO.md`.

**Architecture:** Changes are spread across CSS, components, utilities, test files, and config — each task is independent and self-contained. No new dependencies are required except for the ESLint task.

**Tech Stack:** React 18, Vite, Bootstrap 5, i18next (with flat `translation` namespace), Vitest/Testing Library

---

## Excluded (out of scope for this plan)

- **`TournamentChampion2025` generalise to a year-agnostic component** — future-proofing refactor with no immediate functional benefit; revisit when a second tournament component is needed.

---

## File Map

| File | Change |
|---|---|
| `src/data/leaderboard.json` | **Delete** |
| `src/utils/simpleAvatarUtils.js` | Remove `getPerformanceBasedAvatar`, remove all `console.log` calls |
| `src/utils/dataUtils.js` | Extract `PLAYERS` constant, remove redundant `processGamesData` call in `TournamentChampion2025` |
| `src/utils/locales/da.js` | Delete `"summary"` block (lines 18–41) |
| `src/utils/locales/en.js` | Delete `"summary"` block (lines 18–41) |
| `src/components/SimpleSummaryCards.jsx` | Call `processGamesData` once; add ARIA to progress bars; remove console.log |
| `src/components/SimplePlayerPerformance.jsx` | Remove console.logs; add ARIA to progress bars |
| `src/components/SimpleLeaderboard.jsx` | Remove console.logs; add `<caption>` to table |
| `src/components/SimpleTeamStatistics.jsx` | Remove console.logs; add `<caption>` to table |
| `src/components/SimpleThemeToggle.jsx` | Remove console.logs |
| `src/components/SimpleAvatarWithHover.jsx` | Remove console.logs |
| `src/components/SimpleGamesCalendar.jsx` | Remove console.logs; locale-aware `formatDate` |
| `src/components/SimpleGamesList.jsx` | Locale-aware `formatDate` |
| `src/components/TournamentChampion2025.jsx` | Remove redundant `getGames` call |
| `src/App.css` | Add Bootstrap 5 CSS-variable overrides for dark mode |
| `src/test/components/SimpleGamesList.test.jsx` | Pin `i18n.changeLanguage('da')` in top-level `beforeEach` |
| `src/test/components/SimplePlayerPerformance.test.jsx` | Pin `i18n.changeLanguage('da')` in top-level `beforeEach` |
| `src/test/utilities.test.js` | Stub `console.log` in `beforeEach` |
| `src/test/i18n/i18n.test.js` | Replace `summary.mostWinningTeam.stats` test with an equivalent `summaryCards` key |
| `src/test/i18n/translation-integration.test.jsx` | Remove / update `summary.*` references |
| `eslint.config.js` | **Create** |
| `.github/workflows/quality.yml` (or equivalent) | Add `npm run lint` step that fails the build |

---

## Task 1: Remove Dead Code

**Files:**
- Delete: `src/data/leaderboard.json`
- Modify: `src/utils/simpleAvatarUtils.js` (lines 127–131)
- Modify: `src/utils/locales/da.js` (lines 18–41)
- Modify: `src/utils/locales/en.js` (lines 18–41)
- Modify: `src/test/i18n/i18n.test.js` (~line 80)
- Modify: `src/test/i18n/translation-integration.test.jsx` (~line 158)

- [ ] **Step 1: Delete leaderboard.json**

```bash
rm src/data/leaderboard.json
```

Verify no file imports it:

```bash
grep -rn "leaderboard.json" src/
```

Expected: no output.

- [ ] **Step 2: Remove `getPerformanceBasedAvatar` from simpleAvatarUtils.js**

Delete these 4 lines at the bottom of `src/utils/simpleAvatarUtils.js`:

```js
// Legacy function for backward compatibility (now uses ranking)
export const getPerformanceBasedAvatar = (playerName, playerStats, rank) => {
  console.warn('getPerformanceBasedAvatar is deprecated, use getRankBasedAvatar instead');
  return getRankBasedAvatar(playerName, rank);
};
```

Verify nothing imports it:

```bash
grep -rn "getPerformanceBasedAvatar" src/
```

Expected: no output.

- [ ] **Step 3: Remove `"summary"` block from da.js**

In `src/utils/locales/da.js`, delete the entire `"summary"` object (lines 18–41, from `"summary": {` through the closing `},`). The file should jump directly from the `"yearSelector"` block to the `"theme"` block.

- [ ] **Step 4: Remove `"summary"` block from en.js**

Same deletion in `src/utils/locales/en.js` — delete lines 18–41.

- [ ] **Step 5: Update i18n.test.js to remove summary.* reference**

In `src/test/i18n/i18n.test.js`, find the test that uses `summary.mostWinningTeam.stats` (around line 80) and replace it with an equivalent test using an existing key. Use `leaderboard.title`:

```js
it('should handle interpolation', () => {
  i18n.changeLanguage('en');
  const result = i18n.t('leaderboard.title');
  expect(result).toBe('Leaderboard');
});
```

- [ ] **Step 6: Update translation-integration.test.jsx to remove summary.* reference**

In `src/test/i18n/translation-integration.test.jsx`, find the reference to `t('summary.mostWinningTeam.stats', ...)` (around line 158). Replace the JSX in that test with a different key — for example `t('summaryCards.bestTeam.title')` — and update the assertion to match the correct translated string (`'Bedste Hold'` in Danish or `'Best Team'` in English depending on the test's language context).

- [ ] **Step 7: Run tests**

```bash
npm run test:run
```

Expected: all tests pass.

- [ ] **Step 8: Commit**

```bash
git add src/data/leaderboard.json src/utils/simpleAvatarUtils.js src/utils/locales/da.js src/utils/locales/en.js src/test/i18n/i18n.test.js src/test/i18n/translation-integration.test.jsx
git commit -m "chore: remove dead code — leaderboard.json, deprecated avatar fn, orphaned summary i18n namespace"
```

---

## Task 2: Remove Debug console.log Statements

**Files:**
- Modify: `src/utils/simpleAvatarUtils.js`
- Modify: `src/components/SimpleAvatarWithHover.jsx`
- Modify: `src/components/SimplePlayerPerformance.jsx`
- Modify: `src/components/SimpleLeaderboard.jsx`
- Modify: `src/components/SimpleThemeToggle.jsx`
- Modify: `src/components/SimpleSummaryCards.jsx`
- Modify: `src/components/SimpleGamesCalendar.jsx`
- Modify: `src/components/SimpleTeamStatistics.jsx`

Remove every `console.log(...)` call listed below. Do **not** remove `console.error(...)` calls — those are legitimate error reporting.

- [ ] **Step 1: Remove console.logs from simpleAvatarUtils.js**

Delete these 6 lines (lines 23, 28, 42, 49, 102, 108, 113, 118 — every `console.log` in the file):

```js
console.log('Invalid player name:', playerName);
console.log('Getting avatar for player:', normalizedName);
console.log('No avatar directory found for player:', normalizedName);
console.log('Avatar path for', playerName, ':', avatarPath);
console.log(`Getting rank-based avatar for ${playerName} at rank ${rank}`);
console.log(`Rank 1 (${playerName}): Using happy avatar`);
console.log(`Rank ${rank} (${playerName}): Using ok avatar`);
console.log(`Rank ${rank} (${playerName}): Using sad avatar`);
```

- [ ] **Step 2: Remove console.logs from SimpleAvatarWithHover.jsx**

Delete these 4 lines (lines 14, 36, 97, 215):

```js
console.log('SimpleAvatarWithHover rendering for:', playerName);
console.log('Avatar hover:', playerName);
console.log('Avatar clicked:', playerName);
console.log('Avatar image failed to load for:', playerName, 'src:', avatarSrc);
```

- [ ] **Step 3: Remove console.logs from SimplePlayerPerformance.jsx**

Delete these 3 lines (lines 8, 17, 18):

```js
console.log('SimplePlayerPerformance rendering...');
console.log('Player performance data loaded:', players.length, 'players');
console.log('Sample player data:', players[0]); // Debug: show first player's data
```

- [ ] **Step 4: Remove console.logs from SimpleLeaderboard.jsx**

Delete these 4 lines (lines 10, 18, 22, 116):

```js
console.log('SimpleLeaderboard rendering...');
console.log('Leaderboard data received:', leaderboardData);
console.log('Players loaded:', players.length);
console.log('Avatar for', name, 'at rank', currentRank, ':', avatarSrc);
```

- [ ] **Step 5: Remove console.logs from SimpleThemeToggle.jsx**

Delete these 2 lines (lines 7, 21):

```js
console.log('SimpleThemeToggle rendering...');
console.log('Theme toggle clicked - switching to:', newTheme);
```

- [ ] **Step 6: Remove console.logs from SimpleSummaryCards.jsx**

Delete this 1 line (line 9):

```js
console.log('SimpleSummaryCards rendering...');
```

- [ ] **Step 7: Remove console.logs from SimpleGamesCalendar.jsx**

Delete these 2 lines (lines 7, 14):

```js
console.log('SimpleGamesCalendar rendering...');
console.log('Games calendar data loaded:', games.length, 'games');
```

- [ ] **Step 8: Remove console.logs from SimpleTeamStatistics.jsx**

Delete these 2 lines (lines 8, 16):

```js
console.log('SimpleTeamStatistics rendering...');
console.log('Team statistics loaded:', teamStats.length, 'teams');
```

- [ ] **Step 9: Run tests**

```bash
npm run test:run
```

Expected: all tests pass.

- [ ] **Step 10: Commit**

```bash
git add src/utils/simpleAvatarUtils.js src/components/SimpleAvatarWithHover.jsx src/components/SimplePlayerPerformance.jsx src/components/SimpleLeaderboard.jsx src/components/SimpleThemeToggle.jsx src/components/SimpleSummaryCards.jsx src/components/SimpleGamesCalendar.jsx src/components/SimpleTeamStatistics.jsx
git commit -m "chore: remove debug console.log statements from production code"
```

---

## Task 3: Fix Test Quality — i18n Pinning and console.log Noise

**Files:**
- Modify: `src/test/components/SimpleGamesList.test.jsx`
- Modify: `src/test/components/SimplePlayerPerformance.test.jsx`
- Modify: `src/test/utilities.test.js`

- [ ] **Step 1: Write failing tests to demonstrate the problem**

Run the test files to see the current console.log noise:

```bash
npx vitest run src/test/utilities.test.js 2>&1 | head -30
```

You should see `console.log` output lines (avatar path strings) mixed into the test output.

- [ ] **Step 2: Add i18n language import and top-level beforeEach to SimpleGamesList.test.jsx**

At the top of `src/test/components/SimpleGamesList.test.jsx`, add:

```js
import i18n from '../../utils/i18n';
```

Then, directly inside the outermost `describe` block (before the nested `describe` blocks), add:

```js
beforeEach(() => {
  i18n.changeLanguage('da');
});
```

- [ ] **Step 3: Add i18n language import and top-level beforeEach to SimplePlayerPerformance.test.jsx**

Identical change in `src/test/components/SimplePlayerPerformance.test.jsx`:

```js
import i18n from '../../utils/i18n';
```

And inside the outermost `describe` block:

```js
beforeEach(() => {
  i18n.changeLanguage('da');
});
```

- [ ] **Step 4: Stub console.log in utilities.test.js**

In `src/test/utilities.test.js`, add an import for `vi` and add a `beforeEach` that silences `console.log`. Add this at the top of the file (alongside existing imports) and inside the outermost `describe`:

```js
import { describe, it, expect, vi, beforeEach } from 'vitest';
```

Then inside `describe('simpleAvatarUtils', () => {`, add at the top:

```js
beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
});
```

- [ ] **Step 5: Run tests**

```bash
npm run test:run
```

Expected: all tests pass, and `npx vitest run src/test/utilities.test.js` produces no console.log noise.

- [ ] **Step 6: Commit**

```bash
git add src/test/components/SimpleGamesList.test.jsx src/test/components/SimplePlayerPerformance.test.jsx src/test/utilities.test.js
git commit -m "test: pin i18n language in component tests; suppress console.log noise in utilities test"
```

---

## Task 4: Fix Data Processing Redundancy

**Files:**
- Modify: `src/utils/dataUtils.js` (lines 13–21, 162)
- Modify: `src/components/SimpleSummaryCards.jsx` (lines 17–20)
- Modify: `src/components/TournamentChampion2025.jsx` (line 14)

- [ ] **Step 1: Extract PLAYERS constant in dataUtils.js**

At the top of `src/utils/dataUtils.js`, after the imports (before `processGamesData`), add:

```js
export const PLAYERS = [
  { id: 1, name: 'Jonas' },
  { id: 2, name: 'Torben' },
  { id: 3, name: 'Gitte' },
  { id: 4, name: 'Anette' },
  { id: 5, name: 'Lotte' },
  { id: 6, name: 'Peter' },
];
```

Then update `processGamesData` to initialize from `PLAYERS`:

```js
const players = PLAYERS.map(p => ({ ...p, cumulativeScore: 0, games: [] }));
```

And update `getTeamCombinationStatistics` (around line 162) to replace the local `allPlayers` array:

```js
// Replace:
const allPlayers = ['Jonas', 'Torben', 'Gitte', 'Anette', 'Lotte', 'Peter'];
// With:
const allPlayers = PLAYERS.map(p => p.name);
```

Also add `PLAYERS` to the exports at the bottom of the file.

- [ ] **Step 2: Run tests to confirm nothing broke**

```bash
npm run test:run
```

Expected: all tests pass.

- [ ] **Step 3: Fix SimpleSummaryCards to call processGamesData once**

In `src/components/SimpleSummaryCards.jsx`, update the imports and data-loading block:

```js
import { processGamesData } from '../utils/dataUtils';
```

Replace the three separate calls (lines 17–20):

```js
// Remove:
const leaderboardData = getLeaderboardData(gameData);
players = leaderboardData?.players || [];
games = getGames(gameData) || [];
teamStats = getTeamStatistics(gameData) || [];

// Replace with:
const processed = processGamesData(gameData);
players = processed.players || [];
games = processed.games || [];
teamStats = processed.teamStats || [];
```

Check that `processGamesData` returns `teamStats` — if it only returns `{ players, games }`, keep using `getTeamStatistics(gameData)` for that one. Read lines 92–115 of `dataUtils.js` to verify the return shape before changing:

```bash
sed -n '85,120p' src/utils/dataUtils.js
```

If `processGamesData` does not return `teamStats`, the fix is to keep `getTeamStatistics` but pass the already-processed data into it — or simply call `processGamesData` once and assign `{ players, games }` from it, and call `getTeamStatistics` only for `teamStats` (saving 2 of the 3 redundant passes).

- [ ] **Step 4: Fix TournamentChampion2025 redundant getGames call**

In `src/components/TournamentChampion2025.jsx`, line 14, replace:

```js
const games = leaderboardData.games || getGames(gameData);
```

With:

```js
const games = leaderboardData.games;
```

Remove the `getGames` import if it is no longer used anywhere else in that file.

- [ ] **Step 5: Run tests**

```bash
npm run test:run
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/utils/dataUtils.js src/components/SimpleSummaryCards.jsx src/components/TournamentChampion2025.jsx
git commit -m "refactor: extract PLAYERS constant; reduce redundant processGamesData calls"
```

---

## Task 5: Accessibility — ARIA Attributes and Table Captions

**Files:**
- Modify: `src/components/SimpleSummaryCards.jsx` (lines 91–95, 193–196)
- Modify: `src/components/SimplePlayerPerformance.jsx` (lines 113–115, 139–141)
- Modify: `src/components/SimpleLeaderboard.jsx` (table at line 84)
- Modify: `src/components/SimpleTeamStatistics.jsx` (table at line 74)

Bootstrap requires `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` on each `.progress-bar` element for screen reader support.

- [ ] **Step 1: Add ARIA to progress bar in SimpleSummaryCards — score bar**

Find the progress bar div at line 93 and update it:

```jsx
// Before:
<div
  className="progress-bar bg-success"
  style={{ width: `${scorePercentage}%` }}
/>

// After:
<div
  className="progress-bar bg-success"
  role="progressbar"
  style={{ width: `${scorePercentage}%` }}
  aria-valuenow={scorePercentage}
  aria-valuemin={0}
  aria-valuemax={100}
/>
```

- [ ] **Step 2: Add ARIA to progress bar in SimpleSummaryCards — combinations bar**

Same update for the combinations progress bar (around line 195):

```jsx
<div
  className="progress-bar bg-info"
  role="progressbar"
  style={{ width: `${completionPercentage}%` }}
  aria-valuenow={completionPercentage}
  aria-valuemin={0}
  aria-valuemax={100}
/>
```

- [ ] **Step 3: Add ARIA to progress bars in SimplePlayerPerformance.jsx**

Read lines 110–145 of `src/components/SimplePlayerPerformance.jsx` to see the two progress bars. For each, add `role="progressbar"`, `aria-valuenow`, `aria-valuemin={0}`, `aria-valuemax={100}`. The `aria-valuenow` value should match the numeric value driving `width` (e.g., if `style={{ width: \`${performance.value}%\` }}`, use `aria-valuenow={performance.value}`).

- [ ] **Step 4: Add caption to SimpleLeaderboard table**

In `src/components/SimpleLeaderboard.jsx`, find the `<table>` opening tag (line 84) and add a caption immediately after it:

```jsx
<table className="table table-striped table-hover">
  <caption className="visually-hidden">{t('leaderboard.title')}</caption>
  ...
```

`visually-hidden` is a Bootstrap utility that hides the caption visually while keeping it accessible to screen readers.

- [ ] **Step 5: Add caption to SimpleTeamStatistics table**

Same pattern in `src/components/SimpleTeamStatistics.jsx` (table at line 74):

```jsx
<table className="table table-striped table-hover">
  <caption className="visually-hidden">{t('teamStatistics.title')}</caption>
  ...
```

- [ ] **Step 6: Run tests**

```bash
npm run test:run
```

Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/components/SimpleSummaryCards.jsx src/components/SimplePlayerPerformance.jsx src/components/SimpleLeaderboard.jsx src/components/SimpleTeamStatistics.jsx
git commit -m "feat: add ARIA attributes to progress bars and captions to data tables"
```

---

## Task 6: Dark Mode Fixes

**Files:**
- Modify: `src/App.css`

The existing dark mode CSS uses custom `--card-bg`, `--text-color` variables on `body.dark-theme`. Bootstrap 5 components use their own `--bs-*` variables which don't automatically pick up these custom values. The fix is to override the Bootstrap 5 CSS variables inside `body.dark-theme`.

The four affected sections are: Leaderboard, Performance Insights, Activity Timeline (calendar), and Team Statistics.

- [ ] **Step 1: Start the dev server**

```bash
npm start
```

Open the app in a browser and switch to dark mode using the theme toggle. Identify which elements look too light (white table backgrounds, light-grey progress bars, etc.).

- [ ] **Step 2: Add Bootstrap 5 variable overrides to body.dark-theme in App.css**

Inside `body.dark-theme { ... }` (around line 170), append these Bootstrap 5 variable overrides:

```css
body.dark-theme {
  /* existing variables unchanged ... */

  /* Bootstrap 5 component variable overrides */
  --bs-body-bg: #121212;
  --bs-body-color: #f8f9fa;
  --bs-card-bg: #1e1e1e;
  --bs-card-border-color: #2d2d2d;
  --bs-table-bg: transparent;
  --bs-table-color: #f8f9fa;
  --bs-table-striped-bg: rgba(255, 255, 255, 0.05);
  --bs-table-striped-color: #f8f9fa;
  --bs-table-hover-bg: rgba(255, 255, 255, 0.075);
  --bs-table-hover-color: #f8f9fa;
  --bs-table-border-color: #3d3d3d;
  --bs-progress-bg: #2d2d2d;
  --bs-list-group-bg: #1e1e1e;
  --bs-list-group-border-color: #2d2d2d;
  --bs-list-group-color: #f8f9fa;
  --bs-list-group-action-hover-bg: rgba(255, 255, 255, 0.1);
}
```

- [ ] **Step 3: Verify visually in the browser**

With the dev server still running, reload and toggle to dark mode. Check each of the four named sections:

- **Leaderboard** (`SimpleLeaderboard`): table rows should have dark background
- **Performance Insights** (`SimplePlayerPerformance`): progress bars should render against dark background; scores/names should be readable
- **Activity Levels / Recent Activity** (`SimpleGamesCalendar`): activity timeline and recent games table should be dark
- **Team Statistics** (`SimpleTeamStatistics`): table rows should have dark background

If any section still looks wrong, add targeted rules. Common follow-up fixes:

```css
/* If table cells still show white background */
.dark-theme .table td,
.dark-theme .table th {
  background-color: transparent;
  color: var(--text-color);
}

/* If progress bar container (not fill) looks too light */
.dark-theme .progress {
  background-color: var(--bs-progress-bg);
}
```

- [ ] **Step 4: Run tests**

```bash
npm run test:run
```

Expected: all tests pass (no CSS-related test regressions).

- [ ] **Step 5: Commit**

```bash
git add src/App.css
git commit -m "fix: dark mode — override Bootstrap 5 CSS variables for table, card, progress, and list-group components"
```

---

## Task 7: Locale-Aware Date Formatting

**Files:**
- Modify: `src/components/SimpleGamesCalendar.jsx` (line 68)
- Modify: `src/components/SimpleGamesList.jsx` (line 22)

Both components hardcode `dd/mm/yyyy` formatting. They should use the active i18n language so that English users see the locale-appropriate format.

- [ ] **Step 1: Update formatDate in SimpleGamesCalendar.jsx**

Change the `useTranslation` destructure to also get `i18n`:

```js
const { t, i18n } = useTranslation();
```

Then replace the `formatDate` function body (around line 68):

```js
// Before:
const formatDate = (dateStr) => {
  try {
    const date = new Date(dateStr);
    // Use simple dd/mm/yyyy format that works for both Danish and English
    ...
  }
};

// After:
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
```

- [ ] **Step 2: Update formatDate in SimpleGamesList.jsx**

Same change — add `i18n` to the `useTranslation` destructure and update `formatDate` (line 22):

```js
const { t, i18n } = useTranslation();

const formatDate = (dateString) => {
  if (!dateString) return t('gamesList.unknownDate');
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return t('gamesList.invalidDate');
  }
};
```

- [ ] **Step 3: Run tests**

```bash
npm run test:run
```

If any test asserts the exact date format string (e.g. `"25/06/2025"`), update it to call `new Date('2025-06-25').toLocaleDateString('da', { day: '2-digit', month: '2-digit', year: 'numeric' })` as the expected value, so the test is also locale-aware.

- [ ] **Step 4: Commit**

```bash
git add src/components/SimpleGamesCalendar.jsx src/components/SimpleGamesList.jsx
git commit -m "feat: use locale-aware date formatting via toLocaleDateString"
```

---

## Task 8: ESLint Setup

**Files:**
- Create: `eslint.config.js`
- Modify: `package.json` (add `lint` script)
- Modify: CI quality workflow (add lint step)

- [ ] **Step 1: Install ESLint and plugins**

```bash
npm install --save-dev eslint eslint-plugin-react eslint-plugin-react-hooks globals
```

- [ ] **Step 2: Create eslint.config.js**

Create `eslint.config.js` in the project root:

```js
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default [
  {
    files: ['src/**/*.{js,jsx}'],
    ignores: ['src/test/**'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.es2022 },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'no-console': 'warn',
    },
    settings: {
      react: { version: 'detect' },
    },
  },
];
```

- [ ] **Step 3: Add lint script to package.json**

In `package.json`, inside `"scripts"`, add:

```json
"lint": "eslint src --ext .js,.jsx"
```

- [ ] **Step 4: Run lint and fix any errors**

```bash
npm run lint
```

Fix any `error`-level findings. After completing Tasks 1–2 in this plan, the main remaining issues should be `no-console` warnings (already cleaned up) and possible `react-hooks/exhaustive-deps` warnings. Address errors; leave warnings for now.

- [ ] **Step 5: Add lint to CI quality workflow**

Find the CI quality workflow file (`.github/workflows/` — look for the file that the TODO described as not blocking on lint failures). Add a lint step that exits non-zero on errors:

```yaml
- name: Lint
  run: npm run lint
```

Ensure this step comes before the build step and is not wrapped in `continue-on-error: true`.

- [ ] **Step 6: Run tests**

```bash
npm run test:run
```

Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add eslint.config.js package.json package-lock.json .github/workflows/
git commit -m "chore: add ESLint with react and react-hooks plugins; wire into CI"
```
