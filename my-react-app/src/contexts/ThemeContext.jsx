'use client';

import { createContext, useContext, useState, useCallback } from 'react';

export const THEMES = ['light', 'dark', 'sunset', 'ocean', 'forest', 'midnight'];

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  ripple: null,
});

export function ThemeProvider({ children, initialTheme }) {
  const [theme, setTheme] = useState(initialTheme || 'light');
  const [ripple, setRipple] = useState(null);

  const toggleTheme = useCallback((e) => {
    const idx = THEMES.indexOf(theme);
    const nextTheme = THEMES[(idx + 1) % THEMES.length];

    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('portfolio-theme', nextTheme);

    if (e && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      setRipple({ x, y });
      setTimeout(() => setRipple(null), 800);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, ripple }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
