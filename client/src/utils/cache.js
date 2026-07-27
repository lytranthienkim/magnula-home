const CACHE_PREFIX = 'magnula_cache_';
const CACHE_TTL_KEY_SUFFIX = '_ttl';
const DEFAULT_CACHE_TTL = 3600000;

export const setCache = (key, data, ttl = DEFAULT_CACHE_TTL) => {
  try {
    const cacheData = {
      value: data,
      timestamp: Date.now(),
    };

    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheData));
    localStorage.setItem(CACHE_PREFIX + key + CACHE_TTL_KEY_SUFFIX, ttl.toString());
  } catch (error) {
    console.warn('Cache set error:', error);
  }
};

export const getCache = (key) => {
  try {
    const cachedData = localStorage.getItem(CACHE_PREFIX + key);
    const ttl = parseInt(localStorage.getItem(CACHE_PREFIX + key + CACHE_TTL_KEY_SUFFIX) || DEFAULT_CACHE_TTL);

    if (!cachedData) {
      return null;
    }

    const { value, timestamp } = JSON.parse(cachedData);
    const isExpired = Date.now() - timestamp > ttl;

    if (isExpired) {
      removeCache(key);
      return null;
    }

    return value;
  } catch (error) {
    console.warn('Cache get error:', error);
    return null;
  }
};

export const removeCache = (key) => {
  try {
    localStorage.removeItem(CACHE_PREFIX + key);
    localStorage.removeItem(CACHE_PREFIX + key + CACHE_TTL_KEY_SUFFIX);
  } catch (error) {
    console.warn('Cache remove error:', error);
  }
};

export const clearCache = (pattern = null) => {
  try {
    if (pattern) {
      const regex = new RegExp(pattern);
      const keysToRemove = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_PREFIX) && regex.test(key)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
    } else {
      const keysToRemove = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_PREFIX)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
  } catch (error) {
    console.warn('Cache clear error:', error);
  }
};

export const generateCacheKey = (endpoint, queryParams = '') => {
  if (queryParams) {
    return `${endpoint}?${queryParams}`;
  }
  return endpoint;
};
