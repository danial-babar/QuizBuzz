import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTheme } from '../../constants/theme';
import { APP_ROUTES } from '../../constants/routes';
import { getQuizzesByCategory } from '../../services/quizService';
import Icon from 'react-native-vector-icons/Ionicons';

interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  timeLimit: number;
  image: any;
  category: string;
}

type QuizListRouteProp = {
  key: string;
  name: string;
  params: {
    categoryId: string;
    title: string;
  };
};

const QuizListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<QuizListRouteProp>();
  const theme = useTheme();
  
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { categoryId, title } = route.params;

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        const data = await getQuizzesByCategory(categoryId);
        setQuizzes(data);
      } catch (err) {
        setError('Failed to load quizzes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, [categoryId]);

  const handleQuizPress = (quizId: string) => {
    // @ts-ignore
    navigation.navigate(APP_ROUTES.QUIZ_PLAY, { quizId });
  };

  const renderQuizItem = ({ item }: { item: Quiz }) => (
    <TouchableOpacity
      style={[styles.quizCard, { backgroundColor: theme.card }]}
      onPress={() => handleQuizPress(item.id)}
    >
      <Image source={item.image} style={styles.quizImage} resizeMode="cover" />
      <View style={styles.quizContent}>
        <Text style={[styles.quizTitle, { color: theme.text }]}>{item.title}</Text>
        <Text style={[styles.quizDescription, { color: theme.textSecondary }]}>
          {item.description}
        </Text>
        <View style={styles.quizMeta}>
          <View style={styles.metaItem}>
            <Icon 
              name="list-outline" 
              size={16} 
              color={theme.textSecondary} 
              style={styles.metaIcon} 
            />
            <Text style={[styles.metaText, { color: theme.textSecondary }]}>
              {item.questionCount} Qs
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Icon 
              name="time-outline" 
              size={16} 
              color={theme.textSecondary} 
              style={styles.metaIcon} 
            />
            <Text style={[styles.metaText, { color: theme.textSecondary }]}>
              {item.timeLimit} min
            </Text>
          </View>
          <View 
            style={[
              styles.difficultyBadge, 
              { 
                backgroundColor: 
                  item.difficulty === 'easy' 
                    ? '#4CAF50' 
                    : item.difficulty === 'medium' 
                    ? '#FFC107' 
                    : '#F44336'
              }
            ]}
          >
            <Text style={styles.difficultyText}>
              {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>{error}</Text>
        <TouchableOpacity 
          style={[styles.retryButton, { borderColor: theme.primary }]}
          onPress={() => setLoading(true)}
        >
          <Text style={[styles.retryText, { color: theme.primary }]}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={quizzes}
        renderItem={renderQuizItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No quizzes found in this category.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  quizCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quizImage: {
    width: '100%',
    height: 150,
  },
  quizContent: {
    padding: 16,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  quizDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  quizMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaIcon: {
    marginRight: 4,
  },
  metaText: {
    fontSize: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 'auto',
  },
  difficultyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default QuizListScreen;
