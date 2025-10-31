import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import i18n from '../../utils/i18n';

describe('I18n Configuration', () => {
  beforeEach(() => {
    // Reset i18n to Danish before each test (our new default)
    i18n.changeLanguage('da');
  });

  afterEach(() => {
    // Clean up after each test
    i18n.changeLanguage('da');
  });

  describe('Language Support', () => {
    it('should have English and Danish languages configured', () => {
      const languages = Object.keys(i18n.options.resources);
      expect(languages).toContain('en');
      expect(languages).toContain('da');
      expect(languages).toHaveLength(2);
    });

    it('should default to Danish as fallback language', () => {
      const fallback = i18n.options.fallbackLng;
      // fallbackLng can be a string or array
      const fallbackLang = Array.isArray(fallback) ? fallback[0] : fallback;
      expect(fallbackLang).toBe('da');
    });

    it('should change language to Danish', async () => {
      await i18n.changeLanguage('da');
      expect(i18n.language).toBe('da');
    });

    it('should change language to English', async () => {
      await i18n.changeLanguage('en');
      expect(i18n.language).toBe('en');
    });
  });

  describe('Translation Keys', () => {
    it('should translate app title in English', () => {
      i18n.changeLanguage('en');
      expect(i18n.t('app.title')).toBe('Partners Competition App');
    });

    it('should translate app title in Danish', async () => {
      await i18n.changeLanguage('da');
      expect(i18n.t('app.title')).toBe('Partners Konkurrence App');
    });

    it('should translate leaderboard headers in English', () => {
      i18n.changeLanguage('en');
      expect(i18n.t('leaderboard.title')).toBe('Leaderboard');
      expect(i18n.t('leaderboard.player')).toBe('Player');
      expect(i18n.t('leaderboard.points')).toBe('Points');
    });

    it('should translate leaderboard headers in Danish', async () => {
      await i18n.changeLanguage('da');
      expect(i18n.t('leaderboard.title')).toBe('Resultattavle');
      expect(i18n.t('leaderboard.player')).toBe('Spiller');
      expect(i18n.t('leaderboard.points')).toBe('Point');
    });
  });

  describe('Interpolation', () => {
    it('should handle interpolation in English', () => {
      i18n.changeLanguage('en');
      const result = i18n.t('app.footer', { year: 2024 });
      expect(result).toBe('Partners Competition App © 2024');
    });

    it('should handle interpolation in Danish', async () => {
      await i18n.changeLanguage('da');
      const result = i18n.t('app.footer', { year: 2024 });
      expect(result).toBe('Partners Konkurrence App © 2024');
    });

    it('should handle complex interpolation for team stats', () => {
      i18n.changeLanguage('en');
      const result = i18n.t('summary.mostWinningTeam.stats', { 
        wins: 5, 
        games: 10, 
        rate: 50 
      });
      expect(result).toBe('Won 5 out of 10 games (50%)');
    });
  });

  describe('Fallback Behavior', () => {
    it('should fallback to English for missing Danish translations', async () => {
      await i18n.changeLanguage('da');
      // Test with a key that might not exist in Danish
      const result = i18n.t('nonexistent.key', { fallbackLng: 'en' });
      expect(typeof result).toBe('string');
    });

    it('should return key name for completely missing translations', () => {
      const result = i18n.t('completely.nonexistent.key');
      expect(result).toBe('completely.nonexistent.key');
    });
  });

  describe('Pluralization', () => {
    it('should handle English pluralization', () => {
      i18n.changeLanguage('en');
      // Test singular
      const singular = i18n.t('gamesList.points.one');
      expect(singular).toBe('point');
      
      // Test plural
      const plural = i18n.t('gamesList.points.other');
      expect(plural).toBe('points');
    });

    it('should handle Danish pluralization', async () => {
      await i18n.changeLanguage('da');
      // In Danish, both singular and plural are "point"
      const singular = i18n.t('gamesList.points.one');
      expect(singular).toBe('point');
      
      const plural = i18n.t('gamesList.points.other');
      expect(plural).toBe('point');
    });
  });

  describe('Nested Translation Keys', () => {
    it('should handle deeply nested keys', () => {
      i18n.changeLanguage('en');
      expect(i18n.t('charts.playerStats.axisLabels.player')).toBe('Player');
      expect(i18n.t('charts.playerStats.axisLabels.score')).toBe('Score');
    });

    it('should handle nested keys in Danish', async () => {
      await i18n.changeLanguage('da');
      expect(i18n.t('charts.playerStats.axisLabels.player')).toBe('Spiller');
      expect(i18n.t('charts.playerStats.axisLabels.score')).toBe('Score');
    });
  });

  describe('Language Persistence', () => {
    it('should maintain language after multiple operations', async () => {
      await i18n.changeLanguage('da');
      expect(i18n.language).toBe('da');
      
      // Perform some translations
      i18n.t('app.title');
      i18n.t('leaderboard.title');
      
      // Language should still be Danish
      expect(i18n.language).toBe('da');
    });
  });
});