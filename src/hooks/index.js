import { useState, useEffect, useCallback } from 'react';

// Debounce any value
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// Generic data fetching hook
export function useApi(apiFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFn(...args);
      setData(res.data?.results ?? res.data);
    } catch (e) {
      setError(e.response?.data?.detail || 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// Pagination hook
export function usePagination(initialPage = 1, pageSize = 20) {
  const [page, setPage] = useState(initialPage);
  const goNext = () => setPage((p) => p + 1);
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goTo = (p) => setPage(p);
  const reset = () => setPage(1);
  return { page, goNext, goPrev, goTo, reset, pageSize };
}

// Local storage hook
export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const set = (val) => {
    setValue(val);
    localStorage.setItem(key, JSON.stringify(val));
  };

  const remove = () => {
    setValue(defaultValue);
    localStorage.removeItem(key);
  };

  return [value, set, remove];
}
