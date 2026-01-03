import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronDown, FiChevronUp, FiHeart, FiStar, FiRefreshCw } from 'react-icons/fi';
import MainLayout from '../../layouts/MainLayout';
import InfoCard from '../../components/card/InfoCard';
import ProductCard from '../../components/card/ProductCard';
import { getProductById, getRelatedProducts } from '../../data/products';
import { useCart } from '../../hooks/useCart';

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
  const { addToCart, setBuyNowItem } = useCart();
  const product = getProductById(Number(id) || 1);
  const relatedProducts = getRelatedProducts(Number(id) || 1, 4);

  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '36');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [showProductDetails, setShowProductDetails] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Product not found</p>
      </div>
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
        <div className="grid md:grid-cols-2 gap-12 mb-16 items-start">
          {/* Product Images */}
          <div className="flex gap-4">
            {/* Main Image */}
            <div className="flex-1 relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.thumbnail}
                alt={`${product.name} ${product.description}`}
                className="w-full h-full object-contain p-16"
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
            <h1 className="text-3xl font-bold mb-6">{product.name}</h1>

            {/* Size Selector */}
            <div className="mb-6">
              <label className="text-sm font-semibold mb-3 block">Size:</label>
              <div className="flex gap-2 flex-wrap">
                {(product.sizes || ['36', '37', '38', '39', '40', '41']).map((size, index) => (
                  <button
                    key={index}
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
                {[
                  { name: 'Black', color: '#1a1a1a' },
                  { name: 'White', color: '#ffffff' },
                  { name: 'Red', color: '#dc2626' },
                  { name: 'Blue', color: '#2563eb' },
                  { name: 'Brown', color: '#78350f' },
                ].map((colorOption) => (
                  <button
                    key={colorOption.name}
                    onClick={() => setSelectedColor(colorOption.name)}
                    className={`w-10 h-10 rounded-full cursor-pointer transition-all ${
                      selectedColor === colorOption.name
                        ? 'ring-2 ring-offset-2 ring-[#396254]'
                        : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: colorOption.color, border: colorOption.name === 'White' ? '1px solid #e5e7eb' : 'none' }}
                    title={colorOption.name}
                  />
                ))}
              </div>
            </div>

            {/* Price and Actions */}
            <div className="border border-gray-300 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Buy Now for</p>
                  <p className="text-3xl font-bold">${product.price}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiStar className="w-4 h-4" />
                  <span>{product.soldCount || 61} Sold in last 3 days</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    if (product) {
                      addToCart({
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        size: selectedSize,
                        color: selectedColor,
                        price: product.price,
                        thumbnail: product.thumbnail,
                      });
                      // Clear buyNowItem when adding to cart
                      setBuyNowItem(null);
                    }
                  }}
                  className="flex-1 border-2 border-gray-300 hover:bg-gray-50 bg-transparent py-3 rounded-md font-medium cursor-pointer"
                >
                  Add To Cart
                </button>
                <button 
                  onClick={() => {
                    if (product) {
                      setBuyNowItem({
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        size: selectedSize,
                        color: selectedColor,
                        price: product.price,
                        thumbnail: product.thumbnail,
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
                    {product.description}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Items */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Related Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
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
