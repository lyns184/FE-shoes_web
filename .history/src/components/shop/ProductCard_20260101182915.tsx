import { useState } from 'react';
import { FiHeart } from 'react-icons/fi';

interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  badge?: string;
}

export default function ProductCard({ name, description, price, originalPrice, imageUrl, badge }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="overflow-hidden group hover:shadow-lg transition-shadow border border-gray-200 rounded-lg bg-white">
      <div className="relative aspect-square bg-gray-100">
        <img src={imageUrl || '/shoe.png'} alt={name} className="w-full h-full object-contain p-4" />
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
          <br />
          {description}
        </h3>
        {badge && (
          <div className="inline-block bg-black text-white text-xs px-2 py-1 rounded mb-2">
            {badge}
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">${price}</span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">${originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
}
