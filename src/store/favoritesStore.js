import { create } from 'zustand';
import { favoritesAPI } from '../api';

const useFavoritesStore = create((set, get) => ({
  favorites: [],
  loading: false,

  fetchFavorites: async () => {
    set({ loading: true });
    try {
      const { data } = await favoritesAPI.getAll();
      set({ favorites: data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  toggle: async (productId) => {
    const existing = get().favorites.find((f) => f.product?.id === productId || f.product === productId);
    if (existing) {
      await favoritesAPI.remove(existing.id);
      set((s) => ({ favorites: s.favorites.filter((f) => f.id !== existing.id) }));
    } else {
      const { data } = await favoritesAPI.add({ product: productId });
      set((s) => ({ favorites: [...s.favorites, data] }));
    }
  },

  isFavorite: (productId) => {
    return get().favorites.some((f) => f.product?.id === productId || f.product === productId);
  },
}));

export default useFavoritesStore;
