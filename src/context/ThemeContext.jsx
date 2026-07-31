// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\context\ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeModeState] = useState(() => {
    try {
      const raw = localStorage.getItem('ascend_theme_v2');
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.mode || 'system';
      }
      const legacy = localStorage.getItem('ascend_theme');
      if (legacy) return legacy;
    } catch (e) {}
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (mode) => {
      let isDark = true;
      if (mode === 'light') {
        isDark = false;
      } else if (mode === 'dark') {
        isDark = true;
      } else {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      
      const resolved = isDark ? 'dark' : 'light';
      setResolvedTheme(resolved);

      root.classList.remove('light', 'dark');
      if (!isDark) {
        root.classList.add('light');
      } else {
        root.classList.add('dark');
      }

      localStorage.setItem('ascend_theme_v2', JSON.stringify({
        mode: mode,
        resolved: resolved
      }));
    };

    applyTheme(themeMode);

    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        applyTheme('system');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode]);

  const setTheme = (newTheme) => {
    if (['dark', 'light', 'system'].includes(newTheme)) {
      setThemeModeState(newTheme);
    }
  };

  const toggleTheme = () => {
    if (themeMode === 'dark') setTheme('light');
    else if (themeMode === 'light') setTheme('system');
    else setTheme('dark');
  };

  return (
    <ThemeContext.Provider value={{ theme: themeMode, resolvedTheme, setTheme, toggleTheme }}>
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
