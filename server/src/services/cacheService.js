// Cache Service using Upstash Redis
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// Default cache TTL (Time To Live) in seconds
const DEFAULT_TTL = 300; // 5 minutes

export const cacheService = {
  /**
   * Lấy value từ cache
   */
  async get(key) {
    try {
      const response = await fetch(`${REDIS_URL}/get/${key}`, {
        headers: {
          Authorization: `Bearer ${REDIS_TOKEN}`,
        },
      });

      if (!response.ok) return null;

      const data = await response.json();
      return data.result ? JSON.parse(data.result) : null;
    } catch (error) {
      console.error('Cache GET Error:', error);
      return null;
    }
  },

  /**
   * Lưu value vào cache
   */
  async set(key, value, ttl = DEFAULT_TTL) {
    try {
      const response = await fetch(`${REDIS_URL}/set/${key}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${REDIS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ex: ttl,
          get: false,
        }),
        // Dữ liệu được gửi trong body
      });

      // Upstash sử dụng cách khác - gửi dữ liệu trong path
      // Thử lại với cách này
      const encodedValue = encodeURIComponent(JSON.stringify(value));
      const setResponse = await fetch(
        `${REDIS_URL}/set/${key}/${encodedValue}?ex=${ttl}`,
        {
          headers: {
            Authorization: `Bearer ${REDIS_TOKEN}`,
          },
        }
      );

      return setResponse.ok;
    } catch (error) {
      console.error('Cache SET Error:', error);
      return false;
    }
  },

  /**
   * Xóa key từ cache
   */
  async delete(key) {
    try {
      const response = await fetch(`${REDIS_URL}/del/${key}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${REDIS_TOKEN}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Cache DELETE Error:', error);
      return false;
    }
  },

  /**
   * Xóa tất cả cache (flush)
   */
  async flush() {
    try {
      const response = await fetch(`${REDIS_URL}/flushdb`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${REDIS_TOKEN}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Cache FLUSH Error:', error);
      return false;
    }
  },

  /**
   * Helper: Lấy hoặc tạo cache (If not exists)
   * Nếu cache có → trả về cached value
   * Nếu cache không có → gọi fetcher function → save vào cache → trả về
   */
  async getOrSet(key, fetcher, ttl = DEFAULT_TTL) {
    // Thử lấy từ cache
    const cached = await this.get(key);
    if (cached) {
      console.log(`✅ Cache HIT for key: ${key}`);
      return cached;
    }

    console.log(`❌ Cache MISS for key: ${key}, fetching data...`);
    // Cache miss - gọi fetcher function
    const data = await fetcher();

    // Lưu vào cache
    await this.set(key, data, ttl);

    return data;
  },
};

export default cacheService;
