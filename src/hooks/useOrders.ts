import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder, cancelOrder, type CreateOrderData } from '../services/order';
import { queryKeys } from '../lib/queryKeys';
import { useUser } from './UserContext';
import type { CartItem } from '../types/cart';

export interface DeliveryInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  note?: string;
}

/**
 * Interface for placing an order
 */
interface PlaceOrderData {
  items: CartItem[];
  deliveryInfo: DeliveryInfo;
  paymentMethod: 'cash' | 'card';
  total: number;
  note?: string;
}

/**
 * Hook to place an order
 */
export function usePlaceOrder() {
  const queryClient = useQueryClient();
  const { refreshOrders } = useUser(); // Get refresh function from UserContext

  return useMutation({
    mutationFn: async (orderData: PlaceOrderData) => {
      // Transform the data to match API format
      const apiOrderData: CreateOrderData = {
        shippingAddress: `${orderData.deliveryInfo.address}`,
        paymentMethod: orderData.paymentMethod === 'cash' ? 'COD' : 'credit_card',
        items: orderData.items.map(item => ({
          productVariantID: item.productVariantID || item.productID || item.id,
          quantity: item.quantity,
          price: item.price.toString(),
        })),
      };

      // Call your order API
      const result = await createOrder(apiOrderData);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to place order');
      }
      
      return result.data;
    },
    onSuccess: () => {
      // Clear cart after successful order
      queryClient.setQueryData(queryKeys.cart.items(), []);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.orders() });
      
      // IMPORTANT: Refresh UserContext orders to show in history
      setTimeout(() => {
        refreshOrders();
      }, 1000); // Small delay to ensure BE has processed the order
    },
    onError: (error) => {
      console.error('Order placement failed:', error);
      // Optionally show user-friendly error message
    },
  });
}

/**
 * Hook to cancel an order
 */
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: number) => {
      // Call your cancel order API
      const result = await cancelOrder(orderId);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to cancel order');
      }
      
      return { success: true, orderId };
    },
    onSuccess: (data) => {
      // Invalidate orders to refetch updated status
      queryClient.invalidateQueries({ queryKey: queryKeys.user.orders() });
      
      // Optionally update the specific order in cache
      const { orderId } = data;
      const currentOrders = queryClient.getQueryData<any[]>(queryKeys.user.orders()) || [];
      const updatedOrders = currentOrders.map((order: any) =>
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      );
      queryClient.setQueryData(queryKeys.user.orders(), updatedOrders);
    },
  });
}

/**
 * Hook to update order status (admin functionality)
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      orderId, 
      status 
    }: { 
      orderId: number; 
      status: string; 
    }) => {
      // Call your update order status API
      // const result = await updateOrderStatus(orderId, status);
      
      // For now, return success (implement based on your API)
      return { success: true, orderId, status };
    },
    onSuccess: (data) => {
      // Invalidate orders to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.user.orders() });
      
      // Update specific order in cache
      const { orderId, status } = data;
      const currentOrders = queryClient.getQueryData<any[]>(queryKeys.user.orders()) || [];
      const updatedOrders = currentOrders.map((order: any) =>
        order.id === orderId ? { ...order, status } : order
      );
      queryClient.setQueryData(queryKeys.user.orders(), updatedOrders);
    },
  });
}