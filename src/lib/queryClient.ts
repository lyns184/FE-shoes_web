import { QueryClient } from '@tanstack/react-query';

// Query client configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes - data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache time: 10 minutes - data stays in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 3 times with exponential backoff
      retry: 3,
      // Retry delay starts at 1 second and doubles each time
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus for fresh data
      refetchOnWindowFocus: true,
      // Refetch on reconnect after network issues
      refetchOnReconnect: true,
      // Don't refetch on mount if data is still fresh
      refetchOnMount: true,
    },
    mutations: {
      // Retry failed mutations 2 times
      retry: 2,
      // Shorter retry delay for mutations
      retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 5000),
    },
  },
});

// Global error handler
queryClient.setDefaultOptions({
  queries: {
    throwOnError: false, // Handle errors gracefully in components
  },
  mutations: {
    throwOnError: false,
  },
});