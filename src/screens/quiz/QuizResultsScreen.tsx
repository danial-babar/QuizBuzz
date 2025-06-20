import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Animated, 
  ScrollView, 
  Share, 
  Platform, 
  Easing,
  ViewStyle,
  TextStyle,
  ImageSourcePropType
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

// Define the navigation param types
type RootStackParamList = {
  QuizResults: {
    result: QuizResult;
  };
  QuizReview: {
    result: QuizResult;
  };
  Home: undefined;
};

type QuizResultsScreenRouteProp = RouteProp<RootStackParamList, 'QuizResults'>;

// Define types for the quiz result
interface QuizResult {
  quizId: string;
  quizTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  totalPossibleScore: number;
  percentage: number;
  timeSpent: number;
  answers: Array<{
    questionId: string;
    optionId: string;
    isCorrect: boolean;
    timeTaken: number;
  }>;
  completedAt: string;
}

// Define theme interface
interface Theme {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  primary: string;
  border: string;
  error: string;
}

// Mock theme context
const useTheme = (): { theme: Theme } => ({
  theme: {
    background: '#FFFFFF',
    card: '#F8F9FA',
    text: '#212529',
    textSecondary: '#6C757D',
    primary: '#4A6CF7',
    border: '#E9ECEF',
    error: '#DC3545',
  },
});

// Mock Header component
const Header = ({ title, onBack, rightComponent }: { 
  title: string; 
  onBack?: () => void;
  rightComponent?: React.ReactNode;
}) => (
  <View style={styles.headerContainer}>
    {onBack && (
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Icon name="checkmark" size={16} color="white" />
      </TouchableOpacity>
    )}
    <Text style={styles.headerTitle}>{title}</Text>
    <View style={styles.rightComponent}>
      {rightComponent}
    </View>
  </View>
);

// Styles for the AppButton component
const buttonStyles = StyleSheet.create({
  appButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
  },
  primaryButton: {
    backgroundColor: '#4A6CF7',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4A6CF7',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  outlineButtonText: {
    color: '#4A6CF7',
  },
  buttonIcon: {
    marginRight: 8,
  },
});

// AppButton Component
interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  icon?: React.ReactNode;
  style?: ViewStyle;
  disabled?: boolean;
}

