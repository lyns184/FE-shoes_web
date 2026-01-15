import { createContext, useContext, useState, type ReactNode, useEffect, useCallback } from 'react';
import type { CartItem } from '../types/cart';
import { getUserProfile, updateUserProfile, getUserOrders } from '../services/user';
import checkLogin from '../utlis/checkLogin';
import { updateUserAvatar } from '../services/user';

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
  updateAvatar: (avatarFile: File) => Promise<boolean>;
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

  // Fetch profile on mount if logged in
  const refreshProfile = async () => {
    if (!checkLogin()) {
      // User not logged in
      setProfile(null);
      setOrders([]);
      setIsLoading(false);
      setError('Not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getUserProfile();
      if (result.success && result.data) {
        // Add cache-busting to avatar URL if exists
        const profileData = { ...result.data };
        if (profileData.avatar) {
          profileData.avatar = profileData.avatar.includes('?')
            ? `${profileData.avatar}&t=${Date.now()}`
            : `${profileData.avatar}?t=${Date.now()}`;
        }
        setProfile(profileData);
        setError(null);
      } else {
        setError(result.message || 'Failed to load profile');
      }
    } catch (err) {
      const errorMsg = 'Failed to fetch profile';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshOrders = async () => {
    if (!checkLogin()) {
      setOrders([]);
      return;
    }

    try {
      const result = await getUserOrders();
      if (result.success && result.data.orders) {
        setOrders(result.data.orders);
      } else {
        // Orders fetch unsuccessful
      }
    } catch (err) {
      setOrders([]);
    }
  };

  useEffect(() => {
    refreshProfile();
    refreshOrders();
  }, []);

  // Listen for authentication changes
  useEffect(() => {
    const handleStorageChange = () => {
      // Re-check authentication when storage changes
      refreshProfile();
      refreshOrders();
    };

    // Listen for custom auth events
    window.addEventListener('authChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('authChanged', handleStorageChange);
    };
  }, []); // Empty dependency để chỉ chạy một lần

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
        // Preserve current avatar URL if we have one with cache-busting timestamp
        // (avatar from server may be stale after recent upload)
        setProfile(prevProfile => {
          const newData = { ...result.data! };
          // Keep existing avatar if it has cache-busting timestamp (recently updated)
          if (prevProfile?.avatar && prevProfile.avatar.includes('?t=')) {
            newData.avatar = prevProfile.avatar;
          } else if (newData.avatar && !newData.avatar.includes('?t=')) {
            // Add cache-busting to server avatar
            newData.avatar = `${newData.avatar}?t=${Date.now()}`;
          }
          return newData;
        });
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

  const updateAvatar = async (avatarFile: File): Promise<boolean> => {
    setError(null);
    
    try {
      const result = await updateUserAvatar(avatarFile);
      console.log('Avatar upload result:', result);
      
      // Check for both possible response formats: result.data.url or result.data.avatar
      let newAvatarUrl = result.data?.url || result.data?.avatar;
      
      if (result.success && newAvatarUrl) {
        // Ensure Cloudinary URL has proper format
        if (newAvatarUrl.includes('cloudinary.com') && !newAvatarUrl.includes('/v1/')) {
          // Fix missing version in Cloudinary URL
          newAvatarUrl = newAvatarUrl.replace('/image/upload/', '/image/upload/v1/');
        }
        
        // Update profile with new avatar URL (with cache-busting timestamp)
        const avatarUrl = newAvatarUrl.includes('?') 
          ? `${newAvatarUrl}&t=${Date.now()}`
          : `${newAvatarUrl}?t=${Date.now()}`;
        
        console.log('Original avatar URL:', result.data?.url || result.data?.avatar);
        console.log('Fixed avatar URL with cache-busting:', avatarUrl);
          
        // Use functional update to avoid stale closure
        setProfile(prevProfile => {
          if (!prevProfile) return null;

          return {
            ...prevProfile,
            avatar: avatarUrl
          };
        });
        
        // DON'T refresh profile here - it will overwrite our cache-busted URL
        // The avatar is already updated in state with the correct URL
        
        return true;
      } else {
        const errorMsg = result.message || 'Failed to update avatar - no URL returned';
        setError(errorMsg);
        return false;
      }
    } catch (err) {
      const errorMsg = 'Failed to update avatar';
      setError(errorMsg);
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
      updateAvatar,
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
