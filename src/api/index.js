import api from './axios';

// AUTH
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  getMe: () => api.get('/users/'),
};
// PRODUCTS
export const productAPI = {
  getAll: (params) => api.get('/products/', { params }),
  getById: (id) => api.get(`/products/${id}/`),
};

// CATEGORIES
export const categoryAPI = {
  getAll: () => api.get('/categories/'),
};

// CART
export const cartAPI = {
  getCart: () => api.get('/cart/'),
  getItems: () => api.get('/cart-items/'),
  addItem: (data) => api.post('/cart-items/', data),
  updateItem: (id, data) => api.patch(`/cart-items/${id}/`, data),
  deleteItem: (id) => api.delete(`/cart-items/${id}/`),
};

// FAVORITES
export const favoritesAPI = {
  getAll: () => api.get('/favorites/'),
  add: (data) => api.post('/favorites/', data),
  remove: (id) => api.delete(`/favorites/${id}/`),
};

// ORDERS
export const ordersAPI = {
  getAll: () => api.get('/orders/'),
  getById: (id) => api.get(`/orders/${id}/`),
  create: (data) => api.post('/orders/', data),
};

// ADDRESS
export const addressAPI = {
  getAll: () => api.get('/address/'),
  create: (data) => api.post('/address/', data),
  update: (id, data) => api.patch(`/address/${id}/`, data),
  delete: (id) => api.delete(`/address/${id}/`),
};

// REVIEWS
export const reviewAPI = {
  getByProduct: (productId) => api.get('/reviews/', { params: { product: productId } }),
  create: (data) => api.post('/reviews/', data),
};

// CHAT
export const chatAPI = {
  getChats: () => api.get('/chats/'),
  getMessages: (chatId) => api.get('/chat-messages/', { params: { chat: chatId } }),
  sendMessage: (data) => api.post('/chat-messages/', data),
  searchUserByEmail: (email) => api.get('/users/search/', { params: { email: email } }),
  createChat: (data) => api.post('/chats/', data), // data должна содержать ID найденного юзера
};

// NOTIFICATIONS
export const notificationsAPI = {
  getAll: () => api.get('/notifications/'),
  markRead: (id) => api.patch(`/notifications/${id}/`, { is_read: true }),
};

// PAYMENT
export const paymentAPI = {
  create: (data) => api.post('/payment/', data),
};
