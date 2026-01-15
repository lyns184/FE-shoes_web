import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../config/api.config';

const API_BASE_URL = 'http://localhost:6869/api';

// Setup axios interceptor to add Authorization header (similar to product.ts)
import axios from 'axios';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interfaces based on API docs
export interface CreateOrderData {
  shippingAddress: string;
  paymentMethod: 'COD' | 'credit_card';
  items: Array<{
    productVariantID: number;
    quantity: number;
    price: string;
  }>;
}

export interface OrderItemVariant {
  id: number;
  size: number;
  product: {
    id: number;
    name: string;
    thumbnail: string[];
  };
  color: {
    id: number;
    name: string;
    hex: string;
  };
}

export interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

export interface Payment {
  id: number;
  paymentMethod: string;
}

// Admin order interfaces matching API response
export interface AdminOrderUser {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface AdminOrderPayment {
  id: number;
  paymentMethod: string;
}

export interface AdminOrderProductVariant {
  id: number;
  product: {
    id: number;
    name: string;
  };
}

export interface AdminOrderItem {
  id: number;
  quantity: number;
  price: string;
  productVariant: AdminOrderProductVariant;
}

export interface AdminOrder {
  id: number;
  status: string;
  shippingAddress: string;
  createdAt: string;
  user: AdminOrderUser;
  payments: AdminOrderPayment[];
  orderItems: AdminOrderItem[];
}

export interface Order {
  id: number;
  status: string;
  shippingAddress: string;
  createdAt: string;
  payments: Payment[];
  orderItems: OrderItem[];
}

export interface OrderWithUser extends Order {
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
}

export interface CreateOrderResponse {
  success: boolean;
  message?: string;
  data?: Order;
}

export interface GetOrderResponse {
  success: boolean;
  message?: string;
  data?: Order;
}

export interface GetOrdersResponse {
  success: boolean;
  message?: string;
  data?: Order[];
}

export interface GetAllOrdersResponse {
  success: boolean;
  message: string;
  data: AdminOrder[];
}

export interface UpdateOrderStatusPayload {
  status: string;
}

export interface UpdateOrderStatusResponse {
  success: boolean;
  message: string;
  data?: AdminOrder;
}

export async function getAllOrders(): Promise<GetAllOrdersResponse> {
  try {
    const response = await axios.get<GetAllOrdersResponse>(
      `${API_BASE_URL}/admin/orders`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch orders',
        data: [],
      };
    }
    return {
      success: false,
      message: 'An unexpected error occurred',
      data: [],
    };
  }
}

export async function createOrder(data: CreateOrderData): Promise<CreateOrderResponse> {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.ORDER.BASE, data);
    
    if (response.data.success) {
      return response.data;
    }
    
    throw new Error('Invalid response format');
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create order',
    };
  }
}

export async function getOrders(): Promise<GetOrdersResponse> {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.ORDER.BASE);
    
    if (response.data.success) {
      return response.data;
    }
    
    throw new Error('Invalid response format');
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch orders',
    };
  }
}

export async function getOrder(orderId: number): Promise<GetOrderResponse> {
  try {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch order',
    };
  }
}

export async function updateOrderStatus(
  orderId: number,
  payload: UpdateOrderStatusPayload
): Promise<UpdateOrderStatusResponse> {
  try {
    const response = await axios.patch<UpdateOrderStatusResponse>(
      `${API_BASE_URL}/admin/orders/${orderId}/status`,
      payload,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to update order status',
      };
    }
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}

export interface CancelOrderResponse {
  success: boolean;
  message?: string;
}

export async function cancelOrder(orderId: number): Promise<CancelOrderResponse> {
  try {
    const response = await axiosInstance.delete(`/orders/${orderId}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to cancel order',
    };
  }
}

// Admin dashboard stats
export interface AdminDashboardStats {
  totalOrders: number;
  totalUsers: number;
  totalSpent: number;
}

export interface AdminDashboardResponse {
  success: boolean;
  data: AdminDashboardStats;
  message?: string;
  httpStatus?: number;
}

export async function getAdminDashboardStats(): Promise<AdminDashboardResponse> {
  try {
    const response = await axios.get<AdminDashboardResponse>(
      `${API_BASE_URL}/admin/dashboard`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch dashboard stats',
        data: {
          totalOrders: 0,
          totalUsers: 0,
          totalSpent: 0,
        },
      };
    }
    return {
      success: false,
      message: 'An unexpected error occurred',
      data: {
        totalOrders: 0,
        totalUsers: 0,
        totalSpent: 0,
      },
    };
  }
}

// Weekly revenue
export interface WeeklyRevenueData {
  day: string;
  amount: number;
}

export interface WeeklyRevenueResponse {
  success: boolean;
  data: WeeklyRevenueData[];
  message?: string;
  httpStatus?: number;
}

export async function getWeeklyRevenue(): Promise<WeeklyRevenueResponse> {
  try {
    const response = await axios.get<WeeklyRevenueResponse>(
      `${API_BASE_URL}/admin/dashboard/weekly-revenue`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch weekly revenue',
        data: [],
      };
    }
    return {
      success: false,
      message: 'An unexpected error occurred',
      data: [],
    };
  }
}
