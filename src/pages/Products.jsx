import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI, categoryAPI } from '../api';
import ProductCard from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import './Products.css';

function useDebounce(val, delay) {
  const [debounced, setDebounced] = useState(val);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(val), delay);
    return () => clearTimeout(t);
  }, [val, delay]);
  return debounced;
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  
  // Инициализация состояний из URL
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [priceMin, setPriceMin] = useState(searchParams.get('price_min') || '');
  const [priceMax, setPriceMax] = useState(searchParams.get('price_max') || '');
  const [ordering, setOrdering] = useState(searchParams.get('ordering') || '');

  const debouncedSearch = useDebounce(search, 400);
  const PAGE_SIZE = 20;

  // Загрузка категорий при монтировании
  useEffect(() => {
    categoryAPI.getAll().then((r) => {
      setCategories(r.data?.results || r.data || []);
    });
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, page_size: PAGE_SIZE };
      if (debouncedSearch) params.search = debouncedSearch;
      if (category) params.category = category; // Если бэкенд ждет category_id, замени на category_id
      if (priceMin) params.price_min = priceMin;
      if (priceMax) params.price_max = priceMax;
      if (ordering) params.ordering = ordering;

      const { data } = await productAPI.getAll(params);
      setProducts(data?.results || data || []);
      setTotal(data?.count || (data?.results || data || []).length);

      // Синхронизация URL с текущими фильтрами
      const sp = {};
      if (debouncedSearch) sp.search = debouncedSearch;
      if (category) sp.category = category;
      if (priceMin) sp.price_min = priceMin;
      if (priceMax) sp.price_max = priceMax;
      if (ordering) sp.ordering = ordering;
      if (page > 1) sp.page = page;
      setSearchParams(sp);
    } catch (e) {
      console.error("Ошибка при загрузке товаров:", e);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, priceMin, priceMax, ordering, page, setSearchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setPriceMin('');
    setPriceMax('');
    setOrdering('');
    setPage(1);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="products-page container">
      {/* SIDEBAR */}
      <aside className="products-sidebar">
        <div className="filter-block">
          <h3 className="filter-title">Категории</h3>
          <div className="filter-options">
            <label className={`filter-option ${category === '' ? 'active' : ''}`}>
              <input 
                type="radio" 
                name="cat" 
                value="" 
                checked={category === ''} 
                onChange={() => { setCategory(''); setPage(1); }} 
              />
              Все товары
            </label>
            {categories.map((c) => (
              <label key={c.id} className={`filter-option ${category === String(c.id) ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="cat" 
                  value={c.id} 
                  checked={category === String(c.id)} 
                  onChange={() => { setCategory(String(c.id)); setPage(1); }} 
                />
                {/* ЗАМЕНЕНО: c.category_name вместо c.name */}
                {c.category_name}
              </label>
            ))}
          </div>
        </div>

        <div className="filter-block">
          <h3 className="filter-title">Цена, ₽</h3>
          <div className="filter-price">
            <input 
              type="number" 
              value={priceMin} 
              onChange={(e) => { setPriceMin(e.target.value); setPage(1); }} 
              placeholder="От" 
              className="filter-price-input" 
            />
            <span>—</span>
            <input 
              type="number" 
              value={priceMax} 
              onChange={(e) => { setPriceMax(e.target.value); setPage(1); }} 
              placeholder="До" 
              className="filter-price-input" 
            />
          </div>
        </div>

        <button className="filter-clear-btn" onClick={clearFilters}>Сбросить фильтры</button>
      </aside>

      {/* MAIN CONTENT */}
      <div className="products-main">
        <div className="products-top">
          <div className="products-search">
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Поиск по названию..."
              className="products-search-input"
            />
          </div>
          <select
            value={ordering}
            onChange={(e) => { setOrdering(e.target.value); setPage(1); }}
            className="products-sort"
          >
            <option value="">По умолчанию</option>
            <option value="price">Сначала дешевле</option>
            <option value="-price">Сначала дороже</option>
            <option value="-rating">Высокий рейтинг</option>
            <option value="-created_at">Новинки</option>
          </select>
        </div>

        <p className="products-count">
          {loading ? 'Загрузка...' : `Найдено товаров: ${total}`}
        </p>

        <div className="products-grid">
          {loading
            ? Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.length === 0
              ? (
                <div className="empty-state">
                  <p>😕 Ничего не найдено</p>
                  <button onClick={clearFilters} className="link-btn">Сбросить все фильтры</button>
                </div>
              )
              : products.map((p) => <ProductCard key={p.id} product={p} />)
          }
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              disabled={page === 1} 
              onClick={() => setPage((p) => p - 1)} 
              className="page-btn"
            >
              ← Назад
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .map((p, i, arr) => (
                <span key={p} style={{ display: 'flex', alignItems: 'center' }}>
                  {i > 0 && arr[i - 1] !== p - 1 && <span className="page-dots">...</span>}
                  <button 
                    className={`page-btn ${p === page ? 'active' : ''}`} 
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                </span>
              ))}

            <button 
              disabled={page === totalPages} 
              onClick={() => setPage((p) => p + 1)} 
              className="page-btn"
            >
              Вперёд →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}