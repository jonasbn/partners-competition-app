# Data Update Guide

## Adding a Game Result

Game results live in `src/data/games.json` (current season) and `src/data/games_YYYY.json` (past seasons).

Each entry in the `games` array follows this format:

```json
{
  "gameId": 42,
  "gameDate": "2026-06-15",
  "teams": [
    { "players": ["Jonas", "Torben"], "score": 3, "place": 1 },
    { "players": ["Gitte", "Anette"], "score": 2, "place": 2 },
    { "players": ["Lotte", "Peter"], "score": 1, "place": 3 }
  ]
}
```

Rules:

- `gameId` must be unique across all entries in the file.
- `gameDate` is `YYYY-MM-DD`.
- Every game has exactly 3 teams of exactly 2 players.
- All 6 players (Jonas, Torben, Gitte, Anette, Lotte, Peter) participate in every game.
- `place` values must be 1, 2, 3 — one team per place.
- `score` values must be 3, 2, 1 corresponding to places 1, 2, 3.

After editing the JSON, run `npm test` to verify the data parses correctly.

## Adding a New Season

A new season requires changes in three places:

### 1. Create the data file

Copy the current `src/data/games.json` structure and save results to `src/data/games_YYYY.json`
(e.g. `src/data/games_2027.json`). The file must export or contain a valid JSON array of game objects.

### 2. Register the data file in `dataUtils.js`

In `src/utils/dataUtils.js`, add the new year to the `GAMES_DATA_BY_YEAR` mapping:

```javascript
// Before
const GAMES_DATA_BY_YEAR = {
  2025: games2025Data,
  2026: gamesData,
};

// After
import games2027Data from '../data/games_2027.json';

const GAMES_DATA_BY_YEAR = {
  2025: games2025Data,
  2026: gamesData,
  2027: games2027Data,
};
```

### 3. Add the year to `YearContext.jsx`

In `src/utils/YearContext.jsx`, add the year to `AVAILABLE_YEARS` and update `MOST_RECENT_YEAR`:

```javascript
export const AVAILABLE_YEARS = [2025, 2026, 2027];
export const MOST_RECENT_YEAR = 2027;
```

After these changes, the year selector in the navbar will include the new season and it will be selected by default.
