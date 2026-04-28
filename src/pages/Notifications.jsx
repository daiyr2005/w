import { useEffect, useState } from 'react';
import { notificationsAPI } from '../api';
import useAuthStore from '../store/authStore';
import { Link } from 'react-router-dom';
import './Notifications.css';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;
    notificationsAPI.getAll()
      .then((r) => setNotifications(r.data?.results || r.data || []))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const markRead = async (id) => {
    await notificationsAPI.markRead(id);
    setNotifications((n) => n.map((item) => item.id === id ? { ...item, is_read: true } : item));
  };

  if (!isAuthenticated) return (
    <div className="container notif-empty">
      <p>🔒 Войдите, чтобы увидеть уведомления</p>
      <Link to="/login" className="notif-btn">Войти</Link>
    </div>
  );

  return (
    <div className="container">
      <h1 className="notif-title">Уведомления</h1>
      {loading ? (
        <p>Загрузка...</p>
      ) : notifications.length === 0 ? (
        <div className="notif-empty"><p style={{ fontSize: '2.5rem' }}>🔔</p><p>Уведомлений пока нет</p></div>
      ) : (
        <div className="notif-list">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`notif-item ${!n.is_read ? 'unread' : ''}`}
              onClick={() => !n.is_read && markRead(n.id)}
            >
              <div className="notif-item__icon">
                {n.type === 'order' ? '📦' : n.type === 'message' ? '💬' : '🔔'}
              </div>
              <div className="notif-item__body">
                <p className="notif-item__text">{n.message || n.text}</p>
                <span className="notif-item__time">
                  {new Date(n.created_at).toLocaleString('ru-RU')}
                </span>
              </div>
              {!n.is_read && <span className="notif-item__dot" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
