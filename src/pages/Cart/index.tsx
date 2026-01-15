import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiMinus, FiPlus, FiX } from 'react-icons/fi';
import MainLayout from '../../layouts/MainLayout';
import ProductCard from '../../components/card/ProductCard';
import InfoCard from '../../components/card/InfoCard';
import { useCart } from '../../hooks';
import { getRelatedProducts } from '../../data/products';

const infoCards = [
  {
    title: 'Our Products',
    description: 'Every item from our store is verified and have positive review by customer.',
  },
  {
    title: 'Our Products',
    description: 'Every item from our store is verified and have positive review by customer.',
  },
  {
    title: 'Our Products',
    description: 'Every item from our store is verified and have positive review by customer.',
  },
];

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, subtotal, setBuyNowItem } = useCart();
  const recommendedProducts = getRelatedProducts(0, 4);

  const tax = 0;
  const total = subtotal + tax;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-4 sm:mb-6 flex items-center gap-2 text-[#396254] hover:text-[#2d4d3f] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#396254] hover:bg-[#2d4d3f] transition-colors">
            <FiChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <span className="font-semibold text-sm sm:text-base">Shopping Continue</span>
        </button>

        {items.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center mb-8">
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#396254] hover:bg-[#2d4d3f] text-white px-6 py-2 rounded-md cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items Table */}
            <div className="bg-white border border-gray-200 rounded-lg mb-6 sm:mb-8">
              {/* Desktop Table Header */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 text-sm font-semibold">
                <div className="col-span-4">Product</div>
                <div className="col-span-1 text-center">Size</div>
                <div className="col-span-2 text-center">Color</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-1"></div>
              </div>

              {/* Cart Items */}
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="block md:grid md:grid-cols-12 gap-4 px-4 sm:px-6 py-4 border-b border-gray-200 last:border-b-0"
                >
                  {/* Mobile Layout */}
                  <div className="md:hidden space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.thumbnail}
                          alt={item.name}
                          className="w-full h-full object-contain p-1 sm:p-2"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1">{item.name}</h3>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>Size: {item.size} | Color: {item.color}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <FiX className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.productVariantID || 0, -1, item.quantity)}
                          className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                        >
                          <FiMinus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.productVariantID || 0, 1, item.quantity)}
                          className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                        >
                          <FiPlus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:contents">
                    {/* Product Info */}
                    <div className="col-span-4 flex items-center gap-4">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded overflow-hidden">
                        <img
                          src={item.thumbnail}
                          alt={item.name}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                      </div>
                    </div>

                    {/* Size */}
                    <div className="col-span-1 flex items-center justify-center">
                      <span className="text-sm font-medium">{item.size}</span>
                    </div>

                    {/* Color */}
                    <div className="col-span-2 flex items-center justify-center">
                      <span className="text-sm">{item.color}</span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="col-span-2 flex items-center justify-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.productVariantID || 0, -1, item.quantity)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        <FiMinus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center bg-gray-50 py-1 px-2 rounded">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.productVariantID || 0, 1, item.quantity)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        <FiPlus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="col-span-2 flex items-center justify-end">
                      <span className="text-sm font-semibold text-[#396254]">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>

                    {/* Remove Button */}
                    <div className="col-span-1 flex justify-center items-center">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer p-2"
                      >
                        <FiX className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Total */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-8">
              <h2 className="text-lg sm:text-xl font-bold mb-4">Cart Total</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4 text-xs sm:text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold whitespace-nowrap">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-xs sm:text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold whitespace-nowrap">{tax === 0 ? 'Free' : `$${tax}`}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex items-center justify-between gap-4">
                  <span className="font-bold text-[#396254] text-sm sm:text-base">Total</span>
                  <span className="font-bold text-base sm:text-lg whitespace-nowrap">${total.toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  // Clear buy now item when proceeding to checkout
                  setBuyNowItem(null);
                  navigate('/checkout');
                }}
                className="w-full mt-6 bg-[#396254] hover:bg-[#2d4d3f] text-white py-3 rounded-full font-medium cursor-pointer text-sm sm:text-base"
              >
                Checkout
              </button>
            </div>
          </>
        )}

        {/* You Might Also Like */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {recommendedProducts.map((product) => {
              const getCategoryDisplay = (category: string) => {
                switch(category) {
                  case 'trending': return 'Trending';
                  case 'best-seller': return 'Best Seller';
                  case 'freeship': return 'Free Ship';
                  case 'new': return 'New';
                  case 'popular': return 'Popular';
                  default: return category;
                }
              };
              return (
                <ProductCard 
                  key={product.id} 
                  id={product.id}
                  name={product.name}
                  description={`${product.brand} - ${product.category}`}
                  price={product.price}
                  thumbnail={product.image}
                  category={getCategoryDisplay(product.category)}
                  freeship={product.category === 'freeship'}
                />
              );
            })}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {infoCards.map((card, index) => (
            <InfoCard key={index} {...card} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
