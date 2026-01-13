import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { getCart, addToCart as addToCartAPI, updateCartItem, removeFromCart as removeFromCartAPI } from '../services/cart';
import { checkAuth } from '../services/auth';

export interface CartItem {
  id: number;
  productVariantID?: number;
  name: string;
  description?: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  thumbnail: string;
}

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  addToCart: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeFromCart: (id: number, size: string, color: string) => Promise<void>;
  updateQuantity: (id: number, size: string, color: string, change: number) => Promise<void>;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  buyNowItem: CartItem | null;
  setBuyNowItem: (item: CartItem | null) => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const [lastAddedTime, setLastAddedTime] = useState(0);

  // Fetch cart on mount
  const refreshCart = useCallback(async () => {
    if (!checkAuth()) {
      setIsLoading(false);
      return;
    }

    try {
      const result = await getCart();
      if (result.success && result.data) {
        // Convert API format to CartItem format
        const cartItems: CartItem[] = result.data.items.map(item => ({
          id: item.productVariantID,
          productVariantID: item.productVariantID,
          name: item.productName,
          description: '',
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.price,
          thumbnail: item.thumbnail,
        }));
        setItems(cartItems);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(async (newItem: Omit<CartItem, 'quantity'>) => {
    const now = Date.now();
    // Prevent rapid successive calls (debounce 100ms)
    if (now - lastAddedTime < 100) {
      return;
    }
    setLastAddedTime(now);

    if (!checkAuth()) {
      // Fallback to localStorage if not authenticated
      setItems(prevItems => {
        const existingIndex = prevItems.findIndex(
          item => item.id === newItem.id && item.size === newItem.size && item.color === newItem.color
        );

        let updated;
        if (existingIndex >= 0) {
          updated = [...prevItems];
          updated[existingIndex] = { ...updated[existingIndex], quantity: updated[existingIndex].quantity + 1 };
        } else {
          const newCartItem = { ...newItem, quantity: 1 };
          updated = [...prevItems, newCartItem];
        }
        
        localStorage.setItem('cartItems', JSON.stringify(updated));
        return updated;
      });
      return;
    }

    try {
      const productVariantID = newItem.productVariantID || newItem.id;
      const result = await addToCartAPI({
        productVariantID,
        quantity: 1,
      });

      if (result.success) {
        await refreshCart();
      }
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  }, [lastAddedTime, refreshCart]);

  const removeFromCart = useCallback(async (id: number, size: string, color: string) => {
    if (!checkAuth()) {
      // Fallback to localStorage if not authenticated
      setItems(prevItems => {
        const updated = prevItems.filter(item => !(item.id === id && item.size === size && item.color === color));
        localStorage.setItem('cartItems', JSON.stringify(updated));
        return updated;
      });
      return;
    }

    try {
      // Find the item to get productVariantID
      const item = items.find(i => i.id === id && i.size === size && i.color === color);
      if (!item) return;

      const productVariantID = item.productVariantID || item.id;
      const result = await removeFromCartAPI(productVariantID);

      if (result.success) {
        await refreshCart();
      }
    } catch (err) {
      console.error('Failed to remove from cart:', err);
    }
  }, [items, refreshCart]);

  const updateQuantity = useCallback(async (id: number, size: string, color: string, change: number) => {
    if (!checkAuth()) {
      // Fallback to localStorage if not authenticated
      setItems(prevItems => {
        const updated = prevItems
          .map(item => {
            if (item.id === id && item.size === size && item.color === color) {
              const newQuantity = item.quantity + change;
              return { ...item, quantity: newQuantity };
            }
            return item;
          })
          .filter(item => item.quantity > 0);
        localStorage.setItem('cartItems', JSON.stringify(updated));
        return updated;
      });
      return;
    }

    try {
      // Find the item to get productVariantID and calculate new quantity
      const item = items.find(i => i.id === id && i.size === size && i.color === color);
      if (!item) return;

      const newQuantity = item.quantity + change;
      if (newQuantity <= 0) {
        // Remove item if quantity becomes 0 or negative
        await removeFromCart(id, size, color);
        return;
      }

      const productVariantID = item.productVariantID || item.id;
      const result = await updateCartItem(productVariantID, {
        quantity: newQuantity,
      });

      if (result.success) {
        await refreshCart();
      }
    } catch (err) {
      console.error('Failed to update cart:', err);
    }
  }, [items, refreshCart, removeFromCart]);

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cartItems');
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        buyNowItem,
        setBuyNowItem,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
