import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2, Package, Eye } from 'lucide-react';

const STATUS_STYLES = {
  confirmed:        { label: 'Confirmed',          color: 'bg-blue-50 text-blue-600 border-blue-200' },
  packing:          { label: 'Being Packed',        color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  out_for_delivery: { label: 'Out for Delivery',   color: 'bg-orange-50 text-orange-600 border-orange-200' },
  delivered:        { label: 'Delivered',           color: 'bg-green-50 text-blinkit-green border-green-200' },
};

const AdminOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await ordersAPI.getAllAdminOrders();
      setOrders(data.data || []);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    fetchOrders();
  }, [user, navigate, fetchOrders]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blinkit-text flex items-center gap-2">
            <Package className="text-blinkit-green" size={26} />
            Manage Orders (Admin)
          </h1>
          <p className="text-blinkit-muted text-sm mt-1">{orders.length} total orders placed across the platform.</p>
        </div>
        <button
          onClick={fetchOrders}
          className="btn-outline flex items-center gap-2"
        >
          Refresh Data
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <Loader2 className="w-10 h-10 text-blinkit-green animate-spin" />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blinkit-gray border-b border-gray-200">
                <tr>
                  {['Order ID', 'Customer', 'Date Placed', 'Grand Total', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-blinkit-muted uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => {
                  const cfg = STATUS_STYLES[order.status] || STATUS_STYLES.confirmed;
                  const placedAt = new Date(order.createdAt).toLocaleString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit', hour12: true,
                  });

                  return (
                  <tr key={order._id} className={`border-b border-gray-100 hover:bg-blinkit-gray/50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/40'}`}>
                    <td className="px-4 py-4 font-semibold text-blinkit-text whitespace-nowrap">
                      #{order.orderId}
                    </td>
                    <td className="px-4 py-4">
                      {order.userId ? (
                        <div>
                          <p className="font-semibold text-blinkit-text">{order.userId.name}</p>
                          <p className="text-xs text-blinkit-muted">{order.userId.email}</p>
                        </div>
                      ) : (
                        <span className="text-blinkit-muted italic">Unknown user</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-blinkit-text whitespace-nowrap">
                      {placedAt}
                    </td>
                    <td className="px-4 py-4 font-bold text-blinkit-text whitespace-nowrap">
                      ₹{order.grandTotal.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
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
                        className="text-blinkit-green hover:text-blinkit-green-dark p-1.5 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-1.5"
                      >
                        <Eye size={18} />
                        View
                      </button>
                    </td>
                  </tr>
                )})}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-blinkit-muted">
                      No orders have been placed yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
