import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

export interface ShippingAddress {
  id?: string;
  address: string;
  postalCode: string;
}

interface ShippingAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ShippingAddress) => void;
  initialData?: ShippingAddress;
}

export default function ShippingAddressModal({
  isOpen,
  onClose,
  onSave,
  initialData
}: ShippingAddressModalProps) {
  const [formData, setFormData] = useState<ShippingAddress>({ address: '', postalCode: '' });

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({ address: '', postalCode: '' });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.address || !formData.postalCode) {
      alert('Please fill in all required fields');
      return;
    }
    onSave(formData);
    onClose();
  };

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-[#1a1a1a]">Shipping Address</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <FiX className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <p className="text-gray-600 text-sm mb-6">Add your shipping address to reuse</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Shipping Address *
            </label>
            <textarea
              placeholder="Enter your address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d5a4c] focus:border-transparent outline-none transition-all min-h-[100px] resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Postal Code *
            </label>
            <input
              type="text"
              placeholder="Enter your postal code"
              value={formData.postalCode}
              onChange={(e) => handleInputChange('postalCode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d5a4c] focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-[#3d5a4c] text-white rounded-lg hover:bg-[#2f4a3c] font-medium transition-colors cursor-pointer"
          >
            {initialData ? 'Update Address' : 'Add Shipping Address'}
          </button>
        </form>
      </div>
    </div>
  );
}
