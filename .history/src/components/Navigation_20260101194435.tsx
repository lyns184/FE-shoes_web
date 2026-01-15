import { useState } from 'react';
import { FiMenu } from 'react-icons/fi';

const navItems = ['Home', 'Brands', 'Trending', 'New', 'Deals'];

export default function ShopNavigation() {
  const [activeItem, setActiveItem] = useState('Home');

  return (
    <nav className="sticky top-[72px] z-40 bg-[#396254] text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around py-3">
          {/* Hamburger Menu */}
          <button className="text-white cursor-pointer hover:text-teal-100">
            <FiMenu className="h-5 w-5" />
          </button>
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveItem(item)}
              className={`text-sm transition-colors relative pb-1 cursor-pointer ${
                activeItem === item
                  ? 'font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white'
                  : 'font-medium hover:text-teal-100'
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
