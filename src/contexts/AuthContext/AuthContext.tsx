import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../../api/authApi';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials extends SignInCredentials {
  name: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AUTH_STORAGE_KEY = '@QuizBuzz:auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AuthState>({ user: null, loading: true, isAuthenticated: false });
  
  // Initialize auth state from storage
  useEffect(() => {
    async function loadStoredData() {
      try {
        const storedData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        
        if (storedData) {
          const { user, token, refreshToken, expiresIn } = JSON.parse(storedData);
          
          // Check if token is still valid
          if (new Date().getTime() < expiresIn) {
            setData({
              user: { ...user, token, refreshToken, expiresIn },
              loading: false,
              isAuthenticated: true,
            });
            return;
          }
          
          // Try to refresh token if expired
          const refreshed = await refreshToken();
          if (!refreshed) {
            await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('Failed to load auth data from storage', error);
      } finally {
        setData(prev => ({ ...prev, loading: false }));
      }
    }
    
    loadStoredData();
  }, []);
  
  // Google OAuth
  const [_, googleResponse, googleSignIn] = Google.useAuthRequest({
    expoClientId: 'YOUR_GOOGLE_EXPO_CLIENT_ID',
    iosClientId: 'YOUR_GOOGLE_IOS_CLIENT_ID',
    androidClientId: 'YOUR_GOOGLE_ANDROID_CLIENT_ID',
  });
  
  // Facebook OAuth
  const [___, __, facebookSignIn] = Facebook.useAuthRequest({
    expoClientId: 'YOUR_FACEBOOK_APP_ID',
  });
  
  // Handle Google sign-in response
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { authentication } = googleResponse;
      
      // Here you would typically send the token to your backend
      // and handle the user session
      console.log('Google auth success', authentication);
      
      // Mock user data - replace with actual API call
      const mockUser = {
        id: 'google-user-id',
        name: 'Google User',
        email: 'google@example.com',
        token: authentication?.accessToken || '',
        refreshToken: '',
        expiresIn: new Date().getTime() + (authentication?.expiresIn || 0) * 1000,
      };
      
      setUserData(mockUser);
    }
  }, [googleResponse]);
  
  const setUserData = useCallback(async (userData: User) => {
    try {
      const authData = {
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
        },
        token: userData.token,
        refreshToken: userData.refreshToken,
        expiresIn: userData.expiresIn,
      };
      
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      
      setData({
        user: userData,
        loading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Failed to save auth data', error);
      throw new Error('Failed to save authentication data');
    }
  }, []);
  
  const signIn = useCallback(async ({ email, password }: SignInCredentials) => {
    try {
      setData(prev => ({ ...prev, loading: true }));
      
      // Replace with actual API call
      // const response = await apiLogin({ email, password });
      // const userData = response.data;
      
      // Mock response
      const userData = {
        id: 'user-id-123',
        name: 'Test User',
        email,
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
        expiresIn: new Date().getTime() + 3600 * 1000, // 1 hour
      };
      
      await setUserData(userData);
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.response?.data?.message || 'Failed to sign in');
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
  }, [setUserData]);
  
  const signUp = useCallback(async ({ name, email, password }: SignUpCredentials) => {
    try {
      setData(prev => ({ ...prev, loading: true }));
      
      // Replace with actual API call
      // const response = await apiRegister({ name, email, password });
      // const userData = response.data;
      
      // Mock response
      const userData = {
        id: 'new-user-id-' + Math.random().toString(36).substr(2, 9),
        name,
        email,
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
        expiresIn: new Date().getTime() + 3600 * 1000, // 1 hour
      };
      
      await setUserData(userData);
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.response?.data?.message || 'Failed to sign up');
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
  }, [setUserData]);
  
  const signOut = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, loading: true }));
      
      // Call your API to invalidate the token
      // await apiLogout();
      
      // Clear storage
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      
      setData({
        user: null,
        loading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out');
    }
  }, []);
  
  const signInWithGoogle = useCallback(async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.error('Google sign in error:', error);
      throw new Error('Failed to sign in with Google');
    }
  }, [googleSignIn]);
  
  const signInWithApple = useCallback(async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      
      // Here you would typically send the credential to your backend
      // and handle the user session
      console.log('Apple auth success', credential);
      
      // Mock user data - replace with actual API call
      const mockUser = {
        id: credential.user,
        name: `${credential.fullName?.givenName || 'User'} ${credential.fullName?.familyName || ''}`.trim(),
        email: credential.email || '',
        token: 'mock-apple-token',
        refreshToken: '',
        expiresIn: new Date().getTime() + 3600 * 1000, // 1 hour
      };
      
      await setUserData(mockUser);
    } catch (error: any) {
      if (error.code === 'ERR_CANCELED') {
        // User canceled the sign-in
        return;
      }
      console.error('Apple sign in error:', error);
      throw new Error('Failed to sign in with Apple');
    }
  }, [setUserData]);
  
  const signInWithFacebook = useCallback(async () => {
    try {
      const response = await facebookSignIn();
      
      if (response?.type === 'success') {
        // Here you would typically send the token to your backend
        // and handle the user session
        console.log('Facebook auth success', response);
        
        // Mock user data - replace with actual API call
        const mockUser = {
          id: 'facebook-user-id',
          name: 'Facebook User',
          email: 'facebook@example.com',
          token: response.params.access_token,
          refreshToken: '',
          expiresIn: new Date().getTime() + 3600 * 1000, // 1 hour
        };
        
        await setUserData(mockUser);
      }
    } catch (error) {
      console.error('Facebook sign in error:', error);
      throw new Error('Failed to sign in with Facebook');
    }
  }, [facebookSignIn, setUserData]);
  
  const updateUser = useCallback(async (userData: Partial<User>) => {
    try {
      if (!data.user) {
        throw new Error('No user is currently logged in');
      }
      
      const updatedUser = { ...data.user, ...userData };
      
      // Here you would typically call your API to update the user
      // await apiUpdateUser(updatedUser);
      
      await setUserData(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
      throw new Error('Failed to update user');
    }
  }, [data.user, setUserData]);
  
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      if (!data.user?.refreshToken) {
        return false;
      }
      
      // Replace with actual token refresh API call
      // const response = await apiRefreshToken(data.user.refreshToken);
      // const { token, refreshToken: newRefreshToken, expiresIn } = response.data;
      
      // Mock response
      const token = 'new-mock-jwt-token';
      const newRefreshToken = 'new-mock-refresh-token';
      const expiresIn = new Date().getTime() + 3600 * 1000; // 1 hour
      
      await setUserData({
        ...data.user,
        token,
        refreshToken: newRefreshToken,
        expiresIn,
      });
      
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      await signOut();
      return false;
    }
  }, [data.user, setUserData, signOut]);
  
  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        loading: data.loading,
        isAuthenticated: data.isAuthenticated,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        signInWithApple,
        signInWithFacebook,
        updateUser,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export default AuthContext;
