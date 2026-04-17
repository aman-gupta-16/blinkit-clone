import { useState, useEffect, useCallback } from 'react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { Loader2 } from 'lucide-react';

const CATEGORY_ICONS = {
  'Fruits & Vegetables': '🥦',
  'Dairy & Breakfast': '🥛',
  'Snacks & Munchies': '🍿',
  'Cold Drinks & Juices': '🥤',
  'Instant & Frozen Food': '🍜',
  'Bakery & Bread': '🍞',
  'Personal Care': '🧴',
  'Household Essentials': '🧹',
};

const BANNERS = [
  { bg: 'from-yellow-400 to-yellow-500', text: 'Groceries in 10 minutes', sub: 'Fresh & Fast Delivery', emoji: '⚡' },
  { bg: 'from-green-400 to-green-600', text: 'Fresh Fruits & Veggies', sub: 'Farm to your door', emoji: '🥗' },
  { bg: 'from-blue-400 to-indigo-500', text: 'Dairy & Breakfast', sub: 'Start your day right', emoji: '🥛' },
];

const Home = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [bannerIdx, setBannerIdx] = useState(0);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      const { data } = await productsAPI.getAll(params);
      setProducts(data.data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const { data } = await productsAPI.getCategories();
      setCategories(['All', ...(data.data || [])]);
    } catch {}
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Auto-rotate banner
  useEffect(() => {
    const t = setInterval(() => setBannerIdx((i) => (i + 1) % BANNERS.length), 3500);
    return () => clearInterval(t);
  }, []);

  const banner = BANNERS[bannerIdx];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero Banner */}
      {!searchQuery && (
        <div
          className={`bg-gradient-to-r ${banner.bg} rounded-3xl p-8 mb-8 flex items-center justify-between
            transition-all duration-700 min-h-[160px] shadow-lg`}
        >
          <div>
            <p className="text-white/80 text-sm font-medium mb-1">{banner.sub}</p>
            <h1 className="text-3xl font-black text-white leading-tight">{banner.text}</h1>
            <div className="mt-4 inline-flex items-center gap-2 bg-white/20 text-white rounded-full px-4 py-1.5 text-sm font-semibold">
              ⚡ 10-minute delivery
            </div>
          </div>
          <span className="text-8xl hidden sm:block">{banner.emoji}</span>
        </div>
      )}

      <div className="flex gap-6">
        {/* Category Sidebar */}
        <aside className="hidden lg:block w-44 shrink-0">
          <h2 className="font-bold text-blinkit-text mb-4 text-sm uppercase tracking-wider">Categories</h2>
          <div className="flex flex-col gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left
                  ${selectedCategory === cat
                    ? 'bg-blinkit-green-light text-blinkit-green border-2 border-blinkit-green'
                    : 'text-blinkit-text hover:bg-blinkit-gray'
                  }`}
              >
                <span className="text-lg">{CATEGORY_ICONS[cat] || '🛒'}</span>
                <span className="leading-tight">{cat}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Mobile category scroll */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all
                  ${selectedCategory === cat
                    ? 'bg-blinkit-green text-white'
                    : 'bg-white text-blinkit-text border border-gray-200'
                  }`}
              >
                <span>{CATEGORY_ICONS[cat] || '🛒'}</span>
                {cat}
              </button>
            ))}
          </div>

          {/* Section title */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-blinkit-text">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : selectedCategory === 'All'
                ? '🛒 All Products'
                : `${CATEGORY_ICONS[selectedCategory] || ''} ${selectedCategory}`}
            </h2>
            <span className="text-sm text-blinkit-muted">{products.length} items</span>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-10 h-10 text-blinkit-green animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <span className="text-6xl mb-4">🔍</span>
              <h3 className="text-lg font-bold text-blinkit-text">No products found</h3>
              <p className="text-blinkit-muted text-sm mt-1">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
