import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, Theme } from '../constants/theme';

export const useTheme = (): Theme => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return isDark ? darkTheme : lightTheme;
};
