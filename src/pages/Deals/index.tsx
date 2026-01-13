import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import MainLayout from '../../layouts/MainLayout';
import ProductCard from '../../components/card/ProductCard';
import { products } from '../../data/products';

export default function Deals() {
  const navigate = useNavigate();

  // Filter products for deals/sales - products with discounts or lower prices
  const dealProducts = useMemo(() => {
    return products.filter(product => 
      product.originalPrice || // Products with original price (indicating discount)
      product.price <= 250 || // Lower priced items
      product.badge === 'Sale' ||
      product.badge === 'Best Sold'
    ).slice(0, 20); // Limit to 20 deal items
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

        {/* Deals Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Deals & Sales</h1>
          <p className="text-gray-600">
            Amazing deals and discounts - <span className="font-semibold">{dealProducts.length}</span> products on sale
          </p>
        </div>

        {/* Results */}
        {dealProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No deals available right now</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#396254] hover:bg-[#2d4d3f] text-white px-6 py-2 rounded-md cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dealProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}