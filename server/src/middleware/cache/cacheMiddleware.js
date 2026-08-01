import redisClient from '../../config/redis.js';

const DEFAULT_CACHE_TTL = 3600;

const generateCacheKey = (req) => {
  return `cache:${req.originalUrl || req.url}`;
};

export const cacheMiddleware = (ttl = DEFAULT_CACHE_TTL) => {
  return async (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    if (!redisClient.isOpen) {
      return next();
    }

    const cacheKey = generateCacheKey(req);

    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        res.set('X-Cache', 'HIT');
        return res.json(JSON.parse(cachedData));
      }
      res.set('X-Cache', 'MISS');
    } catch (error) {
    }

    const originalJson = res.json.bind(res);
    res.json = function (data) {
      if (redisClient.isOpen) {
        try {
          redisClient.setEx(cacheKey, ttl, JSON.stringify(data)).catch(() => {
          });
        } catch (error) {
        }
      }

      return originalJson(data);
    };

    next();
  };
};

export const clearCache = async (patterns = null) => {
  if (!redisClient.isOpen) {
    return;
  }

  try {
    if (patterns) {
      const keys = await redisClient.keys(patterns);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } else {
      await redisClient.flushDb();
    }
  } catch (error) {
  }
};

export const invalidateCache = async (pattern) => {
  if (!redisClient.isOpen) {
    return;
  }

  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
  }
};
