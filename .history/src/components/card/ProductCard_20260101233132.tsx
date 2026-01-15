import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import shoeImg from '../../assets/shoe.png';

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
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking the favorite button
    if ((e.target as HTMLElement).closest('button')) return;
    navigate(`/product/${id || 1}`);
  };

  return (
    <div onClick={handleClick} className="overflow-hidden group hover:shadow-lg transition-shadow border border-gray-200 rounded-lg bg-white cursor-pointer">
      <div className="relative aspect-square bg-gray-100">
        <img src={thumbnail || shoeImg} alt={name} className="w-full h-full object-contain p-4" />
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform cursor-pointer"
        >
          <FiHeart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-base mb-2 leading-tight">
          {name}
          {description && (
            <>
              <br />
              {description}
            </>
          )}
        </h3>
        {badge && (
          <p className="text-xs text-gray-700 mb-2">
            {badge}
          </p>
        )}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-lg">${price}</span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">${originalPrice}</span>
          )}
        </div>
        {freeship && (
          <div className="inline-block border border-gray-800 text-gray-800 text-xs px-2 py-0.5 rounded">
            Freeship
          </div>
        )}
      </div>
    </div>
  );
}
