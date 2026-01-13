import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import MainLayout from '../../layouts/MainLayout';
import ProductCard from '../../components/card/ProductCard';
import { products } from '../../data/products';

export default function Trending() {
  const navigate = useNavigate();

  // Filter products for trending - products with higher prices or specific badges
  const trendingProducts = useMemo(() => {
    return products.filter(product => 
      product.price >= 300 || // Higher priced items are trending
      product.badge === 'Best Sold' ||
      product.badge === 'Hot'
    ).slice(0, 12); // Limit to 12 trending items
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

        {/* Trending Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Trending</h1>
          <p className="text-gray-600">
            Hot trends and popular picks - <span className="font-semibold">{trendingProducts.length}</span> trending products
          </p>
        </div>

        {/* Results */}
        {trendingProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No trending products found</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#396254] hover:bg-[#2d4d3f] text-white px-6 py-2 rounded-md cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}