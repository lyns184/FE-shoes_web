import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import type { CartItem } from './useCart';
import { getUserProfile, updateUserProfile, getUserOrders } from '../services/user';
import { checkAuth } from '../services/auth';

export interface DeliveryInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  note?: string;
}

export interface Order {
  id: number;
  items?: CartItem[];
  deliveryInfo?: DeliveryInfo;
  paymentMethod?: 'cash' | 'card';
  total: number;
  date?: string;
  createdAt?: string;
  status: string;
}

export interface UserProfile {
  id?: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  avatar?: string;
  defaultShippingAddress?: { address: string; postalCode: string };
}

interface UserContextType {
  profile: UserProfile | null;
  orders: Order[];
  isLoading: boolean;
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void;
  updateProfile: (newProfile: Partial<UserProfile>) => Promise<boolean>;
  setDefaultShippingAddress: (address: { address: string; postalCode: string }) => void;
  removeDefaultShippingAddress: () => void;
  refreshProfile: () => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch profile on mount if authenticated
  const refreshProfile = async () => {
    if (!checkAuth()) {
      setIsLoading(false);
      return;
    }

    try {
      const result = await getUserProfile();
      if (result.success && result.data) {
        setProfile(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch orders
  const refreshOrders = async () => {
    if (!checkAuth()) return;

    try {
      const result = await getUserOrders();
      if (result.success && result.data.orders) {
        setOrders(result.data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  useEffect(() => {
    refreshProfile();
    refreshOrders();
  }, []);

  const addOrder = (newOrder: Omit<Order, 'id' | 'date' | 'status'>) => {
    const order: Order = {
      ...newOrder,
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      status: 'Delivered'
    };
    
    setOrders(prev => [order, ...prev]);
    // Refresh from API after adding
    setTimeout(refreshOrders, 1000);
  };

  const updateProfile = async (newProfile: Partial<UserProfile>): Promise<boolean> => {
    try {
      const result = await updateUserProfile(newProfile);
      if (result.success && result.data) {
        setProfile(result.data);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to update profile:', err);
      return false;
    }
  };

  const setDefaultShippingAddress = (address: { address: string; postalCode: string }) => {
    if (profile) {
      setProfile({
        ...profile,
        defaultShippingAddress: address
      });
    }
  };

  const removeDefaultShippingAddress = () => {
    if (profile) {
      setProfile({
        ...profile,
        defaultShippingAddress: undefined
      });
    }
  };

  return (
    <UserContext.Provider value={{ 
      profile, 
      orders,
      isLoading,
      addOrder, 
      updateProfile,
      setDefaultShippingAddress,
      removeDefaultShippingAddress,
      refreshProfile,
      refreshOrders
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}