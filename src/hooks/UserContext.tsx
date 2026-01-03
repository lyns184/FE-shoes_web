import { createContext, useContext, useState, type ReactNode } from 'react';
import type { CartItem } from './useCart';

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
  items: CartItem[];
  deliveryInfo: DeliveryInfo;
  paymentMethod: 'cash' | 'card';
  total: number;
  date: string;
  status: 'Delivered' | 'Processing' | 'Cancelled';
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  shippingAddresses: Array<{
    name: string;
    address: string;
    phone: string;
  }>;
}

interface UserContextType {
  profile: UserProfile;
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void;
  updateProfile: (deliveryInfo: DeliveryInfo) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    phone: '+84 1234567890',
    email: 'johndoe@example.com',
    shippingAddresses: []
  });

  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (newOrder: Omit<Order, 'id' | 'date' | 'status'>) => {
    const order: Order = {
      ...newOrder,
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      status: 'Delivered' // Default to success as requested
    };
    
    setOrders(prev => [order, ...prev]);
  };

  const updateProfile = (deliveryInfo: DeliveryInfo) => {
    const newAddress = {
      name: deliveryInfo.firstName + ' ' + deliveryInfo.lastName,
      address: deliveryInfo.address,
      phone: deliveryInfo.phone
    };

    setProfile(prev => ({
      ...prev,
      name: deliveryInfo.firstName + ' ' + deliveryInfo.lastName,
      phone: deliveryInfo.phone,
      email: deliveryInfo.email,
      shippingAddresses: [newAddress, ...prev.shippingAddresses]
    }));
  };

  return (
    <UserContext.Provider value={{ profile, orders, addOrder, updateProfile }}>
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