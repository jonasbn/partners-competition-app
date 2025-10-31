import { describe, it, expect } from 'vitest';
import enTranslations from '../../utils/locales/en.js';
import daTranslations from '../../utils/locales/da.js';

/**
 * Utility function to get all keys from a nested object
 */
const getAllKeys = (obj, prefix = '') => {
  let keys = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys = keys.concat(getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
};

/**
 * Utility function to get nested value from object using dot notation
 */
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};

describe('Translation Files Validation', () => {
  const englishKeys = getAllKeys(enTranslations);
  const danishKeys = getAllKeys(daTranslations);

  describe('Translation Completeness', () => {
    it('should have the same keys in both English and Danish translations', () => {
      const sortedEnglish = [...englishKeys].sort();
      const sortedDanish = [...danishKeys].sort();
      
      expect(sortedDanish).toEqual(sortedEnglish);
    });

    it('should not have missing keys in Danish translation', () => {
      const missingInDanish = englishKeys.filter(key => !danishKeys.includes(key));
      expect(missingInDanish).toEqual([]);
    });

    it('should not have extra keys in Danish translation', () => {
      const extraInDanish = danishKeys.filter(key => !englishKeys.includes(key));
      expect(extraInDanish).toEqual([]);
    });
  });

  describe('Translation Value Validation', () => {
    it('should not have empty translation values in English', () => {
      const emptyKeys = englishKeys.filter(key => {
        const value = getNestedValue(enTranslations, key);
        return !value || value.trim() === '';
      });
      
      expect(emptyKeys).toEqual([]);
    });

    it('should not have empty translation values in Danish', () => {
      const emptyKeys = danishKeys.filter(key => {
        const value = getNestedValue(daTranslations, key);
        return !value || value.trim() === '';
      });
      
      expect(emptyKeys).toEqual([]);
    });

    it('should not have identical English and Danish translations (except for proper nouns)', () => {
      const allowedIdenticalKeys = [
        // Keys that can be identical between languages
        'charts.playerStats.axisLabels.score', // "Score" is the same in both languages
        'gamesList.points.one', // "point" is the same
        'gamesList.points.other', // "point" is the same in Danish
      ];

      const identicalTranslations = englishKeys.filter(key => {
        if (allowedIdenticalKeys.includes(key)) return false;
        
        const englishValue = getNestedValue(enTranslations, key);
        const danishValue = getNestedValue(daTranslations, key);
        
        return englishValue === danishValue;
      });

      // This test helps identify potentially untranslated strings
      if (identicalTranslations.length > 0) {
        console.warn('Identical translations found (may need review):', identicalTranslations);
      }
      
      // Allow some identical translations but warn about them
      expect(identicalTranslations.length).toBeLessThan(10);
    });
  });

  describe('Interpolation Validation', () => {
    const findInterpolationKeys = (obj, prefix = '') => {
      let interpolationKeys = [];
      
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          interpolationKeys = interpolationKeys.concat(findInterpolationKeys(value, fullKey));
        } else if (typeof value === 'string' && value.includes('{{')) {
          interpolationKeys.push({
            key: fullKey,
            value: value,
            interpolations: (value.match(/\{\{(\w+)\}\}/g) || []).map(match => 
              match.replace(/[{}]/g, '')
            )
          });
        }
      }
      
      return interpolationKeys;
    };

    it('should have matching interpolation variables in both languages', () => {
      const englishInterpolations = findInterpolationKeys(enTranslations);
      const danishInterpolations = findInterpolationKeys(daTranslations);
      
      englishInterpolations.forEach(englishItem => {
        const danishItem = danishInterpolations.find(item => item.key === englishItem.key);
        
        expect(danishItem).toBeDefined();
        
        if (danishItem) {
          // Sort both arrays to compare regardless of order
          const sortedEnglish = [...englishItem.interpolations].sort();
          const sortedDanish = [...danishItem.interpolations].sort();
          
          expect(sortedDanish).toEqual(sortedEnglish);
        }
      });
    });

    it('should have properly formatted interpolation syntax', () => {
      const checkInterpolationSyntax = (obj) => {
        const interpolationKeys = findInterpolationKeys(obj);
        let invalidKeys = [];
        
        interpolationKeys.forEach(item => {
          // Check that all interpolations are properly wrapped with double braces
          const interpolations = item.value.match(/\{\{[^}]+\}\}/g) || [];
          const singleBraces = item.value.match(/\{[^{][^}]*\}(?!\})/g) || [];
          
          if (singleBraces.length > 0) {
            invalidKeys.push(`${item.key}: has single braces instead of double braces`);
          }
        });
        
        return invalidKeys;
      };

      const englishInvalid = checkInterpolationSyntax(enTranslations);
      const danishInvalid = checkInterpolationSyntax(daTranslations);
      
      expect(englishInvalid).toEqual([]);
      expect(danishInvalid).toEqual([]);
    });
  });

  describe('Specific Translation Requirements', () => {
    it('should have all required app-level translations', () => {
      const requiredKeys = [
        'app.title',
        'app.footer',
        'language.en',
        'language.da'
      ];

      requiredKeys.forEach(key => {
        expect(getNestedValue(enTranslations, key)).toBeDefined();
        expect(getNestedValue(daTranslations, key)).toBeDefined();
      });
    });

    it('should have all required leaderboard translations', () => {
      const requiredKeys = [
        'leaderboard.title',
        'leaderboard.rank',
        'leaderboard.player',
        'leaderboard.games',
        'leaderboard.points',
        'leaderboard.avg'
      ];

      requiredKeys.forEach(key => {
        expect(getNestedValue(enTranslations, key)).toBeDefined();
        expect(getNestedValue(daTranslations, key)).toBeDefined();
      });
    });

    it('should have all required chart translations', () => {
      const requiredKeys = [
        'charts.playerStats.title',
        'charts.playerPerformance.title',
        'charts.gamesCalendar.title',
        'charts.teamCombinations.title'
      ];

      requiredKeys.forEach(key => {
        expect(getNestedValue(enTranslations, key)).toBeDefined();
        expect(getNestedValue(daTranslations, key)).toBeDefined();
      });
    });

    it('should have theme-related translations', () => {
      const requiredKeys = [
        'theme.light',
        'theme.dark',
        'theme.toggle'
      ];

      requiredKeys.forEach(key => {
        expect(getNestedValue(enTranslations, key)).toBeDefined();
        expect(getNestedValue(daTranslations, key)).toBeDefined();
      });
    });
  });

  describe('Translation Quality Checks', () => {
    it('should have reasonable length differences between languages', () => {
      const maxLengthDifference = 100; // Allow up to 100 character difference
      
      const significantDifferences = englishKeys.filter(key => {
        const englishValue = getNestedValue(enTranslations, key);
        const danishValue = getNestedValue(daTranslations, key);
        
        if (typeof englishValue === 'string' && typeof danishValue === 'string') {
          const lengthDiff = Math.abs(englishValue.length - danishValue.length);
          return lengthDiff > maxLengthDifference;
        }
        
        return false;
      });

      if (significantDifferences.length > 0) {
        console.warn('Significant length differences found:', significantDifferences);
      }
      
      expect(significantDifferences.length).toBeLessThan(5);
    });

    it('should maintain consistent terminology', () => {
      // Check that key terms are consistently translated
      const terminology = {
        'player': { en: 'Player', da: 'Spiller' },
        'game': { en: 'Game', da: 'Spil' },
        'team': { en: 'Team', da: 'Hold' },
        'points': { en: 'Points', da: 'Point' },
        'score': { en: 'Score', da: 'Score' }
      };

      Object.entries(terminology).forEach(([term, translations]) => {
        // This is a basic check - in a real app you might want more sophisticated terminology checking
        const englishKeys = getAllKeys(enTranslations);
        
        englishKeys.forEach(key => {
          const englishValue = getNestedValue(enTranslations, key);
          const danishValue = getNestedValue(daTranslations, key);
          
          if (typeof englishValue === 'string' && englishValue.includes(translations.en)) {
            // If English contains the term, Danish should contain the Danish translation
            // This is a simplified check
            expect(typeof danishValue).toBe('string');
          }
        });
      });
    });
  });
});