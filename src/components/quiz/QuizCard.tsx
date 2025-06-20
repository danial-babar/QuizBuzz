import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType, ViewStyle, TextStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../constants/colors';


interface QuizCardProps {
  id: string;
  title: string;
  description?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  timeLimit: number; // in minutes
  image?: ImageSourcePropType;
  onPress?: (id: string) => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  footerStyle?: ViewStyle;
}

const QuizCard: React.FC<QuizCardProps> = ({
  id,
  title,
  description,
  category,
  difficulty,
  questionCount,
  timeLimit,
  image,
  onPress,
  style,
  titleStyle,
  descriptionStyle,
  footerStyle,
}) => {
  const navigation = useNavigation();
  
  const handlePress = () => {
    if (onPress) {
      onPress(id);
    } else {
      // @ts-ignore
      navigation.navigate('QuizPlay', { quizId: id });
    }
  };

  const getDifficultyColor = () => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return colors.success;
      case 'medium':
        return colors.warning;
      case 'hard':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {image && (
        <Image 
          source={image} 
          style={styles.image} 
          resizeMode="cover"
        />
      )}
      
      <View style={styles.content}>
        <Text style={[styles.title, titleStyle]} numberOfLines={2}>
          {title}
        </Text>
        
        {description && (
          <Text style={[styles.description, descriptionStyle]} numberOfLines={2}>
            {description}
          </Text>
        )}
        
        <View style={[styles.footer, footerStyle]}>
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              {/* <Ionicons name="list-outline" size={16} color={colors.textLight} /> */}
              <Text style={styles.metaText}>{questionCount} Qs</Text>
            </View>
            
            <View style={styles.metaItem}>
              {/* <Ionicons name="time-outline" size={16} color={colors.textLight} /> */}
              <Text style={styles.metaText}>{timeLimit} min</Text>
            </View>
            
            <View style={[styles.difficulty, { backgroundColor: getDifficultyColor() + '20' }]}>
              <Text style={[styles.difficultyText, { color: getDifficultyColor() }]}>
                {difficulty}
              </Text>
            </View>
          </View>
          
          <View style={styles.category}>
            <Text style={styles.categoryText} numberOfLines={1}>
              {category}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 120,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  metaText: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
  difficulty: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  category: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    maxWidth: 100,
  },
  categoryText: {
    fontSize: 12,
    color: colors.textLight,
  },
});

export default QuizCard;
