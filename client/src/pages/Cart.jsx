import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/CartItem';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';
import { ShoppingBag, ArrowLeft, Clock, Shield, Tag, Loader2 } from 'lucide-react';

const Cart = () => {
  const { cartItems, cartTotal, cartLoading, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);

  const deliveryFee = cartTotal > 0 && cartTotal < 199 ? 25 : 0;
  const platformFee = cartTotal > 0 ? 3 : 0;
  const savings = cartItems.reduce((sum, item) => {
    const p = item.productId;
    if (!p) return sum;
    return sum + (p.originalPrice > p.price ? (p.originalPrice - p.price) * item.quantity : 0);
  }, 0);
  const grandTotal = cartTotal + deliveryFee + platformFee;

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const { data } = await ordersAPI.placeOrder({});
      const order = data.data;
      // Cart is cleared by the backend; refresh local cart state
      await fetchCart();
      navigate('/order-confirmation', {
        state: {
          order,
          items: order.items,
          total: order.totalAmount,
          deliveryFee: order.deliveryFee,
          orderId: order.orderId,
        },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
      setCheckingOut(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-blinkit-text mt-4 mb-2">Login to view cart</h2>
        <p className="text-blinkit-muted mb-6">Your cart is waiting for you!</p>
        <Link to="/login" className="btn-primary inline-block">
          Login / Register
        </Link>
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-10 h-10 text-blinkit-green animate-spin" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-blinkit-text mt-4 mb-2">Your cart is empty</h2>
        <p className="text-blinkit-muted mb-6">Add items to get started!</p>
        <Link to="/" className="btn-primary inline-block">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-blinkit-green font-semibold mb-6 hover:underline"
      >
        <ArrowLeft size={18} />
        Continue Shopping
      </Link>

      <div className="flex gap-6 items-start flex-col lg:flex-row">
        {/* Cart Items */}
        <div className="flex-1 w-full">
          {/* Delivery timer banner */}
          <div className="bg-blinkit-green-light border border-blinkit-green/30 rounded-2xl px-5 py-3 mb-4 flex items-center gap-3">
            <Clock size={20} className="text-blinkit-green shrink-0" />
            <div>
              <p className="font-bold text-blinkit-green text-sm">Delivery in 10 minutes</p>
              <p className="text-xs text-blinkit-text/70">Shipment of {cartItems.length} item{cartItems.length > 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {cartItems.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}
          </div>

          {/* Savings banner */}
          {savings > 0 && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-2xl px-5 py-3 flex items-center gap-2">
              <Tag size={16} className="text-blinkit-green shrink-0" />
              <span className="text-sm font-semibold text-blinkit-green">
                You save ₹{savings.toFixed(0)} on this order!
              </span>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="card p-5 sticky top-20">
            <h2 className="font-bold text-lg text-blinkit-text mb-4 flex items-center gap-2">
              <ShoppingBag size={20} className="text-blinkit-green" />
              Order Summary
            </h2>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between text-blinkit-text">
                <span>Items total</span>
                <span className="font-semibold">₹{cartTotal.toFixed(0)}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-blinkit-green">
                  <span>Discount</span>
                  <span className="font-semibold">−₹{savings.toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between text-blinkit-text">
                <span>Delivery fee</span>
                {deliveryFee === 0 ? (
                  <span className="font-semibold text-blinkit-green">FREE</span>
                ) : (
                  <span className="font-semibold">₹{deliveryFee}</span>
                )}
              </div>
              <div className="flex justify-between text-blinkit-muted text-xs">
                <span>Platform fee</span>
                <span>₹{platformFee}</span>
              </div>
              {deliveryFee === 0 && cartTotal > 0 && (
                <p className="text-xs text-blinkit-green bg-green-50 rounded-lg px-3 py-1.5">
                  Free delivery on orders above ₹199
                </p>
              )}
              {deliveryFee > 0 && (
                <p className="text-xs text-blinkit-muted bg-yellow-50 rounded-lg px-3 py-1.5">
                  Add ₹{(199 - cartTotal).toFixed(0)} more for free delivery
                </p>
              )}
            </div>

            <div className="border-t border-dashed border-gray-200 mt-4 pt-4">
              <div className="flex justify-between font-bold text-base text-blinkit-text mb-4">
                <span>To pay</span>
                <span>₹{grandTotal.toFixed(0)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="btn-primary w-full text-center py-3 text-base rounded-xl flex items-center justify-center gap-2 disabled:opacity-80"
              >
                {checkingOut ? (
                  <><Loader2 size={18} className="animate-spin" /> Placing Order...</>
                ) : (
                  'Proceed to Checkout'
                )}
              </button>

              <div className="flex items-center gap-2 mt-3 justify-center">
                <Shield size={13} className="text-blinkit-muted" />
                <span className="text-xs text-blinkit-muted">100% secure payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
