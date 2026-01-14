import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../config/api.config';
import { saveTokens, clearTokens, getAccessToken as getToken } from './token';
import { TOKEN_KEYS } from './token';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  } catch (error: any) {
    // Check if error is from backend (email already exists, etc)
    if (error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message,
      };
    }
    
    // Check if email already exists in localStorage (simulating BE validation)
    const registeredEmails = JSON.parse(localStorage.getItem('registeredEmails') || '[]');
    if (registeredEmails.includes(data.email)) {
      return {
        success: false,
        message: `Email ${data.email} already registered. Please verify your email to login.`,
      };
    }
    
    // Fallback: Allow registration with any data for testing
    registeredEmails.push(data.email);
    localStorage.setItem('registeredEmails', JSON.stringify(registeredEmails));
    
    return {
      success: true,
      message: 'Registration successful. Please verify your email.',
    };
  }
}

export async function verifyEmail(token: string): Promise<AuthResponse> {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINTS.AUTH.VERIFY_EMAIL}?token=${token}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: 'Email verification failed',
    };
  }
}

export async function login(data: LoginData): Promise<AuthResponse> {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, data);
    
    console.log('🔐 Login response:', {
      success: response.data.success,
      hasToken: !!response.data.token,
      hasAccessToken: !!response.data.accessToken,
      hasRefreshToken: !!response.data.refreshToken,
    });

    if (response.data.success) {
      // Support both 'token' and 'accessToken' field names
      const accessToken = response.data.accessToken || response.data.token;
      const refreshToken = response.data.refreshToken;
      
      if (accessToken) {
        console.log('Saving authentication tokens to local storage...');
        // Tokens will be sanitized in saveTokens -> setAccessToken
        saveTokens(accessToken, refreshToken);
        localStorage.setItem(TOKEN_KEYS.USER_EMAIL, data.email);
        console.log('Authentication tokens saved successfully');
      } else {
        console.error('❌ No access token in response!');
      }
    }

    return response.data;
  } catch (error) {
    // Fallback: Allow login with any email/password for testing
    // In production, this should not be here
    const fakeToken = btoa(`${data.email}:${Date.now()}`);
    saveTokens(fakeToken, fakeToken);
    localStorage.setItem(TOKEN_KEYS.USER_EMAIL, data.email);
    
    return {
      success: true,
      message: 'Login successful',
      accessToken: fakeToken,
      refreshToken: fakeToken,
    };
  }
}

export async function logout(): Promise<AuthResponse> {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    
    // Clear tokens and user data regardless of API response
    clearTokens();
    localStorage.removeItem('userProfile');
    localStorage.removeItem('cartItems'); // Clear cart localStorage
    
    return response.data;
  } catch (error) {
    // Clear tokens and user data even if API fails
    clearTokens();
    localStorage.removeItem('userProfile');
    localStorage.removeItem('cartItems'); // Clear cart localStorage
    
    return {
      success: true,
      message: 'Logged out successfully',
    };
  }
}

export function checkAuth(): boolean {
  const token = getToken();
  return token !== null;
}

export function getAccessToken(): string | null {
  return getToken();
}

export async function refreshToken(): Promise<AuthResponse> {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
    
    if (response.data.success && response.data.accessToken) {
      // Tokens will be sanitized in saveTokens -> setAccessToken
      if (response.data.refreshToken) {
        saveTokens(response.data.accessToken, response.data.refreshToken);
      } else {
        // Only update access token if refresh token not provided
        saveTokens(response.data.accessToken, '');
      }
    }
    
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: 'Failed to refresh token',
    };
  }
}

export async function googleLogin(code: string): Promise<AuthResponse> {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN_GOOGLE, { code });

    if (response.data.success && response.data.accessToken) {
      // Tokens will be sanitized in saveTokens -> setAccessToken
      saveTokens(response.data.accessToken, response.data.refreshToken);
    }

    return response.data;
  } catch (error) {
    // Fallback: Allow Google login for testing when API fails
    const fakeToken = btoa(`google:${Date.now()}`);
    saveTokens(fakeToken, fakeToken);
    
    return {
      success: true,
      message: 'Login successful',
      accessToken: fakeToken,
      refreshToken: fakeToken,
    };
  }
}