import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../config/api.config';

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
  id: number;
  quantity: number;
  price: string;
  productVariant: OrderItemVariant;
}

export interface Payment {
  id: number;
  paymentMethod: 'COD' | 'credit_card';
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
  data?: OrderWithUser;
}

export interface GetOrdersResponse {
  success: boolean;
  message?: string;
  data?: Order[];
}

export interface UpdateAddressData {
  shippingAddress: string;
}

export interface UpdateAddressResponse {
  success: boolean;
  message?: string;
  data?: {
    id: number;
    shippingAddress: string;
    status: string;
  };
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
    const response = await axiosInstance.get(API_ENDPOINTS.ORDER.DETAIL(orderId));
    
    if (response.data.success) {
      return response.data;
    }
    
    throw new Error('Invalid response format');
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch order',
    };
  }
}

export async function cancelOrder(orderId: number): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await axiosInstance.put(API_ENDPOINTS.ORDER.CANCEL(orderId));
    
    if (response.data.success) {
      return response.data;
    }
    
    throw new Error('Invalid response format');
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to cancel order',
    };
  }
}

export async function updateOrderAddress(
  orderId: number,
  data: UpdateAddressData
): Promise<UpdateAddressResponse> {
  try {
    const response = await axiosInstance.patch(API_ENDPOINTS.ORDER.UPDATE_ADDRESS(orderId), data);
    
    if (response.data.success) {
      return response.data;
    }
    
    throw new Error('Invalid response format');
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update address',
    };
  }
}