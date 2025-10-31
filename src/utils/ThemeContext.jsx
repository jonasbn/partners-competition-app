import React from 'react';

// Create a context for theme management
export const ThemeContext = React.createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Check if theme preference is stored in localStorage
  const getInitialTheme = () => {
    // Guard against SSR/server-side rendering
    if (typeof window === 'undefined') {
      return 'light'; // Default for server-side rendering
    }
    
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        return savedTheme;
      }
    } catch (error) {
      // localStorage might not be available in some environments
      console.warn('localStorage not available:', error);
    }
    
    // Check if user prefers dark mode at OS level
    try {
      const prefersDark = window.matchMedia && 
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    } catch (error) {
      // matchMedia might not be available in some environments
      console.warn('matchMedia not available:', error);
      return 'light';
    }
  };

  const [theme, setTheme] = React.useState(getInitialTheme);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Save theme preference to localStorage when it changes
  React.useEffect(() => {
    // Guard against SSR/server-side rendering
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      // localStorage might not be available in some environments
      console.warn('Could not save theme to localStorage:', error);
    }
    
    // Apply theme class to the document body
    try {
      if (document && document.body) {
        if (theme === 'dark') {
          document.body.classList.add('dark-theme');
          document.body.classList.remove('light-theme');
        } else {
          document.body.classList.add('light-theme');
          document.body.classList.remove('dark-theme');
        }
      }
    } catch (error) {
      // document might not be available in some environments
      console.warn('Could not apply theme to document body:', error);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
