import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import MainLayout from '../../layouts/MainLayout';
import ProductCard from '../../components/card/ProductCard';
import { products } from '../../data/products';

export default function New() {
  const navigate = useNavigate();

  // Filter products for new arrivals - newest products or those with "New" indicator
  const newProducts = useMemo(() => {
    return products.filter(product => 
      product.badge === 'New Arrival' ||
      product.badge === 'Freeship' ||
      product.id >= Math.max(...products.map(p => p.id)) - 8 // Last 8 products as "new"
    ).slice(0, 16); // Limit to 16 new items
  }, []);

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

        {/* New Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">New Arrivals</h1>
          <p className="text-gray-600">
            Fresh styles just landed - <span className="font-semibold">{newProducts.length}</span> new products
          </p>
        </div>

        {/* Results */}
        {newProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No new arrivals found</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#396254] hover:bg-[#2d4d3f] text-white px-6 py-2 rounded-md cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}