const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  icon,
  style,
  disabled = false,
}) => (
  <TouchableOpacity
    style={[
      buttonStyles.appButton,
      variant === 'primary' ? buttonStyles.primaryButton : buttonStyles.outlineButton,
      style,
      disabled && buttonStyles.disabledButton,
    ]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.7}
  >
    {icon}
    <Text
      style={[
        buttonStyles.buttonText,
        variant === 'primary' ? buttonStyles.primaryButtonText : buttonStyles.outlineButtonText,
      ]}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

// Mock APP_ROUTES
const APP_ROUTES = {
  QUIZ_REVIEW: 'QuizReview',
  HOME: 'Home',
};

// Result illustration components using vector icons
const ResultIllustration = ({ type, size = 100, color }: { type: 'trophy' | 'success' | 'average' | 'try-again', size?: number, color: string }) => {
  switch (type) {
    case 'trophy':
      return <Icon name="trophy" size={size} color={color} />;
    case 'success':
      return <Icon name="checkmark-circle" size={size} color={color} />;
    case 'average':
      return <Icon name="stats-chart" size={size} color={color} />;
    case 'try-again':
      return <Icon name="refresh-circle" size={size} color={color} />;
    default:
      return <Icon name="help-circle" size={size} color={color} />;
  }
};

// Result messages based on score percentage
const getResultData = (percentage: number) => {
  if (percentage >= 90) {
    return {
      title: 'Quiz Master!',
      message: 'Incredible! You\'re a true quiz master with exceptional knowledge!',
      illustration: 'trophy',
      color: '#FFD700', // Gold
    };
  } else if (percentage >= 75) {
    return {
      title: 'Great Job!',
      message: 'Excellent performance! You really know your stuff!',
      illustration: 'success',
      color: '#4CAF50', // Green
    };
  } else if (percentage >= 50) {
    return {
      title: 'Good Effort!',
      message: 'Not bad! With a little more practice, you\'ll be acing these quizzes!',
      illustration: 'average',
      color: '#2196F3', // Blue
    };
  } else {
    return {
      title: 'Keep Practicing!',
      message: 'You\'ll do better next time! Keep learning and try again!',
      illustration: 'try-again',
      color: '#FF9800', // Orange
    };
  }
};

const QuizResultsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<QuizResultsScreenRouteProp>();
  const { theme } = useTheme();
  const { result } = route.params;
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  
  const resultData = getResultData(result.percentage);
  const timePerQuestion = result.answers.length > 0 
    ? Math.round(
        result.answers.reduce<number>((sum, a) => sum + a.timeTaken, 0) / 
        result.answers.length
      )
    : 0;
  
  // Navigation functions
  const handleReview = (): void => {
    navigation.navigate(APP_ROUTES.QUIZ_REVIEW, { result });
  };

  const handleNewQuiz = (): void => {
    navigation.navigate(APP_ROUTES.HOME);
  };

  // Animate on mount
  useEffect(() => {
    // Haptic feedback
    if (Platform.OS === 'ios') {
      try {
        ReactNativeHapticFeedback.trigger('notificationSuccess');
      } catch (error) {
        console.log('Haptic feedback not available');
      }
    }
    
    // Fade in and scale up animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.elastic(1),
      }),
      Animated.timing(progressAnim, {
        toValue: result.percentage / 100,
        duration: 1500,
        useNativeDriver: false,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        delay: 300,
      }),
    ]).start();
  }, []);
  
  const handleShare = async (): Promise<void> => {
    try {
      const message = `I scored ${result.score}/${result.totalPossibleScore} (${result.percentage}%) on the ${result.quizTitle} quiz! Can you beat my score? #QuizBuzz`;
      await Share.share(
        {
          message,
          url: 'https://quizbuzz.app',
          title: 'My Quiz Score',
        },
        {
          dialogTitle: 'Share your quiz results',
          subject: 'My Quiz Score',
        }
      );
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Format time in seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Animated progress circle
  const AnimatedCircle: React.FC = () => {
    const radius = 100;
    const strokeWidth = 12;
    
    return (
      <View style={styles.progressCircleContainer}>
        <View 
          style={[
            styles.progressCircleBackground,
            { 
              width: radius * 2, 
              height: radius * 2,
              borderRadius: radius,
              borderWidth: strokeWidth,
              borderColor: `${theme.primary}20`,
            },
          ]} 
        />
        <Animated.View 
          style={[
            styles.progressCircle,
            { 
              width: radius * 2, 
              height: radius * 2,
              borderRadius: radius,
              transform: [{ rotate: '-90deg' }],
            },
          ]}
        >
          <Animated.View
            style={{
              width: radius * 2,
              height: radius * 2,
              borderRadius: radius,
              borderWidth: strokeWidth,
              borderLeftColor: 'transparent',
              borderBottomColor: 'transparent',
              borderRightColor: resultData.color || theme.primary,
              borderTopColor: resultData.color || theme.primary,
              transform: [{ 
                rotate: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg']
                }) 
              }],
            }}
          />
        </Animated.View>
        <View style={styles.progressCircleContent}>
          <Text style={[styles.scoreText, { color: theme.text }]}>
            {result.percentage}%
          </Text>
          <Text style={[styles.scoreLabel, { color: theme.textSecondary }]}>
            Score
          </Text>
        </View>
      </View>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header 
        title="Quiz Results"
        onBack={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity onPress={handleShare}>
            <Icon name="share-social-outline" size={24} color={theme.primary} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.header,
            { 
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.illustrationContainer}>
            <Animated.View
              style={[
                styles.illustration,
                { 
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <ResultIllustration 
                type={resultData.illustration} 
                size={120} 
                color={resultData.color || theme.primary} 
              />
            </Animated.View>
          </View>
          
          <Text style={[styles.resultTitle, { color: resultData.color || theme.primary }]}>
            {resultData.title}
          </Text>
          <Text style={[styles.resultMessage, { color: theme.textSecondary }]}>
            {resultData.message}
          </Text>
          
          <Animated.View style={[styles.scoreContainer, { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }]}>
            <AnimatedCircle />
          </Animated.View>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.statsContainer,
            { 
              backgroundColor: theme.card,
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>
                {result.correctAnswers}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Correct
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>
                {result.totalQuestions - result.correctAnswers}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Incorrect
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>
                {formatTime(result.timeSpent)}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Time
              </Text>
            </View>
          </View>
          
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          
          <View style={styles.additionalStats}>
            <View style={styles.additionalStat}>
              <Icon name="speedometer-outline" size={20} color={theme.textSecondary} />
              <View style={styles.additionalStatText}>
                <Text style={[styles.additionalStatLabel, { color: theme.textSecondary }]}>
                  Avg. time per question
                </Text>
                <Text style={[styles.additionalStatValue, { color: theme.text }]}>
                  {timePerQuestion}s
                </Text>
              </View>
            </View>
            
            <View style={styles.additionalStat}>
              <Icon name="trophy-outline" size={20} color={theme.textSecondary} />
              <View style={styles.additionalStatText}>
                <Text style={[styles.additionalStatLabel, { color: theme.textSecondary }]}>
                  Points earned
                </Text>
                <Text style={[styles.additionalStatValue, { color: theme.text }]}>
                  {result.score} / {result.totalPossibleScore}
                </Text>
              </View>
            </View>
            
            <View style={styles.additionalStat}>
              <Icon name="calendar-outline" size={20} color={theme.textSecondary} />
              <View style={styles.additionalStatText}>
                <Text style={[styles.additionalStatLabel, { color: theme.textSecondary }]}>
                  Completed on
                </Text>
                <Text style={[styles.additionalStatValue, { color: theme.text }]}>
                  {new Date(result.completedAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.actionsContainer,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <AppButton
            title="Review Answers"
            onPress={handleReview}
            variant="outline"
            icon={
              <Icon 
                name="document-text-outline" 
                size={20} 
                color={theme.primary} 
                style={styles.buttonIcon} 
              />
            }
            style={styles.actionButton}
          />
          
          <AppButton
            title="Take Another Quiz"
            onPress={handleNewQuiz}
            icon={
              <Icon 
                name="rocket-outline" 
                size={20} 
                color="white" 
                style={styles.buttonIcon} 
              />
            }
            style={{
              ...styles.actionButton,
              marginTop: 12
            } as ViewStyle}
          />
          
          <TouchableOpacity 
            style={[styles.shareButton, { backgroundColor: theme.card }]}
            onPress={handleShare}
          >
            <Icon name="share-social-outline" size={20} color={theme.primary} />
            <Text style={[styles.shareButtonText, { color: theme.primary }]}>
              Share Results
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  illustrationContainer: {
    width: 180,
    height: 180,
    marginBottom: 16,
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  resultMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  scoreContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  progressCircleContainer: {
    position: 'relative',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircleBackground: {
    position: 'absolute',
    borderWidth: 12,
    borderColor: '#F0F0F0',
  },
  progressCircle: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircleContent: {
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  statsContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  statDivider: {
    width: 1,
    height: 40,
    opacity: 0.5,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  additionalStats: {
    marginTop: 8,
  },
  additionalStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  additionalStatText: {
    marginLeft: 12,
    flex: 1,
  },
  additionalStatLabel: {
    fontSize: 13,
    marginBottom: 2,
  },
  additionalStatValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  actionButton: {
    width: '100%',
  },
  buttonIcon: {
    marginRight: 8,
  },
  // Header styles
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#4A6CF7',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
  },
  rightComponent: {
    width: 40,
    alignItems: 'flex-end',
  },
  // Share button styles
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default QuizResultsScreen;
