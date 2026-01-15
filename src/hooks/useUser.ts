import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getUserProfile, 
  updateUserProfile, 
  getUserOrders 
} from '../services/user';
import { 
  login, 
  register, 
  logout, 
  checkAuth,
  verifyEmail,
  googleLogin
} from '../services/auth';
import { queryKeys } from '../lib/queryKeys';
import type { UserProfile } from '../UserContext';

/**
 * Hook to fetch user profile
 */
export function useUserProfile() {
  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: async () => {
      if (!checkAuth()) {
        return null;
      }

      const result = await getUserProfile();
      if (result.success && result.data) {
        return result.data;
      }
      
      throw new Error(result.message || 'Failed to load profile');
    },
    enabled: checkAuth(), // Only run if authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000,   // 15 minutes
    retry: 2,
  });
}

/**
 * Hook to update user profile with optimistic updates
 */
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProfile: Partial<UserProfile>) => {
      const result = await updateUserProfile(newProfile);
      if (!result.success) {
        throw new Error(result.message || 'Failed to update profile');
      }
      return result.data;
    },
    onMutate: async (newProfile) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.user.profile() });

      // Snapshot the previous value
      const previousProfile = queryClient.getQueryData<UserProfile>(queryKeys.user.profile());

      // Optimistically update to the new value
      if (previousProfile) {
        queryClient.setQueryData(queryKeys.user.profile(), {
          ...previousProfile,
          ...newProfile,
        });
      }

      return { previousProfile };
    },
    onError: (_err, _variables, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousProfile) {
        queryClient.setQueryData(queryKeys.user.profile(), context.previousProfile);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
    },
  });
}

/**
 * Hook to fetch user's order history
 */
export function useUserOrders() {
  return useQuery({
    queryKey: queryKeys.user.orders(),
    queryFn: async () => {
      if (!checkAuth()) {
        return [];
      }

      const result = await getUserOrders();
      if (result.success && result.data.orders) {
        return result.data.orders;
      }
      
      return [];
    },
    enabled: checkAuth(),
    staleTime: 2 * 60 * 1000, // 2 minutes - orders might update frequently
    gcTime: 10 * 60 * 1000,   // 10 minutes
  });
}

/**
 * Hook for user authentication (login)
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const result = await login(data);
      if (!result.success) {
        throw new Error(result.message || 'Login failed');
      }
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
  });
}

/**
 * Hook for user registration
 */
export function useRegister() {
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
      phone: string;
      address: string;
    }) => {
      const result = await register(data);
      if (!result.success) {
        throw new Error(result.message || 'Registration failed');
      }
      return result;
    },
  });
}

/**
 * Hook for Google OAuth login
 */
export function useGoogleLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      const result = await googleLogin(code);
      if (!result.success) {
        throw new Error(result.message || 'Google login failed');
      }
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
  });
}

/**
 * Hook for email verification
 */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: async (token: string) => {
      const result = await verifyEmail(token);
      if (!result.success) {
        throw new Error(result.message || 'Email verification failed');
      }
      return result;
    },
  });
}

/**
 * Hook for user logout
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await logout();
      return result;
    },
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      
      // Or selectively clear user-related data
      queryClient.removeQueries({ queryKey: queryKeys.user.all });
      queryClient.removeQueries({ queryKey: queryKeys.cart.all });
      queryClient.removeQueries({ queryKey: queryKeys.auth.all });
    },
  });
}

/**
 * Hook to check authentication status
 */
export function useAuthStatus() {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: async () => {
      return {
        isAuthenticated: checkAuth(),
        timestamp: Date.now(),
      };
    },
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

/**
 * Hook that provides user state and actions (replaces UserContext)
 */
export function useUser() {
  const { data: profile, isLoading: isLoadingProfile, error: profileError } = useUserProfile();
  const { data: orders = [], isLoading: isLoadingOrders } = useUserOrders();
  const { data: authStatus } = useAuthStatus();
  
  const updateProfileMutation = useUpdateUserProfile();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  const isAuthenticated = authStatus?.isAuthenticated || false;
  const isLoading = isLoadingProfile || isLoadingOrders;
  const error = profileError?.message;

  return {
    // State
    profile,
    orders,
    isLoading,
    error,
    isAuthenticated,
    
    // Actions
    updateProfile: updateProfileMutation.mutateAsync,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    
    // Mutation states
    isUpdatingProfile: updateProfileMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    
    // Errors
    updateProfileError: updateProfileMutation.error?.message,
    loginError: loginMutation.error?.message,
    registerError: registerMutation.error?.message,
  };
}