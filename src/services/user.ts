import { getAccessToken } from './auth';

const API_BASE_URL = 'https://backend_test_api.nport.link/api';

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

// Helper to add auth header
function getHeaders(): HeadersInit {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getUserProfile(): Promise<UserProfileResponse> {
  const response = await fetch(`${API_BASE_URL}/user/profile`, {
    method: 'GET',
    headers: getHeaders(),
  });

  const result = await response.json();
  return result;
}

export async function updateUserProfile(data: UpdateProfileData): Promise<UpdateProfileResponse> {
  const response = await fetch(`${API_BASE_URL}/user/profile`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  const result = await response.json();
  return result;
}

export async function getUserOrders(page?: number, limit?: number): Promise<OrdersResponse> {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());

  const queryString = params.toString();
  const url = `${API_BASE_URL}/user/orders${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
  });

  const result = await response.json();
  return result;
}

export async function forgotPassword(data: ForgotPasswordData): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/user/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  return result;
}

export async function resetPassword(data: ResetPasswordData): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/user/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  return result;
}
