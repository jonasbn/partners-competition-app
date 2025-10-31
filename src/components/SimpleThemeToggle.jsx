import React from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../utils/ThemeContext';

const SimpleThemeToggle = () => {
  const { t } = useTranslation();
  console.log('SimpleThemeToggle rendering...');
  
  const contextValue = React.useContext(ThemeContext);
  
  if (!contextValue) {
    console.error('SimpleThemeToggle must be used within ThemeProvider');
    return null;
  }
  
  const { theme, toggleTheme } = contextValue;
  
  const handleToggleTheme = () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      console.log('Theme toggle clicked - switching to:', newTheme);
      toggleTheme();
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };
  
  const getTooltipText = () => {
    return theme === 'light' 
      ? t('theme.toggle', { mode: t('theme.darkMode') })
      : t('theme.toggle', { mode: t('theme.lightMode') });
  };
  
  const getIcon = () => {
    return theme === 'light' ? '🌙' : '☀️';
  };
  
  return (
    <button 
      onClick={handleToggleTheme} 
      className="btn btn-outline-secondary btn-sm"
      title={getTooltipText()}
      type="button"
    >
      <span className="me-1">{getIcon()}</span>
      <span className="d-none d-md-inline">
        {theme === 'light' ? t('theme.dark') : t('theme.light')}
      </span>
    </button>
  );
};

export default SimpleThemeToggle;