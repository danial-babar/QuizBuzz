import React from 'react';
import { View, Image, StyleSheet, Text, ViewStyle, ImageStyle, TextStyle } from 'react-native';
import { colors } from '../../constants/colors';

interface AvatarProps {
  source?: { uri: string } | number;
  size?: number;
  name?: string;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  textStyle?: TextStyle;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const getRandomColor = (name: string) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
    '#D4A5A5', '#9B97B2', '#E8A87C', '#C38D9E', '#83C5BE'
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

const Avatar: React.FC<AvatarProps> = ({
  source,
  size = 40,
  name,
  style,
  imageStyle,
  textStyle,
}) => {
  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: name ? getRandomColor(name) : '#e1e1e1',
  };

  const textStyles: TextStyle = {
    color: '#fff',
    fontSize: size / 2.5,
    fontWeight: '600' as const,
  };

  return (
    <View style={[styles.container, containerStyle, style]}>
      {source ? (
        <Image
          source={source}
          style={[styles.image, { borderRadius: size / 2 }, imageStyle]}
          resizeMode="cover"
        />
      ) : name ? (
        <Text style={[textStyles, textStyle]}>{getInitials(name)}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default Avatar;
