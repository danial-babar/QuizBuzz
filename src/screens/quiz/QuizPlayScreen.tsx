import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../constants/theme';
import { APP_ROUTES } from '../../constants/routes';

// Types
type QuizPlayScreenRouteProp = {
  key: string;
  name: string;
  params: {
    quizId: string;
  };
};

type Answer = {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timeTaken: number;
};

type Option = {
  id: string;
  text: string;
};

type Question = {
  id: string;
  text: string;
  options: Option[];
  correctAnswer: string;
};

type Quiz = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  questions: Question[];
};

// Mock quiz data - replace with actual API call
const mockQuiz: Quiz = {
  id: '1',
  title: 'General Knowledge Challenge',
  description: 'Test your general knowledge with this fun quiz!',
  category: 'general',
  difficulty: 'medium',
  timeLimit: 300, // 5 minutes in seconds
  questions: [
    {
      id: '1',
      text: 'What is the capital of France?',
      options: [
        { id: '1', text: 'London' },
        { id: '2', text: 'Paris' },
        { id: '3', text: 'Berlin' },
        { id: '4', text: 'Madrid' }
      ],
      correctAnswer: '2'
    },
    {
      id: '2',
      text: 'Which planet is known as the Red Planet?',
      options: [
        { id: '1', text: 'Venus' },
        { id: '2', text: 'Mars' },
        { id: '3', text: 'Jupiter' },
        { id: '4', text: 'Saturn' }
      ],
      correctAnswer: '2'
    }
  ]
};

const QuizPlayScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<QuizPlayScreenRouteProp>();
  const theme = useTheme();
  
  const { quizId } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(mockQuiz.timeLimit);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load quiz data (in a real app, this would be an API call)
  useEffect(() => {
    startTimer();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeUp = () => {
    Alert.alert('Time\'s up!', 'Your time is up. Submitting your answers...', [
      { text: 'OK', onPress: () => handleSubmit(answers) },
    ]);
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    const currentQuestion = mockQuiz.questions[currentQuestionIndex];
    const newAnswers = [
      ...answers,
      {
        questionId: currentQuestion.id,
        selectedOptionId: selectedOption,
        isCorrect: selectedOption === currentQuestion.correctAnswer,
        timeTaken: mockQuiz.timeLimit - timeLeft,
      },
    ];

    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQuestionIndex < mockQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(mockQuiz.timeLimit);
    } else {
      handleSubmit(newAnswers);
    }
  };

  const handleSubmit = (answersToSubmit: Answer[]) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const score = answersToSubmit.filter(a => a.isCorrect).length;
    const totalQuestions = mockQuiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const totalTimeTaken = answersToSubmit.reduce((sum, a) => sum + a.timeTaken, 0);

    const result = {
      quizId: quizId,
      score: percentage,
      totalQuestions,
      correctAnswers: score,
      timeTaken: totalTimeTaken,
      answers: answersToSubmit,
    };

    // @ts-ignore
    navigation.navigate(APP_ROUTES.QUIZ_RESULTS, { result });
  };

  const currentQuestion = mockQuiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / mockQuiz.questions.length) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formatTime = (time: number) => {
    return time < 10 ? `0${time}` : time.toString();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      
      {/* Header with timer and question count */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <View style={styles.timerContainer}>
          <Icon name="time-outline" size={20} color={theme.text} />
          <Text style={[styles.timer, { color: theme.text }]}>
            {formatTime(minutes)}:{formatTime(seconds)}
          </Text>
        </View>
        <Text style={[styles.questionCount, { color: theme.textSecondary }]}>
          {currentQuestionIndex + 1}/{mockQuiz.questions.length}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { 
              width: `${progress}%`,
              backgroundColor: theme.primary,
            }
          ]} 
        />
      </View>

      {/* Question and options */}
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.question, { color: theme.text }]}>
          {currentQuestion.text}
        </Text>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.option,
                {
                  backgroundColor: 
                    selectedOption === option.id 
                      ? `${theme.primary}20` 
                      : theme.card,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => handleOptionSelect(option.id)}
              activeOpacity={0.7}
            >
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionText, { color: theme.text }]}>
                  {option.text}
                </Text>
              </View>
              {selectedOption === option.id && (
                <Icon 
                  name="checkmark-circle" 
                  size={24} 
                  color={theme.primary} 
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer with next/submit button */}
      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            { 
              backgroundColor: !selectedOption ? `${theme.primary}80` : theme.primary,
              opacity: !selectedOption ? 0.7 : 1,
            }
          ]}
          onPress={handleNext}
          disabled={!selectedOption}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {currentQuestionIndex === mockQuiz.questions.length - 1
              ? 'Submit Quiz'
              : 'Next Question'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timer: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  questionCount: {
    fontSize: 16,
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 4,
    width: '100%',
    backgroundColor: '#f0f0f0',
  },
  progressBar: {
    height: '100%',
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  question: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 30,
    lineHeight: 30,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  optionTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  nextButton: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuizPlayScreen;
