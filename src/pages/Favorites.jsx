import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useFavoritesStore from '../store/favoritesStore';
import useAuthStore from '../store/authStore';
import ProductCard from '../components/product/ProductCard';
import './Favorites.css';

export default function Favorites() {
  const { favorites, fetchFavorites, loading } = useFavoritesStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) fetchFavorites();
  }, [isAuthenticated]);

  if (!isAuthenticated) return (
    <div className="container fav-empty">
      <p>🔒 Войдите, чтобы увидеть избранное</p>
      <Link to="/login" className="fav-login-btn">Войти</Link>
    </div>
  );

  if (loading) return <div className="container"><p>Загрузка...</p></div>;

  const products = favorites.map((f) => f.product).filter(Boolean);

  return (
    <div className="container">
      <h1 className="fav-title">Избранное <span>({products.length})</span></h1>
      {products.length === 0 ? (
        <div className="fav-empty">
          <p style={{ fontSize: '2.5rem' }}>❤️</p>
          <p>Список избранного пуст</p>
          <Link to="/products" className="fav-login-btn">Посмотреть товары</Link>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
