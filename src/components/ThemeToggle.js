import React from 'react';
import { ThemeContext } from '../utils/ThemeContext';
import { useTranslation } from 'react-i18next';

const ThemeToggle = () => {
  const { theme, toggleTheme } = React.useContext(ThemeContext);
  const { t } = useTranslation();
  
  return (
    <button 
      onClick={toggleTheme} 
      className="btn btn-sm theme-toggle-btn"
      title={t('theme.toggle', { mode: t(`theme.${theme === 'light' ? 'dark' : 'light'}`) })}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;
