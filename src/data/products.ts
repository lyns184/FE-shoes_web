import shoeImg from '../assets/shoe.png';
import { type Brand, getBrandById } from './brands';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  thumbnail: string;
  brandID: number;
  brand?: Brand;
  originalPrice?: number;
  badge?: string;
  freeship?: boolean;
  sizes?: string[];
  soldCount?: number;
  releaseDate?: string;
  isNewRelease?: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Jordan 1 Retro Low OG SP',
    description: 'Premium high-quality leather construction with signature Air Jordan silhouette. Features excellent cushioning and timeless style perfect for collectors and sneaker enthusiasts.',
    price: 321,
    originalPrice: 521,
    thumbnail: shoeImg,
    brandID: 3,
    badge: 'Low Price',
    freeship: true,
    sizes: ['36', '37', '38', '39', '40', '41'],
    soldCount: 61,
  },
  {
    id: 2,
    name: 'Jordan 1 Retro Low OG SP',
    description: 'Classic basketball sneaker with modern comfort technology. Durable rubber sole with excellent traction and responsive cushioning for all-day wear.',
    price: 321,
    thumbnail: shoeImg,
    brandID: 3,
    badge: 'Low Price',
    freeship: true,
    sizes: ['36', '37', '38', '39', '40', '41'],
    soldCount: 45,
  },
  {
    id: 3,
    name: 'Jordan 1 Retro Low OG SP',
    description: 'Iconic design with breathable mesh and leather upper. Lightweight construction with superior ankle support for maximum comfort and style.',
    price: 321,
    thumbnail: shoeImg,
    brandID: 3,
    badge: 'Low Price',
    freeship: true,
    sizes: ['36', '37', '38', '39', '40', '41'],
    soldCount: 32,
  },
  {
    id: 4,
    name: 'Jordan 1 Retro Low OG SP',
    description: 'Professional-grade materials with reinforced stitching. Designed for optimal performance with enhanced grip and stability on any court surface.',
    price: 321,
    thumbnail: shoeImg,
    brandID: 3,
    badge: 'Best Sold',
    freeship: true,
    sizes: ['36', '37', '38', '39', '40', '41'],
    soldCount: 28,
  },
  {
    id: 5,
    name: 'Jumpman Jack TR Travis Scott x Chase B',
    description: 'Limited edition collaboration combining innovative design with street culture. Exclusive materials and special branding make this a must-have for collectors.',
    price: 456,
    thumbnail: shoeImg,
    brandID: 3,
    badge: 'Best Sold',
    freeship: true,
    sizes: ['36', '37', '38', '39', '40', '41', '42'],
    soldCount: 120,
  },
  {
    id: 6,
    name: 'Jumpman Jack TR Travis Scott x Chase B',
    description: 'Celebrity endorsed sneaker with premium comfort features. Advanced cushioning system provides all-day support with exceptional style and durability.',
    price: 456,
    thumbnail: shoeImg,
    brandID: 3,
    badge: 'Best Sold',
    freeship: true,
    sizes: ['36', '37', '38', '39', '40', '41', '42'],
    soldCount: 98,
  },
  {
    id: 7,
    name: 'Jumpman Jack TR Travis Scott x Chase B',
    description: 'State-of-the-art technology meets contemporary aesthetics. Features innovative sole design with superior bounce-back for athletic performance.',
    price: 456,
    thumbnail: shoeImg,
    brandID: 3,
    badge: 'Best Sold',
    freeship: true,
    sizes: ['36', '37', '38', '39', '40', '41', '42'],
    soldCount: 85,
  },
  {
    id: 8,
    name: 'Jumpman Jack TR Travis Scott x Chase B',
    description: 'Versatile everyday wear sneaker with eye-catching design. Combines comfort and style for casual outings and athletic activities.',
    price: 456,
    thumbnail: shoeImg,
    brandID: 3,
    badge: 'Best Sold',
    freeship: true,
    sizes: ['36', '37', '38', '39', '40', '41', '42'],
    soldCount: 73,
  },
  // New Releases
  {
    id: 9,
    name: 'Nike Book 1 Torched',
    description: 'Latest basketball innovation with cutting-edge court technology. Engineered for superior performance with enhanced stability and responsiveness.',
    price: 289,
    thumbnail: shoeImg,
    brandID: 1,
    freeship: true,
    sizes: ['36', '37', '38', '39', '40', '41'],
    soldCount: 15,
    releaseDate: 'Dec 12',
    isNewRelease: true,
  },
  {
    id: 10,
    name: 'Nike Book 1 Torched',
    description: 'Inspired by legendary basketball players with modern design elements. Premium materials and expert craftsmanship ensure long-lasting quality.',
    price: 289,
    thumbnail: shoeImg,
    brandID: 1,
    freeship: true,
    sizes: ['36', '37', '38', '39', '40', '41'],
    soldCount: 22,
    releaseDate: 'Dec 12',
    isNewRelease: true,
  },
  {
    id: 11,
    name: 'Nike Book 1 Torched',
    description: 'Sleek minimalist design with maximum comfort. Lightweight construction provides ease of movement without compromising support and protection.',
    price: 289,
    thumbnail: shoeImg,
    brandID: 1,
    freeship: true,
    sizes: ['36', '37', '38', '39', '40', '41'],
    soldCount: 18,
    releaseDate: 'Dec 12',
    isNewRelease: true,
  },
  {
    id: 12,
    name: 'Nike Book 1 Torched',
    description: 'Professional athletic footwear with research-backed design. Enhanced grip and balance technology for peak performance on the basketball court.',
    price: 289,
    thumbnail: shoeImg,
    brandID: 1,
    freeship: true,
    sizes: ['36', '37', '38', '39', '40', '41'],
    soldCount: 10,
    releaseDate: 'Dec 12',
    isNewRelease: true,
  },
];


export const getProductById = (id: number): Product | undefined => {
  const product = products.find(p => p.id === id);
  if (product) {
    return {
      ...product,
      brand: getBrandById(product.brandID),
    };
  }
  return undefined;
};

export const getRelatedProducts = (currentId: number, limit: number = 4): Product[] => {
  return products
    .filter(product => product.id !== currentId)
    .slice(0, limit)
    .map(p => ({ ...p, brand: getBrandById(p.brandID) }));
};

export const getNewReleases = (limit: number = 4): Product[] => {
  return products
    .filter(product => product.isNewRelease)
    .slice(0, limit)
    .map(p => ({ ...p, brand: getBrandById(p.brandID) }));
};

export const getSaleProducts = (limit: number = 4): Product[] => {
  return products
    .filter(product => product.originalPrice && product.originalPrice > product.price)
    .slice(0, limit)
    .map(p => ({ ...p, brand: getBrandById(p.brandID) }));
};
