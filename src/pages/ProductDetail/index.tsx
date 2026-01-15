import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronDown, FiChevronUp, FiHeart } from 'react-icons/fi';
import MainLayout from '../../layouts/MainLayout';
import InfoCard from '../../components/card/InfoCard';
import ProductCard from '../../components/card/ProductCard';
import Skeleton from '../../components/common/Skeleton';
import { useProductDetail, useProducts, useCart } from '../../hooks';
import { getProductById, getRelatedProducts } from '../../data/products';

const infoCards = [
  {
    icon: 'star' as const,
    title: 'Our Products',
    description: 'Every item from our store is verified and have positive review by costumer.',
  },
  {
    icon: 'star' as const,
    title: 'Our Products',
    description: 'Every item from our store is verified and have positive review by costumer.',
  },
  {
    icon: 'star' as const,
    title: 'Our Products',
    description: 'Every item from our store is verified and have positive review by costumer.',
  },
];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = Number(id) || 1;

  // Use TanStack Query for product detail
  const { 
    data: apiProductData, 
    isLoading: isLoadingProduct,
    error: productError 
  } = useProductDetail(productId);

  // Use TanStack Query for related products (using general products query)
  const { 
    data: relatedProductsData,
    isLoading: isLoadingRelated 
  } = useProducts({ limit: 4 });

  // Use TanStack Query cart
  const { addToCart, setBuyNowItem } = useCart();

  // Fallback to local data if API fails
  const localProduct = getProductById(productId);
  const localRelatedProducts = getRelatedProducts(productId, 4);

  // Determine which data to use
  const product = apiProductData?.success && apiProductData.data 
    ? apiProductData.data 
    : localProduct;

  const relatedProducts = relatedProductsData?.success && relatedProductsData.data
    ? relatedProductsData.data.slice(0, 4)
    : localRelatedProducts;

  // Handle both API and local data formats
  // Type guard to check if product is from API (has productVariants)
  const isApiProduct = product && 'productVariants' in product;
  const productVariants = isApiProduct ? (product as any).productVariants || [] : [];
  
  // Type guard to check if brand is an object
  const getBrandName = (brand: any): string => {
    if (typeof brand === 'object' && brand?.name) return brand.name;
    if (typeof brand === 'string') return brand;
    return '';
  };

  // Get thumbnail URL
  const getThumbnailUrl = (thumbnail: any): string => {
    if (Array.isArray(thumbnail)) {
      const first = thumbnail[0];
      if (typeof first === 'object' && first?.url) return first.url;
      if (typeof first === 'string') return first;
    }
    if (typeof thumbnail === 'string') return thumbnail;
    return '';
  };

  const productData = product
    ? {
        id: product.id,
        name: product.name,
        description: product.description,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        thumbnail: getThumbnailUrl((product as any).thumbnail || (product as any).image),
        brand: getBrandName(product.brand),
        category: Array.isArray(product.category) ? product.category.join(', ') : String(product.category || ''),
        sizes: productVariants.length > 0 
          ? [...new Set(productVariants.map((v: any) => v.size))] 
          : (product as any).sizes || [36, 37, 38, 39, 40, 41, 42],
        colors: productVariants.length > 0 
          ? [...new Map(productVariants.map((v: any) => [v.color.name, { label: v.color.name, hex: v.color.hex }])).values()] 
          : (product as any).colors || [{ label: 'Black', hex: '#000000' }],
        variants: productVariants,
      }
    : null;

  // Helper function to find productVariantID from size + color
  const getProductVariantID = (size: number, colorName: string): number | undefined => {
    const variant = productVariants.find(
      (v: any) => v.size === size && v.color.name === colorName
    );
    return variant?.id;
  };

  const [selectedSize, setSelectedSize] = useState(productData?.sizes?.[0] || 36);
  const [selectedColor, setSelectedColor] = useState(productData?.colors?.[0]?.label || 'Black');
  const [showProductDetails, setShowProductDetails] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  if (isLoadingProduct) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center justify-center w-10 h-10 rounded-full bg-[#396254] hover:bg-[#2d4d3f] transition-colors cursor-pointer"
          >
            <FiChevronLeft className="h-5 w-5 text-white" />
          </button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!productData) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-500 mb-4">Product not found</p>
            {productError && (
              <p className="text-red-500 text-sm mb-4">
                Error: {productError.message}
              </p>
            )}
            <button
              onClick={() => navigate('/')}
              className="bg-[#396254] hover:bg-[#2d4d3f] text-white px-6 py-2 rounded-md"
            >
              Go Home
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center justify-center w-10 h-10 rounded-full bg-[#396254] hover:bg-[#2d4d3f] transition-colors cursor-pointer"
        >
          <FiChevronLeft className="h-5 w-5 text-white" />
        </button>

        {/* Product Main Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mb-16 items-start">
          {/* Product Images */}
          <div className="flex gap-4">
            {/* Main Image */}
            <div className="flex-1 relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={productData.thumbnail}
                alt={`${productData.name} ${productData.brand}`}
                className="w-full h-full object-contain p-8 sm:p-16"
              />
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform cursor-pointer"
              >
                <FiHeart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-6">{productData.name}</h1>

            {/* Size Selector */}
            <div className="mb-6">
              <label className="text-sm font-semibold mb-3 block">Size:</label>
              <div className="flex gap-2 flex-wrap">
                {(productData.sizes || [36, 37, 38, 39, 40, 41]).map((size: number) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border rounded-md transition-colors cursor-pointer ${
                      selectedSize === size
                        ? 'border-[#396254] bg-[#396254]/10 text-[#396254]'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="mb-6">
              <label className="text-sm font-semibold mb-3 block">Color:</label>
              <div className="flex gap-2 flex-wrap">
                {(productData.colors || []).map((colorOption: { label: string; hex: string }) => (
                  <button
                    key={colorOption.label}
                    onClick={() => setSelectedColor(colorOption.label)}
                    className={`w-10 h-10 rounded-full cursor-pointer transition-all ${
                      selectedColor === colorOption.label
                        ? 'ring-2 ring-offset-2 ring-[#396254]'
                        : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: colorOption.hex, border: colorOption.label === 'White' ? '1px solid #e5e7eb' : 'none' }}
                    title={colorOption.label}
                  />
                ))}
              </div>
            </div>

            {/* Price and Actions */}
            <div className="border border-gray-300 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Buy Now for</p>
                  <p className="text-3xl font-bold">${productData.price}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    // Validate size and color selection
                    if (!selectedSize) {
                      alert('Vui lòng chọn size giày!');
                      return;
                    }
                    if (!selectedColor) {
                      alert('Vui lòng chọn màu giày!');
                      return;
                    }

                    if (productData && !isAddingToCart) {
                      setIsAddingToCart(true);
                      const productVariantID = getProductVariantID(selectedSize, selectedColor);
                      
                      if (!productVariantID) {
                        alert('Không tìm thấy variant phù hợp!');
                        setIsAddingToCart(false);
                        return;
                      }
                      
                      addToCart({
                        id: productData.id,
                        productVariantID: productVariantID,
                        productID: productData.id,
                        name: productData.name,
                        description: productData.description,
                        size: selectedSize.toString(),
                        color: selectedColor,
                        price: typeof productData.price === 'string' ? parseFloat(productData.price) : productData.price,
                        thumbnail: productData.thumbnail,
                      });
                      // Clear buyNowItem when adding to cart
                      setBuyNowItem && setBuyNowItem(null);
                      
                      // Reset button state after a brief moment
                      setTimeout(() => setIsAddingToCart(false), 300);
                    }
                  }}
                  disabled={isAddingToCart}
                  className="flex-1 border-2 border-gray-300 hover:bg-gray-50 bg-transparent py-3 rounded-md font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingToCart ? 'Adding...' : 'Add To Cart'}
                </button>
                <button 
                  onClick={() => {
                    // Validate size and color selection
                    if (!selectedSize) {
                      alert('Vui lòng chọn size giày!');
                      return;
                    }
                    if (!selectedColor) {
                      alert('Vui lòng chọn màu giày!');
                      return;
                    }

                    if (productData && setBuyNowItem) {
                      const productVariantID = getProductVariantID(selectedSize, selectedColor);
                      
                      setBuyNowItem({
                        id: productData.id,
                        productVariantID: productVariantID,
                        productID: productData.id,
                        name: productData.name,
                        description: productData.description,
                        size: selectedSize.toString(),
                        color: selectedColor,
                        price: typeof productData.price === 'string' ? parseFloat(productData.price) : productData.price,
                        thumbnail: productData.thumbnail,
                        quantity: 1,
                      });
                      navigate('/checkout');
                    }
                  }}
                  className="flex-1 bg-[#396254] hover:bg-[#2d4d3f] text-white py-3 rounded-md font-medium cursor-pointer"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Collapsible Sections */}
            <div className="space-y-4">
              {/* Product Details */}
              <div className="border border-gray-300 rounded-lg">
                <button
                  onClick={() => setShowProductDetails(!showProductDetails)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    </div>
                    <span className="font-semibold">Product Details</span>
                  </div>
                  {showProductDetails ? <FiChevronUp className="h-5 w-5" /> : <FiChevronDown className="h-5 w-5" />}
                </button>
                {showProductDetails && (
                  <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                    {productData.description}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Items */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Related Items</h2>
          {isLoadingRelated ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="h-80 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((product) => {
                const getCategoryDisplay = (category: string | string[]) => {
                  const cat = Array.isArray(category) ? category[0] : category;
                  switch(cat) {
                    case 'trending': return 'Trending';
                    case 'best-seller': return 'Best Seller';
                    case 'freeship': return 'Free Ship';
                    case 'new': return 'New';
                    case 'popular': return 'Popular';
                    default: return cat || '';
                  }
                };

                // Handle both API and local data formats - use helper functions
                const relatedProductData = {
                  id: product.id,
                  name: product.name,
                  description: `${getBrandName(product.brand)} - ${Array.isArray(product.category) ? product.category.join(', ') : String(product.category || '')}`,
                  price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
                  thumbnail: getThumbnailUrl((product as any).thumbnail || (product as any).image),
                  category: getCategoryDisplay(product.category as string | string[]),
                };

                return (
                  <ProductCard 
                    key={product.id} 
                    id={relatedProductData.id}
                    name={relatedProductData.name}
                    description={relatedProductData.description}
                    price={relatedProductData.price}
                    thumbnail={relatedProductData.thumbnail}
                    category={relatedProductData.category}
                    freeship={relatedProductData.category === 'Free Ship'}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {infoCards.map((card, index) => (
            <InfoCard key={index} {...card} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
