import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('blinkit_token');
    const savedUser = localStorage.getItem('blinkit_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const register = async ({ name, email, password }) => {
    const { data } = await authAPI.register({ name, email, password });
    const userData = data.data;
    localStorage.setItem('blinkit_token', userData.token);
    localStorage.setItem('blinkit_user', JSON.stringify(userData));
    setUser(userData);
    toast.success('Account created! Welcome to Blinkit 🎉');
    return userData;
  };

  const login = async ({ email, password }) => {
    const { data } = await authAPI.login({ email, password });
    const userData = data.data;
    localStorage.setItem('blinkit_token', userData.token);
    localStorage.setItem('blinkit_user', JSON.stringify(userData));
    setUser(userData);
    toast.success(`Welcome back, ${userData.name}! 👋`);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('blinkit_token');
    localStorage.removeItem('blinkit_user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
