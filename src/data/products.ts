export interface Product {
  id: number;
  image: string;
  name: string;
  brand: string;
  category: 'trending' | 'best-seller' | 'freeship' | 'new' | 'popular';
  colors: { label: string; hex: string }[];
  sizes: number[];
  price: number;
  stock: number;
  status: 'Active' | 'Inactive';
  description: string;
}

export const products: Product[] = [
  {
    id: 1,
    image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/312587/01/sv01/fnd/VNM/fmt/png/Darter-Pro-2-Running-Shoes-Unisex',
    name: 'Air Max 90',
    brand: 'Nike',
    category: 'trending',
    colors: [
      { label: 'White', hex: '#FFFFFF' },
      { label: 'Red', hex: '#EF4444' }
    ],
    sizes: [38, 39, 40, 41, 42],
    price: 150,
    stock: 42,
    status: 'Active',
    description: 'The iconic Air Max 90 features a timeless design with visible Air cushioning for all-day comfort. Premium leather and textile upper provides durability and style. Perfect for everyday wear with superior cushioning technology.'
  },
  {
    id: 2,
    image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/312587/01/sv01/fnd/VNM/fmt/png/Darter-Pro-2-Running-Shoes-Unisex',
    name: 'Ultraboost Light',
    brand: 'Adidas',
    category: 'best-seller',
    colors: [
      { label: 'Black', hex: '#000000' },
      { label: 'White', hex: '#FFFFFF' }
    ],
    sizes: [39, 40, 41, 42, 43, 44],
    price: 180,
    stock: 28,
    status: 'Inactive',
    description: 'Experience ultimate performance with Ultraboost Light running shoes. Featuring responsive BOOST midsole technology and lightweight construction. Engineered for runners who demand comfort and energy return with every step.'
  },
  {
    id: 3,
    image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/312587/01/sv01/fnd/VNM/fmt/png/Darter-Pro-2-Running-Shoes-Unisex',
    name: 'New Balance 550',
    brand: 'New Balance',
    category: 'popular',
    colors: [
      { label: 'White', hex: '#FFFFFF' },
      { label: 'Green', hex: '#22C55E' }
    ],
    sizes: [38, 39, 40, 41, 42, 43],
    price: 120,
    stock: 35,
    status: 'Active',
    description: 'Classic basketball-inspired silhouette meets modern comfort. The New Balance 550 features premium leather construction with vintage court aesthetics. A timeless design perfect for streetwear and casual occasions.'
  },
  {
    id: 4,
    image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/312587/01/sv01/fnd/VNM/fmt/png/Darter-Pro-2-Running-Shoes-Unisex',
    name: 'Chuck 70 High',
    brand: 'Converse',
    category: 'new',
    colors: [
      { label: 'Brown', hex: '#92400E' },
      { label: 'Black', hex: '#000000' }
    ],
    sizes: [37, 38, 39, 40, 41, 42],
    price: 85,
    stock: 64,
    status: 'Active',
    description: 'Elevated version of the classic All Star with premium materials and enhanced comfort. Features improved cushioning and durable canvas upper. A modern take on the timeless high-top silhouette.'
  },
  {
    id: 5,
    image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/312587/01/sv01/fnd/VNM/fmt/png/Darter-Pro-2-Running-Shoes-Unisex',
    name: 'Suede Classic',
    brand: 'Puma',
    category: 'freeship',
    colors: [
      { label: 'Green', hex: '#22C55E' },
      { label: 'Blue', hex: '#3B82F6' }
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    price: 75,
    stock: 52,
    status: 'Active',
    description: 'Iconic Puma Suede with rich suede leather upper and classic design. Features comfortable foam midsole and durable rubber outsole. A legendary silhouette that defined street culture and sportswear fashion.'
  },
  {
    id: 6,
    image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/312587/01/sv01/fnd/VNM/fmt/png/Darter-Pro-2-Running-Shoes-Unisex',
    name: 'Gel-Kayano 30',
    brand: 'ASICS',
    category: 'trending',
    colors: [
      { label: 'Black', hex: '#000000' },
      { label: 'Gray', hex: '#6B7280' }
    ],
    sizes: [39, 40, 41, 42, 43, 44],
    price: 160,
    stock: 21,
    status: 'Active',
    description: 'Advanced stability running shoe with GEL cushioning technology and Dynamic DuoMax support system. Engineered mesh upper provides breathability and comfort. Designed for overpronators seeking maximum support and comfort.'
  },
  {
    id: 7,
    image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/312587/01/sv01/fnd/VNM/fmt/png/Darter-Pro-2-Running-Shoes-Unisex',
    name: 'Jordan 1 Retro Low',
    brand: 'Nike',
    category: 'popular',
    colors: [
      { label: 'White', hex: '#FFFFFF' },
      { label: 'Black', hex: '#000000' }
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    price: 130,
    stock: 45,
    status: 'Active',
    description: 'Legendary basketball heritage meets street-ready style. Features premium leather construction with Air-Sole unit for cushioning. The low-top version of the iconic Jordan 1 silhouette for everyday wear.'
  },
  {
    id: 8,
    image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/312587/01/sv01/fnd/VNM/fmt/png/Darter-Pro-2-Running-Shoes-Unisex',
    name: 'Stan Smith',
    brand: 'Adidas',
    category: 'new',
    colors: [
      { label: 'White', hex: '#FFFFFF' },
      { label: 'Green', hex: '#22C55E' }
    ],
    sizes: [36, 37, 38, 39, 40, 41, 42],
    price: 100,
    stock: 38,
    status: 'Active',
    description: 'Clean and minimalist tennis shoe with timeless appeal. Made with premium white leather upper and signature green accents. A wardrobe essential that pairs perfectly with any casual outfit.'
  },
  {
    id: 9,
    image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/312587/01/sv01/fnd/VNM/fmt/png/Darter-Pro-2-Running-Shoes-Unisex',
    name: 'Blazer Mid 77',
    brand: 'Nike',
    category: 'best-seller',
    colors: [
      { label: 'White', hex: '#FFFFFF' },
      { label: 'Blue', hex: '#3B82F6' }
    ],
    sizes: [38, 39, 40, 41, 42, 43],
    price: 110,
    stock: 29,
    status: 'Active',
    description: 'Vintage basketball style meets modern comfort. Features durable leather upper with classic mid-top silhouette. Perfect blend of retro aesthetics and contemporary streetwear appeal.'
  },
  {
    id: 10,
    image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/312587/01/sv01/fnd/VNM/fmt/png/Darter-Pro-2-Running-Shoes-Unisex',
    name: 'Fresh Foam X',
    brand: 'New Balance',
    category: 'freeship',
    colors: [
      { label: 'Gray', hex: '#6B7280' },
      { label: 'Orange', hex: '#F97316' }
    ],
    sizes: [39, 40, 41, 42, 43, 44],
    price: 140,
    stock: 33,
    status: 'Inactive',
    description: 'Ultra-soft running experience with Fresh Foam X midsole technology. Engineered mesh upper provides superior breathability and lightweight feel. Designed for neutral runners seeking plush cushioning.'
  },
  {
    id: 11,
    image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/312587/01/sv01/fnd/VNM/fmt/png/Darter-Pro-2-Running-Shoes-Unisex',
    name: 'All Star Classic',
    brand: 'Converse',
    category: 'trending',
    colors: [
      { label: 'Red', hex: '#EF4444' },
      { label: 'Black', hex: '#000000' }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    price: 60,
    stock: 67,
    status: 'Active',
    description: 'Original All Star design that started it all. Canvas upper with vulcanized rubber sole and signature star logo. A cultural icon that transcends generations and style boundaries.'
  },
  {
    id: 12,
    image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/312587/01/sv01/fnd/VNM/fmt/png/Darter-Pro-2-Running-Shoes-Unisex',
    name: 'RS-X3 Puzzle',
    brand: 'Puma',
    category: 'new',
    colors: [
      { label: 'Multi', hex: '#8B5CF6' },
      { label: 'White', hex: '#FFFFFF' }
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    price: 95,
    stock: 18,
    status: 'Active',
    description: 'Bold and futuristic design with RS cushioning system for superior comfort. Mixed material construction with eye-catching color blocking. A statement piece for those who dare to stand out from the crowd.'
  }
];


export const getProductById = (id: number): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getRelatedProducts = (currentId: number, limit: number = 4): Product[] => {
  return products
    .filter(product => product.id !== currentId)
    .slice(0, limit);
};

export const getNewReleases = (limit: number = 4): Product[] => {
  return products
    .filter(product => product.category === 'new')
    .slice(0, limit);
};

export const getTrendingProducts = (limit: number = 4): Product[] => {
  return products
    .filter(product => product.category === 'trending')
    .slice(0, limit);
};

export const getBestSellerProducts = (limit: number = 4): Product[] => {
  return products
    .filter(product => product.category === 'best-seller')
    .slice(0, limit);
};

export const getFreeShipProducts = (limit: number = 4): Product[] => {
  return products
    .filter(product => product.category === 'freeship')
    .slice(0, limit);
};

export const getPopularProducts = (limit: number = 4): Product[] => {
  return products
    .filter(product => product.category === 'popular')
    .slice(0, limit);
};
