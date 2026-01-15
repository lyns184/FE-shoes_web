import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import MainLayout from '../../layouts/MainLayout';
import ProductCard from '../../components/card/ProductCard';
import { SearchFilters, type FilterState } from '../../components/common/SearchFilters';
import { useTrendingProducts } from '../../hooks';
import Skeleton from '../../components/common/Skeleton';

export default function Trending() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    colors: [],
    priceRange: [0, 1000],
    sizes: []
  });

  // Fetch trending products from API
  const { data: apiTrendingProducts, isLoading } = useTrendingProducts(50); // Get more for filtering

  // Filter products with applied filters
  const trendingProducts = useMemo(() => {
    if (!apiTrendingProducts?.success || !apiTrendingProducts.data) {
      return [];
    }

    let filteredProducts = apiTrendingProducts.data;

    // Apply category filter
    if (filters.categories.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        filters.categories.some(cat => {
          const productCategories = Array.isArray(product.category) 
            ? product.category 
            : [product.category];
          return productCategories.some(pCat => 
            pCat?.toLowerCase().includes(cat.toLowerCase())
          );
        })
      );
    }

    // Apply brand filter
    if (filters.brands.length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        const brandName = typeof product.brand === 'string' ? product.brand : product.brand?.name || '';
        return filters.brands.includes(brandName);
      });
    }

    // Apply price filter
    const minPrice = filters.priceRange[0];
    const maxPrice = filters.priceRange[1];
    filteredProducts = filteredProducts.filter(product => {
      const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
      return price >= minPrice && price <= maxPrice;
    });

    return filteredProducts;
  }, [apiTrendingProducts, filters]);

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

        {/* Trending Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Trending</h1>
          <p className="text-gray-600">
            Hot trends and popular picks - <span className="font-semibold">{trendingProducts.length}</span> trending products
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar - full width on mobile, 1/3 on desktop */}
          <div className="w-full lg:w-1/3">
            <SearchFilters onFilterChange={handleFilterChange} />
          </div>
          
          {/* Results Content - full width on mobile, 2/3 on desktop */}
          <div className="w-full lg:w-2/3">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(12)].map((_, index) => (
                  <Skeleton key={index} className="h-80 rounded-lg" />
                ))}
              </div>
            ) : trendingProducts.length === 0 ? (
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
              <>
                {/* Results count and sorting */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <p className="text-gray-600">
                    <span className="font-semibold">{trendingProducts.length}</span> products
                  </p>
                </div>
                
                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {trendingProducts.map((product) => {
                    const getCategoryDisplay = (category: string | string[]) => {
                      const cat = Array.isArray(category) ? category[0] : category;
                      switch(cat) {
                        case 'trending': return 'Trending';
                        case 'best-seller': return 'Best Seller';
                        case 'freeship': return 'Free Ship';
                        case 'new': return 'New';
                        case 'popular': return 'Popular';
                        default: return cat || '';
                      }
                    };
                    
                    // Handle API data format
                    const brandName = typeof product.brand === 'string' ? product.brand : product.brand?.name || 'Unknown';
                    const thumbnailUrl = Array.isArray(product.thumbnail) 
                      ? (typeof product.thumbnail[0] === 'string' ? product.thumbnail[0] : product.thumbnail[0]?.url || '')
                      : (typeof product.thumbnail === 'string' ? product.thumbnail : '');
                    const productPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
                    const productCategory = Array.isArray(product.category) ? product.category[0] : product.category;
                    
                    return (
                      <ProductCard 
                        key={product.id} 
                        id={product.id}
                        name={product.name}
                        description={`${brandName} - ${Array.isArray(product.category) ? product.category.join(', ') : product.category}`}
                        price={productPrice}
                        thumbnail={thumbnailUrl}
                        category={getCategoryDisplay(productCategory)}
                        freeship={productCategory === 'freeship'}
                      />
                    );
                  })}
                </div>

                {/* Pagination placeholder */}
                {trendingProducts.length > 12 && (
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