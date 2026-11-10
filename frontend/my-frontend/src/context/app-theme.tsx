import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

export type ColorSchemePreference = 'light' | 'dark' | 'system';

type AppThemeContextValue = {
  preference: ColorSchemePreference;
  colorScheme: 'light' | 'dark';
  setPreference: (next: ColorSchemePreference) => void;
  toggleLightDark: () => void;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [preference, setPreferenceState] =
    useState<ColorSchemePreference>('system');

  const colorScheme = useMemo<'light' | 'dark'>(() => {
    if (preference === 'system') {
      return systemScheme === 'dark' ? 'dark' : 'light';
    }
    return preference;
  }, [preference, systemScheme]);

  const setPreference = useCallback((next: ColorSchemePreference) => {
    setPreferenceState(next);
  }, []);

  const toggleLightDark = useCallback(() => {
    const next = colorScheme === 'dark' ? 'light' : 'dark';
    setPreference(next);
  }, [colorScheme, setPreference]);

  const value = useMemo(
    () => ({ preference, colorScheme, setPreference, toggleLightDark }),
    [preference, colorScheme, setPreference, toggleLightDark],
  );

  return (
    <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const ctx = useContext(AppThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within AppThemeProvider');
  }
  return ctx;
}
