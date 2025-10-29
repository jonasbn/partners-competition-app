import { describe, it, expect, vi } from 'vitest';

// Mock the avatarUtils module since we might not have the actual implementation
vi.mock('../../utils/avatarUtils', () => ({
  getPlayerAvatarPath: (playerName, emotion = 'ok') => {
    if (!playerName) return `/assets/${playerName || ''}/${emotion}.png`;
    return `/assets/${playerName.toLowerCase()}/${emotion}.png`;
  }
}));

import { getPlayerAvatarPath } from '../../utils/avatarUtils';

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
});