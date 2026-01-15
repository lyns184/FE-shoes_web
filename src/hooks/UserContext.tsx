import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import type { CartItem } from '../types/cart';
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
  error: string | null;
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void;
  updateProfile: (newProfile: Partial<UserProfile>) => Promise<boolean>;
  setDefaultShippingAddress: (address: { address: string; postalCode: string }) => void;
  removeDefaultShippingAddress: () => void;
  refreshProfile: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  clearAll: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile on mount if authenticated
  const refreshProfile = async () => {
    if (!checkAuth()) {
      setIsLoading(false);
      setError('Not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getUserProfile();
      if (result.success && result.data) {
        setProfile(result.data);
        setError(null);
      } else {
        setError(result.message || 'Failed to load profile');
        console.warn('Profile fetch unsuccessful:', result.message);
      }
    } catch (err) {
      const errorMsg = 'Failed to fetch profile';
      setError(errorMsg);
      console.error(errorMsg, err);
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
      } else {
        console.warn('Orders fetch unsuccessful:', result.message);
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
    setError(null);
    
    try {
      const result = await updateUserProfile(newProfile);
      if (result.success && result.data) {
        setProfile(result.data);
        return true;
      } else {
        setError(result.message || 'Failed to update profile');
        return false;
      }
    } catch (err) {
      const errorMsg = 'Failed to update profile';
      setError(errorMsg);
      console.error(errorMsg, err);
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

  const clearAll = () => {
    console.log('🗑️ Clearing user context...');
    setProfile(null);
    setOrders([]);
    setError(null);
    setIsLoading(false);
  };

  return (
    <UserContext.Provider value={{ 
      profile, 
      orders,
      isLoading,
      error,
      addOrder, 
      updateProfile,
      setDefaultShippingAddress,
      removeDefaultShippingAddress,
      refreshProfile,
      refreshOrders,
      clearAll
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