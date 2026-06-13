import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getPlayerAvatarPath,
  getAvatarColor,
  getInitials,
} from '../utils/simpleAvatarUtils';

describe('simpleAvatarUtils', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('getPlayerAvatarPath', () => {
    it('returns the ok.png path for a known player', () => {
      expect(getPlayerAvatarPath('Jonas')).toBe('/assets/jonas/ok.png');
    });

    it('is case-insensitive', () => {
      expect(getPlayerAvatarPath('TORBEN')).toBe('/assets/torben/ok.png');
      expect(getPlayerAvatarPath('gitte')).toBe('/assets/gitte/ok.png');
    });

    it('returns null for an unknown player name', () => {
      expect(getPlayerAvatarPath('Unknown')).toBeNull();
    });

    it('returns null for null input', () => {
      expect(getPlayerAvatarPath(null)).toBeNull();
    });

    it('returns null for a non-string input', () => {
      expect(getPlayerAvatarPath(123)).toBeNull();
    });

    it('returns null for an empty string', () => {
      expect(getPlayerAvatarPath('')).toBeNull();
    });
  });

  describe('getAvatarColor', () => {
    it('returns an hsl color string with 70% saturation and 60% lightness', () => {
      expect(getAvatarColor('Jonas')).toMatch(/^hsl\(\d+, 70%, 60%\)$/);
    });

    it('returns the same color for the same name', () => {
      expect(getAvatarColor('Jonas')).toBe(getAvatarColor('Jonas'));
    });

    it('returns different colors for different names', () => {
      expect(getAvatarColor('Jonas')).not.toBe(getAvatarColor('Torben'));
    });
  });

  describe('getInitials', () => {
    it('returns the first two characters uppercased', () => {
      expect(getInitials('Jonas')).toBe('JO');
      expect(getInitials('Torben')).toBe('TO');
    });

    it('handles names with two characters', () => {
      expect(getInitials('AB')).toBe('AB');
    });
  });
});
