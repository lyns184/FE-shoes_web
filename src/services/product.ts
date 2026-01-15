import axios from 'axios';
import Token from '../utlis/Token';

const API_BASE_URL = 'http://localhost:6869/api';

// Setup axios interceptor to add Authorization header
axios.interceptors.request.use(
  (config) => {
    const token = Token.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interfaces
interface Thumbnail {
  public_id: string;
  url: string;
}

export interface Color {
  id: number;
  name: string;
  hex: string;
}

interface ProductVariant {
  id: number;
  size: number;
  quantity: number;
  color: Color;
}

export interface Brand {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  active: boolean;
  thumbnail: Thumbnail[];
  discount: number;
  category: string[];
  brand: Brand;
  productVariants: ProductVariant[];
}

interface ProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
}

export interface VariantInput {
  size: number;
  colorID: number;
  quantity: number;
}

export interface CreateVariantsPayload {
  productID: number;
  size?: number;
  colorID?: number;
  quantity?: number;
  variants?: VariantInput[];
}

interface VariantsResponse {
  success: boolean;
  message: string;
  data?: ProductVariant[];
}

interface ColorsResponse {
  success: boolean;
  message: string;
  data: Color[];
}

interface BrandsResponse {
  success: boolean;
  message: string;
  data: Brand[];
}

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  active: boolean;
  brandID: number;
  category: string[];
  discount?: number;
  thumbnailFiles?: File[];
}

interface ProductResponse {
  success: boolean;
  message: string;
  data?: Product;
}

// API Functions
export async function getAllProducts(): Promise<ProductsResponse> {
  try {
    const response = await axios.get<ProductsResponse>(`${API_BASE_URL}/product`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch products',
        data: []
      };
    }
    return {
      success: false,
      message: 'An unexpected error occurred',
      data: []
    };
  }
}

export async function createProduct(payload: CreateProductPayload): Promise<ProductResponse> {
  const formData = new FormData();
  formData.append('name', payload.name);
  formData.append('description', payload.description);
  formData.append('price', String(payload.price));
  formData.append('active', String(payload.active));
  formData.append('brandID', String(payload.brandID));
  payload.category.forEach(cat => formData.append('category', cat));
  if (payload.discount !== undefined) {
    formData.append('discount', String(payload.discount));
  }
  payload.thumbnailFiles?.forEach(file => {
    formData.append('thumbnail', file);
  });

  try {
    const response = await axios.post<ProductResponse>(
      `${API_BASE_URL}/admin/products`,
      formData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to create product',
      };
    }
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}

export async function createVariants(payload: CreateVariantsPayload): Promise<VariantsResponse> {
  // API supports either single variant fields or variants array
  const body: Record<string, unknown> = {
    productID: payload.productID,
  };

  if (payload.variants && payload.variants.length > 0) {
    body.variants = payload.variants;
  } else {
    body.size = payload.size;
    body.colorID = payload.colorID;
    body.quantity = payload.quantity;
  }

  try {
    const response = await axios.post<VariantsResponse>(
      `${API_BASE_URL}/admin/variants`,
      body,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to create variants',
      };
    }
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}

export async function getAllColors(): Promise<ColorsResponse> {
  try {
    const response = await axios.get<ColorsResponse>(`${API_BASE_URL}/colors`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch colors',
        data: []
      };
    }
    return {
      success: false,
      message: 'An unexpected error occurred',
      data: []
    };
  }
}

export async function getAllBrands(): Promise<BrandsResponse> {
  try {
    const response = await axios.get<BrandsResponse>(`${API_BASE_URL}/brands`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch brands',
        data: []
      };
    }
    return {
      success: false,
      message: 'An unexpected error occurred',
      data: []
    };
  }
}
