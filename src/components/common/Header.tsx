import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiX } from 'react-icons/fi';
import logoImg from '../../assets/logo.png';
import { useCart } from '../../hooks/useCart';
import { products } from '../../data/products';

export default function ShopHeader() {
  const [searchValue, setSearchValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
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
            <img src={logoImg} alt="Logo" className="h-8" />
          </div>

          {/* Search Bar */}
          <div ref={searchRef} className="flex-1 max-w-xl mx-8 relative">
            <form onSubmit={handleSearch}>
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
            {showDropdown && searchValue.trim() && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                {searchResults.length > 0 ? (
                  <>
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                          <p className="text-xs text-gray-500 truncate">{product.brand} - {product.category}</p>
                        </div>
                        <p className="text-sm font-semibold text-[#396254]">${product.price}</p>
                      </div>
                    ))}
                    <div
                      onClick={handleSearch as unknown as React.MouseEventHandler}
                      className="p-3 text-center text-sm text-[#396254] hover:bg-gray-50 cursor-pointer border-t border-gray-200"
                    >
                      See all results for "{searchValue}"
                    </div>
                  </>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No products found for "{searchValue}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
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
      </div>
    </header>
  );
}
