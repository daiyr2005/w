import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import useFavoritesStore from '../store/favoritesStore';

// Pages
import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import { Orders, OrderDetail } from '../pages/Orders';
import Favorites from '../pages/Favorites';
import Chat from '../pages/Chat';
import Notifications from '../pages/Notifications';
import Profile from '../pages/Profile';
import Login from '../pages/Login';
import Register from '../pages/Register';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { fetchMe, isAuthenticated } = useAuthStore();
  const { fetchCart } = useCartStore();
  const { fetchFavorites } = useFavoritesStore();

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      fetchMe();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchFavorites();
    }
  }, [isAuthenticated]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.9rem',
            borderRadius: '10px',
          },
          success: { iconTheme: { primary: '#1DB854', secondary: '#fff' } },
          error: { iconTheme: { primary: '#E53935', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          <Route path="cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
          <Route path="orders/:id" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
          <Route path="favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
          <Route path="chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
          <Route path="notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
          <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#999' }}>
              <p style={{ fontSize: '3rem' }}>404</p>
              <p>Страница не найдена</p>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
