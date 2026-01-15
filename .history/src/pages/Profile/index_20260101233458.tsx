import { useState } from 'react';
import { FiUser, FiPackage, FiLogOut, FiSearch, FiEdit2, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';

interface Order {
  id: number;
  name: string;
  variant: string;
  image: string;
  date: string;
  price: string;
  status: 'Delivered' | 'Processing' | 'Cancelled';
}

export default function ProfilePage() {
  const [activeMenu, setActiveMenu] = useState<'profile' | 'history'>('profile');
  const [searchQuery, setSearchQuery] = useState('');

  const orders: Order[] = [
    {
      id: 1,
      name: 'Jordan 1 Retro Low OG SP',
      variant: 'Travis Scott Velvet Brown',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
      date: 'Oct 24, 2023',
      price: '$321.00',
      status: 'Delivered',
    },
    {
      id: 2,
      name: 'Jordan 1 Retro Low OG SP',
      variant: 'Travis Scott Velvet Brown',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
      date: 'Oct 24, 2023',
      price: '$321.00',
      status: 'Processing',
    },
    {
      id: 3,
      name: 'Jordan 1 Retro Low OG SP',
      variant: 'Travis Scott Velvet Brown',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
      date: 'Oct 24, 2023',
      price: '$321.00',
      status: 'Cancelled',
    },
  ];

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

  const filteredOrders = orders.filter(
    (order) =>
      order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.variant.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-56 bg-white border border-gray-200 h-fit rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">John Doe</h2>
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
                  <p className="text-gray-600">John Doe</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Phone Number</h3>
                  <p className="text-gray-600">+84 1234567890</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Email Address</h3>
                  <p className="text-gray-600">johndoe@example.com</p>
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
                  {/* Address Card 1 */}
                  <div className="border border-gray-200 rounded-lg p-4 relative hover:shadow-md transition-shadow">
                    <button className="absolute top-4 right-4 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 cursor-pointer">
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <h3 className="font-bold text-gray-900 mb-2">John Doe</h3>
                    <p className="text-sm text-gray-600">
                      Dong Khoi Strict, Bien Hoa,
                      <br />
                      Dong Nai, 36000
                    </p>
                  </div>

                  {/* Address Card 2 */}
                  <div className="border border-gray-200 rounded-lg p-4 relative hover:shadow-md transition-shadow">
                    <button className="absolute top-4 right-4 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 cursor-pointer">
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <h3 className="font-bold text-gray-900 mb-2">John Doe</h3>
                    <p className="text-sm text-gray-600">
                      Dong Khoi Strict, Bien Hoa,
                      <br />
                      Dong Nai, 36000
                    </p>
                  </div>

                  {/* Address Card 3 */}
                  <div className="border border-gray-200 rounded-lg p-4 relative hover:shadow-md transition-shadow">
                    <button className="absolute top-4 right-4 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 cursor-pointer">
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <h3 className="font-bold text-gray-900 mb-2">John Doe</h3>
                    <p className="text-sm text-gray-600">
                      Dong Khoi Strict, Bien Hoa,
                      <br />
                      Dong Nai, 36000
                    </p>
                  </div>
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
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-200 last:border-b-0">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                              <img
                                src={order.image}
                                alt={order.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{order.name}</h3>
                              <p className="text-sm text-gray-600">{order.variant}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-700">{order.date}</td>
                        <td className="py-4 px-4 text-gray-700">{order.price}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
                <p>Showing 1 to {filteredOrders.length} of {orders.length} entries</p>
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
        </div>
      </div>
      </div>
    </MainLayout>
  );
}
