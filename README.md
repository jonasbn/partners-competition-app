# Partners Competition App

A single-page React application for tracking and visualising tournament statistics for a card game called **partners**.

## The Game

- **6 players**: Jonas, Torben, Gitte, Anette, Lotte, Peter
- Each game pairs the 6 players into **3 teams of 2** (all players participate in every game)
- **Scoring**: 1st place = 3 pts, 2nd = 2 pts, 3rd = 1 pt
- The app tracks results across multiple seasons and shows leaderboards, team statistics, and player performance

## Getting Started

Requires **Node v22** (see `.nvmrc`).

```bash
npm install
npm start        # Dev server on http://localhost:3000
```

## Commands

```bash
npm start              # Dev server (auto-opens browser)
npm run build          # Production build → build/
npm run preview        # Preview production build locally

npm test               # Run all tests once
npm run test:watch     # Watch mode
npm run test:ui        # Vitest UI dashboard
npm run test:coverage  # Coverage report
```

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18.3.1 | UI framework |
| Vite | 8.0.14 | Build tool & dev server |
| Bootstrap | 5.x | Responsive UI |
| i18next | — | Internationalisation (Danish default, English) |
| Vitest | — | Test framework |
| React Testing Library | — | Component tests |

## Deployment

The app is hosted on **Digital Ocean App Platform** and auto-deploys on every push to `main`.
See [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for details.

## Documentation

- [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) — how to deploy
- [docs/DATA_UPDATE.md](docs/DATA_UPDATE.md) — how to add game results or a new season
- [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) — branch strategy, commit style, PR conventions
- [docs/TESTING.md](docs/TESTING.md) — test setup and conventions
- [docs/LOGGING.md](docs/LOGGING.md) — logging configuration
- [docs/README.md](docs/README.md) — full documentation index
