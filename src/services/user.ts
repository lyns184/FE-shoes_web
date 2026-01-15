import api from '../api/axios';
import Token from '../utlis/Token';
const API_BASE_URL = 'https://backend_test_api.nport.link/api';
import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../config/api.config';

export interface UserRole {
  userID: number;
  roleID: number;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
  userRoles?: UserRole[];
  createdAt?: string;
  verify?: boolean;
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
    const response = await axiosInstance.get(API_ENDPOINTS.USER.PROFILE);

    if (response.data.success && response.data.data) {
      // Cache profile data
      localStorage.setItem('userProfile', JSON.stringify(response.data.data));
      return response.data;
    }
    
    throw new Error('Invalid response format from server');
  } catch (error: any) {
    // Try to use cached profile
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const cachedData = JSON.parse(savedProfile);
        return {
          success: true,
          data: cachedData,
          message: 'Using cached data - server unavailable',
        };
      } catch (parseError) {
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
    const response = await axiosInstance.patch(API_ENDPOINTS.USER.UPDATE_PROFILE, data);

    if (response.data.success && response.data.data) {
      // Update cached profile
      localStorage.setItem('userProfile', JSON.stringify(response.data.data));
      return response.data;
    }
    
    throw new Error('Invalid response format from server');
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update profile. Please try again.',
    };
  }
}

export interface UpdateAvatarResponse {
  success: boolean;
  message: string;
  data?: {
    avatar: string;
    url: string;
  };
}

export async function updateUserAvatar(avatarFile: File): Promise<UpdateAvatarResponse> {
  try {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    
    const response = await axiosInstance.patch(API_ENDPOINTS.USER.UPDATE_AVATAR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
      return response.data;
    }
    
    throw new Error('Invalid response format from server');
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update avatar. Please try again.',
    };
  }
}

export async function getUserOrders(page?: number, limit?: number): Promise<OrdersResponse> {
  try {
    // Changed from /api/user/orders to /api/order (user's orders)
    const response = await axiosInstance.get(API_ENDPOINTS.ORDER.BASE, {
      params: {
        page,
        limit,
      },
    });

    if (response.data.success) {
      return {
        success: true,
        data: {
          orders: response.data.data || [],
        },
      };
    }
    
    throw new Error('Invalid response format from server');
  } catch (error: any) {
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
