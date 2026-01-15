import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import MainLayout from '../../layouts/MainLayout';
import ProductCard from '../../components/card/ProductCard';
import { ProductGridSkeleton } from '../../components/common/Skeleton';
import { products } from '../../data/products';

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<typeof products>([]);

  useEffect(() => {
    // Simulate loading delay to show skeleton
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      if (query) {
        const filtered = products.filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.badge?.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
      } else {
        setResults([]);
      }
      setIsLoading(false);
    }, 500); // 500ms delay to show loading state

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 cursor-pointer"
        >
          <FiChevronLeft className="h-5 w-5" />
          <span className="font-semibold">Back</span>
        </button>

        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          {query && (
            <p className="text-gray-600">
              {isLoading ? (
                'Searching...'
              ) : (
                <>
                  Found <span className="font-semibold">{results.length}</span> results for "
                  <span className="font-semibold">{query}</span>"
                </>
              )}
            </p>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <>
            {/* Results */}
            {query === '' ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Enter a search term to find products</p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No products found for "{query}"</p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-[#396254] hover:bg-[#2d4d3f] text-white px-6 py-2 rounded-md cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
