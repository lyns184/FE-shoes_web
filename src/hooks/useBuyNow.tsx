import { createContext, useContext, useState, type ReactNode } from 'react';
import type { CartItem } from '../types/cart';

interface BuyNowContextType {
  buyNowItem: CartItem | null;
  setBuyNowItem: (item: CartItem | null) => void;
}

const BuyNowContext = createContext<BuyNowContextType | undefined>(undefined);

export function BuyNowProvider({ children }: { children: ReactNode }) {
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);

  return (
    <BuyNowContext.Provider value={{ buyNowItem, setBuyNowItem }}>
      {children}
    </BuyNowContext.Provider>
  );
}

export function useBuyNow() {
  const context = useContext(BuyNowContext);
  if (!context) {
    throw new Error('useBuyNow must be used within a BuyNowProvider');
  }
  return context;
}