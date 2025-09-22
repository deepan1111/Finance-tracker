// middleware/cache.js
const { getRedisClient } = require('../config/redis');

// Cache middleware for dashboard endpoints
const cacheMiddleware = (duration = 300) => { // 5 minutes default
  return async (req, res, next) => {
    // Skip cache if Redis is not available
    const client = getRedisClient();
    if (!client) {
      return next();
    }

    try {
      // Create cache key based on user and endpoint
      const cacheKey = `dashboard:${req.user._id}:${req.originalUrl}`;
      
      // Check for cached data
      const cachedData = await client.get(cacheKey);
      
      if (cachedData) {
        console.log(`Cache HIT for ${cacheKey}`);
        return res.json(JSON.parse(cachedData));
      }

      console.log(`Cache MISS for ${cacheKey}`);
      
      // Store original res.json function
      const originalJson = res.json;
      
      // Override res.json to cache the response
      res.json = function(data) {
        // Cache the response
        client.setex(cacheKey, duration, JSON.stringify(data)).catch(err => {
          console.error('Cache set error:', err);
        });
        
        // Call original json function
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next(); // Continue without caching
    }
  };
};

// Cache invalidation helper
const invalidateUserCache = async (userId) => {
  const client = getRedisClient();
  if (!client) return;

  try {
    const pattern = `dashboard:${userId}:*`;
    const keys = await client.keys(pattern);
    
    if (keys.length > 0) {
      await client.del(keys);
      console.log(`Invalidated ${keys.length} cache keys for user ${userId}`);
    }
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
};

module.exports = { cacheMiddleware, invalidateUserCache };