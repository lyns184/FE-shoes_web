import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllCartProducts, 
  addToCart as addToCartAPI, 
  removeFromCart as removeFromCartAPI 
} from '../services/cart';
import { queryKeys } from '../lib/queryKeys';
import { checkAuth } from '../services/auth';
import type { CartItem } from '../types/cart';
import { useBuyNow } from './useBuyNow';

// Re-export CartItem for other modules
export type { CartItem };

/**
 * Hook to fetch cart items
 */
export function useCartItems() {
  return useQuery({
    queryKey: queryKeys.cart.items(),
    queryFn: async () => {
      if (!checkAuth()) {
        // Fallback to localStorage when not authenticated
        const localCart = localStorage.getItem('cartItems');
        return localCart ? JSON.parse(localCart) : [];
      }

      const result = await getAllCartProducts();
      
      if (result.success && result.data) {
        // Convert API format to CartItem format
        // BE returns: { id, quantity, productVariant: { id, size, quantity, product, color } }
        const cartItems: CartItem[] = result.data.map(item => {
          const productVariant = item.productVariant;
          const product = productVariant?.product;
          const color = productVariant?.color;
          
          return {
            id: item.id,                                    // cart product id
            productVariantID: productVariant?.id,           // productVariant id (for API calls)
            productID: product?.id,                         // product id
            name: product?.name || '',
            description: product?.description || '',
            size: productVariant?.size?.toString() || '',   // size from productVariant
            color: color?.name || '',                       // color name from productVariant
            quantity: item.quantity,
            price: parseFloat(product?.price || '0'),
            thumbnail: product?.thumbnail || '',
          };
        });
        
        return cartItems;
      }
      
      return [];
    },
    enabled: true,
    staleTime: 30 * 1000, // 30 seconds - cart data should be fresh
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to add items to cart
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newItem: Omit<CartItem, 'quantity'>) => {
      if (!checkAuth()) {
        // Handle localStorage fallback
        const currentCart = queryClient.getQueryData<CartItem[]>(queryKeys.cart.items()) || [];
        const existingIndex = currentCart.findIndex(
          item => item.productVariantID === newItem.productVariantID || 
                  (item.productID === newItem.productID && item.size === newItem.size && item.color === newItem.color)
        );

        let updatedCart;
        if (existingIndex >= 0) {
          updatedCart = [...currentCart];
          updatedCart[existingIndex] = { 
            ...updatedCart[existingIndex], 
            quantity: updatedCart[existingIndex].quantity + 1 
          };
        } else {
          const newCartItem = { ...newItem, quantity: 1 };
          updatedCart = [...currentCart, newCartItem];
        }
        
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
        return updatedCart;
      }

      // API now requires productVariantID
      const productVariantID = newItem.productVariantID;
      
      if (!productVariantID) {
        throw new Error('productVariantID is required to add to cart');
      }
      
      // Don't send quantity for add to cart - let BE handle increment logic
      const result = await addToCartAPI({ productVariantID });

      if (!result.success) {
        throw new Error(result.message || 'Failed to add to cart');
      }

      return result;
    },
    onError: (error) => {
      console.error('Add to cart failed:', error);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.items() });
    },
  });
}

/**
 * Hook to remove items from cart with optimistic updates
 */
export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cartItemId }: { cartItemId: number }) => {
      if (!checkAuth()) {
        // Handle localStorage fallback
        const currentCart = queryClient.getQueryData<CartItem[]>(queryKeys.cart.items()) || [];
        const updatedCart = currentCart.filter(
          item => item.id !== cartItemId
        );
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
        return updatedCart;
      }

      const result = await removeFromCartAPI(cartItemId);

      if (!result.success) {
        throw new Error(result.message || 'Failed to remove from cart');
      }

      return result;
    },
    onMutate: async ({ cartItemId }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.items() });

      const previousCart = queryClient.getQueryData<CartItem[]>(queryKeys.cart.items()) || [];
      
      // Optimistically remove the item
      const optimisticCart = previousCart.filter(
        item => item.id !== cartItemId
      );

      queryClient.setQueryData(queryKeys.cart.items(), optimisticCart);

      return { previousCart };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.items(), context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.items() });
    },
  });
}

