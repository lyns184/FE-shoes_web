import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const navItems = [{ label: 'Home', id: '' }, { label: 'Brands', id: 'brands' }, { label: 'Trending', id: 'trending' }, { label: 'New', id: 'new' }, { label: 'Deals', id: 'deals' }];

export default function ShopNavigation() {
  const [activeItem, setActiveItem] = useState('Home');
  const location = useLocation();

  const handleNavClick = (item: { label: string; id: string }) => {
    setActiveItem(item.label);
    
    // If not on home page, navigate to home first
    if (location.pathname !== '/') {
      window.location.href = '/';
      return;
    }

    // Scroll to section with offset for header visibility
    if (item.id) {
      const element = document.getElementById(item.id);
      if (element) {
        const navHeight = 64; // Height of navigation bar
        const offset = element.getBoundingClientRect().top + window.scrollY - navHeight - 100;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    } else {
      // Scroll to top for Home
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-18 z-40 bg-[#396254] text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around py-3">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item)}
              className={`text-base uppercase transition-colors relative pb-1 cursor-pointer ${
                activeItem === item.label
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
