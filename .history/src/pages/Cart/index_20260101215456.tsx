import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiMinus, FiPlus, FiX } from 'react-icons/fi';
import MainLayout from '../../layouts/MainLayout';
import ProductCard from '../../components/card/ProductCard';
import InfoCard from '../../components/card/InfoCard';
import { useCart } from '../../hooks/useCart';
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
  const { items, removeFromCart, updateQuantity, subtotal } = useCart();
  const recommendedProducts = getRelatedProducts(0, 4);

  const tax = 0;
  const total = subtotal + tax;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-[#396254] hover:text-[#2d4d3f] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#396254] hover:bg-[#2d4d3f] transition-colors">
            <FiChevronLeft className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold">Shopping Continue</span>
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
            <div className="bg-white border border-gray-200 rounded-lg mb-8">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 text-sm font-semibold">
                <div className="col-span-5">Product</div>
                <div className="col-span-2 text-center">Size</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-1"></div>
              </div>

              {/* Cart Items */}
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 last:border-b-0 items-center"
                >
                  {/* Product Info */}
                  <div className="col-span-5 flex items-center gap-4">
                    <div className="relative w-20 h-20 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                    </div>
                  </div>

                  {/* Size */}
                  <div className="col-span-2 text-center">
                    <span className="text-sm">{item.size}</span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="col-span-2 flex items-center justify-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.size, -1)}
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                    >
                      <FiMinus className="h-3 w-3" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.size, 1)}
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                    >
                      <FiPlus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 text-right">
                    <span className="text-sm font-semibold">{item.price}$</span>
                  </div>

                  {/* Remove Button */}
                  <div className="col-span-1 flex justify-end">
                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Total */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Cart Total</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{subtotal}$</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">{tax === 0 ? 'Free' : `${tax}$`}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-bold text-[#396254]">Total</span>
                  <span className="font-bold text-lg">{total}$</span>
                </div>
              </div>
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full mt-6 bg-[#396254] hover:bg-[#2d4d3f] text-white py-3 rounded-md font-medium cursor-pointer"
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
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
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
