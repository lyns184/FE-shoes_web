import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiUser, FiPackage, FiLogOut, FiSearch, FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import MainLayout from '../../layouts/MainLayout';
import EditProfileModal from '../../components/common/EditProfileModal';
import ShippingAddressModal from '../../components/common/ShippingAddressModal';
import { useUser } from '../../hooks/UserContext';
import { checkAuth, logout } from '../../services/auth';
import checkLogin from '../../utlis/checkLogin';
// Interface for flattened order items
interface OrderItem {
  orderId: number;
  id: number;
  name: string;
  description: string;
  price: number;
  thumbnail: string;
  date: string;
  status: string;
  orderTotal: number;
  size?: string;
  color?: string;
  quantity?: number;
}

export default function ProfilePage() 
{
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<'profile' | 'history'>('profile');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ORDERS_PER_PAGE = 10;
  const { profile, orders, isLoading, error, updateProfile, setDefaultShippingAddress, removeDefaultShippingAddress, clearAll } = useUser();

  useEffect(() => {
    if (!checkLogin()) {
      navigate('/login');
    }
  }, [navigate]);

  // Handle tab from URL parameter and auto-open address modal if redirected from checkout
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'history') {
      setActiveMenu('history');
      setCurrentPage(1); // Reset to page 1 when entering history
    }
    
    // If redirected from checkout to add address, auto-open the modal
    const fromCheckout = searchParams.get('addAddress');
    if (fromCheckout === 'true') {
      setActiveMenu('profile');
      setShowShippingModal(true);
    }
  }, [searchParams]);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-700 bg-green-50';
      case 'Processing':
        return 'text-orange-700 bg-orange-50';
      case 'Cancelled':
        return 'text-red-700 bg-red-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  // Flatten orders to show each product separately
  const allOrderItems: OrderItem[] = orders.flatMap(order => {
    // Handle both legacy format (with items array) and new API format
    if (order.items && order.items.length > 0) {
      return order.items.map(item => ({
        orderId: order.id,
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: item.price,
        thumbnail: item.thumbnail || '/shoe.png',
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        date: order.date || new Date(order.createdAt || '').toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        status: order.status,
        orderTotal: order.total
      }));
    }
    // For API format without items, show the order itself
    return [{
      orderId: order.id,
      id: order.id,
      name: `Order #${order.id}`,
      description: order.status,
      price: order.total,
      thumbnail: '/shoe.png',
      date: order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) : 'N/A',
      status: order.status,
      orderTotal: order.total
    }];
  });

  const filteredOrders = allOrderItems.filter(
    (item: OrderItem) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));
  
  // Ensure currentPage is valid (1-based, not exceeding totalPages)
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safePage - 1) * ORDERS_PER_PAGE;
  const endIndex = Math.min(startIndex + ORDERS_PER_PAGE, filteredOrders.length);
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <MainLayout>
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-4 sm:py-8">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="text-red-600 text-lg">⚠️ {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#396254] text-white rounded-lg hover:bg-[#2d4f42] transition-colors"
          >
            Retry
          </button>
        </div>
      ) : !profile ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Please log in to view your profile</div>
        </div>
      ) : (
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-56 bg-white border border-gray-200 h-fit rounded-lg">
          <div className="p-4 sm:p-6 border-b border-gray-200 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#396254] rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold mx-auto mb-2 sm:mb-3">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                profile.name.charAt(0).toUpperCase()
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">{profile.name}</h2>
          </div>

          <nav className="p-4">
            <button
              onClick={() => setActiveMenu('profile')}
              className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 text-left rounded-lg transition-colors cursor-pointer ${
                activeMenu === 'profile'
                  ? 'bg-[#396254] text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiUser className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <div>
                <div className="font-medium text-sm sm:text-base">Profile</div>
                <div
                  className={`text-xs ${
                    activeMenu === 'profile' ? 'text-green-100' : 'text-gray-500'
                  }`}
                >
                  Name, Email, Payment...
                </div>
              </div>
            </button>

            <button
              onClick={() => setActiveMenu('history')}
              className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 text-left rounded-lg transition-colors mt-2 cursor-pointer ${
                activeMenu === 'history'
                  ? 'bg-[#396254] text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiPackage className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <div>
                <div className="font-medium">History</div>
                <div
                  className={`text-xs ${
                    activeMenu === 'history' ? 'text-green-100' : 'text-gray-500'
                  }`}
                >
                  In-Progress Complete Orders...
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                console.log('User logging out...');
                logout(); // Clear authentication tokens and local storage
                clearAll(); // Clear user context data
                // Force full page reload to reset all contexts and states
                window.location.href = '/login';
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors mt-2 text-gray-700 hover:bg-gray-50"
            >
              <FiLogOut className="w-5 h-5 shrink-0" />
              <div className="font-medium">Logout</div>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 bg-white border border-gray-200 p-8 rounded-lg">
          {activeMenu === 'profile' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                  <p className="text-gray-600 mt-1">Personal Information</p>
                </div>
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="px-6 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>

              {/* Avatar and Personal Information */}
              <div className="flex items-start gap-8 mb-8">
                <div className="w-24 h-24 bg-[#396254] rounded-full flex items-center justify-center text-white text-3xl font-bold shrink-0">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    profile.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 flex-1">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Name</h3>
                  <p className="text-gray-600 break-words">{profile.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Phone Number</h3>
                  <p className="text-gray-600 break-words">{profile.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Email Address</h3>
                  <p className="text-gray-600 break-all text-sm">{profile.email}</p>
                </div>
                </div>
              </div>

              {/* Default Shipping Address */}
              <div className="border-t border-gray-200 pt-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Default Shipping Address</h2>
                    <p className="text-sm text-gray-500 mt-1">This address will be used for checkout by default</p>
                  </div>
                  {!profile.defaultShippingAddress ? (
                    <button 
                      onClick={() => setShowShippingModal(true)}
                      className="px-6 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <FiPlus className="w-4 h-4" />
                      Add
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setShowShippingModal(true)}
                        className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <FiEdit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm('Are you sure you want to remove the default shipping address?')) {
                            removeDefaultShippingAddress();
                          }
                        }}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-full text-sm font-medium hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {profile.defaultShippingAddress ? (
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2">Default Address</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {profile.defaultShippingAddress.address}
                        </p>
                        <p className="text-sm text-gray-600">
                          {profile.defaultShippingAddress.postalCode}
                        </p>
                        <span className="inline-block mt-3 px-3 py-1 bg-[#396254] text-white text-xs font-medium rounded-full">
                          Default
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-gray-500 text-sm mb-3">No default shipping address set</p>
                    <p className="text-gray-400 text-xs">Add a default address to make checkout faster</p>
                  </div>
                )}
              </div>
            </>
          )}

          {activeMenu === 'history' && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">History</h1>

              {/* Search Bar */}
              <div className="relative mb-6">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search name, order, ..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#396254]"
                />
              </div>

              {/* Orders Table */}
              {paginatedOrders.length === 0 ? (
                <div className="border border-gray-200 rounded-lg p-12 text-center">
                  <p className="text-gray-500 text-lg mb-4">No orders found</p>
                  {orders.length === 0 && (
                    <p className="text-sm text-gray-400">Start shopping to see your order history here</p>
                  )}
                </div>
              ) : (
                <>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                            Item
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                            Date
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                            Price
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedOrders.map((item) => (
                          <tr key={`${item.orderId}-${item.id}`} className="border-b border-gray-200 last:border-b-0">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                                  <img
                                    src={item.thumbnail || '/shoe.png'}
                                    alt={item.name}
                                    className="w-full h-full object-contain p-1"
                                  />
                                </div>
                                <div>
                                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                                  <p className="text-sm text-gray-600">{item.description}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-gray-700">{item.date}</td>
                            <td className="py-4 px-4 text-gray-700">${item.price}</td>
                            <td className="py-4 px-4">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(
                                  item.status
                                )}`}
                              >
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
                    <p>
                      Showing {paginatedOrders.length > 0 ? startIndex + 1 : 0} to {endIndex} of {filteredOrders.length} entries
                      {filteredOrders.length !== allOrderItems.length && ` (filtered from ${allOrderItems.length} total)`}
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={safePage === 1}
                        className={`px-4 py-2 border border-gray-300 rounded-lg transition-colors cursor-pointer ${
                          safePage === 1 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        Prev
                      </button>
                      
                      {/* Page numbers */}
                      <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 border border-gray-300 rounded-lg transition-colors cursor-pointer ${
                              safePage === page
                                ? 'bg-[#396254] text-white border-[#396254]'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={safePage === totalPages}
                        className={`px-4 py-2 border border-gray-300 rounded-lg transition-colors cursor-pointer ${
                          safePage === totalPages 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
      )}
      </div>

      {/* Edit Profile Modal */}
      {profile && (
        <EditProfileModal
          isOpen={showEditModal}
          profile={profile}
          onSave={updateProfile}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* Shipping Address Modal */}
      <ShippingAddressModal
        isOpen={showShippingModal}
        initialData={profile?.defaultShippingAddress ? {
          address: profile.defaultShippingAddress.address,
          postalCode: profile.defaultShippingAddress.postalCode
        } : undefined}
        onSave={(data) => {
          setDefaultShippingAddress({
            address: data.address,
            postalCode: data.postalCode
          });
          
          // Navigate back to checkout if address was added from checkout flow
          const fromCheckout = searchParams.get('addAddress');
          if (fromCheckout === 'true') {
            setTimeout(() => navigate('/checkout'), 500);
          }
        }}
        onClose={() => {
          setShowShippingModal(false);
        }}
      />
    </MainLayout>
  );
}
