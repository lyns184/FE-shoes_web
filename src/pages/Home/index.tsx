import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import HeroCarousel from './HeroCarousel';
import ProductCard from '../../components/card/ProductCard';
import BrandCard from '../../components/card/BrandCard';
import ReleaseCard from '../../components/card/ReleaseCard';
import InfoCard from '../../components/card/InfoCard';
import SectionHeader from '../../components/common/SectionHeader';
import Skeleton from '../../components/common/Skeleton';
import { 
  useProducts, 
  useTrendingProducts, 
  useNewProducts, 
  useBestSellerProducts 
} from '../../hooks';
import { products, getNewReleases, getTrendingProducts, getBestSellerProducts } from '../../data/products';
import nikeImg from '../../assets/nike.jpg';

const recommendedProducts = products.slice(0, 4);
const trendingProducts = getTrendingProducts(4);
const newReleases = getNewReleases(4);
const saleProducts = getBestSellerProducts(4);

const brands = [
  {
    name: 'Jordan',
    imageUrl: nikeImg,
    logoUrl: nikeImg,
  },
  {
    name: 'Jordan',
    imageUrl: nikeImg,
    logoUrl: nikeImg,
  },
  {
    name: 'Jordan',
    imageUrl: nikeImg,
    logoUrl: nikeImg,
  },
];

const infoCards = [
  {
    title: 'Our Products',
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt',
  },
  {
    title: 'Our Products',
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt',
  },
  {
    title: 'Our Products',
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt',
  },
];

export default function Home() {
  const navigate = useNavigate();
  
  // Use TanStack Query hooks for data fetching
  const { 
    data: apiProducts, 
    isLoading: isLoadingProducts,
    error: productsError 
  } = useProducts({ limit: 4 });
  
  const { 
    data: apiTrendingProducts, 
    isLoading: isLoadingTrending,
    error: trendingError 
  } = useTrendingProducts(4);
  
  const { 
    data: apiNewProducts, 
    isLoading: isLoadingNew,
    error: newError 
  } = useNewProducts(4);
  
  const { 
    data: apiBestSellers, 
    isLoading: isLoadingBestSellers,
    error: bestSellersError 
  } = useBestSellerProducts(4);

  // Fallback to local data if API fails or is loading
  const displayProducts = apiProducts?.success && apiProducts.data 
    ? apiProducts.data 
    : recommendedProducts;
  
  const displayTrending = apiTrendingProducts?.success && apiTrendingProducts.data
    ? apiTrendingProducts.data
    : trendingProducts;
    
  const displayNew = apiNewProducts?.success && apiNewProducts.data
    ? apiNewProducts.data
    : newReleases;
    
  const displayBestSellers = apiBestSellers?.success && apiBestSellers.data
    ? apiBestSellers.data
    : saleProducts;

  return (
    <MainLayout>
      <HeroCarousel />

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Recommend For You */}
        <section>
          <SectionHeader 
            title="Recommend For You" 
            showInfo 
            actionText="See All"
            onActionClick={() => navigate('/search')}
          />
          {isLoadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="h-80 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {displayProducts.map((product) => {
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
                const productData = product.brand 
                  ? {
                      id: product.id,
                      name: product.name,
                      description: `${product.brand.name || product.brand} - ${Array.isArray(product.category) ? product.category.join(', ') : product.category}`,
                      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
                      thumbnail: Array.isArray(product.thumbnail) ? product.thumbnail[0]?.url || product.thumbnail[0] : product.thumbnail,
                      category: Array.isArray(product.category) ? product.category[0] : product.category,
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
          )}
        </section>

        {/* Popular Brands - HIDDEN */}
        {false && (
          <section id="brands">
            <SectionHeader 
              title="Popular Brands" 
              actionText="See All"
              onActionClick={() => navigate('/brands')}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {brands.map((brand, index) => (
                <BrandCard key={index} {...brand} />
              ))}
            </div>
          </section>
        )}

        <section id="trending">
          <SectionHeader 
            title="Trending Shoes" 
            actionText="See All"
            onActionClick={() => navigate('/trending')}
          />
          {isLoadingTrending ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="h-80 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {displayTrending.map((product) => {
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
                const productData = product.brand 
                  ? {
                      id: product.id,
                      name: product.name,
                      description: `${product.brand.name || product.brand} - ${Array.isArray(product.category) ? product.category.join(', ') : product.category}`,
                      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
                      thumbnail: Array.isArray(product.thumbnail) ? product.thumbnail[0]?.url || product.thumbnail[0] : product.thumbnail,
                      category: Array.isArray(product.category) ? product.category[0] : product.category,
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
                    freeship={productData.category === 'freeship'}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* New Shoes Release */}
        <section id="new">
          <SectionHeader 
            title="New Shoes Release" 
            actionText="See All"
            onActionClick={() => navigate('/new')}
          />
          {isLoadingNew ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="h-80 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {displayNew.map((product) => {
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
                const productData = product.brand 
                  ? {
                      id: product.id,
                      name: product.name,
                      description: `${product.brand.name || product.brand} - ${Array.isArray(product.category) ? product.category.join(', ') : product.category}`,
                      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
                      thumbnail: Array.isArray(product.thumbnail) ? product.thumbnail[0]?.url || product.thumbnail[0] : product.thumbnail,
                      category: Array.isArray(product.category) ? product.category[0] : product.category,
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
                    freeship={productData.category === 'freeship'}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* Sale Products */}
        <section id="deals">
          <SectionHeader 
            title="Sale Products" 
            actionText="See All"
            onActionClick={() => navigate('/deals')}
          />
          {isLoadingBestSellers ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="h-80 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {displayBestSellers.map((product) => {
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
                const productData = product.brand 
                  ? {
                      id: product.id,
                      name: product.name,
                      description: `${product.brand.name || product.brand} - ${Array.isArray(product.category) ? product.category.join(', ') : product.category}`,
                      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
                      thumbnail: Array.isArray(product.thumbnail) ? product.thumbnail[0]?.url || product.thumbnail[0] : product.thumbnail,
                      category: Array.isArray(product.category) ? product.category[0] : product.category,
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
                    freeship={productData.category === 'freeship'}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* Info Cards */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {infoCards.map((card, index) => (
              <InfoCard key={index} {...card} />
            ))}
          </div>
        </section>
      </main>
    </MainLayout>
  );
}
