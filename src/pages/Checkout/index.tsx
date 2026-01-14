import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiChevronLeft, FiMinus, FiPlus, FiX } from 'react-icons/fi';
import MainLayout from '../../layouts/MainLayout';
import ProductCard from '../../components/card/ProductCard';
import InfoCard from '../../components/card/InfoCard';
import OrderConfirmedModal from '../../components/common/OrderConfirmedModal';
import { useCart } from '../../hooks/useCart';
import { useUser } from '../../hooks/UserContext';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const { items, removeFromCart, updateQuantity, subtotal, buyNowItem, setBuyNowItem, clearCart } = useCart();
  const { addOrder, profile } = useUser();
  const recommendedProducts = getRelatedProducts(0, 4);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [addressMode, setAddressMode] = useState<'default' | 'new'>('new'); // Always start with 'new'
  const showOrderConfirmed = searchParams.get('orderConfirmed') === 'true';

  const [deliveryInfo, setDeliveryInfo] = useState(() => {
    if (profile?.defaultShippingAddress) {
      return {
        firstName: profile.name,
        lastName: profile.defaultShippingAddress.postalCode,
        email: profile.email,
        phone: profile.phone,
        address: profile.defaultShippingAddress.address,
        note: ''
      };
    }
    return {
      firstName: '',
      lastName: '', // This will be used for postcode
      email: '',
      phone: '',
      address: '',
      note: ''
    };
  });

  const handleAddressModeChange = (mode: 'default' | 'new') => {
    setAddressMode(mode);
    
    if (mode === 'default' && profile?.defaultShippingAddress) {
      // Auto-fill with default address
      setDeliveryInfo({
        firstName: profile.name,
        lastName: profile.defaultShippingAddress.postalCode,
        email: profile.email,
        phone: profile.phone,
        address: profile.defaultShippingAddress.address,
        note: ''
      });
    } else if (mode === 'new') {
      // Clear for manual input
      setDeliveryInfo({
        firstName: '',
        lastName: '', // postcode
        email: '',
        phone: '',
        address: '',
        note: ''
      });
    }
  };

  const handlePlaceOrder = () => {
    // Validate required fields based on address mode
    if (addressMode === 'default' && !profile?.defaultShippingAddress) {
      alert('Please set a default address in your profile or choose to enter new information');
      return;
    }
    
    if (addressMode === 'new') {
      if (!deliveryInfo.firstName || !deliveryInfo.email || !deliveryInfo.phone || !deliveryInfo.address || !deliveryInfo.lastName) {
        alert('Please fill in all required delivery information (name, email, phone, address, and postcode)');
        return;
      }
    }

    // Create order
    addOrder({
      items: checkoutItems,
      deliveryInfo,
      paymentMethod,
      total
    });

    // Clear cart if not buy now
    if (!buyNowItem) {
      clearCart();
    } else {
      setBuyNowItem(null);
    }

    // Show order confirmed modal via URL param
    setSearchParams({ orderConfirmed: 'true' });
  };

  const handleContinueShopping = () => {
    // Clear orderConfirmed param and navigate to home
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('orderConfirmed');
    setSearchParams(newParams, { replace: true });
    navigate('/', { replace: true });
  };

  const handleViewOrder = () => {
    // Clear orderConfirmed param and navigate to profile
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('orderConfirmed');
    setSearchParams(newParams, { replace: true });
    navigate('/profile?tab=history', { replace: true });
  };

  // Use buyNowItem if available, otherwise use cart items
  const checkoutItems = buyNowItem ? [buyNowItem] : items;
  const checkoutSubtotal = buyNowItem 
    ? buyNowItem.price * buyNowItem.quantity 
    : subtotal;

  const shippingFee = 0;
  const total = checkoutSubtotal + shippingFee;

  // Show popup if orderConfirmed param exists, regardless of cart state
  if (showOrderConfirmed) {
    return (
      <MainLayout>
        <OrderConfirmedModal
          isOpen={true}
          onContinueShopping={handleContinueShopping}
          onViewOrder={handleViewOrder}
        />
      </MainLayout>
    );
  }

  // Redirect to home if no items AND no order confirmed
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

            {/* Table Header */}
            <div className="border border-gray-200 rounded-t-lg bg-gray-50 px-4 py-3">
              <div className="grid grid-cols-12 gap-3 text-sm font-semibold">
                <div className="col-span-4">Product</div>
                <div className="col-span-1.5 text-center">Size</div>
                <div className="col-span-1.5 text-center">Color</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-1"></div>
              </div>
            </div>

            {/* Cart Items - Compact List */}
            <div className="border-l border-r border-b border-gray-200 rounded-b-lg divide-y divide-gray-200 mb-6">
              {checkoutItems.map((item) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="grid grid-cols-12 gap-3 p-4 items-center"
                >
                  {/* Product Info */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden shrink-0">
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
                    </div>
                  </div>

                  {/* Size */}
                  <div className="col-span-1.5 text-center">
                    <span className="text-sm text-gray-600">{item.size}</span>
                  </div>

                  {/* Color */}
                  <div className="col-span-1.5 text-center">
                    <span className="text-sm text-gray-600">{item.color}</span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="col-span-2 flex items-center justify-center gap-1">
                    <button
                      onClick={() => {
                        if (buyNowItem) {
                          setBuyNowItem({ ...buyNowItem, quantity: Math.max(1, buyNowItem.quantity - 1) });
                        } else {
                          updateQuantity(item.id, item.size, item.color, -1);
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
                          updateQuantity(item.id, item.size, item.color, 1);
                        }
                      }}
                      className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                    >
                      <FiPlus className="h-2.5 w-2.5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 text-right">
                    <span className="text-sm font-medium">{item.price}$</span>
                  </div>

                  {/* Remove Button */}
                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={() => {
                        if (buyNowItem) {
                          setBuyNowItem(null);
                          navigate('/');
                        } else {
                          removeFromCart(item.id, item.size, item.color);
                        }
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
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

              <button 
                onClick={handlePlaceOrder}
                className="w-full bg-[#396254] hover:bg-[#2d4d3f] text-white py-3 rounded-full font-medium mt-4 cursor-pointer transition-colors"
              >
                Place Order
              </button>
            </div>
          </div>

          {/* Right Column - Delivery Information */}
          <div>
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4">Delivery Information</h3>
              
              {/* Address Mode Selection */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => handleAddressModeChange('default')}
                  disabled={!profile?.defaultShippingAddress}
                  className={`p-4 border rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    addressMode === 'default'
                      ? 'border-[#396254] bg-[#396254]/10 text-[#396254]'
                      : profile?.defaultShippingAddress
                      ? 'border-gray-300 hover:border-gray-400'
                      : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  📍 Use Default Address
                  {!profile?.defaultShippingAddress && (
                    <div className="text-xs text-gray-400 mt-1">No default address</div>
                  )}
                </button>
                <button
                  onClick={() => handleAddressModeChange('new')}
                  className={`p-4 border rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    addressMode === 'new'
                      ? 'border-[#396254] bg-[#396254]/10 text-[#396254]'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  ✏️ Enter New Information
                </button>
              </div>

              {/* Default Address Display */}
              {addressMode === 'default' && profile?.defaultShippingAddress && (
                <div className="border rounded-lg p-4 bg-gray-50 mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">{profile?.name}</h4>
                  <p className="text-sm text-gray-600 mb-1">
                    {profile?.defaultShippingAddress.address}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    {profile?.defaultShippingAddress.postalCode}
                  </p>
                  <p className="text-sm text-gray-600">
                    {profile?.email} • {profile?.phone}
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 bg-[#396254] text-white text-xs rounded-full">Default Address</span>
                </div>
              )}

              {/* No Default Address Message */}
              {addressMode === 'default' && !profile?.defaultShippingAddress && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-6">
                  <p className="text-gray-500 text-sm mb-3">No default address found</p>
                  <button
                    onClick={() => navigate('/profile?addAddress=true')}
                    className="text-[#396254] hover:text-[#2d4d3f] text-sm font-medium cursor-pointer"
                  >
                    Go to Profile to add default address
                  </button>
                </div>
              )}

              {/* Manual Entry Form */}
              {addressMode === 'new' && (
                <div className="space-y-4 border rounded-lg p-6 bg-gray-50">
                  <h4 className="font-medium text-gray-900 mb-4">Enter Delivery Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={deliveryInfo.firstName}
                      onChange={(e) => setDeliveryInfo(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#396254]"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={deliveryInfo.phone}
                      onChange={(e) => setDeliveryInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#396254]"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={deliveryInfo.email}
                      onChange={(e) => setDeliveryInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#396254]"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <input
                      type="text"
                      value={deliveryInfo.address}
                      onChange={(e) => setDeliveryInfo(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#396254]"
                      placeholder="Enter full address"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postcode *</label>
                    <input
                      type="text"
                      value={deliveryInfo.lastName}
                      onChange={(e) => setDeliveryInfo(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#396254]"
                      placeholder="Enter postcode"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Note (Optional)</label>
                    <textarea
                      value={deliveryInfo.note || ''}
                      onChange={(e) => setDeliveryInfo(prev => ({ ...prev, note: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#396254] resize-none"
                      placeholder="Enter delivery notes..."
                      rows={3}
                    />
                  </div>
                </div>
              )}
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
                <div className="space-y-4 p-6 border border-gray-200 rounded-lg bg-[#396254]">
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Name On Card</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border-0 bg-white focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                      placeholder="Name"
                    />
                  </div>
                  
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Card Number</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border-0 bg-white focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                      placeholder="1111 2222 3333 4444"
                      maxLength={19}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Expiration date</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border-0 bg-white focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                        placeholder="mm/yy"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">CVV</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border-0 bg-white focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                        placeholder="123"
                        maxLength={3}
                      />
                    </div>
                  </div>
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
              <ProductCard 
                key={product.id} 
                id={product.id}
                name={product.name}
                description={`${product.brand} - ${product.category}`}
                price={product.price}
                thumbnail={product.image}
                badge={product.category === 'best-seller' ? 'Best Seller' : undefined}
                freeship={product.category === 'freeship'}
              />
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
