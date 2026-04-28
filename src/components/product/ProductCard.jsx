import React from 'react';
import { Link } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import useFavoritesStore from '../../store/favoritesStore';
import toast from 'react-hot-toast';
import './ProductCard.css';

const API_URL = 'http://localhost:8000';

const getImageUrl = (img) => {
  if (!img) return '/no-photo.png'; 
  if (img.startsWith('http')) return img;
  const cleanPath = img.replace(/^\/?media\//, '').replace(/^\//, '');
  return `${API_URL}/media/${cleanPath}`;
};

export default function ProductCard({ product }) {
  const { addItem } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  const name = product.product_name; 
  const currentPrice = product.discount_price || product.price;
  const oldPrice = product.discount_price ? product.price : null;
  
  // Расчет процента скидки
  const discountPercent = oldPrice 
    ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100) 
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault(); // Чтобы не переходить по ссылке карточки
    addItem(product);
    toast.success('Добавлено в корзину');
  };

  return (
    <div className="product-card-wrapper">
      <Link to={`/products/${product.id}`} className="product-card">
        <div className="product-card__img-wrap">
          <img
            src={getImageUrl(product.image)}
            alt={name}
            className="product-card__img"
            onError={(e) => { e.target.src = '/no-photo.png'; }}
          />
          {discountPercent && (
            <span className="product-card__badge">-{discountPercent}%</span>
          )}
          <button 
            className={`product-card__fav ${isFavorite(product.id) ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(product);
            }}
          >
            ❤️
          </button>
        </div>

        <div className="product-card__body">
          <div className="product-card__prices">
            <span className="product-card__price">
              {Number(currentPrice).toLocaleString()} сом
            </span>
            {oldPrice && (
              <span className="product-card__old-price">
                {Number(oldPrice).toLocaleString()} сом
              </span>
            )}
          </div>
          
          <p className="product-card__name">
            <span className="product-card__brand">Бренд</span> / {name}
          </p>

          <div className="product-card__rating">
            <span className="star">⭐</span> 5.0 • 12 отзывов
          </div>
        </div>
      </Link>
      
      {/* Кнопка "В корзину", которая появляется при наведении */}
      <button className="product-card__add-btn" onClick={handleAddToCart}>
        В корзину
      </button>
    </div>
  );
}