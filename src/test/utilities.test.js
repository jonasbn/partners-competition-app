import { describe, it, expect } from 'vitest';

describe('Utility Functions', () => {
  
  describe('Avatar path generation', () => {
    const getPlayerAvatarPath = (playerName, emotion = 'ok') => {
      if (!playerName) return `/assets/${playerName || ''}/${emotion}.png`;
      return `/assets/${playerName.toLowerCase()}/${emotion}.png`;
    };

    it('should generate correct avatar paths', () => {
      expect(getPlayerAvatarPath('Jonas', 'happy')).toBe('/assets/jonas/happy.png');
      expect(getPlayerAvatarPath('TORBEN', 'sad')).toBe('/assets/torben/sad.png');
      expect(getPlayerAvatarPath('Gitte')).toBe('/assets/gitte/ok.png');
    });

    it('should handle edge cases', () => {
      expect(getPlayerAvatarPath('', 'happy')).toBe('/assets//happy.png');
      expect(getPlayerAvatarPath(null, 'happy')).toBe('/assets//happy.png'); // null gets converted to empty string
    });
  });

  describe('Color generation', () => {
    const generatePlayerColor = (playerName) => {
      const hash = playerName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const hue = hash % 360;
      return `hsl(${hue}, 70%, 50%)`;
    };

    it('should generate consistent colors for same player', () => {
      const color1 = generatePlayerColor('Jonas');
      const color2 = generatePlayerColor('Jonas');
      expect(color1).toBe(color2);
    });

    it('should generate different colors for different players', () => {
      const jonasColor = generatePlayerColor('Jonas');
      const torbenColor = generatePlayerColor('Torben');
      expect(jonasColor).not.toBe(torbenColor);
    });

    it('should return valid HSL format', () => {
      const color = generatePlayerColor('TestPlayer');
      expect(color).toMatch(/^hsl\(\d+, 70%, 50%\)$/);
    });
  });

  describe('Date formatting', () => {
    const formatGameDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
    };

    it('should format dates correctly', () => {
      const formatted = formatGameDate('2024-01-15');
      expect(formatted).toContain('2024');
    });

    it('should handle invalid dates', () => {
      expect(() => formatGameDate('invalid-date')).not.toThrow();
    });
  });

  describe('Number formatting', () => {
    const formatScore = (score) => {
      return typeof score === 'number' ? score.toFixed(1) : '0.0';
    };

    it('should format numbers correctly', () => {
      expect(formatScore(15)).toBe('15.0');
      expect(formatScore(12.345)).toBe('12.3');
    });

    it('should handle invalid inputs', () => {
      expect(formatScore(null)).toBe('0.0');
      expect(formatScore('invalid')).toBe('0.0');
    });
  });
});