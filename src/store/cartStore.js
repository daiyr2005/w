import { create } from 'zustand';
import { cartAPI } from '../api';

const useCartStore = create((set, get) => ({
  items: [],
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const { data } = await cartAPI.getItems();
      set({ items: data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  addItem: async (productId, quantity = 1) => {
    try {
      const { data } = await cartAPI.addItem({ product: productId, quantity });
      set((s) => ({ items: [...s.items, data] }));
    } catch (e) {
      console.error(e);
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      const { data } = await cartAPI.updateItem(itemId, { quantity });
      set((s) => ({
        items: s.items.map((i) => (i.id === itemId ? data : i)),
      }));
    } catch (e) {
      console.error(e);
    }
  },

  removeItem: async (itemId) => {
    try {
      await cartAPI.deleteItem(itemId);
      set((s) => ({ items: s.items.filter((i) => i.id !== itemId) }));
    } catch (e) {
      console.error(e);
    }
  },

  get totalPrice() {
    return get().items.reduce((acc, item) => {
      const price = item.product?.price || 0;
      const discount = item.product?.discount || 0;
      const final = price * (1 - discount / 100);
      return acc + final * item.quantity;
    }, 0);
  },

  get totalCount() {
    return get().items.reduce((acc, item) => acc + item.quantity, 0);
  },
}));

export default useCartStore;
