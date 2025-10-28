import React from 'react';
import { useTranslation } from 'react-i18next';
import Logger from '../utils/logger';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  
  const changeLanguage = (lng) => {
    const previousLanguage = i18n.language;
    Logger.userAction('language_change', {
      fromLanguage: previousLanguage,
      toLanguage: lng
    });
    i18n.changeLanguage(lng);
  };
  
  return (
    <div className="language-selector">
      <div className="btn-group btn-group-sm" role="group" aria-label="Language Selector">
        <button 
          type="button" 
          className={`btn ${i18n.language === 'en' ? 'btn-light' : 'btn-outline-light'}`}
          onClick={() => changeLanguage('en')}
          title={t('language.en')}
        >
          🇬🇧 EN
        </button>
        <button 
          type="button" 
          className={`btn ${i18n.language === 'da' ? 'btn-light' : 'btn-outline-light'}`}
          onClick={() => changeLanguage('da')}
          title={t('language.da')}
        >
          🇩🇰 DA
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;
