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
```

Run a single test file:

```bash
npx vitest run src/test/components/SimpleLeaderboard.test.jsx
```

## Architecture

**Data flow**: `src/data/games.json` → `src/utils/dataUtils.js` (processing/calculations) → components (display only).

**Entry points**:

- `index.html` → `src/index.jsx` (wraps app in `ThemeProvider` + i18next `Suspense`) → `src/App.jsx` (single page with all sections, each wrapped in an `ErrorBoundary`)

**Key utilities**:

- `src/utils/dataUtils.js` — all game data calculations (scores, rankings, team resolution)
- `src/utils/ThemeContext.jsx` — dark/light theme context (persisted to localStorage, respects `prefers-color-scheme`)
- `src/utils/i18n.js` — i18next setup with browser language detection, fallback: Danish (`da`)
- `src/utils/logger.js` — Logtail wrapper (fails gracefully if `VITE_LOGTAIL_KEY` is absent)

**Test setup** (`src/test/setup.js`) mocks: `window.matchMedia`, logger, `IntersectionObserver`, `ResizeObserver`. Tests in `src/test/development/` and `src/test/manual/` are excluded from the test runner.

## Game Domain Model

- 6 players: Jonas, Torben, Gitte, Anette, Lotte, Peter
- Each game has 3 teams of 2 players (all 6 players participate in every game)
- Scoring: 1st place = 3 pts, 2nd = 2 pts, 3rd = 1 pt
- Teams are resolved from `games.json` by grouping players with the same score per game

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

Use Node v22 (see `.nvmrc`). CI tests against Node 20.x and 22.x.

## Documentation

New documentation goes in `docs/` (not the root). Markdown must pass markdownlint rules defined in `.markdownlint.json`.
