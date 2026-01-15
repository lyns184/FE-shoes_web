import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';

interface ReleaseCardProps {
  id?: number;
  date: string;
  name: string;
  imageUrl: string;
}

export default function ReleaseCard({ id, date, name, imageUrl }: ReleaseCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    navigate(`/product/${id || 1}`);
  };

  return (
    <div onClick={handleClick} className="overflow-hidden group hover:shadow-lg transition-shadow border border-gray-200 rounded-lg bg-white cursor-pointer">
      <div className="p-4 flex items-center justify-between border-b">
        <span className="font-semibold">{date}</span>
        <button 
          onClick={() => setIsFavorite(!isFavorite)} 
          className="hover:scale-110 transition-transform cursor-pointer"
        >
          <FiHeart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
      </div>
      <div className="relative aspect-square bg-gray-100">
        <img src={imageUrl || '/shoe.png'} alt={name} className="w-full h-full object-contain p-4" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm">{name}</h3>
      </div>
    </div>
  );
}
