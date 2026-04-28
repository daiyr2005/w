import React from 'react';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from '../common/Skeleton';
import EmptyState from '../common/EmptyState';
import './ProductGrid.css';

/**
 * Улучшенная сетка товаров
 * @param {Array} products - массив товаров
 * @param {Boolean} loading - состояние загрузки
 * @param {Number} skeletonCount - количество скелетонов
 */
export default function ProductGrid({ products = [], loading = false, skeletonCount = 8 }) {
  
  // 1. Состояние загрузки (Skeletons)
  if (loading) {
    return (
      <div className="product-grid" aria-label="Загрузка товаров">
        {[...Array(skeletonCount)].map((_, i) => (
          <ProductCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  // 2. Состояние, когда товаров нет
  if (!products || products.length === 0) {
    return (
      <div className="product-grid__empty">
        <EmptyState
          icon="😕"
          title="Товары не найдены"
          subtitle="Попробуйте изменить параметры поиска или фильтры"
          actionLabel="Сбросить все фильтры"
          actionTo="/products"
        />
      </div>
    );
  }

  // 3. Основная сетка товаров
  return (
    <section className="product-grid-container">
      {/* Полезно выводить количество найденных товаров */}
      <div className="product-grid__meta">
        Найдено: <b>{products.length}</b>
      </div>
      
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}