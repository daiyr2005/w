import { useEffect, useState } from 'react';
import { addressAPI } from '../api';
import useAuthStore from '../store/authStore';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Profile.css';

export default function Profile() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const [addresses, setAddresses] = useState([]);
  const [newAddr, setNewAddr] = useState({ city: '', street: '', house: '', apartment: '' });
  const [tab, setTab] = useState('profile');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    addressAPI.getAll().then((r) => setAddresses(r.data?.results || r.data || []));
  }, [isAuthenticated]);

  const handleAddAddr = async (e) => {
    e.preventDefault();
    if (!newAddr.city || !newAddr.street) { toast.error('Заполните обязательные поля'); return; }
    try {
      const { data } = await addressAPI.create({
        ...newAddr,
        full_address: `${newAddr.city}, ул. ${newAddr.street}, д. ${newAddr.house}${newAddr.apartment ? ', кв. ' + newAddr.apartment : ''}`,
      });
      setAddresses((a) => [...a, data]);
      setNewAddr({ city: '', street: '', house: '', apartment: '' });
      toast.success('Адрес добавлен');
    } catch {
      toast.error('Ошибка');
    }
  };

  const handleDeleteAddr = async (id) => {
    await addressAPI.delete(id);
    setAddresses((a) => a.filter((x) => x.id !== id));
    toast.success('Адрес удалён');
  };

  return (
    <div className="container profile-page">
      <div className="profile-sidebar">
        <div className="profile-avatar">
          {user?.username?.[0]?.toUpperCase() || 'U'}
        </div>
        <h2 className="profile-name">{user?.username || 'Пользователь'}</h2>
        <p className="profile-email">{user?.email}</p>

        <nav className="profile-nav">
          {[
            ['profile', '👤 Профиль'],
            ['addresses', '📍 Адреса'],
          ].map(([key, label]) => (
            <button
              key={key}
              className={`profile-nav__btn ${tab === key ? 'active' : ''}`}
              onClick={() => setTab(key)}
            >{label}</button>
          ))}
          <Link to="/orders" className="profile-nav__btn">📦 Мои заказы</Link>
          <Link to="/favorites" className="profile-nav__btn">❤️ Избранное</Link>
          <button className="profile-nav__btn profile-nav__btn--logout" onClick={() => { logout(); navigate('/'); }}>
            🚪 Выйти
          </button>
        </nav>
      </div>

      <div className="profile-content">
        {tab === 'profile' && (
          <div className="profile-card">
            <h2>Профиль</h2>
            <div className="profile-info">
              <div className="profile-info__row">
                <span>Логин</span>
                <strong>{user?.username}</strong>
              </div>
              <div className="profile-info__row">
                <span>Email</span>
                <strong>{user?.email || '—'}</strong>
              </div>
              <div className="profile-info__row">
                <span>Роль</span>
                <strong>{user?.role || 'Покупатель'}</strong>
              </div>
            </div>
          </div>
        )}

        {tab === 'addresses' && (
          <div className="profile-card">
            <h2>Мои адреса</h2>
            <div className="addr-list">
              {addresses.length === 0 ? (
                <p className="addr-empty">Нет сохранённых адресов</p>
              ) : (
                addresses.map((a) => (
                  <div key={a.id} className="addr-item">
                    <span>{a.full_address || `${a.city}, ${a.street}, ${a.house}`}</span>
                    <button className="addr-delete" onClick={() => handleDeleteAddr(a.id)}>✕</button>
                  </div>
                ))
              )}
            </div>

            <form className="addr-form" onSubmit={handleAddAddr}>
              <h3>Новый адрес</h3>
              <div className="addr-form__grid">
                {[['city', 'Город *'], ['street', 'Улица *'], ['house', 'Дом'], ['apartment', 'Квартира']].map(([f, l]) => (
                  <input
                    key={f}
                    placeholder={l}
                    value={newAddr[f]}
                    onChange={(e) => setNewAddr({ ...newAddr, [f]: e.target.value })}
                    className="checkout__input"
                  />
                ))}
              </div>
              <button type="submit" className="addr-add-btn">+ Добавить</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
