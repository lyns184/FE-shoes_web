import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiUser, FiPackage, FiLogOut, FiSearch, FiEdit2, FiPlus } from 'react-icons/fi';
import MainLayout from '../../layouts/MainLayout';
import { useUser } from '../../hooks/UserContext';

export default function ProfilePage() {
  const [searchParams] = useSearchParams();
  const [activeMenu, setActiveMenu] = useState<'profile' | 'history'>('profile');
  const [searchQuery, setSearchQuery] = useState('');
  const { profile, orders } = useUser();

  // Handle tab from URL parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'history') {
      setActiveMenu('history');
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
  const allOrderItems = orders.flatMap(order => 
    order.items.map(item => ({
      orderId: order.id,
      ...item,
      date: order.date,
      status: order.status,
      orderTotal: order.total
    }))
  );

  const filteredOrders = allOrderItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-56 bg-white border border-gray-200 h-fit rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
          </div>

          <nav className="p-4">
            <button
              onClick={() => setActiveMenu('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors cursor-pointer ${
                activeMenu === 'profile'
                  ? 'bg-[#396254] text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiUser className="w-5 h-5 shrink-0" />
              <div>
                <div className="font-medium">Profile</div>
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
              className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors mt-2 cursor-pointer ${
                activeMenu === 'history'
                  ? 'bg-[#396254] text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiPackage className="w-5 h-5 shrink-0" />
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
              onClick={() => alert('Logging out...')}
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
                <button className="px-6 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer">
                  <FiEdit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>

              {/* Personal Information Grid */}
              <div className="grid grid-cols-3 gap-8 mb-8">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Name</h3>
                  <p className="text-gray-600">{profile.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Phone Number</h3>
                  <p className="text-gray-600">{profile.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Email Address</h3>
                  <p className="text-gray-600">{profile.email}</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border-t border-gray-200 pt-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
                  <button className="px-6 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer">
                    <FiPlus className="w-4 h-4" />
                    Add
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {profile.shippingAddresses.map((address, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 relative hover:shadow-md transition-shadow">
                      <button className="absolute top-4 right-4 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 cursor-pointer">
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <h3 className="font-bold text-gray-900 mb-2">{address.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {address.address}
                      </p>
                      <p className="text-sm text-gray-600">
                        {address.phone}
                      </p>
                    </div>
                  ))}
                </div>
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#396254]"
                />
              </div>

              {/* Orders Table */}
              {filteredOrders.length === 0 ? (
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
                        {filteredOrders.map((item) => (
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
                    <p>Showing 1 to {filteredOrders.length} of {allOrderItems.length} entries</p>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        Prev
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
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
      </div>
    </MainLayout>
  );
}
