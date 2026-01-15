import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiX } from 'react-icons/fi';

export default function ShopHeader() {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="h-8" />
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for brand, color, etc"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              {searchValue && (
                <button 
                  onClick={() => setSearchValue('')} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  <FiX className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
              <FiShoppingCart className="h-5 w-5" />
            </button>
            <button onClick={() => navigate('/login')} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
              <FiUser className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
