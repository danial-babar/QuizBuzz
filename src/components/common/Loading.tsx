import React from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle, TextStyle, Text } from 'react-native';
import { colors } from '../../constants/colors';

interface LoadingProps {
  size?: 'small' | 'large' | number;
  color?: string;
  text?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  color = colors.primary,
  text,
  style,
  textStyle,
  fullScreen = false,
}) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen, style]}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={[styles.text, textStyle]}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 999,
  },
  text: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
});

export default Loading;
