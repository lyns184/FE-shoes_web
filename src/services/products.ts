import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../config/api.config';

// Types based on API docs
export interface Brand {
  id: number;
  name: string;
}

export interface Thumbnail {
  public_id: string;
  url: string;
}

export interface Color {
  id: number;
  name: string;
  hex: string;
}

export interface ProductVariant {
  id: number;
  size: number;
  color: Color;
  quantity: number;
}

export interface ProductListItem {
  id: number;
  name: string;
  description: string;
  price: string;
  active: boolean;
  thumbnail: Thumbnail[] | string[];
  discount?: number;
  category: string[];
  brand: Brand;
  productVariants?: ProductVariant[];
}

export interface ProductDetail {
  id: number;
  name: string;
  description: string;
  price: string;
  active: boolean;
  thumbnail: Thumbnail[];
  discount?: number;
  category: string[];
  brand: Brand;
  productVariants: ProductVariant[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export interface GetProductsParams {
  search?: string;
  category?: number;
  brand?: number;
  page?: number;
  limit?: number;
}

export interface GetProductsResponse {
  success: boolean;
  message?: string;
  data?: ProductListItem[];
}

export interface GetProductDetailResponse {
  success: boolean;
  message?: string;
  data?: ProductDetail;
}

export interface SearchProductsResponse {
  success: boolean;
  message?: string;
  data?: ProductListItem[];
}

// API Functions
export async function getProducts(params?: GetProductsParams): Promise<GetProductsResponse> {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCT.BASE, { params });
    
    if (response.data.success) {
      return response.data;
    }
    
    throw new Error('Invalid response format');
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch products',
    };
  }
}

export async function getProductById(id: number): Promise<GetProductDetailResponse> {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCT.DETAIL(id));
    
    if (response.data.success) {
      return response.data;
    }
    
    throw new Error('Invalid response format');
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Product not found',
    };
  }
}

export async function searchProducts(query: string): Promise<SearchProductsResponse> {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCT.SEARCH, {
      params: { query },
    });
    
    if (response.data.success) {
      return response.data;
    }
    
    throw new Error('Invalid response format');
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Search failed',
    };
  }
}

export async function getProductDetail(productId: number): Promise<GetProductDetailResponse> {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCT.DETAIL(productId));
    
    if (response.data.success) {
      return response.data;
    }
    
    throw new Error('Invalid response format');
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Product not found',
    };
  }
}

export async function getProductsByBrand(brandID: number): Promise<GetProductsResponse> {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCT.BY_BRAND(brandID));
    
    if (response.data.success) {
      return response.data;
    }
    
    throw new Error('Invalid response format');
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch products',
    };
  }
}
