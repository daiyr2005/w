import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import './Cart.css';

export default function Cart() {
  const { items, fetchCart, updateQuantity, removeItem, loading } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated]);

  const totalPrice = items.reduce((acc, item) => {
    const price = item.product?.price || 0;
    const discount = item.product?.discount || 0;
    const final = price * (1 - discount / 100);
    return acc + final * item.quantity;
  }, 0);

  const totalOld = items.reduce((acc, item) => {
    return acc + (item.product?.price || 0) * item.quantity;
  }, 0);

  const totalDiscount = totalOld - totalPrice;

  if (!isAuthenticated) return (
    <div className="container cart-empty">
      <p>🔒 Войдите, чтобы увидеть корзину</p>
      <Link to="/login" className="cart-login-btn">Войти</Link>
    </div>
  );

  if (loading) return <div className="container"><p>Загрузка...</p></div>;

  if (items.length === 0) return (
    <div className="container cart-empty">
      <p style={{ fontSize: '3rem' }}>🛒</p>
      <p>Корзина пуста</p>
      <Link to="/products" className="cart-login-btn">Перейти к товарам</Link>
    </div>
  );

  return (
    <div className="container cart-page">
      <h1 className="cart-title">Корзина <span>({items.length})</span></h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => {
            const price = item.product?.price || 0;
            const discount = item.product?.discount || 0;
            const finalPrice = Math.round(price * (1 - discount / 100));

            return (
              <div key={item.id} className="cart-item">
                <Link to={`/products/${item.product?.id}`} className="cart-item__img-wrap">
                  <img src={item.product?.image || '/placeholder.png'} alt={item.product?.name} />
                </Link>

                <div className="cart-item__info">
                  <Link to={`/products/${item.product?.id}`} className="cart-item__name">
                    {item.product?.name}
                  </Link>
                  {item.product?.seller && (
                    <p className="cart-item__seller">Продавец: {item.product.seller?.username || item.product.seller}</p>
                  )}
                  <div className="cart-item__prices">
                    <span className="cart-item__price">{finalPrice.toLocaleString()} ₽</span>
                    {discount > 0 && <span className="cart-item__old">{Number(price).toLocaleString()} ₽</span>}
                  </div>
                </div>

                <div className="cart-item__controls">
                  <div className="cart-item__qty">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >−</button>
                    <span className="qty-val">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <span className="cart-item__total">{(finalPrice * item.quantity).toLocaleString()} ₽</span>
                  <button
                    className="cart-item__remove"
                    onClick={async () => { await removeItem(item.id); toast.success('Удалено из корзины'); }}
                  >✕</button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <h2 className="cart-summary__title">Итого</h2>
          <div className="cart-summary__rows">
            <div className="cart-summary__row">
              <span>Товары ({items.length})</span>
              <span>{Math.round(totalOld).toLocaleString()} ₽</span>
            </div>
            {totalDiscount > 0 && (
              <div className="cart-summary__row cart-summary__row--discount">
                <span>Скидка</span>
                <span>−{Math.round(totalDiscount).toLocaleString()} ₽</span>
              </div>
            )}
          </div>
          <div className="cart-summary__total">
            <span>К оплате</span>
            <span>{Math.round(totalPrice).toLocaleString()} ₽</span>
          </div>
          <button
            className="cart-summary__btn"
            onClick={() => navigate('/checkout')}
          >
            Оформить заказ →
          </button>
        </div>
      </div>
    </div>
  );
}
