import axiosInstance from './axiosInstance';

// Types
export interface Brand {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  description: string;
}

export interface Size {
  id: number;
  name: string;
}

export interface Color {
  id: number;
  name: string;
  hex: string;
}

export interface ProductVariant {
  id: number;
  size: Size;
  color: Color;
  quantity: number;
}

export interface ProductListItem {
  id: number;
  name: string;
  price: number;
  thumbnail: string;
}

export interface ProductDetail {
  id: number;
  name: string;
  description: string;
  price: number;
  thumbnail: string;
  brand: Brand;
  category: Category;
  variants: ProductVariant[];
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
  data?: {
    products: ProductListItem[];
    pagination: Pagination;
  };
  message?: string;
}

export interface GetProductDetailResponse {
  success: boolean;
  data?: ProductDetail;
  message?: string;
}

// API Functions
export async function getProducts(params?: GetProductsParams): Promise<GetProductsResponse> {
  try {
    const response = await axiosInstance.get('/products', { params });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch products',
    };
  }
}

export async function getProductById(id: number): Promise<GetProductDetailResponse> {
  try {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: 'Product not found',
    };
  }
}
