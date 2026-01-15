import axiosInstance from './axiosInstance';

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

export interface CreateOrderData {
  shippingAddress: string;
  paymentMethod: string;
}

export interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
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
  payment: {
    paymentMethod: string;
  };
  items: OrderItem[];
  total: number;
}

export interface CreateOrderResponse {
  success: boolean;
  message?: string;
  data?: {
    orderId: number;
    status: string;
    total: number;
  };
}

export interface GetOrderResponse {
  success: boolean;
  message?: string;
  data?: Order;
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
    const response = await axiosInstance.post('/orders', data);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: 'Failed to create order',
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
