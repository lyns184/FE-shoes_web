import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const navItems = ['Home', 'Brands', 'Trending', 'New', 'Deals'];

export default function ShopNavigation() {
  const [activeItem, setActiveItem] = useState('Home');
  const navigate = useNavigate();

  const handleNavClick = (item: string) => {
    setActiveItem(item);
    if (item === 'Home') {
      navigate('/');
    }
  };

  return (
    <nav className="sticky top-18 z-40 bg-[#396254] text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around py-3">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => handleNavClick(item)}
              className={`text-base uppercase transition-colors relative pb-1 cursor-pointer ${
                activeItem === item
                  ? 'font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white'
                  : 'font-semibold hover:text-teal-100'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
