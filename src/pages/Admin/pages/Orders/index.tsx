import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import AdminHeader from '../../../../components/common/AdminHeader';
import UpdateStatusForm from '../../../../components/Form/UpdateStatusForm';
import { getAllOrders, updateOrderStatus, type AdminOrder as ApiOrder } from '../../../../services/order';

type Order = {
  id: number;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  date: string;
  createdAt: string;
};

const STATUS_STYLES: Record<Order['status'], string> = {
  pending: 'bg-gray-100 text-gray-700',
  confirmed: 'bg-amber-100 text-amber-700',
  shipping: 'bg-blue-100 text-blue-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
};

const STATUS_LABELS: Record<Order['status'], string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipping: 'Shipping',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const AdminOrder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Order['status']>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [cancelingOrderId, setCancelingOrderId] = useState<number | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  // Fetch orders from API
  const { data: ordersData, isLoading, isError, error } = useQuery({
    queryKey: ['orders'],
    queryFn: getAllOrders,
  });

  // Mutation for updating order status
  const updateStatusMutation = useMutation({
    mutationFn: (variables: { orderId: number; status: string }) =>
      updateOrderStatus(variables.orderId, { status: variables.status }),
    onSuccess: () => {
      toast.success('Order status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setUpdatingOrderId(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update order status');
    },
  });

  // Transform API data to component's Order type
  const orders = useMemo<Order[]>(() => {
    if (!ordersData?.success || !ordersData.data) return [];
    
    const transformed = ordersData.data.map((apiOrder: ApiOrder) => {
      // Calculate total from order items
      const total = apiOrder.orderItems.reduce((sum, item) => {
        return sum + (parseFloat(item.price) * item.quantity);
      }, 0);

      // Format date
      const date = new Date(apiOrder.createdAt).toLocaleDateString('en-GB');

      return {
        id: apiOrder.id,
        customer: {
          name: apiOrder.user.name,
          email: apiOrder.user.email,
          phone: apiOrder.user.phone,
        },
        items: apiOrder.orderItems.length,
        total,
        status: apiOrder.status as Order['status'],
        date,
        createdAt: apiOrder.createdAt, // Keep raw date for sorting
      };
    });

    // Sort by date (newest first)
    return transformed.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [ordersData]);

  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return orders.filter(order => {
      const matchesTerm = term
        ? String(order.id).toLowerCase().includes(term) ||
          order.customer.name.toLowerCase().includes(term) ||
          order.customer.email.toLowerCase().includes(term) ||
          STATUS_LABELS[order.status].toLowerCase().includes(term)
        : true;
      const matchesStatus = statusFilter === 'All' ? true : order.status === statusFilter;
      return matchesTerm && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const totalOrders = filteredOrders.length;
  const ordersPerPage = 8;
  const totalPages = Math.ceil(totalOrders / ordersPerPage) || 1;
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  const getPaginationPages = () => {
    const pages: (number | string)[] = [];
    const maxDotsPages = 3;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > maxDotsPages + 1) pages.push('...');

      for (let i = Math.max(2, currentPage - maxDotsPages); i <= Math.min(totalPages - 1, currentPage + maxDotsPages); i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - maxDotsPages) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <>
      <AdminHeader title="Orders" subtitle="Manage user orders" />
      <section className="px-9 py-11">
        <div className="flex flex-wrap items-center gap-6 justify-between">
          <div className="flex-1 min-w-[320px] max-w-3xl">
            <label className="flex items-center gap-3 bg-white border border-neutral-300 rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500 transition">
              <svg aria-hidden="true" className="h-6 w-6 text-neutral-600" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="6.5" />
                <path strokeLinecap="round" d="M16 16l4.5 4.5" />
              </svg>
              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={`Search ${filteredOrders.length} orders`}
                className="flex-1 bg-transparent outline-none text-neutral-800 placeholder:text-neutral-500 text-base"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="text-neutral-500 cursor-pointer hover:text-neutral-800 transition"
                  aria-label="Clear search"
                >
                  <svg aria-hidden="true" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4.25">
                    <path d="M15.0032 1.0166L1.0166 14.5829M1.0166 1.0166L15.0032 14.5829" stroke="#1A202C" strokeWidth="2.03324" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </label>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as 'All' | Order['status']);
                setCurrentPage(1);
              }}
              className="min-w-[170px] bg-white border border-neutral-300 rounded-xl px-4 py-3 text-neutral-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipping">Shipping</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="mt-10 bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-neutral-500 text-lg font-semibold border-b border-neutral-200">
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Items</th>
                  <th className="py-4 px-6 text-right">Total</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6"></th>
                </tr>
              </thead>
              <tbody className="text-neutral-900 text-base">
                {paginatedOrders.map((order) => (
                  <tr key={order.id} className="border-b border-neutral-200 last:border-b-0">
                    <td className="py-4 px-6 font-semibold">{order.id}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-neutral-900">{order.customer.name}</span>
                        <span className="text-neutral-500 text-sm">{order.customer.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-neutral-800">{order.items}</td>
                    <td className="py-4 px-6 font-semibold text-neutral-900 text-right whitespace-nowrap">{order.total.toLocaleString()}₫</td>
                    <td className="py-4 px-6">
                      <span className={`${STATUS_STYLES[order.status]} px-4 py-2 rounded-full font-semibold text-sm inline-flex`}>{STATUS_LABELS[order.status]}</span>
                    </td>
                    <td className="py-4 px-6 text-neutral-700">{order.date}</td>
                    <td className="py-4 px-6">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setOpenMenu(openMenu === order.id ? null : order.id)}
                          className="hover:bg-neutral-100 p-2 rounded-lg transition-colors cursor-pointer"
                          aria-label="More options"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.69989 7.25781C7.00822 7.25781 7.25818 7.00786 7.25818 6.69952C7.25818 6.39119 7.00822 6.14124 6.69989 6.14124C6.39156 6.14124 6.1416 6.39119 6.1416 6.69952C6.1416 7.00786 6.39156 7.25781 6.69989 7.25781Z" stroke="#1D3029" strokeWidth="1.11657" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10.6091 7.25781C10.9174 7.25781 11.1674 7.00786 11.1674 6.69952C11.1674 6.39119 10.9174 6.14124 10.6091 6.14124C10.3007 6.14124 10.0508 6.39119 10.0508 6.69952C10.0508 7.00786 10.3007 7.25781 10.6091 7.25781Z" stroke="#1D3029" strokeWidth="1.11657" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2.79266 7.25781C3.101 7.25781 3.35095 7.00786 3.35095 6.69952C3.35095 6.39119 3.101 6.14124 2.79266 6.14124C2.48433 6.14124 2.23438 6.39119 2.23438 6.69952C2.23438 7.00786 2.48433 7.25781 2.79266 7.25781Z" stroke="#1D3029" strokeWidth="1.11657" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>

                        {openMenu === order.id && (
                          <div className="absolute -left-48 top-1/2 -translate-y-1/2 bg-white rounded-2xl border border-neutral-200 shadow-lg z-50 min-w-48 overflow-hidden">
                            <button
                              type="button"
                              onClick={() => {
                                setUpdatingOrderId(order.id);
                                setOpenMenu(null);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-neutral-800 hover:bg-neutral-50 transition-colors font-medium text-left cursor-pointer"
                            >
                              <svg width="24" height="21" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 14.25V1.25H1V14.25H16ZM16 14.25H23V9.25L20 6.25H16V14.25ZM8 16.75C8 18.1307 6.88071 19.25 5.5 19.25C4.11929 19.25 3 18.1307 3 16.75C3 15.3693 4.11929 14.25 5.5 14.25C6.88071 14.25 8 15.3693 8 16.75ZM21 16.75C21 18.1307 19.8807 19.25 18.5 19.25C17.1193 19.25 16 18.1307 16 16.75C16 15.3693 17.1193 14.25 18.5 14.25C19.8807 14.25 21 15.3693 21 16.75Z" stroke="#1E1E1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Update Status
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-end items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-2 text-neutral-700 hover:text-neutral-900 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Previous
          </button>

          <div className="flex gap-2 mx-2">
            {getPaginationPages().map((page) => (
              <button
                key={page}
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                disabled={page === '...'}
                className={`
                  px-3 py-2 rounded-lg font-medium transition-all
                  ${page === currentPage
                    ? 'bg-[#396254] text-white cursor-pointer'
                    : page === '...'
                      ? 'text-neutral-500 cursor-not-allowed'
                      : 'text-neutral-700 hover:bg-neutral-100 cursor-pointer'
                  }
                `}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-2 text-neutral-700 hover:text-neutral-900 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer"
          >
            Next
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {cancelingOrderId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 relative">
              <button
                type="button"
                onClick={() => setCancelingOrderId(null)}
                className="absolute top-6 right-6 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <div className="p-8">
                <h2 className="text-3xl font-bold text-neutral-900 mb-4">Cancel Order?</h2>
                <p className="text-neutral-700 text-base mb-8">
                  Are you sure you want to cancel order <span className="font-bold">"{cancelingOrderId}"</span>? This action can't be undone
                </p>

                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => setCancelingOrderId(null)}
                    className="px-6 py-3 border-2 border-neutral-800 text-neutral-900 font-semibold rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    Keep
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      console.log('Order cancelled:', cancelingOrderId);
                      setCancelingOrderId(null);
                    }}
                    className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {updatingOrderId && (
          <UpdateStatusForm
            orderId={updatingOrderId}
            currentStatus={orders.find(o => o.id === updatingOrderId)?.status}
            onCancel={() => setUpdatingOrderId(null)}
            onUpdate={(status) => {
              updateStatusMutation.mutate({
                orderId: updatingOrderId,
                status,
              });
            }}
          />
        )}
      </section>
    </>
  );
};

export default AdminOrder;