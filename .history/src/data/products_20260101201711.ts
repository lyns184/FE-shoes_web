import shoeImg from '../assets/shoe.png';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
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
    description: 'Travis Scott Velvet Brown',
    price: 321,
    originalPrice: 521,
    imageUrl: shoeImg,
    badge: 'Lowest Price',
    freeship: true,
    sizes: ['36', '37', '38', '39', '40', '41'],
    soldCount: 61,
  },
  {
    id: 2,
    name: 'Jordan 1 Retro Low OG SP',
    description: 'Travis Scott Velvet Brown',
    price: 321,
    imageUrl: shoeImg,
    badge: 'Lowest Price',
    freeship: true,
    sizes: ['36', '37', '38', '39', '40', '41'],
    soldCount: 45,
  },
  {
    id: 3,
    name: 'Jordan 1 Retro Low OG SP',
    description: 'Travis Scott Velvet Brown',
    price: 321,
    imageUrl: shoeImg,
    badge: 'Lowest Price',
    freeship: true,
    sizes: ['36', '37', '38', '39', '40', '41'],
    soldCount: 32,
  },
  {
    id: 4,
    name: 'Jordan 1 Retro Low OG SP',
    description: 'Travis Scott Velvet Brown',
    price: 321,
    imageUrl: shoeImg,
    badge: 'Lowest Price',
    freeship: true,
    sizes: ['36', '37', '38', '39', '40', '41'],
    soldCount: 28,
  },
  {
    id: 5,
    name: 'Jordan Jumpman Jack TR Travis Scott x Chase B',
    description: '',
    price: 456,
    imageUrl: shoeImg,
    badge: 'Best Sold',
    freeship: true,
    sizes: ['36', '37', '38', '39', '40', '41', '42'],
    soldCount: 120,
  },
  {
    id: 6,
    name: 'Jordan Jumpman Jack TR Travis Scott x Chase B',
    description: '',
    price: 456,
    imageUrl: shoeImg,
    badge: 'Best Sold',
    freeship: true,
    sizes: ['36', '37', '38', '39', '40', '41', '42'],
    soldCount: 98,
  },
  {
    id: 7,
    name: 'Jordan Jumpman Jack TR Travis Scott x Chase B',
    description: '',
    price: 456,
    imageUrl: shoeImg,
    badge: 'Best Sold',
    freeship: true,
    sizes: ['36', '37', '38', '39', '40', '41', '42'],
    soldCount: 85,
  },
  {
    id: 8,
    name: 'Jordan Jumpman Jack TR Travis Scott x Chase B',
    description: '',
    price: 456,
    imageUrl: shoeImg,
    badge: 'Best Sold',
    freeship: true,
    sizes: ['36', '37', '38', '39', '40', '41', '42'],
    soldCount: 73,
  },
  // New Releases
  {
    id: 9,
    name: 'Nike Book 1 Torched',
    description: 'New Release',
    price: 289,
    imageUrl: shoeImg,
    freeship: true,
    sizes: ['36', '37', '38', '39', '40', '41'],
    soldCount: 15,
    releaseDate: 'Dec 12',
    isNewRelease: true,
  },
  {
    id: 10,
    name: 'Nike Book 1 Torched',
    description: 'New Release',
    price: 289,
    imageUrl: shoeImg,
    freeship: true,
    sizes: ['36', '37', '38', '39', '40', '41'],
    soldCount: 22,
    releaseDate: 'Dec 12',
    isNewRelease: true,
  },
  {
    id: 11,
    name: 'Nike Book 1 Torched',
    description: 'New Release',
    price: 289,
    imageUrl: shoeImg,
    freeship: true,
    sizes: ['36', '37', '38', '39', '40', '41'],
    soldCount: 18,
    releaseDate: 'Dec 12',
    isNewRelease: true,
  },
  {
    id: 12,
    name: 'Nike Book 1 Torched',
    description: 'New Release',
    price: 289,
    imageUrl: shoeImg,
    freeship: true,
    sizes: ['36', '37', '38', '39', '40', '41'],
    soldCount: 10,
    releaseDate: 'Dec 12',
    isNewRelease: true,
  },
];

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getRelatedProducts = (currentId: number, limit: number = 4): Product[] => {
  return products.filter(product => product.id !== currentId).slice(0, limit);
};

export const getNewReleases = (limit: number = 4): Product[] => {
  return products.filter(product => product.isNewRelease).slice(0, limit);
};
