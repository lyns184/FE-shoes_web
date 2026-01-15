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
    console.log('Fetching cart information from API...');
    const response = await axiosInstance.get(API_ENDPOINTS.CART.BASE);
    
    if (response.data.success) {
      console.log('Cart information retrieved successfully');
      return response.data;
    }
    
    throw new Error('Invalid response format');
  } catch (error: any) {
    console.error('❌ Failed to fetch cart');
    console.error('Error:', error.response?.data || error.message);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch cart',
    };
  }
}

export async function getAllCartProducts(): Promise<GetAllProductsResponse> {
  try {
    console.log('Fetching all cart items from API...');
    const response = await axiosInstance.get(API_ENDPOINTS.CART.ALL_PRODUCTS);
    
    if (response.data.success) {
      console.log(`Retrieved ${response.data.data?.length || 0} cart items`);
      return response.data;
    }
    
    throw new Error('Invalid response format');
  } catch (error: any) {
    console.error('❌ Failed to fetch cart products');
    console.error('Error:', error.response?.data || error.message);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch cart products',
    };
  }
}

export async function addToCart(data: AddToCartData): Promise<CartActionResponse> {
  try {
    console.log('Adding product to shopping cart...');
    const response = await axiosInstance.post(API_ENDPOINTS.CART.ADD_PRODUCT, data);
    
    if (response.data.success) {
      console.log('Product successfully added to cart');
      return response.data;
    }
    
    throw new Error('Invalid response format');
  } catch (error: any) {
    console.error('❌ Failed to add to cart');
    console.error('Error:', error.response?.data || error.message);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to add to cart',
    };
  }
}

export async function removeFromCart(cartItemId: number): Promise<CartActionResponse> {
  try {
    console.log(`Removing cart item ${cartItemId} from shopping cart...`);
    const response = await axiosInstance.delete(API_ENDPOINTS.CART.REMOVE_PRODUCT(cartItemId));
    
    if (response.data.success) {
      console.log('Product successfully removed from cart');
      return response.data;
    }
    
    throw new Error('Invalid response format');
  } catch (error: any) {
    console.error('❌ Failed to remove from cart');
    console.error('Error:', error.response?.data || error.message);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to remove from cart',
    };
  }
}
