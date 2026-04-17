import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { CheckCircle, Clock, MapPin, ShoppingBag, ChevronRight, Package, Loader2 } from 'lucide-react';

const STATUS_CONFIG = {
  confirmed:        { label: 'Order Confirmed',    sub: 'Your order has been received',    step: 0 },
  packing:          { label: 'Being Packed',        sub: 'Picker is collecting your items', step: 1 },
  out_for_delivery: { label: 'Out for Delivery',   sub: 'Rider is on the way to you',      step: 2 },
  delivered:        { label: 'Delivered!',          sub: 'Enjoy your groceries',         step: 3 },
};

const TRACKING_STEPS = [
  { key: 'confirmed',        label: 'Order Confirmed',    sub: 'Your order has been received' },
  { key: 'packing',          label: 'Being Packed',        sub: 'Picker is collecting your items' },
  { key: 'out_for_delivery', label: 'Out for Delivery',   sub: 'Rider is on the way' },
  { key: 'delivered',        label: 'Delivered',           sub: '' },
];

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state?.order || null);
  const [animateDone, setAnimateDone] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const pollerRef = useRef(null);

  const orderId   = order?.orderId   || location.state?.orderId;
  const items     = order?.items     || location.state?.items || [];
  const total     = order?.totalAmount ?? location.state?.total ?? 0;
  const dFee      = order?.deliveryFee ?? location.state?.deliveryFee ?? 0;
  const pFee      = order?.platformFee ?? 3;
  const grandTotal = total + dFee + pFee;
  const currentStep = STATUS_CONFIG[order?.status]?.step ?? 0;
  const isDelivered = order?.status === 'delivered';

  const eta = order?.estimatedDeliveryAt
    ? new Date(order.estimatedDeliveryAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    : new Date(Date.now() + 10 * 60 * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  useEffect(() => {
    if (!orderId) return;
    const poll = async () => {
      try {
        const { data } = await ordersAPI.getOrderById(orderId);
        setOrder(data.data);
        if (data.data.status === 'delivered') clearInterval(pollerRef.current);
      } catch { /* silent */ }
    };
    poll(); // immediate first fetch
    pollerRef.current = setInterval(poll, 15_000);
    return () => clearInterval(pollerRef.current);
  }, [orderId]);

  useEffect(() => {
    const t = setTimeout(() => setAnimateDone(true), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!isDelivered) return;
    if (countdown === 0) { navigate('/orders'); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, isDelivered, navigate]);

  if (!orderId) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-blinkit-muted">No order data found.</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blinkit-gray flex items-start justify-center pt-8 px-4 pb-12">
      <div className="w-full max-w-lg space-y-4">

        <div className="card p-8 text-center overflow-hidden relative">
          {/* Confetti dots */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
            {[...Array(18)].map((_, i) => (
              <span key={i} className="absolute w-2.5 h-2.5 rounded-full animate-bounce"
                style={{
                  background: i % 3 === 0 ? '#F8C200' : i % 3 === 1 ? '#0C831F' : '#e2e8f0',
                  top: `${10 + (i * 17) % 70}%`,
                  left: `${(i * 13) % 100}%`,
                  animationDelay: `${(i * 0.12).toFixed(2)}s`,
                  animationDuration: `${0.7 + (i % 4) * 0.25}s`,
                  opacity: animateDone ? 0.7 : 0,
                  transition: 'opacity 0.6s ease',
                }}
              />
            ))}
          </div>

          {/* Checkmark */}
          <div
            className={`w-24 h-24 bg-blinkit-green rounded-full flex items-center justify-center mx-auto mb-5
              transition-all duration-700 ${animateDone ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
            style={{ boxShadow: '0 0 0 14px #E8F5E9' }}
          >
            <CheckCircle size={50} className="text-white" strokeWidth={2.5} />
          </div>

          <h1 className="text-2xl font-black text-blinkit-text mb-1">
            {isDelivered ? 'Order Delivered!' : 'Order Confirmed!'}
          </h1>
          <p className="text-blinkit-muted text-sm">
            {isDelivered
              ? 'Your groceries have been delivered. Enjoy!'
              : 'Your groceries are being packed and will be at your door in'}
          </p>

          {!isDelivered && (
            <div className="mt-4 inline-flex items-center gap-2 bg-blinkit-green text-white px-5 py-2.5 rounded-full font-bold text-lg shadow-md">
              <Clock size={20} />
              10 minutes
            </div>
          )}

          {/* Live status badge */}
          <div className="mt-3 flex justify-center">
            <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold
              ${isDelivered
                ? 'bg-blinkit-green text-white'
                : 'bg-blinkit-yellow text-blinkit-gray-dark'
              }`}>
              {!isDelivered && <span className="w-2 h-2 rounded-full bg-blinkit-gray-dark animate-pulse" />}
              {STATUS_CONFIG[order?.status]?.label || 'Confirmed'}
            </span>
          </div>

          {!isDelivered && (
            <p className="mt-3 text-sm text-blinkit-muted">
              Estimated arrival by <span className="font-bold text-blinkit-text">{eta}</span>
            </p>
          )}

          {/* Order ID */}
          <div className="mt-5 bg-blinkit-gray rounded-2xl px-5 py-3 inline-block">
            <p className="text-xs text-blinkit-muted">Order ID</p>
            <p className="font-bold text-blinkit-text tracking-wider text-sm">#{orderId}</p>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blinkit-green-light rounded-xl flex items-center justify-center shrink-0">
              <MapPin size={18} className="text-blinkit-green" />
            </div>
            <div>
              <p className="font-bold text-blinkit-text text-sm">Delivering to</p>
              <p className="text-blinkit-muted text-sm mt-0.5">{order?.deliveryAddress || 'Baltana, Zirakpur, Punjab 140603'}</p>
              <span className="mt-1.5 inline-block text-xs bg-blinkit-green-light text-blinkit-green font-semibold px-2.5 py-0.5 rounded-full">
                Home
              </span>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-blinkit-text text-sm">Live Tracking</h2>
            {!isDelivered && (
              <span className="flex items-center gap-1.5 text-xs text-blinkit-muted">
                <Loader2 size={12} className="animate-spin text-blinkit-green" />
                Auto-updating
              </span>
            )}
          </div>

          <div className="relative">
            <div className="absolute left-4 top-5 bottom-5 w-0.5 bg-gray-100" />
            {TRACKING_STEPS.map((step, i) => {
              const isDone = i <= currentStep;
              const isActive = i === currentStep;
              const deliveredAt = order?.deliveredAt
                ? new Date(order.deliveredAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
                : null;

              return (
                <div key={step.key} className={`flex items-start gap-4 mb-4 last:mb-0 relative
                  transition-all duration-500 ${isDone ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-500
                    ${isDone ? 'bg-blinkit-green' : 'bg-white border-2 border-gray-200'}
                    ${isActive && !isDelivered ? 'ring-4 ring-blinkit-green/20' : ''}`}>
                    {isDone
                      ? <CheckCircle size={17} className="text-white" strokeWidth={2.5} />
                      : <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />}
                  </div>
                  <div className="pt-0.5">
                    <p className={`font-semibold text-sm ${isDone ? 'text-blinkit-text' : 'text-blinkit-muted'}`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-blinkit-muted mt-0.5">
                      {step.key === 'delivered' && deliveredAt
                        ? `Delivered at ${deliveredAt}`
                        : step.key === 'delivered' && !isDelivered
                        ? `Expected by ${eta}`
                        : step.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-bold text-blinkit-text text-sm mb-4 flex items-center gap-2">
            <Package size={17} className="text-blinkit-green" />
            Order Summary ({items.length} item{items.length !== 1 ? 's' : ''})
          </h2>

          <div className="flex flex-col divide-y divide-gray-100">
            {items.map((item, idx) => {
              const name  = item.name  || item.productId?.name  || 'Product';
              const image = item.image || item.productId?.image || '';
              const price = item.price || item.productId?.price || 0;
              const unit  = item.unit  || item.productId?.unit  || '';
              const qty   = item.quantity;
              return (
                <div key={idx} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <img src={image} alt={name}
                    className="w-12 h-12 object-cover rounded-xl bg-blinkit-gray shrink-0"
                    onError={(e) => { e.target.src = `https://placehold.co/48x48/f4f4f4/0C831F?text=${encodeURIComponent((name[0] || '?'))}`; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-blinkit-text leading-tight truncate">{name}</p>
                    <p className="text-xs text-blinkit-muted">{unit} × {qty}</p>
                  </div>
                  <p className="font-bold text-sm text-blinkit-text shrink-0">₹{(price * qty).toFixed(0)}</p>
                </div>
              );
            })}
          </div>

          {/* Price breakdown */}
          <div className="mt-4 pt-4 border-t border-dashed border-gray-200 space-y-2 text-sm">
            <div className="flex justify-between text-blinkit-muted">
              <span>Items total</span><span>₹{total.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-blinkit-muted">
              <span>Delivery fee</span>
              {dFee === 0
                ? <span className="text-blinkit-green font-semibold">FREE</span>
                : <span>₹{dFee}</span>}
            </div>
            <div className="flex justify-between text-blinkit-muted">
              <span>Platform fee</span><span>₹{pFee}</span>
            </div>
            <div className="flex justify-between font-bold text-blinkit-text text-base pt-2 border-t border-gray-100">
              <span>Total paid</span>
              <span className="text-blinkit-green">₹{grandTotal.toFixed(0)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/orders" className="btn-outline flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold">
            <Package size={17} />
            My Orders
          </Link>
          <Link to="/" className="btn-primary flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2">
            <ShoppingBag size={17} />
            Shop More
            <ChevronRight size={15} />
          </Link>
        </div>

        {isDelivered && (
          <p className="text-center text-xs text-blinkit-muted">
            Redirecting to orders in <span className="font-bold text-blinkit-green">{countdown}s</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmation;
