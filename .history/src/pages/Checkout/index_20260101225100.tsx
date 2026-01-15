import { useState } from 'react';
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

export default function Checkout() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, subtotal, buyNowItem, setBuyNowItem } = useCart();
  const recommendedProducts = getRelatedProducts(0, 4);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');

  // Use buyNowItem if available, otherwise use cart items
  const checkoutItems = buyNowItem ? [buyNowItem] : items;
  const checkoutSubtotal = buyNowItem 
    ? buyNowItem.price * buyNowItem.quantity 
    : subtotal;

  const shippingFee = 0;
  const total = checkoutSubtotal + shippingFee;

  // Redirect to home if no items
  if (checkoutItems.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center mb-8">
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#396254] hover:bg-[#2d4d3f] text-white px-6 py-2 rounded-md cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => {
            setBuyNowItem(null);
            navigate('/');
          }}
          className="mb-6 flex items-center gap-2 text-gray-700 hover:text-[#396254] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#396254] hover:bg-[#2d4d3f] transition-colors">
            <FiChevronLeft className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold">Shopping Continue</span>
        </button>

        {/* Main Grid - Cart Items + Delivery Info */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Cart Items + Cart Total */}
          <div>
            {/* Cart Header */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1">Shopping cart</h2>
              <p className="text-sm text-gray-600">You have {checkoutItems.length} item in your cart</p>
            </div>

            {/* Cart Items - Compact List */}
            <div className="space-y-3 mb-6">
              {checkoutItems.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
                >
                  {/* Product Image */}
                  <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
                  </div>

                  {/* Size */}
                  <span className="text-sm text-gray-600">{item.size}</span>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        if (buyNowItem) {
                          setBuyNowItem({ ...buyNowItem, quantity: Math.max(1, buyNowItem.quantity - 1) });
                        } else {
                          updateQuantity(item.id, item.size, -1);
                        }
                      }}
                      className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                    >
                      <FiMinus className="h-2.5 w-2.5" />
                    </button>
                    <span className="text-sm w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => {
                        if (buyNowItem) {
                          setBuyNowItem({ ...buyNowItem, quantity: buyNowItem.quantity + 1 });
                        } else {
                          updateQuantity(item.id, item.size, 1);
                        }
                      }}
                      className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                    >
                      <FiPlus className="h-2.5 w-2.5" />
                    </button>
                  </div>

                  {/* Price */}
                  <span className="text-sm font-medium w-14 text-right">{item.price}$</span>

                  {/* Remove Button */}
                  <button
                    onClick={() => {
                      if (buyNowItem) {
                        setBuyNowItem(null);
                        navigate('/');
                      } else {
                        removeFromCart(item.id, item.size);
                      }
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Cart Total */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg mb-3">Cart Total</h3>

              <div className="flex justify-between text-sm py-1">
                <span className="text-gray-700">Subtotal</span>
                <span className="font-medium">{checkoutSubtotal}$</span>
              </div>

              <div className="flex justify-between text-sm py-1">
                <span className="text-gray-700">Shipping Fee</span>
                <span className="font-medium text-[#396254]">{shippingFee === 0 ? 'Free' : `${shippingFee}$`}</span>
              </div>

              <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200">
                <span className="text-[#396254]">Total</span>
                <span>{total}$</span>
              </div>

              <button className="w-full bg-[#396254] hover:bg-[#2d4d3f] text-white py-3 rounded-full font-medium mt-4 cursor-pointer transition-colors">
                Place Order
              </button>
            </div>
          </div>

          {/* Right Column - Delivery Information */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Delivery Information</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#396254] text-sm"
                  placeholder="First name*"
                />
                <input
                  type="text"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#396254] text-sm"
                  placeholder="Last name*"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="email"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#396254] text-sm"
                  placeholder="Email*"
                />
                <input
                  type="tel"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#396254] text-sm"
                  placeholder="Phone number*"
                />
              </div>

              <input
                type="text"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#396254] text-sm"
                placeholder="Address*"
              />

              <textarea
                rows={4}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#396254] resize-none text-sm"
                placeholder="Note"
              />
            </div>

            {/* Payment Method */}
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-4">Payment Method</h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 border rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    paymentMethod === 'cash'
                      ? 'border-[#396254] bg-[#396254]/10 text-[#396254]'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  💵 Cash on Delivery
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 border rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-[#396254] bg-[#396254]/10 text-[#396254]'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  💳 Credit/Debit Card
                </button>
              </div>

              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <input
                    type="text"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#396254] text-sm"
                    placeholder="Card Number*"
                    maxLength={16}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#396254] text-sm"
                      placeholder="MM/YY*"
                      maxLength={5}
                    />
                    <input
                      type="text"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#396254] text-sm"
                      placeholder="CVV*"
                      maxLength={3}
                    />
                  </div>
                  <input
                    type="text"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#396254] text-sm"
                    placeholder="Cardholder Name*"
                  />
                </div>
              )}

              {/* Cash on Delivery Info */}
              {paymentMethod === 'cash' && (
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600">
                    💡 You will pay in cash when your order is delivered to your address.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

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
