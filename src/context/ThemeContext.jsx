// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\context\ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('ascend_theme') || 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (themeName) => {
      // Clear previous theme overrides
      root.classList.remove('light');
      
      if (themeName === 'light') {
        root.classList.add('light');
      } else if (themeName === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (!systemPrefersDark) {
          root.classList.add('light');
        }
      }
    };

    applyTheme(theme);
    localStorage.setItem('ascend_theme', theme);

    // If theme is system, listen to media query changes
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = (e) => {
        root.classList.remove('light');
        if (!e.matches) {
          root.classList.add('light');
        }
      };
      
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }
  }, [theme]);

  const setTheme = (newTheme) => {
    if (['dark', 'light', 'system'].includes(newTheme)) {
      setThemeState(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
