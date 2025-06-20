import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer, Theme as NavTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { lightTheme, darkTheme } from './src/constants/theme';

function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  const navTheme: NavTheme = {
    dark: colorScheme === 'dark',
    colors: {
      primary: theme.primary,
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.border,
      notification: theme.primary,
    },
  };
  
  const navigationContainerTheme = {
    ...navTheme,
    colors: {
      ...navTheme.colors,
      // Add any additional theme colors needed by the navigation container
    },
  };

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background} 
      />
      <NavigationContainer theme={navigationContainerTheme}>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
