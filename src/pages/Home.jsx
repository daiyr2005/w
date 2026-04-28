import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI, categoryAPI } from '../api';
import ProductCard from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import './Home.css';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [discounted, setDiscounted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          categoryAPI.getAll(),
          productAPI.getAll({ page_size: 12 }),
        ]);
        setCategories(catRes.data?.results || catRes.data || []);
        const allProducts = prodRes.data?.results || prodRes.data || [];
        setProducts(allProducts.slice(0, 8));
        setDiscounted(allProducts.filter((p) => p.discount > 0).slice(0, 8));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [])


  console.log(categories.map(cat => cat));
  


  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="container hero__inner">
          <h1 className="hero__title">Всё что нужно —<br />здесь и сейчас</h1>
          <p className="hero__sub">Миллионы товаров с быстрой доставкой</p>
          <form className="hero__search" onSubmit={handleSearch}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Искать товары..."
              className="hero__search-input"
            />
            <button type="submit" className="hero__search-btn">Найти</button>
          </form>
        </div>
      </section>

      <div className="container">
        {/* CATEGORIES */}

        
        <section className="section">
          <h2 className="section__title">Категории</h2>
        {loading ? (
  <div>loading...</div>
) : (
  <div className="categories-grid">
    {categories.map((cat) => (
      <Link key={cat.id} to={`/products?category=${cat.id}`} className="category-card">
        
        {cat.category_image && (
          <img src={cat.category_image} alt={cat.category_name} className="category-card__img" />
        )}
      
        <span className="category-card__name">{cat.category_name}</span>
      </Link>
    ))}
  </div>
)}


         
        </section>

        {/* DISCOUNTS */}
        {(loading || discounted.length > 0) && (
          <section className="section">
            <div className="section__header">
              <h2 className="section__title">🔥 Акции и скидки</h2>
              <Link to="/products?discounted=true" className="section__link">Все акции →</Link>
            </div>
            <div className="products-grid">
              {loading
                ? Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
                : discounted.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* POPULAR */}
        <section className="section">
          <div className="section__header">
            <h2 className="section__title">Популярное</h2>
            <Link to="/products" className="section__link">Все товары →</Link>
          </div>
          <div className="products-grid">
            {loading
              ? Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
              : products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </div>
    </div>
  );
}


<div className="hero-section">
  <div className="hero-container container">
    
    {/* ЛЕВАЯ ЧАСТЬ: Поисковые блоки */}
    <div className="hero-search-area">
      <div className="search-box">
        <h3>Быстрый поиск</h3>
        <input type="text" placeholder="Что вы ищете?..." className="hero-input" />
        <button className="hero-btn">Найти</button>
      </div>
      
      <div className="search-box second-search">
        <h3>Поиск по VIN / Авто</h3>
        <input type="text" placeholder="Введите номер детали..." className="hero-input" />
        <button className="hero-btn secondary">Поиск</button>
      </div>
    </div>

    {/* ПРАВАЯ ЧАСТЬ: Реклама / Картинка */}
    <div className="hero-promo-area">
      <div className="promo-banner">
        <img src="/path-to-your-ad.jpg" alt="Реклама" />
        <div className="promo-text">
          <h4>Скидка на запчасти -20%</h4>
          <span>Только до конца недели!</span>
        </div>
      </div>
    </div>

        {/* --- ФУТЕР --- */}
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

  </div>
</div>