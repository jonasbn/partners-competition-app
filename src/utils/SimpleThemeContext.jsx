import React from 'react';

// Create a context for theme management (i18n-free version)
export const SimpleThemeContext = React.createContext();

// Simple theme provider component without i18n dependencies
export const SimpleThemeProvider = ({ children }) => {
  console.log('SimpleThemeProvider initializing...');
  
  // Check if theme preference is stored in localStorage
  const getInitialTheme = () => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        console.log('Loaded saved theme:', savedTheme);
        return savedTheme;
      }
      
      // Check if user prefers dark mode at OS level
      const prefersDark = window.matchMedia && 
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme = prefersDark ? 'dark' : 'light';
      console.log('Using default theme based on OS preference:', defaultTheme);
      return defaultTheme;
    } catch (error) {
      console.error('Error getting initial theme:', error);
      return 'light'; // Safe fallback
    }
  };

  const [theme, setTheme] = React.useState(getInitialTheme);

  // Toggle theme function
  const toggleTheme = () => {
    console.log('Toggling theme from:', theme);
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      console.log('New theme:', newTheme);
      return newTheme;
    });
  };

  // Save theme preference to localStorage when it changes
  React.useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
      console.log('Theme saved to localStorage:', theme);
      
      // Apply theme class to the document body
      if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
        // Also add Bootstrap dark theme support
        document.body.setAttribute('data-bs-theme', 'dark');
      } else {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
        document.body.setAttribute('data-bs-theme', 'light');
      }
      console.log('Theme classes applied to body');
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  }, [theme]);

  const contextValue = {
    theme,
    toggleTheme
  };

  return (
    <SimpleThemeContext.Provider value={contextValue}>
      {children}
    </SimpleThemeContext.Provider>
  );
};

export default SimpleThemeProvider;