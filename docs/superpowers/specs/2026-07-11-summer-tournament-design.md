# Summer Tournament — Design

Date: 2026-07-11

## Purpose

Introduce a short "Summer Tournament" as a separate tab in the app, alongside the
existing season view. The tournament has its own domain rules that differ from the
regular season:

- 8 players instead of 6: the existing roster (Jonas, Torben, Gitte, Anette, Lotte,
  Peter) plus two new players, **Malene** and **Kurt**.
- Each game is 2 teams of 2 players (4 players per game), not 3 teams of 2 with all
  6/8 players participating every game. Players can sit out a given game.
- Scoring per game: 2 points for 1st place (the winning team), 1 point for 2nd place
  (the losing team). There is no 3rd place — only two teams play per game.

## Navigation

Today the app has no tab system — a single continuous page with a Year selector
(2025/2026) in the navbar that swaps the data set shown across all 6 components.

Add a top-level tab switcher in the navbar: **Season** | **Summer Tournament**.

- A new `ViewContext` (`src/utils/ViewContext.jsx`), modeled on the existing
  `YearContext`, holds `activeView: 'season' | 'tournament'` and a setter.
- `App.jsx` renders either the existing 6 Season components (unchanged, still driven
  by `YearContext`) or the 6 new Tournament components, depending on `activeView`.
- The Year selector only renders/applies under the Season tab. It has no meaning for
  the tournament (there's only one summer tournament dataset for now).

## Data model

Fully independent from the season data model — nothing in `dataUtils.js` or
`games.json` / `games_2026.json` changes.

- `src/data/tournament_summer_2026.json` — starts as `[]`. Each entry:

  ```json
  {
    "gameId": 1,
    "gameDate": "2026-07-15",
    "players": [
      { "name": "Jonas", "score": 2 },
      { "name": "Torben", "score": 2 },
      { "name": "Malene", "score": 1 },
      { "name": "Kurt", "score": 1 }
    ]
  }
  ```

  Exactly 4 players per game, drawn from the 8-player roster. Two players share
  score 2 (the winning team), two share score 1 (the losing team).

- `src/utils/tournamentUtils.js` — parallel to `dataUtils.js`:
  - `TOURNAMENT_PLAYERS`: 8 entries — Jonas, Torben, Gitte, Anette, Lotte, Peter,
    Malene, Kurt.
  - `processTournamentData(gameData)` — same score-grouping approach as
    `processGamesData` (group players in a game by matching score to form teams),
    but:
    - Win detection is "highest score in the game" (2), not a hardcoded 3.
    - Each game forms 2 teams, not 3.
    - `gamesPlayed` per player varies since not everyone plays every game — win
      rate and average score are computed only over games actually played.
  - `getTournamentLeaderboardData`, `getTournamentGames`,
    `getTournamentTeamStatistics`, `getTournamentTeamCombinationStatistics` — same
    return shapes as their season counterparts, so the new components can follow
    the same rendering patterns as the `Simple*` components.

## Components

New parallel set under `src/components/`, prefixed `Tournament`, each modeled
directly on its `Simple*` counterpart but built against `tournamentUtils.js` and the
2-team/2-point domain:

1. `TournamentSummaryCards` — current leader, best team, game stats.
2. `TournamentLeaderboard` — player rankings, scores, averages, win ratio.
3. `TournamentPlayerPerformance` — per-player metrics across games played.
4. `TournamentGamesCalendar` — game count, game days, activity timeline, recent games.
5. `TournamentTeamStatistics` — team performance, win rates, rankings.
6. `TournamentGamesList` — recent game outcomes with teams and scores.

Each is wrapped in its own `ErrorBoundary`, same convention as the Season tab.

## Avatars

Extend the player→avatar-directory map (in `simpleAvatarUtils.js` or a
`tournamentAvatarUtils.js` sibling) to include `malene` and `kurt`, pointing at
`public/assets/malene/{happy,ok,sad}.png` and `public/assets/kurt/{happy,ok,sad}.png`.

Those image files don't exist yet (tracked as a follow-up TODO — see below). Until
they do, avatar rendering falls back to the existing `getAvatarColor` +
`getInitials` helpers, producing a colored circle with initials (e.g. "MA", "KU").
This is the same graceful-fallback shape the avatar utilities already use elsewhere,
so the tournament tab works end-to-end today and picks up real images later with no
code change.

## i18n

New `tournament` namespace block added to both `src/utils/locales/da.js` (default)
and `en.js`, mirroring the key structure already used by `summaryCards`,
`leaderboard`, `gamesCalendar`, `teamStatistics`, and `gamesList` (e.g.
`tournament.leaderboard.*`, `tournament.gamesList.*`). Plus `nav.season` /
`nav.tournament` labels for the new tab switcher. Danish remains the fallback
language.

## Testing

- One test file per new component under `src/test/components/` (e.g.
  `TournamentLeaderboard.test.jsx`), following existing conventions — mocked
  logger, `matchMedia`, `IntersectionObserver`/`ResizeObserver` via
  `src/test/setup.js`.
- `tournamentUtils.test.js` covering: 4-player/2-team grouping, win detection at
  score 2 (not 3), uneven participation (a player sitting out a game), and the
  empty-data-file case.
- A small test for `ViewContext`/the tab switcher verifying that switching tabs
  swaps the rendered component set.

## Explicitly out of scope

- **Generating the Malene/Kurt avatar PNGs.** Tracked as an existing TODO; the
  fallback initials/color avatar covers the gap until the images exist.
- **The "suggested tournament plan"** (a round-robin fixture list proposing
  balanced partner/opponent rotation across games). This will be produced as a
  one-off schedule (e.g. a doc or seed reference) outside of this implementation,
  used offline to run the tournament. Actual results are entered into
  `tournament_summer_2026.json` as games are played, same as the season data flow.
  Not a live scheduling feature in the app.
