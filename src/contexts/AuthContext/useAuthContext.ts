import { useAuth } from './AuthContext';

export { useAuth };

// This is a re-export of the useAuth hook for better organization
// You can also add additional auth-related hooks here if needed

// Example of an additional hook that could be added later:
/*
export const useCurrentUser = () => {
  const { user } = useAuth();
  return user;
};

export const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};

export const useAuthLoading = () => {
  const { loading } = useAuth();
  return loading;
};
*/

// This file serves as a central export point for all auth-related hooks
// This pattern makes it easier to import hooks from a single location
export default {
  useAuth,
  // useCurrentUser,
  // useIsAuthenticated,
  // useAuthLoading,
};
