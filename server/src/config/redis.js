import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isDevelopment = nodeEnv === 'development';

const redisConfig = {
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        return new Error('Max retries reached');
      }
      return retries * 50;
    },
  },
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0'),
};

const redisClient = createClient(redisConfig);

let isRedisConnected = false;

redisClient.on('error', (err) => {
  isRedisConnected = false;
  if (!isDevelopment) {
    console.error('[Redis Error]', err.message);
  }
});

redisClient.on('connect', () => {
  isRedisConnected = true;
});

redisClient.on('disconnect', () => {
  isRedisConnected = false;
});

redisClient.on('end', () => {
  isRedisConnected = false;
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    isRedisConnected = false;
    if (!isDevelopment) {
      console.error('[Redis Connect Error]', err.message);
      process.exit(1);
    }
  }
};

connectRedis().catch((err) => {
  if (!isDevelopment) {
    console.error('[Redis Startup Error]', err.message);
    process.exit(1);
  }
});

export default redisClient;
export { isRedisConnected, connectRedis };
