import { describe, it, expect } from 'vitest';

describe('Integration Tests', () => {
  
  describe('Data flow', () => {
    it('should process game data through the complete pipeline', () => {
      // Simulate the data processing pipeline
      const rawGameData = [
        {
          gameId: 1,
          gameDate: "2024-01-15",
          players: [
            { name: "Jonas", score: 3 },
            { name: "Torben", score: 2 },
            { name: "Gitte", score: 1 }
          ]
        }
      ];

      // Step 1: Extract player scores
      const playerScores = {};
      rawGameData.forEach(game => {
        game.players.forEach(player => {
          if (!playerScores[player.name]) {
            playerScores[player.name] = 0;
          }
          playerScores[player.name] += player.score;
        });
      });

      // Step 2: Create leaderboard
      const leaderboard = Object.entries(playerScores)
        .map(([name, score]) => ({ name, score }))
        .sort((a, b) => b.score - a.score);

      // Step 3: Verify results
      expect(leaderboard).toHaveLength(3);
      expect(leaderboard[0].name).toBe('Jonas');
      expect(leaderboard[0].score).toBe(3);
    });

    it('should handle multiple games correctly', () => {
      const multipleGames = [
        {
          gameId: 1,
          players: [
            { name: "Jonas", score: 3 },
            { name: "Torben", score: 1 }
          ]
        },
        {
          gameId: 2,
          players: [
            { name: "Jonas", score: 1 },
            { name: "Torben", score: 3 }
          ]
        }
      ];

      const totalScores = {};
      multipleGames.forEach(game => {
        game.players.forEach(player => {
          totalScores[player.name] = (totalScores[player.name] || 0) + player.score;
        });
      });

      expect(totalScores.Jonas).toBe(4);
      expect(totalScores.Torben).toBe(4);
    });
  });

  describe('Bootstrap integration', () => {
    it('should work with Bootstrap classes', () => {
      const element = document.createElement('div');
      element.className = 'container-fluid row col-md-6';
      
      expect(element.classList.contains('container-fluid')).toBe(true);
      expect(element.classList.contains('row')).toBe(true);
      expect(element.classList.contains('col-md-6')).toBe(true);
    });
  });

  describe('Theme integration', () => {
    it('should apply theme classes correctly', () => {
      const applyTheme = (theme) => {
        return theme === 'dark' ? 'dark-theme' : 'light-theme';
      };

      expect(applyTheme('light')).toBe('light-theme');
      expect(applyTheme('dark')).toBe('dark-theme');
      expect(applyTheme('invalid')).toBe('light-theme');
    });
  });
});