import { useState } from 'react';
import { FiHeart } from 'react-icons/fi';
import { LiaTruckSolid } from 'react-icons/lia';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  id?: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  category?: string;
  freeship?: boolean;
}

export default function ProductCard({ id, name, description, price, originalPrice, thumbnail, category, freeship }: ProductCardProps) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking the favorite button
    if ((e.target as HTMLElement).closest('button')) return;
    navigate(`/product/${id || 1}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div onClick={handleClick} className="overflow-hidden group hover:shadow-lg transition-shadow border border-gray-200 rounded-lg bg-white cursor-pointer">
      <div className="relative aspect-square bg-gray-100">
        <img src={thumbnail || '/shoe.png'} alt={name} className="w-full h-full object-contain p-2 sm:p-4" />
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <FiHeart
            className={`w-4 h-4 sm:w-5 sm:h-5 transition-all ${
              isFavorite 
                ? 'fill-red-500 stroke-red-500' 
                : 'stroke-gray-400 hover:stroke-gray-600'
            }`}
          />
        </button>
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2 leading-tight line-clamp-2">
          {name}
        </h3>
        <div className="flex items-center gap-2 mb-1 sm:mb-2 flex-wrap">
          {category && (
            <span className={`text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md flex items-center gap-1 ${
              category === 'Free Ship' 
                ? 'bg-gray-900 text-white' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {category === 'Free Ship' && <LiaTruckSolid size={12} className="sm:text-sm" />}
              <span className="text-xs">{category}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mb-1 sm:mb-2">
          <span className="font-bold text-base sm:text-lg">${price}</span>
          {originalPrice && (
            <span className="text-xs sm:text-sm text-gray-400 line-through">${originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
}
