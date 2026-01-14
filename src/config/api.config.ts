/**
 * API Configuration
 * Centralized configuration for API endpoints
 */

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:6869',
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGIN_GOOGLE: '/api/auth/login-google',
    VERIFY_EMAIL: '/api/auth/verify',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    LOGOUT: '/api/auth/logout',
  },
  
  // User endpoints
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE_PROFILE: '/api/user/update-profile',
    UPDATE_AVATAR: '/api/user/update-avatar',
    FORGOT_PASSWORD: '/api/user/forgot-password',
    RESET_PASSWORD: '/api/user/reset-password',
    CHANGE_EMAIL: '/api/user/change-email',
    RESET_EMAIL: '/api/user/reset-email',
  },
  
  // Cart endpoints
  CART: {
    BASE: '/api/cart',
    ADD_PRODUCT: '/api/cart/add-product',
    REMOVE_PRODUCT: (id: number) => `/api/cart/remove-product/${id}`,
    ALL_PRODUCTS: '/api/cart/all-products',
  },
  
  // Order endpoints
  ORDER: {
    BASE: '/api/order',
    DETAIL: (orderId: number) => `/api/order/${orderId}`,
    CANCEL: (orderId: number) => `/api/order/${orderId}/cancel`,
    UPDATE_ADDRESS: (orderId: number) => `/api/order/${orderId}/address`,
  },
  
  // Product endpoints
  PRODUCT: {
    BASE: '/api/product',
    DETAIL: (id: number) => `/api/product/${id}`,
    SEARCH: '/api/product/search',
    BY_BRAND: (brandID: number) => `/api/product/brand/${brandID}`,
  },
  
  // Brand endpoints
  BRAND: {
    BASE: '/api/brands',
    DETAIL: (id: number) => `/api/brands/${id}`,
  },
  
  // Color endpoints
  COLOR: {
    BASE: '/api/colors',
    DETAIL: (id: number) => `/api/colors/${id}`,
  },
  
  // Variant endpoints
  VARIANT: {
    BASE: '/api/variant',
    BY_PRODUCT: (id: number) => `/api/variant/get-by-product/${id}`,
    BY_ID: (id: number) => `/api/variant/get-by-id/${id}`,
  },
  
  // Payment endpoints
  PAYMENT: {
    PROCESS: '/api/payment/process',
    CANCEL: '/api/payment/cancel',
  },
} as const;
