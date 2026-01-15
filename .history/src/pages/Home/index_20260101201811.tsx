import MainLayout from '../../layouts/MainLayout';
import HeroCarousel from './HeroCarousel';
import ProductCard from '../../components/card/ProductCard';
import BrandCard from '../../components/card/BrandCard';
import ReleaseCard from '../../components/card/ReleaseCard';
import InfoCard from '../../components/card/InfoCard';
import SectionHeader from '../../components/common/SectionHeader';
import { products, getNewReleases } from '../../data/products';
import nikeImg from '../../assets/nike.jpg';

const recommendedProducts = products.slice(0, 4);
const trendingProducts = products.slice(4, 8);
const newReleases = getNewReleases(4);

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
  return (
    <MainLayout>
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
            {newReleases.map((release) => (
              <ReleaseCard key={release.id} id={release.id} date={release.releaseDate || 'Dec 12'} name={release.name} imageUrl={release.imageUrl} />
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
