import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import HeroCarousel from './HeroCarousel';
import ProductCard from '../../components/card/ProductCard';
import BrandCard from '../../components/card/BrandCard';
import ReleaseCard from '../../components/card/ReleaseCard';
import InfoCard from '../../components/card/InfoCard';
import SectionHeader from '../../components/common/SectionHeader';
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
            onActionClick={() => navigate('/trending')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                id={product.id}
                name={product.name}
                description={`${product.brand} - ${product.category}`}
                price={product.price}
                thumbnail={product.image}
                badge={product.category === 'best-seller' ? 'Best Seller' : undefined}
                freeship={product.category === 'freeship'}
              />
            ))}
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                id={product.id}
                name={product.name}
                description={`${product.brand} - ${product.category}`}
                price={product.price}
                thumbnail={product.image}
                badge={product.category === 'best-seller' ? 'Best Seller' : undefined}
                freeship={product.category === 'freeship'}
              />
            ))}
          </div>
        </section>

        {/* New Shoes Release */}
        <section id="new">
          <SectionHeader 
            title="New Shoes Release" 
            actionText="See All"
            onActionClick={() => navigate('/new')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newReleases.map((release) => (
              <ReleaseCard 
                key={release.id} 
                id={release.id} 
                date="Dec 12" 
                name={release.name} 
                imageUrl={release.image} 
              />
            ))}
          </div>
        </section>

        {/* Sale Products */}
        <section id="deals">
          <SectionHeader 
            title="Sale Products" 
            actionText="See All"
            onActionClick={() => navigate('/deals')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {saleProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                id={product.id}
                name={product.name}
                description={`${product.brand} - ${product.category}`}
                price={product.price}
                thumbnail={product.image}
                badge={product.category === 'best-seller' ? 'Best Seller' : undefined}
                freeship={product.category === 'freeship'}
              />
            ))}
          </div>
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
