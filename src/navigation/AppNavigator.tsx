import React, { useState, useEffect } from 'react';
import { Theme as NavTheme } from '@react-navigation/native';
import { 
  createNativeStackNavigator, 
  NativeStackNavigationOptions,
  NativeStackNavigationProp 
} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../constants/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, StyleSheet, useColorScheme } from 'react-native';

export type RootStackParamList = {
  MainTabs: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  QuizPlay: { quizId: string };
  QuizResults: { result: any };
  Categories: undefined;
  QuizList: { 
    categoryId: string;
    title: string;
  };
  Home: undefined;
  Profile: undefined;
  Leaderboard: undefined;
  CreateQuiz: undefined;
};

export type MainTabsParamList = {
  Home: undefined;
  Leaderboard: undefined;
  CreateQuiz: undefined;
  Profile: undefined;
};

// Define route names
export const APP_ROUTES = {
  MAIN_TABS: 'MainTabs',
  ONBOARDING: 'Onboarding',
  LOGIN: 'Login',
  REGISTER: 'Register',
  QUIZ_PLAY: 'QuizPlay',
  QUIZ_RESULTS: 'QuizResults',
  CATEGORIES: 'Categories',
  QUIZ_LIST: 'QuizList',
  HOME: 'Home',
  PROFILE: 'Profile',
  LEADERBOARD: 'Leaderboard',
  CREATE_QUIZ: 'CreateQuiz',
};

const AUTH_ROUTES = {
  ONBOARDING: 'Onboarding',
  LOGIN: 'Login',
  REGISTER: 'Register',
};

const SCREEN_OPTIONS: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'slide_from_right' as const,
};

// Import screens
import HomeScreen from '../screens/home/HomeScreen';
import CategoriesScreen from '../screens/categories/CategoriesScreen';
import QuizListScreen from '../screens/quiz/QuizListScreen';
import QuizPlayScreen from '../screens/quiz/QuizPlayScreen';
import QuizResultsScreen from '../screens/quiz/QuizResultsScreen';

// Mock screens with proper typing
const OnboardingScreen = () => null;
const LoginScreen = () => null;
const RegisterScreen = () => null;

// Screens are imported from their respective files

const ProfileScreen = () => null;
const LeaderboardScreen = () => null;

const LoadingScreen = () => null;

// Merge route params with the main RootStackParamList
type AppRootStackParamList = RootStackParamList & {
  [APP_ROUTES.MAIN_TABS]: undefined;
  [APP_ROUTES.ONBOARDING]: undefined;
  [APP_ROUTES.LOGIN]: undefined;
  [APP_ROUTES.REGISTER]: undefined;
  [APP_ROUTES.QUIZ_PLAY]: { quizId: string; title?: string };
  [APP_ROUTES.QUIZ_RESULTS]: { result: any };
};

const Stack = createNativeStackNavigator<AppRootStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

// Auth Stack Navigator
const AuthStack = () => (
  <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
    <Stack.Screen 
      name={AUTH_ROUTES.ONBOARDING} 
      component={OnboardingScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name={AUTH_ROUTES.LOGIN} 
      component={LoginScreen} 
      options={{ title: 'Sign In' }}
    />
    <Stack.Screen 
      name={AUTH_ROUTES.REGISTER} 
      component={RegisterScreen} 
      options={{ title: 'Create Account' }}
    />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => {
  const theme = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }: TabBarIconProps) => {
          let iconName = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Leaderboard') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'CreateQuiz') {
            return (
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: theme.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 8,
                  elevation: 5,
                }}
              >
                <Icon name="add" size={size} color="white" />
              </View>
            );
          }
          
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarShowLabel: false,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen 
        name="CreateQuiz" 
        component={View} // Replace with actual CreateQuizScreen
        options={{
          tabBarButton: (props) => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: theme.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 8,
                  elevation: 5,
                }}
              >
                <Icon name="add" size={24} color="white" />
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const [isAuthenticated] = useState(true); // Replace with actual auth check
  const [isLoading] = useState(false); // Replace with actual loading state
  const [initializing, setInitializing] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    // Simulate some initialization
    const timer = setTimeout(() => {
      setInitializing(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || initializing) {
    return <LoadingScreen />;
  }

  // NavigationContainer is now handled in App.tsx
  return (
    <Stack.Navigator 
      screenOptions={{
        ...SCREEN_OPTIONS,
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
      initialRouteName={isAuthenticated ? APP_ROUTES.MAIN_TABS : APP_ROUTES.ONBOARDING}
    >
      {isAuthenticated ? (
        // User is signed in
        <>
          <Stack.Screen 
            name={APP_ROUTES.MAIN_TABS} 
            component={MainTabs} 
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name={APP_ROUTES.QUIZ_PLAY} 
            component={QuizPlayScreen} 
            options={{
              title: 'Quiz',
              headerBackTitle: 'Back',
            }}
          />
          <Stack.Screen 
            name={APP_ROUTES.QUIZ_RESULTS} 
            component={QuizResultsScreen} 
            options={{
              title: 'Quiz Results',
              headerBackTitle: 'Back',
            }}
          />
          <Stack.Screen 
            name={APP_ROUTES.CATEGORIES} 
            component={CategoriesScreen} 
            options={{
              title: 'Categories',
              headerBackTitle: 'Back',
            }}
          />
          <Stack.Screen 
            name={APP_ROUTES.QUIZ_LIST} 
            component={QuizListScreen} 
            options={({ route }) => ({
              title: route.params?.title || 'Quizzes',
              headerBackTitle: 'Back',
            })}
          />
        </>
      ) : (
        // User is not signed in
        <>
          <Stack.Screen 
            name={APP_ROUTES.ONBOARDING} 
            component={OnboardingScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name={APP_ROUTES.LOGIN} 
            component={LoginScreen} 
            options={{ title: 'Sign In' }}
          />
          <Stack.Screen 
            name={APP_ROUTES.REGISTER} 
            component={RegisterScreen} 
            options={{ title: 'Create Account' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppNavigator;
