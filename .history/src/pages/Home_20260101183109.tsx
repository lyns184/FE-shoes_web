import ShopHeader from '../components/shop/Header';
import ShopNavigation from '../components/shop/Navigation';
import HeroCarousel from '../components/shop/HeroCarousel';
import ProductCard from '../components/shop/ProductCard';
import BrandCard from '../components/shop/BrandCard';
import ReleaseCard from '../components/shop/ReleaseCard';
import PromoBanner from '../components/shop/PromoBanner';
import InfoCard from '../components/shop/InfoCard';
import ShopFooter from '../components/shop/Footer';
import SectionHeader from '../components/shop/SectionHeader';

const recommendedProducts = [
  {
    name: 'Jordan 1 Retro Low OG SP',
    description: 'Travis Scott Velvet Brown',
    price: 321,
    originalPrice: 521,
    imageUrl: '/shoe.png',
    badge: 'Lowest Price',
    freeship: true,
  },
  {
    name: 'Jordan 1 Retro Low OG SP',
    description: 'Travis Scott Velvet Brown',
    price: 321,
    imageUrl: '/shoe.png',
    badge: 'Lowest Price',
  },
  {
    name: 'Jordan 1 Retro Low OG SP',
    description: 'Travis Scott Velvet Brown',
    price: 321,
    imageUrl: '/shoe.png',
    badge: 'Lowest Price',
  },
  {
    name: 'Jordan 1 Retro Low OG SP',
    description: 'Travis Scott Velvet Brown',
    price: 321,
    imageUrl: '/shoe.png',
    badge: 'Lowest Price',
  },
];

const trendingProducts = [
  {
    name: 'Jordan Jumpman Jack TR Travis Scott x Chase B...',
    description: 'Best Sold',
    price: 456,
    imageUrl: '/shoe.png',
    badge: '1000 Sold',
  },
  {
    name: 'Jordan Jumpman Jack TR Travis Scott x Chase B...',
    description: 'Best Sold',
    price: 456,
    imageUrl: '/shoe.png',
    badge: '1000 Sold',
  },
  {
    name: 'Jordan Jumpman Jack TR Travis Scott x Chase B...',
    description: 'Best Sold',
    price: 456,
    imageUrl: '/shoe.png',
    badge: '1000 Sold',
  },
  {
    name: 'Jordan Jumpman Jack TR Travis Scott x Chase B...',
    description: 'Best Sold',
    price: 456,
    imageUrl: '/shoe.png',
    badge: '1000 Sold',
  },
];

const brands = [
  {
    name: 'Jordan',
    imageUrl: '/shoe.png',
    logoUrl: '/shoe.png',
  },
  {
    name: 'Jordan',
    imageUrl: '/shoe.png',
    logoUrl: '/shoe.png',
  },
  {
    name: 'Jordan',
    imageUrl: '/shoe.png',
    logoUrl: '/shoe.png',
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

        {/* Promotional Banners */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PromoBanner imageUrl="/shoe.png" buttonText="Shop Now" />
            <PromoBanner imageUrl="/shoe.png" title="Gift Cards" variant="dark" />
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
