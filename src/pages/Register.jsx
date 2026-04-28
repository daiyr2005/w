import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' });
  const { register, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) { toast.error('Пароли не совпадают'); return; }
    const ok = await register(form);
    if (ok) {
      toast.success('Аккаунт создан! Войдите.');
      navigate('/login');
    }
  };

  const field = (key, label, type = 'text', placeholder = '') => (
    <div className="auth-field" key={key}>
      <label>{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        required
      />
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">WB</div>
        <h1 className="auth-title">Регистрация</h1>
        <p className="auth-sub">Создайте аккаунт</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {field('username', 'Логин', 'text', 'Придумайте логин')}
          {field('email', 'Email', 'email', 'example@mail.com')}
          {field('password', 'Пароль', 'password', 'Минимум 8 символов')}
          {field('password2', 'Повторите пароль', 'password', 'Повторите пароль')}

          {error && <p className="auth-error">
            {typeof error === 'string' ? error : JSON.stringify(error)}
          </p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Создаём...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="auth-switch">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
}
