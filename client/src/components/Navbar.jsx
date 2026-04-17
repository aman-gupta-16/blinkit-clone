import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Search, MapPin, ChevronDown, Package, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const Navbar = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const { cartCount, cartTotal } = useCart();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e) => {
    setSearchVal(e.target.value);
    onSearch?.(e.target.value);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 shrink-0">
          <div className="w-9 h-9 bg-blinkit-yellow rounded-xl flex items-center justify-center">
            <span className="text-xl font-black text-blinkit-gray-dark">b</span>
          </div>
          <span className="text-xl font-black text-blinkit-gray-dark hidden sm:block">blinkit</span>
        </Link>

        {/* Delivery location */}
        <div className="hidden md:flex items-center gap-1 cursor-pointer group shrink-0">
          <MapPin size={16} className="text-blinkit-green" />
          <div className="flex flex-col leading-none">
            <span className="text-[11px] text-blinkit-muted font-medium">Delivery in</span>
            <div className="flex items-center gap-0.5">
              <span className="text-sm font-bold text-blinkit-gray-dark">10 mins</span>
              <ChevronDown size={14} className="text-blinkit-gray-dark" />
            </div>
          </div>
          <div className="w-px h-8 bg-gray-200 mx-2" />
          <div className="flex flex-col leading-none">
            <span className="text-[11px] text-blinkit-muted font-medium">Home</span>
            <span className="text-sm font-semibold text-blinkit-gray-dark truncate max-w-[120px]">
              Baltana, Zirakpur
            </span>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex-1 relative max-w-xl">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-blinkit-muted"
          />
          <input
            type="text"
            value={searchVal}
            onChange={handleSearch}
            placeholder='Search "milk"'
            className="w-full pl-10 pr-4 py-2.5 bg-blinkit-gray rounded-xl text-sm text-blinkit-text
              placeholder-blinkit-muted focus:outline-none focus:ring-2 focus:ring-blinkit-green
              transition-all duration-200 border border-transparent focus:border-blinkit-green focus:bg-white"
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          {/* Login / User */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blinkit-gray transition-colors"
              >
                <div className="w-8 h-8 bg-blinkit-green rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm uppercase">
                    {user.name?.[0]}
                  </span>
                </div>
                <span className="hidden sm:block text-sm font-semibold text-blinkit-text max-w-[80px] truncate">
                  {user.name}
                </span>
                <ChevronDown size={14} className="text-blinkit-muted" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-blinkit-text text-sm">{user.name}</p>
                    <p className="text-xs text-blinkit-muted">{user.email}</p>
                    {user.role === 'admin' && (
                      <span className="inline-block mt-1 bg-blinkit-yellow text-blinkit-gray-dark text-xs font-bold px-2 py-0.5 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  {/* My Orders link - visible to all logged-in users */}
                  <Link
                    to="/orders"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-4 py-3 hover:bg-blinkit-gray text-sm text-blinkit-text transition-colors"
                  >
                    <ShoppingBag size={16} className="text-blinkit-green" />
                    My Orders
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-blinkit-gray text-sm text-blinkit-text transition-colors"
                    >
                      <Package size={16} className="text-blinkit-green" />
                      Manage Products
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-3 hover:bg-red-50 text-sm text-red-500 transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-blinkit-gray transition-colors"
            >
              <User size={18} className="text-blinkit-green" />
              <span className="text-sm font-semibold text-blinkit-text hidden sm:block">Login</span>
            </Link>
          )}

          {/* Cart button */}
          <Link
            to="/cart"
            className="flex items-center gap-2 bg-blinkit-green text-white px-4 py-2.5 rounded-xl
              hover:bg-blinkit-green-dark transition-colors relative group"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-blinkit-yellow text-blinkit-gray-dark
                text-xs font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce-in">
                {cartCount}
              </span>
            )}
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-[10px] font-medium opacity-80">
                {cartCount === 0 ? 'My Cart' : `${cartCount} item${cartCount > 1 ? 's' : ''}`}
              </span>
              {cartTotal > 0 && (
                <span className="text-xs font-bold">₹{cartTotal.toFixed(0)}</span>
              )}
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
