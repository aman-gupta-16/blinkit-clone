import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Package, Clock, CheckCircle, ChevronRight, ShoppingBag,
  Loader2, MapPin, RotateCcw,
} from 'lucide-react';

const STATUS_STYLES = {
  confirmed:        { label: 'Confirmed',          color: 'bg-blue-50 text-blue-600 border-blue-200' },
  packing:          { label: 'Being Packed',        color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  out_for_delivery: { label: 'Out for Delivery',   color: 'bg-orange-50 text-orange-600 border-orange-200' },
  delivered:        { label: 'Delivered',           color: 'bg-green-50 text-blinkit-green border-green-200' },
};

const TRACKING_STEPS = ['confirmed', 'packing', 'out_for_delivery', 'delivered'];

const StatusBar = ({ status }) => {
  const currentIdx = TRACKING_STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-0 mt-3">
      {TRACKING_STEPS.map((s, i) => (
        <div key={s} className="flex items-center flex-1">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 transition-all
            ${i <= currentIdx
              ? 'bg-blinkit-green border-blinkit-green'
              : 'bg-white border-gray-200'}`}>
            {i <= currentIdx
              ? <CheckCircle size={13} className="text-white" strokeWidth={3} />
              : <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />}
          </div>
          {i < TRACKING_STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-0.5 transition-all ${i < currentIdx ? 'bg-blinkit-green' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
};

const OrderCard = ({ order }) => {
  const navigate = useNavigate();
  const cfg = STATUS_STYLES[order.status] || STATUS_STYLES.confirmed;
  const isActive = order.status !== 'delivered';
  const placedAt = new Date(order.createdAt).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

  return (
    <div className={`card p-5 transition-all ${isActive ? 'border-2 border-blinkit-green/40' : ''}`}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.color}`}>
              {cfg.label}
            </span>
            {isActive && (
              <span className="flex items-center gap-1 text-xs text-blinkit-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-blinkit-green animate-pulse" />
                Live
              </span>
            )}
          </div>
          <p className="text-xs text-blinkit-muted mt-1.5 flex items-center gap-1">
            <Clock size={11} />
            {placedAt}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-black text-blinkit-green text-lg">₹{order.grandTotal}</p>
          <p className="text-xs text-blinkit-muted">#{order.orderId}</p>
        </div>
      </div>

      {/* Progress bar (active orders only) */}
      {isActive && <StatusBar status={order.status} />}

      {/* Items preview */}
      <div className="mt-4 flex items-center gap-2">
        <div className="flex -space-x-2">
          {order.items.slice(0, 4).map((item, i) => (
            <img
              key={i}
              src={item.image}
              alt={item.name}
              className="w-10 h-10 rounded-xl object-cover border-2 border-white bg-blinkit-gray"
              onError={(e) => {
                e.target.src = `https://placehold.co/40x40/f4f4f4/0C831F?text=${encodeURIComponent((item.name || '?')[0])}`;
              }}
            />
          ))}
          {order.items.length > 4 && (
            <div className="w-10 h-10 rounded-xl bg-blinkit-gray border-2 border-white flex items-center justify-center">
              <span className="text-[10px] font-bold text-blinkit-muted">+{order.items.length - 4}</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-blinkit-text truncate">
            {order.items.map(i => i.name).join(', ')}
          </p>
          <p className="text-xs text-blinkit-muted">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Delivery address */}
      <div className="mt-3 flex items-center gap-1.5 text-xs text-blinkit-muted">
        <MapPin size={12} className="text-blinkit-green shrink-0" />
        <span className="truncate">{order.deliveryAddress}</span>
      </div>

      {/* Footer: track button */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-blinkit-muted">
          {order.status === 'delivered'
            ? `Delivered at ${new Date(order.deliveredAt || order.updatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`
            : `ETA: ${new Date(order.estimatedDeliveryAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`}
        </span>
        <button
          onClick={() => navigate('/order-confirmation', {
            state: {
              order,
              items: order.items,
              total: order.totalAmount,
              deliveryFee: order.deliveryFee,
              orderId: order.orderId,
            },
          })}
          className="flex items-center gap-1.5 text-blinkit-green font-semibold text-xs hover:underline"
        >
          {isActive ? 'Track Order' : 'View Details'}
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await ordersAPI.getMyOrders();
      setOrders(data.data || []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  useEffect(() => {
    const t = setInterval(fetchOrders, 20_000);
    return () => clearInterval(t);
  }, [fetchOrders]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-blinkit-text mt-4 mb-2">Login to view orders</h2>
        <Link to="/login" className="btn-primary inline-block mt-4">Login</Link>
      </div>
    );
  }

  const activeOrders    = orders.filter(o => o.status !== 'delivered');
  const pastOrders      = orders.filter(o => o.status === 'delivered');

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-blinkit-text flex items-center gap-2">
            <Package className="text-blinkit-green" size={26} />
            My Orders
          </h1>
          <p className="text-blinkit-muted text-sm mt-0.5">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-1.5 text-sm text-blinkit-green font-semibold hover:underline"
        >
          <RotateCcw size={14} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="w-10 h-10 text-blinkit-green animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <h3 className="text-xl font-bold text-blinkit-text mb-2">No orders yet</h3>
          <p className="text-blinkit-muted mb-6">Start shopping and your orders will appear here</p>
          <Link to="/" className="btn-primary flex items-center gap-2">
            <ShoppingBag size={18} />
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active orders */}
          {activeOrders.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-blinkit-text uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blinkit-green animate-pulse" />
                Active Orders ({activeOrders.length})
              </h2>
              <div className="space-y-3">
                {activeOrders.map(o => <OrderCard key={o._id} order={o} />)}
              </div>
            </section>
          )}

          {/* Past orders */}
          {pastOrders.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-blinkit-muted uppercase tracking-wider mb-3">
                Past Orders ({pastOrders.length})
              </h2>
              <div className="space-y-3">
                {pastOrders.map(o => <OrderCard key={o._id} order={o} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
