import { useState, useRef, useEffect } from 'react';
import { FiX, FiCamera } from 'react-icons/fi';

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  address?: string;
  avatar?: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  profile: UserProfile | null;
  onSave: (profile: Partial<UserProfile>) => Promise<boolean>;
  onUpdateAvatar?: (file: File) => Promise<boolean>;
  onClose: () => void;
}

export default function EditProfileModal({ 
  isOpen, 
  profile, 
  onSave,
  onUpdateAvatar,
  onClose 
}: EditProfileModalProps) {
  const [formData, setFormData] = useState<UserProfile>(profile || {
    name: '',
    phone: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update formData when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        email: profile.email || '',
        address: profile.address || '',
        avatar: profile.avatar || ''
      });
    }
  }, [profile]);

  // Reset avatar states when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setAvatarFile(null);
      setAvatarPreview(null);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen || !profile) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Update avatar first if there's a new avatar file  
      if (avatarFile && onUpdateAvatar) {
        const avatarSuccess = await onUpdateAvatar(avatarFile);
        if (!avatarSuccess) {
          throw new Error('Failed to update avatar');
        }
      }

      // Update profile (excluding avatar since it's handled separately)
      const profileData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      };
      
      const success = await onSave(profileData);
      if (success) {
        onClose();
        setAvatarFile(null);
        setAvatarPreview(null);
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the file for upload
      setAvatarFile(file);
      
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setAvatarPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1a1a1a]">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <FiX className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-[#3d5a4c] rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : formData.avatar ? (
                  <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  formData.name.charAt(0).toUpperCase()
                )}
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 w-6 h-6 bg-[#3d5a4c] rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-[#2f4a3c] transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <FiCamera className="h-3 w-3" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Click camera to change avatar</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d5a4c] focus:border-transparent outline-none transition-all"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d5a4c] focus:border-transparent outline-none transition-all"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d5a4c] focus:border-transparent outline-none transition-all"
                placeholder="Enter your email address"
                required
                disabled
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-[#3d5a4c] text-white rounded-lg hover:bg-[#2f4a3c] font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}