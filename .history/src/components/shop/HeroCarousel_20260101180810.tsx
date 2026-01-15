import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function HeroCarousel() {
  return (
    <div className="relative bg-gray-200 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative h-[300px] flex items-center justify-center">
          <img 
            src="/banner.png" 
            alt="Sale Banner" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-8xl font-bold text-red-600 tracking-wider">SALE</h1>
          </div>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full cursor-pointer">
            <FiChevronLeft className="h-6 w-6" />
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full cursor-pointer">
            <FiChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
