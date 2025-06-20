import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme, ColorSchemeName, Appearance } from 'react-native';
import { colors, Colors } from '../../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors extends Colors {
  // Base colors
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  notification: string;
  
  // Additional theme-specific colors
  tabBar: string;
  tabBarActive: string;
  tabBarInactive: string;
  header: string;
  headerText: string;
  inputBackground: string;
  inputText: string;
  inputPlaceholder: string;
  buttonPrimary: string;
  buttonPrimaryText: string;
  buttonSecondary: string;
  buttonSecondaryText: string;
  buttonDisabled: string;
  buttonDisabledText: string;
  shadow: string;
  separator: string;
  overlay: string;
}

interface ThemeContextData {
  theme: ThemeColors;
  themeMode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const lightTheme: ThemeColors = {
  ...colors,
  // Base colors
  background: colors.lightGray,
  card: colors.white,
  text: colors.darkGray,
  textSecondary: colors.gray,
  border: colors.border,
  notification: colors.error,
  
  // Theme-specific colors
  tabBar: colors.white,
  tabBarActive: colors.primary,
  tabBarInactive: colors.gray,
  header: colors.primary,
  headerText: colors.white,
  inputBackground: colors.white,
  inputText: colors.darkGray,
  inputPlaceholder: colors.gray,
  buttonPrimary: colors.primary,
  buttonPrimaryText: colors.white,
  buttonSecondary: colors.secondary,
  buttonSecondaryText: colors.white,
  buttonDisabled: colors.lightGray,
  buttonDisabledText: colors.gray,
  shadow: 'rgba(0, 0, 0, 0.1)',
  separator: colors.borderLight,
  overlay: 'rgba(0, 0, 0, 0.5)',
};

const darkTheme: ThemeColors = {
  ...colors,
  // Base colors
  background: colors.black,
  card: colors.darkGray,
  text: colors.lightGray,
  textSecondary: colors.gray,
  border: colors.darkGray,
  notification: colors.error,
  
  // Theme-specific colors
  tabBar: colors.black,
  tabBarActive: colors.primaryLight,
  tabBarInactive: colors.gray,
  header: colors.black,
  headerText: colors.white,
  inputBackground: colors.darkGray,
  inputText: colors.lightGray,
  inputPlaceholder: colors.gray,
  buttonPrimary: colors.primary,
  buttonPrimaryText: colors.white,
  buttonSecondary: colors.secondary,
  buttonSecondaryText: colors.white,
  buttonDisabled: colors.gray,
  buttonDisabledText: colors.darkGray,
  shadow: 'rgba(0, 0, 0, 0.3)',
  separator: colors.gray,
  overlay: 'rgba(0, 0, 0, 0.7)',
};

const THEME_STORAGE_KEY = '@QuizBuzz:theme';

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isDark, setIsDark] = useState(false);
  
  // Load saved theme preference
  useEffect(() => {
    async function loadThemePreference() {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
        if (savedTheme) {
          setThemeModeState(savedTheme);
          updateIsDark(savedTheme, systemColorScheme);
        } else {
          // Default to system theme if no preference is saved
          updateIsDark('system', systemColorScheme);
        }
      } catch (error) {
        console.error('Failed to load theme preference', error);
        // Fallback to system theme
        updateIsDark('system', systemColorScheme);
      }
    }
    
    loadThemePreference();
  }, [systemColorScheme]);
  
  // Listen for system theme changes when in 'system' mode
  useEffect(() => {
    if (themeMode === 'system') {
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        updateIsDark('system', colorScheme);
      });
      
      return () => subscription.remove();
    }
  }, [themeMode]);
  
  const updateIsDark = (mode: ThemeMode, colorScheme: ColorSchemeName | null = systemColorScheme) => {
    if (mode === 'system') {
      setIsDark(colorScheme === 'dark');
    } else {
      setIsDark(mode === 'dark');
    }
  };
  
  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      updateIsDark(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Failed to save theme preference', error);
    }
  }, []);
  
  const toggleTheme = useCallback(() => {
    setThemeMode(isDark ? 'light' : 'dark');
  }, [isDark, setThemeMode]);
  
  // Get the current theme based on the mode and system preference
  const theme = isDark ? darkTheme : lightTheme;
  
  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        isDark,
        toggleTheme,
        setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextData {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

export default ThemeContext;
