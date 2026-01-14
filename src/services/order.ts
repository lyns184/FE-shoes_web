import { getAccessToken } from './auth';

const API_BASE_URL = 'https://backend_test_api.nport.link/api';

export interface CreateOrderData {
  shippingAddress: string;
  paymentMethod: string;
}

export interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
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

// Helper to add auth header
function getHeaders(): HeadersInit {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function createOrder(data: CreateOrderData): Promise<CreateOrderResponse> {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  const result = await response.json();
  return result;
}

export async function getOrder(orderId: number): Promise<GetOrderResponse> {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  const result = await response.json();
  return result;
}
