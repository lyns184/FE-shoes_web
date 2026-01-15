import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Home', path: '/' }, 
  // { label: 'Brands', path: '/brands' }, 
  { label: 'Trending', path: '/trending' }, 
  { label: 'New', path: '/new' }, 
  { label: 'Deals', path: '/deals' }
];

export default function ShopNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(() => {
    const currentItem = navItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.label : 'Home';
  });

  const handleNavClick = (item: { label: string; path: string }) => {
    setActiveItem(item.label);
    navigate(item.path);
  };

  return (
    <nav className="sticky top-18 z-40 bg-[#396254] text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center sm:justify-around py-3 overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item)}
              className={`text-sm sm:text-base uppercase transition-colors relative pb-1 cursor-pointer px-4 sm:px-2 whitespace-nowrap ${
                location.pathname === item.path
                  ? 'font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white'
                  : 'font-semibold hover:text-teal-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
