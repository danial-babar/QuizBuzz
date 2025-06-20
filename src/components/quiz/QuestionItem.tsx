import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../../constants/colors';

interface Option {
  id: string;
  text: string;
}

interface QuestionItemProps {
  question: string;
  options: Option[];
  selectedOption?: string | null;
  onSelect: (optionId: string) => void;
  showCorrectAnswer?: boolean;
  correctAnswerId?: string;
  style?: ViewStyle;
  questionStyle?: TextStyle;
  optionStyle?: ViewStyle;
  optionTextStyle?: TextStyle;
  selectedOptionStyle?: ViewStyle;
  correctOptionStyle?: ViewStyle;
  incorrectOptionStyle?: ViewStyle;
  disabled?: boolean;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  options,
  selectedOption,
  onSelect,
  showCorrectAnswer = false,
  correctAnswerId,
  style,
  questionStyle,
  optionStyle,
  optionTextStyle,
  selectedOptionStyle,
  correctOptionStyle,
  incorrectOptionStyle,
  disabled = false,
}) => {
  const getOptionStyle = (optionId: string) => {
    if (!showCorrectAnswer || !selectedOption) {
      return selectedOption === optionId 
        ? [styles.option, optionStyle, styles.selectedOption, selectedOptionStyle]
        : [styles.option, optionStyle];
    }

    if (optionId === correctAnswerId) {
      return [
        styles.option, 
        optionStyle, 
        styles.correctOption, 
        correctOptionStyle
      ];
    }

    if (optionId === selectedOption && optionId !== correctAnswerId) {
      return [
        styles.option, 
        optionStyle, 
        styles.incorrectOption, 
        incorrectOptionStyle
      ];
    }

    return [styles.option, optionStyle];
  };

  const getOptionTextStyle = (optionId: string) => {
    if (!showCorrectAnswer || !selectedOption) {
      return selectedOption === optionId 
        ? [styles.optionText, optionTextStyle, styles.selectedOptionText]
        : [styles.optionText, optionTextStyle];
    }

    if (optionId === correctAnswerId || 
        (optionId === selectedOption && optionId === correctAnswerId)) {
      return [styles.optionText, optionTextStyle, styles.correctOptionText];
    }

    if (optionId === selectedOption && optionId !== correctAnswerId) {
      return [styles.optionText, optionTextStyle, styles.incorrectOptionText];
    }

    return [styles.optionText, optionTextStyle];
  };

  const getOptionPrefix = (index: number) => {
    const prefixes = ['A', 'B', 'C', 'D', 'E', 'F'];
    return prefixes[index] || '';
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.question, questionStyle]}>{question}</Text>
      
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={option.id}
            style={getOptionStyle(option.id)}
            onPress={() => onSelect(option.id)}
            disabled={disabled || showCorrectAnswer}
            activeOpacity={0.7}
          >
            <View style={styles.optionPrefix}>
              <Text style={[styles.optionPrefixText, getOptionTextStyle(option.id)]}>
                {getOptionPrefix(index)}
              </Text>
            </View>
            <Text 
              style={getOptionTextStyle(option.id)}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {option.text}
            </Text>
            
            {showCorrectAnswer && option.id === correctAnswerId && (
              <Ionicons 
                name="checkmark-circle" 
                size={20} 
                color={colors.success} 
                style={styles.statusIcon}
              />
            )}
            
            {showCorrectAnswer && 
             selectedOption === option.id && 
             option.id !== correctAnswerId && (
              <Ionicons 
                name="close-circle" 
                size={20} 
                color={colors.error} 
                style={styles.statusIcon}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    lineHeight: 24,
  },
  optionsContainer: {
    marginTop: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionPrefix: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionPrefixText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textLight,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  selectedOption: {
    backgroundColor: 'rgba(56, 107, 255, 0.1)',
    borderColor: colors.primary,
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: '500',
  },
  correctOption: {
    backgroundColor: 'rgba(40, 167, 69, 0.1)',
    borderColor: colors.success,
  },
  correctOptionText: {
    color: colors.success,
    fontWeight: '500',
  },
  incorrectOption: {
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    borderColor: colors.error,
  },
  incorrectOptionText: {
    color: colors.error,
    textDecorationLine: 'line-through',
  },
  statusIcon: {
    marginLeft: 8,
  },
});

export default QuestionItem;
