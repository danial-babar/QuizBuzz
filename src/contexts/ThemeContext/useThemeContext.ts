import { useTheme } from './ThemeContext';

export { useTheme };

// This is a re-export of the useTheme hook for better organization
// You can also add additional theme-related hooks here if needed

// Example of additional hooks that could be added later:
/*
// Hook to get only the theme colors
export const useThemeColors = () => {
  const { theme } = useTheme();
  return theme;
};

// Hook to check if dark mode is active
export const useIsDarkMode = () => {
  const { isDark } = useTheme();
  return isDark;
};

// Hook to get the current theme mode (light/dark/system)
export const useThemeMode = () => {
  const { themeMode } = useTheme();
  return themeMode;
};
*/

// This file serves as a central export point for all theme-related hooks
// This pattern makes it easier to import hooks from a single location
export default {
  useTheme,
  // useThemeColors,
  // useIsDarkMode,
  // useThemeMode,
};
