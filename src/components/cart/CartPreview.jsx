import { Link } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import './CartPreview.css';

export default function CartPreview({ onClose }) {
  const { items, removeItem } = useCartStore();

  const total = items.reduce((acc, item) => {
    const price = item.product?.price || 0;
    const disc = item.product?.discount || 0;
    return acc + Math.round(price * (1 - disc / 100)) * item.quantity;
  }, 0);

  if (items.length === 0) {
    return (
      <div className="cart-preview">
        <p className="cart-preview__empty">Корзина пуста</p>
      </div>
    );
  }

  return (
    <div className="cart-preview">
      <div className="cart-preview__items">
        {items.slice(0, 4).map((item) => (
          <div key={item.id} className="cart-preview__item">
            <img
              src={item.product?.image || '/placeholder.png'}
              alt={item.product?.name}
              className="cart-preview__img"
            />
            <div className="cart-preview__info">
              <span className="cart-preview__name">{item.product?.name}</span>
              <span className="cart-preview__qty">× {item.quantity}</span>
            </div>
            <button
              className="cart-preview__remove"
              onClick={() => removeItem(item.id)}
            >✕</button>
          </div>
        ))}
        {items.length > 4 && (
          <p className="cart-preview__more">+ ещё {items.length - 4} товаров</p>
        )}
      </div>
      <div className="cart-preview__footer">
        <span className="cart-preview__total">{total.toLocaleString()} ₽</span>
        <Link to="/cart" className="cart-preview__btn" onClick={onClose}>
          Перейти в корзину
        </Link>
      </div>
    </div>
  );
}
