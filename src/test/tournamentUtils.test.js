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
