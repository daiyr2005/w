// Format price with ₽
export const formatPrice = (price, discount = 0) => {
  const final = discount ? Math.round(price * (1 - discount / 100)) : price;
  return `${Number(final).toLocaleString('ru-RU')} ₽`;
};

// Calculate discounted price
export const getDiscountedPrice = (price, discount) =>
  discount ? Math.round(price * (1 - discount / 100)) : price;

// Format date to Russian locale
export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

// Truncate text
export const truncate = (str, len = 80) =>
  str?.length > len ? str.slice(0, len) + '...' : str;

// Generate star rating string
export const stars = (rating) => '⭐'.repeat(Math.round(rating || 0));

// Normalize API list response (handles both array and paginated)
export const normalizeList = (data) => data?.results ?? (Array.isArray(data) ? data : []);

// Debounce function
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// Order status map
export const ORDER_STATUSES = {
  pending: { label: 'Ожидает оплаты', color: '#FF6900', icon: '⏳' },
  paid:    { label: 'Оплачен',         color: '#1DB854', icon: '✅' },
  shipped: { label: 'В пути',          color: '#2196F3', icon: '🚚' },
  delivered:{ label: 'Доставлен',      color: '#4CAF50', icon: '📦' },
  canceled: { label: 'Отменён',        color: '#E53935', icon: '❌' },
};
