import axios from 'axios';
import { API_CONFIG, API_ENDPOINTS } from '../config/api.config';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

/**
 * Token Service
 * Handles token management (get, set, remove, refresh)
 */

// Token keys
export const TOKEN_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_EMAIL: 'userEmail',
} as const;

// Cookie options
const COOKIE_OPTIONS = {
  path: '/',
  secure: true,
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60, // 7 days
};

/**
 * Get access token from localStorage
 * Removes Bearer prefix if present and trims whitespace
 */
export function getAccessToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
  if (!token) {
    return null;
  }
  
  // Remove Bearer prefix if present, quotes, and whitespace
  const sanitized = token
    .replace(/^Bearer\s+/i, '')
    .replace(/^["']|["']$/g, '')
    .trim();
    
  return sanitized;
}

/**
 * Get refresh token from cookies
 */
export function getRefreshToken(): string | null {
  return cookies.get(TOKEN_KEYS.REFRESH_TOKEN) || null;
}

/**
 * Set access token to localStorage
 * Removes Bearer prefix if present and sanitizes the token
 */
export function setAccessToken(token: string): void {
  if (!token) {
    return;
  }
  
  try {
    // Remove Bearer prefix if present, quotes, and whitespace
    const sanitized = token
      .replace(/^Bearer\s+/i, '')
      .replace(/^["']|["']$/g, '')
      .trim();
    
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, sanitized);
    
    // Verify it was saved
    const saved = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
  } catch (error) {
  }
}

/**
 * Set refresh token to cookies
 * Removes Bearer prefix if present and sanitizes the token
 */
export function setRefreshToken(token: string): void {
  if (!token) return;
  
  // Remove Bearer prefix if present, quotes, and whitespace
  const sanitized = token
    .replace(/^Bearer\s+/i, '')
    .replace(/^["']|["']$/g, '')
    .trim();
  
  cookies.set(TOKEN_KEYS.REFRESH_TOKEN, sanitized, COOKIE_OPTIONS);
}

/**
 * Remove access token from localStorage
 */
export function removeAccessToken(): void {
  localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
}

/**
 * Remove refresh token from cookies
 */
export function removeRefreshToken(): void {
  cookies.remove(TOKEN_KEYS.REFRESH_TOKEN, { path: '/' });
}

/**
 * Clear all tokens
 */
export function clearTokens(): void {
  removeAccessToken();
  removeRefreshToken();
  localStorage.removeItem(TOKEN_KEYS.USER_EMAIL);
}

/**
 * Save tokens (access token to localStorage, refresh token to cookies)
 */
export function saveTokens(accessToken: string, refreshToken: string): void {
  if (!accessToken) {
    return;
  }
  
  setAccessToken(accessToken);
  if (refreshToken) {
    setRefreshToken(refreshToken);
  }
}

/**
 * Refresh access token using refresh token
 * @returns New access token or null if failed
 */
export async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await axios.get(
      `${API_CONFIG.baseURL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.success && response.data.accessToken) {
      let newAccessToken = response.data.accessToken;
      
      // Sanitize token: remove Bearer prefix if present
      if (typeof newAccessToken === 'string') {
        newAccessToken = newAccessToken.replace(/^Bearer\s+/i, '').trim();
      }
      
      setAccessToken(newAccessToken);
      return newAccessToken;
    }

    return null;
  } catch (error) {
    return null;
  }
}
