// Authentication routes
export const AUTH_ROUTES = {
  ONBOARDING: 'Onboarding',
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
  RESET_PASSWORD: 'ResetPassword',
  VERIFICATION: 'Verification',
} as const;

// Main app routes
export const APP_ROUTES = {
  // Tab navigator
  MAIN_TABS: 'MainTabs',
  
  // Home stack
  HOME_STACK: 'HomeStack',
  HOME: 'Home',
  QUIZ_CATEGORY: 'QuizCategory',
  
  // Quiz stack
  QUIZ_STACK: 'QuizStack',
  QUIZ_PLAY: 'QuizPlay',
  QUIZ_RESULTS: 'QuizResults',
  QUIZ_CREATE: 'QuizCreate',
  QUIZ_DETAILS: 'QuizDetails',
  
  // Profile stack
  PROFILE_STACK: 'ProfileStack',
  PROFILE: 'Profile',
  EDIT_PROFILE: 'EditProfile',
  SETTINGS: 'Settings',
  ABOUT: 'About',
  
  // Leaderboard stack
  LEADERBOARD_STACK: 'LeaderboardStack',
  LEADERBOARD: 'Leaderboard',
  
  // Other screens
  NOTIFICATIONS: 'Notifications',
  SEARCH: 'Search',
  CATEGORY_QUIZZES: 'CategoryQuizzes',
} as const;

// Tab bar routes
export const TAB_ROUTES = {
  HOME_TAB: 'HomeTab',
  QUIZZES_TAB: 'QuizzesTab',
  CREATE_TAB: 'CreateTab',
  LEADERBOARD_TAB: 'LeaderboardTab',
  PROFILE_TAB: 'ProfileTab',
} as const;

// Modal routes
export const MODAL_ROUTES = {
  FILTER: 'FilterModal',
  SORT: 'SortModal',
  QUIZ_OPTIONS: 'QuizOptionsModal',
  REPORT: 'ReportModal',
  FEEDBACK: 'FeedbackModal',
} as const;

// Navigation parameters
export type RootStackParamList = {
  // Auth
  [AUTH_ROUTES.ONBOARDING]: undefined;
  [AUTH_ROUTES.LOGIN]: { email?: string } | undefined;
  [AUTH_ROUTES.REGISTER]: undefined;
  [AUTH_ROUTES.FORGOT_PASSWORD]: undefined;
  [AUTH_ROUTES.RESET_PASSWORD]: { token: string; email: string };
  [AUTH_ROUTES.VERIFICATION]: { email: string };
  
  // Main app
  [APP_ROUTES.MAIN_TABS]: undefined;
  [APP_ROUTES.HOME]: undefined;
  [APP_ROUTES.QUIZ_CATEGORY]: { categoryId: string; categoryName: string };
  [APP_ROUTES.QUIZ_PLAY]: { quizId: string; title?: string };
  [APP_ROUTES.QUIZ_RESULTS]: { quizId: string; score: number; totalQuestions: number };
  [APP_ROUTES.QUIZ_CREATE]: undefined;
  [APP_ROUTES.QUIZ_DETAILS]: { quizId: string };
  [APP_ROUTES.PROFILE]: { userId?: string };
  [APP_ROUTES.EDIT_PROFILE]: undefined;
  [APP_ROUTES.SETTINGS]: undefined;
  [APP_ROUTES.ABOUT]: undefined;
  [APP_ROUTES.LEADERBOARD]: { timeRange?: 'daily' | 'weekly' | 'monthly' | 'alltime' };
  [APP_ROUTES.NOTIFICATIONS]: undefined;
  [APP_ROUTES.SEARCH]: undefined;
  [APP_ROUTES.CATEGORY_QUIZZES]: { categoryId: string; title: string };
  
  // Modals
  [MODAL_ROUTES.FILTER]: { onApply: (filters: any) => void; initialFilters?: any };
  [MODAL_ROUTES.SORT]: { onSelect: (sortOption: string) => void; currentSort?: string };
  [MODAL_ROUTES.QUIZ_OPTIONS]: { quizId: string; isOwner: boolean; onEdit?: () => void; onDelete?: () => void };
  [MODAL_ROUTES.REPORT]: { contentType: 'quiz' | 'comment' | 'user'; contentId: string };
  [MODAL_ROUTES.FEEDBACK]: undefined;
};

// Tab bar icons
export const TAB_ICONS = {
  [TAB_ROUTES.HOME_TAB]: { focused: 'home', unfocused: 'home-outline' },
  [TAB_ROUTES.QUIZZES_TAB]: { focused: 'book', unfocused: 'book-outline' },
  [TAB_ROUTES.CREATE_TAB]: { focused: 'add-circle', unfocused: 'add-circle-outline' },
  [TAB_ROUTES.LEADERBOARD_TAB]: { focused: 'trophy', unfocused: 'trophy-outline' },
  [TAB_ROUTES.PROFILE_TAB]: { focused: 'person', unfocused: 'person-outline' },
} as const;

// Screen options
export const SCREEN_OPTIONS = {
  headerShown: false,
  gestureEnabled: true,
  cardStyle: { backgroundColor: '#FFFFFF' },
  cardOverlayEnabled: true,
  cardStyleInterpolator: ({ current: { progress } }: any) => ({
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 0.5, 0.9, 1],
        outputRange: [0, 0.25, 0.7, 1],
      }),
    },
    overlayStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
        extrapolate: 'clamp',
      }),
    },
  }),
} as const;

export default {
  ...AUTH_ROUTES,
  ...APP_ROUTES,
  ...TAB_ROUTES,
  ...MODAL_ROUTES,
  TAB_ICONS,
  SCREEN_OPTIONS,
};