/**
 * Hook to update cart item quantity
 */
export function useUpdateCartQuantity() {
  const queryClient = useQueryClient();
  const removeFromCart = useRemoveFromCart();

  return useMutation({
    mutationFn: async ({ 
      cartItemId,
      productVariantID,
      change,
      currentQuantity // Pass current quantity directly to avoid cache issues
    }: { 
      cartItemId: number;
      productVariantID: number;
      change: number;
      currentQuantity: number;
    }) => {
      const newQuantity = currentQuantity + change;
      
      // If quantity becomes 0 or negative, remove item
      if (newQuantity <= 0) {
        return removeFromCart.mutateAsync({ cartItemId });
      }

      // For positive changes, we need to handle the quantity update
      if (!checkAuth()) {
        // Handle localStorage fallback
        const currentCart = queryClient.getQueryData<CartItem[]>(queryKeys.cart.items()) || [];
        const updatedCart = currentCart.map(cartItem => {
          if (cartItem.id === cartItemId) {
            return { ...cartItem, quantity: newQuantity };
          }
          return cartItem;
        });
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
        return updatedCart;
      }

      // Call API with new quantity (BE now supports quantity parameter)
      await addToCartAPI({ productVariantID, quantity: newQuantity });

      return { success: true };
    },
    onMutate: async ({ cartItemId, change }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.items() });

      const previousCart = queryClient.getQueryData<CartItem[]>(queryKeys.cart.items()) || [];
      
      // Optimistically update the quantity
      const optimisticCart = previousCart
        .map(item => {
          if (item.id === cartItemId) {
            const newQuantity = item.quantity + change;
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(item => item.quantity > 0); // Remove items with 0 or negative quantity

      queryClient.setQueryData(queryKeys.cart.items(), optimisticCart);

      return { previousCart };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.items(), context.previousCart);
      }
    },
    onSuccess: () => {
      // Refetch cart from server after API call succeeds
      // Use delay to let BE finish processing
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: queryKeys.cart.items() });
      }, 300);
    },
  });
}

/**
 * Hook to clear entire cart
 */
export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Clear localStorage
      localStorage.removeItem('cartItems');
      
      if (!checkAuth()) {
        return { success: true };
      }

      // If there's an API endpoint to clear cart, call it here
      // For now, we'll just clear the local state
      return { success: true };
    },
    onSuccess: () => {
      // Clear the cart cache
      queryClient.setQueryData(queryKeys.cart.items(), []);
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.items() });
    },
  });
}

/**
 * Hook that provides cart state and actions (replaces useCart hook)
 */
export function useCart() {
  const { data, isLoading, error } = useCartItems();
  const items = (data || []) as CartItem[];
  const addToCartMutation = useAddToCart();
  const removeFromCartMutation = useRemoveFromCart();
  const updateQuantityMutation = useUpdateCartQuantity();
  const clearCartMutation = useClearCart();
  const { buyNowItem, setBuyNowItem } = useBuyNow();

  const totalItems = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

  return {
    items,
    isLoading: isLoading || addToCartMutation.isPending || removeFromCartMutation.isPending,
    error: error?.message || addToCartMutation.error?.message || removeFromCartMutation.error?.message,
    addToCart: addToCartMutation.mutateAsync,
    removeFromCart: (cartItemId: number) => 
      removeFromCartMutation.mutateAsync({ cartItemId }),
    updateQuantity: (cartItemId: number, productVariantID: number, change: number, currentQuantity: number) =>
      updateQuantityMutation.mutateAsync({ cartItemId, productVariantID, change, currentQuantity }),
    clearCart: clearCartMutation.mutateAsync,
    totalItems,
    subtotal,
    buyNowItem,
    setBuyNowItem,
    refreshCart: () => Promise.resolve(),
  };
}