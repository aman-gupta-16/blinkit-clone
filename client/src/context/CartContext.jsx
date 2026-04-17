import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCartItems([]); return; }
    try {
      setCartLoading(true);
      const { data } = await cartAPI.getCart();
      setCartItems(data.data || []);
    } catch {
      setCartItems([]);
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await cartAPI.addToCart({ productId, quantity });
      await fetchCart();
      toast.success('Added to cart! 🛒');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      await cartAPI.updateItem(cartItemId, { quantity });
      await fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await cartAPI.removeItem(cartItemId);
      await fetchCart();
      toast.success('Removed from cart');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove');
    }
  };

  const getItemQuantity = (productId) => {
    const item = cartItems.find((i) => i.productId?._id === productId);
    return item ? item.quantity : 0;
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoading,
        cartTotal,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        getItemQuantity,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
