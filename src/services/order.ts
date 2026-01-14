import axiosInstance from './axiosInstance';

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
