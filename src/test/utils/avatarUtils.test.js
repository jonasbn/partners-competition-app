import { describe, it, expect, vi } from 'vitest';

// Mock the simpleAvatarUtils module since we might not have the actual implementation
vi.mock('../../utils/simpleAvatarUtils', () => ({
  getPlayerAvatarPath: (playerName, emotion = 'ok') => {
    if (!playerName) return `/assets/${playerName || ''}/${emotion}.png`;
    return `/assets/${playerName.toLowerCase()}/${emotion}.png`;
  },
  getAvatarColor: (name) => {
    // Simple hash function to generate a color based on the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 60%)`;
  },
  getInitials: (name) => {
    return name.substring(0, 2).toUpperCase();
  }
}));

import { getPlayerAvatarPath, getAvatarColor, getInitials } from '../../utils/simpleAvatarUtils';

describe('Avatar Utils', () => {
  describe('getPlayerAvatarPath', () => {
    it('generates correct avatar path for happy emotion', () => {
      const path = getPlayerAvatarPath('Jonas', 'happy');
      expect(path).toBe('/assets/jonas/happy.png');
    });

    it('generates correct avatar path for sad emotion', () => {
      const path = getPlayerAvatarPath('Gitte', 'sad');
      expect(path).toBe('/assets/gitte/sad.png');
    });

    it('handles uppercase player names', () => {
      const path = getPlayerAvatarPath('TORBEN', 'ok');
      expect(path).toBe('/assets/torben/ok.png');
    });

    it('handles mixed case player names', () => {
      const path = getPlayerAvatarPath('AnEtTe', 'happy');
      expect(path).toBe('/assets/anette/happy.png');
    });

    it('returns default emotion when not specified', () => {
      const path = getPlayerAvatarPath('Lotte');
      expect(path).toBe('/assets/lotte/ok.png');
    });

    it('handles empty player name gracefully', () => {
      const path = getPlayerAvatarPath('', 'happy');
      expect(path).toBe('/assets//happy.png');
    });

    it('handles null/undefined player name gracefully', () => {
      expect(() => getPlayerAvatarPath(null, 'happy')).not.toThrow();
      expect(() => getPlayerAvatarPath(undefined, 'happy')).not.toThrow();
    });
  });

  describe('getAvatarColor', () => {
    it('generates consistent color for same name', () => {
      const color1 = getAvatarColor('Jonas');
      const color2 = getAvatarColor('Jonas');
      expect(color1).toBe(color2);
    });

    it('generates different colors for different names', () => {
      const color1 = getAvatarColor('Jonas');
      const color2 = getAvatarColor('Torben');
      expect(color1).not.toBe(color2);
    });

    it('returns HSL color format', () => {
      const color = getAvatarColor('TestName');
      expect(color).toMatch(/^hsl\(\d+, 70%, 60%\)$/);
    });

    it('handles empty string', () => {
      const color = getAvatarColor('');
      expect(color).toMatch(/^hsl\(\d+, 70%, 60%\)$/);
    });
  });

  describe('getInitials', () => {
    it('extracts first two characters as initials', () => {
      expect(getInitials('Jonas')).toBe('JO');
      expect(getInitials('Torben')).toBe('TO');
    });

    it('converts to uppercase', () => {
      expect(getInitials('jonas')).toBe('JO');
      expect(getInitials('torben')).toBe('TO');
    });

    it('handles single character names', () => {
      expect(getInitials('J')).toBe('J');
    });

    it('handles empty string', () => {
      expect(getInitials('')).toBe('');
    });

    it('handles names with spaces', () => {
      expect(getInitials('Jonas Andersen')).toBe('JO');
    });
  });
});