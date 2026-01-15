import ShopHeader from '../components/Header';
import ShopNavigation from '../components/Navigation';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import BrandCard from '../components/BrandCard';
import ReleaseCard from '../components/ReleaseCard';
import InfoCard from '../components/InfoCard';
import ShopFooter from '../components/Footer';
import SectionHeader from '../components/SectionHeader';

const recommendedProducts = [
  {
    id: 1,
    name: 'Jordan 1 Retro Low OG SP',
    description: 'Travis Scott Velvet Brown',
    price: 321,
    originalPrice: 521,
    imageUrl: '/shoe.png',
    badge: 'Lowest Price',
    freeship: true,
  },
  {
    id: 2,
    name: 'Jordan 1 Retro Low OG SP',
    description: 'Travis Scott Velvet Brown',
    price: 321,
    imageUrl: '/shoe.png',
    badge: 'Lowest Price',
    freeship: true,
  },
  {
    id: 3,
    name: 'Jordan 1 Retro Low OG SP',
    description: 'Travis Scott Velvet Brown',
    price: 321,
    imageUrl: '/shoe.png',
    badge: 'Lowest Price',
    freeship: true,
  },
  {
    id: 4,
    name: 'Jordan 1 Retro Low OG SP',
    description: 'Travis Scott Velvet Brown',
    price: 321,
    imageUrl: '/shoe.png',
    badge: 'Lowest Price',
    freeship: true,
  },
];

const trendingProducts = [
  {
    id: 5,
    name: 'Jordan Jumpman Jack TR Travis Scott x Chase B...',
    description: '',
    price: 456,
    imageUrl: '/shoe.png',
    badge: 'Best Sold',
    freeship: true,
  },
  {
    id: 6,
    name: 'Jordan Jumpman Jack TR Travis Scott x Chase B...',
    description: '',
    price: 456,
    imageUrl: '/shoe.png',
    badge: 'Best Sold',
    freeship: true,
  },
  {
    id: 7,
    name: 'Jordan Jumpman Jack TR Travis Scott x Chase B...',
    description: '',
    price: 456,
    imageUrl: '/shoe.png',
    badge: 'Best Sold',
    freeship: true,
  },
  {
    id: 8,
    name: 'Jordan Jumpman Jack TR Travis Scott x Chase B...',
    description: '',
    price: 456,
    imageUrl: '/shoe.png',
    badge: 'Best Sold',
    freeship: true,
  },
];

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
    date: 'Dec 12',
    name: 'Nike Book 1 Torched',
    imageUrl: '/shoe.png',
  },
  {
    date: 'Dec 12',
    name: 'Nike Book 1 Torched',
    imageUrl: '/shoe.png',
  },
  {
    date: 'Dec 12',
    name: 'Nike Book 1 Torched',
    imageUrl: '/shoe.png',
  },
  {
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
