// Storage utilities
export const storage = {
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get: (key) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  remove: (key) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
  },
};

// Local cache with expiry
export const cache = {
  set: (key, value, expiryMinutes = 5) => {
    const now = new Date();
    const item = {
      value,
      expiry: now.getTime() + expiryMinutes * 60000,
    };
    localStorage.setItem(`cache_${key}`, JSON.stringify(item));
  },
  get: (key) => {
    const item = localStorage.getItem(`cache_${key}`);
    if (!item) return null;

    const cached = JSON.parse(item);
    if (new Date().getTime() > cached.expiry) {
      localStorage.removeItem(`cache_${key}`);
      return null;
    }
    return cached.value;
  },
  clear: (key) => {
    localStorage.removeItem(`cache_${key}`);
  },
};
