import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import MainLayout from '../../layouts/MainLayout';
import ProductCard from '../../components/card/ProductCard';
import { SearchFilters, type FilterState } from '../../components/common/SearchFilters';
import { products } from '../../data/products';

export default function Deals() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    colors: [],
    priceRange: [0, 1000],
    sizes: []
  });

  // Filter products for deals/sales with applied filters
  const dealProducts = useMemo(() => {
    let filteredProducts = products.filter(product => 
      product.category === 'best-seller' || // Best sellers are good deals
      product.category === 'freeship' || // Free shipping deals
      product.price <= 120 // Lower priced items are deals
    );

    // Apply category filter
    if (filters.categories.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        filters.categories.some(cat => 
          product.category.toLowerCase().includes(cat.toLowerCase())
        )
      );
    }

    // Apply brand filter
    if (filters.brands.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        filters.brands.includes(product.brand)
      );
    }

    // Apply price filter
    filteredProducts = filteredProducts.filter(product =>
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    return filteredProducts.slice(0, 24); // Limit to 24 deal items
  }, [filters]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

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

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar - full width on mobile, 1/3 on desktop */}
          <div className="w-full lg:w-1/3">
            <SearchFilters onFilterChange={handleFilterChange} />
          </div>
          
          {/* Results Content - full width on mobile, 2/3 on desktop */}
          <div className="w-full lg:w-2/3">
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
              <>
                {/* Results count and sorting */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <p className="text-gray-600">
                    <span className="font-semibold">{dealProducts.length}</span> products
                  </p>

                </div>
                
                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {dealProducts.map((product) => {
                    const getCategoryDisplay = (category: string) => {
                      switch(category) {
                        case 'trending': return 'Trending';
                        case 'best-seller': return 'Best Seller';
                        case 'freeship': return 'Free Ship';
                        case 'new': return 'New';
                        case 'popular': return 'Popular';
                        default: return category;
                      }
                    };
                    return (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        description={`${product.brand} - ${product.category}`}
                        price={product.price}
                        thumbnail={product.image}
                        category={getCategoryDisplay(product.category)}
                        freeship={product.category === 'freeship'}
                      />
                    );
                  })}
                </div>

                {/* Pagination placeholder */}
                {dealProducts.length > 12 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        Previous
                      </button>
                      <button className="px-3 py-2 bg-[#396254] text-white rounded-md">1</button>
                      <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">2</button>
                      <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">3</button>
                      <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}