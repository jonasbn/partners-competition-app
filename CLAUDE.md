# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A single-page React application for visualizing gaming tournament statistics for a card game called "partners". Built with React 18 + Vite, deployed on Digital Ocean App Platform.

## Commands

```bash
npm start          # Dev server on port 3000 (auto-opens browser)
npm run build      # Production build to /build
npm run preview    # Preview production build locally

npm test           # Watch mode (interactive)
npm run test:run   # Run tests once
npm run test:ui    # Vitest UI dashboard
npm run test:coverage  # Generate coverage report

npm run lint        # eslint on src (React/hooks rules, no-console, no-unused-vars)
npm run oxlint       # oxlint on the whole repo (fast, broader default rule set)
npm run lint:fix     # oxlint --fix (only auto-fixable rules; e.g. no-unused-vars is not one)
```

Run a single test file:

```bash
npx vitest run src/test/components/SimpleLeaderboard.test.jsx
```

## Architecture

**Data flow**: `src/data/games.json` → `src/utils/dataUtils.js` (processing/calculations) → components (display only).

**Entry points**:

- `index.html` → `src/index.jsx` (wraps app in `ThemeProvider`) → `src/App.jsx` (single page with all sections, each wrapped in an `ErrorBoundary`)

**Key utilities**:

- `src/utils/dataUtils.js` — all game data calculations (scores, rankings, team resolution)
- `src/utils/ThemeContext.jsx` — dark/light theme context (persisted to localStorage, respects `prefers-color-scheme`)
- `src/utils/i18n.js` — i18next setup with browser language detection, fallback: Danish (`da`)
- `src/utils/logger.js` — Logtail wrapper (fails gracefully if `VITE_LOGTAIL_KEY` is absent)

**Test setup** (`src/test/setup.js`) mocks: `window.matchMedia`, logger, `IntersectionObserver`, `ResizeObserver`. Tests in `src/test/development/` and `src/test/manual/` are excluded from the test runner.

## Linting

Two linters run side by side, not redundantly:

- `eslint` (`eslint.config.js`) — scoped to `src/**/*.{js,jsx}`, excludes `src/test/**`, `build/**`, `coverage/**`. Owns React/hooks rules (`eslint-plugin-react`, `eslint-plugin-react-hooks`) and project-specific rule tuning (`no-console` allows `error`/`warn`/`debug`/`log`, matching `src/utils/logger.js`).
- `oxlint` (`.oxlintrc.json`) — runs repo-wide including `src/test/**`. Enables the `react`, `jsx-a11y`, and `vitest` plugins on top of its defaults (`typescript`, `unicorn`, `oxc`) — none of those three are on by default upstream, despite this being a React + Vitest app. It has caught real bugs eslint's config missed, e.g. a silently-shadowed duplicate `place` key in the locale files. Both `npm run lint` and `npm run oxlint` run in CI (`.github/workflows/quality.yml`).

When adding a new eslint rule already covered by oxlint's defaults, expect oxlint to report violations too — fix in place rather than suppressing, since both linters are treated as authoritative here. Known deferred oxlint findings (a11y/vitest, kept at `warning` so CI stays green) are tracked in `docs/TODO.md`.

## Game Domain Model

- 6 players: Jonas, Torben, Gitte, Anette, Lotte, Peter
- Each game has 3 teams of 2 players (all 6 players participate in every game)
- Scoring: 1st place = 3 pts, 2nd = 2 pts, 3rd = 1 pt
- Teams are resolved from `games.json` by grouping players with the same score per game

## Game Data Files

Game results are split by year — **always add new games to the correct file**:

- `src/data/games.json` — 2025 season (gameIds 1–18, do not add 2026 entries here)
- `src/data/games_2026.json` — 2026 season (gameIds use their own sequence starting at 1)
- `src/data/tournament_summer_2026.json` — 2026 summer tournament (8 players, teams of 2, gameIds start at 1)

When adding a new game/match entry to any of these files, set `gameDate` to the actual date the result is being reported for (use the current date unless the user states otherwise) — never copy the `gameDate` from the previous entry.

## Avatar System

Avatars live in `public/avatars/`. Two contexts, each with variations:

- **Ranking context** (3 variations): happy (1st), neutral (2nd–3rd), sad (4th+)
- **Game outcome context** (2 variations): happy (win/1st), neutral (2nd), sad (loss/3rd)
- **Team statistics**: happy (1st–3rd), neutral (4th–9th), sad (10th+)

## UI Components

All components render on a single page in this order:

1. `SimpleSummaryCards` — current leader, best team, game stats
2. `SimpleLeaderboard` — player rankings with avatars, scores, averages, win ratio
3. `SimplePlayerPerformance` — per-player metrics across games
4. `SimpleGamesCalendar` — game count, game days, activity timeline, recent games
5. `SimpleTeamStatistics` — team performance, win rates, rankings
6. `SimpleGamesList` — recent game outcomes with teams and scores

## Environment Variables

- `VITE_LOGTAIL_KEY` — Logtail API token (optional; logging silently disabled without it)
- `.env.test` used for test runs

## Node Version

Use Node v24 (see `.nvmrc`). CI tests against Node 22.x and 24.x.

## Documentation

New documentation goes in `docs/` (not the root). Markdown must pass markdownlint rules defined in `.markdownlint.json`.
