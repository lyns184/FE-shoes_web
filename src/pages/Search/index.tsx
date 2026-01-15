import { useState, useEffect, useMemo, useTransition } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import MainLayout from '../../layouts/MainLayout';
import ProductCard from '../../components/card/ProductCard';
import { ProductGridSkeleton } from '../../components/common/Skeleton';
import Skeleton from '../../components/common/Skeleton';
import { SearchFilters, type FilterState } from '../../components/common/SearchFilters';
import { useSearchProducts, useProducts } from '../../hooks';
import { products } from '../../data/products';

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [isPending, startTransition] = useTransition();
  const [displayQuery, setDisplayQuery] = useState(query);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    colors: [],
    priceRange: [0, 1000],
    sizes: []
  });

  // Use TanStack Query for search
  const { 
    data: searchResults, 
    isLoading: isSearchLoading,
    error: searchError 
  } = useSearchProducts(displayQuery, displayQuery.length >= 2);

  // Fallback: Use general products query if no search query
  const { 
    data: allProductsData, 
    isLoading: isProductsLoading 
  } = useProducts({}, !displayQuery || displayQuery.length < 2);

  // Determine which data to use
  const apiResults = displayQuery.length >= 2 ? searchResults : allProductsData;
  const isLoading = displayQuery.length >= 2 ? isSearchLoading : isProductsLoading;

  // Calculate results with filters applied
  const results = useMemo(() => {
    let filteredProducts;

    // Use API results if available, otherwise use local data
    if (apiResults?.success && apiResults.data) {
      filteredProducts = apiResults.data;
    } else {
      // Fallback to local data with search filter
      filteredProducts = products;
      if (displayQuery) {
        filteredProducts = filteredProducts.filter(product => 
          product.name.toLowerCase().includes(displayQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(displayQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(displayQuery.toLowerCase())
        );
      }
    }

    // Apply additional filters to both API and local data
    // Apply category filter
    if (filters.categories.length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        const productCategories = Array.isArray(product.category) 
          ? product.category 
          : [product.category];
        return filters.categories.some(cat => 
          productCategories.some(pc => 
            pc.toLowerCase().includes(cat.toLowerCase())
          )
        );
      });
    }

    // Apply brand filter
    if (filters.brands.length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        const brandName = product.brand?.name || product.brand;
        return filters.brands.includes(brandName);
      });
    }

    // Apply price filter
    if (filteredProducts) {
      filteredProducts = filteredProducts.filter(product => {
        const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
    }

    return filteredProducts || [];
  }, [displayQuery, filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        setDisplayQuery(query);
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

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

        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          {query && (
            <p className="text-gray-600">
              Showing results for "<span className="font-semibold">{query}</span>" - {results.length} products found
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar - full width on mobile, 1/3 on desktop */}
          <div className="w-full lg:w-1/3">
            <SearchFilters onFilterChange={handleFilterChange} />
          </div>
          
          {/* Results Content - full width on mobile, 2/3 on desktop */}
          <div className="w-full lg:w-2/3">
            {(isLoading || isPending) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, index) => (
                  <Skeleton key={index} className="h-80 rounded-lg" />
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">
                  {query ? 'No products found for your search.' : 'Enter a search term to find products.'}
                </p>
                {searchError && (
                  <p className="text-red-500 text-sm mb-4">
                    Search failed: {searchError.message}
                  </p>
                )}
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
                    <span className="font-semibold">{results.length}</span> products
                  </p>
                </div>
                
                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {results.map((product) => {
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

                    // Handle both API and local data formats
                    const productData = product.brand?.name 
                      ? {
                          id: product.id,
                          name: product.name,
                          description: `${product.brand.name} - ${Array.isArray(product.category) ? product.category.join(', ') : product.category}`,
                          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
                          thumbnail: Array.isArray(product.thumbnail) ? product.thumbnail[0]?.url || product.thumbnail[0] : product.thumbnail,
                          category: Array.isArray(product.category) ? getCategoryDisplay(product.category[0]) : getCategoryDisplay(product.category),
                        }
                      : {
                          id: product.id,
                          name: product.name,
                          description: `${product.brand} - ${product.category}`,
                          price: product.price,
                          thumbnail: product.image,
                          category: getCategoryDisplay(product.category),
                        };

                    return (
                      <ProductCard
                        key={product.id}
                        id={productData.id}
                        name={productData.name}
                        description={productData.description}
                        price={productData.price}
                        thumbnail={productData.thumbnail}
                        category={productData.category}
                        freeship={productData.category === 'Free Ship'}
                      />
                    );
                  })}
                </div>

                {/* Pagination placeholder */}
                {results.length > 12 && (
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
