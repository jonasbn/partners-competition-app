import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslation from './locales/en.js';
import daTranslation from './locales/da.js';

// Stable React 18 + i18next configuration
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'da',
    fallbackLng: 'da',
    
    resources: {
      en: { translation: enTranslation },
      da: { translation: daTranslation }
    },
    
    ns: ['translation'],
    defaultNS: 'translation',
    keySeparator: '.',
    
    interpolation: {
      escapeValue: false
    },
    
    // React 18 compatible settings
    react: {
      useSuspense: false
    },
    
    debug: false
  });

export default i18n;
