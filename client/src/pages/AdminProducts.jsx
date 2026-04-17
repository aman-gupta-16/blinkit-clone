import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Loader2, Package } from 'lucide-react';

const EMPTY_FORM = {
  name: '', description: '', price: '', originalPrice: '',
  image: '', category: '', unit: '1 pc', stock: 100, discount: 0, deliveryTime: '10 mins',
};

const CATEGORIES = [
  'Fruits & Vegetables', 'Dairy & Breakfast', 'Snacks & Munchies',
  'Cold Drinks & Juices', 'Instant & Frozen Food', 'Bakery & Bread',
  'Personal Care', 'Household Essentials',
];

const AdminProducts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await productsAPI.getAll({ limit: 100 });
      setProducts(data.data.products || []);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setForm(EMPTY_FORM); setEditingProduct(null); setShowModal(true); };
  const openEdit = (p) => {
    setForm({ ...p, price: p.price.toString(), originalPrice: (p.originalPrice || '').toString(), stock: p.stock.toString(), discount: (p.discount || 0).toString() });
    setEditingProduct(p._id);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), originalPrice: Number(form.originalPrice), stock: Number(form.stock), discount: Number(form.discount) };
      if (editingProduct) {
        await productsAPI.update(editingProduct, payload);
        toast.success('Product updated ✅');
      } else {
        await productsAPI.create(payload);
        toast.success('Product created ✅');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await productsAPI.delete(id);
      toast.success('Product deleted');
      setDeleteId(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blinkit-text flex items-center gap-2">
            <Package className="text-blinkit-green" size={26} />
            Manage Products
          </h1>
          <p className="text-blinkit-muted text-sm mt-1">{products.length} products in store</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Table */}
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
                  {['Product', 'Category', 'Price', 'Stock', 'Discount', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-blinkit-muted uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p._id} className={`border-b border-gray-100 hover:bg-blinkit-gray/50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/40'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg bg-blinkit-gray"
                          onError={(e) => { e.target.src = `https://placehold.co/40x40/f4f4f4/0C831F?text=${p.name[0]}`; }} />
                        <div>
                          <p className="font-semibold text-blinkit-text">{p.name}</p>
                          <p className="text-xs text-blinkit-muted">{p.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block bg-blinkit-green-light text-blinkit-green text-xs font-semibold px-2 py-0.5 rounded-full">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-blinkit-text">₹{p.price}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${p.stock < 10 ? 'text-red-500' : 'text-blinkit-text'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.discount > 0 && (
                        <span className="badge-discount">{p.discount}% OFF</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)}
                          className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setDeleteId(p._id)}
                          className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-blinkit-text">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-blinkit-muted hover:text-blinkit-text rounded-full p-1">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              {[
                { label: 'Product Name', name: 'name', type: 'text', required: true },
                { label: 'Description', name: 'description', type: 'text' },
                { label: 'Image URL', name: 'image', type: 'url', required: true },
                { label: 'Unit (e.g. 500 g, 6 pcs)', name: 'unit', type: 'text' },
                { label: 'Delivery Time', name: 'deliveryTime', type: 'text' },
              ].map(({ label, name, type, required }) => (
                <div key={name}>
                  <label className="block text-xs font-bold text-blinkit-muted uppercase tracking-wider mb-1.5">{label}</label>
                  <input type={type} value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                    className="input-field" required={required} />
                </div>
              ))}

              <div>
                <label className="block text-xs font-bold text-blinkit-muted uppercase tracking-wider mb-1.5">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="input-field" required>
                  <option value="">Select category...</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Price (₹)', name: 'price', required: true },
                  { label: 'Original Price (₹)', name: 'originalPrice' },
                  { label: 'Stock', name: 'stock', required: true },
                  { label: 'Discount (%)', name: 'discount' },
                ].map(({ label, name, required }) => (
                  <div key={name}>
                    <label className="block text-xs font-bold text-blinkit-muted uppercase tracking-wider mb-1.5">{label}</label>
                    <input type="number" value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                      className="input-field" required={required} min="0" />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={saving}>
                  {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : editingProduct ? 'Update' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full animate-bounce-in">
            <div className="text-center">
              <span className="text-5xl">🗑️</span>
              <h3 className="text-lg font-bold text-blinkit-text mt-3 mb-2">Delete Product?</h3>
              <p className="text-blinkit-muted text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="btn-outline flex-1">Cancel</button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 text-white font-semibold py-2.5 rounded-xl hover:bg-red-600 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
