# WB Clone — Wildberries Frontend

Полноценный фронтенд маркетплейса, собранный на **React + Vite**.

## 🚀 Стек

| Технология | Назначение |
|---|---|
| React 18 | UI |
| Vite | Сборка / dev server |
| React Router v6 | Маршрутизация |
| Zustand | Глобальный стейт |
| Axios | HTTP-запросы |
| react-hot-toast | Тосты / уведомления |

---

## 📁 Структура

```
src/
├── app/          # App.jsx — роутер + инициализация стора
├── api/          # axios.js + index.js (все endpoint-функции)
├── components/
│   ├── common/   # Button, Modal, Skeleton, Spinner, EmptyState
│   ├── product/  # ProductCard, ProductGrid
│   └── cart/     # CartPreview
├── hooks/        # useDebounce, useApi, usePagination, useLocalStorage
├── layouts/      # MainLayout (хедер + футер)
├── pages/        # Все страницы
├── store/        # authStore, cartStore, favoritesStore (Zustand)
├── styles/       # global.css (CSS переменные, базовые стили)
└── utils/        # formatPrice, formatDate, ORDER_STATUSES и др.
```

---

## ⚙️ Запуск

### 1. Установить зависимости
```bash
npm install
```

### 2. Настроить окружение
```bash
cp .env.example .env
# Отредактируй VITE_API_URL=http://localhost:8000/api
```

### 3. Запустить dev-сервер
```bash
npm run dev
# → http://localhost:3000
```

---

## 📄 Страницы

| Путь | Страница | Доступ |
|---|---|---|
| `/` | Главная | Все |
| `/products` | Каталог с фильтрами | Все |
| `/products/:id` | Карточка товара + отзывы | Все |
| `/login` | Вход | Гости |
| `/register` | Регистрация | Гости |
| `/cart` | Корзина | 🔒 |
| `/checkout` | Оформление заказа (3 шага) | 🔒 |
| `/orders` | Список заказов | 🔒 |
| `/orders/:id` | Детали заказа | 🔒 |
| `/favorites` | Избранное | 🔒 |
| `/chat` | Чат покупатель ↔ продавец | 🔒 |
| `/notifications` | Уведомления | 🔒 |
| `/profile` | Профиль + адреса | 🔒 |

---

## 🔌 Ожидаемые API endpoints

```
POST /api/register/
POST /api/login/              → { access, refresh }
GET  /api/users/me/
GET  /api/category/
GET  /api/product/            ?search= &category= &price_min= &price_max= &ordering= &page=
GET  /api/product/:id/
GET/POST   /api/cart-items/
PATCH/DEL  /api/cart-items/:id/
GET/POST   /api/favorites/
DELETE     /api/favorites/:id/
GET/POST   /api/orders/
GET        /api/orders/:id/
GET/POST   /api/address/
PATCH/DEL  /api/address/:id/
GET/POST   /api/review/
GET        /api/chat/
GET/POST   /api/chat-messages/
GET        /api/notifications/
PATCH      /api/notifications/:id/
```

---

## 🛠️ Продакшн сборка

```bash
npm run build   # → dist/
```
