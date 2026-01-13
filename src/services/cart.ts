import { getAccessToken } from './auth';

const API_BASE_URL = 'https://backend_test_api.nport.link/api';

export interface CartItemAPI {
  productVariantID: number;
  productName: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  thumbnail: string;
}

export interface CartData {
  items: CartItemAPI[];
  total: number;
}

export interface CartResponse {
  success: boolean;
  data?: CartData;
  message?: string;
}

export interface AddToCartData {
  productVariantID: number;
  quantity: number;
}

export interface UpdateCartData {
  quantity: number;
}

// Helper to add auth header
function getHeaders(): HeadersInit {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getCart(): Promise<CartResponse> {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'GET',
    headers: getHeaders(),
  });

  const result = await response.json();
  return result;
}

export async function addToCart(data: AddToCartData): Promise<CartResponse> {
  const response = await fetch(`${API_BASE_URL}/cart/items`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  const result = await response.json();
  return result;
}

export async function updateCartItem(
  productVariantID: number,
  data: UpdateCartData
): Promise<CartResponse> {
  const response = await fetch(`${API_BASE_URL}/cart/items/${productVariantID}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  const result = await response.json();
  return result;
}

export async function removeFromCart(productVariantID: number): Promise<CartResponse> {
  const response = await fetch(`${API_BASE_URL}/cart/items/${productVariantID}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  const result = await response.json();
  return result;
}
