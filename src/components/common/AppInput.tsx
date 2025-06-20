import React from 'react';
import { View, TextInput, StyleSheet, Text, TextInputProps, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../constants/colors';
interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  leftIcon,
  rightIcon,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View style={[styles.inputContainer, error ? styles.errorBorder : {}, inputStyle]}>
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#999"
          {...props}
        />
        {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
      </View>
      {error ? <Text style={[styles.errorText, errorStyle]}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 48,
    padding: 0,
    fontSize: 16,
    color: '#333',
  },
  icon: {
    marginHorizontal: 8,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  errorBorder: {
    borderColor: colors.error,
  },
});

export default AppInput;
