import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../config/api.config';

// Interfaces based on database structure
export interface CartProduct {
  id: number;
  name: string;
  price: string;
  description: string;
  discount: number;
  category: string[];
  thumbnail: string | null;
}

export interface CartItemColor {
  id: number;
  name: string;
  hex: string;
}

// ProductVariant 
export interface CartProductVariant {
  id: number;
  size: number;
  quantity: number;
  product: CartProduct;
  color: CartItemColor;
}

// API response format for cart item 
export interface ApiCartItem {
  id: number;              // cartProduct id
  quantity: number;
  productVariant: CartProductVariant;
}

export interface AddToCartData {
  productVariantID: number;       // API now requires productVariantID
  quantity?: number;              // Quantity to set (for update) or add
}

export interface GetCartResponse {
  success: boolean;
  message?: string;
  cartID?: number;
}

export interface GetAllProductsResponse {
  success: boolean;
  message?: string;
  data?: ApiCartItem[];
}

export interface CartActionResponse {
  success: boolean;
  message?: string;
}

export async function getCart(): Promise<GetCartResponse> {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.CART.BASE);
    
    if (response.data.success) {
      return response.data;
    }
    
    throw new Error('Invalid response format');
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch cart',
    };
  }
}

export async function getAllCartProducts(): Promise<GetAllProductsResponse> {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.CART.ALL_PRODUCTS);
    
    if (response.data.success) {
      return response.data;
    }
    
    throw new Error('Invalid response format');
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch cart products',
    };
  }
}

export async function addToCart(data: AddToCartData): Promise<CartActionResponse> {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.CART.ADD_PRODUCT, data);
    
    if (response.data.success) {
      return response.data;
    }
    
    throw new Error('Invalid response format');
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to add to cart',
    };
  }
}

export async function removeFromCart(cartItemId: number): Promise<CartActionResponse> {
  try {
    const response = await axiosInstance.delete(API_ENDPOINTS.CART.REMOVE_PRODUCT(cartItemId));
    
    if (response.data.success) {
      return response.data;
    }
    
    throw new Error('Invalid response format');
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to remove from cart',
    };
  }
}
