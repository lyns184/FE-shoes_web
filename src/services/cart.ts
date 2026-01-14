import axiosInstance from './axiosInstance';

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

export async function getCart(): Promise<CartResponse> {
  try {
    const response = await axiosInstance.get('/cart');
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch cart',
    };
  }
}

export async function addToCart(data: AddToCartData): Promise<CartResponse> {
  try {
    const response = await axiosInstance.post('/cart/items', data);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: 'Failed to add to cart',
    };
  }
}

export async function updateCartItem(
  productVariantID: number,
  data: UpdateCartData
): Promise<CartResponse> {
  try {
    const response = await axiosInstance.put(`/cart/items/${productVariantID}`, data);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: 'Failed to update cart item',
    };
  }
}

export async function removeFromCart(productVariantID: number): Promise<CartResponse> {
  try {
    const response = await axiosInstance.delete(`/cart/items/${productVariantID}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: 'Failed to remove from cart',
    };
  }
}
