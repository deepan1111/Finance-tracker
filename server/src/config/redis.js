// config/redis.js - Modified to not crash when Redis is unavailable
const redis = require('redis');

let client;

const connectRedis = async () => {
  try {
    // Skip Redis connection in development if not available
    if (process.env.NODE_ENV === 'development' && !process.env.REDIS_URL) {
      console.log('⚠️  Redis disabled for development');
      return;
    }

    client = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      retry_strategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      }
    });

    client.on('error', (err) => {
      console.error('Redis Client Error:', err.message);
      // Don't spam the console
    });

    client.on('connect', () => {
      console.log('✅ Connected to Redis');
    });

    await client.connect();
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    client = null; // Set to null so app continues without Redis
  }
};

const getRedisClient = () => client;

module.exports = { connectRedis, getRedisClient };