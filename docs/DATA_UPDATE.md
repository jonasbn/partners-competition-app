# Data Update Guide

## Adding a Game Result

Game results live in `src/data/games.json` (2025 season) and `src/data/games_2026.json` (2026 season).

Each entry in the array follows this format:

```json
{
  "gameId": 42,
  "gameDate": "2026-06-15",
  "players": [
    { "name": "Jonas", "score": 3 },
    { "name": "Torben", "score": 3 },
    { "name": "Gitte", "score": 2 },
    { "name": "Anette", "score": 2 },
    { "name": "Lotte", "score": 1 },
    { "name": "Peter", "score": 1 }
  ]
}
```

Rules:

- `gameId` must be unique across all entries in the file.
- `gameDate` is `YYYY-MM-DD`.
- Every game has exactly 6 players — all six (Jonas, Torben, Gitte, Anette, Lotte, Peter) participate in every game.
- Players with the same `score` are on the same team. Teams are derived automatically by `processGamesData` in `src/utils/dataUtils.js` — there are no `teams` or `place` fields in the raw data.
- Score values must be 3, 2, or 1. Two players share each score value (three teams of two).

After editing the JSON, run `npm test` to verify the data parses correctly.

## Adding a New Season

A new season requires changes in three places:

### 1. Create the data file

Create `src/data/games_YYYY.json` (e.g. `src/data/games_2027.json`) containing an array of game objects in the format shown above. Start with an empty array `[]` and populate it as games are played.

### 2. Register the data file in `dataUtils.js`

In `src/utils/dataUtils.js`, add the new year to the import and the `GAMES_DATA_BY_YEAR` mapping:

```javascript
// Add import at the top
import gamesData2027 from '../data/games_2027.json';

// Add to the mapping
const GAMES_DATA_BY_YEAR = {
  2025: gamesData2025,
  2026: gamesData2026,
  2027: gamesData2027,
};
```

### 3. Add the year to `YearContext.jsx`

In `src/utils/YearContext.jsx`, add the year to `AVAILABLE_YEARS`:

```javascript
export const AVAILABLE_YEARS = [2025, 2026, 2027];
export const MOST_RECENT_YEAR = Math.max(...AVAILABLE_YEARS);
```

`MOST_RECENT_YEAR` is derived automatically — only `AVAILABLE_YEARS` needs updating. The year selector in the navbar will include the new season and select it by default.
