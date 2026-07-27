import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || 6379),
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.log('Max Redis retries reached');
        return new Error('Max retries reached');
      }
      return retries * 50;
    },
  },
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || 0),
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis connected'));
redisClient.on('ready', () => console.log('Redis ready'));

await redisClient.connect().catch(err => {
  console.warn('Redis connection failed:', err.message);
});

export default redisClient;
