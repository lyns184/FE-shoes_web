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
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Jordan 1 Retro Low OG SP',
    description: 'Travis Scott Velvet Brown',
    price: 321,
    originalPrice: 521,
    imageUrl: '/shoe.png',
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
    imageUrl: '/shoe.png',
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
    imageUrl: '/shoe.png',
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
    imageUrl: '/shoe.png',
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
    imageUrl: '/shoe.png',
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
    imageUrl: '/shoe.png',
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
    imageUrl: '/shoe.png',
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
    imageUrl: '/shoe.png',
    badge: 'Best Sold',
    freeship: true,
    sizes: ['36', '37', '38', '39', '40', '41', '42'],
    soldCount: 73,
  },
];

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getRelatedProducts = (currentId: number, limit: number = 4): Product[] => {
  return products.filter(product => product.id !== currentId).slice(0, limit);
};
