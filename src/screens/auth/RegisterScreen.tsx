import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext/ThemeContext';
import { useAuth } from '../../contexts/AuthContext/AuthContext';
import AppButton from '../../components/common/AppButton';
import AppInput from '../../components/common/AppInput';
import { AUTH_ROUTES } from '../../constants/routes';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { signUp, signInWithGoogle, signInWithApple, signInWithFacebook } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: '',
  });
  const [secureTextEntry, setSecureTextEntry] = useState({
    password: true,
    confirmPassword: true,
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

  const validateForm = () => {
    let valid = true;
    const newErrors = { 
      name: '', 
      email: '', 
      password: '', 
      confirmPassword: '', 
      general: '' 
    };

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
      valid = false;
    }

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

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    if (!termsAccepted) {
      newErrors.general = 'You must accept the Terms of Service and Privacy Policy';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      await signUp({ name, email, password });
      // Navigation is handled by the AuthProvider after successful registration
    } catch (error: any) {
      setErrors(prev => ({
        ...prev,
        general: error.message || 'Failed to create account. Please try again.',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = async (provider: 'google' | 'apple' | 'facebook') => {
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
      // Navigation is handled by the AuthProvider after successful registration
    } catch (error: any) {
      setErrors(prev => ({
        ...prev,
        general: error.message || `Failed to register with ${provider}. Please try again.`,
      }));
    } finally {
      setLoading(false);
    }
  };

  const toggleSecureEntry = (field: 'password' | 'confirmPassword') => {
    setSecureTextEntry({
      ...secureTextEntry,
      [field]: !secureTextEntry[field],
    });
  };

  const toggleTermsAccepted = () => {
    setTermsAccepted(!termsAccepted);
    // Clear general error when user toggles terms checkbox
    if (errors.general === 'You must accept the Terms of Service and Privacy Policy') {
      setErrors(prev => ({ ...prev, general: '' }));
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
          <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
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
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            error={errors.name}
            leftIcon={
              <Ionicons name="person-outline" size={20} color={theme.textSecondary} />
            }
            containerStyle={styles.inputContainer}
          />

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
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureTextEntry.password}
            error={errors.password}
            leftIcon={
              <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} />
            }
            rightIcon={
              <TouchableOpacity onPress={() => toggleSecureEntry('password')}>
                <Ionicons 
                  name={secureTextEntry.password ? 'eye-off-outline' : 'eye-outline'} 
                  size={20} 
                  color={theme.textSecondary} 
                />
              </TouchableOpacity>
            }
            containerStyle={styles.inputContainer}
          />

          <AppInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={secureTextEntry.confirmPassword}
            error={errors.confirmPassword}
            leftIcon={
              <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} />
            }
            rightIcon={
              <TouchableOpacity onPress={() => toggleSecureEntry('confirmPassword')}>
                <Ionicons 
                  name={secureTextEntry.confirmPassword ? 'eye-off-outline' : 'eye-outline'} 
                  size={20} 
                  color={theme.textSecondary} 
                />
              </TouchableOpacity>
            }
            containerStyle={styles.inputContainer}
          />

          <View style={styles.termsContainer}>
            <TouchableOpacity 
              style={[styles.checkbox, termsAccepted && styles.checkboxChecked, { borderColor: theme.primary }]}
              onPress={toggleTermsAccepted}
            >
              {termsAccepted && (
                <Ionicons name="checkmark" size={16} color="white" />
              )}
            </TouchableOpacity>
            <Text style={[styles.termsText, { color: theme.textSecondary }]}>
              I agree to the{' '}
              <Text 
                style={[styles.termsLink, { color: theme.primary }]}
                onPress={() => {}}
              >
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text 
                style={[styles.termsLink, { color: theme.primary }]}
                onPress={() => {}}
              >
                Privacy Policy
              </Text>
            </Text>
          </View>

          <AppButton
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.signUpButton}
          />

          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <Text style={[styles.dividerText, { color: theme.textSecondary }]}>
              Or sign up with
            </Text>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity 
              style={[styles.socialButton, { borderColor: theme.border }]}
              onPress={() => handleSocialRegister('google')}
              disabled={loading}
            >
              <Image 
                source={require('../../../assets/images/google-logo.png')} 
                style={styles.socialIcon} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.socialButton, { borderColor: theme.border }]}
              onPress={() => handleSocialRegister('apple')}
              disabled={loading}
            >
              <Ionicons name="logo-apple" size={24} color={theme.text} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.socialButton, { borderColor: theme.border }]}
              onPress={() => handleSocialRegister('facebook')}
              disabled={loading}
            >
              <Ionicons name="logo-facebook" size={24} color="#1877F2" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>
          Already have an account?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate(AUTH_ROUTES.LOGIN as never)}>
          <Text style={[styles.footerLink, { color: theme.primary }]}>Sign In</Text>
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#4A6CF7',
    borderColor: '#4A6CF7',
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  termsLink: {
    fontWeight: '600',
  },
  signUpButton: {
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

export default RegisterScreen;
