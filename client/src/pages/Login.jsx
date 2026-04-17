import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'login') {
        await login({ email: form.email, password: form.password });
      } else {
        if (!form.name.trim()) { setError('Name is required'); setLoading(false); return; }
        await register({ name: form.name, email: form.email, password: form.password });
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blinkit-yellow/20 via-white to-blinkit-green-light flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-blinkit-yellow rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl font-black text-blinkit-gray-dark">b</span>
          </div>
          <span className="text-3xl font-black text-blinkit-gray-dark">blinkit</span>
        </Link>

        <div className="card p-7">
          {/* Tabs */}
          <div className="flex bg-blinkit-gray rounded-xl p-1 mb-6">
            {['login', 'register'].map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                  ${tab === t ? 'bg-white text-blinkit-green shadow-card' : 'text-blinkit-muted'}`}
              >
                {t === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>

          <h2 className="text-xl font-bold text-blinkit-text mb-1">
            {tab === 'login' ? 'Welcome back! 👋' : 'Create account 🎉'}
          </h2>
          <p className="text-sm text-blinkit-muted mb-5">
            {tab === 'login'
              ? 'Login to access your cart and orders'
              : 'Get groceries delivered in 10 minutes'}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-blinkit-text mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="input-field"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-blinkit-text mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-blinkit-text mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="input-field pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blinkit-muted hover:text-blinkit-text"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base rounded-xl mt-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {tab === 'login' ? 'Logging in...' : 'Creating account...'}
                </>
              ) : tab === 'login' ? (
                'Login'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {tab === 'login' && (
            <p className="text-center text-xs text-blinkit-muted mt-4">
              Demo admin: <strong>admin@blinkit.com</strong> / <strong>admin123</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
