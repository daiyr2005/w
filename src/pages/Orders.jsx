import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ordersAPI } from '../api';
import useAuthStore from '../store/authStore';
import './Orders.css';

const STATUS_LABELS = {
  pending: { label: 'Ожидает оплаты', color: '#FF6900' },
  paid: { label: 'Оплачен', color: '#1DB854' },
  shipped: { label: 'В пути', color: '#2196F3' },
  delivered: { label: 'Доставлен', color: '#4CAF50' },
  canceled: { label: 'Отменён', color: '#E53935' },
};

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;
    ordersAPI.getAll()
      .then((r) => setOrders(r.data?.results || r.data || []))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) return (
    <div className="container orders-empty">
      <p>🔒 Войдите, чтобы увидеть заказы</p>
      <Link to="/login" className="orders-login-btn">Войти</Link>
    </div>
  );

  if (loading) return <div className="container"><p>Загрузка...</p></div>;

  if (orders.length === 0) return (
    <div className="container orders-empty">
      <p style={{ fontSize: '2.5rem' }}>📦</p>
      <p>У вас пока нет заказов</p>
      <Link to="/products" className="orders-login-btn">Начать покупки</Link>
    </div>
  );

  return (
    <div className="container">
      <h1 className="orders-title">Мои заказы</h1>
      <div className="orders-list">
        {orders.map((order) => {
          const st = STATUS_LABELS[order.status] || { label: order.status, color: '#999' };
          return (
            <Link key={order.id} to={`/orders/${order.id}`} className="order-card">
              <div className="order-card__header">
                <span className="order-card__id">Заказ №{order.id}</span>
                <span className="order-card__status" style={{ color: st.color }}>● {st.label}</span>
              </div>
              <div className="order-card__meta">
                <span>{new Date(order.created_at).toLocaleDateString('ru-RU')}</span>
                <span className="order-card__price">{Number(order.total_price || 0).toLocaleString()} ₽</span>
              </div>
              {order.items?.length > 0 && (
                <div className="order-card__items">
                  {order.items.slice(0, 3).map((item) => (
                    <img key={item.id} src={item.product?.image || '/placeholder.png'} alt={item.product?.name} className="order-card__img" />
                  ))}
                  {order.items.length > 3 && <span className="order-card__more">+{order.items.length - 3}</span>}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersAPI.getById(id)
      .then((r) => setOrder(r.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container"><p>Загрузка...</p></div>;
  if (!order) return <div className="container"><p>Заказ не найден</p></div>;

  const st = STATUS_LABELS[order.status] || { label: order.status, color: '#999' };

  return (
    <div className="container order-detail">
      <div className="order-detail__header">
        <Link to="/orders" className="order-detail__back">← Все заказы</Link>
        <h1 className="order-detail__title">Заказ №{order.id}</h1>
        <span className="order-detail__status" style={{ color: st.color }}>● {st.label}</span>
      </div>

      <div className="order-detail__layout">
        <div className="order-detail__main">
          <div className="order-detail__section">
            <h3>Товары</h3>
            {(order.items || []).map((item) => (
              <div key={item.id} className="order-detail__item">
                <img src={item.product?.image || '/placeholder.png'} alt={item.product?.name} />
                <div>
                  <p className="order-detail__item-name">{item.product?.name}</p>
                  <p className="order-detail__item-qty">Количество: {item.quantity}</p>
                </div>
                <span className="order-detail__item-price">
                  {(Math.round((item.product?.price || 0) * (1 - (item.product?.discount || 0) / 100)) * item.quantity).toLocaleString()} ₽
                </span>
              </div>
            ))}
          </div>

          {order.address && (
            <div className="order-detail__section">
              <h3>Адрес доставки</h3>
              <p className="order-detail__addr">{order.address?.full_address || order.address}</p>
            </div>
          )}
        </div>

        <div className="order-detail__sidebar">
          <h3>Информация</h3>
          <div className="order-detail__info-rows">
            <div className="order-detail__info-row">
              <span>Дата заказа</span>
              <span>{new Date(order.created_at).toLocaleDateString('ru-RU')}</span>
            </div>
            <div className="order-detail__info-row">
              <span>Статус</span>
              <span style={{ color: st.color }}>{st.label}</span>
            </div>
            <div className="order-detail__info-row">
              <span>Доставка</span>
              <span>{order.delivery_type || '—'}</span>
            </div>
          </div>
          <div className="order-detail__total">
            <span>Итого</span>
            <span>{Number(order.total_price || 0).toLocaleString()} ₽</span>
          </div>
        </div>
      </div>
    </div>
  );
}
