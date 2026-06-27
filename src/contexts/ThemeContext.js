/**
 * ThemeContext — wraps the static theme system so future enhancements
 * (dark mode, user theme prefs) can be layered in without touching every
 * screen.
 */
import React, {createContext, useContext, useMemo, useState} from 'react';
import {colors as lightColors, gradients, spacing, radii, layout, typography} from '@theme/index';

const ThemeContext = createContext(null);

export function ThemeProvider({children}) {
  const [mode, setMode] = useState('light'); // future: 'dark'

  const value = useMemo(
    () => ({
      mode,
      setMode,
      colors: lightColors, // swap to darkColors here later
      gradients,
      spacing,
      radii,
      layout,
      typography,
    }),
    [mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
}
