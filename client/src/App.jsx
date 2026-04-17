import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import AdminProducts from './pages/AdminProducts';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';

const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

const AppLayout = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <Navbar onSearch={setSearchQuery} />
      <main className="min-h-screen bg-blinkit-gray">
        <Routes>
          <Route path="/" element={<Home searchQuery={searchQuery} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/orders" element={<Orders />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminProducts />
              </ProtectedAdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2500,
          style: { background: '#282c3f', color: '#fff', fontFamily: 'Poppins, sans-serif', borderRadius: '12px', fontSize: '13px' },
          success: { iconTheme: { primary: '#0C831F', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
