import { useState } from 'react';
import { FiHeart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  id?: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  badge?: string;
  freeship?: boolean;
}

export default function ProductCard({ id, name, description, price, originalPrice, thumbnail, badge, freeship }: ProductCardProps) {
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
        <img src={thumbnail || '/shoe.png'} alt={name} className="w-full h-full object-contain p-4" />
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <FiHeart
            className={`w-5 h-5 transition-all ${
              isFavorite 
                ? 'fill-red-500 stroke-red-500' 
                : 'stroke-gray-400 hover:stroke-gray-600'
            }`}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-base mb-2 leading-tight">
          {name}
        </h3>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {badge && (
            <span className={`text-xs font-medium px-2 py-1 rounded ${
              badge === 'Best Sold' ? 'bg-red-100 text-red-700' :
              badge === 'Low Price' ? 'bg-green-100 text-green-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {badge}
            </span>
          )}
          {freeship && (
            <span className="text-xs font-medium px-2 py-1 rounded bg-orange-100 text-orange-700">
              Freeship
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-lg">${price}</span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">${originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
}
