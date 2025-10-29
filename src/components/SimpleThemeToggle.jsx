import React from 'react';
import { SimpleThemeContext } from '../utils/SimpleThemeContext';

const SimpleThemeToggle = () => {
  console.log('SimpleThemeToggle rendering...');
  
  const contextValue = React.useContext(SimpleThemeContext);
  
  if (!contextValue) {
    console.error('SimpleThemeToggle must be used within SimpleThemeProvider');
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
      ? 'Switch to dark mode' 
      : 'Switch to light mode';
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
        {theme === 'light' ? 'Dark' : 'Light'}
      </span>
    </button>
  );
};

export default SimpleThemeToggle;