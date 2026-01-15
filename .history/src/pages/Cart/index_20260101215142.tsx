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

  const shippingFee = 0;
  const total = subtotal + shippingFee;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-700 hover:text-[#396254] transition-colors cursor-pointer"
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
            {/* Main Grid - Cart Items + Delivery Info */}
            <div className="grid lg:grid-cols-[1.5fr,1fr] gap-8 mb-12">
              {/* Left Column - Cart Items + Cart Total */}
              <div>
                {/* Cart Header */}
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-1">Shopping cart</h2>
                  <p className="text-sm text-gray-600">You have {items.length} item in your cart</p>
                </div>

                {/* Cart Items Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                  <div className="grid grid-cols-12 gap-3 p-3 bg-gray-50 border-b border-gray-200 font-medium text-sm">
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
                      className="grid grid-cols-12 gap-3 p-3 border-b border-gray-200 last:border-b-0 items-center"
                    >
                      {/* Product Info */}
                      <div className="col-span-5 flex items-center gap-3">
                        <div className="relative w-14 h-14 bg-gray-100 rounded overflow-hidden shrink-0">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
                        </div>
                      </div>

                      {/* Size */}
                      <div className="col-span-2 text-center">
                        <span className="text-sm">{item.size}</span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="col-span-2 flex items-center justify-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, -1)}
                          className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 cursor-pointer text-sm"
                        >
                          <FiMinus className="h-3 w-3" />
                        </button>
                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, 1)}
                          className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 cursor-pointer text-sm"
                        >
                          <FiPlus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="col-span-2 text-right">
                        <span className="text-sm font-medium">{item.price}$</span>
                      </div>

                      {/* Remove Button */}
                      <div className="col-span-1 flex justify-center">
                        <button
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer text-lg leading-none"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Total */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg mb-3">Cart Total</h3>

                  <div className="flex justify-between text-sm py-1">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="font-medium">{subtotal}$</span>
                  </div>

                  <div className="flex justify-between text-sm py-1">
                    <span className="text-gray-700">Shipping Fee</span>
                    <span className="font-medium text-[#396254]">{shippingFee === 0 ? 'Free' : `${shippingFee}$`}</span>
                  </div>

                  <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>{total}$</span>
                  </div>

                  <button className="w-full bg-[#396254] hover:bg-[#2d4d3f] text-white py-3 rounded-lg font-medium mt-4 cursor-pointer transition-colors">
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
              </div>
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
