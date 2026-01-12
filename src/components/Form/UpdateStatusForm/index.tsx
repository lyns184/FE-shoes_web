import { useState } from 'react';

interface UpdateStatusFormProps {
  orderId: string;
  currentStatus?: 'Processing' | 'Shipping' | 'Delivered' | 'Cancelled';
  onCancel: () => void;
  onUpdate: (status: 'Processing' | 'Shipping' | 'Delivered' | 'Cancelled') => void;
}

const UpdateStatusForm = ({ orderId, currentStatus = 'Processing', onCancel, onUpdate }: UpdateStatusFormProps) => {
  const [selectedStatus, setSelectedStatus] = useState<'Processing' | 'Shipping' | 'Delivered' | 'Cancelled'>(currentStatus);

  const handleUpdate = () => {
    onUpdate(selectedStatus);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full mx-4 relative">
        <div className="p-8">
          <h2 className="text-4xl font-bold text-neutral-900 mb-2">Update Status</h2>
          <p className="text-neutral-500 text-base mb-8">Update an order's status</p>

          <div className="mb-8">
            <label className="block text-base font-semibold text-neutral-900 mb-4">Status</label>
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as 'Processing' | 'Shipping' | 'Delivered' | 'Cancelled')}
                className="w-full px-4 py-4 border border-neutral-300 rounded-2xl text-neutral-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none bg-white pr-10"
              >
                <option value="Processing">Processing</option>
                <option value="Shipping">Shipping</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.02344 1.02319L6.13938 6.13913L11.2553 1.02319" stroke="#1E1E1E" strokeWidth="2.04638" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-3 border-2 border-neutral-800 text-neutral-900 font-semibold rounded-2xl hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              className="px-8 py-3 bg-[#396254] text-white font-semibold rounded-2xl hover:bg-[#2d4a3f] transition-colors cursor-pointer"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusForm;