import { FiX } from 'react-icons/fi';

export interface ShippingAddress {
  id?: string;
  address: string;
  postalCode: string;
}

interface AddressSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (addressId: string) => void;
  addresses: ShippingAddress[];
  selectedId?: string;
  profileName: string;
}

export default function AddressSelectionModal({
  isOpen,
  onClose,
  onSelect,
  addresses,
  selectedId,
  profileName
}: AddressSelectionModalProps) {
  if (!isOpen) return null;

  const handleSelect = (addressId: string) => {
    onSelect(addressId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#1a1a1a]">Select Address</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <FiX className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              onClick={() => handleSelect(address.id!)}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedId === address.id
                  ? 'border-[#3d5a4c] bg-[#3d5a4c]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{profileName}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {address.address}
                  </p>
                  <p className="text-sm text-gray-500">
                    {address.postalCode}
                  </p>
                </div>
                {selectedId === address.id && (
                  <span className="text-[#3d5a4c] text-sm font-medium">Selected</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}