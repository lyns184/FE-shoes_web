import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiX } from 'react-icons/fi';
import logoImg from '../../assets/logo.png';
import { useCart } from '../../hooks/useCart';
import { products } from '../../data/products';

export default function ShopHeader() {
  const [searchValue, setSearchValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { totalItems } = useCart();

  // Filter products based on search value
  const searchResults = useMemo(() => {
    if (!searchValue.trim()) return [];
    return products.filter(product =>
      product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchValue.toLowerCase()) ||
      product.category.toLowerCase().includes(searchValue.toLowerCase())
    ).slice(0, 5); // Limit to 5 results
  }, [searchValue]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setShowDropdown(false);
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleProductClick = (productId: number) => {
    setSearchValue('');
    setShowDropdown(false);
    navigate(`/product/${productId}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer">
            <img 
              src={logoImg} 
              alt="Logo" 
              className="h-6 sm:h-8 object-contain" 
              style={{ filter: 'brightness(1) contrast(1.1) saturate(1.1)', imageRendering: 'crisp-edges' }}
            />
          </div>

          {/* Desktop Search Bar */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-xl mx-8 relative">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer">
                  <FiSearch className="h-4 w-4 text-gray-400" />
                </button>
                <input
                  type="text"
                  placeholder="Search for brand, color, etc"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
                {searchValue && (
                  <button 
                    type="button"
                    onClick={() => {
                      setSearchValue('');
                      setShowDropdown(false);
                    }} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    <FiX className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>
            </form>

            {/* Search Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-md shadow-lg mt-1 max-h-60 overflow-y-auto z-50">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.brand}</p>
                    </div>
                    <div className="ml-auto">
                      <p className="font-semibold text-sm">${product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile/Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Button */}
            <button 
              type="button"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
              title="Search"
              aria-label="Toggle search"
            >
              <FiSearch className="h-5 w-5" />
            </button>

            {/* Cart Button */}
            <button 
              type="button"
              onClick={() => navigate('/cart')} 
              className="relative p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
              title="Shopping Cart"
              aria-label="Go to shopping cart"
            >
              <FiShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#396254] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Profile Button */}
            <button 
              type="button"
              onClick={() => navigate('/profile')} 
              className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
              title="Profile"
              aria-label="Go to profile"
            >
              <FiUser className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer">
                  <FiSearch className="h-4 w-4 text-gray-400" />
                </button>
                <input
                  type="text"
                  placeholder="Search for brand, color, etc"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
                {searchValue && (
                  <button 
                    type="button"
                    onClick={() => setSearchValue('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    <FiX className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
