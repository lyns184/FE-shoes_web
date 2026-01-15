import ShopHeader from '../components/Header';
import ShopNavigation from '../components/Navigation';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import BrandCard from '../components/BrandCard';
import ReleaseCard from '../components/ReleaseCard';
import InfoCard from '../components/InfoCard';
import ShopFooter from '../components/Footer';
import SectionHeader from '../components/SectionHeader';
import { products } from '../data/products';

const recommendedProducts = products.slice(0, 4);
const trendingProducts = products.slice(4, 8);

const brands = [
  {
    name: 'Jordan',
    imageUrl: '/nike.jpg',
    logoUrl: '/nike.jpg',
  },
  {
    name: 'Jordan',
    imageUrl: '/nike.jpg',
    logoUrl: '/nike.jpg',
  },
  {
    name: 'Jordan',
    imageUrl: '/nike.jpg',
    logoUrl: '/nike.jpg',
  },
];

const newReleases = [
  {
    id: 1,
    date: 'Dec 12',
    name: 'Nike Book 1 Torched',
    imageUrl: '/shoe.png',
  },
  {
    id: 2,
    date: 'Dec 12',
    name: 'Nike Book 1 Torched',
    imageUrl: '/shoe.png',
  },
  {
    id: 3,
    date: 'Dec 12',
    name: 'Nike Book 1 Torched',
    imageUrl: '/shoe.png',
  },
  {
    id: 4,
    date: 'Dec 12',
    name: 'Nike Book 1 Torched',
    imageUrl: '/shoe.png',
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
  return (
    <div className="min-h-screen bg-white">
      <ShopHeader />
      <ShopNavigation />
      <HeroCarousel />

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Recommend For You */}
        <section>
          <SectionHeader title="Recommend For You" showInfo actionText="See All" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </section>

        {/* Popular Brands */}
        <section>
          <SectionHeader title="Popular Brands" actionText="See All" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand, index) => (
              <BrandCard key={index} {...brand} />
            ))}
          </div>
        </section>

        {/* Trending Shoes */}
        <section>
          <SectionHeader title="Trending Shoes" actionText="See All" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </section>

        {/* New Shoes Release */}
        <section>
          <SectionHeader title="New Shoes Release" actionText="See All" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newReleases.map((release, index) => (
              <ReleaseCard key={index} {...release} />
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

      <ShopFooter />
    </div>
  );
}
