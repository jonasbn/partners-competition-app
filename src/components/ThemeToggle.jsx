import React from 'react';
import { ThemeContext } from '../utils/ThemeContext';
import { useTranslation } from 'react-i18next';
import Logger from '../utils/logger';

const ThemeToggle = () => {
  const { theme, toggleTheme } = React.useContext(ThemeContext);
  const { t } = useTranslation();
  
  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    Logger.userAction('theme_toggle', {
      fromTheme: theme,
      toTheme: newTheme
    });
    toggleTheme();
  };
  
  return (
    <button 
      onClick={handleToggleTheme} 
      className="btn btn-sm theme-toggle-btn"
      title={t('theme.toggle', { mode: t(`theme.${theme === 'light' ? 'dark' : 'light'}`) })}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;
