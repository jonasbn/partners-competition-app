import { describe, it, expect, beforeEach } from 'vitest';
import * as dataUtils from '../utils/dataUtils';

// Mock the JSON import first
vi.mock('../data/games.json', () => ({
  default: [
    {
      gameId: 1,
      gameDate: "2024-01-15",
      players: [
        { name: "Jonas", score: 3 },
        { name: "Torben", score: 3 },
        { name: "Gitte", score: 2 },
        { name: "Anette", score: 2 },
        { name: "Lotte", score: 1 },
        { name: "Peter", score: 1 }
      ]
    },
    {
      gameId: 2,
      gameDate: "2024-01-22",
      players: [
        { name: "Jonas", score: 2 },
        { name: "Gitte", score: 2 },
        { name: "Torben", score: 1 },
        { name: "Peter", score: 1 },
        { name: "Anette", score: 3 },
        { name: "Lotte", score: 3 }
      ]
    }
  ]
}));

describe('Data Processing Utils', () => {
  describe('processGamesData', () => {
    it('should process games data correctly', () => {
      const result = dataUtils.processGamesData();
      
      expect(result.players).toHaveLength(6);
      expect(result.games).toHaveLength(2);
    });

    it('should calculate cumulative scores correctly', () => {
      const result = dataUtils.processGamesData();
      const jonas = result.players.find(p => p.name === 'Jonas');
      
      expect(jonas.cumulativeScore).toBe(5); // 3 + 2 from both games
    });

    it('should sort players by cumulative score descending', () => {
      const result = dataUtils.processGamesData();
      
      // Check that scores are in descending order
      for (let i = 0; i < result.players.length - 1; i++) {
        expect(result.players[i].cumulativeScore).toBeGreaterThanOrEqual(
          result.players[i + 1].cumulativeScore
        );
      }
    });

    it('should form teams correctly', () => {
      const result = dataUtils.processGamesData();
      const firstGame = result.games[0];
      
      expect(firstGame.teams).toHaveLength(3); // 3 teams in first game
      
      // Check that each team has 2 players
      firstGame.teams.forEach(team => {
        expect(team.players).toHaveLength(2);
        expect(team.score).toBeTypeOf('number');
      });
    });
  });

  describe('getLeaderboardData', () => {
    it('should return processed data', () => {
      const result = dataUtils.getLeaderboardData();
      
      expect(result).toHaveProperty('players');
      expect(result).toHaveProperty('games');
      expect(Array.isArray(result.players)).toBe(true);
      expect(Array.isArray(result.games)).toBe(true);
    });
  });

  describe('getGames', () => {
    it('should return array of games', () => {
      const games = dataUtils.getGames();
      
      expect(Array.isArray(games)).toBe(true);
      expect(games).toHaveLength(2);
      
      games.forEach(game => {
        expect(game).toHaveProperty('gameId');
        expect(game).toHaveProperty('gameDate');
        expect(game).toHaveProperty('teams');
      });
    });
  });

  describe('getPlayerById', () => {
    it('should return correct player by ID', () => {
      const player = dataUtils.getPlayerById(1);
      
      expect(player).toBeDefined();
      expect(player.name).toBe('Jonas');
      expect(player.id).toBe(1);
    });

    it('should return undefined for non-existent player', () => {
      const player = dataUtils.getPlayerById(999);
      
      expect(player).toBeUndefined();
    });
  });

  describe('getTeamStatistics', () => {
    it('should calculate team statistics correctly', () => {
      const teamStats = dataUtils.getTeamStatistics();
      
      expect(Array.isArray(teamStats)).toBe(true);
      expect(teamStats.length).toBeGreaterThan(0);
      
      teamStats.forEach(team => {
        expect(team).toHaveProperty('players');
        expect(team).toHaveProperty('gamesPlayed');
        expect(team).toHaveProperty('wins');
        expect(team).toHaveProperty('winRate');
        expect(team.players).toHaveLength(2);
        expect(team.winRate).toBeGreaterThanOrEqual(0);
        expect(team.winRate).toBeLessThanOrEqual(100);
      });
    });

    it('should sort teams by wins and win rate', () => {
      const teamStats = dataUtils.getTeamStatistics();
      
      // Check sorting logic - teams with more wins should come first
      for (let i = 0; i < teamStats.length - 1; i++) {
        const current = teamStats[i];
        const next = teamStats[i + 1];
        
        if (current.wins === next.wins) {
          // If wins are equal, check win rate
          expect(current.winRate).toBeGreaterThanOrEqual(next.winRate);
        } else {
          // Otherwise, wins should be in descending order
          expect(current.wins).toBeGreaterThan(next.wins);
        }
      }
    });
  });

  describe('getTeamCombinationStatistics', () => {
    it('should return all possible team combinations', () => {
      const combinations = dataUtils.getTeamCombinationStatistics();
      
      // With 6 players, there should be C(6,2) = 15 possible combinations
      expect(combinations).toHaveLength(15);
      
      combinations.forEach(combination => {
        expect(combination).toHaveProperty('teamKey');
        expect(combination).toHaveProperty('players');
        expect(combination).toHaveProperty('count');
        expect(combination.players).toHaveLength(2);
        expect(combination.count).toBeGreaterThanOrEqual(0);
      });
    });

    it('should count team occurrences correctly', () => {
      const combinations = dataUtils.getTeamCombinationStatistics();
      
      // Find specific team combinations that should exist in mock data
      const jonasToben = combinations.find(c => 
        c.players.includes('Jonas') && c.players.includes('Torben')
      );
      expect(jonasToben.count).toBe(1); // They played together once
      
      const gitteAnette = combinations.find(c => 
        c.players.includes('Gitte') && c.players.includes('Anette')
      );
      expect(gitteAnette.count).toBe(1); // They played together once
    });
  });
});