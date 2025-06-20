import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle, ImageSourcePropType, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  backIconColor?: string;
  backIconName?: string;
  backIconSize?: number;
  showLogo?: boolean;
  logoSource?: ImageSourcePropType;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBackPress,
  rightIcon,
  onRightPress,
  style,
  titleStyle,
  backIconColor = colors.text,
  backIconName = 'arrow-back',
  backIconSize = 24,
  showLogo = false,
  logoSource,
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Icon name={backIconName} size={backIconSize} color={backIconColor} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.titleContainer}>
        {showLogo && logoSource ? (
          <Image source={logoSource} style={styles.logo} resizeMode="contain" />
        ) : (
          <Text style={[styles.title, titleStyle]} numberOfLines={1}>
            {title}
          </Text>
        )}
      </View>

      <View style={styles.rightContainer}>
        {rightIcon && (
          <TouchableOpacity onPress={onRightPress} style={styles.rightButton}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  leftContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  rightContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  rightButton: {
    padding: 8,
    marginRight: -8,
  },
  logo: {
    height: 32,
    width: 120,
  },
});

export default Header;
