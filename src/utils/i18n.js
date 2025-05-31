import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslation from './locales/en.json';
import daTranslation from './locales/da.json';

// Configure i18next
i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    // Resources with translations
    resources: {
      en: {
        translation: enTranslation
      },
      da: {
        translation: daTranslation
      }
    },
    // Fallback language
    fallbackLng: 'en',
    // Debug mode in development
    debug: process.env.NODE_ENV === 'development',
    // Common namespace
    ns: ['translation'],
    defaultNS: 'translation',
    // Caching
    keySeparator: '.',
    interpolation: {
      escapeValue: false // React already safes from XSS
    }
  });

export default i18n;
