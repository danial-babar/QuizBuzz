import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext/ThemeContext';
import { useAuth } from '../../contexts/AuthContext/AuthContext';
import AppButton from '../../components/common/AppButton';
import AppInput from '../../components/common/AppInput';
import { AUTH_ROUTES } from '../../constants/routes';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { signIn, signInWithGoogle, signInWithApple, signInWithFacebook } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: '',
  });
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', password: '', general: '' };

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      await signIn({ email, password });
      // Navigation is handled by the AuthProvider after successful login
    } catch (error: any) {
      setErrors(prev => ({
        ...prev,
        general: error.message || 'Failed to sign in. Please try again.',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook') => {
    try {
      setLoading(true);
      
      switch (provider) {
        case 'google':
          await signInWithGoogle();
          break;
        case 'apple':
          await signInWithApple();
          break;
        case 'facebook':
          await signInWithFacebook();
          break;
      }
      // Navigation is handled by the AuthProvider after successful login
    } catch (error: any) {
      setErrors(prev => ({
        ...prev,
        general: error.message || `Failed to sign in with ${provider}. Please try again.`,
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>Welcome Back</Text>
          <View style={styles.backButtonPlaceholder} />
        </View>

        <View style={styles.form}>
          {errors.general ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color={theme.error} />
              <Text style={[styles.errorText, { color: theme.error }]}>
                {errors.general}
              </Text>
            </View>
          ) : null}

          <AppInput
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email}
            leftIcon={
              <Ionicons name="mail-outline" size={20} color={theme.textSecondary} />
            }
            containerStyle={styles.inputContainer}
          />

          <AppInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureTextEntry}
            error={errors.password}
            leftIcon={
              <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} />
            }
            rightIcon={
              <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                <Ionicons 
                  name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'} 
                  size={20} 
                  color={theme.textSecondary} 
                />
              </TouchableOpacity>
            }
            containerStyle={styles.inputContainer}
          />

          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => navigation.navigate(AUTH_ROUTES.FORGOT_PASSWORD as never)}
          >
            <Text style={[styles.forgotPasswordText, { color: theme.primary }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <AppButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.signInButton}
          />

          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <Text style={[styles.dividerText, { color: theme.textSecondary }]}>
              Or continue with
            </Text>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity 
              style={[styles.socialButton, { borderColor: theme.border }]}
              onPress={() => handleSocialLogin('google')}
              disabled={loading}
            >
              <Image 
                source={require('../../../assets/images/google-logo.png')} 
                style={styles.socialIcon} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.socialButton, { borderColor: theme.border }]}
              onPress={() => handleSocialLogin('apple')}
              disabled={loading}
            >
              <Ionicons name="logo-apple" size={24} color={theme.text} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.socialButton, { borderColor: theme.border }]}
              onPress={() => handleSocialLogin('facebook')}
              disabled={loading}
            >
              <Ionicons name="logo-facebook" size={24} color="#1877F2" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>
          Don't have an account?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate(AUTH_ROUTES.REGISTER as never)}>
          <Text style={[styles.footerLink, { color: theme.primary }]}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backButtonPlaceholder: {
    width: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  signInButton: {
    marginBottom: 24,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  footer: {
    paddingVertical: 16,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;
