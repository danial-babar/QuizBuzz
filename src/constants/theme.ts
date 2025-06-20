import { useColorScheme } from 'react-native';

export interface Theme {
  // Base colors
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  primary: string;
  border: string;
  error: string;
  
  // Additional theme colors
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

export const lightTheme: Theme = {
  // Base colors
  background: '#F5F7FA',
  card: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#666666',
  primary: '#4A6CF7',
  border: '#E0E0E0',
  error: '#FF3B30',
  
  // Theme colors
  tabBar: '#FFFFFF',
  tabBarActive: '#4A6CF7',
  tabBarInactive: '#9E9E9E',
  header: '#4A6CF7',
  headerText: '#FFFFFF',
  inputBackground: '#F5F7FA',
  inputText: '#1A1A1A',
  inputPlaceholder: '#9E9E9E',
  buttonPrimary: '#4A6CF7',
  buttonPrimaryText: '#FFFFFF',
  buttonSecondary: '#E0E0E0',
  buttonSecondaryText: '#1A1A1A',
  buttonDisabled: '#E0E0E0',
  buttonDisabledText: '#9E9E9E',
  shadow: 'rgba(0, 0, 0, 0.1)',
  separator: '#E0E0E0',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const darkTheme: Theme = {
  // Base colors
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  primary: '#6B8CFF',
  border: '#2C2C2C',
  error: '#FF6B6B',
  
  // Theme colors
  tabBar: '#1E1E1E',
  tabBarActive: '#6B8CFF',
  tabBarInactive: '#757575',
  header: '#1E1E1E',
  headerText: '#FFFFFF',
  inputBackground: '#2C2C2C',
  inputText: '#FFFFFF',
  inputPlaceholder: '#757575',
  buttonPrimary: '#6B8CFF',
  buttonPrimaryText: '#FFFFFF',
  buttonSecondary: '#2C2C2C',
  buttonSecondaryText: '#FFFFFF',
  buttonDisabled: '#2C2C2C',
  buttonDisabledText: '#757575',
  shadow: 'rgba(0, 0, 0, 0.3)',
  separator: '#2C2C2C',
  overlay: 'rgba(0, 0, 0, 0.7)',
};

export const useTheme = (): Theme => {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkTheme : lightTheme;
};
