const cache = require('../utils/cache');
const logger = require('../utils/logger');

/**
 * Middleware to cache GET requests
 * @param {number} ttl - Time to live in seconds (default: 5 minutes)
 * @returns {Function} Express middleware function
 */
const cacheMiddleware = (ttl = 300) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = cache.generateCacheKey(req);
    
    try {
      // Try to get cached data
      const cachedData = await cache.get(key);
      
      if (cachedData !== null) {
        logger.debug(`Cache hit for key: ${key}`);
        return res.json(cachedData);
      }
      
      // If not in cache, override res.json to cache the response
      const originalJson = res.json;
      res.json = (body) => {
        // Cache the response
        cache.set(key, body, ttl).catch(err => {
          logger.error('Error setting cache:', err);
        });
        
        // Restore original json method
        res.json = originalJson;
        return res.json(body);
      };
      
      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next();
    }
  };
};

/**
 * Middleware to clear cache for a specific key or pattern
 * @param {string|RegExp} keyOrPattern - Cache key or pattern to clear
 * @returns {Function} Express middleware function
 */
const clearCache = (keyOrPattern) => {
  return async (req, res, next) => {
    try {
      // If a function is provided, call it with the request to get the key/pattern
      const key = typeof keyOrPattern === 'function' 
        ? keyOrPattern(req) 
        : keyOrPattern;
      
      if (key) {
        // If it's a RegExp, we'd need to scan all keys (not implemented here)
        // For now, we'll just handle string keys
        if (typeof key === 'string') {
          await cache.del(key);
          logger.debug(`Cleared cache for key: ${key}`);
        }
      }
      
      next();
    } catch (error) {
      logger.error('Error clearing cache:', error);
      next();
    }
  };
};

module.exports = {
  cacheMiddleware,
  clearCache
};
