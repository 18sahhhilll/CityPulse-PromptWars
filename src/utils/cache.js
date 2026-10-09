const memoryCache = new Map();

export const getCachedData = (key) => {
  if (memoryCache.has(key)) {
    const memItem = memoryCache.get(key);
    if (Date.now() < memItem.expiry) return memItem.data;
    memoryCache.delete(key);
  }

  try {
    const stored = localStorage.getItem(`cp_cache_${key}`);
    if (stored) {
      const { data, expiry } = JSON.parse(stored);
      if (Date.now() < expiry) {
        memoryCache.set(key, { data, expiry });
        return data;
      }
      localStorage.removeItem(`cp_cache_${key}`);
    }
  } catch (err) {
    console.warn('LocalStorage read cache error:', err);
  }

  return null;
};

export const setCachedData = (key, data, ttlMs = 30 * 60 * 1000) => {
  const expiry = Date.now() + ttlMs;
  memoryCache.set(key, { data, expiry });

  try {
    localStorage.setItem(`cp_cache_${key}`, JSON.stringify({ data, expiry }));
  } catch (err) {
    console.warn('LocalStorage write cache error:', err);
  }
};
