import { describe, it, expect } from 'vitest';
import { getRankBasedAvatar } from '../../utils/simpleAvatarUtils';

describe('getRankBasedAvatar', () => {
  describe('when gamesPlayed is explicitly 0 (no ranking data yet)', () => {
    it('returns the ok avatar for rank 1 (would otherwise be happy)', () => {
      expect(getRankBasedAvatar('Jonas', 1, 0)).toBe('/assets/jonas/ok.png');
    });

    it('returns the ok avatar for rank 4 and beyond (would otherwise be sad)', () => {
      expect(getRankBasedAvatar('Malene', 7, 0)).toBe('/assets/malene/ok.png');
      expect(getRankBasedAvatar('Kurt', 8, 0)).toBe('/assets/kurt/ok.png');
    });
  });

  describe('when gamesPlayed is greater than 0', () => {
    it('still applies normal rank-based selection', () => {
      expect(getRankBasedAvatar('Jonas', 1, 5)).toBe('/assets/jonas/happy.png');
      expect(getRankBasedAvatar('Torben', 2, 5)).toBe('/assets/torben/ok.png');
      expect(getRankBasedAvatar('Peter', 6, 5)).toBe('/assets/peter/sad.png');
    });
  });

  describe('when gamesPlayed is omitted (backward compatibility with season call sites)', () => {
    it('falls back to rank-only selection unchanged', () => {
      expect(getRankBasedAvatar('Jonas', 1)).toBe('/assets/jonas/happy.png');
      expect(getRankBasedAvatar('Gitte', 3)).toBe('/assets/gitte/ok.png');
      expect(getRankBasedAvatar('Lotte', 5)).toBe('/assets/lotte/sad.png');
    });
  });
});
