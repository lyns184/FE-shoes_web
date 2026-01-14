import { FiCheck } from 'react-icons/fi';

interface OrderConfirmedModalProps {
  isOpen: boolean;
  onContinueShopping: () => void;
  onViewOrder: () => void;
}

export default function OrderConfirmedModal({ 
  isOpen, 
  onContinueShopping, 
  onViewOrder 
}: OrderConfirmedModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl">
        {/* Checkmark Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#3d5a4c]">
          <FiCheck className="h-10 w-10 text-[#3d5a4c]" strokeWidth={3} />
        </div>

        {/* Title */}
        <h2 className="mb-3 text-2xl font-bold text-[#1a1a1a]">Order Confirmed!</h2>

        {/* Description */}
        <p className="mb-8 text-sm text-[#6b7280]">
          Thank you for your order. Your order has been successfully placed and will be delivered soon.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onContinueShopping}
            className="flex-1 rounded-lg border border-[#d1d5db] py-6 text-[#1a1a1a] hover:bg-gray-50 bg-transparent font-medium transition-colors cursor-pointer"
          >
            Continue Shopping
          </button>
          <button 
            onClick={onViewOrder}
            className="flex-1 rounded-lg bg-[#3d5a4c] py-6 text-white hover:bg-[#2f4a3c] font-medium transition-colors cursor-pointer"
          >
            View Order
          </button>
        </div>
      </div>
    </div>
  );
}
