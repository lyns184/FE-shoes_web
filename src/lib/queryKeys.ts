/**
 * Query Key Factory
 * Centralized query key management for consistent caching
 * and cache invalidation across the application
 */

export const queryKeys = {
  // Product-related queries
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.products.details(), id] as const,
    search: (query: string) => [...queryKeys.products.all, 'search', query] as const,
    trending: () => [...queryKeys.products.all, 'trending'] as const,
    new: () => [...queryKeys.products.all, 'new'] as const,
    bestSellers: () => [...queryKeys.products.all, 'best-sellers'] as const,
    categories: () => [...queryKeys.products.all, 'categories'] as const,
    brands: () => [...queryKeys.products.all, 'brands'] as const,
  },

  // Cart-related queries
  cart: {
    all: ['cart'] as const,
    items: () => [...queryKeys.cart.all, 'items'] as const,
  },

  // User-related queries
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
    orders: () => [...queryKeys.user.all, 'orders'] as const,
    orderHistory: (userId?: number) => [...queryKeys.user.orders(), userId] as const,
  },

  // Order-related queries
  orders: {
    all: ['orders'] as const,
    detail: (orderId: number) => [...queryKeys.orders.all, 'detail', orderId] as const,
  },

  // Authentication-related queries
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },
} as const;

// Helper function to invalidate related queries
export const getInvalidationKeys = {
  onProductUpdate: (productId: number) => [
    queryKeys.products.detail(productId),
    queryKeys.products.lists(),
  ],
  onCartUpdate: () => [
    queryKeys.cart.items(),
  ],
  onOrderPlace: () => [
    queryKeys.cart.items(),
    queryKeys.user.orders(),
  ],
  onUserUpdate: () => [
    queryKeys.user.profile(),
  ],
};