import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { brands } from '../../data/brands';

export interface FilterState {
  categories: string[];
  brands: string[];
  colors: string[];
  priceRange: [number, number];
  sizes: string[];
}

interface SearchFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
  className?: string;
}

export function SearchFilters({ onFilterChange, className = '' }: SearchFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 500]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    brands: true,
    color: true,
    price: true
  });

  const categories = ['trending', 'best-seller', 'freeship', 'new', 'popular'];
  
  const colors = [
    { name: 'Black', color: '#000000' },
    { name: 'White', color: '#FFFFFF' },
    { name: 'Red', color: '#FF0000' },
    { name: 'Blue', color: '#0000FF' },
    { name: 'Green', color: '#00FF00' },
    { name: 'Yellow', color: '#FFFF00' },
    { name: 'Brown', color: '#8B4513' },
    { name: 'Gray', color: '#808080' },
    { name: 'Pink', color: '#FFC0CB' },
    { name: 'Orange', color: '#FFA500' },
    { name: 'Purple', color: '#800080' },
    { name: 'Navy Blue', color: '#000080' },
    { name: 'Gold', color: '#FFD700' },
    { name: 'Silver', color: '#C0C0C0' },
    { name: 'Beige', color: '#F5F5DC' },
    { name: 'Maroon', color: '#800000' }
  ];

  const sizes = ['38', '39', '40', '41', '42', '43', '44', '45'];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = {
      categories: selectedCategories,
      brands: selectedBrands,
      colors: selectedColors,
      priceRange,
      sizes: [], // Keep empty array for compatibility
      ...newFilters
    };
    onFilterChange?.(updatedFilters);
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked 
      ? [...selectedBrands, brand] 
      : selectedBrands.filter(b => b !== brand);
    setSelectedBrands(newBrands);
    handleFilterChange({ brands: newBrands });
  };

  const handleColorChange = (color: string) => {
    const newColors = selectedColors.includes(color)
      ? selectedColors.filter(c => c !== color)
      : [...selectedColors, color];
    setSelectedColors(newColors);
    handleFilterChange({ colors: newColors });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, category]
      : selectedCategories.filter(c => c !== category);
    setSelectedCategories(newCategories);
    handleFilterChange({ categories: newCategories });
  };

  const handlePriceChange = (newRange: [number, number]) => {
    setPriceRange(newRange);
    handleFilterChange({ priceRange: newRange });
  };

  return (
    <aside className={`w-full bg-white border border-gray-200 lg:border-r lg:border-t-0 lg:border-l-0 lg:border-b-0 rounded-lg lg:rounded-none h-fit ${className}`}>
      <div className="p-4 space-y-4">
        <div className="lg:hidden">
          <h2 className="font-semibold text-gray-900 mb-4 text-lg">Filters</h2>
        </div>
        <div className="hidden lg:block">
          <h2 className="font-semibold text-gray-900 mb-6 text-lg">Filter</h2>
        </div>

        {/* Category */}
        <div className="border-b border-gray-200 pb-6">
          <button 
            onClick={() => toggleSection('category')}
            className="w-full flex items-center justify-between font-medium text-gray-900 mb-3 text-left"
          >
            Category
            {expandedSections.category ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
          </button>
          {expandedSections.category && (
            <div className="space-y-2">
              {categories.map((category) => {
                const getCategoryDisplay = (cat: string) => {
                  switch(cat) {
                    case 'trending': return 'Trending';
                    case 'best-seller': return 'Best Seller';
                    case 'freeship': return 'Free Ship';
                    case 'new': return 'New';
                    case 'popular': return 'Popular';
                    default: return cat;
                  }
                };
                return (
                  <label key={category} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={(e) => handleCategoryChange(category, e.target.checked)}
                      className="w-4 h-4 text-[#396254] border-gray-300 rounded focus:ring-[#396254]"
                    />
                    <span className="text-sm text-gray-700">{getCategoryDisplay(category)}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Brands */}
        <div className="border-b border-gray-200 pb-6">
          <button 
            onClick={() => toggleSection('brands')}
            className="w-full flex items-center justify-between font-medium text-gray-900 mb-3 text-left"
          >
            Brands
            {expandedSections.brands ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
          </button>
          {expandedSections.brands && (
            <div className="space-y-2">
              {brands.map((brand) => (
                <label key={brand.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand.name)}
                    onChange={(e) => handleBrandChange(brand.name, e.target.checked)}
                    className="w-4 h-4 text-[#396254] border-gray-300 rounded focus:ring-[#396254]"
                  />
                  <span className="text-sm text-gray-700">{brand.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Color */}
        <div className="border-b border-gray-200 pb-6">
          <button 
            onClick={() => toggleSection('color')}
            className="w-full flex items-center justify-between font-medium text-gray-900 mb-3 text-left"
          >
            Color
            {expandedSections.color ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
          </button>
          {expandedSections.color && (
            <div className="flex gap-1.5 flex-wrap">
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => handleColorChange(c.name)}
                  className={`w-6 h-6 rounded-full border transition-all hover:scale-110 ${
                    selectedColors.includes(c.name) ? 'border-gray-800 ring-1 ring-gray-400' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: c.color }}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="border-b border-gray-200 pb-6">
          <button 
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between font-medium text-gray-900 mb-3 text-left"
          >
            Price
            {expandedSections.price ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
          </button>
          {expandedSections.price && (
            <div className="space-y-3">
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange([Number(e.target.value), priceRange[1]])}
                  className="w-20 px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#396254]"
                  min="0"
                  max="1000"
                  placeholder="Min"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange([priceRange[0], Number(e.target.value)])}
                  className="w-20 px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#396254]"
                  min="0"
                  max="1000"
                  placeholder="Max"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}