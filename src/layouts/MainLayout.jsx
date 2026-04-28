import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import useFavoritesStore from '../store/favoritesStore';
import './MainLayout.css';
import { useLocation, Outlet, Link } from 'react-router-dom'; // Обязательно добавь useLocation в импорты

export default function MainLayout() {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuthStore();
  const [isFooterOpen, setIsFooterOpen] = useState(false);

  // Проверяем, находится ли пользователь на главной странице
  const isHomePage = location.pathname === '/';

  return (
    <div className="layout">
      {/* Твоя шапка (header) здесь */}

      <main className="wb-main">
        <Outlet />
      </main>

      {/* ФУТЕР РЕНДЕРИТСЯ ТОЛЬКО ЕСЛИ ЭТО ГЛАВНАЯ СТРАНИЦА */}
      {isHomePage && (
        <footer className="wb-footer">
          {/* Центрированная кнопка развертывания */}
          <div className="container wb-footer-toggle-container">
            <button 
              className={`wb-footer-toggle-centered ${isFooterOpen ? 'is-open' : ''}`}
              onClick={() => setIsFooterOpen(!isFooterOpen)}
            >
              {isFooterOpen ? 'Скрыть' : 'Развернуть футер'}
              <span className="wb-footer-toggle-arrow">↓</span>
            </button>
          </div>

          {/* Скрытый контент футера */}
          <div className={`wb-footer__content ${isFooterOpen ? 'is-open' : ''}`}>
            <div className="container wb-footer__inner">
              <div className="wb-footer-col">
                <h5>Покупателям</h5>
                <ul>
                  <li><Link to="/">Как сделать заказ</Link></li>
                  <li><Link to="/">Способы оплаты</Link></li>
                  <li><Link to="/">Доставка</Link></li>
                  <li><Link to="/">Возврат товара</Link></li>
                </ul>
              </div>

              <div className="wb-footer-col">
                <h5>Партнерам</h5>
                <ul>
                  <li><Link to="/">Продавайте на Wildberries</Link></li>
                  <li><Link to="/">Перевозчикам</Link></li>
                  <li><Link to="/">Пункты выдачи</Link></li>
                </ul>
              </div>

              <div className="wb-footer-col">
                <h5>Компания</h5>
                <ul>
                  <li><Link to="/">О нас</Link></li>
                  <li><Link to="/">Реквизиты</Link></li>
                  <li><Link to="/">Пресс-служба</Link></li>
                  {isAuthenticated && (
                    <li><button className="wb-footer-logout" onClick={logout}>Выйти из системы</button></li>
                  )}
                </ul>
              </div>

              <div className="wb-footer-col">
                <h5>Мы в соцсетях</h5>
                <div className="social-links">
                  <span>VK</span> <span>TG</span> <span>OK</span>
                </div>
              </div>
            </div>
          </div>

          <div className="wb-footer-bottom">
            <div className="container">
              <p>© 2024-2026 Wildberries Clone. Все права защищены.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}