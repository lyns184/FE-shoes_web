import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { 
  getAllCartProducts, 
  addToCart as addToCartAPI, 
  removeFromCart as removeFromCartAPI 
} from '../services/cart';
import { checkAuth } from '../services/auth';

export interface CartItem {
  id: number;
  productID?: number;
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
      console.log('🔄 Refreshing cart from API...');
      const result = await getAllCartProducts();
      
      if (result.success && result.data) {
        // Convert API format to CartItem format
        const cartItems: CartItem[] = result.data.map(item => ({
          id: item.product.id,
          productID: item.product.id,
          name: item.product.name,
          description: item.product.description || '',
          size: '', // API doesn't return size/color in cart items
          color: '',
          quantity: item.quantity,
          price: parseFloat(item.product.price),
          thumbnail: item.product.thumbnail,
        }));
        
        console.log(`✅ Cart loaded: ${cartItems.length} items`);
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
      const productID = newItem.productID || newItem.id;
      console.log('🔄 Adding product to cart:', productID);
      
      const result = await addToCartAPI({ productID });

      if (result.success) {
        console.log('✅ Product added to cart');
        await refreshCart();
      } else {
        console.warn('⚠️ Failed to add to cart:', result.message);
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
      // Find the item to get productID
      const item = items.find(i => i.id === id && i.size === size && i.color === color);
      if (!item) {
        console.warn('⚠️ Item not found in cart');
        return;
      }

      const productID = item.productID || item.id;
      console.log('🔄 Removing product from cart:', productID);
      
      const result = await removeFromCartAPI(productID);

      if (result.success) {
        console.log('✅ Product removed from cart');
        await refreshCart();
      } else {
        console.warn('⚠️ Failed to remove from cart:', result.message);
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
      // Find the item
      const item = items.find(i => i.id === id && i.size === size && i.color === color);
      if (!item) {
        console.warn('⚠️ Item not found in cart');
        return;
      }

      const newQuantity = item.quantity + change;
      
      // If quantity becomes 0 or negative, remove item
      if (newQuantity <= 0) {
        console.log('🔄 Quantity is 0, removing item');
        await removeFromCart(id, size, color);
        return;
      }

      // WORKAROUND: API doesn't have update quantity endpoint
      // Strategy: Remove old + Add new (multiple times for quantity)
      const productID = item.productID || item.id;
      
      console.log(`🔄 Updating quantity from ${item.quantity} to ${newQuantity}`);
      
      if (change > 0) {
        // Adding quantity: call add API multiple times
        for (let i = 0; i < change; i++) {
          await addToCartAPI({ productID });
        }
      } else if (change < 0) {
        // Decreasing quantity: remove and re-add with new quantity
        // This is not ideal but API doesn't support update
        console.warn('⚠️ Decreasing quantity requires remove+add workaround');
        // For now, just refresh and let user know
        await refreshCart();
        return;
      }

      console.log('✅ Quantity updated');
      await refreshCart();
    } catch (err) {
      console.error('Failed to update cart:', err);
    }
  }, [items, refreshCart, removeFromCart]);

  const clearCart = () => {
    console.log('🗑️ Clearing cart...');
    setItems([]);
    setBuyNowItem(null);
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
