import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import MainLayout from '../../layouts/MainLayout';
import BrandCard from '../../components/card/BrandCard';
import nikeImg from '../../assets/nike.jpg';

export default function Brands() {
  const navigate = useNavigate();

  // Brand data with logos and images
  const brands = useMemo(() => [
    {
      name: 'Nike',
      imageUrl: nikeImg,
      logoUrl: nikeImg,
    },
    {
      name: 'Jordan',
      imageUrl: nikeImg,
      logoUrl: nikeImg,
    },
    {
      name: 'Adidas',
      imageUrl: nikeImg,
      logoUrl: nikeImg,
    },
    {
      name: 'Converse',
      imageUrl: nikeImg,
      logoUrl: nikeImg,
    },
    {
      name: 'Vans',
      imageUrl: nikeImg,
      logoUrl: nikeImg,
    },
    {
      name: 'Puma',
      imageUrl: nikeImg,
      logoUrl: nikeImg,
    },
    {
      name: 'New Balance',
      imageUrl: nikeImg,
      logoUrl: nikeImg,
    },
    {
      name: 'Reebok',
      imageUrl: nikeImg,
      logoUrl: nikeImg,
    },
    {
      name: 'Under Armour',
      imageUrl: nikeImg,
      logoUrl: nikeImg,
    },
  ], []);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center justify-center w-10 h-10 rounded-full bg-[#396254] hover:bg-[#2d4d3f] transition-colors cursor-pointer"
        >
          <FiChevronLeft className="h-5 w-5 text-white" />
        </button>

        {/* Brands Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Popular Brands</h1>
          <p className="text-gray-600">
            Discover top footwear brands - <span className="font-semibold">{brands.length}</span> leading brands
          </p>
        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand, index) => (
            <BrandCard key={index} {...brand} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}