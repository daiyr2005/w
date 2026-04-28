import { create } from 'zustand';
import { authAPI } from '../api';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('access_token') || null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.login(credentials);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      const me = await authAPI.getMe();
      set({ token: data.access, user: me.data, isAuthenticated: true, loading: false });
      return true;
    } catch (e) {
      set({ error: e.response?.data?.detail || 'Ошибка входа', loading: false });
      return false;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      await authAPI.register(userData);
      set({ loading: false });
      return true;
    } catch (e) {
      set({ error: e.response?.data || 'Ошибка регистрации', loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchMe: async () => {
    try {
      const { data } = await authAPI.getMe();
      set({ user: data, isAuthenticated: true });
    } catch {
      set({ isAuthenticated: false });
    }
  },
}));

export default useAuthStore;
