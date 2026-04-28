import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productAPI, reviewAPI } from '../api';
import useCartStore from '../store/cartStore';
import useFavoritesStore from '../store/favoritesStore';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const { addItem } = useCartStore();
  const { toggle, isFavorite } = useFavoritesStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [prodRes, revRes] = await Promise.all([
          productAPI.getById(id),
          reviewAPI.getByProduct(id),
        ]);
        setProduct(prodRes.data);
        setReviews(revRes.data?.results || revRes.data || []);
      } catch {
        toast.error('Товар не найден');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error('Войдите в аккаунт'); return; }
    await addItem(product.id, qty);
    toast.success(`Добавлено в корзину (${qty} шт.)`);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Войдите, чтобы оставить отзыв'); return; }
    setSubmitting(true);
    try {
      const { data } = await reviewAPI.create({ product: id, rating: reviewRating, comment: reviewText });
      setReviews((r) => [data, ...r]);
      setReviewText('');
      setReviewRating(5);
      toast.success('Отзыв добавлен!');
    } catch {
      toast.error('Ошибка при отправке отзыва');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="container detail-skeleton">
      <div className="skeleton" style={{ width: '45%', aspectRatio: '1', borderRadius: '16px' }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ height: '32px', marginBottom: '16px' }} />
        <div className="skeleton" style={{ height: '20px', width: '60%', marginBottom: '24px' }} />
        <div className="skeleton" style={{ height: '48px', width: '40%', marginBottom: '16px' }} />
        <div className="skeleton" style={{ height: '48px', borderRadius: '12px' }} />
      </div>
    </div>
  );

  if (!product) return <div className="container"><p>Товар не найден</p></div>;

  const images = product.images?.length ? product.images : [{ image: product.image }];
  const discountedPrice = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : null;
  const fav = isFavorite(product.id);
  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : product.rating;

  return (
    <div className="container">
      <div className="detail">
        {/* IMAGES */}
        <div className="detail__gallery">
          <div className="detail__main-img">
            <img src={images[activeImg]?.image || '/placeholder.png'} alt={product.name} />
            {product.discount > 0 && <span className="detail__badge">-{product.discount}%</span>}
          </div>
          {images.length > 1 && (
            <div className="detail__thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`detail__thumb ${i === activeImg ? 'active' : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img.image} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="detail__info">
          <h1 className="detail__name">{product.name}</h1>
          {avgRating && (
            <div className="detail__rating">
              {'⭐'.repeat(Math.round(avgRating))} {avgRating} ({reviews.length} отзывов)
            </div>
          )}

          <div className="detail__prices">
            <span className="detail__price">
              {discountedPrice ? discountedPrice.toLocaleString() : Number(product.price).toLocaleString()} ₽
            </span>
            {discountedPrice && (
              <span className="detail__old-price">{Number(product.price).toLocaleString()} ₽</span>
            )}
          </div>

          {product.description && (
            <p className="detail__desc">{product.description}</p>
          )}

          {product.seller && (
            <p className="detail__seller">Продавец: <strong>{product.seller?.username || product.seller}</strong></p>
          )}

          <div className="detail__qty">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} className="qty-btn">−</button>
            <span className="qty-val">{qty}</span>
            <button onClick={() => setQty(q => q + 1)} className="qty-btn">+</button>
          </div>

          <div className="detail__actions">
            <button className="detail__cart-btn" onClick={handleAddToCart}>
              🛒 В корзину
            </button>
            <button
              className={`detail__fav-btn ${fav ? 'active' : ''}`}
              onClick={() => {
                if (!isAuthenticated) { toast.error('Войдите в аккаунт'); return; }
                toggle(product.id);
              }}
            >
              {fav ? '❤️' : '🤍'}
            </button>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <section className="reviews">
        <h2 className="reviews__title">Отзывы</h2>

        {isAuthenticated && (
          <form className="review-form" onSubmit={handleReview}>
            <div className="review-form__stars">
              {[1,2,3,4,5].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`star-btn ${s <= reviewRating ? 'active' : ''}`}
                  onClick={() => setReviewRating(s)}
                >★</button>
              ))}
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Ваш отзыв..."
              className="review-form__text"
              rows={3}
              required
            />
            <button type="submit" disabled={submitting} className="review-form__submit">
              {submitting ? 'Отправка...' : 'Отправить отзыв'}
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="reviews__empty">Пока нет отзывов. Будьте первым!</p>
        ) : (
          <div className="reviews__list">
            {reviews.map((r) => (
              <div key={r.id} className="review-item">
                <div className="review-item__header">
                  <span className="review-item__author">{r.user?.username || 'Покупатель'}</span>
                  <span className="review-item__stars">{'⭐'.repeat(r.rating)}</span>
                </div>
                <p className="review-item__text">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
