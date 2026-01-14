import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../config/api.config';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
}

export interface Order {
  id: number;
  status: string;
  createdAt: string;
  total: number;
}

export interface OrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
    pagination?: any;
  };
  message?: string;
}

export interface UserProfileResponse {
  success: boolean;
  data?: UserProfile;
  message?: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data?: UserProfile;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

export async function getUserProfile(): Promise<UserProfileResponse> {
  try {
    console.log('Fetching user profile from server...');
    const response = await axiosInstance.get(API_ENDPOINTS.USER.PROFILE);

    if (response.data.success && response.data.data) {
      console.log('User profile fetched successfully:', response.data.data);
      // Cache profile data
      localStorage.setItem('userProfile', JSON.stringify(response.data.data));
      return response.data;
    }
    
    throw new Error('Invalid response format from server');
  } catch (error: any) {
    console.error('❌ Failed to fetch profile from server');
    console.error('Request URL:', API_ENDPOINTS.USER.PROFILE);
    console.error('Error:', error.response?.data || error.message);
    
    // Try to use cached profile
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      console.warn('Using cached profile data from previous request');
      try {
        const cachedData = JSON.parse(savedProfile);
        return {
          success: true,
          data: cachedData,
          message: 'Using cached data - server unavailable',
        };
      } catch (parseError) {
        console.error('Failed to parse cached profile');
      }
    }
    
    // Return error - no fake data
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch profile. Please try again later.',
    };
  }
}

export async function updateUserProfile(data: UpdateProfileData): Promise<UpdateProfileResponse> {
  try {
    console.log('Updating user profile data...');
    const response = await axiosInstance.patch(API_ENDPOINTS.USER.UPDATE_PROFILE, data);

    if (response.data.success && response.data.data) {
      console.log('User profile updated successfully');
      // Update cached profile
      localStorage.setItem('userProfile', JSON.stringify(response.data.data));
      return response.data;
    }
    
    throw new Error('Invalid response format from server');
  } catch (error: any) {
    console.error('❌ Failed to update profile');
    console.error('Error:', error.response?.data || error.message);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update profile. Please try again.',
    };
  }
}

export async function getUserOrders(page?: number, limit?: number): Promise<OrdersResponse> {
  try {
    console.log('Fetching user orders from server...');
    // Changed from /api/user/orders to /api/order (user's orders)
    const response = await axiosInstance.get(API_ENDPOINTS.ORDER.BASE, {
      params: {
        page,
        limit,
      },
    });

    if (response.data.success) {
      console.log(`Retrieved ${response.data.data?.length || 0} user orders`);
      return {
        success: true,
        data: {
          orders: response.data.data || [],
        },
      };
    }
    
    throw new Error('Invalid response format from server');
  } catch (error: any) {
    console.error('❌ Failed to fetch orders');
    console.error('Error:', error.response?.data || error.message);
    
    return {
      success: false,
      data: {
        orders: [],
      },
      message: error.response?.data?.message || 'Failed to fetch orders',
    };
  }
}

export async function forgotPassword(data: ForgotPasswordData): Promise<ApiResponse> {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.USER.FORGOT_PASSWORD, data);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: 'Failed to send reset email',
    };
  }
}

export async function resetPassword(data: ResetPasswordData): Promise<ApiResponse> {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.USER.RESET_PASSWORD, data);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: 'Failed to reset password',
    };
  }
}
